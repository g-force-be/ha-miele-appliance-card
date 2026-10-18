// custom:miele-programmes-card — start a programme on a Miele appliance from the phone. Favourites as tiles, the rest
// of the appliance's list under them; a tap opens a small sheet (temperature and time for ovens) that asks once more
// before anything starts. Greyed out with the reason while "Start op afstand" is off or the appliance is busy.
//
//   type: custom:miele-programmes-card
//   device_id: 82ddfc7a…            or  entity: sensor.miele_washing_machine
//   name: Wasmachine                (default: the name you gave the device, else its type)
//   programs: [cottons, eco_40_60]  favourites, by Home Assistant's programme key or Miele's number; default per type
//   show_all: true                  false shows only the favourites
//   collapsed: false                true starts folded to one line ("Programma's"), a tap opens it
//   show_name: false                true adds the appliance to that line ("Programma's · Stoomoven")
//   theme: dark                     dark | light | auto | ha
//   accent: "#4fa3e0"
//   language: nl
import { MieleTracker, describeDevice, scanDevices, readSnapshot, oldIntegration } from "../miele-model.js";
import { now } from "../clock.js";
import { t, languageOf, mieleLabel } from "../i18n/index.js";
import { BASE_CSS } from "../ui/styles.js";
import { ACCENTS } from "../drawings/index.js";
import { duration, clockTime, temp } from "../ui/format.js";
import { callService, errorText } from "../ui/call.js";
import {
  FAVOURITES, readPrograms, arrange, startBlock, canPrepare, defaultsFor, stepTime, startCall, isMicrowave, iconFor,
  readCache, writeCache, readLast, writeLast,
} from "../programs.js";

const FRESH = 6 * 3600e3, RETRY = 10 * 60e3;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = () => { try { return globalThis.localStorage ?? null; } catch { return null; } };
// a cooking time the way you'd say it: "2 min", "1:30 u"
const minutes = (min, lang) => min < 60 ? `${min} min` : `${duration(min * 60)} ${lang === "nl" ? "u" : "h"}`;

// One answer per appliance for every card on the page: { at, response, failedAt, error, pending }
const LISTS = new Map();

