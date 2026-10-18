// Card harness: real cards on a mock hass, fed by replayed cycles.
// /dev/cards.html?c=<cycle>@<t>&c=<cycle>@<t>&theme=light|dark&finish=<finish>&lang=nl&cols=2&anim=full&controls=1&bar=0&play=1&speed=60
// All cards share one virtual clock: every cycle is shifted so its moment t falls on the same instant.
import * as mdi from "../node_modules/@mdi/js/mdi.js";
import { simulate, Player } from "./replay.js";
import { createMockHass } from "./mock-hass.js";

// Stand-in for Home Assistant's <ha-icon>: draws the Material Design icon named in `icon`.
if (!customElements.get("ha-icon")) customElements.define("ha-icon", class extends HTMLElement {
  static get observedAttributes() { return ["icon"]; }
  attributeChangedCallback() { this._draw(); }
  connectedCallback() { this._draw(); }
  _draw() {
    const name = (this.getAttribute("icon") || "").replace(/^mdi:/, "").replace(/-(\w)/g, (m, c) => c.toUpperCase());
    const path = mdi["mdi" + name.charAt(0).toUpperCase() + name.slice(1)] ?? "";
    this.style.display = "inline-flex";
    const size = "var(--mdc-icon-size, 24px)";
    this.innerHTML = `<svg viewBox="0 0 24 24" style="width:${size};height:${size};fill:currentColor;display:block"><path d="${path}"/></svg>`;
  }
});

const getJSON = p => fetch(p).then(r => r.json());
const [registry, nl, en, fixtures, extra, synthetic] = await Promise.all([
  getJSON("./data/peter-registry.json"), getJSON("./data/translations.nl.json"), getJSON("./data/translations.en.json"),
  getJSON("../docs/fixtures.json"), getJSON("./data/fixtures-extra.json"), getJSON("./data/fixtures-synthetic.json")]);
const cycles = Object.fromEntries([...fixtures.cycles, ...extra.cycles, ...synthetic.cycles].map(c => [c.id, c]));

const q = new URLSearchParams(location.search);
await import(q.get("dist") === "1" ? "../dist/miele-appliance-card.js" : "../src/index.js");   // ?dist=1 tests the bundle
const theme = q.get("theme") ?? "light", lang = q.get("lang") ?? "nl";
document.documentElement.dataset.theme = theme;
document.documentElement.style.setProperty("--cols", q.get("cols") ?? "1");
const entries = (q.getAll("c").length ? q.getAll("c") : ["washer_cottons_with_pause@1000"]).map(s => {
  const [id, t] = s.split("@");
  return { cycle: cycles[id], t: Number(t ?? 0) };
});

// One virtual instant for all cards: the first cycle's own time at its t.
const anchor = Date.parse(entries[0].cycle.start) + entries[0].t * 1000;
for (const e of entries) {
  const shifted = { ...e.cycle, start: new Date(anchor - e.t * 1000).toISOString() };
  e.sim = simulate(shifted, registry);
  e.player = new Player(e.sim, registry);
}
let virtual = anchor;
globalThis.__MIELE_NOW__ = () => virtual;

const states = () => Object.assign({}, ...entries.map(e => e.player.states));
const makeHass = () => createMockHass({ registry, translations: { nl, en }, states: states(), language: lang, darkMode: theme === "dark",
  log: (...a) => console.log("[mock]", ...a) });

const stage = document.getElementById("stage");
const cards = entries.map(e => {
  const card = document.createElement("miele-appliance-card");
  const cfg = { type: "custom:miele-appliance-card", device_id: e.sim.deviceId, theme: q.get("cardtheme") ?? theme,
    animations: q.get("anim") ?? "full", controls: q.get("controls") !== "0" };
  if (q.get("finish")) cfg.finish = q.get("finish");
  card.setConfig(cfg);
  stage.append(card);
  return card;
});

// Warm up: play every cycle up to its moment in 5 s steps, so the cards' trackers have seen the history
// (pauses, dryness reached) as they would on a dashboard that was open all along.
let hass;
const longest = Math.max(...entries.map(e => e.t + 1));
for (let back = Math.ceil(longest / 5) * 5; back >= 0; back -= 5) {
  virtual = anchor - back * 1000;
  for (const e of entries) e.player.seek(Math.max(-1, e.t - back));
  hass = makeHass();
  for (const c of cards) c.hass = hass;
}
virtual = anchor;
for (const e of entries) e.player.seek(e.t);
hass = makeHass();
for (const c of cards) { c.hass = hass; c._update?.(); }

const bar = document.getElementById("bar");
bar.hidden = q.get("bar") === "0";
const show = () => { bar.textContent = entries.map(e => `${e.cycle.id} @ ${Math.round(e.player.t)} s`).join("  ·  "); };
show();

if (q.get("play") === "1") {
  const speed = Number(q.get("speed") ?? 60);
  let last = performance.now();
  setInterval(() => {
    const dt = (performance.now() - last) / 1000 * speed; last = performance.now();
    virtual += dt * 1000;
    for (const e of entries) e.player.seek(e.player.t + dt);
    hass = makeHass();
    for (const c of cards) c.hass = hass;
    show();
  }, 250);
}

// Ready for screenshots once the cards have rendered and the icons are drawn.
requestAnimationFrame(() => requestAnimationFrame(() => { document.body.dataset.ready = "1"; }));
