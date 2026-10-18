// What the card editors share: Home Assistant's own ha-form (with its selectors), loaded on demand, a config that
// keeps only what differs from the defaults, and the config-changed event the dashboard editor listens to.
import { describeDevice, scanDevices } from "../miele-model.js";
import { mieleLabel, t } from "../i18n/index.js";
import { FINISHES } from "../drawings/finish.js";
import { DRAWINGS, designOf } from "../drawings/index.js";
import { readCache, readPrograms } from "../programs.js";

// ha-form is only defined once some editor has needed it; the entities card's editor pulls it in.
export async function loadHaForm() {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await window.loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await card?.constructor?.getConfigElement?.();
  } catch { /* it may still come */ }
  await Promise.race([customElements.whenDefined("ha-form"), new Promise(r => setTimeout(r, 4000))]);
}

export const fireConfig = (el, config) =>
  el.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));

// Leaves out empty values and those equal to the default, so the YAML stays short.
export function clean(config, defaults = {}) {
  return Object.fromEntries(Object.entries(config).filter(([k, v]) =>
    v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && !v.length) && !(k in defaults && defaults[k] === v)));
}

// The status entity of the appliance a config points at (entity, or device_id from older configs).
export function applianceOf(hass, config) {
  const id = config.device_id || hass?.entities?.[config.entity]?.device_id;
  if (id) return describeDevice(hass, id);
  return scanDevices(hass ?? {})[0] ?? null;
}

const opt = (value, label) => ({ value, label });
export const selectors = lang => ({
  entity: { entity: { filter: { integration: "miele", domain: "sensor" } } },
  finish: { select: { mode: "dropdown", custom_value: true, options: Object.keys(FINISHES).map(f => opt(f, t(lang, `ed.finish.${f}`))) } },
  drawing: { select: { mode: "dropdown", options: Object.keys(DRAWINGS).map(d => opt(d, t(lang, `ed.drawing.${d}`))) } },
  theme: { select: { mode: "dropdown", options: ["dark", "light", "auto", "ha"].map(v => opt(v, t(lang, `ed.theme.${v}`))) } },
  animations: { select: { mode: "dropdown", options: ["full", "reduced", "off"].map(v => opt(v, t(lang, `ed.anim.${v}`))) } },
  language: { select: { mode: "dropdown", options: [opt("nl", "Nederlands"), opt("en", "English")] } },
  text: { text: {} },
  design: drawing => ({ select: { mode: "dropdown", options: (DRAWINGS[drawing]?.designs ?? []).map(v => opt(v, t(lang, `ed.design.${v}`))) } }),
  boolean: { boolean: {} },
});

// Programmes to choose favourites from: what the appliance offers (the list the programmes card kept in this
// browser), else every programme Home Assistant knows for that type. Labels in the user's language.
export function programmeOptions(hass, dev, lang) {
  if (!dev) return [];
  const options = hass.states?.[dev.roles.program]?.attributes?.options ?? [];
  let cached = null;
  try { cached = readCache(globalThis.localStorage, dev.id); } catch { /* no storage */ }
  const items = cached
    ? readPrograms(cached, options).map(p => opt(p.key ?? String(p.id), p.key ? mieleLabel(hass, "program", p.key, lang) : p.name))
    : options.filter(k => k !== "no_program").map(k => opt(k, mieleLabel(hass, "program", k, lang)));
  return items.sort((a, b) => a.label.localeCompare(b.label, lang));
}

const CSS = `
:host { display: block; }
.info { margin: 0 0 12px; padding: 10px 12px; border-radius: 10px; font-size: 13px; line-height: 1.4;
  background: var(--secondary-background-color, #f2f2f2); color: var(--secondary-text-color, #555); }
.info b { color: var(--primary-text-color, #222); font-weight: 600; }
.info:empty { display: none; }
`;

// An editor that is one ha-form plus an info line. Subclasses give schema(), defaults and info().
export class FormEditor extends HTMLElement {
  setConfig(config) { this._config = { ...config }; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _t(key, vars) { return t(this._lang, key, vars); }
  get _lang() { return String(this._config?.language || this._hass?.locale?.language || this._hass?.language || "en").slice(0, 2) === "nl" ? "nl" : "en"; }

  async connectedCallback() {
    await loadHaForm();
    this._ready = true;
    this._render();
  }

  _render() {
    if (!this._ready || !this._config || !this._hass) return;
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    if (!this._form) {
      r.innerHTML = `<style>${CSS}</style><div class="info" id="info"></div>`;
      this._form = document.createElement("ha-form");
      this._form.computeLabel = s => t(this._lang, `ed.f.${s.name}`);
      this._form.computeHelper = s => { const h = t(this._lang, `ed.h.${s.name}`); return h === `ed.h.${s.name}` ? undefined : h; };
      this._form.addEventListener("value-changed", e => {
        e.stopPropagation();
        const next = { ...this._config, ...e.detail.value };
        if (next.entity) delete next.device_id;
        this._config = clean(next, this.defaults);
        fireConfig(this, this._config);
      });
      r.append(this._form);
    }
    const dev = applianceOf(this._hass, this._config);
    this._form.hass = this._hass;
    this._form.schema = this.schema(dev);
    this._form.data = { ...this.defaults, entity: dev?.roles.status, ...this._config };
    r.getElementById("info").innerHTML = this.info(dev);
  }

  info(dev) {
    if (!dev) return t(this._lang, "err.no_device");
    const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    return t(this._lang, "ed.found", { model: `<b>${esc(dev.modelId ?? dev.model ?? "?")}</b>`, kind: esc(t(this._lang, `kind.${dev.family.kind}`)),
      drawing: `<b>${esc(t(this._lang, `ed.drawing.${this._config.drawing || dev.family.drawing}`))}${this._designHint(dev)}</b>` });
  }

  // the design line the card uses, when the drawing has lines ("ArtLine (grepeloos)")
  _designHint(dev) {
    const drawing = this._config.drawing || dev.family.drawing;
    const d = designOf(drawing, this._config.design, this._hass.devices?.[dev.id]?.model_id ?? dev.modelId);
    return d ? `, ${t(this._lang, `ed.design.${d}`)}` : "";
  }
}
