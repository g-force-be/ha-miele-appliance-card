// Programmes for miele-programmes-card: the appliance's own list (miele.get_programs), matched to Home Assistant's
// programme keys, cached per appliance; the favourites; when a start is allowed and what it sends.
//
// Seen in Peter's HA on 18-10: ovens and the coffee machine answer even when off and without "Start op afstand",
// the warming drawer answers [], washer and dryer answer 400 until "Start op afstand" is on.
// The IDs of get_programs are the ones to start with. They don't follow HA's own ID tables (coffee: Ristretto is
// 24001 here, 24000 in HA's const; cappuccino and caffè latte differ too), so the key comes from the name.

// "Caffè latte" → "caffe_latte", "Sous-vide" → "sous_vide", "ECO 40-60" → "eco_40_60"
export const slug = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const squash = s => s.replace(/_/g, "");   // "QuickPowerWash" and quick_power_wash meet as "quickpowerwash"

// Favourites from Peter's use over ten days (SPEC §6), per drawing. A favourite the appliance doesn't offer for
// remote start (e.g. quick_microwave) drops out once the list is known.
export const FAVOURITES = {
  washer: ["cottons", "eco_40_60", "minimum_iron", "denim", "woollens", "quick_power_wash", "freshen_up", "drain_spin", "down_duvets", "cottons_hygiene"],
  dryer: ["cottons", "minimum_iron", "warm_air", "cottons_eco"],
  coffee: ["long_coffee", "herbal_tea", "milk_foam"],
  steam_oven: ["fan_plus", "steam_cooking"],
  microwave: ["microwave", "quick_microwave", "fan_plus", "microwave_fan_plus"],
  drawer: ["warm_cups_glasses", "warm_dishes_plates", "keep_warm", "slow_roasting"],
};

const minutes = o => o ? (Number(o.hours) || 0) * 60 + (Number(o.minutes) || 0) : null;

// The service response → [{ id, name, key, temp: {min,max,step}|null, dur: {min,max}|null (minutes) }].
// Nameless entries (the coffee machine's 24030/24031) are left out. `options` is the programme sensor's options list.
export function readPrograms(response, options = []) {
  const keys = new Map(options.map(k => [squash(k), k]));
  return (response?.programs ?? []).filter(p => String(p.program ?? "").trim()).map(p => {
    const t = p.parameters?.temperature, d = p.parameters?.duration;
    return {
      id: Number(p.program_id), name: String(p.program).trim(), key: keys.get(squash(slug(p.program))) ?? null,
      temp: t && t.min != null && t.max != null ? { min: t.min, max: t.max, step: t.step || 1 } : null,
      dur: d && d.max ? { min: Math.max(1, minutes(d.min) ?? 1), max: minutes(d.max) } : null,
    };
  });
}

// The tiles: favourites first in their order, then the rest of the list. With the list unknown, the favourites alone
// (as keys, nothing to start with).
export function arrange(list, favourites) {
  const fav = (favourites ?? []).map(String);
  if (!list) return { favs: fav.map(k => ({ id: null, key: k, name: k, temp: null, dur: null })), rest: [] };
  const hit = f => list.find(p => p.key === f || String(p.id) === f);
  const favs = fav.map(hit).filter((p, i, a) => p && a.indexOf(p) === i);
  return { favs, rest: list.filter(p => !favs.includes(p)) };
}

