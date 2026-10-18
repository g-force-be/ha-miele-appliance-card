// A small stand-in for the frontend's `hass` object, built from Peter's registry snapshot (dev/data).
// Enough for the model, the cards and their editors: states, entities, devices, areas, locale, translations,
// and callService / callWS that log instead of doing anything.

export function createMockHass({ registry, translations, states, language = "nl", darkMode = false, isAdmin = true, log = () => {} }) {
  const tr = translations[language]?.resources ?? {};
  const entities = Object.fromEntries(registry.entities.map(e => [e.entity_id, { ...e }]));

  const localize = (key, ...args) => {
    let s = tr[key];
    if (s == null) return "";
    const vals = args.length === 1 && typeof args[0] === "object" ? args[0] : Object.fromEntries(args.reduce((a, v, i) => (i % 2 ? a[a.length - 1].push(v) : a.push([v]), a), []));
    return s.replace(/\{(\w+)\}/g, (m, k) => vals[k] ?? m);
  };
  const timeFmt = new Intl.DateTimeFormat(language === "nl" ? "nl-BE" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Brussels" });

  const formatEntityState = (so, state = so?.state) => {
    if (!so) return "";
    if (state === "unknown") return language === "nl" ? "Onbekend" : "Unknown";
    if (state === "unavailable") return language === "nl" ? "Niet beschikbaar" : "Unavailable";
    const eid = so.entity_id, domain = eid.split(".")[0], e = entities[eid], a = so.attributes ?? {};
    if (e?.translation_key) {
      const t = localize(`component.${e.platform}.entity.${domain}.${e.translation_key}.state.${state}`);
      if (t) return t;
    }
    if (domain === "binary_sensor" || domain === "switch" || domain === "light") return state === "on" ? (language === "nl" ? "Aan" : "On") : (language === "nl" ? "Uit" : "Off");
    if (a.device_class === "timestamp") return timeFmt.format(new Date(state));
    if (a.unit_of_measurement && !isNaN(Number(state))) return `${Number(state).toLocaleString(language)} ${a.unit_of_measurement}`;
    return state;
  };

  // Coffee machine's real answer to miele.get_programs (first entries), washer's real error while off.
  const PROGRAMS = {
    "1f0fc39845233a82f0628ef7fb858053": [
      { program_id: 24001, program: "Ristretto", parameters: {} }, { program_id: 24002, program: "espresso", parameters: {} },
      { program_id: 24003, program: "coffee", parameters: {} }, { program_id: 24004, program: "Long coffee", parameters: {} },
      { program_id: 24005, program: "cappuccino", parameters: {} }, { program_id: 24020, program: "Hot milk", parameters: {} },
      { program_id: 24030, program: "", parameters: {} }, { program_id: 24031, program: "", parameters: {} }],
    "31c740bf126234441a0fd0e0f35dabfc": [],
  };

  return {
    states, entities, devices: registry.devices, areas: registry.areas,
    language, selectedLanguage: language,
    locale: { language, number_format: "language", time_format: "24", date_format: "language", time_zone: "server", first_weekday: "language" },
    config: { version: "2026.10.2", time_zone: "Europe/Brussels", unit_system: { temperature: "°C" }, components: ["miele"] },
    themes: { darkMode, themes: {}, default_theme: "default" }, selectedTheme: null,
    user: { id: "mock-user", name: "Peter", is_admin: isAdmin, is_owner: isAdmin },
    connected: true,
    localize, formatEntityState,
    formatEntityAttributeValue: (so, attr) => String(so?.attributes?.[attr] ?? ""),
    formatEntityAttributeName: (so, attr) => attr,
    loadBackendTranslation: async () => localize,
    callService: async (domain, service, data, target, notifyOnError = true, returnResponse = false) => {
      log("callService", { domain, service, data, target, returnResponse });
      if (domain === "miele" && service === "get_programs") {
        const list = PROGRAMS[data?.device_id];
        if (!list) throw Object.assign(new Error("'Get programs' action failed: 400 / Bad Request"),
          { code: "home_assistant_error", translation_domain: "miele", translation_key: "get_programs_error", translation_placeholders: { status: "400", message: "Bad Request" } });
        return { context: { id: "mock" }, response: { programs: list } };
      }
      return { context: { id: "mock" } };
    },
    callWS: async msg => {
      log("callWS", msg);
      if (msg.type === "config/entity_registry/list")
        return [...registry.entities.map(e => ({ ...e, disabled_by: null })), ...registry.disabled];
      return null;
    },
    callApi: async (method, path) => { log("callApi", { method, path }); return []; },
  };
}