const PROG_CSS = `
.why { display: flex; gap: 8px; align-items: flex-start; margin: 0 0 10px; padding: 9px 11px; border-radius: 12px;
  font-size: 13.5px; line-height: 1.35; background: var(--mc-btn); color: var(--mc-muted); }
.why ha-icon { --mdc-icon-size: 18px; flex: none; margin-top: 1px; }
.why:empty { display: none; }
.remote-on .pill { background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); }
/* two columns on a phone: room for "Kreukherstellend" and "QuickPowerWash" without breaking them */
.tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(136px, 1fr)); gap: 8px; }
.tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 8px;
  min-height: 72px; padding: 10px 12px; text-align: left; font: 600 13.5px/1.25 inherit; font-family: inherit; color: var(--mc-fg);
  background: var(--mc-btn); border: 1px solid var(--mc-line); border-radius: 14px; cursor: pointer;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.tile ha-icon { --mdc-icon-size: 22px; color: var(--c); }
.tile span { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere;
  -webkit-hyphens: auto; hyphens: auto; }
.tile:active { background: color-mix(in srgb, var(--c) 22%, var(--mc-btn)); }
.tile.sel { border-color: var(--c); background: color-mix(in srgb, var(--c) 16%, var(--mc-btn)); }
.tile.now { border-color: color-mix(in srgb, var(--c) 60%, transparent); }
.tile.now::after { content: ""; position: absolute; top: 11px; right: 11px; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
.tile:disabled { cursor: default; opacity: .45; }
.tile.now:disabled { opacity: 1; }
.tile:disabled:active { background: var(--mc-btn); }
.more { display: flex; align-items: center; gap: 4px; margin: 10px 0 0; padding: 6px 2px; font: 600 13.5px/1 inherit; font-family: inherit;
  color: var(--mc-muted); background: none; border: 0; cursor: pointer; }
.more ha-icon { --mdc-icon-size: 18px; }
#rest { margin-top: 8px; }
.sheet { margin: 0 0 12px; padding: 12px; border-radius: 14px; background: var(--mc-panel); color: var(--mc-panel-fg);
  border: 1px solid color-mix(in srgb, var(--c) 50%, transparent); }
.sh-t { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 16px; }
.sh-t ha-icon { --mdc-icon-size: 22px; color: var(--c); }
.field { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px 10px; margin-top: 12px; font-size: 13.5px; }
.field .k { color: var(--mc-muted); }
.field .v { font-weight: 600; font-size: 17px; font-variant-numeric: tabular-nums; }
.field input[type=range] { grid-column: 1 / -1; width: 100%; margin: 2px 0 0; accent-color: var(--c); }
.step { display: inline-flex; align-items: center; gap: 10px; }
.step button { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; padding: 0;
  color: var(--mc-fg); background: var(--mc-btn); border: 1px solid var(--mc-line); border-radius: 50%; cursor: pointer;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.step button ha-icon { --mdc-icon-size: 18px; }
.step .v { min-width: 4.2em; text-align: center; }
.step .v small { display: block; font-weight: 400; font-size: 11.5px; color: var(--mc-muted); }
.q { margin: 14px 0 0; font-size: 13.5px; line-height: 1.35; }
.acts { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 10px; }
.acts button { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 16px; font: 600 14px/1 inherit; font-family: inherit;
  color: var(--mc-fg); background: var(--mc-btn); border: 1px solid var(--mc-line); border-radius: 999px; cursor: pointer;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.acts .go { background: var(--c); border-color: transparent; color: #fff; }
.acts .go:disabled { opacity: .45; cursor: default; }
.acts button ha-icon { --mdc-icon-size: 18px; }
.ok { font-size: 13px; color: var(--ok); margin: 0 0 10px; }
.ok:empty { display: none; }
.src { margin: 10px 0 0; font-size: 12px; color: var(--mc-muted); }
.src:empty { display: none; }
.err { margin: 0 0 10px; }
.fold .head { margin: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.fold .head .name { font-size: 15px; flex: 1 1 auto; min-width: 0; }
.fold .head .pill { max-width: 46%; }
.fold .head ha-icon { --mdc-icon-size: 20px; color: var(--mc-muted); flex: none; }
.fold:not(.open) > :not(.head) { display: none; }
.fold.open .head { margin-bottom: 10px; }
`;

export class MieleProgrammesCard extends HTMLElement {
  static getConfigElement() { return document.createElement("miele-programmes-card-editor"); }
  static getStubConfig(hass) {
    const d = scanDevices(hass).find(x => x.family.group !== "drawer") ?? scanDevices(hass)[0];
    return d ? { device_id: d.id } : {};
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { theme: "dark", show_all: true, ...config };
    this._dev = null;
    if (this._hass) this._init();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (!this._dev) this._init();
    if (!this._dev) return;
    const ids = Object.values(this._dev.roles);
    if (first || ids.some(id => hass.states[id] !== this._seen?.[id])) {
      this._seen = Object.fromEntries(ids.map(id => [id, hass.states[id]]));
      this._update();
    }
  }

  connectedCallback() { if (this._hass && !this._dev) this._init(); }
  getCardSize() { return this._config?.collapsed ? 1 : 6; }
  getGridOptions() { return { columns: 12, min_columns: 4, rows: "auto" }; }

  get _lang() { return languageOf(this._hass, this._config); }
  _t(key, vars) { return t(this._lang, key, vars); }

  _init() {
    if (!this._config || !this._hass) return;
    const c = this._config, h = this._hass;
    const id = c.device_id || (c.entity ? h.entities?.[c.entity]?.device_id : null) || scanDevices(h)[0]?.id;
    const dev = id ? describeDevice(h, id, { overrides: c.entities }) : null;
    if (!dev || !dev.roles.status) { this._dev = null; this._buildEmpty(); return; }
    this._dev = dev;
    this._tracker = new MieleTracker(dev.family);
    this._seen = null;
    this._pick = null;
    this._showAll = false;
    this._open = !this._config.collapsed;
    this._sig = null;
    h.loadBackendTranslation?.("entity", "miele")?.then?.(() => { this._sig = null; this._update(); });
    this._build();
    this._update();
  }

  _themeName() {
    const th = this._config.theme;
    if (th === "auto") return this._hass?.themes?.darkMode ? "dark" : "light";
    return ["dark", "light", "ha"].includes(th) ? th : "dark";
  }

