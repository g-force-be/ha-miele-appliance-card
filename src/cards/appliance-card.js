// custom:miele-appliance-card — one Miele appliance: drawing, progress ring, the appliance's display, phase, details
// and controls with a confirmation bar. Structure after hon-appliance-card (My Media Build, MIT): build the DOM once,
// then only swap classes and text, so running animations never restart.
//
//   type: custom:miele-appliance-card
//   device_id: 82ddfc7a…            or  entity: sensor.miele_washing_machine
//   name: Wasmachine                (default: the name you gave the device, else its type)
//   finish: lotus_white             lotus_white | obsidian_black | graphite_grey | brilliant_white | pearl_beige | clean_steel | "#hex"
//   theme: dark                     dark | light | auto | ha
//   animations: full                full | reduced | off
//   controls: true                  false hides pause/stop/power (kitchen display)
//   big_countdown: false            true shows the time left in large type above the drawing (kitchen display)
//   accent: "#4fa3e0"               ring and highlight colour
//   language: nl                    default: Home Assistant's language
//   max_width: 400px
//   drawing: generic               another drawing: washer | dryer | steam_oven | microwave | coffee | drawer | generic
//   design: white                  another design line of the drawing (door colour, PureLine/VitroLine, …); default from the type number
//   images: /local/miele/           own pictures: <drawing>.svg (washer.svg, dryer.svg, …)
//   entities: { remaining: sensor.x }   override a detected role
import { MieleTracker, describeDevice, readSnapshot, scanDevices, oldIntegration, plateLevel, DRY_LADDER } from "../miele-model.js";
import { now } from "../clock.js";
import { t, languageOf, mieleLabel } from "../i18n/index.js";
import { drawingFor, designOf, DRAWINGS, ACCENTS } from "../drawings/index.js";
import { finishPalette, finishVars } from "../drawings/finish.js";
import { CARD_CSS } from "../ui/styles.js";
import { countdown, duration, clockTime, temp } from "../ui/format.js";
import { sevenSeg } from "../ui/sevenseg.js";
import { callService } from "../ui/call.js";

// The four drinks tiles of the CM 7750's start screen ("Dranken").
const DRINK_TILES = `<svg viewBox="0 0 100 62" aria-hidden="true"><g fill="#c4cad0">
  <rect x="2" y="2" width="47" height="28" rx="2.5"/><rect x="51" y="2" width="47" height="28" rx="2.5"/>
  <rect x="2" y="32" width="47" height="28" rx="2.5"/><rect x="51" y="32" width="47" height="28" rx="2.5"/></g>
  <g fill="none" stroke="#3b4148" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 11 h8 v7 a4 4 0 0 1 -8 0 Z M29 13 h2 a2 2 0 0 1 0 4 h-2"/><path d="M69 11 h12 v6 a6 6 0 0 1 -12 0 Z M81 13 h2 a2 2 0 0 1 0 4 h-2"/>
  <path d="M19 41 h12 v7 a6 6 0 0 1 -12 0 Z M31 43 h2 a2 2 0 0 1 0 4 h-2 M21 39 c1 -2 3 -2 4 0"/><path d="M71 39 h8 l-1 14 h-6 Z M72 46 h6"/></g></svg>`;
