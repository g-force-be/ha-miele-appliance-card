// Miele data model for the cards: entity roles, appliance families, card states, time and progress.
// Pure functions plus one small tracker per appliance. No DOM, so the same code runs in the card and in node:test.
// Built against the core `miele` integration of Home Assistant 2026.10 (see docs/SPEC.md §2–§4).

// ---------------------------------------------------------------- roles

// Role per domain + translation_key (hass.entities[eid].translation_key). Never use the entity_id suffix.
const TK_ROLES = {
  sensor: {
    status: "status", program_id: "program", program_phase: "phase", program_type: "program_type",
    remaining_time: "remaining", elapsed_time: "elapsed", start_time: "start_in", finish: "finish", start: "start_ts",
    target_temperature: "target_temp", core_temperature: "core_temp", core_target_temperature: "core_target",
    temperature_zone_2: "temp_2", temperature_zone_3: "temp_3", spin_speed: "spin_speed", drying_step: "drying_step",
    energy_consumption: "energy", energy_forecast: "energy_forecast", water_consumption: "water", water_forecast: "water_forecast",
    twin_dos_1_level: "twindos_1", twin_dos_2_level: "twindos_2", plate: "plate",
  },
  binary_sensor: { remote_control: "remote_control", mobile_start: "mobile_start", smart_grid: "smart_grid", notification_active: "notification" },
  button: { start: "btn_start", stop: "btn_stop", pause: "btn_pause" },
  switch: { power: "power", supercooling: "supercooling", superfreezing: "superfreezing" },
  light: { light: "light", ambient_light: "ambient_light" },
  fan: { fan: "fan" },                                   // hood; read-only on a hob with extraction
  climate: { zone_2: "thermo_2", zone_3: "thermo_3" },   // fridges, freezers, wine units (zone 1 has no key)
  vacuum: { vacuum: "vacuum" },
  select: { fridge_freezer_mode: "mode" },
};
// Fallback for admins: the part of the unique_id after the first "-" is the integration's description.key.
const UID_ROLES = {
  state_status: "status", state_program_id: "program", state_program_phase: "phase", state_program_type: "program_type",
  state_remaining_time: "remaining", state_elapsed_time: "elapsed", state_start_time: "start_in",
  state_finish_timestamp: "finish", state_start_timestamp: "start_ts", state_target_temperature: "target_temp",
  state_temperature_1: "temp", state_core_temperature: "core_temp", state_core_target_temperature: "core_target",
  state_spinning_speed: "spin_speed", state_drying_step: "drying_step", current_energy_consumption: "energy",
  energy_forecast: "energy_forecast", current_water_consumption: "water", water_forecast: "water_forecast",
  twin_dos_1_level: "twindos_1", twin_dos_2_level: "twindos_2", state_signal_door: "door", state_signal_failure: "failure",
  state_signal_info: "notification", state_full_remote_control: "remote_control", state_mobile_start: "mobile_start",
  state_smart_grid: "smart_grid", start: "btn_start", stop: "btn_stop", pause: "btn_pause", poweronoff: "power", light: "light",
  state_temperature_2: "temp_2", state_temperature_3: "temp_3", state_plate_step: "plate", state_battery: "battery",
  thermostat: "thermo_1", thermostat2: "thermo_2", thermostat3: "thermo_3", supercooling: "supercooling", superfreezing: "superfreezing",
  fan: "fan", fan_readonly: "fan", ambient_light: "ambient_light",
};
// Entities without a translation_key: the measured temperature, the door, the failure sensor, the robot's battery.
const DC_ROLES = { "sensor.temperature": "temp", "binary_sensor.door": "door", "binary_sensor.problem": "failure", "sensor.battery": "battery" };
// Last resort for enum sensors without translation_key or unique_id: one option only that sensor has
// (checked in this order: the dryer's phase list also contains "extra_dry").
const OPTION_ROLES = [["program_ended", "status"], ["no_program", "program"], ["normal_operation_mode", "program_type"],
  ["not_running", "phase"], ["extra_dry", "drying_step"]];

