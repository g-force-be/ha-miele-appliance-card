// Builds dev/data/demo-registry.json: Miele appliances Peter doesn't have, with the entities the core integration
// (2026.10) creates for them (sensor.py, binary_sensor.py, button.py, switch.py, light.py, fan.py, climate.py,
// vacuum.py, select.py): same domains, translation keys and enum options. Synthetic: for the harness and the tests.
//   node dev/data/make-demo.mjs
import fs from "node:fs";

const STATUS = ["off", "on", "programmed", "waiting_to_start", "in_use", "pause", "program_ended", "program_interrupted", "idle",
  "rinse_hold", "service", "superfreezing", "supercooling", "superheating", "supercooling_superfreezing", "autocleaning", "not_connected", "failure"];
const PLATE = ["plate_step_0", "plate_step_warming", ...Array.from({ length: 18 }, (_, i) => `plate_step_${i + 1}`), "plate_step_boost", "plate_step_boost_2"];
const PROGRAMS = {
  washer: ["no_program", "cottons", "minimum_iron", "delicates", "woollens", "eco_40_60", "quick_power_wash", "express_20", "rinse", "drain_spin"],
  dryer: ["no_program", "cottons", "minimum_iron", "woollens_handcare", "warm_air", "cool_air", "express"],
  dishwasher: ["no_program", "intensive", "eco", "automatic", "gentle", "extra_quiet", "hygiene", "quick_power_wash", "power_wash", "tall_items"],
  oven: ["no_program", "fan_plus", "conventional_heat", "intensive_bake", "auto_roast", "fan_grill", "eco_fan_heat", "top_heat", "bottom_heat", "steam_cooking", "microwave", "microwave_fan_plus", "defrost"],
  coffee: ["no_program", "ristretto", "espresso", "coffee", "long_coffee", "cappuccino", "latte_macchiato", "hot_water", "milk_foam", "herbal_tea"],
  vacuum: ["no_program", "auto", "spot", "turbo", "silent"],
};
const PHASES = {
  washer: ["not_running", "pre_wash", "soak", "main_wash", "rinse", "rinse_hold", "cleaning", "cooling_down", "drain", "spin", "anti_crease", "finished", "drying"],
  dryer: ["not_running", "program_running", "drying", "machine_iron", "hand_iron_2", "normal", "normal_plus", "cooling_down", "hand_iron_1", "anti_crease", "finished", "extra_dry", "hand_iron", "smoothing", "slightly_dry", "safety_cooling"],
  dishwasher: ["not_running", "reactivating", "pre_dishwash", "main_dishwash", "rinse", "interim_rinse", "final_rinse", "drying", "finished"],
  oven: ["not_running", "heating_up", "process_running", "process_finished", "energy_save", "pre_heating"],
  coffee: ["not_running", "heating_up", "espresso", "hot_milk", "milk_foam", "dispensing", "pre_brewing", "grinding", "rinse", "process_finished"],
  vacuum: ["not_running", "vacuum_cleaning", "returning", "vacuum_cleaning_paused", "going_to_target_area", "docked", "remote_controlled", "wheel_lifted", "dirty_sensors"],
};

// Which entities each type gets, as role specs: [domain, translation_key | null, extra attributes, suffix]
const COMMON = [["sensor", "status", { device_class: "enum", options: STATUS }], ["binary_sensor", "remote_control", {}], ["binary_sensor", "mobile_start", {}],
  ["binary_sensor", null, { device_class: "problem" }, "problem"], ["switch", "power", {}]];
const RUN = kind => [["sensor", "program_id", { device_class: "enum", options: PROGRAMS[kind] }], ["sensor", "program_phase", { device_class: "enum", options: PHASES[kind] }],
  ["sensor", "remaining_time", { unit_of_measurement: "min", device_class: "duration" }], ["sensor", "elapsed_time", { unit_of_measurement: "min", device_class: "duration" }],
  ["sensor", "start_time", { unit_of_measurement: "h", device_class: "duration" }], ["sensor", "finish", { device_class: "timestamp" }],
  ["sensor", "start", { device_class: "timestamp" }]];