const LOCK = `<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M3 6 V4.2 a3 3 0 0 1 6 0 V6" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="1.2" y="6" width="9.6" height="7" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8.6 v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
const hm = sec => duration(Math.ceil(Math.max(0, sec) / 60) * 60);   // whole minutes up, like the appliance

const LADDER = DRY_LADDER.filter(k => k !== "hand_iron");
// What each kind of display holds; _display() fills it in.
const DISPLAY_MARKUP = {
  basic: `<span class="t" id="lcd-t"></span><span class="s" id="lcd-s"></span>`,
  line: `<span class="lk" id="lcd-k"></span><span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span>`,
  seg: `<span class="lad" id="lcd-l"></span><span class="sg" id="lcd-t"></span>`,
  oven: `<span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span><span class="cur" id="lcd-s"></span>`,
  menu: `<span class="hd"><span id="lcd-l"></span><span id="lcd-k"></span></span><span class="bd" id="lcd-t"></span>`,
  zones: `<span class="zt" id="lcd-t"></span>`,
  hood: `<span class="hb" id="lcd-t"></span>`,
  cool: `<span class="ct" id="lcd-t"></span>`,
  robot: `<span class="t" id="lcd-t"></span>`,
};
// the hood's fan level 1–4 (HA's fan entity in steps of 25 %), 0 when it is off
// zone temperatures (fridge, freezer, wine): the measured ones, else what the thermostats report
const coolTemps = snap => {
  const sensors = [snap.temp, snap.temp2, snap.temp3].filter(t => t != null);
  return sensors.length ? sensors : (snap.thermo ?? []).map(z => z.current).filter(t => t != null);
};
const fanLevel = snap => snap.fan?.on ? Math.max(1, Math.min(4, Math.ceil(snap.fan.pct / 25))) : 0;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let uid = 0;

export class MieleApplianceCard extends HTMLElement {
  static getConfigElement() { return document.createElement("miele-appliance-card-editor"); }
  static getStubConfig(hass) {
    const d = scanDevices(hass)[0];
    return d ? { device_id: d.id } : {};
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { theme: "dark", animations: "full", controls: true, ...config };
    this._dev = null;             // resolve the device again with the new config
    if (this._hass) this._init();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (!this._dev) this._init();
    if (!this._dev) return;
    // Home Assistant sets hass on every state change anywhere; only react to this appliance's entities
    const ids = Object.values(this._dev.roles);
    if (first || ids.some(id => hass.states[id] !== this._seen?.[id])) {
      this._seen = Object.fromEntries(ids.map(id => [id, hass.states[id]]));
      this._update();
    }
  }

  connectedCallback() {
    clearInterval(this._tick);
    this._tick = setInterval(() => this._update(), 1000);
    if (this._hass && !this._dev) this._init();
  }
  disconnectedCallback() { clearInterval(this._tick); }
  getCardSize() { return 9; }
  getGridOptions() { return { columns: 12, min_columns: 4, rows: "auto" }; }

  _deviceId() {
    const c = this._config, h = this._hass;
    if (c.device_id) return c.device_id;
    if (c.entity) return h.entities?.[c.entity]?.device_id ?? null;
    return scanDevices(h)[0]?.id ?? null;
  }

  _init() {
    if (!this._config || !this._hass) return;
    const id = this._deviceId();
    const dev = id ? describeDevice(this._hass, id, { overrides: this._config.entities }) : null;
    if (!dev || !dev.roles.status) { this._dev = null; this._buildEmpty(); return; }
    this._dev = dev;
    this._tracker = new MieleTracker(dev.family);
    this._seen = null;
    this._hass.loadBackendTranslation?.("entity", "miele")?.then?.(() => this._update(true));
    this._build();
    this._update(true);
  }

  get _lang() { return languageOf(this._hass, this._config); }
  _t(key, vars) { return t(this._lang, key, vars); }

  _buildEmpty() {
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${CARD_CSS}</style><ha-card class="theme-${this._themeName()}"><div class="err">${esc(this._t(oldIntegration(this._hass) ? "err.old_integration" : "err.no_device"))}</div></ha-card>`;
  }

  _themeName() {
    const th = this._config.theme;
    if (th === "auto") return this._hass?.themes?.darkMode ? "dark" : "light";
    return ["dark", "light", "ha"].includes(th) ? th : "dark";
  }

  _build() {
    const c = this._config, dev = this._dev, fam = dev.family;
    const draw = this._draw = DRAWINGS[c.drawing] ? c.drawing : fam.drawing;
    const modelId = this._hass.devices?.[dev.id]?.model_id ?? dev.modelId;
    const design = this._design = designOf(draw, c.design, modelId);
    const d = drawingFor(draw, design, modelId), g = d.geom, u = `mc${++uid}`;
    this._geom = g;
    const style = this._style = d.display ?? "basic";
    const palette = finishPalette(c.finish, d.finish ?? fam.finish);
    const accent = c.accent || ACCENTS[draw] || ACCENTS.generic;
    const name = this._name = c.name || this._hass.devices?.[dev.id]?.name_by_user || this._t(`kind.${fam.kind}`);
    // in a sentence: "on the washing machine", but a name you gave stays as you wrote it
    this._inText = c.name || this._hass.devices?.[dev.id]?.name_by_user ? name : name.toLowerCase();
    const icons = g.icons.at.map(([x, y], i) => `<div class="at icon" id="ic${i}" style="left:${x}%;top:${y}%;width:${g.icons.size}%"><ha-icon></ha-icon></div>`).join("");
    const w = g.window, round = w.d != null;
    const win = round ? `class="at glass round" style="left:${w.x}%;top:${w.y}%;width:${w.d}%"`
      : `class="glass box" style="left:${w.left}%;top:${w.top}%;width:${w.width}%;height:${w.height}%;border-radius:${w.radius}"`;
    const rows = [0, 1, 2, 3].map(i => `<div class="row"><span class="k" id="k${i}"></span><span class="v" id="v${i}"></span></div>`).join("");
    const p = g.panel;
    const panel = p ? `<div class="panel over" style="left:${p.left}%;right:${p.right}%;top:${p.top}%;bottom:${p.bottom}%">${rows}</div>`
      : `<div class="panel below">${rows}</div>`;
    const art = c.images ? `<img src="${esc(String(c.images).replace(/\/?$/, "/") + fam.drawing + ".svg")}" alt="">` : d.svg(u);
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${CARD_CSS}</style>
<ha-card class="${draw} g-${fam.group} ${round ? "round" : "flat"} theme-${this._themeName()} anim-${["full", "reduced", "off"].includes(c.animations) ? c.animations : "full"}"
  style="--c:${esc(accent)};${finishVars(palette)}${c.max_width || d.maxWidth ? `;--maxw:${esc(c.max_width || d.maxWidth)}` : ""}">
  <div class="head"><span class="name">${esc(name)}</span><span class="pill" id="pill"></span></div>
  <div class="bigtime" id="bigtime" hidden><span class="bt" id="bt"></span><span class="bs" id="bs"></span></div>
  <div class="ctl" id="ctl" hidden>
    <button id="b-pause"><ha-icon icon="mdi:pause"></ha-icon>${esc(this._t("btn.pause"))}</button>
    <button id="b-resume"><ha-icon icon="mdi:play"></ha-icon>${esc(this._t("btn.resume"))}</button>
    <button id="b-start"><ha-icon icon="mdi:play"></ha-icon>${esc(this._t("btn.start"))}</button>
    <button id="b-stop"><ha-icon icon="mdi:stop"></ha-icon>${esc(this._t("btn.stop"))}</button>
    <button id="b-power"><ha-icon icon="mdi:power"></ha-icon><span id="b-power-t"></span></button>
  </div>
  <div class="ask" id="ask" hidden><span id="ask-t"></span><button id="ask-no">${esc(this._t("btn.cancel"))}</button><button class="go" id="ask-yes"></button></div>
  <div class="err" id="err"></div>
  <div class="pic" id="pic" style="--ratio:${g.ratio}">
    <div class="art">${art}</div>
    <div ${win}>${d.window(u)}<div class="phase" id="phase"></div></div>
    <svg class="ring" viewBox="${g.view}" aria-hidden="true"><path class="track" d="${g.ring.path}" pathLength="100" style="stroke-width:${g.ring.width}"/>
      <path class="bar" id="bar" d="${g.ring.path}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="stroke-width:${g.ring.width}"/></svg>
    ${g.ring.spin ? `<div class="at spinbox" style="left:${g.ring.spin.x}%;top:${g.ring.spin.y}%;width:${g.ring.spin.d}%"><div class="spin"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" pathLength="100"/></svg></div></div>` : ""}
    <div class="lcd ${style}${g.lcd.ghost ? " ghost" : ""}" style="left:${g.lcd.x}%;top:${g.lcd.y}%;width:${g.lcd.w}%;height:${g.lcd.h}%">${DISPLAY_MARKUP[style]}</div>
    ${icons}
    ${p ? panel : ""}
  </div>
  ${p ? "" : panel}
</ha-card>`;
    this._root = r.querySelector("ha-card");
    this._el = id => r.getElementById(id);
    this._text = {};
    const press = role => () => this._call("button", "press", { entity_id: this._dev.roles[role] });
    this._el("b-pause").onclick = press("btn_pause");
    this._el("b-resume").onclick = press("btn_start");
    this._el("b-start").onclick = () => this._ask("start");
    this._el("b-stop").onclick = () => this._ask("stop");
    this._el("b-power").onclick = () => this._vm?.state === "off" ? this._power(true) : this._ask("off");
    this._el("ask-no").onclick = () => this._ask(null);
    this._el("ask-yes").onclick = () => {
      const what = this._asking; this._ask(null);
      if (what === "start") press("btn_start")();
      if (what === "stop") press("btn_stop")();
      if (what === "off") this._power(false);
    };
    const lamp = this._el("ic3");
    if (lamp) lamp.onclick = e => { e.stopPropagation(); if (this._dev.roles.light) this._call("light", "toggle", { entity_id: this._dev.roles.light }); };
    this._el("pic").onclick = () => this.dispatchEvent(new CustomEvent("hass-more-info",
      { detail: { entityId: this._dev.roles.status }, bubbles: true, composed: true }));
  }

  // --- rendering
  _set(id, value) {               // only touch the DOM when the text really changed
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

  _update() {
    if (!this._dev || !this._root || !this._hass) return;
    const h = this._hass, dev = this._dev, lang = this._lang;
    const snap = readSnapshot(h, dev.roles);
    const vm = this._vm = this._tracker.update(snap, now());
    if (this._powerErr && snap.power === this._powerErr.on) {
      if (this._text.err === this._powerErr.text) this._set("err", "");
      this._powerErr = null;
    }
    const f = vm.flags ?? {}, s = vm.state;
    const moving = s === "running" || s === "paused";
    const draw = this._draw, prog = vm.program ?? "", phase = vm.phase ?? "";
    const oven = dev.family.group === "oven", coffee = draw === "coffee" || draw === "coffee_builtin", drawer = draw === "drawer";
    const dispensing = coffee && s === "running" && !f.rinsing && !/grinding|rinse/.test(phase);
    const cls = {
      [`st-${s}`]: true, [`m-${vm.progress.mode}`]: true, moving: moving || false, stale: vm.stale,
      "f-spin": f.spin && s === "running", "f-anti": f.antiCrease && s === "done",
      "f-cool": f.cooling,
      "f-heat": (draw === "dryer" && moving && !f.cooling) || (oven && s === "running" && !f.cooling)
        || (draw === "washer_dryer" && moving && phase === "drying") || false,
      "f-heating": oven && s === "running" && f.heating,
      "f-steam": (oven && moving && (/steam|moisture|sous_vide|blanching|bottling|defrost/.test(prog) || phase === "steam_reduction"))
        || (draw === "dishwasher" && moving && phase === "drying"),
      "f-spray": draw === "dishwasher" && s === "running" && /dishwash|rinse|reactivating/.test(phase),
      "f-super": !!(snap.supercooling || snap.superfreezing),
      "f-clean": snap.vacuum === "cleaning", "f-docked": snap.vacuum === "docked",
      "f-micro": oven && s === "running" && /microwave|popcorn/.test(prog),
      "f-grind": coffee && s === "running" && /grinding/.test(phase),
      "f-dispense": dispensing, "f-rinse": coffee && s === "running" && (f.rinsing || phase === "rinse"),
      "f-warm": drawer && (moving || f.keepWarm), "f-door": f.doorOpen || phase === "door_open" || (drawer && s === "paused"),
      lit: moving || f.doorOpen || f.antiCrease || (s === "done" && f.cooling) || f.light === true,
      // the oven and cup light itself: what the light entity says; without one, on while running or with the door open
      lamp: f.light === true || (f.light == null && (moving || f.doorOpen)) || false,
      loaded: ["ready", "scheduled", "running", "paused", "done", "interrupted", "error"].includes(s) && !(coffee && !moving)
        && vm.programType !== "maintenance_program" && !/clean_machine|descal|rinse_out_lint|^rinse$/.test(prog),
      quiet: ["off", "standby", "offline"].includes(s),
      wet: (draw === "washer" || draw === "washer_dryer") && moving && !f.spin && !f.drain && !["anti_crease", "drying", "finished"].includes(vm.phase),
      "has-phase": !!vm.phase && (moving || s === "done"),
    };
    const want = Object.entries(cls).filter(([, on]) => on).map(([k]) => k).join(" ");
    if (want !== this._cls) {
      for (const k of (this._cls ?? "").split(" ").filter(Boolean)) this._root.classList.remove(k);
      for (const k of want.split(" ")) this._root.classList.add(k);
      this._cls = want;
    }

    // header pill: what is going on, in a few words
    let pill = this._t(`state.${s}`);
    if (s === "running" && f.almostDone) pill = this._t("pill.almost_done");
    else if (s === "running" && vm.phase) pill = mieleLabel(h, "phase", vm.phase, this._lang);
    else if (s === "scheduled" && f.smartGridWait) pill = this._t("pill.smart_grid");
    else if (s === "paused" && draw === "drawer") pill = this._t("pill.drawer_open");
    else if (s === "paused" && f.doorOpen) pill = this._t("pill.door_open");
    const group = dev.family.group, fan = fanLevel(snap);
    if (group === "hob") {
      const on = (snap.plates ?? []).filter(k => plateLevel(k).level > 0).length;
      if (on) pill = this._t("pill.zones", { n: on });
    } else if (group === "hood" && fan) pill = this._t("pill.fan", { n: fan });
    else if (group === "cooling" && s !== "offline") {
      pill = snap.supercooling ? this._t("pill.supercool") : snap.superfreezing ? this._t("pill.superfreeze")
        : coolTemps(snap).map(t => temp(t, vm.temps.unit)).join(" · ") || pill;
    } else if (group === "vacuum" && snap.vacuum) {
      pill = { cleaning: this._t("pill.cleaning"), returning: this._t("pill.returning"), paused: this._t("state.paused"), error: this._t("state.error"),
        docked: this._t(snap.battery != null && snap.battery < 100 ? "pill.charging" : "pill.docked") }[snap.vacuum] ?? pill;
    }
    this._set("pill", pill);
    this._set("phase", vm.phase ? mieleLabel(h, "phase", vm.phase, this._lang) : "");

    this._display(vm, snap);
    this._extra(snap);

    // the ring
    // a fault or an interruption closes the ring in its warning colour
    // busy without a known progress: round drawings turn an arc, the others let the whole ring breathe
    // the robot's ring is its battery
    const battery = draw === "robot" && snap.battery != null ? Math.max(0, Math.min(1, snap.battery / 100)) : null;
    const busy = battery == null && vm.progress.mode === "indeterminate" && !this._geom.ring.spin;
    const p = battery ?? (s === "error" || s === "interrupted" || busy ? 1 : vm.progress.value);
    this._root.classList.toggle("breathe", busy);
    const bar = this._el("bar");
    const off = String(100 - Math.round((p ?? 0) * 1000) / 10);
    if (bar.style.strokeDashoffset !== off) bar.style.strokeDashoffset = off;
    bar.style.opacity = p == null ? "0" : "1";

    // icons on the front: remote control, remote start, door
    const lockable = dev.family.group === "laundry" || dev.family.group === "dishwasher";
    this._icon(0, vm.connection === "lost" ? "mdi:wifi-off" : "mdi:wifi", vm.connection === "lost" ? "warn" : f.remote ? "lit" : "",
      this._t(vm.connection === "lost" ? "icon.lost" : "icon.remote"), !!dev.roles.remote_control);
    this._icon(1, "mdi:cellphone-arrow-down", f.mobileStart ? "lit" : "", this._t("icon.mobile"), !!dev.roles.mobile_start);
    const door = f.doorOpen ? ["mdi:door-open", "lit", "icon.door_open"] : moving && lockable ? ["mdi:lock", "lit", "icon.door_locked"] : ["mdi:door-closed", "", "icon.door_closed"];
    this._icon(2, door[0], door[1], this._t(door[2]), !!dev.roles.door);
    if (this._el("ic3")) this._icon(3, f.light ? "mdi:lightbulb-on" : "mdi:lightbulb-outline", f.light ? "lit" : "", this._t("icon.light"), !!dev.roles.light);

    this._rows(vm, snap, lang);
    this._controls(vm, snap);
    if (this._config.big_countdown) this._bigTime(vm);
  }

  // The appliance's own display, in the style of the real one (Peter's photos, 18-10):
  // W1 one line "🔒 Phase 0:31"; T1 seven-segment time with the dryness levels; ovens programme, target and current
  // temperature in orange; the coffee machine its "Drinks" screen. Switched on means lit: the clock when nothing runs.
  // Drawings that show more than a cycle: the power of every hob zone, the hood's fan level and its light ring.
  _extra(snap) {
    const draw = this._draw, root = this._root;
    if (draw === "hob") {
      const levels = (snap.plates ?? []).map(k => String(plateLevel(k).level));
      root.querySelectorAll(".zone").forEach(z => {
        const v = levels[Number(z.dataset.z)] ?? "0";
        if (z.style.getPropertyValue("--lvl") !== v) z.style.setProperty("--lvl", v);
      });
    } else if (draw === "hood") {
      const lvl = fanLevel(snap);
      for (let i = 1; i <= 4; i++) root.classList.toggle(`fan-${i}`, i === lvl);
      root.classList.toggle("fan-on", lvl > 0);
      root.classList.toggle("ambient", snap.ambient === true);
    }
  }

  _display(vm, snap) {
    const h = this._hass, lang = this._lang, s = vm.state, main = vm.lcd.main, style = this._style;
    const L = (kind, key) => mieleLabel(h, kind, key, lang);
    if (style === "zones") {         // the hob's ComfortSelect row: the level of every zone, lit when on
      this._setHTML("lcd-t", (snap.plates ?? []).map(k => { const p = plateLevel(k); return `<i class="${p.level > 0 ? "on" : ""}">${esc(p.text)}</i>`; }).join(""));
      return;
    }
    if (style === "cool") {          // the temperature of every zone, as the appliance shows it
      this._setHTML("lcd-t", coolTemps(snap).map(t => `<b>${Math.round(t)}°</b>`).join(""));
      this._root.classList.toggle("lcd-on", vm.state !== "off" && vm.state !== "offline");
      return;
    }
    if (style === "robot") {
      this._set("lcd-t", snap.battery != null ? `${Math.round(snap.battery)} %` : "");
      return;
    }
    if (style === "hood") {          // four fan level bars
      const lvl = fanLevel(snap);
      this._setHTML("lcd-t", [1, 2, 3, 4].map(i => `<i class="${i <= lvl ? "on" : ""}"></i>`).join(""));
      return;
    }
    if (style === "basic") {
      this._set("lcd-t", this._lcd(main, vm));
      this._set("lcd-s", vm.lcd.sub?.kind === "phase" ? "" : this._lcd(vm.lcd.sub, vm));
      this._el("lcd-t").classList.toggle("word", ["text", "program", "phase"].includes(main?.kind));
      return;
    }
    const clock = clockTime(now(), h, lang);
    const text = main?.kind === "text" ? this._t(`lcd.${main.value}`) : "";
    const time = s === "standby" ? clock : main?.kind === "countdown" ? hm(main.value) : main?.kind === "duration" ? duration(main.value)
      : main?.kind === "clock" ? clockTime(main.value, h, lang) : "";
    const moving = s === "running" || s === "paused";
    this._root.classList.toggle("lcd-on", s !== "off" && s !== "offline");

    if (style === "line") {
      const label = text || (s === "paused" ? this._t("lcd.paused") : s === "ready" ? L("program", vm.program)
        : s === "scheduled" ? this._t("lcd.starts") : moving && vm.phase ? L("phase", vm.phase) : moving ? L("program", vm.program) : "");
      this._setHTML("lcd-k", moving && !vm.flags.doorOpen ? LOCK : "");
      this._set("lcd-l", label);
      this._set("lcd-t", text ? "" : time);
    } else if (style === "seg") {
      const target = snap.dryingStep, order = [...LADDER].reverse(), i = order.indexOf(target);
      const showLadder = i >= 0 && !text && ["ready", "scheduled", "running", "paused"].includes(s);
      this._setHTML("lcd-l", showLadder
        ? order.slice(Math.max(0, Math.min(i - 1, order.length - 3)), Math.max(0, Math.min(i - 1, order.length - 3)) + 3).map(k => `<span class="${k === target ? "on" : ""}">${esc(L("dryness", k))}</span>`).join("")
        : `<span class="on">${esc(text || (s === "standby" ? "" : L("program", vm.program)))}</span>`);
      this._setHTML("lcd-t", time && !text ? sevenSeg(time) : "");
    } else if (style === "oven") {
      const t = vm.temps, u = t.unit;
      const big = main?.kind === "countdown" ? hm(main.value) : t.target != null && (moving || s === "ready" || s === "scheduled") ? temp(t.target, u)
        : text || time;
      this._set("lcd-l", s === "standby" ? "" : text && big !== text ? text : L("program", vm.program));
      this._set("lcd-t", big);
      this._el("lcd-t").classList.toggle("word", big === text && !!text);
      this._set("lcd-s", moving && t.current != null ? temp(t.current, u) : "");
    } else if (style === "menu") {
      const drink = vm.program ? L("program", vm.program) : "";
      this._set("lcd-l", s === "standby" ? this._t("lcd.drinks") : text || drink || (vm.flags.rinsing ? this._t("lcd.rinsing") : ""));
      this._set("lcd-k", s === "off" || s === "offline" ? "" : clock);
      this._setHTML("lcd-t", s === "standby" ? DRINK_TILES
        : s === "running" || s === "paused" ? `<span class="big">${esc(vm.flags.rinsing ? this._t("lcd.rinsing") : drink)}</span><span class="small">${esc(vm.phase ? L("phase", vm.phase) : "")}</span>`
        : text ? `<span class="big">${esc(text)}</span>` : "");
    }
  }

  // Large enough to read across the kitchen: the time left and when it's done, the oven's temperature while it heats
  // up, the start time when it waits, or "done".
  _bigTime(vm) {
    const s = vm.state, h = this._hass, lang = this._lang, main = vm.lcd.main, moving = s === "running" || s === "paused";
    const L = (kind, key) => mieleLabel(h, kind, key, lang);
    let big = "", sub = "";
    if (moving && main?.kind === "countdown") {
      big = hm(main.value);
      sub = vm.endAt ? `${this._t("row.ends")} ${clockTime(vm.endAt, h, lang)}` : "";
    } else if (moving && vm.progress.mode === "heat" && vm.temps.current != null) {
      big = temp(vm.temps.current, vm.temps.unit);
      sub = vm.temps.target != null ? `${this._t("lcd.heating")} → ${temp(vm.temps.target, vm.temps.unit)}` : this._t("lcd.heating");
    } else if (moving) {
      big = vm.program ? L("program", vm.program) : this._t(`state.${s}`);
      sub = vm.phase ? L("phase", vm.phase) : "";
    } else if (s === "scheduled" && vm.startAt) {
      big = clockTime(vm.startAt, h, lang);
      sub = this._t("row.starts");
    } else if (s === "done") {
      big = this._t("state.done");
      sub = vm.endAt ? clockTime(vm.endAt, h, lang) : "";
    }
    if (s === "paused") sub = [this._t("state.paused"), sub].filter(Boolean).join(" · ");
    this._el("bigtime").hidden = !big;
    this._set("bt", big);
    this._set("bs", sub);
  }

  _icon(i, icon, state, title, show) {
    const key = `ic${i}`, v = `${icon}|${state}|${title}|${show}`;
    if (this._text[key] === v) return;
    this._text[key] = v;
    const el = this._el(key);
    el.hidden = !show;
    el.className = `at icon ${state}${i === 3 ? " tap" : ""}`;
    el.title = title;
    el.firstElementChild.setAttribute("icon", icon);
  }

  _lcd(part, vm) {
    if (!part) return "";
    const h = this._hass, lang = this._lang;
    switch (part.kind) {
      case "dashes": return "--:--";
      case "blank": return "";
      case "countdown": return countdown(part.value);
      case "duration": return duration(part.value);
      case "clock": return clockTime(part.value, h, lang);
      case "temp": return temp(part.value, vm.temps.unit);
      case "elapsed": return `${part.value} ${this._t("unit.min")}`;
      case "percent": return vm.progress.value == null ? "" : `${Math.round(vm.progress.value * 100)}%`;
      case "program": return mieleLabel(h, "program", part.value, this._lang);
      case "phase": return mieleLabel(h, "phase", part.value, this._lang);
      case "text": return this._t(`lcd.${part.value}`);
    }
    return "";
  }

  _rows(vm, snap, lang) {
    const h = this._hass, fam = this._dev.family, s = vm.state;
    const special = this._specialRows(fam, snap);
    if (special) return this._showRows(special);
    const rows = [[this._t("row.program"), vm.program ? esc(mieleLabel(h, "program", vm.program, this._lang)) : "—"]];
    if (fam.kind === "dryer" || fam.kind === "washer_dryer") {
      const target = snap.dryingStep, reached = vm.dryness?.reached;
      const ti = LADDER.indexOf(target), ri = LADDER.indexOf(reached);
      const dots = ti >= 0 ? `<span class="dots">${LADDER.slice(0, ti + 1).map((k, i) =>
        `<i class="${i <= ri ? "on" : ""}${i === ti ? " target" : ""}" title="${esc(mieleLabel(h, "dryness", k, this._lang))}"></i>`).join("")}</span>` : "";
      rows.push([this._t("row.dryness"), target ? dots + esc(mieleLabel(h, "dryness", target, this._lang)) : "—"]);
    } else if (fam.group === "laundry") {
      const parts = [snap.targetTemp != null ? temp(snap.targetTemp, vm.temps.unit) : null, snap.spin ? `${snap.spin} ${this._t("unit.rpm")}` : null].filter(Boolean);
      rows.push([this._t("row.temp"), parts.length ? parts.join(" · ") : "—"]);
    } else if (fam.group === "oven" || fam.group === "drawer") {
      const u = vm.temps.unit, cur = vm.temps.current, target = vm.temps.target;
      const active = ["running", "paused", "ready", "scheduled"].includes(s);
      const tv = cur != null && target != null && active ? `${Math.round(cur)} → ${temp(target, u)}` : target != null && active ? temp(target, u) : cur != null ? temp(cur, u) : "—";
      rows.push([this._t("row.temp"), tv]);
      if (vm.temps.core != null && active) rows.push([this._t("row.core"), vm.temps.coreTarget != null ? `${Math.round(vm.temps.core)} → ${temp(vm.temps.coreTarget, u)}` : temp(vm.temps.core, u)]);
    }
    if (s === "ready" && vm.lcd.main?.kind === "duration") rows.push([this._t("row.duration"), duration(vm.lcd.main.value)]);
    else if (s === "scheduled" && vm.startAt) rows.push([this._t("row.starts"), clockTime(vm.startAt, h, lang)]);
    else if (vm.endAt && ["running", "paused", "done", "scheduled"].includes(s)) rows.push([this._t(s === "done" ? "row.ended" : "row.ends"), clockTime(vm.endAt, h, lang)]);
    else if ((s === "running" || s === "paused") && vm.elapsedMin != null) rows.push([this._t("row.elapsed"), `${vm.elapsedMin} ${this._t("unit.min")}`]);
    this._showRows(rows);
  }

  _showRows(rows) {
    rows = rows.slice(0, 4);
    while (rows.length < 4) rows.push(["", ""]);
    rows.forEach(([k, v], i) => { this._set(`k${i}`, k); this._setHTML(`v${i}`, v); this._el(`k${i}`).parentElement.hidden = !k; });
  }

  // Rows for appliances without programmes: hob zones, the hood's fan and lights. Null for the rest.
  _specialRows(fam, snap) {
    const onOff = v => v == null ? "—" : this._t(v ? "btn.on_state" : "state.off");
    if (fam.group === "hob") {
      const on = (snap.plates ?? []).map((k, i) => [i + 1, plateLevel(k)]).filter(([, p]) => p.level > 0);
      return [[this._t("row.zones"), on.length ? on.map(([i, p]) => `${i}: ${esc(p.text)}`).join(" · ") : this._t("state.off")]];
    }
    if (fam.group === "hood") {
      const lvl = fanLevel(snap);
      const rows = [[this._t("row.fan"), lvl ? this._t("pill.fan", { n: lvl }) : this._t("state.off")], [this._t("row.light"), onOff(snap.light)]];
      if (snap.ambient != null) rows.push([this._t("row.ambient"), onOff(snap.ambient)]);
      return rows;
    }
    if (fam.group === "cooling") {
      const u = this._vm?.temps?.unit, zones = coolTemps(snap), th = snap.thermo ?? [];
      const rows = zones.map((t, i) => {
        const target = th[i]?.target;
        const label = fam.kind === "wine" ? this._t("row.zone", { n: i + 1 }) : this._t((target ?? t) < 0 ? "row.freezer" : "row.fridge");
        return [label, target != null ? `${Math.round(t)} → ${temp(target, u)}` : temp(t, u)];
      });
      if (snap.supercooling) rows.push([this._t("pill.supercool"), this._t("btn.on_state")]);
      if (snap.superfreezing) rows.push([this._t("pill.superfreeze"), this._t("btn.on_state")]);
      return rows.length ? rows : [[this._t("row.temp"), "—"]];
    }
    if (fam.group === "vacuum") {
      return [[this._t("row.battery"), snap.battery != null ? `${Math.round(snap.battery)} %` : "—"],
        [this._t("row.suction"), snap.fanSpeed ? esc(snap.fanSpeed.replace(/^./, c => c.toUpperCase())) : "—"],
        [this._t("row.program"), this._vm?.program ? esc(mieleLabel(this._hass, "program", this._vm.program, this._lang)) : "—"]];
    }
    return null;
  }

  _controls(vm, snap) {
    const show = this._config.controls !== false;
    const c = vm.controls ?? {}, s = vm.state, power = !!this._dev.roles.power && snap.power != null;
    const btn = { "b-pause": c.pause, "b-resume": c.resume, "b-start": c.start, "b-stop": c.stop, "b-power": power && vm.connection !== "lost" };
    let any = false;
    for (const [id, on] of Object.entries(btn)) { this._el(id).hidden = !on; any ||= !!on; }
    this._set("b-power-t", this._t(s === "off" ? "btn.on" : "btn.off"));
    this._el("ctl").hidden = !show || !any;
    if (!show || s === "offline") this._ask(null);
  }

  _ask(what) {
    this._asking = what;
    const ask = this._el("ask");
    ask.hidden = !what;
    if (!what) return;
    const vm = this._vm, name = this._inText;
    const active = vm && ["running", "paused", "scheduled"].includes(vm.state);
    ask.classList.toggle("start", what === "start");
    this._set("ask-t", what === "start" ? this._t("ask.start", { program: mieleLabel(this._hass, "program", vm?.program, this._lang) || "", name })
      : what === "off" ? this._t(active ? "ask.off_running" : "ask.off", { name }) : this._t("ask.stop", { name }));
    this._set("ask-yes", this._t(what === "start" ? "btn.start" : what === "off" ? "btn.off" : "btn.stop"));
  }

  // The Miele cloud sometimes answers power on/off with an error and carries it out anyway (oven-microwave, 18-10):
  // the error goes away as soon as the switch shows what was asked.
  async _power(on) {
    this._powerErr = null;
    if (await this._call("switch", on ? "turn_on" : "turn_off", { entity_id: this._dev.roles.power }))
      this._powerErr = { on, text: this._text.err };
  }

  async _call(domain, service, data) {
    this._set("err", "");
    const msg = await callService(this._hass, domain, service, data);
    if (msg) this._set("err", this._t("err.send", { msg }));
    return msg;
  }
}
