// The programmes card's logic on the real miele.get_programs answers from Peter's HA (dev/data/programs.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { registry } from "./support.mjs";
import { familyOf } from "../src/miele-model.js";
import {
  slug, readPrograms, arrange, startBlock, defaultsFor, stepTime, startCall, readCache, writeCache, FAVOURITES, iconFor,
} from "../src/programs.js";

const programs = JSON.parse(fs.readFileSync(new URL("../dev/data/programs.json", import.meta.url), "utf8"));
const ID = { washer: "82ddfc7a46859e3c356f96713e446d32", steam: "b8ee6dfe5e0f82d19997caf1ab237969", micro: "eeef45e3b771421c2439c81f17581b33",
  coffee: "1f0fc39845233a82f0628ef7fb858053", drawer: "31c740bf126234441a0fd0e0f35dabfc" };
const options = name => registry.attributes[`sensor.miele_${name}_program`].options;
const list = (dev, name) => readPrograms({ programs: programs[ID[dev]] }, options(name));
const fam = dev => { const d = registry.devices[ID[dev]]; return familyOf(d.model, d.model_id); };
const vm = (state, mobileStart) => ({ state, connection: "ok", flags: { mobileStart } });

test("slug follows HA's keys", () => {
  assert.equal(slug("Caffè latte"), "caffe_latte");
  assert.equal(slug("Sous-vide"), "sous_vide");
  assert.equal(slug("ECO 40-60"), "eco_40_60");
  assert.equal(slug(" Drain/spin "), "drain_spin");
});

test("coffee: keys come from the name, IDs from the appliance (not HA's table)", () => {
  const l = list("coffee", "coffee_machine");
  assert.equal(l.length, 20, "the two nameless entries are left out");
  const ristretto = l.find(p => p.key === "ristretto"), latte = l.find(p => p.key === "caffe_latte");
  assert.equal(ristretto.id, 24001);   // HA's const says 24000
  assert.equal(latte.id, 24008);       // HA's const says 24009
  assert.ok(l.every(p => p.key), "every named drink matches a key");
  assert.equal(l[0].temp, null);
});

test("ovens: temperature and time ranges; a name HA doesn't know keeps no key", () => {
  const l = list("steam", "steam_oven");
  const fan = l.find(p => p.key === "fan_plus");
  assert.deepEqual(fan.temp, { min: 30, max: 225, step: 5 });
  assert.deepEqual(fan.dur, { min: 1, max: 720 });
  assert.deepEqual(l.find(p => p.key === "full_grill").temp, { min: 225, max: 225, step: 1 });
  const cake = l.find(p => p.name === "Cake plus");
  assert.equal(cake.key, null);
  const mw = list("micro", "microwave_oven").find(p => p.key === "microwave");
  assert.equal(mw.temp, null);
  assert.deepEqual(mw.dur, { min: 1, max: 60 }, "0:00 becomes the 1 minute HA accepts");
});

test("QuickPowerWash meets quick_power_wash", () => {
  const l = list("washer", "washing_machine");
  assert.equal(l.find(p => p.name === "QuickPowerWash").key, "quick_power_wash");
});

test("favourites first, in order; ones the appliance doesn't offer drop out", () => {
  const l = list("micro", "microwave_oven");
  const { favs, rest } = arrange(l, FAVOURITES.microwave);
  assert.deepEqual(favs.map(p => p.key), ["microwave", "fan_plus"]);
  assert.equal(favs.length + rest.length, l.length);
  assert.deepEqual(arrange(l, ["13"]).favs.map(p => p.key), ["fan_plus"], "a favourite can be Miele's number");
  const unknown = arrange(null, FAVOURITES.washer);
  assert.equal(unknown.favs.length, 10);
  assert.ok(unknown.favs.every(p => p.id == null), "without the list there is nothing to start with");
});

test("start only with Start op afstand on, nothing running, a list known", () => {
  const l = list("steam", "steam_oven"), roles = { mobile_start: "binary_sensor.x" };
  assert.equal(startBlock(vm("standby", false), fam("steam"), roles, l), "mobile_start");
  assert.equal(startBlock(vm("standby", true), fam("steam"), roles, l), null);
  assert.equal(startBlock(vm("running", true), fam("steam"), roles, l), "busy");
  assert.equal(startBlock({ ...vm("off", true), connection: "lost" }, fam("steam"), roles, l), "offline");
  assert.equal(startBlock(vm("off", true), fam("washer"), roles, null), "no_list");
  assert.equal(startBlock(vm("running", true), fam("drawer"), roles, []), "no_programs", "the drawer: no programmes, whatever it does");
  assert.equal(startBlock(vm("off", true), fam("washer"), {}, l), "no_remote");
  assert.equal(startBlock({ ...vm("ready", false), program: "fan_plus" }, fam("micro"), roles, l), "waiting", "set, waiting for Start on the oven");
  assert.equal(startBlock({ ...vm("ready", true), program: "fan_plus" }, fam("micro"), roles, l), null);
});