export function roleOf(entityId, entry, stateObj, uniqueId) {
  const domain = entityId.slice(0, entityId.indexOf("."));
  const tk = entry?.translation_key;
  if (tk) return TK_ROLES[domain]?.[tk] ?? null;
  if (uniqueId) {
    const key = uniqueId.slice(uniqueId.indexOf("-") + 1);
    const role = UID_ROLES[key] ?? UID_ROLES[key.replace(/-\d+$/, "")];   // zone entities end in "-<zone>"
    if (role) return role;
  }
  const a = stateObj?.attributes ?? {};
  if (domain === "sensor" && a.device_class === "enum" && Array.isArray(a.options))
    for (const [opt, role] of OPTION_ROLES) if (a.options.includes(opt)) return role;
  // the first thermostat of a fridge, freezer or wine unit has no translation key either
  if (domain === "climate") return "thermo_1";
  return DC_ROLES[`${domain}.${a.device_class}`] ?? null;
}

// { role: entity_id } for one device. `uniqueIds` (entity_id -> unique_id) comes from config/entity_registry/list when the
// user is an admin; `overrides` is the card's `entities:` option.
export function deviceRoles(hass, deviceId, { uniqueIds = {}, overrides = {} } = {}) {
  const roles = {}, plates = [];
  for (const [eid, e] of Object.entries(hass.entities ?? {})) {
    if (e.device_id !== deviceId || e.platform !== "miele") continue;
    const role = roleOf(eid, e, hass.states?.[eid], uniqueIds[eid]);
    if (role === "plate") plates.push(eid);
    else if (role && !roles[role]) roles[role] = eid;
  }
  // A hob's zones share one translation key; the zone number is in the unique_id (admins) or in the name HA gives
  // them ("Kookzone 3", "Plate 3"), else they keep the registry's order.
  const zone = eid => Number(/-(\d+)$/.exec(uniqueIds[eid] ?? "")?.[1] ?? /(\d+)\s*$/.exec(hass.states?.[eid]?.attributes?.friendly_name ?? "")?.[1] ?? NaN);
  plates.map((eid, i) => [Number.isFinite(zone(eid)) ? zone(eid) : 100 + i, eid]).sort((a, b) => a[0] - b[0])
    .forEach(([, eid], i) => { roles[`plate_${i + 1}`] = eid; });
  for (const [role, eid] of Object.entries(overrides ?? {})) if (eid) roles[role] = eid;
  return roles;
}

// Buttons the integration creates disabled (start/stop/pause) are missing from hass.entities.
// `registry` is the result of config/entity_registry/list (admins only).
export function disabledControls(registry, deviceId) {
  const out = {};
  for (const r of registry ?? []) {
    if (r.device_id !== deviceId || r.platform !== "miele" || !r.disabled_by) continue;
    const role = r.unique_id ? UID_ROLES[r.unique_id.slice(r.unique_id.indexOf("-") + 1)] : null;
    if (role?.startsWith("btn_")) out[role] = r.entity_id;
  }
  return out;
}

// ---------------------------------------------------------------- families

// hass.devices[id].model is the integration's appliance type, capitalised ("Washing machine", "Steam oven combi").
const MODEL_KINDS = {
  "washing machine": "washer", "tumble dryer": "dryer", "washer dryer": "washer_dryer", dishwasher: "dishwasher",
  oven: "oven", "oven microwave": "oven_microwave", "steam oven": "steam_oven", "steam oven combi": "steam_oven_combi",
  "steam oven micro": "steam_oven_micro", "dialog oven": "dialog_oven", microwave: "microwave",
  "coffee system": "coffee", "warming drawer": "drawer", hob: "hob", "hob extraction": "hob", hood: "hood",
  refrigerator: "fridge", freezer: "fridge", "fridge freezer": "fridge", "wine cabinet": "wine",
  "wine conditioning unit": "wine", "wine unit": "wine", "wine cabinet freezer": "wine", "robot vacuum cleaner": "vacuum",
};
// When the type is unknown the integration puts the Miele type number in `model`; guess from its prefix.
const PREFIX_KINDS = [[/^(WT|WWT)/, "washer_dryer"], [/^W/, "washer"], [/^T/, "dryer"], [/^G/, "dishwasher"], [/^ESW/, "drawer"],
  [/^(CM|CVA)/, "coffee"], [/^DGM/, "steam_oven_micro"], [/^DG/, "steam_oven_combi"], [/^H\w*BM/, "oven_microwave"],
  [/^M/, "microwave"], [/^H/, "oven"], [/^KM/, "hob"], [/^DA/, "hood"], [/^KWT/, "wine"], [/^(K|F)/, "fridge"], [/^RX/, "vacuum"]];

