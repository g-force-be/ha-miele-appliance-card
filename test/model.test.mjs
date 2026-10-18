import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { registry, translations, play } from "./support.mjs";
import { createMockHass } from "../dev/mock-hass.js";
import {
  roleOf, deviceRoles, disabledControls, familyOf, scanDevices, cardState, toMinutes, readSnapshot, MieleTracker,
} from "../src/miele-model.js";

const WASHER = "82ddfc7a46859e3c356f96713e446d32", DRYER = "16dcdde6211a28156e33bc53c65c55e4", STEAM = "b8ee6dfe5e0f82d19997caf1ab237969",
  MICRO = "eeef45e3b771421c2439c81f17581b33", COFFEE = "1f0fc39845233a82f0628ef7fb858053", DRAWER = "31c740bf126234441a0fd0e0f35dabfc";

const mockStates = () => Object.fromEntries(registry.entities.map(e => [e.entity_id,
  { entity_id: e.entity_id, state: "unknown", attributes: registry.attributes[e.entity_id] ?? {}, last_changed: "2026-10-18T10:00:00Z" }]));
const hass = createMockHass({ registry, translations, states: mockStates() });

describe("roles", () => {
  test("washer: roles from translation_key, door/failure from device_class, no disabled buttons", () => {
    const r = deviceRoles(hass, WASHER);
    assert.deepEqual(r, {
      remote_control: "binary_sensor.miele_washing_machine_afstandsbediening", door: "binary_sensor.miele_washing_machine_deur",
      mobile_start: "binary_sensor.miele_washing_machine_mobiel_starten", notification: "binary_sensor.miele_washing_machine_notificatie_actief",
      failure: "binary_sensor.miele_washing_machine_probleem", smart_grid: "binary_sensor.miele_washing_machine_smart_grid",
      status: "sensor.miele_washing_machine", target_temp: "sensor.miele_washing_machine_doeltemperatuur",
      elapsed: "sensor.miele_washing_machine_elapsed_time", energy_forecast: "sensor.miele_washing_machine_energievoorspelling",
      energy: "sensor.miele_washing_machine_energy_consumption", finish: "sensor.miele_washing_machine_finish",
      program: "sensor.miele_washing_machine_program", phase: "sensor.miele_washing_machine_program_phase",
      program_type: "sensor.miele_washing_machine_program_type", remaining: "sensor.miele_washing_machine_remaining_time",
      spin_speed: "sensor.miele_washing_machine_spin_speed", start_ts: "sensor.miele_washing_machine_start",
      start_in: "sensor.miele_washing_machine_start_in", twindos_1: "sensor.miele_washing_machine_twindos_1_level",
      twindos_2: "sensor.miele_washing_machine_twindos_2_level", water: "sensor.miele_washing_machine_water_consumption",
      water_forecast: "sensor.miele_washing_machine_water_forecast", power: "switch.miele_washing_machine_power",
    });
  });

  test("steam oven: measured and target temperature are told apart although both are called 'Temperatuur'", () => {
    const r = deviceRoles(hass, STEAM);
    assert.equal(r.temp, "sensor.miele_steam_oven_temperatuur");
    assert.equal(r.target_temp, "sensor.miele_steam_oven_doeltemperatuur");
    assert.equal(r.core_temp, "sensor.miele_steam_oven_core_temperature");
    assert.equal(r.light, "light.miele_steam_oven_licht");
    assert.equal(r.btn_start, undefined);
  });

  test("dryer, coffee, drawer, microwave", () => {
    const d = deviceRoles(hass, DRYER);
    assert.equal(d.btn_pause, "button.miele_tumble_dryer_pauzeren");
    assert.equal(d.btn_start, "button.miele_tumble_dryer_starten");
    assert.equal(d.btn_stop, "button.miele_tumble_dryer_stoppen");
    assert.equal(d.drying_step, "sensor.miele_tumble_dryer_drying_step");
    const c = deviceRoles(hass, COFFEE);
    assert.equal(c.door, "binary_sensor.keuken_miele_coffee_machine_deur");   // renamed entity_id, still found
    assert.equal(c.remaining, undefined);
    assert.equal(c.light, "light.miele_coffee_machine_licht");
    const w = deviceRoles(hass, DRAWER);
    assert.equal(w.temp, "sensor.miele_warming_drawer_temperatuur");
    assert.equal(w.smart_grid, undefined);
    assert.equal(deviceRoles(hass, MICRO).target_temp, "sensor.miele_microwave_oven_doeltemperatuur");
  });

  test("override from the card config wins", () => {
    assert.equal(deviceRoles(hass, WASHER, { overrides: { remaining: "sensor.x" } }).remaining, "sensor.x");
  });

  test("fallback without translation_key: unique_id suffix (admins)", () => {
    const keys = { "sensor.miele_washing_machine": "state_status", "sensor.miele_washing_machine_program": "state_program_id",
      "sensor.miele_washing_machine_program_phase": "state_program_phase", "sensor.miele_washing_machine_remaining_time": "state_remaining_time",
      "sensor.miele_washing_machine_elapsed_time": "state_elapsed_time", "sensor.miele_washing_machine_doeltemperatuur": "state_target_temperature",
      "binary_sensor.miele_washing_machine_mobiel_starten": "state_mobile_start", "switch.miele_washing_machine_power": "poweronoff" };
    const noTk = { ...hass, entities: Object.fromEntries(Object.entries(hass.entities).map(([k, e]) => [k, { ...e, translation_key: undefined }])) };
    const uniqueIds = Object.fromEntries(Object.entries(keys).map(([eid, k]) => [eid, `000187896956-${k}`]));
    const r = deviceRoles(noTk, WASHER, { uniqueIds });
    for (const [eid, key] of Object.entries(keys)) assert.equal(r[roleOf(eid, {}, null, `x-${key}`)], eid, key);
    assert.equal(r.door, "binary_sensor.miele_washing_machine_deur");
  });

  test("fallback without translation_key or unique_id: enum options and device_class", () => {
    const noTk = { ...hass, entities: Object.fromEntries(Object.entries(hass.entities).map(([k, e]) => [k, { ...e, translation_key: undefined }])) };
    const r = deviceRoles(noTk, DRYER);
    assert.equal(r.status, "sensor.miele_tumble_dryer");
    assert.equal(r.program, "sensor.miele_tumble_dryer_program");
    assert.equal(r.phase, "sensor.miele_tumble_dryer_program_phase");
    assert.equal(r.program_type, "sensor.miele_tumble_dryer_program_type");
    assert.equal(r.drying_step, "sensor.miele_tumble_dryer_drying_step");
    assert.equal(r.door, "binary_sensor.miele_tumble_dryer_deur");
  });

  test("disabled buttons come from the admin registry list", () => {
    assert.deepEqual(disabledControls(registry.disabled, WASHER), {
      btn_start: "button.miele_washing_machine_starten", btn_pause: "button.miele_washing_machine_pauzeren", btn_stop: "button.miele_washing_machine_stoppen" });
    assert.deepEqual(disabledControls(registry.disabled, DRYER), {});
  });

  test("scan finds Peter's six appliances with the right drawing", () => {
    const found = scanDevices(hass).map(d => [d.name, d.modelId, d.family.drawing, d.family.finish]);
    assert.deepEqual(found, [
      ["Miele Tumble Dryer", "TEF775WP", "dryer", "lotus_white"],
      ["Miele Washing Machine", "WEI895", "washer", "lotus_white"],
      ["Miele Coffee Machine", "CM7750", "coffee", "obsidian_black"],
      ["Miele Microwave Oven", "H7440BMX", "microwave", "obsidian_black"],
      ["Miele Steam Oven", "DGC7845X", "steam_oven", "obsidian_black"],
      ["Miele Warming Drawer", "ESW7020", "drawer", "obsidian_black"],
    ]);
  });
});

