// Playwright screenshots, per milestone. Uses the installed Chrome (playwright-core, channel "chrome").
//   npm run shots                 M2a: washer and dryer cards, every state × theme × front colour × width
//   npm run shots -- m1           M1: the model harness
//   npm run shots -- m2b / m3     M2b: kitchen appliances · M3: the programmes card
//   npm run shots -- m4           M4: the overview card and the editors
//   npm run shots -- m2a washer   only shots whose name contains "washer"
// Output: dev/screenshots/<suite>/, with an index.html contact sheet.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { serve } from "../dev/serve.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const suite = process.argv[2] ?? "m2a";
const filter = process.argv[3] ?? "";
const out = suite === "readme" ? path.join(root, "docs", "images") : path.join(root, "dev", "screenshots", suite);

// --- M1: the model harness
const M1_MOMENTS = [
  ["washer_cottons_with_pause", 60, "01-washer-ready"], ["washer_cottons_with_pause", 1000, "02-washer-running"],
  ["washer_cottons_with_pause", 2997, "03-washer-paused"], ["washer_cottons_with_pause", 9700, "04-washer-almost-done"],
  ["washer_cottons_with_pause", 9950, "05-washer-done-anti-crease"], ["dryer_cottons_dryness_ladder", 5100, "06-dryer-ladder"],
  ["dryer_cottons_dryness_ladder", 6400, "07-dryer-cooling"], ["dryer_interrupted", 20, "08-dryer-interrupted"],
  ["steam_oven_fan_plus_timer", 20, "09-steam-heating"], ["steam_oven_fan_plus_timer", 315.5, "10-steam-blip-held"],
  ["steam_oven_all_door_pauses", 1900, "11-steam-door-pause"], ["microwave_wifi_dropouts", 1200, "12-microwave-wifi-lost"],
  ["coffee_morning", 180, "13-coffee-drink"], ["drawer_offline_while_off", 80, "14-drawer-offline"],
];
function m1Shots() {
  const shots = [];
  for (const [w, width, height] of [["1024", 1024, 600], ["390", 390, 844]]) for (const theme of ["light", "dark"])
    for (const [cycle, t, name] of M1_MOMENTS) {
      if (theme === "dark" && !["02-washer-running", "06-dryer-ladder", "09-steam-heating", "12-microwave-wifi-lost"].includes(name)) continue;
      shots.push({ name: `${name}-${w}-${theme}`, group: name, url: `index.html?cycle=${cycle}&t=${t}&lang=nl&theme=${theme}`,
        viewport: { width, height }, scale: width < 500 ? 2 : 1, theme, full: true });
    }
  return shots;
}

// --- M2a: washer and dryer cards
const STATES = {
  washer: [["off", "washer_cottons_with_pause", -1], ["ready", "washer_cottons_with_pause", 60], ["running", "washer_cottons_with_pause", 1000],
    ["spin", "washer_cottons_with_pause", 9000], ["paused", "washer_cottons_with_pause", 2997], ["almost-done", "washer_cottons_with_pause", 9700],
    ["done", "washer_cottons_with_pause", 9950], ["interrupted", "washer_interrupted_synthetic", 700], ["error", "washer_failure_synthetic", 400]],
  dryer: [["off", "dryer_cottons_dryness_ladder", -1], ["ready", "dryer_cottons_dryness_ladder", 30], ["running", "dryer_cottons_dryness_ladder", 5100],
    ["cooling", "dryer_cottons_dryness_ladder", 6400], ["paused", "dryer_paused_synthetic", 2000], ["done", "dryer_cottons_dryness_ladder", 6700],
    ["interrupted", "dryer_interrupted", 20], ["error", "dryer_failure_synthetic", 400]],
};
const PAIRS = [["running", "washer_cottons_with_pause@1000", "dryer_cottons_dryness_ladder@5100"],
  ["done", "washer_cottons_with_pause@9950", "dryer_cottons_dryness_ladder@6700"]];
