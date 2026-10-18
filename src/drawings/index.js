// Drawing per family (familyOf().drawing). Each one has an inline SVG, the GEOM table that places the overlays
// (window, ring, display, icons, info panel; all in % of the drawing) and the layers seen through its window.
import { laundrySVG, LAUNDRY_GEOM } from "./laundry.js";
import { windowLayers } from "./drum.js";

// A plain cabinet with a display and a round window, for appliance types without their own drawing.
const GENERIC_GEOM = {
  ratio: "600/700",
  glass: { x: 50, y: 52, d: 44 }, ring: { x: 50, y: 52, d: 60 },
  lcd: { x: 30, y: 7.5, w: 40, h: 8.5 },
  icons: { size: 7.5, at: [[9, 36], [9, 45], [9, 54]] },
  panel: { left: 8, right: 8, top: 76, bottom: 5 },
};
const genericSVG = u => `<svg class="art-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <linearGradient id="${u}-gb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--f-lo)"/><stop offset=".45" style="stop-color:var(--f-hi)"/><stop offset="1" style="stop-color:var(--f-lo)"/></linearGradient></defs>
  <rect x="20" y="10" width="560" height="676" rx="22" fill="url(#${u}-gb)" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="20" y="10" width="560" height="96" rx="22" style="fill:var(--f-mid);stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="172" y="46" width="256" height="70" rx="10" fill="#0b0c0e"/>
  <circle cx="300" cy="364" r="150" style="fill:var(--f-lo);stroke:var(--f-edge)" stroke-width="3"/>
  <circle cx="300" cy="364" r="132" fill="#14181d"/></svg>`;

export const DRAWINGS = {
  washer: { svg: u => laundrySVG(u, false), geom: LAUNDRY_GEOM, window: u => windowLayers(u, false), round: true },
  dryer: { svg: u => laundrySVG(u, true), geom: LAUNDRY_GEOM, window: u => windowLayers(u, true), round: true },
  generic: { svg: genericSVG, geom: GENERIC_GEOM, window: () => "", round: true },
};

export const drawingFor = id => DRAWINGS[id] ?? DRAWINGS.generic;
