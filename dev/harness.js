// Dev harness for M1: plays the fixture cycles through the integration emulator and shows what the model makes of them.
// URL: /dev/?cycle=<id>&t=<seconds>&lang=nl|en&theme=light|dark&play=1
import { simulate, Player } from "./replay.js";
import { createMockHass } from "./mock-hass.js";
import { MieleTracker, familyOf, readSnapshot, DRY_LADDER } from "../src/miele-model.js";

const $ = id => document.getElementById(id);
const getJSON = p => fetch(p).then(r => r.json());
const [registry, nl, en, fixtures, extra] = await Promise.all([
  getJSON("./data/peter-registry.json"), getJSON("./data/translations.nl.json"), getJSON("./data/translations.en.json"),
  getJSON("../docs/fixtures.json"), getJSON("./data/fixtures-extra.json")]);
const translations = { nl, en };
const cycles = [...fixtures.cycles, ...extra.cycles];

const T = {
  nl: { off: "Uit", offline: "Niet verbonden", standby: "Aan", ready: "Klaar om te starten", scheduled: "Gepland", running: "Bezig",
    paused: "Gepauzeerd", done: "Klaar", interrupted: "Onderbroken", error: "Storing",
    lcd: { ready: "Klaar", starts: "Start om", smart_grid: "Slim starten", end: "Einde", interrupted: "Onderbroken", error: "Storing",
      almost_done: "Bijna klaar", heating: "Opwarmen", at_temp: "Op temperatuur", paused: "Pauze", rinsing: "Spoelen", offline: "Geen verbinding" },
    mode: { time: "tijd", heat: "opwarmen", at_temp: "op temperatuur", indeterminate: "onbepaald", done: "klaar", none: "—" },
    f: { program: "Programma", phase: "Fase", status: "Miele-status", progress: "Voortgang", end: "Einde om", start: "Start om",
      elapsed: "Verstreken", paused: "Pauzes", temp: "Temperatuur", conn: "Verbinding", flags: "Signalen", controls: "Bediening", dry: "Droogtegraad" },
    conn: { ok: "ok", lost: "weg", held: "laatste toestand vastgehouden", guessed: "afgeleid uit fase" },
    tl: "Tijdlijn", snap: "Wat het model leest", extra: "extra cyclus", min: "min", none: "—" },
  en: { off: "Off", offline: "Not connected", standby: "On", ready: "Ready to start", scheduled: "Scheduled", running: "Running",
    paused: "Paused", done: "Finished", interrupted: "Interrupted", error: "Fault",
    lcd: { ready: "Ready", starts: "Starts at", smart_grid: "Smart start", end: "End", interrupted: "Interrupted", error: "Fault",
      almost_done: "Almost done", heating: "Heating up", at_temp: "At temperature", paused: "Paused", rinsing: "Rinsing", offline: "No connection" },
    mode: { time: "time", heat: "heating", at_temp: "at temperature", indeterminate: "indeterminate", done: "done", none: "—" },
    f: { program: "Programme", phase: "Phase", status: "Miele status", progress: "Progress", end: "Ends at", start: "Starts at",
      elapsed: "Elapsed", paused: "Pauses", temp: "Temperature", conn: "Connection", flags: "Signals", controls: "Controls", dry: "Dryness" },
    conn: { ok: "ok", lost: "lost", held: "last state held", guessed: "inferred from phase" },
    tl: "Timeline", snap: "What the model reads", extra: "extra cycle", min: "min", none: "—" },
};
const STATE_ORDER = ["off", "offline", "standby", "ready", "scheduled", "running", "paused", "done", "interrupted", "error"];
const ROLE_ORDER = ["status", "program", "phase", "program_type", "remaining", "elapsed", "finish", "start_ts", "start_in", "target_temp", "temp",
  "core_temp", "drying_step", "spin_speed", "door", "failure", "remote_control", "mobile_start", "smart_grid", "power", "light", "btn_start", "btn_pause", "btn_stop"];

const q = new URLSearchParams(location.search);
const S = { cycle: q.get("cycle") ?? cycles[0].id, t: Number(q.get("t") ?? 0), lang: q.get("lang") ?? "nl", speed: 60, playing: q.get("play") === "1" };
if (q.get("theme")) document.documentElement.dataset.theme = q.get("theme");
let run;   // { cycle, sim, player, tracker, fam, dev, timeline, t, vm }

