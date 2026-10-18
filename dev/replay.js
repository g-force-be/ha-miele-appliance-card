// Replays a fixture cycle (docs/fixtures.json format) as Home Assistant states, the way the core Miele
// integration (2026.10) would report them. Runs in the browser (dev harness) and in node (tests).
//
// What is copied from the integration (homeassistant/components/miele, sensor.py):
// - remaining/elapsed/start_in/finish/start are unknown in off/on/idle; at program_ended remaining is 0, the rest is kept
// - finish = now + remaining (+ delayed start), start = now - elapsed, both to the minute, with 90 s hysteresis
// What is observed in Peter's history:
// - elapsed_time counts wall-clock minutes from the first in_use, pauses included, and restarts on an oven programme switch
// - while not_connected the status sensor says so and the other sensors turn unknown
// What is assumed (no data): button availability per status, door closed, remote control on.
import { deviceRoles, familyOf } from "../src/miele-model.js";

const OFF_LIKE = new Set(["off", "on", "idle"]);
const TIME_ROLES = ["remaining", "elapsed", "start_in", "finish", "start_ts"];
const VALUE_ROLES = ["program", "phase", "program_type", "drying_step", "target_temp", "temp", "core_temp", "core_target",
  "spin_speed", "energy", "energy_forecast", "water", "water_forecast", ...TIME_ROLES];

const floorMin = ms => Math.floor(ms / 60000) * 60000;
const str = v => v == null ? "unknown" : String(v);

// Cycles by id; a cycle with "like" takes the events of that other cycle (the same run on another appliance).
export function resolveCycles(list) {
  const byId = Object.fromEntries(list.map(c => [c.id, c]));
  for (const c of list) if (c.like) byId[c.id] = { ...c, events: byId[c.like].events, explicit: byId[c.like].explicit };
  return byId;
}

// Peter's registry snapshot plus the demo appliances (dev/data/demo-registry.json).
export const mergeRegistry = (a, b) => ({ ...a, areas: { ...a.areas, ...b.areas }, devices: { ...a.devices, ...b.devices },
  entities: [...a.entities, ...b.entities], attributes: { ...a.attributes, ...b.attributes } });

export function deviceForModel(registry, model) {
  return Object.values(registry.devices).find(d => d.model === model)?.id ?? null;
}

// the same detection the cards use (deviceRoles: hob zones numbered, overrides none), on the registry snapshot
export function rolesFromRegistry(registry, deviceId) {
  const ents = registry.entities.filter(e => e.device_id === deviceId);
  return deviceRoles({ entities: Object.fromEntries(ents.map(e => [e.entity_id, { ...e, platform: e.platform ?? "miele" }])),
    states: Object.fromEntries(ents.map(e => [e.entity_id, { attributes: registry.attributes[e.entity_id] ?? {} }])) }, deviceId);
}

