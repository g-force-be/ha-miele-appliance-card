// Playwright screenshots, per milestone. Uses the installed Chrome (playwright-core, channel "chrome").
//   npm run shots                 M2a: washer and dryer cards, every state × theme × front colour × width
//   npm run shots -- m1           M1: the model harness
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
const out = path.join(root, "dev", "screenshots", suite);

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

const SUITES = { m1: m1Shots, m2a: m2aShots };
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
    if (s.card) await page.locator("miele-appliance-card").first().screenshot({ path: file, animations: "disabled" });
    else if (s.stage) await page.locator("#stage").screenshot({ path: file, animations: "disabled" });
    else await page.screenshot({ path: file, fullPage: true });
  }
} finally {
  await browser.close();
  server.close();
}

// contact sheet: one row per group
const groups = [...new Set(shots.map(s => s.group))];
const html = groups.map(g => `<section><h2>${g}</h2><div>${shots.filter(s => s.group === g).map(s =>
  `<figure><a href="${s.name}.png"><img src="${s.name}.png" loading="lazy"></a><figcaption>${s.name.slice(g.length + 1)}</figcaption></figure>`).join("")}</div></section>`).join("");
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><meta charset="utf-8"><title>${suite} screenshots</title>
<style>body{font:14px system-ui;margin:16px;background:#e9ebee}h2{font-size:15px;margin:22px 0 8px}
section>div{display:flex;gap:12px;align-items:flex-start;overflow-x:auto;padding-bottom:6px}figure{margin:0}
img{height:360px;border-radius:6px;background:#fff}figcaption{font-size:12px;color:#6b7280}</style><h1>${suite}</h1>${html}`);
console.log(`${shots.length} screenshots in ${path.relative(root, out)} (overview: index.html)`);