const pad = n => String(n).padStart(2, "0");
const countdown = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h ? `${h}:${pad(m)}:${pad(x)}` : `${m}:${pad(x)}`; };
const hmm = s => { const m = Math.round(s / 60); return `${Math.floor(m / 60)}:${pad(m % 60)}`; };
const clock = ms => new Intl.DateTimeFormat(S.lang === "nl" ? "nl-BE" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Brussels" }).format(ms);
const clockS = ms => new Intl.DateTimeFormat(S.lang === "nl" ? "nl-BE" : "en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Brussels" }).format(ms);

function setup(id) {
  const cycle = cycles.find(c => c.id === id) ?? cycles[0];
  const sim = simulate(cycle, registry);
  const dev = registry.devices[sim.deviceId];
  const fam = familyOf(dev.model, dev.model_id);
  run = { cycle, sim, dev, fam, player: new Player(sim, registry), tracker: new MieleTracker(fam), t: -1, vm: null };
  run.timeline = precompute(sim, fam);
  $("t").max = sim.duration;
  drawTimeline();
}

function precompute(sim, fam) {
  const player = new Player(sim, registry), tracker = new MieleTracker(fam), out = [];
  for (let t = -1; t <= sim.duration; t += 1) {
    const vm = tracker.update(readSnapshot({ states: player.seek(t) }, sim.roles), player.now(t));
    out.push([t, vm.state, vm.progress.value, vm.stale]);
  }
  return out;
}

function hassAt() {
  return createMockHass({ registry, translations, states: run.player.states, language: S.lang });
}

// Walk the model forward second by second, so the tracker sees what a card would see.
function goto(t) {
  t = Math.max(-1, Math.min(run.sim.duration, t));
  if (t < run.t) { run.player.reset(); run.tracker = new MieleTracker(run.fam); run.t = -1; }
  const ch = run.sim.changes;
  let i = ch.findIndex(c => c[0] > run.t);
  if (i < 0) i = ch.length;
  for (let s = Math.floor(run.t) + 1; s <= t; s++) {
    while (i < ch.length && ch[i][0] < s) { if (ch[i][0] !== Math.floor(ch[i][0])) step(ch[i][0]); i++; }
    step(s);
  }
  if (t !== Math.floor(t)) step(t);
  run.t = t;
  render();
}
function step(x) {
  run.vm = run.tracker.update(readSnapshot({ states: run.player.seek(x) }, run.sim.roles), run.player.now(x));
}

function label(kind, key) {
  if (key == null) return T[S.lang].none;
  const tk = { program: "program_id", phase: "program_phase", dry: "drying_step", status: "status" }[kind];
  return translations[S.lang].resources[`component.miele.entity.sensor.${tk}.state.${key}`] ?? key;
}

function lcdText(part, vm) {
  if (!part) return "";
  const t = T[S.lang];
  switch (part.kind) {
    case "dashes": return "--:--";
    case "blank": return "";
    case "countdown": return countdown(part.value);
    case "duration": return hmm(part.value);
    case "clock": return clock(part.value);
    case "temp": return `${Math.round(part.value)} ${vm.temps.unit}`;
    case "elapsed": return `${part.value} ${t.min}`;
    case "percent": return vm.progress.value == null ? "" : `${Math.round(vm.progress.value * 100)}%`;
    case "program": return label("program", part.value);
    case "phase": return label("phase", part.value);
    case "text": return t.lcd[part.value] ?? part.value;
  }
  return "";
}

