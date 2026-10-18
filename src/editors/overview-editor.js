// Visual editor for miele-overview-card (SPEC §8): the preset, every Miele appliance with show/hide, order, name,
// colours, programmes and favourites, warnings (buttons switched off in Home Assistant, Start op afstand off, no
// connection) and "Kopieer als losse kaarten".
import { scanDevices, disabledControls } from "../miele-model.js";
import { PRESETS, resolveAppliances, suggestAppliances, planLayout, exportCards } from "../layout.js";
import { t } from "../i18n/index.js";
import { toYaml } from "../ui/yaml.js";
import { loadHaForm, fireConfig, clean, selectors, programmeOptions } from "./form.js";
import { DRAWINGS } from "../drawings/index.js";

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const CSS = `
:host { display: block; }
h3 { margin: 18px 0 8px; font-size: 15px; font-weight: 500; }
.bar { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 4px; }
button { font: 500 13.5px/1 var(--ha-font-family-body, inherit); min-height: 36px; padding: 0 14px; border-radius: 18px; cursor: pointer;
  color: var(--primary-color, #03a9f4); background: none; border: 1px solid var(--divider-color, #ddd); }
button.icon { min-height: 32px; width: 32px; padding: 0; border-radius: 50%; color: var(--secondary-text-color, #666); }
button:disabled { opacity: .35; cursor: default; }
.dev { border: 1px solid var(--divider-color, #ddd); border-radius: 12px; margin: 0 0 8px; background: var(--card-background-color, #fff); }
.dev.off { opacity: .6; }
.dh { display: flex; align-items: center; gap: 10px; padding: 8px 10px; }
.dh input { width: 18px; height: 18px; margin: 0; accent-color: var(--primary-color, #03a9f4); }
.dn { flex: 1; min-width: 0; cursor: pointer; }
.dn b { display: block; font-weight: 500; font-size: 14px; }
.dn small { color: var(--secondary-text-color, #666); font-size: 12px; }
.warn { margin: 0 10px 8px 38px; font-size: 12.5px; line-height: 1.4; color: var(--secondary-text-color, #666); display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
.warn.bad { color: var(--error-color, #db4437); }
.warn.alert { color: var(--warning-color, #ffa600); }
.db { padding: 0 12px 12px 38px; }
.db[hidden] { display: none; }
textarea { width: 100%; box-sizing: border-box; min-height: 220px; margin-top: 8px; font: 12px/1.45 ui-monospace, Menlo, Consolas, monospace;
  border-radius: 8px; border: 1px solid var(--divider-color, #ddd); padding: 8px; background: var(--secondary-background-color, #f6f6f6);
  color: var(--primary-text-color, #222); }
.note { font-size: 12.5px; color: var(--secondary-text-color, #666); margin-top: 6px; }
`;

