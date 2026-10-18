// Loads the fixtures and Peter's registry snapshot, and plays a cycle through the model second by second.
import fs from "node:fs";
import { simulate, Player } from "../dev/replay.js";
import { MieleTracker, familyOf, readSnapshot } from "../src/miele-model.js";

const root = new URL("..", import.meta.url);
const json = p => JSON.parse(fs.readFileSync(new URL(p, root), "utf8"));

export const registry = json("dev/data/peter-registry.json");
export const translations = { nl: json("dev/data/translations.nl.json"), en: json("dev/data/translations.en.json") };
export const cycles = Object.fromEntries([...json("docs/fixtures.json").cycles, ...json("dev/data/fixtures-extra.json").cycles].map(c => [c.id, c]));

// Runs one cycle; returns at(t) -> the view model at the last sample at or before t (seconds from the cycle start).
export function play(id, { step = 1, opts } = {}) {
  const sim = simulate(cycles[id], registry);
  const player = new Player(sim, registry);
  const dev = registry.devices[sim.deviceId];
  const tracker = new MieleTracker(familyOf(dev.model, dev.model_id), opts);
  const times = new Set();
  for (let t = -1; t <= sim.duration; t += step) times.add(t);
  for (const [t] of sim.changes) times.add(t);
  const ts = [...times].sort((a, b) => a - b), vms = [];
  for (const t of ts) vms.push(tracker.update(readSnapshot({ states: player.seek(t) }, sim.roles), player.now(t)));
  const at = t => {
    let lo = 0, hi = ts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (ts[mid] <= t) lo = mid; else hi = mid - 1; }
    return vms[lo];
  };
  return { sim, at, samples: ts.map((t, i) => [t, vms[i]]) };
}
