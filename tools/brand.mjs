// Logo, README banner and GitHub social preview.
// docs/images/logo.svg is the source. This script builds banner.svg and social-preview.svg from it
// and renders all three to PNG with the installed Chrome (playwright-core, channel "chrome").
// Usage: node tools/brand.mjs
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const DIR = "docs/images/";
const FONT = "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=block";
const CHIPS = ["Washer", "Dryer", "Ovens", "Coffee", "Warming drawer"];

const logo = await readFile(DIR + "logo.svg", "utf8");
const defs = logo.match(/<defs>([\s\S]*)<\/defs>/)[1];
const body = logo.split("</defs>")[1].split("</svg>")[0];

const banner = ({ w, h, rx, icon, ix, iy, tx, ty }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <title>Miele Appliance Card</title>
  <defs>${defs}
    <linearGradient id="bannerbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#262a2f"/><stop offset="1" stop-color="#16181b"/></linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#4fa3e0" stop-opacity=".22"/><stop offset="1" stop-color="#4fa3e0" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="${rx}" fill="url(#bannerbg)"/>
  <circle cx="${ix + icon / 2}" cy="${iy + icon / 2}" r="${icon * 0.75}" fill="url(#halo)"/>
  <g transform="translate(${ix} ${iy}) scale(${(icon / 512).toFixed(4)})">${body}</g>
  <g font-family="Inter, 'Segoe UI', Roboto, sans-serif">
    <text x="${tx}" y="${ty}" font-size="78" font-weight="600" fill="#f3f4f6" letter-spacing="-1">Miele Appliance Card</text>
    <text x="${tx}" y="${ty + 56}" font-size="30" fill="#9aa1a9">Unofficial Home Assistant cards for Miele appliances</text>
    <g class="chips" data-x="${tx}" data-y="${ty + 112}"></g>
  </g>
</svg>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();

// Renders one SVG to PNG; lays out the chips with the real font first. Returns the final SVG markup.
async function render(svg, w, h, png) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><link rel="stylesheet" href="${FONT}">
<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const markup = await page.evaluate((chips) => {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.querySelector("svg");
    const g = svg.querySelector("g.chips");
    if (g) {
      let x = +g.dataset.x;
      const y = +g.dataset.y;
      const set = (el, attrs) => Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      for (const label of chips) {
        const t = document.createElementNS(NS, "text");
        set(t, { y: y + 25, "font-size": 19, "font-weight": 500, fill: "#c9ced4", "text-anchor": "middle" });
        t.textContent = label;
        g.appendChild(t);
        const w = t.getComputedTextLength() + 36;
        t.setAttribute("x", (x + w / 2).toFixed(1));
        const r = document.createElementNS(NS, "rect");
        set(r, { x: x.toFixed(1), y, width: w.toFixed(1), height: 38, rx: 19, fill: "#ffffff", "fill-opacity": ".07", stroke: "#ffffff", "stroke-opacity": ".10" });
        g.insertBefore(r, t);
        x += w + 10;
      }
      g.removeAttribute("class");
      g.removeAttribute("data-x");
      g.removeAttribute("data-y");
    }
    return svg.outerHTML;
  }, CHIPS);
  await page.locator("svg").first().screenshot({ path: DIR + png, omitBackground: true });
  console.log("wrote", DIR + png);
  return markup + "\n";
}

await render(logo, 512, 512, "logo.png");
await writeFile(DIR + "banner.svg", await render(banner({ w: 1280, h: 400, rx: 28, icon: 300, ix: 56, iy: 50, tx: 400, ty: 168 }), 1280, 400, "banner.png"));
await writeFile(DIR + "social-preview.svg", await render(banner({ w: 1280, h: 640, rx: 0, icon: 360, ix: 70, iy: 140, tx: 470, ty: 290 }), 1280, 640, "social-preview.png"));
await browser.close();