export class MieleOverviewCardEditor extends HTMLElement {
  setConfig(config) { this._config = { ...config }; this._render(); }
  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._loadRegistry();
    this._render();
  }
  async connectedCallback() { await loadHaForm(); this._ready = true; this._render(); }

  get _lang() { return String(this._config?.language || this._hass?.locale?.language || this._hass?.language || "en").slice(0, 2) === "nl" ? "nl" : "en"; }
  _t(key, vars) { return t(this._lang, key, vars); }

  // Buttons the integration creates disabled are only in the full entity registry (admins).
  async _loadRegistry() {
    try { this._registry = await this._hass.callWS({ type: "config/entity_registry/list" }); }
    catch { this._registry = null; }
    this._render();
  }

  _change(next) {
    this._config = clean(next, { layout: "rooms" });
    fireConfig(this, this._config);
    this._render();
  }

  // Every appliance with its entry; writing back keeps the full list, in the shown order.
  _entries() { return resolveAppliances(scanDevices(this._hass), this._config, this._hass, { all: true }); }
  _writeEntries(entries) {
    this._change({ ...this._config, appliances: entries.map(e => clean({ entity: e.dev.roles.status, ...e.opts, auto: undefined })) });
  }

  _render() {
    if (!this._ready || !this._config || !this._hass) return;
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    if (!this._main) {
      r.innerHTML = `<style>${CSS}</style><div id="main"></div><div class="bar"><button id="suggest"></button><button id="export"></button></div>
        <div id="out" hidden><textarea id="yaml" readonly></textarea><div class="note" id="copied"></div></div>
        <h3 id="h-dev"></h3><div id="devs"></div>`;
      this._main = document.createElement("ha-form");
      this._main.computeLabel = s => this._t(`ed.f.${s.name}`);
      this._main.addEventListener("value-changed", e => { e.stopPropagation(); this._change({ ...this._config, ...e.detail.value }); });
      r.getElementById("main").append(this._main);
      r.getElementById("suggest").onclick = () => this._change({ ...this._config, appliances: suggestAppliances(scanDevices(this._hass)) });
      r.getElementById("export").onclick = () => this._export();
      this._rows = new Map();
    }
    const s = selectors(this._lang);
    this._main.hass = this._hass;
    this._main.schema = [
      { name: "layout", selector: { select: { mode: "list", options: PRESETS.map(p => ({ value: p, label: this._t(`ed.layout.${p}`) })) } } },
      { type: "grid", name: "", schema: [{ name: "theme", selector: s.theme }, { name: "animations", selector: s.animations }] },
      { name: "language", selector: s.language },
    ];
    this._main.data = { layout: "rooms", theme: "dark", ...this._config };
    r.getElementById("suggest").textContent = this._t("ed.suggest");
    r.getElementById("export").textContent = this._t("ed.export");
    r.getElementById("h-dev").textContent = this._t("ed.appliances");

    const entries = this._entries();
    entries.forEach((e, i) => this._row(e, i, entries));
    for (const [id, row] of this._rows) if (!entries.some(e => e.dev.id === id)) { row.el.remove(); this._rows.delete(id); }
  }

  // One appliance: show/hide, name and type, order, warnings, and its own settings when opened.
  _row(entry, i, entries) {
    const { dev, opts } = entry, h = this._hass, lang = this._lang;
    let row = this._rows.get(dev.id);
    if (!row) {
      const el = document.createElement("div");
      el.className = "dev";
      el.innerHTML = `<div class="dh"><input type="checkbox"><div class="dn"><b></b><small></small></div>
        <button class="icon up" title="↑">▲</button><button class="icon down" title="↓">▼</button></div><div class="ws"></div><div class="db" hidden></div>`;
      const form = document.createElement("ha-form");
      form.computeLabel = sc => this._t(`ed.f.${sc.name}`);
      form.addEventListener("value-changed", ev => {
        ev.stopPropagation();
        const all = this._entries(), at = all.findIndex(x => x.dev.id === dev.id), v = { ...ev.detail.value };
        // a programmes card is the default where starting is possible: only write it when it's switched off
        if (v.programmes === ["laundry", "oven", "coffee"].includes(dev.family.group)) delete v.programmes;
        all[at] = { ...all[at], opts: { ...all[at].opts, programmes: undefined, ...v } };
        this._writeEntries(all);
      });
      el.querySelector(".db").append(form);
      el.querySelector(".dn").onclick = () => { const db = el.querySelector(".db"); db.hidden = !db.hidden; };
      el.querySelector("input").onchange = ev => {
        const all = this._entries(), at = all.findIndex(x => x.dev.id === dev.id);
        all[at] = { ...all[at], opts: { ...all[at].opts, show: ev.target.checked ? undefined : false } };
        this._writeEntries(all);
      };
      const move = d => () => {
        const all = this._entries(), at = all.findIndex(x => x.dev.id === dev.id), to = at + d;
        if (to < 0 || to >= all.length) return;
        [all[at], all[to]] = [all[to], all[at]];
        this._writeEntries(all);
      };
      el.querySelector(".up").onclick = move(-1);
      el.querySelector(".down").onclick = move(1);
      row = { el, form };
      this._rows.set(dev.id, row);
    }
    const { el, form } = row, shown = opts.show !== false;
    el.classList.toggle("off", !shown);
    el.querySelector("input").checked = shown;
    el.querySelector("b").textContent = opts.name || h.devices?.[dev.id]?.name_by_user || t(lang, `kind.${dev.family.kind}`);
    el.querySelector("small").textContent = [dev.modelId ?? dev.model, t(lang, `ed.drawing.${dev.family.drawing}`), h.areas?.[dev.areaId]?.name].filter(Boolean).join(" · ");
    el.querySelector(".up").disabled = i === 0;
    el.querySelector(".down").disabled = i === entries.length - 1;
    el.querySelector(".ws").innerHTML = this._warnings(dev);
    el.querySelector(".ws button")?.addEventListener("click", ev => this._enable(dev, ev.target));
    const s = selectors(lang), startable = ["laundry", "oven", "coffee"].includes(dev.family.group);
    form.hass = h;
    form.schema = [
      { type: "grid", name: "", schema: [{ name: "name", selector: s.text }, { name: "finish", selector: s.finish }] },
      ...((DRAWINGS[dev.family.drawing]?.designs?.length ?? 0) > 1 ? [{ name: "design", selector: s.design(dev.family.drawing) }] : []),
      { type: "grid", name: "", schema: [{ name: "accent", selector: s.text }, ...(startable ? [{ name: "programmes", selector: s.boolean }] : [])] },
      ...(startable && opts.programmes !== false ? [{ name: "programs", selector: { select: { multiple: true, mode: "list", options: programmeOptions(h, dev, lang) } } }] : []),
    ];
    form.data = { programmes: startable, ...opts };
    const list = this.shadowRoot.getElementById("devs");
    if (list.children[i] !== el) list.insertBefore(el, list.children[i] ?? null);
    return el;
  }

  _warnings(dev) {
    const h = this._hass, out = [];
    const off = disabledControls(this._registry, dev.id);
    if (Object.keys(off).length)
      out.push(`<div class="warn alert">⚠ ${esc(this._t("ed.w.buttons"))} <button>${esc(this._t("ed.w.enable"))}</button></div>`);
    if (h.states?.[dev.roles.status]?.state === "not_connected") out.push(`<div class="warn bad">⚠ ${esc(this._t("ed.w.offline"))}</div>`);
    else if (dev.roles.mobile_start && h.states?.[dev.roles.mobile_start]?.state === "off" && ["laundry", "oven", "coffee"].includes(dev.family.group))
      out.push(`<div class="warn">ⓘ ${esc(this._t("ed.w.mobile_start"))}</div>`);
    return out.join("");
  }

  // Switches the integration's start/stop/pause buttons on. Only from this button, which the user presses.
  async _enable(dev, button) {
    button.disabled = true;
    try {
      for (const entity_id of Object.values(disabledControls(this._registry, dev.id)))
        await this._hass.callWS({ type: "config/entity_registry/update", entity_id, disabled_by: null });
      button.replaceWith(Object.assign(document.createElement("span"), { textContent: this._t("ed.w.enabled") }));
      await this._loadRegistry();
    } catch (e) {
      button.disabled = false;
      button.insertAdjacentText("afterend", ` ${e?.message ?? e}`);
    }
  }

  // "Kopieer als losse kaarten": the layout as plain cards, one section each, as YAML.
  async _export() {
    const r = this.shadowRoot, devices = scanDevices(this._hass);
    const everyone = Object.fromEntries(devices.map(d => [d.id, "running"]));   // the active presets would leave out what's off now
    const plan = planLayout(devices, this._config, everyone, { areas: this._hass.areas, hass: this._hass });
    const yaml = toYaml({ type: "sections", sections: exportCards(plan) });
    const box = r.getElementById("yaml");
    box.value = yaml;
    r.getElementById("out").hidden = false;
    let ok = false;
    try { await navigator.clipboard.writeText(yaml); ok = true; }
    catch { box.select(); try { ok = document.execCommand("copy"); } catch { /* copy by hand */ } }
    r.getElementById("copied").textContent = this._t(ok ? "ed.copied" : "ed.copy_by_hand");
  }
}

