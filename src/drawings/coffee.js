// Miele CM 7750 CoffeeSelect, the freestanding countertop machine, drawn for this card: no logo, no photo.
// From Miele's product views and Peter's own photo: a glossy black control block that sticks out over the body,
// with a small square colour display, the on/off sensor bottom left and a back arrow under the display; under it
// the central stainless spout (milk pipe running to it), a flat obsidian front with one horizontal seam, the drip
// tray with long slots and two round cup holes, and the glass milk container at the side.
// 600 × 620 units; the body takes its colours from --f-*; `u` prefixes the ids.
import { roundedRing } from "./artline.js";

const f = v => `var(--f-${v})`;

export const COFFEE_GEOM = {
  ratio: "600/620", view: "0 0 600 620",
  window: { left: 36.67, top: 48.39, width: 53.33, height: 41.94, radius: "4% / 5%" },   // cup area 220..540 × 300..560
  ring: { path: roundedRing(212, 292, 336, 276, 18), width: 4.5 },
  lcd: { x: 55, y: 10, w: 16.67, h: 12.58 },
  icons: { size: 4.4, at: [[78, 13.5], [82.6, 13.5], [87.2, 13.5], [91.8, 13.5]] },
  panel: null,
};

export function coffeeSVG(u) {
  const g = id => `url(#${u}-${id})`;
  return `<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${f("lo")}"/><stop offset=".3" style="stop-color:${f("mid")}"/><stop offset=".7" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-block" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("edge")}"/>
  </linearGradient>
  <linearGradient id="${u}-gloss" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity=".03"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/>
  </linearGradient>
  <linearGradient id="${u}-under" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${u}-jar" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/>
  </linearGradient>
  <linearGradient id="${u}-milk" x1="0" x2="1">
    <stop offset="0" stop-color="#e9e7e2"/><stop offset=".3" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd9d3"/>
  </linearGradient>
  <linearGradient id="${u}-screen" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#141517"/><stop offset="1" stop-color="#050506"/></linearGradient>
  <radialGradient id="${u}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="330" cy="612" rx="300" ry="7" fill="${g("ground")}"/>

<g class="milk">
  <path d="M328 238 C268 238 214 272 182 312 C164 334 136 336 116 348" fill="none" stroke="#d9dcdf" stroke-width="5" stroke-linecap="round"/>
  <rect x="44" y="372" width="102" height="232" rx="14" fill="#c9d3dc" fill-opacity=".22"/>
  <rect x="44" y="372" width="102" height="232" rx="14" fill="${g("jar")}" stroke="#8d969e" stroke-opacity=".7" stroke-width="2"/>
  <path d="M48 470 H142 V590 a12 12 0 0 1 -12 12 H60 a12 12 0 0 1 -12 -12 Z" fill="${g("milk")}"/>
  <path d="M95 372 V560" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
  <rect x="38" y="346" width="114" height="28" rx="7" fill="#1b1c1e"/>
  <path d="M44 350 H146" stroke="#fff" stroke-opacity=".15" stroke-width="1.4"/>
</g>

<g class="body">
  <rect x="300" y="8" width="160" height="18" rx="5" style="fill:${f("lo")};stroke:${f("edge")}" stroke-width="1.2"/>
  <rect x="190" y="196" width="380" height="408" rx="10" fill="${g("body")}"/>
  <rect x="190.5" y="196.5" width="379" height="407" rx="10" fill="none" style="stroke:${f("edge")}" stroke-width="1.4"/>
  <path d="M192 414 H568" stroke="#000" stroke-opacity=".4" stroke-width="2"/>
  <path d="M192 416 H568" stroke="#fff" stroke-opacity=".06" stroke-width="1"/>
  <rect x="190" y="208" width="380" height="16" fill="${g("under")}"/>
</g>

<g class="controls">
  <rect x="176" y="22" width="408" height="186" rx="9" fill="${g("block")}"/>
  <rect x="176" y="22" width="408" height="186" rx="9" fill="${g("gloss")}"/>
  <rect x="176.5" y="22.5" width="407" height="185" rx="9" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>
  <path d="M184 206 H576" stroke="#000" stroke-opacity=".6" stroke-width="3"/>
  <rect x="330" y="62" width="100" height="78" rx="3" fill="${g("screen")}" stroke="#fff" stroke-opacity=".08"/>
  <circle cx="214" cy="182" r="9" fill="none" style="stroke:${f("ink")}" stroke-opacity=".8" stroke-width="1.6"/>
  <path d="M214 175 v5" style="stroke:${f("ink")}" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M374 182 h9 a5 5 0 0 1 0 10 h-7 M378 178 l-4 4 l4 4" fill="none" style="stroke:${f("ink")}" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>

<g class="front">
  <rect x="330" y="216" width="100" height="84" rx="3" fill="${g("steel")}"/>
  <path d="M334 218 H426" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>
  <rect x="340" y="296" width="80" height="10" rx="3" fill="#2c2f33"/>
  <g fill="#0c0d0e"><circle cx="366" cy="303" r="3.5"/><circle cx="380" cy="303" r="3.5"/><circle cx="394" cy="303" r="3.5"/></g>
  <rect x="206" y="538" width="348" height="36" rx="5" fill="${g("steel")}"/>
  <g stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round">${[546, 552, 558, 564, 570].map(y => `<path d="M224 ${y} H536"/>`).join("")}</g>
  <g fill="#1e2124" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"><circle cx="352" cy="557" r="8.5"/><circle cx="408" cy="557" r="8.5"/><circle cx="474" cy="549" r="4"/></g>
  <rect x="198" y="574" width="364" height="30" rx="6" fill="#0d0e0f"/>
  <path d="M202 575 H558" stroke="#fff" stroke-opacity=".1" stroke-width="1.2"/>
</g>
</svg>`;
}

// The cup area: a latte glass, the coffee and milk running into it, steam, rinse drops and the cup light.
// 320 × 260 units, matching the recess.
export function coffeeLayers(u) {
  return `<div class="layer cuplight"></div>
    <div class="layer cup"><svg viewBox="0 0 320 260" aria-hidden="true"><defs>
      <clipPath id="${u}-cupin"><path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z"/></clipPath></defs>
      <g clip-path="url(#${u}-cupin)"><g class="fill"><rect x="120" y="150" width="80" height="100" fill="#6b4226"/><rect x="120" y="130" width="80" height="24" fill="#efe6da"/></g></g>
      <path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
      <path d="M132 128 L138 232" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/></svg></div>
    <div class="layer stream"><div class="jet"></div><div class="jet two"></div></div>
    <div class="layer steam">
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M150 112 C142 96 160 86 150 70 S154 50 148 40" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div>
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M172 112 C180 94 162 84 172 68 S168 48 174 38" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div></div>
    <div class="layer drops">${[146, 160, 174].map(x => `<div class="layer d"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M${x} 10 c3 6 5 9 5 12 a5 5 0 0 1 -10 0 c0 -3 2 -6 5 -12 Z" fill="#cfe6f7" fill-opacity=".8"/></svg></div>`).join("")}</div>`;
}
