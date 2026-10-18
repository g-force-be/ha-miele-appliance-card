// Seven-segment digits as inline SVG, like the T1 dryer's display. Unlit segments stay faintly visible, as on the real one.
const SEGS = {
  a: "M3.2 1.6 H8.8", b: "M10.4 3.2 V8.8", c: "M10.4 11.2 V16.8", d: "M3.2 18.4 H8.8",
  e: "M1.6 11.2 V16.8", f: "M1.6 3.2 V8.8", g: "M3.2 10 H8.8",
};
const DIGITS = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abfgcd", "-": "g", " ": "" };

export function sevenSeg(text) {
  let x = 0, out = "";
  for (const ch of String(text)) {
    if (ch === ":") {
      out += `<circle cx="${x + 2}" cy="6.4" r="1.25"/><circle cx="${x + 2}" cy="13.6" r="1.25"/>`;
      x += 4.2;
      continue;
    }
    const on = DIGITS[ch] ?? "";
    out += `<g transform="translate(${x} 0)">${Object.entries(SEGS).map(([s, d]) =>
      `<path d="${d}" class="${on.includes(s) ? "on" : "off"}"/>`).join("")}</g>`;
    x += 12.6;
  }
  return `<svg viewBox="-1 0 ${x + 1} 20" aria-hidden="true"><g transform="skewX(-6)">${out}</g></svg>`;
}