describe("families", () => {
  const f = (m, id) => { const x = familyOf(m, id); return [x.kind, x.drawing, x.builtIn]; };
  test("from the integration's model", () => {
    assert.deepEqual(f("Washing machine", "WEI895"), ["washer", "washer", false]);
    assert.deepEqual(f("Tumble dryer", "TEF775WP"), ["dryer", "dryer", false]);
    assert.deepEqual(f("Steam oven combi", "DGC7845X"), ["steam_oven_combi", "steam_oven", true]);
    assert.deepEqual(f("Oven microwave", "H7440BMX"), ["oven_microwave", "microwave", true]);
    assert.deepEqual(f("Coffee system", "CM7750"), ["coffee", "coffee", false]);
    assert.deepEqual(f("Coffee system", "CVA7845"), ["coffee", "coffee", true]);
    assert.deepEqual(f("Warming drawer", "ESW7020"), ["drawer", "drawer", true]);
    assert.deepEqual(f("Dishwasher", "G7310"), ["dishwasher", "generic", true]);
    assert.deepEqual(f("Washer dryer", "WTD160"), ["washer_dryer", "washer", false]);
    assert.deepEqual(f("Robot vacuum cleaner", "RX3"), ["vacuum", "generic", false]);
  });
  test("from the type number when the type is unknown", () => {
    assert.equal(familyOf("WWD660", "WWD660").kind, "washer");
    assert.equal(familyOf("WTH730", "WTH730").kind, "washer_dryer");
    assert.equal(familyOf("TWF760WP", "TWF760WP").kind, "dryer");
    assert.equal(familyOf("H7860BP", "H7860BP").kind, "oven");
    assert.equal(familyOf("M7244TC", "M7244TC").kind, "microwave");
    assert.equal(familyOf("DGM7840", "DGM7840").drawing, "microwave");
    assert.equal(familyOf("KFN7774", "KFN7774").kind, "fridge");
    assert.equal(familyOf("XYZ", null).drawing, "generic");
  });
});

