// Miele Scout RX3 robot vacuum, seen from above on its floor, drawn for this card: no logo, no photo
// (docs/TOESTELREEKSEN.md §13). Near-round body with a flat front, the two camera "eyes" of the Home Vision HD on the
// front edge, a touch display on top, two side brushes that turn while it cleans, its station at the wall.
// The ring around it shows the battery. 600 × 600 units; the body takes its colours from --f-* (finish.js).

const f = v => `var(--f-${v})`;

export const ROBOT_GEOM = {
  ratio: "600/600", view: "0 0 600 600",
  window: { left: 0, top: 0, width: 100, height: 100, radius: "3%" },
  ring: { path: "M300 128 A182 182 0 1 1 300 492 A182 182 0 1 1 300 128", width: 9 },
  lcd: { x: 41, y: 44.5, w: 18, h: 6, ghost: true },
  icons: { size: 5, at: [[6, 6], [12, 6], [18, 6], [24, 6]] },
  panel: null,
};

// the floor and the station; the robot itself is a layer so it can sit in the station or out on the floor
export function robotSVG(u) {
  return `<svg class="art-svg" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <pattern id="${u}-floor" width="120" height="40" patternUnits="userSpaceOnUse"><rect width="120" height="40" fill="#b48a62"/>
    <path d="M0 0 H120 M0 20 H120 M60 0 V20 M0 20 V40 M120 20 V40" stroke="#8d6a49" stroke-width="1.4"/></pattern></defs>
  <rect width="600" height="600" rx="18" fill="url(#${u}-floor)"/>
  <rect width="600" height="600" rx="18" fill="#000" opacity=".12"/>
  <rect x="236" y="0" width="128" height="34" rx="6" fill="#2a2c2f"/><rect x="262" y="34" width="76" height="10" rx="3" fill="#3a3d41"/>
  <path d="M296 12 l-6 10 h8 l-4 9" fill="none" stroke="#7fd3ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export function robotLayers(u) {
  const brush = (x, y) => `<g class="brush" style="transform-origin:${x}px ${y}px">${[0, 120, 240].map(a =>
    `<path d="M${x} ${y} l${Math.round(Math.cos((a * Math.PI) / 180) * 46)} ${Math.round(Math.sin((a * Math.PI) / 180) * 46)}" stroke="#d6c7a8" stroke-width="3" stroke-linecap="round"/>`).join("")}</g>`;
  return `<div class="layer trail"><svg viewBox="0 0 600 600" aria-hidden="true">
    <path d="M70 540 H530 V470 H70 V400 H530 V330 H70" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="40" stroke-linejoin="round"/></svg></div>
    <div class="layer bot"><svg viewBox="0 0 600 600" aria-hidden="true"><defs>
      <radialGradient id="${u}-top" cx=".45" cy=".38" r=".7"><stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".7" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/></radialGradient></defs>
      ${brush(212, 214)}${brush(388, 214)}
      <ellipse cx="300" cy="316" rx="168" ry="164" fill="#000" opacity=".28"/>
      <path d="M300 146 C392 146 466 220 466 310 C466 400 392 474 300 474 C208 474 134 400 134 310 C134 238 172 182 212 160 C236 150 266 146 300 146 Z" fill="url(#${u}-top)" style="stroke:${f("edge")}" stroke-width="2"/>
      <path d="M190 172 C228 154 372 154 410 172" fill="none" stroke="#0e0f11" stroke-width="16" stroke-linecap="round"/>
      <circle cx="262" cy="166" r="7" fill="#1d2a36" stroke="#7aa3c2" stroke-width="2"/><circle cx="338" cy="166" r="7" fill="#1d2a36" stroke="#7aa3c2" stroke-width="2"/>
      <rect x="246" y="266" width="108" height="38" rx="8" fill="#0b0c0e" stroke="#fff" stroke-opacity=".1"/>
      <circle cx="300" cy="360" r="16" fill="none" style="stroke:${f("ink")}" stroke-opacity=".7" stroke-width="2.4"/></svg></div>`;
}
