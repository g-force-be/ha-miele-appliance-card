// Front colours. The drawings paint the body with these CSS variables; chrome, glass and displays keep their own colours.
// Miele publishes no colour codes for fronts: these are approximations, to be tuned against photos.
//   --f-hi / --f-mid / --f-lo   light, mid and shaded body tone
//   --f-edge                    seams and outlines
//   --f-ink                     markings on the body (dial dots, recesses)
export const FINISHES = {
  lotus_white:     { hi: "#f7f6f2", mid: "#ebeae5", lo: "#d6d5cf", edge: "#bdbcb5", ink: "#6f6e68" },
  brilliant_white: { hi: "#ffffff", mid: "#f2f3f4", lo: "#dcdfe2", edge: "#c3c7cb", ink: "#6b7075" },
  pearl_beige:     { hi: "#efe7db", mid: "#e0d6c6", lo: "#c8bca9", edge: "#aea28f", ink: "#6e6455" },
  clean_steel:     { hi: "#e6e8ea", mid: "#c9cdd1", lo: "#a3a8ad", edge: "#8a9095", ink: "#4f555a" },
  graphite_grey:   { hi: "#6e7175", mid: "#56595d", lo: "#3e4144", edge: "#2e3033", ink: "#b8bcc0" },
  obsidian_black:  { hi: "#3b3c3f", mid: "#27282b", lo: "#18191b", edge: "#0e0e10", ink: "#8d9196" },
};

const hex = h => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h).trim()); return m ? [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)) : null; };
const toHex = rgb => "#" + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, f) => a.map((v, i) => v + (b[i] - v) * f);

// A free colour ("#5a6b7c") becomes a palette by mixing towards white and black.
function fromHex(h) {
  const c = hex(h);
  if (!c) return null;
  const light = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
  return {
    hi: toHex(mix(c, [255, 255, 255], 0.18)), mid: toHex(c), lo: toHex(mix(c, [0, 0, 0], 0.16)),
    edge: toHex(mix(c, [0, 0, 0], 0.32)), ink: toHex(light > 0.55 ? mix(c, [0, 0, 0], 0.55) : mix(c, [255, 255, 255], 0.55)),
  };
}

export const finishPalette = (finish, fallback) => FINISHES[finish] ?? fromHex(finish) ?? FINISHES[fallback] ?? FINISHES.lotus_white;

export const finishVars = palette => Object.entries(palette).map(([k, v]) => `--f-${k}:${v}`).join(";");