test("oven defaults: usual temperatures on the step, last values win, microwave needs a time", () => {
  const steam = list("steam", "steam_oven"), micro = list("micro", "microwave_oven");
  assert.deepEqual(defaultsFor(steam.find(p => p.key === "fan_plus")), { temperature: 180, minutes: 0 });
  assert.deepEqual(defaultsFor(steam.find(p => p.key === "steam_cooking")), { temperature: 100, minutes: 0 });
  assert.deepEqual(defaultsFor(steam.find(p => p.key === "sous_vide")), { temperature: 60, minutes: 0 });
  assert.deepEqual(defaultsFor(steam.find(p => p.key === "full_grill")), { temperature: 225, minutes: 0 });
  assert.deepEqual(defaultsFor(micro.find(p => p.key === "microwave")), { temperature: null, minutes: 2 });
  assert.deepEqual(defaultsFor(steam.find(p => p.key === "fan_plus"), { temperature: 203, minutes: 45 }), { temperature: 205, minutes: 45 });
});

test("time steps: none, then by 1, 5 and 15 minutes", () => {
  const dur = { min: 1, max: 720 };
  const up = m => stepTime(m, 1, dur, true), down = m => stepTime(m, -1, dur, true);
  assert.equal(up(0), 1);
  assert.equal(up(9), 10);
  assert.equal(up(10), 15);
  assert.equal(up(60), 75);
  assert.equal(down(15), 10);
  assert.equal(down(1), 0, "back to none");
  assert.equal(stepTime(1, -1, { min: 1, max: 60 }, false), 1, "a microwave keeps at least a minute");
  assert.equal(stepTime(60, 1, { min: 1, max: 60 }, false), 60);
});

test("what a start sends", () => {
  const steam = list("steam", "steam_oven"), coffee = list("coffee", "coffee_machine");
  const fan = steam.find(p => p.key === "fan_plus");
  assert.deepEqual(startCall(ID.steam, fam("steam"), fan, { temperature: 200, minutes: 90 }),
    ["miele", "set_program_oven", { device_id: ID.steam, program_id: 13, temperature: 200, duration: { hours: 1, minutes: 30 } }]);
  assert.deepEqual(startCall(ID.steam, fam("steam"), fan, { temperature: 180, minutes: 0 }),
    ["miele", "set_program_oven", { device_id: ID.steam, program_id: 13, temperature: 180 }], "no time: runs until stopped");
  assert.deepEqual(startCall(ID.coffee, fam("coffee"), coffee.find(p => p.key === "long_coffee")),
    ["miele", "set_program", { device_id: ID.coffee, program_id: 24004 }]);
});

test("cache survives bad storage", () => {
  const mem = new Map(), storage = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  writeCache(storage, "dev", { programs: programs[ID.coffee] }, 1000);
  assert.equal(readCache(storage, "dev").programs.length, 22);
  assert.equal(readCache(storage, "dev").at, 1000);
  mem.set("miele-programmes:bad", "{not json");
  assert.equal(readCache(storage, "bad"), null);
  const broken = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } };
  assert.equal(readCache(broken, "dev"), null);
  assert.doesNotThrow(() => writeCache(broken, "dev", {}, 1));
  assert.equal(readCache(null, "dev"), null);
});

test("icons by key, with a fallback per group", () => {
  assert.equal(iconFor({ key: "herbal_tea" }, "coffee"), "mdi:tea");
  assert.equal(iconFor({ key: "long_coffee" }, "coffee"), "mdi:coffee");
  assert.equal(iconFor({ key: "fan_plus" }, "oven"), "mdi:fan");
  assert.equal(iconFor({ key: null, name: "Cake plus" }, "oven"), "mdi:heating-coil");
  assert.equal(iconFor({ key: "bed_linen" }, "laundry"), "mdi:bed-outline");
  assert.equal(iconFor({ key: "something_new" }, "laundry"), "mdi:washing-machine");
});