describe("states and units", () => {
  test("status mapping", () => {
    const s = (status, extra = {}) => cardState({ status, phase: null, program: null, failure: false, ...extra }).state;
    assert.equal(s("off"), "off"); assert.equal(s("reserved"), "off");
    assert.equal(s("on"), "standby"); assert.equal(s("idle"), "standby");
    assert.equal(s("programmed"), "ready"); assert.equal(s("waiting_to_start"), "scheduled");
    assert.equal(s("in_use"), "running"); assert.equal(s("autocleaning"), "running"); assert.equal(s("rinse_hold"), "running");
    assert.equal(s("pause"), "paused"); assert.equal(s("program_ended"), "done");
    assert.equal(s("program_interrupted"), "interrupted"); assert.equal(s("failure"), "error"); assert.equal(s("service"), "error");
    assert.equal(s("not_connected"), "offline"); assert.equal(s("unavailable"), "offline"); assert.equal(s(null), "offline");
    assert.equal(s("in_use", { failure: true }), "error");
    assert.equal(s("unknown"), "offline");
    assert.equal(s("unknown", { phase: "main_wash" }), "running");
    assert.equal(s("unknown", { phase: "not_running", program: "cottons" }), "standby");
  });
  test("durations follow the entity's unit (start_in is in hours)", () => {
    assert.equal(toMinutes(1.5, "h"), 90);
    assert.equal(toMinutes(90, "min"), 90);
    assert.equal(toMinutes(120, "s"), 2);
    assert.equal(toMinutes(null, "h"), null);
  });
});

// ------------------------------------------------------------ handmade sequences

const fam = familyOf("Washing machine", "WEI895");
const base = { status: "in_use", statusAt: 0, program: "cottons", phase: "main_wash", remaining: 40, remainingAt: 0, elapsed: 0, elapsedAt: 0,
  buttons: { start: "none", stop: "none", pause: "none" } };
