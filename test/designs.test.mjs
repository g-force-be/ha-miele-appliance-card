// M5: design lines from the type number, the drawings per family, and the values hobs, hoods, fridges and the
// robot report (demo appliances from dev/data/demo-registry.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { familyOf, deviceRoles, readSnapshot, plateLevel } from "../src/miele-model.js";
import { designOf, drawingFor } from "../src/drawings/index.js";
import { ovenPanel } from "../src/drawings/oven.js";
import { hobZoneCount } from "../src/drawings/hob.js";

const demo = JSON.parse(fs.readFileSync(new URL("../dev/data/demo-registry.json", import.meta.url), "utf8"));
const hassFor = (states = {}) => ({
  entities: Object.fromEntries(demo.entities.map(e => [e.entity_id, e])),
  states: Object.fromEntries(demo.entities.map(e => [e.entity_id, { entity_id: e.entity_id, state: states[e.entity_id] ?? "unknown",
    attributes: demo.attributes[e.entity_id] ?? {}, last_changed: "2026-10-12T10:00:00Z" }])),
});
const drawingOf = (model, id) => familyOf(model, id).drawing;
const design = (model, id) => designOf(drawingOf(model, id), undefined, id);

test("Peter's appliances keep their drawings and lines", () => {
  assert.equal(design("Washing machine", "WEI895"), "chrome");
  assert.equal(design("Tumble dryer", "TEF775WP"), "chrome");
  assert.equal(design("Steam oven combi", "DGC7845X"), "artline");
  assert.equal(design("Oven microwave", "H7440BMX"), "artline");
  assert.equal(design("Coffee system", "CM7750"), "cm7");
  assert.equal(ovenPanel("DGC7845X"), "mtouch");
  assert.equal(ovenPanel("H7440BMX"), "direct");
});

test("laundry: White Edition, M Touch", () => {
  assert.equal(design("Washing machine", "WSG883"), "white");
  assert.equal(design("Washing machine", "WWD164"), "white");
  assert.equal(design("Washing machine", "WWV980"), "mtouch");
  assert.equal(design("Tumble dryer", "TWV780WP"), "mtouch");
  assert.equal(design("Washer dryer", "WTR870"), "mtouch");
  assert.equal(design("Washer dryer", "WTD160"), "chrome");
  assert.equal(drawingOf("Washer dryer", "WTD160"), "washer_dryer");
});

test("dishwashers by their suffix, integrated when there is none", () => {
  assert.equal(design("Dishwasher", "G7980SCVi"), "integrated");
  assert.equal(design("Dishwasher", "G7310SCi"), "semi");
  assert.equal(design("Dishwasher", "G7110SC"), "freestanding");
  assert.equal(design("Dishwasher", "G7310"), "integrated");
});

test("ovens: line and control strip from the type number", () => {
  assert.equal(design("Oven", "H7464BP"), "vitroline");
  assert.equal(design("Oven", "H7464BPX"), "artline");
  assert.equal(design("Oven", "H7164BP"), "contourline");
  assert.equal(design("Oven", "H2465BP"), "active");
  assert.equal(design("Steam oven combi", "DGC7440HC"), "vitroline");
  assert.equal(design("Steam oven combi", "DGC7440HCXPRO"), "artline");
  assert.deepEqual(["H7164BP", "H7464BP", "H7660BP", "H7860BP", "H2465BP", "DO7860"].map(ovenPanel), ["directS", "direct", "mtouchS", "mtouch", "knobs", "mtouch"]);
  assert.equal(drawingOf("Dialog oven", "DO7860"), "oven");
  // a configured line wins, an unknown one falls back to the guess
  assert.equal(designOf("oven", "pureline", "H7464BP"), "pureline");
  assert.equal(designOf("oven", "nonsense", "H7464BPX"), "artline");
});

test("coffee, hob, hood, cooling, robot: drawings and lines", () => {
  assert.equal(design("Coffee system", "CM6360"), "cm6");
  assert.equal(drawingOf("Coffee system", "CVA7845"), "coffee_builtin");
  assert.equal(design("Hob extraction", "KMDA7774FL"), "extractor");
  assert.equal(design("Hob", "KM7897FL"), "induction");
  assert.deepEqual(["KM7897FL", "KM7699", "KMDA7774FL", "KM7464FR"].map(hobZoneCount), [6, 5, 5, 4]);
  assert.equal(design("Hood", "DA7378D"), "aura");
  assert.equal(design("Hood", "DA6698W"), "wall");
  assert.equal(design("Fridge freezer", "KFN4795CD"), "freestanding");
  assert.equal(design("Fridge freezer", "KFN7774D"), "integrated");
  assert.equal(design("Wine cabinet", "KWT6834SGS"), "freestanding");
  assert.equal(design("Wine cabinet", "KWT6422iG"), "integrated");
  assert.equal(drawingOf("Robot vacuum cleaner", "RX3"), "robot");
  for (const id of ["dishwasher", "oven", "hob", "hood", "fridge", "wine", "robot", "coffee_builtin"])
    assert.match(drawingFor(id, undefined, "X").svg("t"), /^<svg/, `${id} draws`);
});

test("hob zone levels as the hob shows them", () => {
  assert.deepEqual(plateLevel("plate_step_0"), { level: 0, text: "0" });
  assert.deepEqual(plateLevel("plate_step_12"), { level: 12 / 18, text: "6" });
  assert.deepEqual(plateLevel("plate_step_5"), { level: 5 / 18, text: "2." });
  assert.equal(plateLevel("plate_step_boost").text, "B");
  assert.equal(plateLevel("plate_step_warming").text, "w");
  assert.equal(plateLevel(null).level, 0);
});

test("hob zones are numbered from their names, not their order", () => {
  const hass = hassFor();
  const ids = demo.entities.filter(e => e.device_id === "demo_hob" && e.translation_key === "plate").map(e => e.entity_id);
  // shuffle the registry order: the numbers in the names still decide
  const shuffled = { ...hass, entities: Object.fromEntries([...ids].reverse().map(id => [id, hass.entities[id]]).concat(
    Object.entries(hass.entities).filter(([id]) => !ids.includes(id)))) };
  const roles = deviceRoles(shuffled, "demo_hob");
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(i => roles[`plate_${i}`]), ids);
});

test("snapshot: hood fan, fridge zones and SuperCool, robot", () => {
  const hood = deviceRoles(hassFor(), "demo_hood");
  const s1 = readSnapshot({ states: { ...hassFor().states, [hood.fan]: { state: "on", attributes: { percentage: 75 } } } }, hood);
  assert.deepEqual(s1.fan, { on: true, pct: 75 });
  const fr = deviceRoles(hassFor(), "demo_fridge_int");
  const s2 = readSnapshot(hassFor({ [fr.temp]: "4", [fr.temp_2]: "-18", [fr.supercooling]: "on" }), fr);
  assert.equal(s2.temp, 4); assert.equal(s2.temp2, -18); assert.equal(s2.supercooling, true);
  assert.deepEqual(s2.thermo.map(z => z.target), [4, -18]);
  const rb = deviceRoles(hassFor(), "demo_robot");
  const s3 = readSnapshot(hassFor({ [rb.vacuum]: "cleaning", [rb.battery]: "57" }), rb);
  assert.equal(s3.vacuum, "cleaning"); assert.equal(s3.battery, 57); assert.equal(s3.fanSpeed, "normal");
});
