// Entity attributes never reach the markup: every unit_of_measurement gets an <img onerror> and the cards must show it
// as text (hacs/default#12198). Moments that show a temperature on the laundry, oven and cooling rows, the display and
// the pill, plus the dryer's dryness row.
//   node test/escape.mjs
import { chromium } from "playwright-core";
import { serve } from "../dev/serve.mjs";

const CYCLES = ["washer_cottons_with_pause@1000", "dryer_cottons_dryness_ladder@5100", "steam_oven_fan_plus_timer@100",
  "microwave_wifi_dropouts@1420", "demo_fridge_free_day@1500"];
const PAYLOAD = `°C<img src=x onerror="window.__xss=(window.__xss||0)+1">`;

const server = await serve(0);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
let failed = 0;
for (const c of CYCLES) {
  await page.goto(`http://127.0.0.1:${server.address().port}/dev/cards.html?c=${c}&anim=off&bar=0&lang=en`);
  await page.waitForFunction(() => document.querySelector("miele-appliance-card")?.shadowRoot?.querySelector(".row"));
  const r = await page.evaluate(payload => {
    const card = document.querySelector("miele-appliance-card"), h = card._hass;
    // on every entity: the recorded cycles of the author's appliances carry no units
    const states = Object.fromEntries(Object.entries(h.states).map(([id, s]) => [id, { ...s, attributes: { ...s.attributes, unit_of_measurement: payload } }]));
    // and a target temperature where the recording has none (the washer)
    const target = card._dev.roles.target_temp;
    if (target && isNaN(Number(states[target]?.state))) states[target] = { ...states[target], state: "40" };
    card.hass = { ...h, states };
    card._update();
    const root = card.shadowRoot;
    return { imgs: root.querySelectorAll("img").length, shown: [...root.querySelectorAll(".v, .pill, .lcd *")].some(e => e.textContent.includes("<img")),
      dots: root.querySelectorAll(".dots i").length };
  }, PAYLOAD);
  await page.waitForTimeout(300);
  const xss = await page.evaluate(() => window.__xss ?? 0);
  // the dryer shows no temperature, but its dryness row is the one row that is markup
  const dryer = c.startsWith("dryer");
  const ok = r.imgs === 0 && xss === 0 && (dryer ? r.dots > 0 : r.shown);
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${c}: ${r.imgs} img, onerror ${xss}×, ${dryer ? `dryness dots ${r.dots}` : `unit shown as text: ${r.shown}`}`);
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