function render() {
  const vm = run.vm, t = T[S.lang], hass = hassAt(), sim = run.sim;
  const now = run.player.now(run.t);
  document.documentElement.lang = S.lang;
  $("clock").textContent = `${clockS(now)} · ${countdown(Math.max(0, run.t))}`;
  $("tlabel").textContent = `${Math.round(run.t)} s / ${sim.duration} s`;
  $("t").value = run.t;
  $("dname").textContent = run.dev.name;
  $("dmodel").textContent = `${run.dev.model_id} · ${run.fam.kind} · ${run.fam.drawing}`;

  const sc = `var(--s-${vm.state})`;
  $("model").style.setProperty("--sc", sc);
  const g = $("gauge");
  g.classList.toggle("indeterminate", vm.progress.mode === "indeterminate");
  g.classList.toggle("stale", vm.stale || vm.state === "offline");
  $("bar").style.strokeDashoffset = String(100 - Math.round((vm.progress.value ?? 0) * 1000) / 10);
  $("bar").style.opacity = vm.progress.value == null ? 0 : 1;
  const main = vm.lcd.main;
  $("lcdm").textContent = lcdText(main, vm);
  $("lcdm").className = "m" + (["text", "program", "phase"].includes(main?.kind) ? " txt" : "");
  $("lcds").textContent = lcdText(vm.lcd.sub, vm);

  const pills = [`<span class="pill">${t[vm.state]}</span>`];
  if (vm.phase) pills.push(`<span class="pill ghost">${label("phase", vm.phase)}</span>`);
  if (vm.stale) pills.push(`<span class="pill ghost">⟲ ${t.conn.held}</span>`);
  $("pills").innerHTML = pills.join("");

  const snapStatus = run.player.states[sim.roles.status]?.state;
  const on = Object.entries(vm.flags ?? {}).filter(([, v]) => v === true).map(([k]) => k);
  const ctl = Object.entries(vm.controls ?? {}).filter(([k, v]) => k !== "disabled" && v).map(([k]) => k);
  const rows = [
    [t.f.program, label("program", vm.program)],
    [t.f.phase, label("phase", vm.phase)],
    [t.f.status, `${label("status", snapStatus)} <span class="chip">${snapStatus}</span>`],
    [t.f.progress, `${t.mode[vm.progress.mode]}${vm.progress.value != null ? ` · ${(vm.progress.value * 100).toFixed(1)}%` : ""}`],
    [t.f.end, vm.endAt ? clock(vm.endAt) : t.none],
    ...(vm.startAt ? [[t.f.start, clock(vm.startAt)]] : []),
    [t.f.elapsed, vm.elapsedMin != null ? `${vm.elapsedMin} ${t.min}` : t.none],
    [t.f.paused, vm.pausedSec ? countdown(vm.pausedSec) : t.none],
    [t.f.temp, vm.temps?.current != null || vm.temps?.target != null ? `${vm.temps.current ?? "–"} → ${vm.temps.target ?? "–"} ${vm.temps.unit}` : t.none],
    [t.f.conn, vm.connection === "lost" ? `<span class="chip on">${t.conn.lost}</span>` : vm.guessed ? `<span class="chip on">${t.conn.guessed}</span>` : t.conn.ok],
    [t.f.flags, on.length ? `<span class="chips">${on.map(f => `<span class="chip on">${f}</span>`).join("")}</span>` : t.none],
    [t.f.controls, ctl.length || vm.controls?.disabled?.length
      ? `<span class="chips">${ctl.map(c => `<span class="chip on">${c}</span>`).join("")}${(vm.controls.disabled ?? []).map(c => `<span class="chip">${c} ✕</span>`).join("")}</span>` : t.none],
  ];
  if (vm.dryness) rows.push([t.f.dry, `<span class="ladder">${DRY_LADDER.filter(k => k !== "hand_iron").map(k =>
    `<i class="${DRY_LADDER.indexOf(k) <= DRY_LADDER.indexOf(vm.dryness.reached ?? "") ? "r" : ""} ${k === vm.dryness.target ? "t" : ""}">${label("dry", k)}</i>`).join("")}</span>`, "full"]);
  $("facts").innerHTML = rows.map(([k, v, cls = ""]) => `<dt class="${cls}">${k}</dt><dd class="${cls}">${v}</dd>`).join("");

  $("tl-title").textContent = `${t.tl} · ${run.cycle.id}`;
  $("snap-title").textContent = t.snap;
  const roles = Object.keys(sim.roles).sort((a, b) => (ROLE_ORDER.indexOf(a) + 1 || 99) - (ROLE_ORDER.indexOf(b) + 1 || 99)).filter(r => ROLE_ORDER.includes(r));
  $("snap").innerHTML = roles.map(r => {
    const eid = sim.roles[r], so = hass.states[eid], unk = !so || ["unknown", "unavailable"].includes(so.state);
    return `<tr><td>${r}</td><td class="eid">${eid}</td><td class="val${unk ? " unk" : ""}">${so ? hass.formatEntityState(so) : "—"}</td></tr>`;
  }).join("");
  $("note").textContent = run.cycle.notes ?? "";
  $("tl").querySelector("#head")?.setAttribute("x1", x(run.t));
  $("tl").querySelector("#head")?.setAttribute("x2", x(run.t));
  document.body.dataset.ready = "1";
}

