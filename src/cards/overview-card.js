// custom:miele-overview-card — every Miele appliance in one card, laid out by a preset (SPEC §8). It finds the
// appliances itself and places miele-appliance-card and miele-programmes-card elements:
//
//   type: custom:miele-overview-card
//   layout: rooms                   rooms | grid | active | phone | display
//   theme: dark                     passed on to the cards, like language, accent and animations
//   appliances:                     optional: order, names, colours, programmes; "Stel layout voor" in the editor fills it
//     - entity: sensor.miele_washing_machine
//       name: Wasmachine
//       finish: lotus_white
//       programmes: true
//       programs: [cottons, eco_40_60]
//     - entity: sensor.miele_warming_drawer
//       show: false
//
// rooms    per area: laundry side by side; built-ins as one column (steam oven, oven-microwave, drawer, like the
//          real wall) with the freestanding coffee machine next to it; programmes folded under each appliance
// grid     all appliances in a grid
// active   only appliances that are on, the busiest first
// phone    one column, smaller drawings, busiest first
// display  the kitchen screen: only what's on, no buttons, large countdown; a calm clock when everything is off
import { scanDevices, MieleTracker, readSnapshot, oldIntegration } from "../miele-model.js";
import { planLayout } from "../layout.js";
import { now } from "../clock.js";
import { t, languageOf } from "../i18n/index.js";
import { clockTime } from "../ui/format.js";

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const CSS = `
:host { display: block; }
.ov { container-type: inline-size; color: var(--primary-text-color, inherit);
  font-family: var(--ha-font-family-body, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif); }
.blocks { display: flex; flex-wrap: wrap; gap: 20px 24px; align-items: flex-start; }
/* a room is no wider than its appliances side by side (--n), so rooms sit together on a wide screen */
.room { flex: 1 1 320px; min-width: 0; max-width: calc(var(--n, 2) * 460px + (var(--n, 2) - 1) * 12px); }
.set { flex: 1 1 100%; min-width: 0; }
.set .part { flex: 1 1 100%; }
.room h2 { margin: 0 0 10px 2px; font-size: 18px; font-weight: 500; line-height: 1.3; }
.parts { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
.part { min-width: 0; }
.part.row { flex: 2 1 300px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
.part.row > .item { flex: 1 1 300px; max-width: 460px; min-width: min(100%, 280px); }
/* a built-in wall: the appliances close together, their programmes under the column */
.part.column { flex: 1 1 320px; max-width: 460px; display: flex; flex-direction: column; gap: 6px; }
.part.column .progs { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.part.grid { flex: 1 1 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 12px; align-items: start; }
.preset-phone .part.column { max-width: none; gap: 12px; }
.preset-display .part.grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); }
.item { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.quiet { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 32px 16px; text-align: center;
  border-radius: var(--ha-card-border-radius, 16px); background: var(--ha-card-background, var(--card-background-color, #232528)); }
.quiet .clock { font-size: 72px; font-weight: 300; line-height: 1; font-variant-numeric: tabular-nums; }
.quiet .msg { font-size: 16px; color: var(--secondary-text-color, #9ca1a7); }
.quiet .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 4px; }
.quiet .chips span { font-size: 13px; padding: 4px 10px; border-radius: 999px; background: var(--secondary-background-color, #33363a);
  color: var(--secondary-text-color, #9ca1a7); }
.empty { padding: 16px; color: var(--secondary-text-color, #9ca1a7); }
[hidden] { display: none !important; }
`;

