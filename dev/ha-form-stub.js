// Stand-in for Home Assistant's <ha-form> in the harness: the same schema (grid, expandable, text, boolean,
// select single/multiple, entity) and the same value-changed event, drawn with plain inputs. Only for looking at
// the editors; in Home Assistant the real ha-form is used.
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const CSS = `
:host { display: block; font: 14px system-ui, sans-serif; color: var(--primary-text-color, #222); }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
.f { display: block; margin: 0 0 12px; }
.f > span { display: block; font-size: 12px; color: var(--secondary-text-color, #666); margin: 0 0 4px; }
.f small { display: block; font-size: 11.5px; color: var(--secondary-text-color, #888); margin-top: 3px; }
input[type=text], select { width: 100%; box-sizing: border-box; height: 40px; padding: 0 10px; border-radius: 6px;
  border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: inherit; font: inherit; }
.check { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; min-height: 40px; }
.list { display: flex; flex-direction: column; gap: 4px; max-height: 180px; overflow: auto; padding: 6px 8px;
  border: 1px solid var(--divider-color, #ccc); border-radius: 6px; }
.list label { display: flex; gap: 8px; align-items: center; font-size: 13px; }
.radios { display: flex; flex-wrap: wrap; gap: 6px 14px; }
.radios label { display: flex; gap: 6px; align-items: center; font-size: 13px; }
details { margin: 0 0 12px; border: 1px solid var(--divider-color, #ccc); border-radius: 8px; padding: 8px 10px 0; }
summary { cursor: pointer; margin: 0 0 8px; font-weight: 500; }
`;

customElements.define("ha-form", class extends HTMLElement {
  set hass(h) { this._hass = h; this._later(); }
  set data(d) { this._data = d ?? {}; this._later(); }
  get data() { return this._data; }
  set schema(s) { this._schema = s ?? []; this._later(); }
  _later() { if (this._q) return; this._q = true; queueMicrotask(() => { this._q = false; this._draw(); }); }

  _label(s) { return this.computeLabel?.(s) ?? s.name; }
  _set(name, value) {
    this._data = { ...this._data, [name]: value };
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: this._data }, bubbles: true, composed: true }));
  }

  _field(s) {
    const v = this._data?.[s.name], sel = s.selector ?? {}, help = this.computeHelper?.(s);
    const helpHtml = help ? `<small>${esc(help)}</small>` : "";
    if (s.type === "grid") return `<div class="grid">${s.schema.map(x => this._field(x)).join("")}</div>`;
    if (s.type === "expandable") return `<details><summary>${esc(s.title)}</summary>${s.schema.map(x => this._field(x)).join("")}</details>`;
    if (sel.boolean) return `<label class="check"><input type="checkbox" data-n="${s.name}" data-k="bool" ${v ? "checked" : ""}>${esc(this._label(s))}</label>`;
    if (sel.select?.multiple) {
      const on = new Set(v ?? []);
      return `<div class="f"><span>${esc(this._label(s))}</span><div class="list">${sel.select.options.map(o =>
        `<label><input type="checkbox" data-n="${s.name}" data-k="multi" value="${esc(o.value)}" ${on.has(o.value) ? "checked" : ""}>${esc(o.label)}</label>`).join("")}</div>${helpHtml}</div>`;
    }
    if (sel.select?.mode === "list") return `<div class="f"><span>${esc(this._label(s))}</span><div class="radios">${sel.select.options.map(o =>
      `<label><input type="radio" name="${s.name}" data-n="${s.name}" data-k="radio" value="${esc(o.value)}" ${o.value === v ? "checked" : ""}>${esc(o.label)}</label>`).join("")}</div></div>`;
    if (sel.select) return `<label class="f"><span>${esc(this._label(s))}</span><select data-n="${s.name}" data-k="select"><option value=""></option>${sel.select.options.map(o =>
      `<option value="${esc(o.value)}" ${o.value === v ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>${helpHtml}</label>`;
    if (sel.entity) {
      const f = sel.entity.filter ?? {};
      const ids = Object.values(this._hass?.entities ?? {}).filter(e => (!f.integration || e.platform === f.integration)
        && (!f.domain || e.entity_id.startsWith(f.domain + "."))).map(e => e.entity_id).sort();
      return `<label class="f"><span>${esc(this._label(s))}</span><select data-n="${s.name}" data-k="select">${ids.map(id =>
        `<option ${id === v ? "selected" : ""}>${esc(id)}</option>`).join("")}</select>${helpHtml}</label>`;
    }
    return `<label class="f"><span>${esc(this._label(s))}</span><input type="text" data-n="${s.name}" data-k="text" value="${esc(v)}">${helpHtml}</label>`;
  }

  _draw() {
    const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const open = [...r.querySelectorAll("details")].map(d => d.open);
    r.innerHTML = `<style>${CSS}</style>${(this._schema ?? []).map(s => this._field(s)).join("")}`;
    r.querySelectorAll("details").forEach((d, i) => { d.open = !!open[i]; });
    r.querySelectorAll("[data-n]").forEach(el => el.addEventListener("change", () => {
      const n = el.dataset.n, k = el.dataset.k;
      if (k === "bool") this._set(n, el.checked);
      else if (k === "multi") this._set(n, [...r.querySelectorAll(`[data-n="${n}"][data-k=multi]:checked`)].map(x => x.value));
      else this._set(n, el.value || undefined);
    }));
  }
});