const KIND = {
  washer:           { group: "laundry",    drawing: "washer" },
  washer_dryer:     { group: "laundry",    drawing: "washer_dryer" },
  dryer:            { group: "laundry",    drawing: "dryer" },
  dishwasher:       { group: "dishwasher", drawing: "dishwasher" },
  oven:             { group: "oven",       drawing: "oven" },
  steam_oven:       { group: "oven",       drawing: "steam_oven" },
  steam_oven_combi: { group: "oven",       drawing: "steam_oven" },
  dialog_oven:      { group: "oven",       drawing: "oven" },
  steam_oven_micro: { group: "oven",       drawing: "microwave" },
  oven_microwave:   { group: "oven",       drawing: "microwave" },
  microwave:        { group: "oven",       drawing: "microwave" },
  coffee:           { group: "coffee",     drawing: "coffee" },
  drawer:           { group: "drawer",     drawing: "drawer" },
  hob:              { group: "hob",        drawing: "hob" },
  hood:             { group: "hood",       drawing: "hood" },
  fridge:           { group: "cooling",    drawing: "fridge" },
  wine:             { group: "cooling",    drawing: "wine" },
  vacuum:           { group: "vacuum",     drawing: "robot" },
};

export function familyOf(model, modelId) {
  const id = String(modelId ?? "").replace(/\s+/g, "").toUpperCase();
  let kind = MODEL_KINDS[String(model ?? "").trim().toLowerCase()];
  if (!kind) {
    const code = id || String(model ?? "").replace(/\s+/g, "").toUpperCase();
    kind = PREFIX_KINDS.find(([re]) => re.test(code))?.[1] ?? "other";
  }
  const k = KIND[kind] ?? { group: "other", drawing: "generic" };
  return {
    kind, group: k.group, drawing: kind === "coffee" && id.startsWith("CVA") ? "coffee_builtin" : k.drawing,
    // what goes into a built-in column (ovens, drawers, the CVA coffee machine); dishwashers, hobs and fridges don't
    builtIn: kind === "coffee" ? id.startsWith("CVA") : ["oven", "drawer"].includes(k.group),
    finish: k.group === "laundry" ? "lotus_white" : "obsidian_black",
  };
}

// The old HACS integrations (HomeAssistant-Mods, astrandb's custom component) also use the domain "miele", but
// their entities carry no translation keys, so the cards can't tell what each entity is.
export const oldIntegration = hass => {
  const ours = Object.values(hass?.entities ?? {}).filter(e => e.platform === "miele");
  return ours.length > 0 && !ours.some(e => e.translation_key);
};

// All Miele appliances in this Home Assistant, in a stable order.
export function scanDevices(hass, opts) {
  const ids = new Set();
  for (const e of Object.values(hass.entities ?? {})) if (e.platform === "miele" && e.device_id) ids.add(e.device_id);
  return [...ids].map(id => describeDevice(hass, id, opts))
    .sort((a, b) => String(a.areaId).localeCompare(String(b.areaId)) || a.name.localeCompare(b.name));
}

export function describeDevice(hass, id, opts) {
  const d = hass.devices?.[id] ?? {};
  return {
    id, name: d.name_by_user || d.name || id, model: d.model ?? null, modelId: d.model_id ?? null, areaId: d.area_id ?? null,
    family: familyOf(d.model, d.model_id), roles: deviceRoles(hass, id, opts),
  };
}

// ---------------------------------------------------------------- reading the entities

const NO_VALUE = new Set(["unknown", "unavailable", ""]);
const has = s => s != null && !NO_VALUE.has(s);
const TO_MIN = { s: 1 / 60, min: 1, h: 60, d: 1440 };

// Converts a duration state to minutes, respecting the entity's unit (start_in is reported in hours by default).
export const toMinutes = (value, unit) => value == null ? null : value * (TO_MIN[unit] ?? 1);