const MIN = 60e3;

describe("tracker", () => {
  test("the countdown never runs more than a minute ahead of Miele's estimate", () => {
    const tr = new MieleTracker(fam);
    const vm = tr.update({ ...base, remaining: 16, remainingAt: 0 }, 5 * MIN);
    assert.equal(vm.leftSec, 15 * 60);
    assert.equal(tr.update({ ...base, remaining: 16, remainingAt: 0 }, 20e3).leftSec, 16 * 60 - 20);
  });

  test("pauses come off elapsed_time and the ring stands still while paused", () => {
    const tr = new MieleTracker(fam);
    tr.update({ ...base }, 0);
    tr.update({ ...base, elapsed: 10, elapsedAt: 10 * MIN, remaining: 30, remainingAt: 10 * MIN }, 10 * MIN);
    const p0 = tr.update({ ...base, status: "pause", statusAt: 10 * MIN, elapsed: 10, elapsedAt: 10 * MIN, remaining: 30, remainingAt: 10 * MIN }, 10 * MIN + 1);
    const p1 = tr.update({ ...base, status: "pause", statusAt: 10 * MIN, elapsed: 19, elapsedAt: 19 * MIN, remaining: 30, remainingAt: 10 * MIN }, 19 * MIN + 30e3);
    assert.equal(p1.state, "paused");
    assert.equal(p1.progress.value, p0.progress.value);
    assert.equal(p1.leftSec, p0.leftSec);
    const r = tr.update({ ...base, statusAt: 20 * MIN, elapsed: 20, elapsedAt: 20 * MIN, remaining: 30, remainingAt: 10 * MIN }, 20 * MIN);
    assert.equal(r.pausedSec, 600);
    assert.ok(Math.abs(r.progress.value - 600 / (600 + 1740)) < 0.01, `progress ${r.progress.value}`);
  });

  test("ready: the duration waits until the dial has settled for a second", () => {
    const tr = new MieleTracker(fam);
    const ready = (program, remaining, now) => tr.update({ ...base, status: "programmed", program, remaining, elapsed: 0 }, now).lcd.main;
    assert.deepEqual(ready("cottons", 159, 0), { kind: "duration", value: 159 * 60 });
    assert.equal(ready("eco_40_60", 200, 200).value, 159 * 60);
    assert.equal(ready("minimum_iron", 120, 500).value, 159 * 60);
    assert.equal(ready("minimum_iron", 120, 1600).value, 120 * 60);
  });

  test("an unknown status (code HA doesn't know) is held for 60 s, then read from the phase", () => {
    const tr = new MieleTracker(fam);
    tr.update({ ...base }, 0);
    const held = tr.update({ ...base, status: "unknown", phase: "rinse" }, 30e3);
    assert.equal(held.state, "running"); assert.equal(held.stale, true);
    const guessed = tr.update({ ...base, status: "unknown", phase: "rinse" }, 90e3);
    assert.equal(guessed.state, "running"); assert.equal(guessed.guessed, true); assert.equal(guessed.phase, "rinse");
  });

  test("unreachable with nothing known yet: offline straight away", () => {
    const vm = new MieleTracker(fam).update({ ...base, status: "not_connected" }, 0);
    assert.equal(vm.state, "offline"); assert.deepEqual(vm.lcd.main, { kind: "dashes" });
  });

  test("controls follow the buttons' availability", () => {
    const tr = new MieleTracker(fam);
    const vm = tr.update({ ...base, buttons: { start: "unavailable", stop: "available", pause: "available" } }, 0);
    assert.deepEqual([vm.controls.pause, vm.controls.stop, vm.controls.resume], [true, true, false]);
    const p = tr.update({ ...base, status: "pause", buttons: { start: "available", stop: "available", pause: "unavailable" } }, 1000);
    assert.deepEqual([p.controls.pause, p.controls.resume], [false, true]);
    const off = tr.update({ ...base, status: "off", buttons: { start: "disabled", stop: "disabled", pause: "disabled" } }, 2000);
    assert.deepEqual(off.controls.disabled, ["start", "stop", "pause"]);
  });
});