const x = t => (Math.max(0, t) / run.sim.duration * 1000).toFixed(1);
function drawTimeline() {
  const tl = run.timeline, parts = [];
  let i = 0;
  while (i < tl.length) {
    let j = i;
    while (j + 1 < tl.length && tl[j + 1][1] === tl[i][1] && tl[j + 1][3] === tl[i][3]) j++;
    const w = Math.max(0.8, x(tl[j][0] + 1) - x(tl[i][0]));
    parts.push(`<rect x="${x(tl[i][0])}" y="6" width="${w}" height="26" rx="2" fill="var(--s-${tl[i][1]})" opacity="${tl[i][3] ? 0.45 : 1}"><title>${tl[i][1]}${tl[i][3] ? " (held)" : ""}</title></rect>`);
    i = j + 1;
  }
  const pts = tl.filter(r => r[2] != null).map(r => `${x(r[0])},${(112 - r[2] * 64).toFixed(1)}`);
  // one polyline per contiguous run of known progress
  let path = "", prevT = null;
  for (const r of tl) {
    if (r[2] == null) { prevT = null; continue; }
    path += `${prevT == null ? "M" : "L"}${x(r[0])} ${(112 - r[2] * 64).toFixed(1)} `;
    prevT = r[0];
  }
  parts.push(`<line x1="0" x2="1000" y1="112" y2="112" stroke="var(--line)"/><line x1="0" x2="1000" y1="48" y2="48" stroke="var(--line)" stroke-dasharray="3 4"/>`);
  if (pts.length) parts.push(`<path d="${path}" fill="none" stroke="var(--fg)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`);
  for (const [et, role] of run.cycle.events) if (role === "phase") parts.push(`<line x1="${x(et)}" x2="${x(et)}" y1="36" y2="42" stroke="var(--muted)" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<line id="head" x1="0" x2="0" y1="0" y2="120" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/>`);
  $("tl").innerHTML = parts.join("");
  const seen = [...new Set(tl.map(r => r[1]))].sort((a, b) => STATE_ORDER.indexOf(a) - STATE_ORDER.indexOf(b));
  $("legend").innerHTML = seen.map(s => `<span><i style="background:var(--s-${s})"></i>${T[S.lang][s]}</span>`).join("")
    + `<span><i style="background:var(--fg);height:2px;vertical-align:3px"></i>${T[S.lang].f.progress}</span>`;
}

// --- controls
$("cycle").innerHTML = cycles.map(c => `<option value="${c.id}">${c.id}${extra.cycles.includes(c) ? ` (${T.nl.extra})` : ""}</option>`).join("");
$("cycle").value = S.cycle;
$("lang").value = S.lang;
$("cycle").onchange = e => { S.cycle = e.target.value; setup(S.cycle); goto(0); };
$("lang").onchange = e => { S.lang = e.target.value; drawTimeline(); render(); };
$("speed").onchange = e => { S.speed = Number(e.target.value); };
$("t").oninput = e => goto(Number(e.target.value));
$("theme").onclick = () => { const r = document.documentElement; r.dataset.theme = r.dataset.theme === "dark" ? "light" : "dark"; };
$("play").onclick = () => { S.playing = !S.playing; $("play").textContent = S.playing ? "❚❚" : "▶"; last = performance.now(); };

let last = performance.now();
function tick(ts) {
  if (S.playing) {
    const dt = (ts - last) / 1000 * S.speed;
    if (dt >= 0.25) { goto(Math.min(run.sim.duration, run.t + dt)); last = ts; if (run.t >= run.sim.duration) { S.playing = false; $("play").textContent = "▶"; } }
  } else last = ts;
  requestAnimationFrame(tick);
}

setup(S.cycle);
goto(S.t);
$("play").textContent = S.playing ? "❚❚" : "▶";
requestAnimationFrame(tick);
