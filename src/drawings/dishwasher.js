// Miele G 7000 / G 5000 dishwasher, 60 cm, drawn for this card: no logo, no photo (docs/TOESTELREEKSEN.md §4).
//   integrated    SCVi: only the kitchen's furniture front; the controls sit on the top edge of the door, the floor
//                 light glows under the plinth while it runs
//   semi          SCi: a straight control band (CleanSteel) with a one-line display above the furniture front
//   freestanding  SC: a CleanSteel front and worktop with the control band on top
// A window in the door shows what you can't see in reality: the racks with plates and glasses, water from the spray
// arms and steam while drying. 600 × 820 units; the door takes its colours from --f-* (finish.js).
import { roundedRing } from "./artline.js";

const f = v => `var(--f-${v})`;

export const DISHWASHER_DESIGNS = ["integrated", "semi", "freestanding"];

// SC / SCi / SCVi (and SCU, built under) at the end of the type number; most models in a Belgian kitchen are integrated
export function dishwasherDesign(id) {
  if (/SCVI|SCU|VI$/i.test(id)) return "integrated";
  if (/SCI$/i.test(id)) return "semi";
  if (/SC$/i.test(id)) return "freestanding";
  return "integrated";
}

// Where the control band and the door start, per design (drawing units)
const LAYOUT = {
  integrated: { band: [0, 40], door: 46 },
  semi: { band: [0, 92], door: 96 },
  freestanding: { band: [16, 108], door: 112 },
};

export function dishwasherGeom(design) {
  const { band } = LAYOUT[design] ?? LAYOUT.integrated;
  const mid = (band[0] + band[1]) / 2, h = Math.min(30, band[1] - band[0] - 10);
  return {
    ratio: "600/820", view: "0 0 600 820",
    window: { left: 14, top: 22.5, width: 72, height: 58, radius: "3% / 2.2%" },     // 84..516 × 184.5..660
    ring: { path: roundedRing(74, 175, 452, 495, 22), width: 6 },
    lcd: { x: 30, y: (mid - h / 2) / 8.2, w: 30, h: h / 8.2 },
    icons: { size: 4, at: [[72, mid / 8.2], [77, mid / 8.2], [82, mid / 8.2], [87, mid / 8.2]] },
    panel: null,
  };
}

// a row of touch keys and a one-line display on the band
const controls = (y0, y1, steel) => {
  const mid = (y0 + y1) / 2, ink = steel ? "#3b4046" : f("ink");
  const keys = [118, 146, 400, 426];
  return `<rect x="176" y="${mid - Math.min(15, (y1 - y0 - 10) / 2)}" width="184" height="${Math.min(30, y1 - y0 - 10)}" rx="3" fill="#0b0c0d" stroke="#fff" stroke-opacity=".06"/>
  <circle cx="72" cy="${mid}" r="8" fill="none" style="stroke:${ink}" stroke-opacity=".7" stroke-width="1.6"/>
  <path d="M72 ${mid - 7} v5" style="stroke:${ink}" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>
  ${keys.map(x => `<rect x="${x - 7}" y="${mid - 5}" width="14" height="10" rx="2.5" fill="none" style="stroke:${ink}" stroke-opacity=".5" stroke-width="1.2"/>`).join("")}`;
};

export function dishwasherSVG(u, design = "integrated") {
  const g = id => `url(#${u}-${id})`;
  const L = LAYOUT[design] ?? LAYOUT.integrated, steelBand = design !== "integrated";
  return `<svg class="art-svg" viewBox="0 0 600 820" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-door" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".5" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#aeb4b9"/><stop offset=".25" stop-color="#dfe3e6"/><stop offset=".55" stop-color="#c3c8cd"/><stop offset=".8" stop-color="#e6e9eb"/><stop offset="1" stop-color="#a3a9ae"/>
  </linearGradient>
  <linearGradient id="${u}-edge" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#d4d8db"/><stop offset="1" stop-color="#8f969c"/>
  </linearGradient>
  <radialGradient id="${u}-floor" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#ff6b3d" stop-opacity=".75"/><stop offset="1" stop-color="#ff6b3d" stop-opacity="0"/></radialGradient>
  <radialGradient id="${u}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="300" cy="814" rx="292" ry="7" fill="${g("ground")}"/>
${design === "freestanding" ? `<rect x="2" y="0" width="596" height="18" rx="4" fill="#3a3d41"/><path d="M4 1 H596" stroke="#fff" stroke-opacity=".18"/>` : ""}
<g class="band">
  ${design === "integrated"
    ? `<rect x="10" y="${L.band[0]}" width="580" height="${L.band[1] - L.band[0]}" rx="3" fill="${g("edge")}"/>`
    : `<rect x="2" y="${L.band[0]}" width="596" height="${L.band[1] - L.band[0]}" rx="3" fill="${g("steel")}"/>
  <path d="M4 ${L.band[1] - .5} H596" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/>`}
  ${controls(L.band[0] + 4, L.band[1] - 4, true)}
</g>
<g class="dwfront">
  <rect x="2" y="${L.door}" width="596" height="${760 - L.door}" rx="4" fill="${design === "freestanding" ? g("steel") : g("door")}"/>
  <rect x="2.5" y="${L.door + .5}" width="595" height="${759 - L.door}" rx="4" fill="none" style="stroke:${f("edge")}" stroke-width="1.4"/>
  ${design === "freestanding" ? `<rect x="230" y="${L.door + 12}" width="140" height="10" rx="5" fill="#8b9197"/>` : ""}
  <rect x="78" y="178" width="444" height="488" rx="16" fill="#000" opacity=".38"/>
  <rect x="84" y="184.5" width="432" height="475.5" rx="12" fill="#121416"/>
</g>
<g class="plinth">
  <rect x="14" y="764" width="572" height="44" rx="3" fill="#1c1d20"/>
  <ellipse class="infolight" cx="300" cy="812" rx="70" ry="7" fill="${g("floor")}"/>
</g>
</svg>`;
}