// A flat, typed copy of everything the card needs from one device. Timestamps are milliseconds.
export function readSnapshot(hass, roles) {
  const so = role => roles[role] ? hass.states?.[roles[role]] : undefined;
  const val = role => { const s = so(role)?.state; return has(s) ? s : null; };
  const num = role => { const v = val(role); const n = v == null ? NaN : Number(v); return Number.isFinite(n) ? n : null; };
  const dur = role => toMinutes(num(role), so(role)?.attributes?.unit_of_measurement);
  const at = role => { const s = so(role); return s ? Date.parse(s.last_changed) : NaN; };
  const ts = role => { const v = val(role); const t = v == null ? NaN : Date.parse(v); return Number.isFinite(t) ? t : null; };
  const bool = role => { const v = val(role); return v === "on" ? true : v === "off" ? false : null; };
  const btn = role => !roles[role] ? "none" : !so(role) ? "disabled" : so(role).state === "unavailable" ? "unavailable" : "available";
  return {
    status: so("status")?.state ?? null, statusAt: at("status"),
    program: val("program"), phase: val("phase"), programType: val("program_type"),
    remaining: dur("remaining"), remainingAt: at("remaining"),
    elapsed: dur("elapsed"), elapsedAt: at("elapsed"),
    startIn: dur("start_in"), finish: ts("finish"), startTs: ts("start_ts"),
    temp: num("temp"), targetTemp: num("target_temp"), coreTemp: num("core_temp"), coreTarget: num("core_target"),
    tempUnit: so("temp")?.attributes?.unit_of_measurement ?? so("target_temp")?.attributes?.unit_of_measurement ?? "°C",
    spin: num("spin_speed"), dryingStep: val("drying_step"),
    energyForecast: num("energy_forecast"), waterForecast: num("water_forecast"), twindos1: num("twindos_1"), twindos2: num("twindos_2"),
    door: bool("door"), failure: bool("failure"), notification: bool("notification"),
    remote: bool("remote_control"), mobileStart: bool("mobile_start"), smartGrid: bool("smart_grid"),
    power: bool("power"), light: bool("light"),
    buttons: { start: btn("btn_start"), stop: btn("btn_stop"), pause: btn("btn_pause") },
    // hob zones in order (HA's plate_step keys), the hood's fan and lights, cooling zones, the robot
    plates: plateRoles(roles).map(r => val(r)),
    fan: roles.fan ? { on: so("fan")?.state === "on", pct: Number(so("fan")?.attributes?.percentage) || 0 } : null,
    ambient: bool("ambient_light"),
    temp2: num("temp_2"), temp3: num("temp_3"),
    thermo: ["thermo_1", "thermo_2", "thermo_3"].filter(r => roles[r]).map(r => {
      const a = so(r)?.attributes ?? {}, n = v => (Number.isFinite(Number(v)) && v != null ? Number(v) : null);
      return { current: n(a.current_temperature), target: n(a.temperature), min: n(a.min_temp), max: n(a.max_temp) };
    }),
    supercooling: bool("supercooling"), superfreezing: bool("superfreezing"),
    battery: num("battery"), vacuum: val("vacuum"), fanSpeed: so("vacuum")?.attributes?.fan_speed ?? null,
  };
}

const plateRoles = roles => Object.keys(roles).filter(r => /^plate_\d+$/.test(r)).sort((a, b) => a.slice(6) - b.slice(6));

// A hob zone's power as 0…1 and the way the hob shows it: plate_step_1…18 are the levels 1–9 in half steps
// ("4." is 4½), warming keeps warm, boost is full power.
export function plateLevel(key) {
  if (!key || key === "plate_step_0") return { level: 0, text: "0" };
  if (key === "plate_step_warming") return { level: .12, text: "w" };
  if (key.startsWith("plate_step_boost")) return { level: 1, text: "B" };
  const n = Number(key.slice(11));
  return Number.isFinite(n) ? { level: Math.min(1, n / 18), text: n % 2 ? `${(n - 1) / 2}.` : String(n / 2) } : { level: 0, text: "-" };
}

// ---------------------------------------------------------------- card states

