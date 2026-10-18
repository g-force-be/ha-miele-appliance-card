// Screenshots of the dev harness at the moments that matter, per width and theme.
// Uses the installed Chrome (playwright-core, channel "chrome"). Output: dev/screenshots/<milestone>/
//   npm run shots            all shots
//   npm run shots -- washer  only shots whose name contains "washer"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { serve } from "../dev/serve.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dev", "screenshots", "m1");
const filter = process.argv[2] ?? "";

const MOMENTS = [
  ["washer_cottons_with_pause", 60, "01-washer-ready"],
  ["washer_cottons_with_pause", 1000, "02-washer-running"],
  ["washer_cottons_with_pause", 2997, "03-washer-paused"],
  ["washer_cottons_with_pause", 9700, "04-washer-almost-done"],
  ["washer_cottons_with_pause", 9950, "05-washer-done-anti-crease"],
  ["dryer_cottons_dryness_ladder", 5100, "06-dryer-ladder"],
  ["dryer_cottons_dryness_ladder", 6400, "07-dryer-cooling"],
  ["dryer_interrupted", 20, "08-dryer-interrupted"],
  ["steam_oven_fan_plus_timer", 20, "09-steam-heating"],
  ["steam_oven_fan_plus_timer", 315.5, "10-steam-blip-held"],
  ["steam_oven_all_door_pauses", 1900, "11-steam-door-pause"],
  ["microwave_wifi_dropouts", 1200, "12-microwave-wifi-lost"],
  ["coffee_morning", 180, "13-coffee-drink"],
  ["drawer_offline_while_off", 80, "14-drawer-offline"],
];
const SIZES = [["1024", 1024, 600], ["390", 390, 844]];
const THEMES = ["light", "dark"];

fs.mkdirSync(out, { recursive: true });
const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/dev/`;
const browser = await chromium.launch({ channel: "chrome" });
let n = 0;
try {
  for (const [w, width, height] of SIZES) for (const theme of THEMES) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: width < 500 ? 2 : 1, colorScheme: theme });
    page.on("pageerror", e => { console.error("page error:", e.message); process.exitCode = 1; });
    for (const [cycle, t, name] of MOMENTS) {
      if (!name.includes(filter)) continue;
      if (theme === "dark" && !["02-washer-running", "06-dryer-ladder", "09-steam-heating", "12-microwave-wifi-lost"].includes(name)) continue;
      await page.goto(`${base}?cycle=${cycle}&t=${t}&lang=nl&theme=${theme}`);
      await page.waitForSelector("body[data-ready='1']");
      await page.screenshot({ path: path.join(out, `${name}-${w}-${theme}.png`), fullPage: true });
      n++;
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

// contact sheet: one row per moment, all widths and themes next to each other
const files = fs.readdirSync(out).filter(f => f.endsWith(".png")).sort();
const rows = MOMENTS.map(([cycle, t, name]) => {
  const imgs = files.filter(f => f.startsWith(name + "-"));
  return imgs.length ? `<section><h2>${name} <small>${cycle} · t=${t} s</small></h2><div>${imgs.map(f =>
    `<figure><a href="${f}"><img src="${f}" loading="lazy"></a><figcaption>${f.slice(name.length + 1, -4)}</figcaption></figure>`).join("")}</div></section>` : "";
}).join("");
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><meta charset="utf-8"><title>M1 screenshots</title>
<style>body{font:14px system-ui;margin:16px;background:#f4f5f7}h2{font-size:15px}small{color:#6b7280;font-weight:400}
section>div{display:flex;gap:12px;align-items:flex-start;overflow-x:auto}figure{margin:0}img{height:420px;border:1px solid #ddd;border-radius:6px}
figcaption{font-size:12px;color:#6b7280}</style><h1>M1 · datamodel – dev-harnas</h1>${rows}`);
console.log(`${n} screenshots in ${path.relative(root, out)} (overview: index.html)`);
