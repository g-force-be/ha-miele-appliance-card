// Miele fridges, freezers and wine units, drawn for this card: no logo, no photo (docs/TOESTELREEKSEN.md §10–11).
// Drawn shorter than the real 1.85–2 m, so a card stays a card.
//   fridge  freestanding  KFN/KS/FNS 4000: CleanSteel doors with vertical EasyOpen handles, fridge above, freezer below
//           integrated    K 7000 built-in: two furniture fronts with a handle bar (the appliance itself is hidden)
//   wine    freestanding  KWT 6834 SGS: a stainless frame and a tinted glass door: the bottles really show
//           integrated    KWT …iG/UG in a niche: a glass door in a furniture frame
// The fridge's window shows what is behind the door (shelves, a bottle, vegetables), lit when the door opens and
// misted while SuperCool/SuperFrost runs. 600 × 1300 units; the front takes its colours from --f-* (finish.js).
import { roundedRing } from "./artline.js";

const f = v => `var(--f-${v})`;

export const FRIDGE_DESIGNS = ["freestanding", "integrated"];
export const fridgeDesign = id => /^(KFN|KS|FNS|KF|F)\s*[24]\d{3}|^KS\s*28|^FNS\s*28/.test(id) ? "freestanding" : "integrated";
export const WINE_DESIGNS = ["freestanding", "integrated"];
export const wineDesign = id => /(IG|IGS|UG|VI|VIS)$/i.test(id) ? "integrated" : "freestanding";

const geom = (window, lcd) => ({
  ratio: "600/1300", view: "0 0 600 1300", window,
  ring: { path: "M300 0", width: 0 }, lcd,
  icons: { size: 4.6, at: [[12, 2.4], [18, 2.4], [24, 2.4], [30, 2.4]] }, panel: null,
});

export const fridgeGeom = () => geom({ left: 12, top: 9.2, width: 62, height: 49.2, radius: "2% / 1%" },          // 72..444 × 120..760
  { x: 30, y: 3.4, w: 40, h: 4.6 });
export const wineGeom = () => geom({ left: 9.33, top: 8.46, width: 81.33, height: 86.15, radius: "1.6% / .8%" },  // the glass door
  { x: 28, y: 2.4, w: 44, h: 4.4 });

const defs = u => `<defs>
  <linearGradient id="${u}-door" x1="0" x2="1">
    <stop offset="0" style="stop-color:${f("lo")}"/><stop offset=".3" style="stop-color:${f("hi")}"/><stop offset=".7" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8e959b"/><stop offset=".3" stop-color="#e2e5e8"/><stop offset=".6" stop-color="#b6bcc1"/><stop offset="1" stop-color="#8a9197"/>
  </linearGradient>
  <linearGradient id="${u}-tint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3036" stop-opacity=".55"/><stop offset="1" stop-color="#0e1114" stop-opacity=".7"/></linearGradient>
  <radialGradient id="${u}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>`;

export function fridgeSVG(u, design = "freestanding") {
  const g = id => `url(#${u}-${id})`;
  const integrated = design === "integrated";
  return `<svg class="art-svg" viewBox="0 0 600 1300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(u)}
<ellipse cx="300" cy="1294" rx="290" ry="7" fill="${g("ground")}"/>
<rect x="6" y="4" width="588" height="1282" rx="10" fill="#1b1c1f"/>
<g class="doors">
  <rect x="10" y="8" width="580" height="${integrated ? 812 : 830}" rx="8" fill="${g("door")}" style="stroke:${f("edge")}" stroke-width="1.5"/>
  <rect x="10" y="${integrated ? 826 : 846}" width="580" height="${integrated ? 456 : 436}" rx="8" fill="${g("door")}" style="stroke:${f("edge")}" stroke-width="1.5"/>
  ${integrated
    ? `<rect x="120" y="784" width="360" height="12" rx="6" fill="${g("steel")}"/><rect x="120" y="858" width="360" height="12" rx="6" fill="${g("steel")}"/>`
    : `<rect x="532" y="300" width="16" height="300" rx="8" fill="${g("steel")}"/><rect x="532" y="900" width="16" height="240" rx="8" fill="${g("steel")}"/>
  <rect x="180" y="28" width="240" height="72" rx="8" fill="#0b0c0e" stroke="#fff" stroke-opacity=".08"/>`}
  <rect x="68" y="116" width="380" height="648" rx="14" fill="#000" opacity=".3"/>
  <rect x="72" y="120" width="372" height="640" rx="10" fill="#0f1215"/>
</g>
</svg>`;
}