const BUTTONS = [["button", "start", {}], ["button", "stop", {}], ["button", "pause", {}]];
const DOOR = [["binary_sensor", null, { device_class: "door" }, "door"]];
const TEMP = [["sensor", null, { device_class: "temperature", unit_of_measurement: "°C" }, "temperature"]];
const TARGET = [["sensor", "target_temperature", { device_class: "temperature", unit_of_measurement: "°C" }]];
const climate = (tk, cur, target, min, max) => ["climate", tk, { hvac_modes: ["cool"], current_temperature: cur, temperature: target, min_temp: min, max_temp: max, target_temp_step: 1 }, tk ?? "zone_1"];

const TYPES = {
  washer: [...COMMON, ...RUN("washer"), ...BUTTONS.slice(0, 2), ...DOOR, ...TARGET, ["sensor", "spin_speed", { unit_of_measurement: "rpm" }]],
  washer_dryer: [...COMMON, ...RUN("washer"), ...DOOR, ...TARGET, ["sensor", "spin_speed", { unit_of_measurement: "rpm" }],
    ["sensor", "drying_step", { device_class: "enum", options: ["extra_dry", "normal_plus", "normal", "slightly_dry", "hand_iron_1", "hand_iron_2", "machine_iron", "smoothing"] }]],
  dryer: [...COMMON, ...RUN("dryer"), ...DOOR, ["sensor", "drying_step", { device_class: "enum", options: ["extra_dry", "normal_plus", "normal", "slightly_dry", "hand_iron_1", "hand_iron_2", "machine_iron", "smoothing"] }]],
  dishwasher: [...COMMON, ...RUN("dishwasher"), ...BUTTONS, ...DOOR, ["binary_sensor", "smart_grid", {}]],
  oven: [...COMMON, ...RUN("oven"), ...BUTTONS.slice(0, 2), ...DOOR, ...TEMP, ...TARGET, ["light", "light", {}]],
  coffee: [...COMMON, ["sensor", "program_id", { device_class: "enum", options: PROGRAMS.coffee }], ["sensor", "program_phase", { device_class: "enum", options: PHASES.coffee }], ["light", "light", {}]],
  hob: zones => [...COMMON.slice(0, 1), ...Array.from({ length: zones }, (_, i) => ["sensor", "plate", { device_class: "enum", options: PLATE, friendly_name: `Kookzone ${i + 1}` }, `plate_${i + 1}`])],
  hood: [...COMMON, ["fan", "fan", { percentage: 0, percentage_step: 25, preset_modes: null }], ["light", "light", {}], ["light", "ambient_light", {}]],
  fridge_freezer: [...COMMON.slice(0, 4), ...DOOR, ...TEMP, ["sensor", "temperature_zone_2", { device_class: "temperature", unit_of_measurement: "°C" }],
    climate(null, 4, 4, 1, 9), climate("zone_2", -18, -18, -26, -16), ["switch", "supercooling", {}], ["switch", "superfreezing", {}]],
  wine: [...COMMON.slice(0, 4), ...DOOR, ...TEMP, ["sensor", "temperature_zone_2", { device_class: "temperature", unit_of_measurement: "°C" }],
    ["sensor", "temperature_zone_3", { device_class: "temperature", unit_of_measurement: "°C" }], climate(null, 8, 8, 5, 20), climate("zone_2", 12, 12, 5, 20),
    climate("zone_3", 16, 16, 5, 20), ["light", "light", {}]],
  vacuum: [...COMMON.slice(0, 4), ["sensor", "program_id", { device_class: "enum", options: PROGRAMS.vacuum }], ["sensor", "program_phase", { device_class: "enum", options: PHASES.vacuum }],
    ["sensor", null, { device_class: "battery", unit_of_measurement: "%" }, "battery"], ["vacuum", "vacuum", { fan_speed_list: ["normal", "turbo", "silent"], fan_speed: "normal" }]],
};

