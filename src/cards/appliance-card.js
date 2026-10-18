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
//   accent: "#4fa3e0"               ring and highlight colour
//   language: nl                    default: Home Assistant's language
//   max_width: 400px
//   drawing: generic               another drawing: washer | dryer | steam_oven | microwave | coffee | drawer | generic
//   images: /local/miele/           own pictures: <drawing>.svg (washer.svg, dryer.svg, …)
//   entities: { remaining: sensor.x }   override a detected role
import { MieleTracker, describeDevice, readSnapshot, scanDevices, DRY_LADDER } from "../miele-model.js";
import { now } from "../clock.js";
import { t, languageOf, mieleLabel } from "../i18n/index.js";
import { drawingFor, DRAWINGS } from "../drawings/index.js";
import { finishPalette, finishVars } from "../drawings/finish.js";
import { CARD_CSS } from "../ui/styles.js";
import { countdown, duration, clockTime, temp } from "../ui/format.js";

const ACCENT = { washer: "#4fa3e0", dryer: "#e9a23b", steam_oven: "#e07a4f", microwave: "#e07a4f", coffee: "#c98b5a", drawer: "#e0a84f", generic: "#4fa3e0" };
const LADDER = DRY_LADDER.filter(k => k !== "hand_iron");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let uid = 0;