const WIDTHS = [["390", 390, 844, 1], ["500", 500, 900, 1], ["1024", 1024, 600, 2]];
const FINISHES = ["lotus_white", "obsidian_black", "graphite_grey"];
function m2aShots() {
  const shots = [];
  for (const [w, width, height, cols] of WIDTHS) for (const theme of ["light", "dark"]) for (const finish of FINISHES) {
    const common = `theme=${theme}&finish=${finish}&lang=nl&bar=0&anim=off`;
    for (const [drawing, list] of Object.entries(STATES)) for (const [state, cycle, t] of list)
      shots.push({ name: `${drawing}-${state}-${finish}-${theme}-${w}`, group: `${drawing}-${state}`,
        url: `cards.html?c=${cycle}@${t}&cols=${cols}&${common}`, viewport: { width, height }, scale: width < 600 ? 2 : 1, theme, card: true });
    if (w !== "500") for (const [state, a, b] of PAIRS)
      shots.push({ name: `pair-${state}-${finish}-${theme}-${w}`, group: `pair-${state}`,
        url: `cards.html?c=${a}&c=${b}&cols=2&${common}`, viewport: { width: Math.max(width, 780), height }, scale: 1, theme, stage: true });
  }
  return shots;
}

// --- M2b: steam oven, oven with microwave, coffee machine, warming drawer, and the built-in column
const KITCHEN = {
  steam_oven: [["off", "steam_oven_fan_plus_timer", -1], ["heating", "steam_oven_fan_plus_timer", 20], ["at-temp", "steam_oven_fan_plus_timer", 40],
    ["timer", "steam_oven_fan_plus_timer", 100], ["blip-held", "steam_oven_fan_plus_timer", 315.5], ["door-paused", "steam_oven_door_pauses", 300],
    ["done", "steam_oven_fan_plus_timer", 748], ["on", "steam_oven_fan_plus_timer", 820]],
  microwave: [["off", "microwave_combo", -1], ["heating", "microwave_wifi_dropouts", 120], ["paused", "microwave_wifi_dropouts", 400],
    ["microwave", "microwave_wifi_dropouts", 1420], ["wifi-lost", "microwave_wifi_dropouts", 1200], ["done", "microwave_combo", 1340]],
  coffee: [["off", "coffee_morning", -1], ["rinsing", "coffee_morning", 10], ["on", "coffee_morning", 70], ["grinding", "coffee_morning", 180],
    ["dispensing", "coffee_morning", 200], ["tea", "coffee_morning", 1460], ["interrupted", "coffee_interrupted", 10]],
  drawer: [["off", "drawer_offline_while_off", 5], ["wifi-lost", "drawer_offline_while_off", 600], ["heating", "drawer_keep_warm_synthetic", 300],
    ["keeping-warm", "drawer_keep_warm_synthetic", 900], ["door-open", "drawer_keep_warm_synthetic", 1510]],
};
const COLUMN = [["running", "steam_oven_fan_plus_timer@100", "microwave_wifi_dropouts@1420", "drawer_keep_warm_synthetic@900"],
  ["off", "steam_oven_fan_plus_timer@-1", "microwave_combo@-1", "drawer_offline_while_off@5"]];
function m2bShots() {
  const shots = [];
  for (const [w, width, height, cols] of WIDTHS) for (const theme of ["light", "dark"]) for (const finish of ["obsidian_black", "brilliant_white", "graphite_grey"]) {
    const common = `theme=${theme}&finish=${finish}&lang=nl&bar=0&anim=off`;
    for (const [drawing, list] of Object.entries(KITCHEN)) for (const [state, cycle, t] of list)
      shots.push({ name: `${drawing}-${state}-${finish}-${theme}-${w}`, group: `${drawing}-${state}`,
        url: `cards.html?c=${cycle}@${t}&cols=${cols}&${common}`, viewport: { width, height }, scale: width < 600 ? 2 : 1, theme, card: true });
    if (w === "500") for (const [state, ...cs] of COLUMN)
      shots.push({ name: `column-${state}-${finish}-${theme}`, group: `column-${state}`,
        url: `cards.html?${cs.map(c => `c=${c}`).join("&")}&cols=1&controls=0&${common}`, viewport: { width, height: 1400 }, scale: 1, theme, stage: true });
  }
  return shots;
}

