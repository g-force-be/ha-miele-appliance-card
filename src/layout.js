// Layouts for miele-overview-card (SPEC §8): which appliances, in which blocks, with which card options.
// Pure functions on scanned devices and their card states, so the editor, the card and the tests share them.
//
//   const plan = planLayout(devices, config, states);
//   plan.blocks = [{ title, kind: "row" | "column" | "grid", items: [{ dev, entity, appliance: {...}, programmes: {...} | null }] }]

export const PRESETS = ["rooms", "grid", "active", "phone", "display"];

// The order within a room: a built-in column top to bottom (ovens, the combi with microwave, the drawer), then the
// washer before the dryer, then the rest.
const KIND_ORDER = { oven: 0, steam_oven: 1, steam_oven_combi: 1, dialog_oven: 2, steam_oven_micro: 3, oven_microwave: 3, microwave: 4,
  drawer: 9, washer: 10, washer_dryer: 11, dryer: 12, dishwasher: 13, coffee: 14 };
// Most going on first: running, then waiting/finished, then switched on, then off.
const BUSY = { running: 0, paused: 0, scheduled: 1, ready: 1, done: 2, interrupted: 2, error: 2, standby: 3, off: 4, offline: 5 };
// Drawing widths that keep a card inside the kitchen display's 600 px height.
const DISPLAY_WIDTH = { laundry: "280px", oven: "400px", coffee: "300px", drawer: "400px", other: "320px" };

const statusEntity = dev => dev.roles.status;
const canStart = dev => ["laundry", "oven", "coffee"].includes(dev.family.group);

// The appliances list a fresh config starts from ("Stel layout voor"): every Miele appliance, built-ins in column
// order, with the front colour of its family and a programmes card where starting is possible.
export function suggestAppliances(devices) {
  return [...devices]
    .sort((a, b) => String(a.areaId ?? "~").localeCompare(String(b.areaId ?? "~"))
      || (KIND_ORDER[a.family.kind] ?? 20) - (KIND_ORDER[b.family.kind] ?? 20) || a.name.localeCompare(b.name))
    .map(dev => ({ entity: statusEntity(dev), programmes: canStart(dev) }));
}

// Config entries matched to scanned devices, in the config's order; appliances not in the config follow
// (a new appliance shows up without editing). Entries can name the appliance by entity or device_id.
export function resolveAppliances(devices, config, hass, { all = false } = {}) {
  const byEntity = new Map(devices.flatMap(d => Object.values(d.roles).map(e => [e, d])));
  const byId = new Map(devices.map(d => [d.id, d]));
  const seen = new Set(), out = [];
  for (const a of config.appliances ?? []) {
    const dev = (a.device_id && byId.get(a.device_id)) || byEntity.get(a.entity)
      || (a.entity && byId.get(hass?.entities?.[a.entity]?.device_id));
    if (!dev || seen.has(dev.id)) continue;
    seen.add(dev.id);
    out.push({ dev, opts: a });
  }
  for (const s of suggestAppliances(devices.filter(d => !seen.has(d.id))))
    out.push({ dev: byEntity.get(s.entity), opts: { ...s, auto: true } });
  return all ? out : out.filter(x => x.opts.show !== false);
}

const isActive = state => state && state !== "off" && state !== "offline";

// The card configs for one appliance in a preset.
function cards(dev, opts, preset, config) {
  const common = {};
  for (const k of ["theme", "language", "accent", "animations"]) if (config[k] != null) common[k] = config[k];
  for (const k of ["name", "finish", "accent"]) if (opts[k] != null) common[k] = opts[k];
  const entity = statusEntity(dev);
  const appliance = { type: "custom:miele-appliance-card", entity, ...common };
  if (preset === "phone") appliance.max_width = "250px";
  if (preset === "display") {
    Object.assign(appliance, { controls: false, animations: "reduced", big_countdown: true, max_width: DISPLAY_WIDTH[dev.family.group] ?? DISPLAY_WIDTH.other });
  }
  let programmes = null;
  if (preset !== "display" && (opts.programmes ?? canStart(dev)) && canStart(dev)) {
    programmes = { type: "custom:miele-programmes-card", entity, collapsed: true };
    for (const k of ["theme", "language", "accent", "name"]) if (common[k] != null) programmes[k] = common[k];
    if (opts.programs?.length) programmes.programs = opts.programs;
  }
  return { appliance, programmes };
}

// The plan for one moment. `states` maps device id → card state ("running", "off", …) for the presets that sort
// or filter on it. `areas` is hass.areas, for room titles.
export function planLayout(devices, config = {}, states = {}, { areas = {}, hass } = {}) {
  const preset = PRESETS.includes(config.layout) ? config.layout : "rooms";
  let list = resolveAppliances(devices, config, hass);
  const rank = x => BUSY[states[x.dev.id]] ?? 4;
  if (preset === "active" || preset === "display") list = list.filter(x => isActive(states[x.dev.id]));
  if (preset === "active" || preset === "phone" || preset === "display") list = [...list].sort((a, b) => rank(a) - rank(b));
  const item = (x, wall) => {
    const it = { dev: x.dev, entity: statusEntity(x.dev), ...cards(x.dev, x.opts, preset, config) };
    // under a built-in column the folded programmes cards say which appliance they belong to
    if (wall && it.programmes) it.programmes.show_name = true;
    return it;
  };

  if (preset !== "rooms") {
    return { preset, blocks: list.length ? [{ title: null, kind: preset === "phone" ? "column" : "grid", items: list.map(x => item(x)) }] : [], quiet: !list.length };
  }

  // per room: laundry side by side; built-ins as one column (a real built-in wall) with the freestanding coffee
  // machine next to it; the rest in a row
  const rooms = new Map();
  for (const x of list) {
    const key = x.dev.areaId ?? `~${x.dev.family.group === "laundry" ? "laundry" : "kitchen"}`;
    if (!rooms.has(key)) rooms.set(key, []);
    rooms.get(key).push(x);
  }
  const blocks = [];
  for (const [key, xs] of rooms) {
    const title = areas[key]?.name ?? (key.startsWith("~") ? null : key);
    const builtIn = xs.filter(x => x.dev.family.builtIn), loose = xs.filter(x => !x.dev.family.builtIn);
    const parts = [];
    if (builtIn.length) parts.push({ kind: "column", items: builtIn.map(x => item(x, true)) });
    if (loose.length) parts.push({ kind: "row", items: loose.map(x => item(x)) });
    blocks.push({ title, key, kind: "room", parts });
  }
  return { preset, blocks, quiet: !list.length };
}

// "Kopieer als losse kaarten": the plan as plain cards for a sections view, one section per block.
export function exportCards(plan) {
  const items = b => b.parts ? b.parts.flatMap(p => p.items) : b.items;
  return plan.blocks.map(b => ({
    type: "grid",
    cards: [
      ...(b.title ? [{ type: "heading", heading: b.title }] : []),
      ...items(b).flatMap(it => [it.appliance, ...(it.programmes ? [it.programmes] : [])]),
    ],
  }));
}

