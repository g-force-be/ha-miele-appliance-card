// What you see through an ArtLine oven door: the cavity with its rack runners, a dish, the warm glow of the heating,
// the oven light, steam (steam programmes) and microwaves (microwave programmes), and the door print on top.
// Each part is its own layer; the card animates only transform and opacity. Layers are 396 × 167 units (the window).

const cavity = u => `<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  <radialGradient id="${u}-wall" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2a2b2e"/><stop offset=".7" stop-color="#151618"/><stop offset="1" stop-color="#08090a"/></radialGradient></defs>
  <rect width="396" height="167" fill="url(#${u}-wall)"/>
  <path d="M0 0 L40 22 V145 L0 167 M396 0 L356 22 V145 L396 167 M40 22 H356 M40 145 H356" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1.5"/>
  <path d="M6 64 H40 M356 64 H390 M6 112 H40 M356 112 H390" stroke="#9aa1a8" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 14 L80 8 L100 14 L120 8 L140 14 L160 8 L180 14 L200 8 L220 14 L240 8 L260 14 L280 8 L300 14 L320 8 L336 14" fill="none" stroke="#5b5f64" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"/></svg>`;

const dish = () => `<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="M40 112 H356" stroke="#b9c0c6" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M128 112 L138 132 H258 L268 112 Z" fill="#3b3f44"/>
  <path d="M128 112 H268" stroke="#9aa1a8" stroke-width="2"/>
  <path d="M146 112 C156 92 180 86 198 88 C218 86 240 92 250 112 Z" fill="#9c6a42"/>
  <path d="M160 104 C172 96 188 94 198 96" fill="none" stroke="#e2b07a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`;

const wisp = d => `<div class="layer w"><svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="${d}" fill="none" stroke="#f2f5f7" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/></svg></div>`;

const wave = () => `<div class="layer wv"><svg viewBox="0 0 396 167" aria-hidden="true">
  <circle cx="198" cy="84" r="34" fill="none" stroke="#9fd3ff" stroke-opacity=".75" stroke-width="3"/></svg></div>`;

// The door print in front of it all: dots on the steam oven, the microwave's fine mesh on the H 7440 BMX.
const print = (u, microwave) => `<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  ${microwave
    ? `<pattern id="${u}-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/></pattern>`
    : `<pattern id="${u}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".95" fill="#000" fill-opacity=".45"/></pattern>`}
  <linearGradient id="${u}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="396" height="167" fill="url(#${u}-mesh)"/>
  <rect width="396" height="167" fill="url(#${u}-refl)"/></svg>`;

export function cavityLayers(u, microwave = false) {
  return `<div class="layer cavity">${cavity(u)}</div>
    <div class="layer dish">${dish()}</div>
    <div class="layer glow"></div>
    <div class="layer light"></div>
    <div class="layer steam">${wisp("M150 100 C140 80 162 66 150 46 S156 18 148 6")}${wisp("M200 104 C210 82 188 66 200 44 S192 18 202 4")}${wisp("M250 100 C240 78 262 64 248 42 S256 20 246 6")}</div>
    ${microwave ? `<div class="layer waves">${wave()}${wave()}${wave()}</div>` : ""}
    <div class="layer print">${print(u, microwave)}</div>`;
}