export const CARD_STATES = ["off", "offline", "standby", "ready", "scheduled", "running", "paused", "done", "interrupted", "error"];
const STATUS_STATE = {
  off: "off", reserved: "off", on: "standby", idle: "standby", programmed: "ready", waiting_to_start: "scheduled",
  in_use: "running", rinse_hold: "running", autocleaning: "running", superheating: "running", superfreezing: "running",
  supercooling: "running", supercooling_superfreezing: "running", pause: "paused", program_ended: "done",
  program_interrupted: "interrupted", failure: "error", service: "error",
};
const CYCLE = new Set(["ready", "scheduled", "running", "paused"]);
const HOLD_LONG = new Set(["scheduled", "running", "paused", "done"]);
const HOLD_ALWAYS = new Set(["off", "standby"]);
const IDLE_PHASES = new Set(["not_running"]);
const END_PHASES = new Set(["finished", "process_finished"]);

// The card state for one snapshot. `connected` is false when the appliance or the integration is gone.
// A status HA doesn't know yet (e.g. "Missing StateStatus code: 144") arrives as "unknown"; then the phase decides.
export function cardState(snap) {
  const s = snap.status;
  if (s == null || s === "not_connected" || s === "unavailable") return { state: "offline", connected: false, guessed: false };
  if (s === "unknown") {
    if (snap.phase == null && snap.program == null) return { state: "offline", connected: false, guessed: false };
    const state = IDLE_PHASES.has(snap.phase) || snap.phase == null ? "standby" : END_PHASES.has(snap.phase) ? "done" : "running";
    return { state: snap.failure ? "error" : state, connected: true, guessed: true };
  }
  // A programme set from outside while Start op afstand is off waits on the appliance for Start: Miele reports
  // "pause" with the phase not_running and nothing elapsed (oven-microwave, 18-10). That's ready to start.
  // A door pause also drops to not_running after a while, so the tracker keeps "paused" when a cycle was running.
  if (s === "pause" && IDLE_PHASES.has(snap.phase) && !(snap.elapsed > 0) && !snap.failure)
    return { state: "ready", connected: true, guessed: false, notStarted: true };
  const state = snap.failure ? "error" : STATUS_STATE[s] ?? "standby";
  return { state, connected: true, guessed: false };
}

// ---------------------------------------------------------------- phases

const HEAT_PHASES = new Set(["heating_up_phase", "pre_heating", "heating_up"]);
const COOL_PHASES = new Set(["cooling_down", "comfort_cooling", "safety_cooling", "cooling_phase"]);
// Dryness levels from wet to dry. The dryer's phase walks up this ladder towards drying_step (the target).
export const DRY_LADDER = ["machine_iron", "hand_iron_2", "hand_iron", "hand_iron_1", "slightly_dry", "normal", "normal_plus", "extra_dry"];
const dryRank = k => DRY_LADDER.indexOf(k);

// ---------------------------------------------------------------- tracker

const AT_TEMP_MARGIN = 2;       // °C below target that counts as "at temperature"

// One per appliance. Feed it a snapshot whenever hass changes and once a second for the countdown:
//   const vm = tracker.update(readSnapshot(hass, roles), Date.now());
// It filters connection blips, counts pauses, anchors the countdown and keeps the last programme.
export class MieleTracker {
  constructor(family, opts = {}) {
    this.family = family;
    this.opts = { holdMs: 60e3, activeHoldMs: 20 * 60e3, endGraceMs: 5 * 60e3, debounceMs: 1000, ...opts };
    this.prev = null;           // last card state shown
    this.good = null;           // last connected snapshot + what it led to
    this.offlineSince = null;
    this.unknownSince = null;
    this.c = this._newCycle(null);
  }

  _newCycle(now) {
    return { since: now, pausedMs: 0, pauseStart: null, heatFrom: null, maxRemaining: null, lastElapsed: null,
      program: null, reachedDry: null, frozen: null, last: null, readyProgram: undefined, readySince: null, readyShown: null };
  }