// --- through the window: the tub, the racks, plates and glasses, the spray, steam and the light inside

const tub = u => `<svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${u}-tub" x1="0" x2="1"><stop offset="0" stop-color="#5b6268"/><stop offset=".2" stop-color="#a3aab0"/><stop offset=".5" stop-color="#c6cbd0"/><stop offset=".8" stop-color="#a3aab0"/><stop offset="1" stop-color="#5b6268"/></linearGradient></defs>
  <rect width="432" height="476" fill="url(#${u}-tub)"/>
  <path d="M0 0 L40 26 V452 L0 476 M432 0 L392 26 V452 L432 476 M40 26 H392 M40 452 H392" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="1.5"/>
  <g fill="none" stroke="#6e757b" stroke-width="2.4" stroke-opacity=".9">
    <path d="M44 70 H388 M44 232 H388 M44 396 H388"/>
    <path d="M44 70 V90 M388 70 V90 M44 232 V256 M388 232 V256"/>
  </g>
  <path d="M60 438 H372" stroke="#7d848a" stroke-width="7" stroke-linecap="round"/>
  <circle cx="216" cy="438" r="11" fill="#868d93"/>
  <path d="M90 270 H342" stroke="#7d848a" stroke-width="6" stroke-linecap="round"/></svg>`;

const plates = () => `<svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true">
  <g fill="#f4f2ec" stroke="#b9b6ae" stroke-width="1.6">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<ellipse cx="${84 + i * 36}" cy="338" rx="11" ry="${i % 3 === 1 ? 50 : 56}"/>`).join("")}</g>
  <g fill="#e1ddd4">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<ellipse cx="${84 + i * 36}" cy="338" rx="5" ry="${i % 3 === 1 ? 32 : 38}"/>`).join("")}</g>
  <g fill="#cfe2ee" fill-opacity=".55" stroke="#9fb8c8" stroke-width="1.5">${[0, 1, 2, 3, 4].map(i => `<path d="M${76 + i * 64} 132 h34 l-4 74 h-26 Z"/>`).join("")}</g>
  <g fill="#e8e3d8" stroke="#b9b3a6" stroke-width="1.5"><path d="M330 150 a28 18 0 0 0 56 0 v40 a28 18 0 0 1 -56 0 Z"/></g>
  <g stroke="#9aa1a7" stroke-width="2.4" stroke-linecap="round">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<path d="M${96 + i * 26} 34 v26"/>`).join("")}</g></svg>`;

// jets of water fanning up from the lower and middle spray arms
const spray = () => `<svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true">
  <g fill="none" stroke="#d9eefc" stroke-width="5.5" stroke-linecap="round">
    ${[90, 150, 216, 282, 342].map((x, i) => `<path class="jet" d="M${x} 434 Q${x + (i - 2) * 10} 400 ${x + (i - 2) * 18} 370" style="animation-delay:-${i * .3}s"/>`).join("")}
    ${[120, 216, 312].map((x, i) => `<path class="jet" d="M${x} 266 Q${x + (i - 1) * 8} 240 ${x + (i - 1) * 14} 214" style="animation-delay:-${i * .4 + .2}s"/>`).join("")}
  </g></svg>`;

const wisp = d => `<div class="layer w"><svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true">
  <path d="${d}" fill="none" stroke="#f2f5f7" stroke-opacity=".45" stroke-width="9" stroke-linecap="round"/></svg></div>`;

export function dishwasherLayers(u) {
  return `<div class="layer tub">${tub(u)}</div>
    <div class="layer plates">${plates()}</div>
    <div class="layer spray">${spray()}</div>
    <div class="layer steam">${wisp("M140 420 C126 360 156 320 138 260 S150 170 136 120")}${wisp("M216 430 C230 370 200 330 218 270 S204 180 220 110")}${wisp("M292 420 C278 362 306 322 290 262 S302 176 288 118")}</div>
    <div class="layer dlight"></div>`;
}
