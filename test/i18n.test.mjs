import { test } from "node:test";
import assert from "node:assert/strict";
import { registry, translations } from "./support.mjs";
import { createMockHass } from "../dev/mock-hass.js";
import { mieleLabel, t } from "../src/i18n/index.js";

const nl = createMockHass({ registry, translations, states: {}, language: "nl" });
const en = createMockHass({ registry, translations, states: {}, language: "en" });

test("Home Assistant's own Dutch translation is used when it exists", () => {
  assert.equal(mieleLabel(nl, "program", "cottons", "nl"), "Katoen");
  assert.equal(mieleLabel(nl, "phase", "anti_crease", "nl"), "Kreukbeveiliging");
});

test("Dutch fallback while HA still shows the English text", () => {
  assert.equal(mieleLabel(nl, "phase", "process_running", "nl"), "Bezig");
  assert.equal(mieleLabel(nl, "phase", "keeping_warm", "nl"), "Warmhouden");
  assert.equal(mieleLabel(nl, "phase", "dispensing", "nl"), "Uitschenken");
  assert.equal(mieleLabel(nl, "program", "fan_plus", "nl"), "Hetelucht plus");
  assert.equal(mieleLabel(nl, "status", "autocleaning", "nl"), "Automatisch spoelen");
  assert.equal(mieleLabel(nl, "program", "keep_warm", "nl"), "Warmhouden");          // no HA translation at all
});

test("a real translation wins over the fallback", () => {
  const translated = { ...nl, localize: key => key.endsWith(".process_running") ? "Proces loopt" : nl.localize(key) };
  assert.equal(mieleLabel(translated, "phase", "process_running", "nl"), "Proces loopt");
});

test("English stays English; unknown keys are made readable", () => {
  assert.equal(mieleLabel(en, "phase", "process_running", "en"), "Process running");
  assert.equal(mieleLabel(en, "program", "some_new_programme", "en"), "Some new programme");
  assert.equal(mieleLabel(nl, "program", "cappuccino", "nl"), "Cappuccino");
});

test("own strings with placeholders", () => {
  assert.equal(t("nl", "ask.stop", { name: "wasmachine" }), "wasmachine stoppen? Het programma wordt afgebroken.");
  assert.equal(t("en", "state.running"), "Running");
  assert.equal(t("fr", "state.running"), "state.running".split(".").reduce((o, k) => o?.[k], { state: { running: "Running" } }));
});