  update(snap, now) {
    const o = this.opts, base = cardState(snap);
    const hold = (since, limitMs) => {
      if (!this.good) return false;
      if (now - since < limitMs) return true;
      // An appliance that was off or idle stays "off" with a lost-connection mark: the kitchen drops off Wi-Fi
      // whenever the microwave runs, and "not connected" on every appliance would only be noise.
      if (HOLD_ALWAYS.has(this.good.state)) return true;
      if (!HOLD_LONG.has(this.good.state)) return false;
      // An active cycle keeps counting down while the appliance is unreachable (the microwave knocks the whole
      // kitchen off Wi-Fi for minutes); give up after the expected end, or after activeHoldMs without one.
      return this.good.endAt ? now < this.good.endAt + o.endGraceMs : now - since < o.activeHoldMs;
    };

    if (!base.connected) {
      this.unknownSince = null;
      if (this.offlineSince == null) this.offlineSince = Number.isFinite(snap.statusAt) && snap.statusAt <= now ? snap.statusAt : now;
      if (hold(this.offlineSince, o.holdMs)) return this._compute(this.good.snap, now, { stale: true, connection: "lost" });
      return this._offline(now);
    }
    this.offlineSince = null;
    if (base.guessed) {
      if (this.unknownSince == null) this.unknownSince = now;
      if (now - this.unknownSince < o.holdMs && this.good) return this._compute(this.good.snap, now, { stale: true, connection: "ok" });
    } else this.unknownSince = null;

    const vm = this._compute(snap, now, { stale: false, connection: "ok", guessed: base.guessed });
    this.good = { snap, state: vm.state, endAt: vm.state === "done" ? null : vm.endAt };
    return vm;
  }

  _offline(now) {
    return { state: "offline", phase: null, program: null, stale: false, connection: "lost", offlineSince: this.offlineSince,
      lastState: this.good?.state ?? null, progress: { mode: "none", value: null }, leftSec: null, endAt: null, startAt: null,
      lcd: { main: { kind: "dashes" }, sub: { kind: "text", value: "offline" } }, flags: {}, dryness: null, temps: {}, controls: {} };
  }

