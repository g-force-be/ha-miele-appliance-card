// Miele W1 washing machine and T1 tumble dryer, drawn for this card in Miele's form language: no logo, no photo.
// Proportions measured from Miele's product views of Peter's machines (WEI 895 WPS 125 Gala Edition, TEF 775 WP):
// - top: the drawer block on the left (detergent drawer / condensate container, with a long slot handle), the black
//   display centred above the door, a small dial with a chrome ring on the right, programme names around it;
// - a large door (≈ 79 % of the width) with a chrome ring, a dark inner ring and a bright stainless drum behind the glass;
// - bottom: two flaps with round push points (W1), or a flap and a ventilation grille (T1).
// Both share height, panel line and door position, so they match side by side.
// 600 × 850 units. Door centre (300, 370). The body takes its colours from --f-* (finish.js); `u` prefixes the ids.

export const LAUNDRY_GEOM = {
  ratio: "600/850",
  glass: { x: 50, y: 43.53, d: 50 },          // round window, % of width
  ring: { x: 50, y: 43.53, d: 79.4 },         // progress ring just outside the chrome door ring
  lcd: { x: 36.33, y: 3.06, w: 27.33, h: 7.53 },
  icons: { size: 5.8, at: [[9, 7.4], [16, 7.4], [23, 7.4]] },   // where the logo and model name would be
  panel: { left: 4.5, right: 4.5, top: 75.6, bottom: 5.4 },   // covers the flaps at the bottom
};

const f = v => `var(--f-${v})`;

// fine grey strokes where the panel prints the programme names, each with a dot towards the dial
function programLabels(cx, cy) {
  const widths = [26, 20, 30, 22, 28, 18, 24];
  let s = "";
  widths.forEach((w, i) => {
    const y = cy - 27 + i * 9;
    const r = widths[6 - i];
    s += `<rect x="${cx - 40 - w}" y="${y - 1.1}" width="${w}" height="2.2" rx="1.1"/><circle cx="${cx - 34}" cy="${y}" r="1.3"/>`;
    s += `<rect x="${cx + 40}" y="${y - 1.1}" width="${r}" height="2.2" rx="1.1"/><circle cx="${cx + 34}" cy="${y}" r="1.3"/>`;
  });
  return s;
}