// Returns { deviceId, roles, t0, duration, initial, changes } where changes = [[t, entity_id, state], ...] sorted by t (seconds).
export function simulate(cycle, registry, { mobileStart, pad = 180 } = {}) {
  const deviceId = cycle.deviceId ?? deviceForModel(registry, cycle.model);
  if (!deviceId) throw new Error(`no device for model ${cycle.model}`);
  const dev = registry.devices[deviceId];
  const fam = familyOf(dev.model, dev.model_id);
  const roles = rolesFromRegistry(registry, deviceId);
  const ents = registry.entities.filter(e => e.device_id === deviceId);
  const t0 = Date.parse(cycle.start);
  const events = [...cycle.events].sort((a, b) => a[0] - b[0]);
  const explicit = new Set(cycle.explicit ?? []);
  const duration = Math.ceil(events.at(-1)[0] + pad);
  mobileStart ??= dev.model === "Oven microwave";       // as on 18-10: only the oven-microwave had MobileStart on

  const anchors = explicit.has("remaining") ? [] : events.filter(e => e[1] === "remaining" && e[2] != null).map(e => ({ t: e[0], v: e[2] }));
  const endedAt = events.find(e => e[1] === "status" && e[2] === "program_ended")?.[0] ?? null;
  const firstRun = events.find(e => e[1] === "status" && e[2] === "in_use")?.[0] ?? null;
  const oracle = !anchors.length && !explicit.has("remaining") && fam.group === "laundry" && endedAt != null && firstRun != null;

  const raw = { status: "off", program: "no_program", phase: "not_running", program_type: "normal_operation_mode", drying_step: null,
    target_temp: null, temp: fam.group === "drawer" ? 20.11 : null, remaining: null, elapsed: null };
  let anchorIdx = -1, runSec = 0, elapsedStart = null, finishPrev = null, startPrev = null, lastT = 0, ei = 0;
  const memo = { elapsed: null, finish: null, start_ts: null, remaining: null };

  const valueAt = (role, t) => {
    const s = raw.status, abs = t0 + t * 1000;
    if (s === "not_connected" && VALUE_ROLES.includes(role) && !(role === "temp" && fam.group === "drawer")) return null;
    switch (role) {
      case "remaining": {
        if (OFF_LIKE.has(s)) return null;
        if (s === "program_ended") return 0;
        if (explicit.has("remaining")) return raw.remaining;
        if (oracle) return s === "in_use" ? Math.ceil((endedAt - t) / 60) : s === "programmed" ? Math.ceil((endedAt - firstRun) / 60)
          : s === "pause" ? memo.remaining : null;
        if (anchorIdx < 0) return fam.group === "oven" && (s === "in_use" || s === "pause") ? 0 : null;
        const a = anchors[anchorIdx], next = anchors[anchorIdx + 1];
        const floor = next && next.v <= a.v ? next.v : 0;
        return Math.max(floor, a.v - Math.floor(runSec / 60));
      }
      case "elapsed": {
        if (OFF_LIKE.has(s)) return null;
        if (explicit.has("elapsed")) return raw.elapsed;
        if (s === "program_ended") return memo.elapsed;
        if (s === "programmed" || s === "waiting_to_start") return 0;
        return elapsedStart == null ? null : Math.floor((t - elapsedStart) / 60);
      }
      case "start_in": return OFF_LIKE.has(s) ? null : "0.0";
      case "finish": {
        if (OFF_LIKE.has(s)) return null;
        if (s === "program_ended") return memo.finish;
        const rem = valueAt("remaining", t);
        const cand = rem > 0 ? floorMin(abs + rem * 60000) : null;
        if (cand != null && finishPrev != null && Math.abs(cand - finishPrev) < 90000) return finishPrev;
        if (cand != null) finishPrev = cand;
        return cand;
      }
      case "start_ts": {
        if (OFF_LIKE.has(s)) return null;
        if (s === "program_ended") return memo.start_ts;
        const el = valueAt("elapsed", t);
        const cand = el > 0 ? floorMin(abs - el * 60000) : null;
        if (cand != null && startPrev != null && Math.abs(cand - startPrev) < 90000) return startPrev;
        if (cand != null) startPrev = cand;
        return cand;
      }
      case "program": case "phase": case "program_type": case "drying_step": case "target_temp": case "temp": return raw[role];
      case "status": return s;
      case "power": return s === "not_connected" ? undefined : s === "off" ? "off" : "on";
      case "failure": return s === "failure" ? "on" : "off";
      case "door": case "notification": case "smart_grid": case "light": return raw[role] ?? "off";
      case "remote_control": return "on";
      case "mobile_start": return raw.mobile_start ?? (mobileStart ? "on" : "off");
      case "twindos_1": case "twindos_2": return "0";
      case "btn_start": return s === "pause" || s === "waiting_to_start" || (s === "programmed" && mobileStart) ? "unknown" : "unavailable";
      case "btn_stop": return ["in_use", "pause", "waiting_to_start", "programmed"].includes(s) ? "unknown" : "unavailable";
      case "btn_pause": return s === "in_use" ? "unknown" : "unavailable";
      // anything else a cycle sets (plates, fan, thermostats, battery, vacuum, …) as it says; counters and the like
      // keep what the registry snapshot says
      default: return role in raw ? raw[role] : undefined;
    }
  };
  const fmt = (role, v) => v === undefined ? undefined
    : (role === "finish" || role === "start_ts") ? (v == null ? "unknown" : new Date(v).toISOString()) : str(v);

  const roleByEid = Object.fromEntries(Object.entries(roles).map(([r, e]) => [e, r]));
  const cur = {}, initial = {}, changes = [], attrs = {};
  for (const e of ents) {
    const role = roleByEid[e.entity_id];
    const v = role ? fmt(role, valueAt(role, -1)) : undefined;
    initial[e.entity_id] = cur[e.entity_id] = v ?? (registry.attributes[e.entity_id]?.state_class === "total_increasing" ? "12" : "unknown");
  }

  const times = new Set(events.map(e => e[0]));
  for (let s = 0; s <= duration; s++) times.add(s);
  for (const t of [...times].sort((a, b) => a - b)) {
    if (raw.status === "in_use") runSec += t - lastT;
    lastT = t;
    const touched = new Set();
    while (ei < events.length && events[ei][0] <= t) {
      const [et, role, v] = events[ei++];
      // [t, "attr:fan:percentage", 75] sets an attribute of the entity with that role
      if (role.startsWith("attr:")) {
        const [, r, a] = role.split(":");
        attrs[r] = { ...attrs[r], [a]: v };
        touched.add(r);
        continue;
      }
      if (role === "remaining" && !explicit.has("remaining") && v != null) { anchorIdx = anchors.findIndex(a => a.t === et); runSec = 0; }
      if (role === "status") {
        if (v === "in_use" && elapsedStart == null) elapsedStart = et;
        if (OFF_LIKE.has(v)) { elapsedStart = null; anchorIdx = -1; }
      }
      if (role === "program" && fam.group === "oven" && raw.status === "in_use" && raw.program !== "no_program" && v !== raw.program) elapsedStart = et;
      raw[role] = v;
    }
    for (const [eid, role] of Object.entries(roleByEid)) {
      const v = fmt(role, valueAt(role, t));
      if (touched.has(role)) { if (v !== undefined) cur[eid] = v; changes.push([t, eid, cur[eid], { ...attrs[role] }]); continue; }
      if (v === undefined || v === cur[eid]) continue;
      cur[eid] = v; changes.push([t, eid, v]);
    }
    if (raw.status !== "program_ended" && raw.status !== "not_connected") {
      memo.elapsed = valueAt("elapsed", t) ?? memo.elapsed;
      memo.finish = finishPrev; memo.start_ts = startPrev;
      if (raw.status === "in_use") memo.remaining = valueAt("remaining", t);
    }
  }
  return { cycle: cycle.id, deviceId, roles, t0, duration, initial, changes };
}

