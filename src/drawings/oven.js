// Miele Generation 7000 ovens in their design lines, 60 cm and 45 cm high, and the H 2000 "Active" ovens, drawn for
// this card: no logo, no photo (docs/TOESTELREEKSEN.md §5–6). Peter's ArtLine compacts keep artline.js unchanged.
//   vitroline    all glass, the handle in the glass colour (the default)
//   pureline     black glass with a stainless handle and a stainless trim under the controls
//   artline      handleless (X in the type number): a dark slot under the control strip, Touch2Open
//   contourline  black glass in a stainless frame, stainless handle
//   active       H 2000: two rotary knobs and a small display, stainless handle
// The control strip follows the class digit of the type number (H 7·…): 1–2 DirectSensor S, 3–5 DirectSensor,
// 6–7 M Touch S, 8–9 M Touch; ovens with a microwave and DirectSensor have a row of programme symbols.
// 600 × 596 units (60 cm) or 600 × 456 (45 cm); the front takes its colours from --f-* (finish.js).
import { roundedRing, sensorLine, symbolRow } from "./artline.js";

const f = v => `var(--f-${v})`;

export const OVEN_DESIGNS = ["vitroline", "pureline", "artline", "contourline", "active"];
export const COMPACT_DESIGNS = ["artline", "vitroline", "pureline", "contourline"];

const ARTLINE = /^(H|DGC|DGM|DG|DO)\d{4}[A-Z]*X/;
export function ovenDesign(id) {
  if (/^H2\d/.test(id)) return "active";
  if (ARTLINE.test(id)) return "artline";
  if (/^H71\d/.test(id)) return "contourline";
  return "vitroline";
}
export const compactDesign = id => ARTLINE.test(id) ? "artline" : "vitroline";

// mtouch | mtouchS | direct | directS | knobs, from the class digit
export function ovenPanel(id) {
  if (/^H2\d/.test(id)) return "knobs";
  if (/^DO/.test(id)) return "mtouch";
  const m = /^(?:H|DGC|DGM|DG)\d(\d)/.exec(id);
  const c = m ? Number(m[1]) : 4;
  return c >= 8 ? "mtouch" : c >= 6 ? "mtouchS" : c >= 3 ? "direct" : "directS";
}

const DISPLAY = {
  mtouch: { x: 204, y: 24, w: 192, h: 70 }, mtouchS: { x: 214, y: 30, w: 172, h: 58 },
  direct: { x: 220, y: 34, w: 160, h: 44 }, directS: { x: 236, y: 40, w: 128, h: 36 }, knobs: { x: 236, y: 36, w: 128, h: 42 },
};
const displayOf = (panel, microwave) => panel === "direct" && microwave ? { x: 249, y: 50, w: 102, h: 35 } : DISPLAY[panel] ?? DISPLAY.direct;
const windowOf = full => full ? { x: 92, y: 214, w: 416, h: 336 } : { x: 102, y: 205, w: 396, h: 167 };

export function ovenGeom({ panel, microwave, full }) {
  const H = full ? 596 : 456, d = displayOf(panel, microwave), w = windowOf(full);
  const iconY = 41 / H * 100, x0 = panel === "knobs" ? 63 : 78;
  return {
    ratio: `600/${H}`, view: `0 0 600 ${H}`,
    window: { left: w.x / 6, top: w.y / H * 100, width: w.w / 6, height: w.h / H * 100, radius: full ? "1.6% / 2%" : "1.6% / 3.8%" },
    ring: { path: roundedRing(w.x - 10, w.y - 10, w.w + 20, w.h + 20, 14), width: 6 },
    lcd: { x: d.x / 6, y: d.y / H * 100, w: d.w / 6, h: d.h / H * 100 },
    icons: { size: 4.2, at: [0, 1, 2, 3].map(i => [x0 + i * 5, iconY]) },
    panel: null,
  };
}

const knob = (cx, cy, g) => `<circle cx="${cx}" cy="${cy}" r="27" fill="${g("steel")}"/>
  <circle cx="${cx}" cy="${cy}" r="21" fill="${g("knob")}" stroke="#000" stroke-opacity=".25"/>
  <path d="M${cx} ${cy - 18} v10" stroke="#2a2c2f" stroke-width="3" stroke-linecap="round"/>`;

