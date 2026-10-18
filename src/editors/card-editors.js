// Visual editors for miele-appliance-card and miele-programmes-card, on Home Assistant's ha-form.
import { FormEditor, selectors, programmeOptions } from "./form.js";

export class MieleApplianceCardEditor extends FormEditor {
  get defaults() { return { theme: "dark", animations: "full", controls: true, big_countdown: false }; }

  schema(dev) {
    const s = selectors(this._lang);
    return [
      { name: "entity", required: true, selector: s.entity },
      { name: "name", selector: s.text },
      { type: "grid", name: "", schema: [
        { name: "finish", selector: s.finish },
        { name: "drawing", selector: s.drawing },
      ] },
      { type: "grid", name: "", schema: [
        { name: "theme", selector: s.theme },
        { name: "animations", selector: s.animations },
      ] },
      { type: "grid", name: "", schema: [
        { name: "controls", selector: s.boolean },
        { name: "big_countdown", selector: s.boolean },
      ] },
      { type: "expandable", name: "", title: this._t("ed.more"), schema: [
        { type: "grid", name: "", schema: [
          { name: "accent", selector: s.text },
          { name: "language", selector: s.language },
        ] },
        { type: "grid", name: "", schema: [
          { name: "max_width", selector: s.text },
          { name: "images", selector: s.text },
        ] },
      ] },
    ];
  }
}

export class MieleProgrammesCardEditor extends FormEditor {
  get defaults() { return { theme: "dark", show_all: true, collapsed: false, show_name: false }; }

  schema(dev) {
    const s = selectors(this._lang);
    return [
      { name: "entity", required: true, selector: s.entity },
      { name: "programs", selector: { select: { multiple: true, mode: "list", options: programmeOptions(this._hass, dev, this._lang) } } },
      { type: "grid", name: "", schema: [
        { name: "show_all", selector: s.boolean },
        { name: "collapsed", selector: s.boolean },
      ] },
      { type: "grid", name: "", schema: [
        { name: "theme", selector: s.theme },
        { name: "language", selector: s.language },
      ] },
      { type: "grid", name: "", schema: [
        { name: "name", selector: s.text },
        { name: "accent", selector: s.text },
      ] },
    ];
  }
}