const handle = (x, y, w, h, g) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${g("slot")}"/>
  <path d="M${x + h / 2} ${y + 1.2} H${x + w - h / 2}" stroke="#000" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/>`;

const pushPoint = (cx, cy, g) => `<circle cx="${cx}" cy="${cy}" r="10.5" fill="${g("knob")}" style="stroke:${f("edge")}" stroke-width="1.4"/>`;

export function laundrySVG(u, dryer = false) {
  const g = id => `url(#${u}-${id})`;
  const top = "M10 18 H590 V127 H214 C209 150 190 168 152 170 H10 Z";   // drawer block + panel strip
  return `<svg class="art-svg" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${u}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${f("lo")}"/><stop offset=".05" style="stop-color:${f("mid")}"/>
    <stop offset=".42" style="stop-color:${f("hi")}"/><stop offset=".92" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-sheen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="${u}-panel" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".7" style="stop-color:${f("hi")}"/><stop offset="1" style="stop-color:${f("mid")}"/>
  </linearGradient>
  <linearGradient id="${u}-under" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${u}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${f("edge")}"/><stop offset=".6" style="stop-color:${f("lo")}"/><stop offset="1" style="stop-color:${f("mid")}"/>
  </linearGradient>
  <linearGradient id="${u}-flap" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset="1" style="stop-color:${f("mid")}"/>
  </linearGradient>
  <radialGradient id="${u}-knob" cx=".42" cy=".38" r=".7">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".75" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </radialGradient>
  <linearGradient id="${u}-chrome" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fbfcfd"/><stop offset=".15" stop-color="#cfd4d9"/><stop offset=".32" stop-color="#8a9299"/>
    <stop offset=".48" stop-color="#f3f5f7"/><stop offset=".66" stop-color="#a4abb2"/><stop offset=".82" stop-color="#e6e9ec"/><stop offset="1" stop-color="#7a828a"/>
  </linearGradient>
  <linearGradient id="${u}-chromeIn" x1="1" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#f4f6f7"/><stop offset=".35" stop-color="#9ea6ad"/><stop offset=".6" stop-color="#e2e6e9"/><stop offset="1" stop-color="#8c949b"/>
  </linearGradient>
  <radialGradient id="${u}-bezel" cx=".5" cy=".42" r=".55">
    <stop offset=".72" stop-color="${dryer ? "#5b6066" : "#3a3e43"}"/><stop offset=".88" stop-color="${dryer ? "#3d4146" : "#1f2225"}"/><stop offset="1" stop-color="#121416"/>
  </radialGradient>
  <radialGradient id="${u}-glass" cx=".45" cy=".4" r=".65">
    <stop offset="0" stop-color="#7d858c"/><stop offset=".7" stop-color="#454b51"/><stop offset="1" stop-color="#22262a"/>
  </radialGradient>
  <radialGradient id="${u}-shadow">
    <stop offset=".9" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${u}-ground" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${u}-screen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#17191c"/><stop offset="1" stop-color="#060708"/>
  </linearGradient>
  <clipPath id="${u}-top"><path d="${top}"/></clipPath>
</defs>

<ellipse cx="300" cy="842" rx="292" ry="8" fill="${g("ground")}"/>

<g class="body">
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${g("body")}"/>
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${g("sheen")}"/>
  <rect x="10.5" y="8.5" width="579" height="829" rx="10" fill="none" style="stroke:${f("edge")}" stroke-width="1.3"/>
  <path d="M14 10 H586" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"/>
  <path d="M10 18 H590" style="stroke:${f("edge")}" stroke-opacity=".7" stroke-width="1.1"/>
</g>

<g class="controls">
  <path d="${top}" fill="${g("panel")}"/>
  <path d="M214 127 C209 150 190 168 152 170 H10 V188 H152 C200 186 226 160 232 145 H590 V127 Z" fill="${g("under")}"/>
  <path d="M590 127 H214 C209 150 190 168 152 170 H10" fill="none" style="stroke:${f("edge")}" stroke-width="1.3"/>
  <path d="M207 19 V110" style="stroke:${f("edge")}" stroke-opacity=".75" stroke-width="1.1"/>
  ${handle(44, 128, 110, 24, g)}
  <rect x="218" y="26" width="164" height="64" rx="6" fill="${g("screen")}"/>
  <path d="M222 29 H378 L362 46 H222 Z" fill="#fff" opacity=".045"/>
  <g style="fill:${f("ink")}" opacity=".26">${programLabels(486, 50)}</g>
  <circle cx="486" cy="50" r="26" fill="${g("chrome")}"/>
  <circle cx="486" cy="50" r="22.5" fill="${g("chromeIn")}"/>
  <circle cx="486" cy="50" r="19" fill="${g("knob")}" stroke="#000" stroke-opacity=".08"/>
  <path d="M486 37 V44" style="stroke:${f("ink")}" stroke-width="2.6" stroke-linecap="round"/>
</g>

<g class="door">
  <circle cx="303" cy="377" r="238" fill="${g("shadow")}"/>
  <circle cx="300" cy="370" r="228" fill="${g("chrome")}"/>
  <circle cx="300" cy="370" r="214" fill="${g("chromeIn")}"/>
  <circle cx="300" cy="370" r="186" fill="#8d959c"/>
  <circle cx="300" cy="370" r="183" fill="${g("bezel")}"/>
  <circle cx="300" cy="370" r="151" fill="${g("glass")}"/>
  <path d="M520 334 a228 228 0 0 1 0 72" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
  <path d="M110 250 a222 222 0 0 1 150 -100" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>
</g>

<g class="lower">
  ${dryer
    ? `<rect x="30" y="646" width="236" height="154" rx="8" fill="${g("flap")}" style="stroke:${f("edge")}" stroke-width="1.3"/>
  ${pushPoint(148, 722, g)}
  <rect x="274" y="646" width="296" height="154" rx="8" fill="${g("flap")}" style="stroke:${f("edge")}" stroke-width="1.3"/>
  <g style="fill:${f("lo")}">${Array.from({ length: 13 }, (_, i) => `<rect x="290" y="${660 + i * 10.4}" width="264" height="5" rx="2.5"/>`).join("")}</g>
  <g fill="#000" opacity=".1">${Array.from({ length: 13 }, (_, i) => `<rect x="290" y="${660 + i * 10.4}" width="264" height="1.6" rx=".8"/>`).join("")}</g>`
    : `<rect x="35" y="646" width="180" height="152" rx="8" fill="${g("flap")}" style="stroke:${f("edge")}" stroke-width="1.3"/>
  ${pushPoint(125, 672, g)}
  <rect x="272" y="646" width="292" height="152" rx="8" fill="${g("flap")}" style="stroke:${f("edge")}" stroke-width="1.3"/>
  ${pushPoint(418, 672, g)}`}
  <rect x="10" y="810" width="580" height="28" rx="6" style="fill:${f("lo")}"/>
  <path d="M12 810.5 H588" style="stroke:${f("edge")}" stroke-width="1.2"/>
  <rect x="10" y="830" width="580" height="8" rx="4" fill="#000" opacity=".22"/>
</g>
</svg>`;
}