// --- M3: the programmes card (real programme lists from Peter's HA; washer and dryer lists are synthetic)
const MS = id => `set=binary_sensor.miele_${id}_mobiel_starten:on`;
const PROGRAMMES = [
  ["washer-remote-off", "washer_cottons_with_pause@-1", ""], ["washer-remote-on", "washer_cottons_with_pause@-1", MS("washing_machine")],
  ["washer-cached", "washer_cottons_with_pause@-1", "cache=seed"], ["washer-confirm", "washer_cottons_with_pause@-1", `${MS("washing_machine")}&pick=cottons`],
  ["washer-busy", "washer_cottons_with_pause@1000", MS("washing_machine")],
  ["dryer-remote-on", "dryer_cottons_dryness_ladder@-1", MS("tumble_dryer")],
  ["steam-remote-on", "steam_oven_fan_plus_timer@820", MS("steam_oven")], ["steam-sheet", "steam_oven_fan_plus_timer@820", `${MS("steam_oven")}&pick=fan_plus`],
  ["microwave-sheet", "microwave_combo@-1", `${MS("microwave_oven")}&set=sensor.miele_microwave_oven:on&pick=microwave`],
  ["coffee-remote-off", "coffee_morning@70", ""], ["drawer", "drawer_keep_warm_synthetic@300", ""],
];
function m3Shots() {
  const shots = [];
  // phone and the 500 px column only: the kitchen display never starts anything
  for (const [w, width, height] of WIDTHS.filter(x => x[0] !== "1024")) for (const theme of ["light", "dark"])
    for (const [name, cycle, extra] of PROGRAMMES)
      shots.push({ name: `${name}-${theme}-${w}`, group: name, url: `cards.html?c=${cycle}&card=programmes&theme=${theme}&lang=nl&bar=0&anim=off${extra ? `&${extra}` : ""}`,
        viewport: { width, height }, scale: width < 600 ? 2 : 1, theme, card: "miele-programmes-card" });
  return shots;
}

// --- M4: the overview card in its presets, and the visual editors (with the harness's stand-in for ha-form)
const RUNNING = "c=washer_cottons_with_pause@1000&c=dryer_cottons_dryness_ladder@5100&c=steam_oven_fan_plus_timer@100&c=microwave_wifi_dropouts@1420&c=drawer_keep_warm_synthetic@900&c=coffee_morning@70";
const SOME = "c=washer_cottons_with_pause@1000&c=dryer_cottons_dryness_ladder@-1&c=steam_oven_fan_plus_timer@-1&c=microwave_wifi_dropouts@1420&c=drawer_offline_while_off@5&c=coffee_morning@-1";
const ALL_OFF = "c=washer_cottons_with_pause@-1&c=dryer_cottons_dryness_ladder@-1&c=steam_oven_fan_plus_timer@-1&c=microwave_combo@-1&c=drawer_offline_while_off@5&c=coffee_morning@-1";
function m4Shots() {
  const ov = (name, cycles, layout, theme, [width, height], extra = "") => ({ name, group: name.replace(/-(light|dark)$/, ""),
    url: `cards.html?${cycles}&card=overview&layout=${layout}&theme=${theme}&lang=nl&bar=0&anim=off${extra}`,
    viewport: { width, height }, scale: width < 600 ? 2 : 1, theme, card: "miele-overview-card" });
  const shots = [];
  for (const theme of ["dark", "light"]) {
    shots.push(ov(`rooms-running-${theme}`, RUNNING, "rooms", theme, [1400, 1200]));
    shots.push(ov(`rooms-1024-${theme}`, SOME, "rooms", theme, [1024, 1200]));
    shots.push(ov(`grid-${theme}`, SOME, "grid", theme, [1400, 1200]));
    shots.push(ov(`active-${theme}`, SOME, "active", theme, [1024, 900]));
    shots.push(ov(`phone-${theme}`, SOME, "phone", theme, [390, 844]));
  }
  shots.push(ov("display-two-dark", SOME, "display", "dark", [1024, 600]));
  shots.push(ov("display-three-dark", "c=washer_cottons_with_pause@1000&c=dryer_cottons_dryness_ladder@5100&c=steam_oven_fan_plus_timer@100&c=microwave_combo@-1&c=drawer_offline_while_off@5&c=coffee_morning@-1", "display", "dark", [1024, 600]));
  shots.push(ov("display-all-off-dark", ALL_OFF, "display", "dark", [1024, 600]));
  for (const [name, url] of [["editor-overview", `${SOME}&card=overview&layout=rooms`], ["editor-appliance", "c=washer_cottons_with_pause@1000"],
    ["editor-programmes", "c=steam_oven_fan_plus_timer@820&card=programmes"]])
    shots.push({ name: `${name}-light`, group: name, url: `cards.html?${url}&theme=light&lang=nl&bar=0&anim=off&editor=1`,
      viewport: { width: 1400, height: 1000 }, scale: 1, theme: "light", stage: true });
  return shots;
}