  _compute(snap, now, { stale, connection, guessed = false }) {
    const fam = this.family, o = this.opts;
    const base = cardState(snap), prev = this.prev;
    const state = base.notStarted && (prev === "running" || prev === "paused") ? "paused" : base.state;
    let c = this.c;

    // --- cycle bookkeeping (skipped while a held snapshot is shown)
    if (!stale) {
      const at = Number.isFinite(snap.statusAt) && snap.statusAt <= now ? snap.statusAt : now;
      // ovens restart elapsed_time when the programme changes mid-session (checked on the microwave)
      const programSwitch = fam.group === "oven" && state === "running" && c.program && snap.program
        && snap.program !== "no_program" && snap.program !== c.program;
      const elapsedReset = snap.elapsed != null && c.lastElapsed != null && snap.elapsed < c.lastElapsed;
      if ((CYCLE.has(state) && !CYCLE.has(prev)) || elapsedReset || programSwitch) c = this.c = this._newCycle(now);
      if (state === "paused" && c.pauseStart == null) { c.pauseStart = at; c.frozen = c.last; }
      if (state !== "paused" && c.pauseStart != null) { c.pausedMs += Math.max(0, at - c.pauseStart); c.pauseStart = null; c.frozen = null; }
      if (snap.program && snap.program !== "no_program") c.program = snap.program;
      if (snap.elapsed != null) c.lastElapsed = snap.elapsed;
      if (snap.remaining != null && snap.remaining > 0) {
        if (state === "ready") c.maxRemaining = snap.remaining;
        else if (state === "running") c.maxRemaining = Math.max(c.maxRemaining ?? 0, snap.remaining);
      }
      if (DRY_LADDER.includes(snap.phase) && (c.reachedDry == null || dryRank(snap.phase) > dryRank(c.reachedDry))) c.reachedDry = snap.phase;
      this.prev = state;
    }

    const active = state === "running" || state === "paused";
    const inCycle = CYCLE.has(state) || state === "done";
    const program = snap.program && snap.program !== "no_program" ? snap.program : inCycle ? c.program : null;
    const phase = snap.phase && !IDLE_PHASES.has(snap.phase) ? snap.phase : null;

    // --- countdown: Miele's whole minutes, counted down between updates but never more than one minute ahead,
    // so a stalled estimate ("41 min" for 45 min) or a timer that hasn't started yet doesn't run away.
    let leftSec = null;
    if (snap.remaining != null && snap.remaining > 0) {
      const full = snap.remaining * 60;
      const since = Number.isFinite(snap.remainingAt) ? Math.max(0, (now - snap.remainingAt) / 1000) : 0;
      leftSec = state === "running" ? Math.max(full - since, full - 60) : full;
    } else if (snap.finish != null && (state === "running" || state === "scheduled")) {
      leftSec = Math.max(0, (snap.finish - now) / 1000);
    }

    // --- heating (ovens): progress from the temperature while it climbs to the target
    const heatInfo = fam.group === "oven" && snap.targetTemp != null && snap.temp != null && active;
    // below the target and no timer running: still heating up, whatever the phase is called ("process_running" on the
    // oven-microwave with Fan plus, seen live on 18-10)
    const heating = heatInfo && snap.temp < snap.targetTemp - AT_TEMP_MARGIN && (HEAT_PHASES.has(snap.phase) || !(snap.remaining > 0));
    if (heating && !stale) c.heatFrom = Math.min(c.heatFrom ?? snap.temp, snap.temp);

    // --- progress
    let mode = "none", progress = null, almostDone = false;
    const pausedSec = (c.pausedMs + (c.pauseStart != null ? Math.max(0, now - c.pauseStart) : 0)) / 1000;
    if (state === "done") { mode = "done"; progress = 1; }
    else if (state === "paused" && c.frozen) {
      // the ring and the display stand still while paused (oven doors open dozens of times per session)
      ({ mode, progress } = c.frozen);
      leftSec = c.frozen.leftSec ?? leftSec;
    } else if (active) {
      if (heating) {
        mode = "heat";
        const from = c.heatFrom ?? snap.temp, span = snap.targetTemp - from;
        progress = span > 0 ? Math.min(0.99, Math.max(0, (snap.temp - from) / span)) : 0;
      } else if (leftSec != null) {
        mode = "time";
        if (snap.elapsed != null) {
          // elapsed_time keeps counting during a pause (checked on the steam oven), so the pauses come off
          const tick = state === "running" && Number.isFinite(snap.elapsedAt) ? Math.min(59, Math.max(0, (now - snap.elapsedAt) / 1000)) : 0;
          const ran = Math.max(0, snap.elapsed * 60 + tick - pausedSec);
          progress = ran + leftSec > 0 ? ran / (ran + leftSec) : 0;
        } else if (c.maxRemaining) progress = 1 - leftSec / (c.maxRemaining * 60);
        if (state === "running" && leftSec <= 0) almostDone = true;
      } else if ((fam.group === "laundry" || fam.group === "dishwasher") && snap.remaining === 0 && state === "running") {
        // Miele's estimate ran out but the cycle isn't over: "almost done", not "done"
        mode = "time"; almostDone = true; leftSec = 0; progress = Math.max(c.last?.progress ?? 0, 0.99);
      } else if (heatInfo) { mode = "at_temp"; progress = 1; }
      else mode = "indeterminate";
      // 100 % is for "done"; a running cycle tops out at 99 %
      if (progress != null) progress = Math.min(mode === "at_temp" ? 1 : 0.99, Math.max(0, progress));
    }
    if (!stale && state === "running") c.last = { mode, progress, leftSec };

    // --- end and start times
    const endAt = CYCLE.has(state) ? snap.finish ?? (leftSec > 0 ? now + leftSec * 1000 : null) : state === "done" ? snap.finish : null;
    const startAt = state !== "scheduled" ? null
      : snap.startTs != null && snap.startTs > now ? snap.startTs : snap.startIn ? now + snap.startIn * 60e3 : null;

    // --- ready: the dial turns through programmes quickly; only show a duration once it has settled
    let readyDur = null;
    if (state === "ready") {
      if (snap.program !== c.readyProgram) { c.readyProgram = snap.program; c.readySince = now; }
      if (c.readyShown == null || now - c.readySince >= o.debounceMs) c.readyShown = snap.remaining;
      readyDur = c.readyShown;
    }

    const flags = {
      heating: active && HEAT_PHASES.has(snap.phase),
      cooling: COOL_PHASES.has(snap.phase) && (active || state === "done"),
      antiCrease: snap.phase === "anti_crease",
      keepWarm: snap.phase === "keeping_warm",
      rinsing: snap.status === "autocleaning",
      spin: snap.phase === "spin", drain: snap.phase === "drain",
      almostDone,
      doorOpen: snap.door === true,
      smartGridWait: state === "scheduled" && snap.smartGrid === true,
      remote: snap.remote === true, mobileStart: snap.mobileStart === true,
      light: snap.light,
    };

    const b = snap.buttons;
    const controls = {
      pause: state === "running" && b.pause === "available",
      resume: state === "paused" && b.start === "available",
      start: state === "ready" && b.start === "available",
      stop: CYCLE.has(state) && b.stop === "available",
      disabled: Object.entries(b).filter(([, v]) => v === "disabled").map(([k]) => k),
    };

    const isDryer = fam.kind === "dryer" || fam.kind === "washer_dryer";
    const dryness = isDryer && inCycle && (snap.dryingStep || c.reachedDry) ? { target: snap.dryingStep, reached: c.reachedDry } : null;

    return {
      state, phase, program, programType: snap.programType, stale, connection, guessed,
      progress: { mode, value: progress }, leftSec, endAt, startAt, flags, dryness,
      lcd: this._lcd({ state, mode, leftSec, almostDone, readyDur, startAt, snap, program, phase, flags }),
      temps: { current: snap.temp, target: snap.targetTemp, core: snap.coreTemp, coreTarget: snap.coreTarget, unit: snap.tempUnit },
      elapsedMin: snap.elapsed, pausedSec: Math.round(pausedSec), controls,
    };
  }

