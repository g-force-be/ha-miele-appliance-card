// Card harness: real cards on a mock hass, fed by replayed cycles.
// /dev/cards.html?c=<cycle>@<t>&c=<cycle>@<t>&theme=light|dark&finish=<finish>&lang=nl&cols=2&anim=full&controls=1&bar=0&play=1&speed=60
//   card=appliance|programmes|both   which card per cycle (default appliance)
//   card=overview&layout=rooms       one overview card over all cycles (layout: rooms | grid | active | phone | display)
//   set=<entity_id>:<state>          pin a state (e.g. "Start op afstand" on), repeatable
//   cache=seed                       programme lists already in the browser's cache, two days old (else the cache is emptied)
//   failstart=1                      miele.set_program answers 400
//   editor=1                         the first card's visual editor next to it (with a stand-in for ha-form), and its YAML
// All cards share one virtual clock: every cycle is shifted so its moment t falls on the same instant.
import * as mdi from "../node_modules/@mdi/js/mdi.js";
import { simulate, Player, resolveCycles, mergeRegistry } from "./replay.js";
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
const [peter, nl, en, fixtures, extra, synthetic, programs, demoRegistry, demoFixtures] = await Promise.all([
  getJSON("./data/peter-registry.json"), getJSON("./data/translations.nl.json"), getJSON("./data/translations.en.json"),
  getJSON("../docs/fixtures.json"), getJSON("./data/fixtures-extra.json"), getJSON("./data/fixtures-synthetic.json"), getJSON("./data/programs.json"),
  getJSON("./data/demo-registry.json"), getJSON("./data/fixtures-demo.json")]);
const cycles = resolveCycles([...fixtures.cycles, ...extra.cycles, ...synthetic.cycles, ...demoFixtures.cycles]);

const q = new URLSearchParams(location.search);
if (q.get("editor") === "1") await import("./ha-form-stub.js");
await import(q.get("dist") === "1" ? "../dist/miele-appliance-card.js" : "../src/index.js");   // ?dist=1 tests the bundle
const theme = q.get("theme") ?? "light", lang = q.get("lang") ?? "nl";
document.documentElement.dataset.theme = theme;
document.documentElement.style.setProperty("--cols", q.get("cols") ?? "1");
const entries = (q.getAll("c").length ? q.getAll("c") : ["washer_cottons_with_pause@1000"]).map(s => {
  const [id, t] = s.split("@");
  return { cycle: cycles[id], t: Number(t ?? 0) };
});

// Peter's appliances, plus the demo ones (other types and design lines) when asked or when a demo cycle plays
const registry = q.get("demo") === "1" || entries.some(e => e.cycle.deviceId?.startsWith("demo_")) ? mergeRegistry(peter, demoRegistry) : peter;

// One virtual instant for all cards: the first cycle's own time at its t.
const anchor = Date.parse(entries[0].cycle.start) + entries[0].t * 1000;
for (const e of entries) {
  const shifted = { ...e.cycle, start: new Date(anchor - e.t * 1000).toISOString() };
  e.sim = simulate(shifted, registry);
  e.player = new Player(e.sim, registry);
}
let virtual = anchor;
globalThis.__MIELE_NOW__ = () => virtual;

// ?set=light.miele_steam_oven_licht:on pins an entity's state, whatever the cycle says
const pinned = q.getAll("set").map(s => s.split(":"));
const states = () => {
  const all = Object.assign({}, ...entries.map(e => e.player.states));
  for (const [id, state] of pinned) all[id] = { ...(all[id] ?? { entity_id: id, attributes: {} }), state };
  return all;
};
const makeHass = () => createMockHass({ registry, translations: { nl, en }, states: states(), programs, failStart: q.get("failstart") === "1",
  language: lang, darkMode: theme === "dark", log: (...a) => console.log("[mock]", ...a) });

// the programmes card's cache in this browser: empty, or seeded with lists from two days ago
try {
  for (const k of Object.keys(localStorage)) if (k.startsWith("miele-programmes:")) localStorage.removeItem(k);
  if (q.get("cache") === "seed") for (const e of entries)
    localStorage.setItem(`miele-programmes:${e.sim.deviceId}`, JSON.stringify({ at: anchor - 2 * 86400e3, programs: programs[e.sim.deviceId] ?? [] }));
} catch { /* no storage */ }

const stage = document.getElementById("stage");
const kinds = { appliance: ["miele-appliance-card"], programmes: ["miele-programmes-card"], both: ["miele-appliance-card", "miele-programmes-card"] }[q.get("card") ?? "appliance"];
const overview = q.get("card") === "overview";
const cards = overview ? [(() => {
  const card = document.createElement("miele-overview-card");
  const cfg = { type: "custom:miele-overview-card", layout: q.get("layout") ?? "rooms", theme: q.get("cardtheme") ?? theme };
  if (q.get("anim")) cfg.animations = q.get("anim");
  card.setConfig(cfg);
  stage.append(card);
  return card;
})()] : entries.flatMap(e => kinds.map(tag => {
  const card = document.createElement(tag);
  const cfg = { type: `custom:${tag}`, device_id: e.sim.deviceId, theme: q.get("cardtheme") ?? theme,
    animations: q.get("anim") ?? "full", controls: q.get("controls") !== "0" };
  if (q.get("drawing")) cfg.drawing = q.get("drawing");
  if (q.get("finish")) cfg.finish = q.get("finish");
  if (q.get("design")) cfg.design = q.get("design");
  if (q.get("programs")) cfg.programs = q.get("programs").split(",");
  card.setConfig(cfg);
  stage.append(card);
  return card;
}));

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

if (q.get("editor") === "1") {
  const card = cards[0], type = card._config.type;
  const { toYaml } = await import("../src/ui/yaml.js");
  const ed = card.constructor.getConfigElement();
  const side = document.createElement("div"), yaml = document.createElement("pre");
  side.className = "editor";
  yaml.className = "yaml";
  const show = cfg => { yaml.textContent = toYaml({ type, ...cfg }); };
  const { type: _t, ...start } = card._config;
  ed.setConfig({ type, ...start });
  ed.hass = hass;
  ed.addEventListener("config-changed", e => { card.setConfig({ ...e.detail.config, type }); card.hass = hass; show(e.detail.config); });
  side.append(ed, yaml);
  stage.prepend(side);
  document.documentElement.style.setProperty("--cols", "2");
  show(start);
  await new Promise(r => setTimeout(r, 50));
}

// Ready for screenshots once the cards have rendered and the icons are drawn. ?pick=fan_plus opens that programme's sheet.
requestAnimationFrame(() => requestAnimationFrame(() => {
  const picks = q.getAll("pick");
  for (const c of cards) { const p = c._tiles?.find(x => picks.includes(x.key) || picks.includes(String(x.id))); if (p) c._choose(p); }
  document.body.dataset.ready = "1";
}));
