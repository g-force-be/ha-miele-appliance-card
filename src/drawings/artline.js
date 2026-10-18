// Miele ArtLine compact ovens (45 cm, handleless), drawn for this card in Miele's form language: no logo, no photo.
// Proportions from Miele's product views of Peter's DGC 7845 X (steam oven combi) and H 7440 BMX (oven with microwave):
// - a glass control strip on top (≈ 24 % of the height): the DGC has a large M Touch display in the middle,
//   the H 7440 BMX a row of programme symbols above a small display; both have a line of sensor keys underneath;
// - a dark recessed slot below the strip (the handleless door edge, Touch2Open on the DGC);
// - a glass door with a large rectangular window: a dot print on the steam oven, the microwave mesh on the H 7440 BMX.
// Both are 595 × 455 mm and line up with each other and the ESW 7020 drawer in a built-in column.
// 600 × 456 units; the front takes its colours from --f-* (finish.js); `u` prefixes the ids.

const f = v => `var(--f-${v})`;

// rounded-rectangle path that starts at the top centre and runs clockwise, so pathLength=100 fills like a ring
export function roundedRing(x, y, w, h, r) {
  const cx = x + w / 2;
  return `M${cx} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h}`
    + ` H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}

export const artlineGeom = microwave => ({
  ratio: "600/456", view: "0 0 600 456",
  window: { left: 17, top: 44.96, width: 66, height: 36.62, radius: "1.6% / 3.8%" },     // 102..498 × 205..372
  ring: { path: roundedRing(92, 195, 416, 187, 14), width: 6 },
  lcd: microwave ? { x: 41.5, y: 11, w: 17, h: 7.6 } : { x: 37, y: 7, w: 26, h: 13 },
  icons: { size: 4.2, at: [[78, 9], [83, 9], [88, 9], [93, 9]] },           // right end of the control strip
  panel: null,                                                               // details go below the drawing
});

const sensorLine = (y, ink) => {
  const keys = [118, 146, 168, 400, 424, 448, 472];
  return `<path d="M84 ${y} H516" style="stroke:${ink}" stroke-opacity=".28" stroke-width="1.2"/>
  <circle cx="104" cy="${y - 10}" r="6.5" fill="none" style="stroke:${ink}" stroke-opacity=".6" stroke-width="1.6"/>
  <path d="M104 ${y - 16} v5" style="stroke:${ink}" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>
  ${keys.map(x => `<rect x="${x - 4}" y="${y - 14}" width="8" height="8" rx="2" fill="none" style="stroke:${ink}" stroke-opacity=".45" stroke-width="1.2"/>`).join("")}
  <g style="fill:${ink}" opacity=".35">${Array.from({ length: 28 }, (_, i) => `<rect x="${226 + i * 5.4}" y="${y - 11}" width="1.6" height="3" rx=".8"/>`).join("")}</g>`;
};

// the H 7440 BMX's row of programme symbols: small outlined squares with a mark inside
const symbolRow = ink => Array.from({ length: 10 }, (_, i) => {
  const x = 146 + i * 30;
  return `<rect x="${x}" y="31" width="16" height="12" rx="2.4" fill="none" style="stroke:${ink}" stroke-opacity=".9" stroke-width="1.3"/>
    <path d="M${x + 4} ${i % 2 ? 37 : 39} h8" style="stroke:${ink}" stroke-opacity=".8" stroke-width="1.2" stroke-linecap="round"/>`;
}).join("");

export function artlineSVG(u, microwave = false) {
  const g = id => `url(#${u}-${id})`;
  const ink = f("ink");
  const disp = microwave ? { x: 249, y: 50, w: 102, h: 35 } : { x: 222, y: 32, w: 156, h: 59 };
  return `<svg class="art-svg" viewBox="0 0 600 456" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".45" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-sheen" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".02"/><stop offset=".3" stop-color="#fff" stop-opacity=".07"/>
    <stop offset=".55" stop-color="#fff" stop-opacity=".01"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/>
  </linearGradient>
  <linearGradient id="${u}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000"/><stop offset=".7" stop-color="#0b0c0d"/><stop offset="1" stop-color="#1a1b1d"/>
  </linearGradient>
  <linearGradient id="${u}-screen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#121315"/><stop offset="1" stop-color="#040405"/>
  </linearGradient>
</defs>
<g class="body">
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${g("front")}"/>
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${g("sheen")}"/>
  <rect x="1.5" y="1.5" width="597" height="453" rx="5" fill="none" style="stroke:${f("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  ${microwave ? symbolRow(ink) : ""}
  <rect x="${disp.x}" y="${disp.y}" width="${disp.w}" height="${disp.h}" rx="${microwave ? 3 : 5}" fill="${g("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${sensorLine(103, ink)}
</g>
<g class="slot">
  <rect x="1" y="110" width="598" height="15" fill="${g("slot")}"/>
  <path d="M1 110.6 H599" stroke="#fff" stroke-opacity=".22" stroke-width="1.2"/>
  <path d="M1 124.6 H599" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>
</g>
<g class="door">
  <rect x="100" y="203" width="400" height="171" rx="11" fill="#000" opacity=".35"/>
  <rect x="102" y="205" width="396" height="167" rx="9" fill="#0d0e10"/>
</g>
</svg>`;
}