export class MieleOverviewCard extends HTMLElement {
  static getStubConfig() { return { layout: "rooms" }; }
  static getConfigElement() { return document.createElement("miele-overview-card-editor"); }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { layout: "rooms", ...config };
    this._sig = null;
    if (this._hass) this._update();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first || hass.entities !== this._entities || hass.devices !== this._devicesRef) {
      this._entities = hass.entities;
      this._devicesRef = hass.devices;
      this._devices = scanDevices(hass);
      this._trackers = new Map(this._devices.map(d => [d.id, this._trackers?.get(d.id) ?? new MieleTracker(d.family)]));
    }
    this._update();
    for (const el of this._cards?.values() ?? []) el.hass = hass;
  }

  connectedCallback() {
    clearInterval(this._tick);
    // the active presets change when a hold runs out, and the quiet clock moves
    this._tick = setInterval(() => this._update(), 30e3);
  }
  disconnectedCallback() { clearInterval(this._tick); }
  getCardSize() { return 12; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }

  get _lang() { return languageOf(this._hass, this._config); }

  _states() {
    const out = {};
    for (const d of this._devices) out[d.id] = this._trackers.get(d.id).update(readSnapshot(this._hass, d.roles), now()).state;
    return out;
  }

  _update() {
    if (!this._config || !this._hass || !this._devices) return;
    const plan = this._plan = planLayout(this._devices, this._config, this._states(), { areas: this._hass.areas, hass: this._hass });
    const sig = JSON.stringify([plan.preset, plan.quiet, plan.blocks.map(b => [b.title, (b.parts ?? [b]).map(p => [p.kind, p.items.map(i => [i.appliance, i.programmes])])])]);
    if (sig !== this._sig) { this._sig = sig; this._render(plan); }
    if (plan.quiet) this._quiet();
  }

  // One element per card config, kept across re-renders: moving a card keeps its animations running.
  _card(cfg) {
    const key = JSON.stringify(cfg);
    let el = this._cards.get(key);
    if (!el) {
      el = document.createElement(cfg.type.replace(/^custom:/, ""));
      el.setConfig(cfg);
      el.hass = this._hass;
      this._cards.set(key, el);
    }
    this._used.add(key);
    return el;
  }

  _render(plan) {
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    this._cards ??= new Map();
    this._used = new Set();
    const root = document.createElement("div");
    root.className = `ov preset-${plan.preset}`;
    if (!this._devices.length) {
      root.innerHTML = `<div class="empty">${esc(t(this._lang, oldIntegration(this._hass) ? "err.old_integration" : "err.no_device"))}</div>`;
    } else if (plan.quiet) {
      root.innerHTML = `<div class="quiet"><div class="clock" id="clock"${plan.preset === "display" ? "" : " hidden"}></div>
        <div class="msg">${esc(t(this._lang, "ov.all_off"))}</div><div class="chips" id="chips"></div></div>`;
    } else {
      const blocks = document.createElement("div");
      blocks.className = "blocks";
      for (const b of plan.blocks) {
        const block = document.createElement("section");
        block.className = b.kind === "room" ? "room" : "set";
        if (b.parts) block.style.setProperty("--n", b.parts.reduce((n, p) => n + (p.kind === "column" ? 1 : p.items.length), 0));
        if (b.title) block.innerHTML = `<h2>${esc(b.title)}</h2>`;
        const parts = document.createElement("div");
        parts.className = "parts";
        for (const p of b.parts ?? [b]) {
          const part = document.createElement("div");
          part.className = `part ${p.kind}`;
          // a built-in column keeps its appliances together and puts their programmes underneath
          const wall = b.kind === "room" && p.kind === "column";
          const progs = document.createElement("div");
          progs.className = "progs";
          for (const it of p.items) {
            const item = document.createElement("div");
            item.className = "item";
            item.append(this._card(it.appliance));
            if (it.programmes) (wall ? progs : item).append(this._card(it.programmes));
            part.append(item);
          }
          if (wall && progs.childElementCount) part.append(progs);
          parts.append(part);
        }
        block.append(parts);
        blocks.append(block);
      }
      root.append(blocks);
    }
    for (const key of [...this._cards.keys()]) if (!this._used.has(key)) this._cards.delete(key);
    if (!r.firstChild) r.innerHTML = `<style>${CSS}</style>`;
    r.querySelector(".ov")?.remove();
    r.append(root);
  }

  // Everything off: the time (on the kitchen display) and the appliances, quietly.
  _quiet() {
    const r = this.shadowRoot, lang = this._lang;
    const clock = r?.getElementById("clock"), chips = r?.getElementById("chips");
    if (clock) clock.textContent = clockTime(now(), this._hass, lang);
    if (chips) chips.innerHTML = this._devices.map(d => `<span>${esc(this._hass.devices?.[d.id]?.name_by_user || t(lang, `kind.${d.family.kind}`))}</span>`).join("");
  }
}
