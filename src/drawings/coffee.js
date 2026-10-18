// Miele CM 7750 CoffeeSelect, the freestanding countertop machine, drawn for this card: no logo, no photo.
// From Miele's product views: a narrow, tall obsidian black body with a lid on top (bean containers underneath),
// a glass control strip with a small colour display and a line of sensor keys, the central stainless spout with
// the milk pipe running to it, the cup recess, the drip tray with a stainless grille, and the glass milk
// container at the side. 600 × 620 units; the body takes its colours from --f-*; `u` prefixes the ids.
import { roundedRing } from "./artline.js";

const f = v => `var(--f-${v})`;

export const COFFEE_GEOM = {
  ratio: "600/620", view: "0 0 600 620",
  window: { left: 36.67, top: 48.39, width: 53.33, height: 41.94, radius: "4% / 5%" },   // cup recess 220..540 × 300..560
  ring: { path: roundedRing(212, 292, 336, 276, 18), width: 4.5 },
  lcd: { x: 53.67, y: 8.71, w: 19.33, h: 13.55 },
  icons: { size: 4.4, at: [[78, 13.5], [82.6, 13.5], [87.2, 13.5], [91.8, 13.5]] },
  panel: null,
};

export function coffeeSVG(u) {
  const g = id => `url(#${u}-${id})`;
  return `<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${f("lo")}"/><stop offset=".3" style="stop-color:${f("hi")}"/><stop offset=".7" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-glass" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/>
  </linearGradient>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${u}-niche" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#050506"/><stop offset="1" stop-color="#18191b"/>
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
  <rect x="206" y="14" width="348" height="22" rx="7" style="fill:${f("lo")};stroke:${f("edge")}" stroke-width="1.4"/>
  <rect x="190" y="30" width="380" height="580" rx="12" fill="${g("body")}"/>
  <rect x="190.5" y="30.5" width="379" height="579" rx="12" fill="none" style="stroke:${f("edge")}" stroke-width="1.4"/>
  <rect x="190" y="30" width="380" height="176" rx="12" fill="${g("glass")}"/>
  <path d="M190 206 H570" stroke="#000" stroke-opacity=".45" stroke-width="2"/>
  <path d="M198 34 H562" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>

<g class="controls">
  <rect x="322" y="54" width="116" height="84" rx="5" fill="${g("screen")}" stroke="#fff" stroke-opacity=".08"/>
  <path d="M214 176 H546" style="stroke:${f("ink")}" stroke-opacity=".35" stroke-width="1.2"/>
  <circle cx="236" cy="166" r="7" fill="none" style="stroke:${f("ink")}" stroke-opacity=".7" stroke-width="1.6"/>
  <path d="M236 159 v5" style="stroke:${f("ink")}" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M374 162 a5 5 0 1 1 -5 5" fill="none" style="stroke:${f("ink")}" stroke-opacity=".55" stroke-width="1.4"/>
</g>

<g class="front">
  <rect x="220" y="300" width="320" height="260" rx="14" fill="${g("niche")}"/>
  <rect x="328" y="212" width="104" height="90" rx="5" fill="${g("steel")}"/>
  <path d="M332 214 H428" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>
  <rect x="340" y="296" width="80" height="10" rx="3" fill="#2c2f33"/>
  <g fill="#0c0d0e"><circle cx="366" cy="303" r="3.5"/><circle cx="380" cy="303" r="3.5"/><circle cx="394" cy="303" r="3.5"/></g>
  <rect x="214" y="540" width="332" height="30" rx="6" fill="${g("steel")}"/>
  <g stroke="#000" stroke-opacity=".28" stroke-width="2.4">${Array.from({ length: 15 }, (_, i) => `<path d="M${236 + i * 20} 546 V564"/>`).join("")}</g>
  <rect x="210" y="570" width="340" height="30" rx="6" fill="#0d0e0f"/>
  <path d="M214 571 H546" stroke="#fff" stroke-opacity=".1" stroke-width="1.2"/>
</g>
</svg>`;
}

// The cup recess: a latte glass, the coffee and milk running into it, steam, rinse drops and the cup light.
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