// Steps through a simulation. seek(t) returns a fresh states object whenever something changed.
export class Player {
  constructor(sim, registry) {
    this.sim = sim; this.registry = registry; this.reset();
  }
  reset() {
    const pre = new Date(this.sim.t0 - 3600e3).toISOString();
    this.extra = {};
    this.states = Object.fromEntries(Object.entries(this.sim.initial).map(([eid, state]) => [eid, this._obj(eid, state, pre)]));
    this.i = 0; this.t = -Infinity;
  }
  _obj(entity_id, state, when) {
    const attributes = this.extra[entity_id] ? { ...this.registry.attributes[entity_id], ...this.extra[entity_id] } : this.registry.attributes[entity_id] ?? {};
    return { entity_id, state, attributes, last_changed: when, last_updated: when, context: { id: "replay" } };
  }
  seek(t) {
    if (t < this.t) this.reset();
    const ch = this.sim.changes;
    let next = null;
    while (this.i < ch.length && ch[this.i][0] <= t) {
      const [ct, eid, state, at] = ch[this.i++];
      if (at) this.extra[eid] = at;
      next ??= { ...this.states };
      next[eid] = this._obj(eid, state, new Date(this.sim.t0 + ct * 1000).toISOString());
    }
    if (next) this.states = next;
    this.t = t;
    return this.states;
  }
  now(t = this.t) { return this.sim.t0 + t * 1000; }
}
