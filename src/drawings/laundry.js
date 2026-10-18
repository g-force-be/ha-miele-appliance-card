// Miele W1 washing machine and T1 tumble dryer, drawn for this card in Miele's form language: no logo, no photo.
// Proportions measured from Miele's product views of Peter's machines (WEI 895 WPS 125 Gala Edition, TEF 775 WP):
// - top: the drawer block on the left (detergent drawer / condensate container, with a long slot handle), the black
//   display centred above the door, a small dial with a chrome ring on the right, programme names around it;
// - a large door (≈ 79 % of the width) with a chrome ring, a dark inner ring and a bright stainless drum behind the glass;
// - bottom: two flaps with round push points (W1), or a flap and a ventilation grille (T1).
// Both share height, panel line and door position, so they match side by side.
// 600 × 850 units. Door centre (300, 370). The body takes its colours from --f-* (finish.js); `u` prefixes the ids.

// Design lines (docs/TOESTELREEKSEN.md §1–3). The door and the controls differ, the body stays the same:
//   chrome    W1/T1 "Chrome Edition": chrome door ring, dial with a chrome ring (Peter's WEI 895 and TEF 775)
//   white     "White Edition": door ring and dial in the body colour
//   black     obsidian black door with a white inner ring (125 Edition)
//   graphite  graphite grey PearlFinish door with a chrome inner ring
//   mtouch    M Touch: alu silver door with a chrome ring, a wide colour touch strip and no dial
export const LAUNDRY_DESIGNS = ["chrome", "white", "black", "graphite", "mtouch"];

// From the type number (HA's model_id): M Touch models carry R/V (washers, dryers) or R/W (washer-dryers) as the
// third letter; W1 washers with a second letter S or W belong to the White Edition. Everything else: chrome.
export function laundryDesign(modelId) {
  const id = String(modelId ?? "").replace(/\s+/g, "").toUpperCase();
  if (/^WT[RW]\d/.test(id) || /^[WT][A-Z][RV]\d/.test(id)) return "mtouch";
  if (/^W[SW][A-Z]\d/.test(id)) return "white";
  return "chrome";
}

export const laundryGeom = design => design === "mtouch" ? { ...LAUNDRY_GEOM, lcd: { ...LAUNDRY_GEOM.lcd, w: 57 } } : LAUNDRY_GEOM;

export const LAUNDRY_GEOM = {
  ratio: "600/850", view: "0 0 600 850",
  window: { x: 50, y: 43.53, d: 50 },                                    // round window, % of width
  ring: { path: "M300 132 A238 238 0 1 1 300 608 A238 238 0 1 1 300 132", width: 8.5,   // just outside the chrome ring
    spin: { x: 50, y: 43.53, d: 79.4 } },
  lcd: { x: 36.33, y: 3.06, w: 27.33, h: 7.53 },
  icons: { size: 5.8, at: [[9, 7.4], [16, 7.4], [23, 7.4]] },           // where the logo and model name would be
  panel: { left: 4.5, right: 4.5, top: 75.6, bottom: 5.4 },             // covers the flaps at the bottom
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

// Gradients only the other designs need; Peter's chrome machines get exactly the drawing they always had.
const designDefs = (u, design) => design === "chrome" ? "" : `
  <linearGradient id="${u}-ringW" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${f("hi")}"/><stop offset=".55" style="stop-color:${f("mid")}"/><stop offset="1" style="stop-color:${f("lo")}"/>
  </linearGradient>
  <linearGradient id="${u}-ringB" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4a4c50"/><stop offset=".25" stop-color="#1c1d20"/><stop offset=".6" stop-color="#2d2f33"/><stop offset="1" stop-color="#0f1012"/>
  </linearGradient>
  <linearGradient id="${u}-ringG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8e949a"/><stop offset=".3" stop-color="#5c6267"/><stop offset=".55" stop-color="#7c8288"/><stop offset="1" stop-color="#43484c"/>
  </linearGradient>
  <linearGradient id="${u}-ringS" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e9ecee"/><stop offset=".35" stop-color="#c3c8cd"/><stop offset=".6" stop-color="#d9dde0"/><stop offset="1" stop-color="#a6adb3"/>
  </linearGradient>`;
const DOOR = { chrome: ["chrome", "chromeIn"], white: ["ringW", "ringW"], black: ["ringB", null], graphite: ["ringG", "chromeIn"], mtouch: ["ringS", "chromeIn"] };

export function laundrySVG(u, dryer = false, design = "chrome") {
  const g = id => `url(#${u}-${id})`;
  const [ringOut, ringIn] = DOOR[design] ?? DOOR.chrome;
  const mtouch = design === "mtouch", white = design === "white";
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
  <clipPath id="${u}-top"><path d="${top}"/></clipPath>${designDefs(u, design)}
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
  <rect x="218" y="26" width="${mtouch ? 342 : 164}" height="64" rx="6" fill="${g("screen")}"/>
  <path d="M222 29 H${mtouch ? 556 : 378} L${mtouch ? 540 : 362} 46 H222 Z" fill="#fff" opacity=".045"/>
  ${mtouch ? "" : `<g style="fill:${f("ink")}" opacity=".26">${programLabels(486, 50)}</g>
  <circle cx="486" cy="50" r="26" fill="${g(white ? "knob" : "chrome")}"${white ? ` style="stroke:${f("edge")}" stroke-width="1.2"` : ""}/>
  <circle cx="486" cy="50" r="22.5" fill="${g(white ? "panel" : "chromeIn")}"/>
  <circle cx="486" cy="50" r="19" fill="${g("knob")}" stroke="#000" stroke-opacity=".08"/>
  <path d="M480.5 59.5 L476.5 66.5" stroke="#f2a33a" stroke-width="3.4" stroke-linecap="round"/>`}
</g>

<g class="door">
  <circle cx="303" cy="377" r="238" fill="${g("shadow")}"/>
  <circle cx="300" cy="370" r="228" fill="${g(ringOut)}"/>${white ? `
  <circle cx="300" cy="370" r="227.3" fill="none" style="stroke:${f("edge")}" stroke-width="1.4"/>` : ""}
  <circle cx="300" cy="370" r="214" fill="${ringIn ? g(ringIn) : "#f2f1ec"}"/>${white || design === "black" ? `
  <circle cx="300" cy="370" r="214" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>` : ""}
  <circle cx="300" cy="370" r="186" fill="#8d959c"/>
  <circle cx="300" cy="370" r="183" fill="${g("bezel")}"/>
  <circle cx="300" cy="370" r="151" fill="${g("glass")}"/>
  <path d="${dryer ? "M370.6 218.6 A167 167 0 0 1 447.4 291.6" : "M148.6 299.4 A167 167 0 0 1 216.5 225.4"}" fill="none" stroke="#f2a33a" stroke-width="8" stroke-linecap="round"/>
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
