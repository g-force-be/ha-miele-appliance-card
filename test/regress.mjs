// Visual regression for Peter's own appliances: the drawings for his washer, dryer, steam oven, oven with microwave,
// coffee machine and warming drawer must look the same after the drawings become a family per design line (M5).
//   node test/regress.mjs --baseline    save the reference pictures in dev/screenshots/regress/baseline
//   node test/regress.mjs               compare against them; differing pixels per shot, diff pictures in …/regress/diff
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { serve } from "../dev/serve.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "dev", "screenshots", "regress");
const baseline = process.argv.includes("--baseline");

// Peter's appliances in the states that show the most of each drawing
const SHOTS = [
  ["washer-off", "washer_cottons_with_pause@-1"], ["washer-running", "washer_cottons_with_pause@1000"],
  ["washer-paused", "washer_cottons_with_pause@2997"], ["washer-done", "washer_cottons_with_pause@9950"],
  ["dryer-running", "dryer_cottons_dryness_ladder@5100"], ["dryer-cooling", "dryer_cottons_dryness_ladder@6400"],
  ["steam-off", "steam_oven_fan_plus_timer@-1"], ["steam-timer", "steam_oven_fan_plus_timer@100"], ["steam-on", "steam_oven_fan_plus_timer@820"],
  ["microwave-running", "microwave_wifi_dropouts@1420"], ["microwave-off", "microwave_combo@-1"],
  ["coffee-on", "coffee_morning@70"], ["coffee-dispensing", "coffee_morning@200"],
  ["drawer-warm", "drawer_keep_warm_synthetic@900"], ["drawer-open", "drawer_keep_warm_synthetic@1510"],
];
const VARIANTS = [["dark", ""], ["light", "&finish=graphite_grey"]];

const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/dev/`;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 500, height: 1000 }, deviceScaleFactor: 1 });
page.on("pageerror", e => { console.error("page error:", e.message); process.exitCode = 1; });
fs.mkdirSync(path.join(dir, baseline ? "baseline" : "now"), { recursive: true });
fs.mkdirSync(path.join(dir, "diff"), { recursive: true });

const results = [];
for (const [name, cycle] of SHOTS) for (const [theme, extra] of VARIANTS) {
  const file = `${name}-${theme}.png`;
  await page.goto(`${base}cards.html?c=${cycle}&theme=${theme}&lang=nl&bar=0&anim=off${extra}`);
  await page.waitForSelector("body[data-ready='1']");
  const shot = await page.locator("miele-appliance-card").first().screenshot({ animations: "disabled" });
  fs.writeFileSync(path.join(dir, baseline ? "baseline" : "now", file), shot);
  if (!baseline) results.push([file, shot]);
}

// compare in the browser: same size, then count pixels that differ by more than a little anti-aliasing noise
if (!baseline) {
  const cmp = await browser.newPage();
  let failed = 0;
  for (const [file, shot] of results) {
    const ref = path.join(dir, "baseline", file);
    if (!fs.existsSync(ref)) { console.log(`${file}: no baseline`); failed++; continue; }
    const out = await cmp.evaluate(async ([a, b]) => {
      const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return { size: `${ia.width}×${ia.height} vs ${ib.width}×${ib.height}` };
      const c = document.createElement("canvas"); c.width = ia.width; c.height = ia.height;
      const x = c.getContext("2d");
      x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data;
      x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, c.width, c.height);
      let n = 0;
      for (let i = 0; i < da.length; i += 4) {
        const d = Math.abs(da[i] - db.data[i]) + Math.abs(da[i + 1] - db.data[i + 1]) + Math.abs(da[i + 2] - db.data[i + 2]);
        if (d > 24) { n++; db.data[i] = 255; db.data[i + 1] = 0; db.data[i + 2] = 255; }
      }
      x.putImageData(db, 0, 0);
      return { n, total: da.length / 4, diff: c.toDataURL("image/png") };
    }, [`data:image/png;base64,${fs.readFileSync(ref).toString("base64")}`, `data:image/png;base64,${shot.toString("base64")}`]);
    if (out.size) { console.log(`${file}: size differs (${out.size})`); failed++; continue; }
    const pct = out.n / out.total * 100;
    if (out.n) fs.writeFileSync(path.join(dir, "diff", file), Buffer.from(out.diff.split(",")[1], "base64"));
    console.log(`${out.n ? "✖" : "✔"} ${file}: ${out.n} pixels differ (${pct.toFixed(3)} %)`);
    if (out.n) failed++;
  }
  console.log(failed ? `${failed} of ${results.length} differ` : `all ${results.length} identical`);
  if (failed) process.exitCode = 1;
}
await browser.close();
server.close();
if (baseline) console.log(`baseline: ${SHOTS.length * VARIANTS.length} pictures in ${path.relative(root, path.join(dir, "baseline"))}`);