// [id, name, HA model (appliance type), model_id (techType), kind]
const DEVICES = [
  ["demo_washer_white", "Demo W1 White Edition", "Washing machine", "WSG883", "washer"],
  ["demo_washer_mtouch", "Demo W1 M Touch", "Washing machine", "WWV980", "washer"],
  ["demo_dryer_mtouch", "Demo T1 M Touch", "Tumble dryer", "TWV780WP", "dryer"],
  ["demo_washer_dryer", "Demo WT1", "Washer dryer", "WTR870", "washer_dryer"],
  ["demo_dish_integrated", "Demo G 7000 SCVi", "Dishwasher", "G7980SCVi", "dishwasher"],
  ["demo_dish_semi", "Demo G 7000 SCi", "Dishwasher", "G7310SCi", "dishwasher"],
  ["demo_dish_free", "Demo G 7000 SC", "Dishwasher", "G7110SC", "dishwasher"],
  ["demo_oven", "Demo H 7464 BP", "Oven", "H7464BP", "oven"],
  ["demo_oven_mtouch", "Demo H 7860 BP", "Oven", "H7860BP", "oven"],
  ["demo_oven_artline", "Demo H 7464 BPX", "Oven", "H7464BPX", "oven"],
  ["demo_oven_active", "Demo H 2465 BP", "Oven", "H2465BP", "oven"],
  ["demo_dialog", "Demo DO 7860", "Dialog oven", "DO7860", "oven"],
  ["demo_steam_vitro", "Demo DGC 7440 HC", "Steam oven combi", "DGC7440HC", "oven"],
  ["demo_micro_vitro", "Demo H 7840 BM", "Oven microwave", "H7840BM", "oven"],
  ["demo_coffee_cm6", "Demo CM 6360", "Coffee system", "CM6360", "coffee"],
  ["demo_coffee_cva", "Demo CVA 7845", "Coffee system", "CVA7845", "coffee"],
  ["demo_hob", "Demo KM 7897 FL", "Hob", "KM7897FL", "hob6"],
  ["demo_hob_4", "Demo KM 7464 FR", "Hob", "KM7464FR", "hob4"],
  ["demo_hob_extr", "Demo KMDA 7774 FL", "Hob extraction", "KMDA7774FL", "hob5"],
  ["demo_hood", "Demo DA 6698 W", "Hood", "DA6698W", "hood"],
  ["demo_hood_aura", "Demo DA 7378 D", "Hood", "DA7378D", "hood"],
  ["demo_fridge_int", "Demo KFN 7774 D", "Fridge freezer", "KFN7774D", "fridge_freezer"],
  ["demo_fridge_free", "Demo KFN 4795 CD", "Fridge freezer", "KFN4795CD", "fridge_freezer"],
  ["demo_wine", "Demo KWT 6834 SGS", "Wine cabinet", "KWT6834SGS", "wine"],
  ["demo_robot", "Demo Scout RX3", "Robot vacuum cleaner", "RX3", "vacuum"],
];

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "_");
const out = { _about: "Synthetic Miele appliances Peter doesn't have, built by dev/data/make-demo.mjs with the entities HA's core miele integration (2026.10) creates for each type. For the harness (?demo=1) and the tests.",
  areas: { demo: { area_id: "demo", name: "Demo" } }, devices: {}, entities: [], attributes: {} };
for (const [id, name, model, modelId, kind] of DEVICES) {
  out.devices[id] = { id, name, name_by_user: null, model, model_id: modelId, manufacturer: "Miele", area_id: "demo" };
  const specs = kind.startsWith("hob") ? TYPES.hob(Number(kind.slice(3))) : TYPES[kind];
  const base = slug(name.replace(/^Demo /, "demo "));
  for (const [domain, tk, attrs, suffix] of specs) {
    const eid = `${domain}.${base}${tk === "status" ? "" : `_${suffix ?? tk}`}`;
    out.entities.push({ entity_id: eid, platform: "miele", device_id: id, translation_key: tk, has_entity_name: true, name: null });
    out.attributes[eid] = { friendly_name: `${name} ${suffix ?? tk ?? domain}`, ...attrs };
  }
}
fs.writeFileSync(new URL("./demo-registry.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`${DEVICES.length} demo appliances, ${out.entities.length} entities`);
