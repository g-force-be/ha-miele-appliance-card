// Miele cooker hoods, drawn for this card: no logo, no photo (docs/TOESTELREEKSEN.md §9).
//   wall   DA 6698 W / DA 4228 W style: a stainless chimney and a slim canopy with touch keys on the front edge
//   aura   DA 7378 D Aura: a white "lamp" hanging from the ceiling, fins underneath, a coloured light ring
// Underneath, what the hood does: vapour from a pan rising into it (faster with a higher fan level), the light cones
// of its lamps. 600 × 560 units; the body takes its colours from --f-* (finish.js).

const f = v => `var(--f-${v})`;

export const HOOD_DESIGNS = ["wall", "aura"];
export const hoodDesign = id => /^DA7\d{3}D/.test(id) ? "aura" : "wall";

export const hoodGeom = design => ({
  ratio: "600/560", view: "0 0 600 560",
  window: { left: 8, top: 55.36, width: 84, height: 42.86, radius: "0" },          // under the hood: 48..552 × 310..550
  ring: { path: "M300 0", width: 0 },
  lcd: design === "aura" ? { x: 40, y: 47, w: 20, h: 3.6, ghost: true } : { x: 66, y: 47.3, w: 24, h: 3.6 },
  icons: { size: 4.2, at: [[8, 4], [13, 4], [18, 4], [23, 4]] },
  panel: null,
});

export function hoodSVG(u, design = "wall") {
  const g = id => `url(#${u}-${id})`;
  const defs = `<defs>
  <linearGradient id="${u}-steel" x1="0" x2="1">
    <stop offset="0" style="stop-color:${f("lo")}"/><stop offset=".25" style="stop-color:${f("hi")}"/><stop offset=".55" style="stop-color:${f("mid")}"/><stop offset=".8" style="stop-color:${f("hi")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-under" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <radialGradient id="${u}-aura" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef0f1"/><stop offset="1" stop-color="#cfd3d6"/></radialGradient>
</defs>`;
  if (design === "aura") return `<svg class="art-svg" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}
<path d="M300 0 V110" stroke="#9aa1a8" stroke-width="4"/>
<ellipse class="aura-glow" cx="300" cy="262" rx="210" ry="40" fill="none" stroke="#7fd3ff" stroke-width="10" stroke-opacity=".8"/>
<path d="M110 250 C110 160 190 110 300 110 C410 110 490 160 490 250 C490 262 470 272 450 272 H150 C130 272 110 262 110 250 Z" fill="${g("aura")}" stroke="#b9bfc4" stroke-width="1.5"/>
<g stroke="#b5bbc0" stroke-width="2" fill="none">${Array.from({ length: 9 }, (_, i) => `<path d="M${170 + i * 32} 272 L${176 + i * 32} 236"/>`).join("")}</g>
<ellipse cx="300" cy="272" rx="150" ry="8" fill="#000" opacity=".18"/>
<path d="M60 556 H540" stroke="#000" stroke-opacity=".25" stroke-width="3"/>
</svg>`;
  return `<svg class="art-svg" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}
<rect x="232" y="0" width="136" height="236" fill="${g("steel")}"/>
<path d="M232 0 V236 M368 0 V236" style="stroke:${f("edge")}" stroke-width="1.4"/>
<path d="M40 236 H560 L548 292 H52 Z" fill="${g("steel")}" style="stroke:${f("edge")}" stroke-width="1.4"/>
<rect x="52" y="292" width="496" height="10" fill="#2a2c2f"/>
<rect x="52" y="302" width="496" height="18" fill="${g("under")}"/>
<circle cx="180" cy="297" r="6" fill="#fff4dc"/><circle cx="420" cy="297" r="6" fill="#fff4dc"/>
<path d="M60 556 H540" stroke="#000" stroke-opacity=".25" stroke-width="3"/>
</svg>`;
}

const wisp = (d, i) => `<div class="layer w" style="animation-delay:-${i * 1.1}s"><svg viewBox="0 0 504 240" preserveAspectRatio="none" aria-hidden="true">
  <path d="${d}" fill="none" stroke="#e9eef2" stroke-opacity=".5" stroke-width="10" stroke-linecap="round"/></svg></div>`;

export function hoodLayers(u, design = "wall") {
  const lamps = design === "aura" ? [252] : [132, 372];
  return `<div class="layer cones"><svg viewBox="0 0 504 240" preserveAspectRatio="none" aria-hidden="true"><defs>
    <linearGradient id="${u}-cone" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff3d6" stop-opacity=".55"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0"/></linearGradient></defs>
    ${lamps.map(x => `<path d="M${x - 6} 0 L${x - 90} 240 H${x + 90} L${x + 6} 0 Z" fill="url(#${u}-cone)"/>`).join("")}</svg></div>
    <div class="layer vapour">${wisp("M200 220 C186 180 214 150 198 110 S210 50 196 10", 0)}${wisp("M252 224 C266 184 238 152 254 110 S242 52 256 8", 1)}${wisp("M304 220 C290 182 318 148 302 108 S314 48 300 10", 2)}</div>
    <div class="layer"><svg viewBox="0 0 504 240" aria-hidden="true">
      <path d="M40 236 H464" stroke="#6f767c" stroke-width="3"/>
      <path d="M178 236 V206 H326 V236" fill="#3d4146" stroke="#8a9198" stroke-width="2"/>
      <path d="M170 206 H334" stroke="#9aa1a8" stroke-width="4" stroke-linecap="round"/></svg></div>`;
}