// --- README: the pictures on the GitHub page (docs/images/), from the same harness
function readmeShots() {
  const ms = ["washing_machine", "steam_oven", "microwave_oven"].map(MS).join("&");
  return [
    { name: "laundry", url: "cards.html?c=washer_cottons_with_pause@1000&c=dryer_cottons_dryness_ladder@5100&cols=2&theme=dark&lang=en&bar=0&anim=off",
      viewport: { width: 820, height: 900 }, scale: 1.5, theme: "dark", stage: true },
    { name: "kitchen", url: "cards.html?c=steam_oven_fan_plus_timer@100&c=coffee_morning@200&c=microwave_wifi_dropouts@1420&c=drawer_keep_warm_synthetic@900&cols=2&theme=light&lang=en&bar=0&anim=off",
      viewport: { width: 820, height: 1200 }, scale: 1.5, theme: "light", stage: true },
    { name: "programmes", url: `cards.html?c=washer_cottons_with_pause@-1&c=steam_oven_fan_plus_timer@820&c=microwave_combo@-1&card=programmes&cols=3&theme=dark&lang=en&bar=0&anim=off&${ms}&set=sensor.miele_microwave_oven:on&pick=cottons&pick=fan_plus&pick=microwave`,
      viewport: { width: 1180, height: 900 }, scale: 1.25, theme: "dark", stage: true }
  ];
}

const SUITES = { m1: m1Shots, m2a: m2aShots, m2b: m2bShots, m3: m3Shots, m4: m4Shots, readme: readmeShots };
if (!SUITES[suite]) { console.error(`unknown suite ${suite}`); process.exit(1); }
const shots = SUITES[suite]().filter(s => s.name.includes(filter));

fs.mkdirSync(out, { recursive: true });
const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/dev/`;
const browser = await chromium.launch({ channel: "chrome" });
const pages = new Map();
try {
  for (const s of shots) {
    const key = `${s.viewport.width}x${s.viewport.height}@${s.scale}-${s.theme}`;
    if (!pages.has(key)) {
      const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: s.scale, colorScheme: s.theme });
      page.on("pageerror", e => { console.error("page error:", e.message); process.exitCode = 1; });
      pages.set(key, page);
    }
    const page = pages.get(key);
    await page.goto(base + s.url);
    await page.waitForSelector("body[data-ready='1']");
    const file = path.join(out, `${s.name}.png`);
    if (s.card) await page.locator(s.card === true ? "miele-appliance-card" : s.card).first().screenshot({ path: file, animations: "disabled" });
    else if (s.stage) await page.locator("#stage").screenshot({ path: file, animations: "disabled" });
    else await page.screenshot({ path: file, fullPage: true });
  }
} finally {
  await browser.close();
  server.close();
}

if (suite === "readme") { console.log(`${shots.length} pictures in docs/images`); process.exit(); }

// contact sheet: one row per group, with every shot of the suite that exists on disk (a filtered run keeps the rest)
const all = SUITES[suite]().filter(x => fs.existsSync(path.join(out, `${x.name}.png`)));
const groups = [...new Set(all.map(s => s.group))];
const html = groups.map(g => `<section><h2>${g}</h2><div>${all.filter(s => s.group === g).map(s =>
  `<figure><a href="${s.name}.png"><img src="${s.name}.png" loading="lazy"></a><figcaption>${s.name.slice(g.length + 1)}</figcaption></figure>`).join("")}</div></section>`).join("");
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><meta charset="utf-8"><title>${suite} screenshots</title>
<style>body{font:14px system-ui;margin:16px;background:#e9ebee}h2{font-size:15px;margin:22px 0 8px}
section>div{display:flex;gap:12px;align-items:flex-start;overflow-x:auto;padding-bottom:6px}figure{margin:0}
img{height:360px;border-radius:6px;background:#fff}figcaption{font-size:12px;color:#6b7280}</style><h1>${suite}</h1>${html}`);
console.log(`${shots.length} screenshots in ${path.relative(root, out)} (overview: index.html)`);
