// Miele KM 7000 induction hob and KMDA hob with extraction, seen from above, drawn for this card: no logo, no photo
// (docs/TOESTELREEKSEN.md §8). Black glass ceramic with the printed zones, a pan and a warm glow on every zone that is
// on (HA reports the power per zone), and the ComfortSelect number row along the front edge.
//   induction   zones in two or three columns
//   extractor   KMDA: the extraction grille in the middle, zones left and right
// 600 × 520 units; zones are numbered as HA numbers them (plate 1 …).

export const HOB_DESIGNS = ["induction", "extractor"];
export const hobDesign = id => /^KMDA/.test(id) ? "extractor" : "induction";

// zone count per type number, as HA's sensor.py has it (PLATE_COUNT); 4 when it isn't listed
const PLATES = [["KM7575", 6], ["KM7576", 6], ["KM7678", 6], ["KM7697", 6], ["KM7699", 5], ["KM7740", 5], ["KM7878", 6], ["KM7897", 6],
  ["KM7899", 5], ["KM7999", 5], ["KMDA7633", 5], ["KMDA7634", 5], ["KMDA7774", 5], ["KMX", 6]];
export const hobZoneCount = id => PLATES.find(([p]) => id.startsWith(p))?.[1] ?? 4;

// [cx, cy, r] per zone, rear row first
export function hobLayout(design, n) {
  if (design === "extractor") {
    const side = (x, k) => k === 3 ? [[x, 110, 60], [x, 245, 60], [x, 380, 60]] : [[x, 140, 82], [x, 350, 82]];
    return [...side(140, n >= 5 ? 2 : 2), ...side(460, n >= 5 ? 3 : 2)].slice(0, Math.max(n, 4));
  }
  if (n >= 6) return [[110, 140, 74], [110, 350, 74], [300, 140, 74], [300, 350, 74], [490, 140, 74], [490, 350, 74]];
  if (n === 5) return [[130, 135, 76], [130, 360, 76], [300, 248, 100], [470, 135, 76], [470, 360, 76]];
  return [[160, 135, 72], [160, 345, 96], [440, 135, 96], [440, 345, 72]];
}

export function hobGeom(design, n) {
  return {
    ratio: "600/520", view: "0 0 600 520",
    window: { left: 0, top: 0, width: 100, height: 88.46, radius: "2% / 2.3%" },           // the glass, 600 × 460
    ring: { path: "M300 0", width: 0 },
    lcd: { x: 24, y: 90, w: 52, h: 7.5 },
    icons: { size: 4.2, at: [[83, 94], [88, 94], [93, 94], [78, 94]] },
    panel: null,
  };
}

export function hobSVG(u, design = "induction", n = 4) {
  const g = id => `url(#${u}-${id})`;
  const zones = hobLayout(design, n);
  return `<svg class="art-svg" viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2b2d31"/><stop offset=".45" stop-color="#141517"/><stop offset="1" stop-color="#0a0a0b"/>
  </linearGradient>
  <linearGradient id="${u}-grille" x1="0" x2="1"><stop offset="0" stop-color="#3a3d41"/><stop offset=".5" stop-color="#5a5e63"/><stop offset="1" stop-color="#3a3d41"/></linearGradient>
</defs>
<rect x="0" y="0" width="600" height="520" rx="12" fill="${g("glass")}"/>
<rect x=".75" y=".75" width="598.5" height="518.5" rx="12" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.5"/>
<path d="M20 12 L180 12" stroke="#fff" stroke-opacity=".08" stroke-width="6" stroke-linecap="round"/>
${design === "extractor" ? `<rect x="258" y="30" width="84" height="400" rx="10" fill="${g("grille")}"/>
<g stroke="#1a1b1d" stroke-width="3">${Array.from({ length: 17 }, (_, i) => `<path d="M266 ${48 + i * 22} H334"/>`).join("")}</g>` : ""}
<g fill="none" stroke="#c9ced3" stroke-opacity=".28" stroke-width="2">
  ${zones.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r - 10}" stroke-dasharray="3 7"/>`).join("")}
</g>
<path d="M14 460 H586" stroke="#fff" stroke-opacity=".07" stroke-width="1.2"/>
</svg>`;
}

// the zones that are on: a pan and the glow underneath; the card sets --lvl (0…1) per zone
export function hobLayers(u, design = "induction", n = 4) {
  const zones = hobLayout(design, n);
  return `<div class="layer"><svg viewBox="0 0 600 460" aria-hidden="true"><defs>
  <radialGradient id="${u}-hot"><stop offset="0" stop-color="#ff7a3c" stop-opacity=".95"/><stop offset=".6" stop-color="#ff4d2a" stop-opacity=".45"/><stop offset="1" stop-color="#ff4d2a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${u}-pan" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#5a5f65"/><stop offset=".85" stop-color="#2c2f33"/><stop offset="1" stop-color="#1b1d20"/></radialGradient></defs>
  ${zones.map(([x, y, r], i) => `<g class="zone" data-z="${i}">
    <circle class="zg" cx="${x}" cy="${y}" r="${r + 18}" fill="url(#${u}-hot)"/>
    <g class="pan"><circle cx="${x}" cy="${y}" r="${r - 6}" fill="url(#${u}-pan)" stroke="#9aa1a8" stroke-width="3"/>
      <circle cx="${x}" cy="${y}" r="${r - 18}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
      <path d="M${x + r - 8} ${y - 4} h${Math.round(r * .7)}" stroke="#2c2f33" stroke-width="10" stroke-linecap="round"/></g>
  </g>`).join("")}</svg></div>`;
}
