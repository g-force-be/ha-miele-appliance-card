// The overview card's layouts and the export to separate cards, on Peter's six appliances.
import { test } from "node:test";
import assert from "node:assert/strict";
import { registry, translations } from "./support.mjs";
import { createMockHass } from "../dev/mock-hass.js";
import { scanDevices } from "../src/miele-model.js";
import { suggestAppliances, planLayout, exportCards, resolveAppliances } from "../src/layout.js";
import { toYaml } from "../src/ui/yaml.js";

const hass = createMockHass({ registry, translations, states: {} });
const devices = scanDevices(hass);
const E = { washer: "sensor.miele_washing_machine", dryer: "sensor.miele_tumble_dryer", steam: "sensor.miele_steam_oven",
  micro: "sensor.miele_microwave_oven", drawer: "sensor.miele_warming_drawer", coffee: "sensor.miele_coffee_machine" };
const idOf = e => hass.entities[e].device_id;
const states = (on = {}) => Object.fromEntries(devices.map(d => [d.id, on[d.roles.status] ?? "off"]));
const entities = items => items.map(i => i.entity);

test("suggested order: per room, washer before dryer, the built-in column top to bottom, then the coffee machine", () => {
  const s = suggestAppliances(devices);
  assert.deepEqual(s.map(x => x.entity), [E.washer, E.dryer, E.steam, E.micro, E.drawer, E.coffee]);
  assert.deepEqual(s.map(x => x.programmes), [true, true, true, true, false, true], "no programmes card for the drawer");
});

test("per room: laundry side by side, the built-in column with the coffee machine next to it", () => {
  const plan = planLayout(devices, { layout: "rooms" }, states(), { areas: hass.areas, hass });
  assert.deepEqual(plan.blocks.map(b => b.title), ["Bijkeuken", "Keuken"]);
  const [laundry, kitchen] = plan.blocks;
  assert.deepEqual(laundry.parts.map(p => [p.kind, entities(p.items)]), [["row", [E.washer, E.dryer]]]);
  assert.deepEqual(kitchen.parts.map(p => [p.kind, entities(p.items)]), [["column", [E.steam, E.micro, E.drawer]], ["row", [E.coffee]]]);
  const steam = kitchen.parts[0].items[0];
  assert.equal(steam.programmes.collapsed, true);
  assert.equal(steam.programmes.show_name, true, "programmes under the column say whose they are");
  assert.equal(kitchen.parts[0].items[2].programmes, null);
  assert.equal(laundry.parts[0].items[0].programmes.show_name, undefined);
});

test("only active: what is on, the busiest first; nothing on is quiet", () => {
  const on = { [E.dryer]: "running", [E.coffee]: "standby", [E.steam]: "done" };
  const plan = planLayout(devices, { layout: "active" }, states(on), { hass });
  assert.deepEqual(entities(plan.blocks[0].items), [E.dryer, E.steam, E.coffee]);
  const quiet = planLayout(devices, { layout: "active" }, states(), { hass });
  assert.equal(quiet.quiet, true);
  assert.deepEqual(quiet.blocks, []);
});

test("kitchen display: no buttons, no programmes, large countdown, drawings that fit 600 px", () => {
  const plan = planLayout(devices, { layout: "display" }, states({ [E.washer]: "running", [E.micro]: "paused" }), { hass });
  const [w, m] = plan.blocks[0].items;
  assert.deepEqual([w.entity, m.entity], [E.washer, E.micro]);
  assert.equal(w.programmes, null);
  assert.equal(w.appliance.controls, false);
  assert.equal(w.appliance.big_countdown, true);
  assert.equal(w.appliance.animations, "reduced");
  assert.equal(w.appliance.max_width, "280px");
  assert.equal(m.appliance.max_width, "400px");
});

test("phone: one column, smaller drawings, everything with programmes folded", () => {
  const plan = planLayout(devices, { layout: "phone" }, states({ [E.coffee]: "running" }), { hass });
  assert.equal(plan.blocks[0].kind, "column");
  assert.equal(plan.blocks[0].items[0].entity, E.coffee, "busiest first");
  assert.equal(plan.blocks[0].items.length, 6);
  assert.equal(plan.blocks[0].items[0].appliance.max_width, "250px");
});

test("the config decides order, names, colours and what's hidden; any entity of an appliance names it", () => {
  const config = { layout: "grid", theme: "light", appliances: [
    { entity: E.coffee, name: "Koffie", finish: "graphite_grey" },
    { entity: "binary_sensor.miele_washing_machine_mobiel_starten" },
    { entity: E.drawer, show: false },
    { entity: "sensor.does_not_exist" },
  ] };
  const items = planLayout(devices, config, states(), { hass }).blocks[0].items;
  assert.deepEqual(entities(items), [E.coffee, E.washer, E.dryer, E.steam, E.micro], "the rest follows; the drawer is hidden");
  assert.equal(items[0].appliance.name, "Koffie");
  assert.equal(items[0].appliance.finish, "graphite_grey");
  assert.equal(items[0].appliance.theme, "light");
  assert.equal(items[0].programmes.theme, "light");
  assert.equal(resolveAppliances(devices, config, hass, { all: true }).length, 6, "the editor still lists the hidden one");
  const off = planLayout(devices, { appliances: [{ entity: E.washer, programmes: false, programs: ["cottons"] }] }, states(), { hass });
  assert.equal(off.blocks[0].parts[0].items[0].programmes, null);
  const fav = planLayout(devices, { appliances: [{ entity: E.washer, programs: ["cottons", "eco_40_60"] }] }, states(), { hass });
  assert.deepEqual(fav.blocks[0].parts[0].items[0].programmes.programs, ["cottons", "eco_40_60"]);
});

test("export: one section per room, the cards by entity, never by device id", () => {
  const plan = planLayout(devices, { layout: "rooms" }, states(), { areas: hass.areas, hass });
  const sections = exportCards(plan);
  assert.equal(sections.length, 2);
  assert.deepEqual(sections[0].cards.map(c => c.type), ["heading", "custom:miele-appliance-card", "custom:miele-programmes-card",
    "custom:miele-appliance-card", "custom:miele-programmes-card"]);
  const yaml = toYaml({ type: "sections", sections });
  assert.ok(!/device_id/.test(yaml));
  assert.match(yaml, /entity: sensor\.miele_washing_machine/);
  assert.match(yaml, /heading: Keuken/);
  assert.ok(!yaml.includes(idOf(E.washer)));
});

test("YAML: quotes what would read as something else", () => {
  assert.equal(toYaml({ a: "off", b: "280px", c: true, d: "custom:x", e: ["on", "x"] }), 'a: "off"\nb: "280px"\nc: true\nd: custom:x\ne: ["on", x]');
});