// Why a programme can't be started now, or null. vm from MieleTracker, family from familyOf.
export function startBlock(vm, family, roles, list) {
  if (!vm || vm.state === "offline" || vm.connection === "lost") return "offline";
  if (family.group === "drawer" || (list && !list.length)) return "no_programs";
  if (["running", "paused", "scheduled"].includes(vm.state)) return "busy";
  if (!roles.mobile_start) return "no_remote";
  if (vm.flags?.mobileStart !== true) return "mobile_start";
  if (!list) return "no_list";
  return null;
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const onStep = (v, t) => clamp(t.min + Math.round((v - t.min) / t.step) * t.step, t.min, t.max);
export const isMicrowave = p => /microwave/.test(p.key ?? slug(p.name));

// Starting values for an oven programme: what was used last time, else a usual temperature for the kind of
// programme. Microwave programmes need a time (2 min to start with); the others run until stopped unless one is set.
export function defaultsFor(p, last) {
  const k = p.key ?? slug(p.name);
  const want = /sous_vide/.test(k) ? 60 : /steam/.test(k) ? 100 : /defrost/.test(k) ? p.temp?.max : 180;
  const temperature = p.temp ? onStep(last?.temperature ?? want, p.temp) : null;
  let time = last?.minutes ?? (isMicrowave(p) ? 2 : 0);
  if (p.dur && time) time = clamp(time, p.dur.min, p.dur.max);
  return { temperature, minutes: p.dur ? time : 0 };
}

// A step for the duration buttons: by the minute up to 10 min, by 5 up to an hour, then by 15.
export function stepTime(m, dir, dur, allowNone) {
  const lo = allowNone ? 0 : dur.min;
  if (dir > 0) return m === 0 ? dur.min : clamp(m + (m < 10 ? 1 : m < 60 ? 5 : 15), lo, dur.max);
  const next = m <= dur.min ? 0 : m - (m <= 10 ? 1 : m <= 60 ? 5 : 15);
  return clamp(next < dur.min ? (allowNone ? 0 : dur.min) : next, lo, dur.max);
}

// [domain, service, data] for the start. Ovens take set_program_oven with the temperature and an optional time.
export function startCall(deviceId, family, p, values = {}) {
  if (family.group !== "oven") return ["miele", "set_program", { device_id: deviceId, program_id: p.id }];
  const data = { device_id: deviceId, program_id: p.id };
  if (p.temp && values.temperature != null) data.temperature = values.temperature;
  if (p.dur && values.minutes > 0) data.duration = { hours: Math.floor(values.minutes / 60), minutes: values.minutes % 60 };
  return ["miele", "set_program_oven", data];
}

// Cache in the browser, per appliance: the list survives a reload and shows while the appliance can't answer.
const KEY = id => `miele-programmes:${id}`;
export function readCache(storage, deviceId) {
  try { const c = JSON.parse(storage?.getItem(KEY(deviceId)) ?? "null"); return c && Array.isArray(c.programs) ? c : null; }
  catch { return null; }
}
export function writeCache(storage, deviceId, response, at) {
  try { storage?.setItem(KEY(deviceId), JSON.stringify({ at, programs: response?.programs ?? [] })); } catch { /* private mode, full */ }
}
const LAST = (id, pid) => `miele-programmes:${id}:last:${pid}`;
export function readLast(storage, deviceId, pid) {
  try { return JSON.parse(storage?.getItem(LAST(deviceId, pid)) ?? "null"); } catch { return null; }
}
export function writeLast(storage, deviceId, pid, values) {
  try { storage?.setItem(LAST(deviceId, pid), JSON.stringify(values)); } catch { /* no storage */ }
}

// Which icon a programme gets, by its key.
const ICONS = [
  [/tea/, "mdi:tea"], [/hot_water|very_hot_water/, "mdi:cup-water"], [/milk/, "mdi:cup-outline"],
  [/ristretto|espresso|coffee|cappuccino|latte|caffe|cafe|americano|black$|flat_white|macchiato/, "mdi:coffee"],
  [/microwave/, "mdi:microwave"], [/sous_vide/, "mdi:thermometer-water"], [/steam/, "mdi:pot-steam-outline"], [/defrost/, "mdi:snowflake-melt"],
  [/grill/, "mdi:grill-outline"], [/roast/, "mdi:food-drumstick-outline"], [/fan_plus|fan_heat/, "mdi:fan"],
  [/heat|bake|cake/, "mdi:heating-coil"], [/cups|glasses/, "mdi:cup-outline"], [/dishes|plates/, "mdi:circle-double"], [/keep_warm/, "mdi:heat-wave"],
  [/eco/, "mdi:leaf"], [/hygiene/, "mdi:shield-check-outline"], [/cotton/, "mdi:tshirt-crew-outline"], [/minimum_iron|shirts|smoothing/, "mdi:hanger"],
  [/wool/, "mdi:sheep"], [/silk|delicate/, "mdi:feather"], [/denim|jeans/, "mdi:hanger"], [/quick|express/, "mdi:lightning-bolt-outline"],
  [/freshen|warm_air/, "mdi:weather-windy"], [/cool_air/, "mdi:snowflake"], [/drain|spin/, "mdi:rotate-right"], [/rinse/, "mdi:water-outline"],
  [/duvet|pillow|bed/, "mdi:bed-outline"], [/sport|outdoor/, "mdi:run"], [/towel/, "mdi:rug"], [/automatic/, "mdi:autorenew"],
];
export function iconFor(p, group) {
  const k = p.key ?? slug(p.name);
  return ICONS.find(([re]) => re.test(k))?.[1]
    ?? { laundry: "mdi:washing-machine", oven: "mdi:stove", coffee: "mdi:coffee-maker-outline", drawer: "mdi:tray" }[group] ?? "mdi:play-circle-outline";
}
