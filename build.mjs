// Bundles src/ into one file for HACS: dist/miele-appliance-card.js (ES2020, no runtime dependencies).
//   node build.mjs           build once
//   node build.mjs --watch   rebuild on change
// CARD_VERSION=2026.42.1 sets the version the card reports (the release workflow does this); else "dev".
import * as esbuild from "esbuild";

const version = process.env.CARD_VERSION || "dev";

const banner = `/*! Miele Appliance Card for Home Assistant — https://github.com/g-force-be/ha-miele-appliance-card
 * MIT License. Copyright (c) 2026 My Media Build; Copyright (c) 2026 Peter Gheeraert.
 * Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT.
 * Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. */`;

const options = {
  entryPoints: ["src/index.js"], outfile: "dist/miele-appliance-card.js",
  bundle: true, format: "esm", target: "es2020", minify: true, legalComments: "none", banner: { js: banner }, logLevel: "info",
  define: { __CARD_VERSION__: JSON.stringify(version) },
};

if (process.argv.includes("--watch")) await (await esbuild.context(options)).watch();
else await esbuild.build(options);
