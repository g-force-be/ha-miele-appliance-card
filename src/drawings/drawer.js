// Miele ESW 7020 warming drawer (29 cm high, handleless, Push2open), drawn for this card: no logo, no photo.
// The front is plain black glass with a soft vertical sheen and no display or controls (those sit on the drawer's
// top edge, inside). It lines up with the ArtLine ovens above it in the built-in column.
// 600 × 292 units. The static drawing is the dark opening behind the front; the front itself is a layer, so it can
// slide out a little when the drawer opens. The display text floats on the glass, there is no real display.
import { roundedRing } from "./artline.js";

const f = v => `var(--f-${v})`;

export const DRAWER_GEOM = {
  ratio: "600/292", view: "0 0 600 292",
  window: { left: 0, top: 0, width: 100, height: 100, radius: "0.8% / 1.7%" },
  ring: { path: roundedRing(4, 4, 592, 284, 7), width: 3.5 },
  lcd: { x: 35, y: 36, w: 30, h: 28, ghost: true },
  icons: { size: 4.4, at: [[5.5, 14], [10.3, 14], [15.1, 14]] },
  panel: null,
};

export const drawerSVG = u => `<svg class="art-svg" viewBox="0 0 600 292" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="${u}-in" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a1e14"/><stop offset=".25" stop-color="#0c0b0a"/><stop offset="1" stop-color="#050505"/></linearGradient></defs>
<rect x="0" y="0" width="600" height="292" rx="5" fill="url(#${u}-in)"/>
<rect x="8" y="4" width="584" height="34" rx="3" fill="#060607" stroke="#fff" stroke-opacity=".08"/>
<g fill="none" stroke="#d8dce0" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round">
  <circle cx="150" cy="21" r="6"/><path d="M150 14 v5"/><rect x="200" y="14" width="9" height="14" rx="2"/><path d="M250 16 h12 M250 21 h12 M250 26 h12"/>
  <path d="M318 17 h9 v5 a4.5 4.5 0 0 1 -9 0 Z"/><path d="M352 25 h14"/><path d="M420 14 v9 a3 3 0 1 0 1 0"/></g>
<path d="M384 26 c0 -4 4 -4 4 -8 M390 26 c0 -4 4 -4 4 -8 M396 26 c0 -4 4 -4 4 -8" fill="none" stroke="#f2a33a" stroke-width="1.8" stroke-linecap="round"/>
<g fill="#d8dce0" opacity=".75"><rect x="458" y="19" width="12" height="4" rx="2"/><rect x="474" y="19" width="12" height="4" rx="2"/><rect x="490" y="19" width="12" height="4" rx="2"/><rect x="522" y="19" width="12" height="4" rx="2"/></g>
<rect x="506" y="19" width="12" height="4" rx="2" fill="#f2a33a"/>
</svg>`;

export const drawerLayers = u => `<div class="layer front"><svg viewBox="0 0 600 292" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${u}-df" x1="0" x2="1">
    <stop offset="0" style="stop-color:${f("lo")}"/><stop offset=".22" style="stop-color:${f("mid")}"/><stop offset=".5" style="stop-color:${f("hi")}"/>
    <stop offset=".78" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-dv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${u}-df)"/>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${u}-dv)"/>
  <rect x="1.5" y="1.5" width="597" height="289" rx="5" fill="none" style="stroke:${f("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/></svg></div>
  <div class="layer warmline"></div>`;