export function ovenSVG(u, { design = "vitroline", panel = "direct", microwave = false, full = true } = {}) {
  const g = id => `url(#${u}-${id})`;
  const H = full ? 596 : 456, ink = f("ink"), d = displayOf(panel, microwave), w = windowOf(full);
  const steelHandle = design === "pureline" || design === "contourline" || design === "active";
  const inset = design === "contourline" ? 14 : 0;
  return `<svg class="art-svg" viewBox="0 0 600 ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".45" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-sheen" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".02"/><stop offset=".3" stop-color="#fff" stop-opacity=".07"/>
    <stop offset=".55" stop-color="#fff" stop-opacity=".01"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/>
  </linearGradient>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#9aa1a7"/><stop offset=".2" stop-color="#e3e6e9"/><stop offset=".5" stop-color="#b9bfc4"/><stop offset=".8" stop-color="#eceff1"/><stop offset="1" stop-color="#90979d"/>
  </linearGradient>
  <linearGradient id="${u}-glassbar" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <radialGradient id="${u}-knob" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a4d51"/><stop offset="1" stop-color="#16171a"/></radialGradient>
  <linearGradient id="${u}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000"/><stop offset=".7" stop-color="#0b0c0d"/><stop offset="1" stop-color="#1a1b1d"/>
  </linearGradient>
  <linearGradient id="${u}-screen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#121315"/><stop offset="1" stop-color="#040405"/>
  </linearGradient>
</defs>
<g class="body">
  <rect x="1" y="1" width="598" height="${H - 2}" rx="5" fill="${design === "contourline" ? g("steel") : g("front")}"/>
  ${inset ? `<rect x="${inset}" y="${inset}" width="${600 - 2 * inset}" height="${H - 2 * inset}" rx="3" fill="${g("front")}"/>` : ""}
  <rect x="1" y="1" width="598" height="${H - 2}" rx="5" fill="${g("sheen")}"/>
  <rect x="1.5" y="1.5" width="597" height="${H - 3}" rx="5" fill="none" style="stroke:${f("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  ${panel === "direct" && microwave ? symbolRow(ink) : ""}
  ${panel === "knobs" ? knob(96, 60, g) + knob(504, 60, g) : ""}
  <rect x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="${panel.startsWith("mtouch") ? 5 : 3}" fill="${g("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${panel === "knobs" ? "" : sensorLine(103, ink)}
</g>
${design === "artline"
    ? `<g class="slot">
  <rect x="1" y="110" width="598" height="15" fill="${g("slot")}"/>
  <path d="M1 110.6 H599" stroke="#fff" stroke-opacity=".22" stroke-width="1.2"/>
  <path d="M1 124.6 H599" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>
</g>`
    : `<g class="trim">
  <path d="M${inset + 1} 112 H${599 - inset}" stroke="#000" stroke-opacity=".55" stroke-width="2.4"/>
  ${design === "pureline" ? `<rect x="${inset + 1}" y="113" width="${598 - 2 * inset}" height="5" fill="${g("steel")}"/>` : ""}
  <rect x="66" y="${full ? 140 : 136}" width="468" height="9" rx="4.5" fill="#000" opacity=".45"/>
  <rect x="64" y="${full ? 132 : 128}" width="472" height="14" rx="7" fill="${steelHandle ? g("steel") : g("glassbar")}" ${steelHandle ? "" : `style="stroke:${f("edge")}"`} stroke-width="1"/>
  <path d="M72 ${full ? 134 : 130} H528" stroke="#fff" stroke-opacity="${steelHandle ? ".5" : ".32"}" stroke-width="1.4" stroke-linecap="round"/>
</g>`}
<g class="door">
  <rect x="${w.x - 2}" y="${w.y - 2}" width="${w.w + 4}" height="${w.h + 4}" rx="11" fill="#000" opacity=".35"/>
  <rect x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" rx="9" fill="#0d0e10"/>
</g>
</svg>`;
}

// --- the cavity of a 60 cm oven: taller than artline/cavity.js, four shelf levels, the dish on the third

const cavity = u => `<svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true"><defs>
  <radialGradient id="${u}-wall" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2a2b2e"/><stop offset=".7" stop-color="#151618"/><stop offset="1" stop-color="#08090a"/></radialGradient></defs>
  <rect width="396" height="320" fill="url(#${u}-wall)"/>
  <path d="M0 0 L40 26 V294 L0 320 M396 0 L356 26 V294 L396 320 M40 26 H356 M40 294 H356" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1.5"/>
  <path d="${[92, 150, 208, 262].map(y => `M6 ${y} H40 M356 ${y} H390`).join(" ")}" stroke="#9aa1a8" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 16 L80 10 L100 16 L120 10 L140 16 L160 10 L180 16 L200 10 L220 16 L240 10 L260 16 L280 10 L300 16 L320 10 L336 16" fill="none" stroke="#5b5f64" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"/></svg>`;

const dish = () => `<svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true">
  <path d="M40 208 H356" stroke="#b9c0c6" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M120 208 L132 236 H264 L276 208 Z" fill="#3b3f44"/>
  <path d="M120 208 H276" stroke="#9aa1a8" stroke-width="2"/>
  <path d="M140 208 C152 180 180 172 198 174 C220 172 246 180 256 208 Z" fill="#9c6a42"/>
  <path d="M156 198 C170 188 188 186 198 188" fill="none" stroke="#e2b07a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`;

const wisp = path => `<div class="layer w"><svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true">
  <path d="${path}" fill="none" stroke="#f2f5f7" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/></svg></div>`;

const wave = () => `<div class="layer wv"><svg viewBox="0 0 396 320" aria-hidden="true">
  <circle cx="198" cy="180" r="44" fill="none" stroke="#9fd3ff" stroke-opacity=".75" stroke-width="3"/></svg></div>`;

const print = (u, microwave) => `<svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true"><defs>
  ${microwave
    ? `<pattern id="${u}-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/></pattern>`
    : `<pattern id="${u}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".95" fill="#000" fill-opacity=".45"/></pattern>`}
  <linearGradient id="${u}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="396" height="320" fill="url(#${u}-mesh)"/>
  <rect width="396" height="320" fill="url(#${u}-refl)"/></svg>`;

export function tallCavityLayers(u, microwave = false) {
  return `<div class="layer cavity">${cavity(u)}</div>
    <div class="layer dish">${dish()}</div>
    <div class="layer glow"></div>
    <div class="layer light"></div>
    <div class="layer steam">${wisp("M150 196 C140 160 162 136 150 100 S156 50 148 24")}${wisp("M200 200 C210 162 188 136 200 98 S192 48 202 20")}${wisp("M250 196 C240 158 262 134 248 96 S256 52 246 26")}</div>
    ${microwave ? `<div class="layer waves">${wave()}${wave()}${wave()}</div>` : ""}
    <div class="layer print">${print(u, microwave)}</div>`;
}
