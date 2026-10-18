// A small stand-in for the frontend's `hass` object, built from Peter's registry snapshot (dev/data).
// Enough for the model, the cards and their editors: states, entities, devices, areas, locale, translations,
// and callService / callWS that log instead of doing anything.

export function createMockHass({ registry, translations, states, programs = {}, failStart = false, language = "nl", darkMode = false, isAdmin = true, log = () => {} }) {
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

  // miele.get_programs answers as in Peter's HA (dev/data/programs.json): washer and dryer give 400 / Bad Request
  // until their "Start op afstand" entity is on.
  const mobileStartOn = id => registry.entities.some(e => e.device_id === id && e.translation_key === "mobile_start" && states[e.entity_id]?.state === "on");
  const ACTION = { get_programs_error: "Get programs", set_program_error: "Set program", set_program_oven_error: "Set program on oven" };
  const fail = (key, status, message) => Object.assign(new Error(`'${ACTION[key]}' action failed: ${status} / ${message}`),
    { code: "home_assistant_error", translation_domain: "miele", translation_key: key, translation_placeholders: { status: String(status), message } });
  const LAUNDRY = new Set(["82ddfc7a46859e3c356f96713e446d32", "16dcdde6211a28156e33bc53c65c55e4"]);

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
        const list = programs[data?.device_id];
        if (!list || (LAUNDRY.has(data.device_id) && !mobileStartOn(data.device_id))) throw fail("get_programs_error", 400, "Bad Request");
        return { context: { id: "mock" }, response: { programs: list } };
      }
      if (domain === "miele" && service.startsWith("set_program") && failStart)
        throw fail(`${service}_error`, 400, "Bad Request");
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