  _buildEmpty() {
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${BASE_CSS}</style><ha-card class="theme-${this._themeName()}"><div class="err">${esc(this._t(oldIntegration(this._hass) ? "err.old_integration" : "err.no_device"))}</div></ha-card>`;
  }

  _build() {
    const c = this._config, fam = this._dev.family;
    const accent = c.accent || ACCENTS[fam.drawing] || ACCENTS.generic;
    this._name = c.name || this._hass.devices?.[this._dev.id]?.name_by_user || this._t(`kind.${fam.kind}`);
    this._inText = c.name || this._hass.devices?.[this._dev.id]?.name_by_user ? this._name : this._name.toLowerCase();
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${BASE_CSS}${PROG_CSS}</style>
<ha-card class="prog theme-${this._themeName()}${c.collapsed ? " fold" : ""}" lang="${esc(this._lang)}" style="--c:${esc(accent)}">
  <div class="head" id="head"><span class="name">${esc(c.collapsed ? (c.show_name ? `${this._t("prog.title")} · ${this._name}` : this._t("prog.title")) : this._name)}</span><span class="pill" id="pill"></span>${c.collapsed ? `<ha-icon id="fold" icon="mdi:chevron-down"></ha-icon>` : ""}</div>
  <div class="why" id="why"></div>
  <div class="ok" id="ok"></div>
  <div class="err" id="err"></div>
  <div class="sheet" id="sheet" hidden>
    <div class="sh-t"><ha-icon id="sh-i"></ha-icon><span id="sh-n"></span></div>
    <div class="field" id="f-temp"><span class="k">${esc(this._t("prog.temp"))}</span><span class="v" id="temp-v"></span>
      <input type="range" id="temp" aria-label="${esc(this._t("prog.temp"))}"></div>
    <div class="field" id="f-time"><span class="k">${esc(this._t("prog.time"))}</span>
      <span class="step"><button id="time-dn" aria-label="−"><ha-icon icon="mdi:minus"></ha-icon></button><span class="v" id="time-v"></span>
      <button id="time-up" aria-label="+"><ha-icon icon="mdi:plus"></ha-icon></button></span></div>
    <div class="q" id="q"></div>
    <div class="acts"><button id="no">${esc(this._t("btn.cancel"))}</button>
      <button class="go" id="go"><ha-icon id="go-i" icon="mdi:play"></ha-icon><span id="go-t"></span></button></div>
  </div>
  <div class="tiles" id="favs"></div>
  <button class="more" id="more" hidden><ha-icon icon="mdi:chevron-down"></ha-icon><span id="more-t"></span></button>
  <div class="tiles" id="rest" hidden></div>
  <div class="src" id="src"></div>
</ha-card>`;
    this._root = r.querySelector("ha-card");
    this._el = id => r.getElementById(id);
    this._text = {};
    const tap = e => { const b = e.target.closest(".tile"); if (b && !b.disabled) this._choose(this._tiles[Number(b.dataset.i)]); };
    this._el("favs").onclick = tap;
    if (c.collapsed) this._el("head").onclick = () => {
      this._open = !this._open;
      this._root.classList.toggle("open", this._open);
      this._el("fold").setAttribute("icon", this._open ? "mdi:chevron-up" : "mdi:chevron-down");
      if (!this._open) this._choose(null);
    };
    this._el("rest").onclick = tap;
    this._el("more").onclick = () => { this._showAll = !this._showAll; this._update(); };
    this._el("no").onclick = () => this._choose(null);
    this._el("go").onclick = () => this._start();
    this._el("temp").oninput = e => { this._values.temperature = Number(e.target.value); this._sheet(); };
    this._el("time-dn").onclick = () => this._stepTime(-1);
    this._el("time-up").onclick = () => this._stepTime(1);
  }

  _set(id, value) {
    if (this._text[id] === value) return;
    this._text[id] = value;
    const el = this._el(id);
    if (el) el.textContent = value;
  }
  _setHTML(id, html) {
    if (this._text[id] === html) return;
    this._text[id] = html;
    const el = this._el(id);
    if (el) el.innerHTML = html;
  }

  // --- the list: from memory, else fetched, else the browser's cache
  _options() {
    const so = this._hass.states[this._dev.roles.program];
    return Array.isArray(so?.attributes?.options) ? so.attributes.options : [];
  }

