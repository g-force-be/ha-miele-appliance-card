// Drawing per family (familyOf().drawing). Each has an inline SVG, the layers seen through its window, and a GEOM
// table that places the overlays:
//   ratio / view   aspect ratio and viewBox of the drawing
//   window         round {x, y, d} (centre and diameter, % of width) or rect {left, top, width, height, radius} in %
//   ring           progress path in drawing units (starts at the top, runs clockwise), stroke width, and for round
//                  windows a `spin` box for the "busy" arc
//   lcd            the appliance's display, % of the drawing; ghost: text on glass where there is no display
//   icons          slot positions for remote control, remote start, door and light (% of the drawing), and their size
//   panel          the info panel over the drawing (% insets), or null to put it underneath
//
// A drawing can come in design lines (door colours, PureLine/VitroLine/ArtLine, integrated or freestanding):
//   designs        the lines it knows, the first one the fallback
//   design(id)     the line a type number (HA's model_id, spaces removed, upper case) points to
//   build(design)  { svg(u), geom, window(u), display } for that line
// The card's `design:` option overrides the guess.
import { laundrySVG, laundryGeom, laundryDesign, LAUNDRY_DESIGNS } from "./laundry.js";
import { windowLayers } from "./drum.js";
import { artlineSVG, artlineGeom } from "./artline.js";
import { cavityLayers } from "./cavity.js";
import { ovenSVG, ovenGeom, ovenDesign, compactDesign, ovenPanel, tallCavityLayers, OVEN_DESIGNS, COMPACT_DESIGNS } from "./oven.js";
import { coffeeSVG, coffeeLayers, COFFEE_GEOM } from "./coffee.js";
import { cm6SVG, cvaSVG, CM6_GEOM, CVA_GEOM, COFFEE_DESIGNS, coffeeDesign } from "./coffee-more.js";
import { drawerSVG, drawerLayers, DRAWER_GEOM } from "./drawer.js";
import { dishwasherSVG, dishwasherGeom, dishwasherLayers, dishwasherDesign, DISHWASHER_DESIGNS } from "./dishwasher.js";
import { hobSVG, hobGeom, hobLayers, hobDesign, hobZoneCount, HOB_DESIGNS } from "./hob.js";
import { hoodSVG, hoodGeom, hoodLayers, hoodDesign, HOOD_DESIGNS } from "./hood.js";
import { fridgeSVG, fridgeGeom, fridgeLayers, fridgeDesign, FRIDGE_DESIGNS, wineSVG, wineGeom, wineLayers, wineDesign, WINE_DESIGNS } from "./cooling.js";
import { robotSVG, robotLayers, ROBOT_GEOM } from "./robot.js";

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

const fixed = parts => ({ build: () => parts });

// 60 cm ovens (and the Dialog oven): the control strip from the type number, microwaves for H …BM
const fullOven = (design, id) => {
  const o = { design, panel: ovenPanel(id), microwave: /^H\d{4}BM/.test(id), full: true };
  return { svg: u => ovenSVG(u, o), geom: ovenGeom(o), window: u => tallCavityLayers(u, o.microwave), display: "oven" };
};
// 45 cm: Peter's ArtLine compacts (M Touch combi-steam, DirectSensor oven-microwave) keep their own drawing
const compactOven = (design, id, microwave) => {
  const panel = id ? ovenPanel(id) : microwave ? "direct" : "mtouch";
  if (design === "artline" && panel === (microwave ? "direct" : "mtouch"))
    return { svg: u => artlineSVG(u, microwave), geom: artlineGeom(microwave), window: u => cavityLayers(u, microwave), display: "oven" };
  const o = { design, panel, microwave, full: false };
  return { svg: u => ovenSVG(u, o), geom: ovenGeom(o), window: u => cavityLayers(u, microwave), display: "oven" };
};