export class MieleApplianceCard extends HTMLElement {
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
    r.innerHTML = `<style>${CARD_CSS}</style><ha-card class="theme-${this._themeName()}"><div class="err">${esc(this._t("err.no_device"))}</div></ha-card>`;
  }

  _themeName() {
    const th = this._config.theme;
    if (th === "auto") return this._hass?.themes?.darkMode ? "dark" : "light";
    return ["dark", "light", "ha"].includes(th) ? th : "dark";
  }

  _build() {
    const c = this._config, dev = this._dev, fam = dev.family;
    const draw = this._draw = DRAWINGS[c.drawing] ? c.drawing : fam.drawing;
    const d = drawingFor(draw), g = d.geom, u = `mc${++uid}`;
    this._geom = g;
    const palette = finishPalette(c.finish, fam.finish);
    const accent = c.accent || ACCENT[draw] || ACCENT.generic;
    const name = this._name = c.name || this._hass.devices?.[dev.id]?.name_by_user || this._t(`kind.${fam.kind}`);
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
<ha-card class="${draw} ${round ? "round" : "flat"} theme-${this._themeName()} anim-${["full", "reduced", "off"].includes(c.animations) ? c.animations : "full"}"
  style="--c:${esc(accent)};${finishVars(palette)}${c.max_width ? `;--maxw:${esc(c.max_width)}` : ""}">
  <div class="head"><span class="name">${esc(name)}</span><span class="pill" id="pill"></span></div>
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
    <div class="lcd${g.lcd.ghost ? " ghost" : ""}" style="left:${g.lcd.x}%;top:${g.lcd.y}%;width:${g.lcd.w}%;height:${g.lcd.h}%"><span class="t" id="lcd-t"></span><span class="s" id="lcd-s"></span></div>
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
    this._el(id).textContent = value;
  }
  _setHTML(id, html) {
    if (this._text[id] === html) return;
    this._text[id] = html;
    this._el(id).innerHTML = html;
  }

  _update() {
    if (!this._dev || !this._root || !this._hass) return;
    const h = this._hass, dev = this._dev, lang = this._lang;
    const snap = readSnapshot(h, dev.roles);
    const vm = this._vm = this._tracker.update(snap, now());
    const f = vm.flags ?? {}, s = vm.state;
    const moving = s === "running" || s === "paused";
    const draw = this._draw, prog = vm.program ?? "", phase = vm.phase ?? "";
    const oven = dev.family.group === "oven", coffee = draw === "coffee", drawer = draw === "drawer";
    const dispensing = coffee && s === "running" && !f.rinsing && !/grinding|rinse/.test(phase);
    const cls = {
      [`st-${s}`]: true, [`m-${vm.progress.mode}`]: true, moving: moving || false, stale: vm.stale,
      "f-spin": f.spin && s === "running", "f-anti": f.antiCrease && s === "done",
      "f-cool": f.cooling,
      "f-heat": (draw === "dryer" && moving && !f.cooling) || (oven && s === "running" && !f.cooling) || false,
      "f-heating": oven && s === "running" && f.heating,
      "f-steam": oven && moving && (/steam|moisture|sous_vide|blanching|bottling|defrost/.test(prog) || phase === "steam_reduction"),
      "f-micro": oven && s === "running" && /microwave|popcorn/.test(prog),
      "f-grind": coffee && s === "running" && /grinding/.test(phase),
      "f-dispense": dispensing, "f-rinse": coffee && s === "running" && (f.rinsing || phase === "rinse"),
      "f-warm": drawer && (moving || f.keepWarm), "f-door": f.doorOpen || phase === "door_open",
      lit: moving || f.doorOpen || f.antiCrease || (s === "done" && f.cooling) || f.light === true,
      loaded: ["ready", "scheduled", "running", "paused", "done", "interrupted", "error"].includes(s) && !(coffee && !moving),
      quiet: ["off", "standby", "offline"].includes(s),
      wet: draw === "washer" && moving && !f.spin && !f.drain && !["anti_crease", "drying", "finished"].includes(vm.phase),
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
    this._set("pill", pill);
    this._set("phase", vm.phase ? mieleLabel(h, "phase", vm.phase, this._lang) : "");

    // the display
    const main = vm.lcd.main, sub = vm.lcd.sub;
    this._set("lcd-t", this._lcd(main, vm));
    // the phase already sits in the window; the display keeps to time, temperature and percentage
    this._set("lcd-s", sub?.kind === "phase" ? "" : this._lcd(sub, vm));
    this._el("lcd-t").classList.toggle("word", ["text", "program", "phase"].includes(main?.kind));

    // the ring
    // a fault or an interruption closes the ring in its warning colour
    // busy without a known progress: round drawings turn an arc, the others let the whole ring breathe
    const busy = vm.progress.mode === "indeterminate" && !this._geom.ring.spin;
    const p = s === "error" || s === "interrupted" || busy ? 1 : vm.progress.value;
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
    while (rows.length < 4) rows.push(["", ""]);
    rows.forEach(([k, v], i) => { this._set(`k${i}`, k); this._setHTML(`v${i}`, v); this._el(`k${i}`).parentElement.hidden = !k; });
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
    const vm = this._vm, name = this._lang === "nl" ? this._name.toLowerCase() : this._name;
    const active = vm && ["running", "paused", "scheduled"].includes(vm.state);
    ask.classList.toggle("start", what === "start");
    this._set("ask-t", what === "start" ? this._t("ask.start", { program: mieleLabel(this._hass, "program", vm?.program, this._lang) || "", name })
      : what === "off" ? this._t(active ? "ask.off_running" : "ask.off", { name }) : this._t("ask.stop", { name }));
    this._set("ask-yes", this._t(what === "start" ? "btn.start" : what === "off" ? "btn.off" : "btn.stop"));
  }

  _power(on) { return this._call("switch", on ? "turn_on" : "turn_off", { entity_id: this._dev.roles.power }); }

  async _call(domain, service, data) {
    this._set("err", "");
    try { await this._hass.callService(domain, service, data); }
    catch (e) {
      let msg = e?.message || String(e);
      if (e?.translation_key && e?.translation_domain) {
        const localize = await this._hass.loadBackendTranslation?.("exceptions", e.translation_domain);
        msg = localize?.(`component.${e.translation_domain}.exceptions.${e.translation_key}.message`, e.translation_placeholders) || msg;
      }
      this._set("err", this._t("err.send", { msg }));
    }
  }
}