  _load(vm) {
    const dev = this._dev, id = dev.id, e = LISTS.get(id) ?? {};
    const ms = vm.flags?.mobileStart === true, turnedOn = ms && this._ms === false;
    this._ms = ms;
    if (dev.family.group === "drawer" || e.pending) return;
    const t = now();
    if (e.at && t - e.at < FRESH && !turnedOn) return;
    if (e.failedAt && t - e.failedAt < RETRY && !turnedOn) return;
    // washer and dryer only answer with "Start op afstand" on (400 otherwise): don't ask before
    if (dev.family.group === "laundry" && !ms) return;
    e.pending = this._hass.callService("miele", "get_programs", { device_id: id }, undefined, false, true)
      .then(r => { e.at = now(); e.response = r?.response ?? { programs: [] }; e.error = null; writeCache(store(), id, e.response, e.at); })
      .catch(async err => { e.failedAt = now(); e.error = await errorText(this._hass, err); })
      .finally(() => { e.pending = null; this._sig = null; this._update(); });
    LISTS.set(id, e);
  }

  _list() {
    if (this._dev.family.group === "drawer") return { list: [], cachedAt: null, error: null };
    const e = LISTS.get(this._dev.id), opts = this._options();
    if (e?.response) return { list: readPrograms(e.response, opts), cachedAt: null, error: null };
    const c = readCache(store(), this._dev.id);
    return { list: c ? readPrograms(c, opts) : null, cachedAt: c?.at ?? null, error: e?.error ?? null };
  }

  _label(p) {
    return p.key ? mieleLabel(this._hass, "program", p.key, this._lang) : p.name.replace(/^./, ch => ch.toUpperCase());
  }

  // --- rendering
  _update() {
    if (!this._dev || !this._root || !this._hass) return;
    const h = this._hass, dev = this._dev, fam = dev.family, lang = this._lang;
    const vm = this._vm = this._tracker.update(readSnapshot(h, dev.roles), now());
    this._load(vm);
    const { list, cachedAt, error } = this._list();
    const fav = this._config.programs ?? FAVOURITES[fam.drawing] ?? [];
    const { favs, rest } = arrange(list, fav);
    const block = this._block = startBlock(vm, fam, dev.roles, list);
    // start it, or (Start op afstand off, appliance on) set it up for Start on the appliance
    const mode = this._mode = !block ? "start" : canPrepare(block, vm, fam) ? "prepare" : null;
    const name = this._inText;

    const ms = vm.flags?.mobileStart === true;
    this._root.classList.toggle("remote-on", ms);
    this._set("pill", dev.roles.mobile_start ? this._t(ms ? "prog.remote_on" : "prog.remote_off") : this._t(`state.${vm.state}`));
    this._setHTML("why", block ? `<ha-icon icon="${block === "busy" ? "mdi:progress-clock" : "mdi:information-outline"}"></ha-icon><span>${esc(this._t(`prog.why.${mode === "prepare" && block === "mobile_start" ? "prepare" : block}`, { name, program: mieleLabel(h, "program", vm.program, lang) }))}</span>` : "");
    this._set("err", this._startErr || (error && ms && !list ? this._t("err.send", { msg: error }) : ""));
    this._set("src", cachedAt ? this._t("prog.cached", { when: `${new Date(cachedAt).toLocaleDateString(lang)} ${clockTime(cachedAt, h, lang)}` }) : "");

    // tiles: rebuilt only when the list, the labels or the favourites change
    const showAll = this._config.show_all !== false && rest.length > 0;
    const shown = showAll && (this._showAll || !favs.length) ? [...favs, ...rest] : favs;
    const sig = JSON.stringify([shown.map(p => [p.id, p.key, p.name]), favs.length, lang]);
    if (sig !== this._sig) {
      this._sig = sig;
      this._tiles = shown;
      const tile = (p, i) => `<button class="tile" data-i="${i}"><ha-icon icon="${iconFor(p, fam.group)}"></ha-icon><span>${esc(this._label(p))}</span></button>`;
      this._el("favs").innerHTML = shown.slice(0, favs.length || shown.length).map(tile).join("");
      this._el("rest").innerHTML = favs.length ? shown.slice(favs.length).map((p, i) => tile(p, i + favs.length)).join("") : "";
    }
    this._el("rest").hidden = !favs.length || !this._showAll;
    this._el("more").hidden = !showAll || !favs.length;
    this._set("more-t", this._t(this._showAll ? "prog.fewer" : "prog.all", { n: rest.length }));
    this._el("more").firstElementChild.setAttribute("icon", this._showAll ? "mdi:chevron-up" : "mdi:chevron-down");

    const moving = vm.state === "running" || vm.state === "paused";
    this._root.querySelectorAll(".tile").forEach(b => {
      const p = this._tiles[Number(b.dataset.i)];
      b.disabled = !mode || p.id == null;
      // the dot: running, or set and waiting for Start on the appliance
      b.classList.toggle("now", (moving || vm.state === "ready") && !!p.key && p.key === vm.program);
      b.classList.toggle("sel", p === this._pick);
    });
    if (this._pick && (!mode || !this._tiles.includes(this._pick))) this._choose(null);
    else if (this._pick) this._sheet();
  }