// behind the fridge door: glass shelves, a bottle, a cheese, vegetables in the drawer; light and mist on top
export function fridgeLayers(u) {
  return `<div class="layer inside"><svg viewBox="0 0 372 640" preserveAspectRatio="none" aria-hidden="true"><defs>
    <linearGradient id="${u}-cell" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#dfe8ee"/><stop offset="1" stop-color="#b7c4cd"/></linearGradient></defs>
    <rect width="372" height="640" fill="url(#${u}-cell)"/>
    <g stroke="#ffffff" stroke-opacity=".8" stroke-width="5">${[150, 290, 430].map(y => `<path d="M16 ${y} H356"/>`).join("")}</g>
    <path d="M20 470 H352 V620 H20 Z" fill="#cfdae2" stroke="#9fb0bb" stroke-width="2"/>
    <g fill="#4f7d4a"><circle cx="70" cy="560" r="26"/><circle cx="110" cy="575" r="22"/></g><circle cx="300" cy="570" r="30" fill="#d4593d"/>
    <path d="M60 140 V70 C60 60 66 54 72 50 V36 H86 V50 C92 54 98 60 98 70 V140 Z" fill="#7aa7c6" fill-opacity=".85"/>
    <path d="M200 140 L276 140 L276 104 Z" fill="#f2c95c"/><rect x="150" y="234" width="120" height="56" rx="8" fill="#f4f1ea"/>
    <rect x="230" y="370" width="90" height="60" rx="6" fill="#e9b07a"/></svg></div>
    <div class="layer cold"></div><div class="layer flight"></div>`;
}

export function wineSVG(u, design = "freestanding") {
  const g = id => `url(#${u}-${id})`;
  const integrated = design === "integrated";
  return `<svg class="art-svg" viewBox="0 0 600 1300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(u)}
<ellipse cx="300" cy="1294" rx="290" ry="7" fill="${g("ground")}"/>
<rect x="6" y="4" width="588" height="1282" rx="10" fill="${integrated ? g("door") : g("steel")}"/>
<rect x="6.5" y="4.5" width="587" height="1281" rx="10" fill="none" style="stroke:${f("edge")}" stroke-width="1.5"/>
<rect x="160" y="22" width="280" height="70" rx="8" fill="#0b0c0e" stroke="#fff" stroke-opacity=".08"/>
<rect x="50" y="104" width="500" height="1132" rx="10" fill="#0a0b0c"/>
<rect x="${integrated ? 544 : 556}" y="420" width="14" height="440" rx="7" fill="${integrated ? g("steel") : "#2a2c2f"}"/>
</svg>`;
}

// the bottles in three zones; the card lights them when the light is on, and the tint stays on top
export function wineLayers(u) {
  const bottle = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M0 0 h60 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-60 Z" fill="${c}"/><rect x="68" y="9" width="26" height="12" rx="3" fill="${c}"/><rect x="94" y="10" width="6" height="10" fill="#c9a96a"/></g>`;
  const row = (y, c) => [0, 1, 2, 3].map(i => bottle(36 + i * 112, y, c)).join("");
  return `<div class="layer"><svg viewBox="0 0 488 1120" preserveAspectRatio="none" aria-hidden="true">
    <rect width="488" height="1120" fill="#141618"/>
    <g stroke="#7a6a52" stroke-width="5">${[180, 360, 540, 720, 900].map(y => `<path d="M12 ${y} H476"/>`).join("")}</g>
    <path d="M0 372 H488 M0 748 H488" stroke="#3a3d41" stroke-width="10"/>
    ${[110, 290].map(y => row(y, "#4a1d24")).join("")}${[470, 650].map(y => row(y, "#d9c37a")).join("")}${[830, 1010].map(y => row(y, "#5b1f2b")).join("")}
  </svg></div>
  <div class="layer wlight"></div>
  <div class="layer"><svg viewBox="0 0 488 1120" preserveAspectRatio="none" aria-hidden="true">
    <rect width="488" height="1120" fill="url(#${u}-wt)"/><defs><linearGradient id="${u}-wt" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9fb2c2" stop-opacity=".16"/><stop offset=".5" stop-color="#9fb2c2" stop-opacity=".03"/><stop offset="1" stop-color="#9fb2c2" stop-opacity=".1"/></linearGradient></defs></svg></div>`;
}

export { roundedRing };
