// More Miele coffee machines, drawn for this card: no logo, no photo (docs/TOESTELREEKSEN.md §7). The CM 7 stays in
// coffee.js; both use its cup, stream and steam layers (coffeeLayers, 320 × 260, they scale to any window).
//   cm6   CM 6160/6360/6560 MilkPerfection: a narrower body (≈ 25 cm), a DirectSensor text line, a milk container
//   cva   CVA 7000 built-in, 45 cm high: M Touch on a black glass strip, a lit recess with the spout and the cups
import { roundedRing, sensorLine } from "./artline.js";

const f = v => `var(--f-${v})`;

export const COFFEE_DESIGNS = ["cm7", "cm6"];
export const coffeeDesign = id => /^CM6/.test(id) ? "cm6" : "cm7";

// CM 6: 600 × 620 like the CM 7, so the two line up on a counter
export const CM6_GEOM = {
  ratio: "600/620", view: "0 0 600 620",
  window: { left: 42.67, top: 48.39, width: 41.33, height: 41.94, radius: "4% / 5%" },   // 256..504 × 300..560
  ring: { path: roundedRing(248, 292, 264, 276, 18), width: 4.5 },
  lcd: { x: 50, y: 10.2, w: 26, h: 5.4 },
  icons: { size: 4.4, at: [[82, 8], [86.6, 8], [91.2, 8], [95.8, 8]] },
  panel: null,
};

export function cm6SVG(u) {
  const g = id => `url(#${u}-${id})`;
  return `<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${f("lo")}"/><stop offset=".3" style="stop-color:${f("mid")}"/><stop offset=".7" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${u}-glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3a3c40"/><stop offset=".5" stop-color="#151618"/><stop offset="1" stop-color="#0a0b0c"/>
  </linearGradient>
  <linearGradient id="${u}-jar" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/>
  </linearGradient>
  <linearGradient id="${u}-milk" x1="0" x2="1"><stop offset="0" stop-color="#e9e7e2"/><stop offset=".3" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd9d3"/></linearGradient>
  <radialGradient id="${u}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="360" cy="612" rx="250" ry="7" fill="${g("ground")}"/>
<g class="milk">
  <path d="M376 236 C330 236 296 262 268 300 C252 322 214 330 186 344" fill="none" stroke="#d9dcdf" stroke-width="5" stroke-linecap="round"/>
  <rect x="108" y="372" width="96" height="232" rx="14" fill="#c9d3dc" fill-opacity=".22"/>
  <rect x="108" y="372" width="96" height="232" rx="14" fill="${g("jar")}" stroke="#8d969e" stroke-opacity=".7" stroke-width="2"/>
  <path d="M112 470 H200 V590 a12 12 0 0 1 -12 12 H124 a12 12 0 0 1 -12 -12 Z" fill="${g("milk")}"/>
  <rect x="102" y="346" width="108" height="28" rx="7" fill="#1b1c1e"/>
</g>
<g class="body">
  <rect x="232" y="20" width="296" height="584" rx="12" fill="${g("body")}"/>
  <rect x="232.5" y="20.5" width="295" height="583" rx="12" fill="none" style="stroke:${f("edge")}" stroke-width="1.4"/>
  <rect x="236" y="26" width="288" height="190" rx="9" fill="${g("glass")}"/>
  <path d="M244 30 H516" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/>
  <rect x="300" y="63" width="156" height="33" rx="3" fill="#050506" stroke="#fff" stroke-opacity=".08"/>
  <g fill="none" stroke="#c9ced3" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round">
    <circle cx="268" cy="80" r="9"/><path d="M268 72 v5"/>
    <path d="M314 128 h14 v10 a7 7 0 0 1 -14 0 Z M346 128 h18 v9 a9 9 0 0 1 -18 0 Z M384 126 h12 l-2 20 h-8 Z M418 128 h14 v10 a7 7 0 0 1 -14 0 Z"/>
    <path d="M472 132 h10 M477 127 v10"/>
  </g>
</g>
<g class="front">
  <rect x="330" y="220" width="100" height="78" rx="3" fill="${g("steel")}"/>
  <path d="M334 222 H426" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>
  <g fill="#0c0d0e"><circle cx="366" cy="295" r="3.5"/><circle cx="380" cy="295" r="3.5"/><circle cx="394" cy="295" r="3.5"/></g>
  <rect x="250" y="540" width="260" height="34" rx="5" fill="${g("steel")}"/>
  <g stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round">${[548, 554, 560, 566].map(y => `<path d="M266 ${y} H494"/>`).join("")}</g>
  <rect x="240" y="574" width="280" height="30" rx="6" fill="#0d0e0f"/>
</g>
</svg>`;
}

// CVA 7000: 600 × 456 like the compact ovens, so it slots into the built-in column
export const CVA_GEOM = {
  ratio: "600/456", view: "0 0 600 456",
  window: { left: 30, top: 32.89, width: 40, height: 54.82, radius: "3% / 4%" },     // 180..420 × 150..400
  ring: { path: roundedRing(170, 140, 260, 270, 16), width: 5 },
  lcd: { x: 37, y: 4.8, w: 26, h: 16.7 },
  icons: { size: 4.2, at: [[78, 9], [83, 9], [88, 9], [93, 9]] },
  panel: null,
};

export function cvaSVG(u) {
  const g = id => `url(#${u}-${id})`;
  const ink = f("ink");
  return `<svg class="art-svg" viewBox="0 0 600 456" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".45" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-recess" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#050506"/><stop offset="1" stop-color="#1c1d20"/></linearGradient>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${u}-screen" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#121315"/><stop offset="1" stop-color="#040405"/></linearGradient>
</defs>
<g class="body">
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${g("front")}"/>
  <rect x="1.5" y="1.5" width="597" height="453" rx="5" fill="none" style="stroke:${f("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  <rect x="222" y="22" width="156" height="76" rx="5" fill="${g("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${sensorLine(112, ink)}
</g>
<g class="front">
  <rect x="172" y="142" width="256" height="266" rx="14" fill="#000" opacity=".4"/>
  <rect x="180" y="150" width="240" height="250" rx="10" fill="${g("recess")}"/>
  <rect x="258" y="152" width="84" height="56" rx="3" fill="${g("steel")}"/>
  <g fill="#0c0d0e"><circle cx="286" cy="205" r="3.5"/><circle cx="300" cy="205" r="3.5"/><circle cx="314" cy="205" r="3.5"/></g>
  <rect x="196" y="374" width="208" height="20" rx="4" fill="${g("steel")}"/>
  <g stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"><path d="M206 380 H394 M206 386 H394"/></g>
</g>
</svg>`;
}