  _choose(p) {
    this._pick = p;
    this._set("ok", "");
    if (this._startErr) { this._startErr = ""; this._set("err", ""); }
    if (p) {
      const last = readLast(store(), this._dev.id, p.id);
      this._values = defaultsFor(p, last);
    }
    this._root.querySelectorAll(".tile").forEach(b => b.classList.toggle("sel", this._tiles[Number(b.dataset.i)] === p));
    this._el("sheet").hidden = !p;
    if (!p) return;
    const temp = this._el("temp");
    if (p.temp) Object.assign(temp, { min: p.temp.min, max: p.temp.max, step: p.temp.step, value: this._values.temperature });
    this._sheet();
    this._el("sheet").scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }

  _stepTime(dir) {
    const p = this._pick;
    if (!p?.dur) return;
    this._values.minutes = stepTime(this._values.minutes, dir, p.dur, !isMicrowave(p));
    this._sheet();
  }

  // the sheet for the chosen programme: its settings and the question that asks once more
  _sheet() {
    const p = this._pick, v = this._values, oven = this._dev.family.group === "oven", unit = this._vm?.temps?.unit;
    const label = this._label(p);
    this._el("sh-i").setAttribute("icon", iconFor(p, this._dev.family.group));
    this._set("sh-n", label);
    const slider = oven && p.temp && p.temp.max > p.temp.min;
    this._el("f-temp").hidden = !oven || !p.temp;
    this._el("temp").hidden = !slider;
    if (p.temp) this._set("temp-v", temp(v.temperature, unit));
    this._el("f-time").hidden = !oven || !p.dur;
    const none = !v.minutes;
    this._setHTML("time-v", none ? `${esc(this._t("prog.none"))}<small>${esc(this._t("prog.until_stop"))}</small>` : esc(minutes(v.minutes, this._lang)));
    const what = [label, oven && p.temp ? temp(v.temperature, unit) : null, oven && p.dur && v.minutes ? minutes(v.minutes, this._lang) : null].filter(Boolean).join(" · ");
    const name = this._inText;
    const prepare = this._mode === "prepare";
    this._set("q", this._t(prepare ? "prog.ask_prepare" : "prog.ask", { what, name }));
    this._set("go-t", this._t(prepare ? "prog.prepare" : "prog.start"));
    this._el("go-i").setAttribute("icon", prepare ? "mdi:tray-arrow-down" : "mdi:play");
    this._el("go").disabled = !this._mode || this._starting === true;
  }

  async _start() {
    const p = this._pick, dev = this._dev;
    const mode = this._mode;
    if (!p || !mode || this._starting) return;
    this._starting = true;
    this._el("go").disabled = true;
    this._startErr = "";
    this._set("err", "");
    const [domain, service, data] = startCall(dev.id, dev.family, p, this._values);
    const msg = await callService(this._hass, domain, service, data);
    this._starting = false;
    if (msg) { this._startErr = this._t("err.send", { msg }); this._set("err", this._startErr); this._el("go").disabled = !this._mode; return; }
    if (dev.family.group === "oven") writeLast(store(), dev.id, p.id, this._values);
    const label = this._label(p);
    this._choose(null);
    const name = this._inText;
    this._set("ok", this._t(mode === "prepare" ? "prog.prepared" : "prog.started", { program: label, name }));
  }
}