// ------------------------------------------------------------ real cycles (docs/fixtures.json + dev/data/fixtures-extra.json)

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} ${a} vs ${b} (±${tol})`);
const states = (r, from, to) => new Set(r.samples.filter(([t]) => t >= from && t <= to).map(([, v]) => v.state));

describe("washer: cottons with a pause", () => {
  const r = play("washer_cottons_with_pause");
  test("on, ready with the programme's length", () => {
    assert.equal(r.at(1).state, "standby");
    assert.equal(r.at(60).state, "ready");
    assert.deepEqual(r.at(60).lcd.main, { kind: "duration", value: 159 * 60 });
    assert.equal(r.at(60).program, "cottons");
  });
  test("running: countdown and progress from elapsed/(elapsed+remaining)", () => {
    const v = r.at(1000);
    assert.equal(v.state, "running"); assert.equal(v.progress.mode, "time");
    near(v.leftSec, 145 * 60 - 13, 1, "leftSec");
    near(v.progress.value, 864 / (864 + 145 * 60 - 13), 0.002, "progress");
    assert.equal(v.phase, "main_wash");
  });
  test("pause holds the ring and the display, and the pause comes off afterwards", () => {
    assert.equal(r.at(2995).state, "paused");
    assert.equal(r.at(2999).progress.value, r.at(2995).progress.value);
    assert.equal(r.at(2999).leftSec, r.at(2995).leftSec);
    assert.equal(r.at(3010).state, "running");
    near(r.at(3010).pausedSec, 9, 1, "pausedSec");
    near(r.at(3010).progress.value, r.at(2992).progress.value, 0.01, "no jump after the pause");
  });
  test("progress never goes back", () => {
    let last = 0;
    for (const [t, v] of r.samples) if (t > 140 && t < 9890 && v.progress.value != null) {
      assert.ok(v.progress.value >= last - 1e-9, `t=${t} ${v.progress.value} < ${last}`); last = v.progress.value;
    }
  });
  test("estimate ran out while still running: 'almost done', not 'done'", () => {
    const v = r.at(9700);
    assert.equal(v.state, "running"); assert.equal(v.flags.almostDone, true);
    assert.deepEqual(v.lcd.main, { kind: "text", value: "almost_done" });
  });
  test("done with anti-crease, then off", () => {
    const v = r.at(9900);
    assert.equal(v.state, "done"); assert.equal(v.phase, "anti_crease"); assert.equal(v.flags.antiCrease, true);
    assert.equal(v.progress.value, 1);
    assert.deepEqual(v.lcd, { main: { kind: "text", value: "end" }, sub: { kind: "phase", value: "anti_crease" } });
    assert.equal(r.at(10150).state, "off"); assert.equal(r.at(10150).program, null);
  });
});

test("washer: anti-crease for 30 min, then finished", () => {
  const r = play("washer_end_anti_crease_to_finished");
  assert.equal(r.at(5).state, "done"); assert.equal(r.at(5).phase, "anti_crease");
  assert.equal(r.at(1800).state, "done"); assert.equal(r.at(1800).phase, "finished");
  assert.equal(r.at(2340).state, "off");
});

describe("dryer: dryness ladder", () => {
  const r = play("dryer_cottons_dryness_ladder");
  test("ready, running towards extra dry", () => {
    assert.equal(r.at(30).state, "ready");
    assert.equal(r.at(100).state, "running");
    assert.deepEqual(r.at(100).dryness, { target: "extra_dry", reached: null });
  });
  test("reached levels light up on the way", () => {
    assert.equal(r.at(4000).dryness.reached, "hand_iron_1");
    assert.equal(r.at(5100).dryness.reached, "normal");
    near(r.at(5100).progress.value, (5100 - 76) / (6315 - 76), 0.02, "progress");
  });
  test("cooling down after the end, then anti-crease and off", () => {
    assert.equal(r.at(6330).state, "done"); assert.equal(r.at(6330).flags.cooling, true);
    assert.equal(r.at(6400).phase, "comfort_cooling"); assert.equal(r.at(6400).flags.cooling, true);
    assert.equal(r.at(6700).flags.antiCrease, true); assert.equal(r.at(6700).flags.cooling, false);
    assert.equal(r.at(10300).phase, "finished");
    assert.equal(r.at(10600).state, "off"); assert.equal(r.at(10600).dryness, null);
  });
});

test("dryer: interrupted", () => {
  const r = play("dryer_interrupted");
  assert.equal(r.at(5).state, "running");
  assert.equal(r.at(20).state, "interrupted");
  assert.deepEqual(r.at(20).lcd.main, { kind: "text", value: "interrupted" });
  assert.equal(r.at(920).state, "off");
});

describe("steam oven: heating up, then a timer", () => {
  const r = play("steam_oven_fan_plus_timer");
  test("not_connected right after 'off': the last state is held, not 'offline'", () => {
    assert.equal(r.at(0.2).state, "off"); assert.equal(r.at(0.2).stale, true);
  });
  test("heating: ring follows the temperature (168 → 195 °C)", () => {
    const v = r.at(20);
    assert.equal(v.state, "running"); assert.equal(v.progress.mode, "heat");
    near(v.progress.value, (178.68 - 168.45) / (195 - 168.45), 0.001);
    assert.deepEqual(v.lcd.main, { kind: "temp", value: 178.68 });
  });
  test("at temperature before the timer starts", () => {
    assert.equal(r.at(40).progress.mode, "at_temp");
    assert.equal(r.at(40).progress.value, 1);
  });
  test("timer: countdown from remaining", () => {
    const v = r.at(100);
    assert.equal(v.progress.mode, "time");
    near(v.leftSec, 11 * 60 - 29, 1);
  });
  test("a 3 s not_connected blip changes nothing", () => {
    assert.deepEqual(states(r, 300, 330), new Set(["running"]));
    assert.equal(r.at(315.5).stale, true); assert.equal(r.at(315.5).connection, "lost");
    assert.ok(r.at(315.5).leftSec < r.at(313).leftSec);
  });
  test("done, then on", () => {
    assert.equal(r.at(748).state, "done"); assert.equal(r.at(748).phase, "process_finished");
    assert.equal(r.at(800).state, "standby"); assert.equal(r.at(800).program, null);
  });
});

test("steam oven: door pauses are calm 'paused', not an error", () => {
  const r = play("steam_oven_door_pauses");
  assert.equal(r.at(270).state, "paused"); assert.equal(r.at(300).state, "paused");
  assert.equal(r.at(300).phase, null);
  assert.deepEqual(r.at(300).lcd.sub, { kind: "text", value: "paused" });
  assert.equal(r.at(400).state, "running");
  near(r.at(600).pausedSec, (332 - 268) + (507 - 500), 1);
  assert.equal(r.at(2489.5).state, "off");
});

test("steam oven: all seven door pauses add up (553.6 s)", () => {
  const r = play("steam_oven_all_door_pauses");
  assert.equal(r.at(1900).state, "paused");
  near(r.at(2480).pausedSec, 554, 2);
});

test("oven-microwave: programme switch and short blips", () => {
  const r = play("microwave_combo");
  assert.equal(r.at(144.1).state, "running");
  assert.equal(r.at(480).state, "paused");
  assert.equal(r.at(1035).program, "microwave_fan_plus");
  assert.equal(r.at(1337.5).state, "running"); assert.equal(r.at(1337.5).stale, true);
  assert.equal(r.at(1340).state, "done");
  assert.equal(r.at(1952.5).state, "off");
});

describe("oven-microwave: Wi-Fi drops out for minutes while it runs", () => {
  const r = play("microwave_wifi_dropouts");
  test("never shows offline during the session", () => {
    assert.ok(!states(r, 64, 2403).has("offline"));
  });
  test("heating from 29 °C to 160 °C", () => {
    assert.equal(r.at(120).progress.mode, "heat");
    near(r.at(120).progress.value, (40.59 - 28.75) / (160 - 28.75), 0.001);
  });
  test("328 s without connection: last state kept, marked as lost", () => {
    const v = r.at(1200);
    assert.equal(v.state, "running"); assert.equal(v.stale, true); assert.equal(v.connection, "lost");
  });
  test("back: timer, then the next pause and off", () => {
    assert.equal(r.at(1420).progress.mode, "time");
    assert.equal(r.at(400).state, "paused");
    assert.equal(r.at(2350).state, "paused");
    assert.equal(r.at(2410).state, "off");
  });
});

test("warming drawer: off and unreachable for 13 min stays 'off', marked as lost (decision C)", () => {
  const r = play("drawer_offline_while_off");
  assert.equal(r.at(5).state, "off"); assert.equal(r.at(5).connection, "ok");
  assert.equal(r.at(40).state, "off"); assert.equal(r.at(40).stale, true);
  assert.equal(r.at(600).state, "off"); assert.equal(r.at(600).connection, "lost");
  assert.ok(!states(r, 0, 958).has("offline"));
  assert.equal(r.at(780).state, "off"); assert.equal(r.at(780).connection, "ok");
});

test("a programmed (ready) appliance that stays unreachable shows 'offline' after 60 s", () => {
  const tr = new MieleTracker(fam);
  tr.update({ ...base, status: "programmed" }, 0);
  assert.equal(tr.update({ ...base, status: "not_connected", statusAt: 1000 }, 30e3).state, "ready");
  assert.equal(tr.update({ ...base, status: "not_connected", statusAt: 1000 }, 90e3).state, "offline");
});

describe("coffee", () => {
  const r = play("coffee_morning");
  test("rinsing when switched on", () => {
    assert.equal(r.at(10).state, "running"); assert.equal(r.at(10).flags.rinsing, true);
    assert.deepEqual(r.at(10).lcd.main, { kind: "text", value: "rinsing" });
    assert.equal(r.at(70).state, "standby");
  });
  test("a drink: no times, the display shows the drink and the phase", () => {
    const v = r.at(180);
    assert.equal(v.state, "running"); assert.equal(v.progress.mode, "indeterminate");
    assert.deepEqual(v.lcd, { main: { kind: "program", value: "long_coffee" }, sub: { kind: "phase", value: "grinding" } });
    assert.equal(r.at(200).phase, "dispensing");
    assert.equal(r.at(300).state, "standby"); assert.equal(r.at(300).program, null);
    assert.equal(r.at(1460).program, "herbal_tea"); assert.equal(r.at(1460).phase, "rinse");
    assert.equal(r.at(1480).state, "off");
  });
  test("interrupted", () => {
    const i = play("coffee_interrupted");
    assert.equal(i.at(3).state, "running"); assert.equal(i.at(10).state, "interrupted"); assert.equal(i.at(20).state, "standby");
  });
});

test("snapshot reads units, timestamps and button availability", () => {
  const r = play("washer_cottons_with_pause");
  const v = r.at(1000);
  assert.ok(v.endAt > r.sim.t0 + 1000e3, "end time from the finish sensor");
  const snap = readSnapshot({ states: { "sensor.x": { state: "1.5", attributes: { unit_of_measurement: "h" }, last_changed: "2026-10-10T10:00:00Z" } } }, { start_in: "sensor.x", btn_stop: "button.gone" });
  assert.equal(snap.startIn, 90);
  assert.equal(snap.buttons.stop, "disabled");
  assert.equal(snap.buttons.start, "none");
});
