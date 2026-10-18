// Drawing per family (familyOf().drawing). Each has an inline SVG, the layers seen through its window, and a GEOM
// table that places the overlays:
//   ratio / view   aspect ratio and viewBox of the drawing
//   window         round {x, y, d} (centre and diameter, % of width) or rect {left, top, width, height, radius} in %
//   ring           progress path in drawing units (starts at the top, runs clockwise), stroke width, and for round
//                  windows a `spin` box for the "busy" arc
//   lcd            the appliance's display, % of the drawing; ghost: text on glass where there is no display
//   icons          slot positions for remote control, remote start, door and light (% of the drawing), and their size
//   panel          the info panel over the drawing (% insets), or null to put it underneath
import { laundrySVG, LAUNDRY_GEOM } from "./laundry.js";
import { windowLayers } from "./drum.js";
import { artlineSVG, artlineGeom } from "./artline.js";
import { cavityLayers } from "./cavity.js";
import { coffeeSVG, coffeeLayers, COFFEE_GEOM } from "./coffee.js";
import { drawerSVG, drawerLayers, DRAWER_GEOM } from "./drawer.js";

// A plain cabinet with a display and a round window, for appliance types without their own drawing.
const GENERIC_GEOM = {
  ratio: "600/700", view: "0 0 600 700",
  window: { x: 50, y: 52, d: 44 },
  ring: { path: "M300 202 A162 162 0 1 1 300 526 A162 162 0 1 1 300 202", width: 7, spin: { x: 50, y: 52, d: 54 } },
  lcd: { x: 30, y: 7.5, w: 40, h: 8.5 },
  icons: { size: 6, at: [[9, 22], [9, 30], [9, 38], [9, 46]] },
  panel: null,
};
const genericSVG = u => `<svg class="art-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <linearGradient id="${u}-gb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--f-lo)"/><stop offset=".45" style="stop-color:var(--f-hi)"/><stop offset="1" style="stop-color:var(--f-lo)"/></linearGradient></defs>
  <rect x="20" y="10" width="560" height="676" rx="22" fill="url(#${u}-gb)" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <path d="M22 116 H578" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="172" y="46" width="256" height="70" rx="10" fill="#0b0c0e"/>
  <circle cx="300" cy="364" r="150" style="fill:var(--f-lo);stroke:var(--f-edge)" stroke-width="3"/>
  <circle cx="300" cy="364" r="132" fill="#14181d"/></svg>`;

export const DRAWINGS = {
  washer: { svg: u => laundrySVG(u, false), geom: LAUNDRY_GEOM, window: u => windowLayers(u, false) },
  dryer: { svg: u => laundrySVG(u, true), geom: LAUNDRY_GEOM, window: u => windowLayers(u, true) },
  steam_oven: { svg: u => artlineSVG(u, false), geom: artlineGeom(false), window: u => cavityLayers(u, false) },
  microwave: { svg: u => artlineSVG(u, true), geom: artlineGeom(true), window: u => cavityLayers(u, true) },
  coffee: { svg: coffeeSVG, geom: COFFEE_GEOM, window: coffeeLayers },
  drawer: { svg: drawerSVG, geom: DRAWER_GEOM, window: drawerLayers },
  generic: { svg: genericSVG, geom: GENERIC_GEOM, window: () => "" },
};

export const drawingFor = id => DRAWINGS[id] ?? DRAWINGS.generic;