export const DRAWINGS = {
  washer: { designs: LAUNDRY_DESIGNS, design: laundryDesign,
    build: d => ({ svg: u => laundrySVG(u, false, d), geom: laundryGeom(d), window: u => windowLayers(u, false), display: "line" }) },
  washer_dryer: { designs: LAUNDRY_DESIGNS, design: laundryDesign,
    build: d => ({ svg: u => laundrySVG(u, false, d), geom: laundryGeom(d), window: u => windowLayers(u, false, true), display: "line" }) },
  dryer: { designs: LAUNDRY_DESIGNS, design: laundryDesign,
    build: d => ({ svg: u => laundrySVG(u, true, d), geom: laundryGeom(d), window: u => windowLayers(u, true), display: d === "mtouch" ? "line" : "seg" }) },
  oven: { designs: OVEN_DESIGNS, design: ovenDesign, build: (d, id) => fullOven(d, id) },
  steam_oven: { designs: COMPACT_DESIGNS, design: compactDesign, build: (d, id) => compactOven(d, id, false) },
  microwave: { designs: COMPACT_DESIGNS, design: compactDesign, build: (d, id) => compactOven(d, id, true) },
  coffee: { designs: COFFEE_DESIGNS, design: coffeeDesign,
    build: d => d === "cm6" ? { svg: cm6SVG, geom: CM6_GEOM, window: coffeeLayers, display: "line" }
      : { svg: coffeeSVG, geom: COFFEE_GEOM, window: coffeeLayers, display: "menu" } },
  coffee_builtin: fixed({ svg: cvaSVG, geom: CVA_GEOM, window: coffeeLayers, display: "menu" }),
  drawer: fixed({ svg: drawerSVG, geom: DRAWER_GEOM, window: drawerLayers }),
  dishwasher: { designs: DISHWASHER_DESIGNS, design: dishwasherDesign,
    build: d => ({ svg: u => dishwasherSVG(u, d), geom: dishwasherGeom(d), window: dishwasherLayers, display: "line" }) },
  hob: { designs: HOB_DESIGNS, design: hobDesign,
    build: (d, id) => { const n = hobZoneCount(id); return { svg: u => hobSVG(u, d, n), geom: hobGeom(d, n), window: u => hobLayers(u, d, n), display: "zones" }; } },
  hood: { designs: HOOD_DESIGNS, design: hoodDesign,
    build: d => ({ svg: u => hoodSVG(u, d), geom: hoodGeom(d), window: u => hoodLayers(u, d), display: "hood", finish: "clean_steel" }) },
  fridge: { designs: FRIDGE_DESIGNS, design: fridgeDesign,
    build: d => ({ svg: u => fridgeSVG(u, d), geom: fridgeGeom(), window: fridgeLayers, display: "cool", maxWidth: "260px",
      finish: d === "freestanding" ? "clean_steel" : undefined }) },
  wine: { designs: WINE_DESIGNS, design: wineDesign,
    build: d => ({ svg: u => wineSVG(u, d), geom: wineGeom(), window: wineLayers, display: "cool", maxWidth: "260px" }) },
  robot: fixed({ svg: robotSVG, geom: ROBOT_GEOM, window: robotLayers, display: "robot" }),
  generic: fixed({ svg: genericSVG, geom: GENERIC_GEOM, window: () => "" }),
};

// Ring and highlight colour per drawing: blue for water, amber for warm air and heat, coffee brown, ice blue for cold.
export const ACCENTS = { washer: "#4fa3e0", washer_dryer: "#4fa3e0", dryer: "#e9a23b", dishwasher: "#4fa3e0", oven: "#e07a4f",
  steam_oven: "#e07a4f", microwave: "#e07a4f", coffee: "#c98b5a", coffee_builtin: "#c98b5a", drawer: "#e0a84f", hob: "#e8603c",
  hood: "#8fb3c9", fridge: "#6fc3e8", wine: "#b5536b", robot: "#4fa3e0", generic: "#4fa3e0" };

const typeNumber = modelId => String(modelId ?? "").replace(/\s+/g, "").toUpperCase();

// The design line for a drawing: the configured one if the drawing knows it, else the guess from the type number.
export function designOf(id, configured, modelId) {
  const d = DRAWINGS[id];
  if (!d?.designs) return null;
  if (d.designs.includes(configured)) return configured;
  const guess = d.design?.(typeNumber(modelId));
  return d.designs.includes(guess) ? guess : d.designs[0];
}

export function drawingFor(id, design, modelId) {
  const d = DRAWINGS[id] ?? DRAWINGS.generic;
  return { ...d.build(design ?? d.designs?.[0] ?? null, typeNumber(modelId)), design: design ?? null };
}
