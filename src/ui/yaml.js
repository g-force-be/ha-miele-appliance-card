// Just enough YAML for "Kopieer als losse kaarten": objects, arrays, strings, numbers and booleans.
const plain = s => /^[A-Za-z_][\w.:\/-]*$/.test(s) && !/^(true|false|null|yes|no|on|off|~)$/i.test(s);
const scalar = v => typeof v === "string" ? (plain(v) ? v : JSON.stringify(v)) : String(v);

export function toYaml(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    if (value.every(v => v === null || typeof v !== "object")) return `[${value.map(scalar).join(", ")}]`;
    return value.map(v => {
      const body = toYaml(v, indent + 2);
      return `${pad}- ${typeof v === "object" ? body.trimStart() : body}`;
    }).join("\n");
  }
  if (value && typeof value === "object") {
    return Object.entries(value).filter(([, v]) => v !== undefined).map(([k, v]) => {
      if (v && typeof v === "object" && !(Array.isArray(v) && (!v.length || v.every(x => x === null || typeof x !== "object"))))
        return `${pad}${k}:\n${toYaml(v, indent + 2)}`;
      return `${pad}${k}: ${toYaml(v, indent + 2)}`;
    }).join("\n");
  }
  return scalar(value);
}