  // What the appliance's own display shows. Kinds: dashes, blank, countdown/duration (seconds), clock (ms),
  // temp, elapsed (minutes), percent, program, phase, text (a key the card translates).
  _lcd({ state, mode, leftSec, almostDone, readyDur, startAt, snap, program, phase, flags }) {
    const group = this.family.group;
    switch (state) {
      case "off": return { main: { kind: "dashes" }, sub: null };
      case "standby": return { main: { kind: "blank" }, sub: null };
      case "ready": return { main: readyDur ? { kind: "duration", value: readyDur * 60 } : { kind: "blank" }, sub: { kind: "text", value: "ready" } };
      case "scheduled": return { main: startAt ? { kind: "clock", value: startAt } : { kind: "dashes" },
        sub: { kind: "text", value: flags.smartGridWait ? "smart_grid" : "starts" } };
      case "done": return { main: { kind: "text", value: "end" }, sub: phase ? { kind: "phase", value: phase } : null };
      case "interrupted": return { main: { kind: "text", value: "interrupted" }, sub: null };
      case "error": return { main: { kind: "text", value: "error" }, sub: null };
    }
    // running / paused
    const paused = state === "paused" ? { kind: "text", value: "paused" } : null;
    if (almostDone) return { main: { kind: "text", value: "almost_done" }, sub: paused ?? { kind: "percent" } };
    if (mode === "time") return { main: { kind: "countdown", value: leftSec }, sub: paused ?? { kind: "percent" } };
    if (mode === "heat") return { main: { kind: "temp", value: snap.temp }, sub: paused ?? { kind: "text", value: "heating" } };
    if (mode === "at_temp") return { main: { kind: "temp", value: snap.temp },
      sub: paused ?? (snap.elapsed != null ? { kind: "elapsed", value: snap.elapsed } : { kind: "text", value: "at_temp" }) };
    if (group === "coffee") return {
      main: flags.rinsing ? { kind: "text", value: "rinsing" } : program ? { kind: "program", value: program } : { kind: "blank" },
      sub: phase ? { kind: "phase", value: phase } : paused };
    if (group === "drawer" && snap.temp != null) return { main: { kind: "temp", value: snap.temp }, sub: phase ? { kind: "phase", value: phase } : paused };
    if (snap.elapsed != null) return { main: { kind: "elapsed", value: snap.elapsed }, sub: paused };
    return { main: program ? { kind: "program", value: program } : { kind: "blank" }, sub: paused };
  }
}
