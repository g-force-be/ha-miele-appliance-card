// The cards' own words. Miele's programmes, phases and statuses come from Home Assistant's translations instead.
// Terms follow miele.be and HA-NL ("Bediening op afstand", "Start op afstand", "Slim starten").

const nl = {
  state: { off: "Uit", offline: "Niet verbonden", standby: "Aan", ready: "Klaar om te starten", scheduled: "Gepland", running: "Bezig",
    paused: "Gepauzeerd", done: "Klaar", interrupted: "Onderbroken", error: "Storing" },
  lcd: { ready: "Klaar", starts: "Start om", smart_grid: "Slim starten", end: "Einde", interrupted: "Onderbroken", error: "Storing",
    almost_done: "Bijna klaar", heating: "Opwarmen", at_temp: "Op temperatuur", paused: "Pauze", rinsing: "Spoelen", offline: "Geen verbinding" },
  row: { program: "Programma", temp: "Temperatuur", spin: "Centrifuge", dryness: "Droogtegraad", ends: "Klaar om", ended: "Klaar om",
    duration: "Duur", starts: "Start om", elapsed: "Verstreken", core: "Kerntemperatuur" },
  pill: { almost_done: "Bijna klaar", smart_grid: "Wacht op slim starten", lost: "Geen verbinding" },
  btn: { pause: "Pauzeren", resume: "Hervatten", start: "Starten", stop: "Stoppen", off: "Uitzetten", on: "Aanzetten", cancel: "Annuleren" },
  ask: {
    stop: "{name} stoppen? Het programma wordt afgebroken.",
    off: "{name} uitzetten?", off_running: "{name} uitzetten? Het programma stopt.",
    start: "{program} starten op de {name}?",
  },
  icon: { remote: "Bediening op afstand", mobile: "Start op afstand", door_open: "Deur open", door_closed: "Deur dicht",
    door_locked: "Deur vergrendeld", lost: "Geen verbinding, laatste toestand", light: "Licht aan/uit" },
  err: { send: "Niet verstuurd: {msg}", no_device: "Geen Miele-toestel gevonden. Kies een toestel in de kaartinstellingen." },
  unit: { rpm: "tpm", min: "min" },
  kind: { washer: "Wasmachine", dryer: "Droogkast", washer_dryer: "Was-droogcombinatie", dishwasher: "Vaatwasser", oven: "Oven",
    steam_oven: "Stoomoven", steam_oven_combi: "Stoomoven", steam_oven_micro: "Stoomoven met microgolf", dialog_oven: "Dialog-oven",
    oven_microwave: "Oven met microgolf", microwave: "Microgolfoven", coffee: "Koffiemachine", drawer: "Warmhoudlade", hob: "Kookplaat",
    hood: "Dampkap", fridge: "Koelkast", wine: "Wijnkast", vacuum: "Robotstofzuiger", other: "Miele-toestel" },
};

const en = {
  state: { off: "Off", offline: "Not connected", standby: "On", ready: "Ready to start", scheduled: "Scheduled", running: "Running",
    paused: "Paused", done: "Finished", interrupted: "Interrupted", error: "Fault" },
  lcd: { ready: "Ready", starts: "Starts at", smart_grid: "Smart start", end: "End", interrupted: "Interrupted", error: "Fault",
    almost_done: "Almost done", heating: "Heating up", at_temp: "At temperature", paused: "Paused", rinsing: "Rinsing", offline: "No connection" },
  row: { program: "Programme", temp: "Temperature", spin: "Spin", dryness: "Dryness", ends: "Ends at", ended: "Ended at",
    duration: "Duration", starts: "Starts at", elapsed: "Elapsed", core: "Core temperature" },
  pill: { almost_done: "Almost done", smart_grid: "Waiting for smart start", lost: "No connection" },
  btn: { pause: "Pause", resume: "Resume", start: "Start", stop: "Stop", off: "Switch off", on: "Switch on", cancel: "Cancel" },
  ask: {
    stop: "Stop the {name}? This cancels the programme.",
    off: "Switch the {name} off?", off_running: "Switch the {name} off? The programme stops.",
    start: "Start {program} on the {name}?",
  },
  icon: { remote: "Remote control", mobile: "Remote start", door_open: "Door open", door_closed: "Door closed",
    door_locked: "Door locked", lost: "No connection, last known state", light: "Light on/off" },
  err: { send: "Not sent: {msg}", no_device: "No Miele appliance found. Pick one in the card settings." },
  unit: { rpm: "rpm", min: "min" },
  kind: { washer: "Washing machine", dryer: "Tumble dryer", washer_dryer: "Washer dryer", dishwasher: "Dishwasher", oven: "Oven",
    steam_oven: "Steam oven", steam_oven_combi: "Steam oven", steam_oven_micro: "Steam oven with microwave", dialog_oven: "Dialog oven",
    oven_microwave: "Oven with microwave", microwave: "Microwave", coffee: "Coffee machine", drawer: "Warming drawer", hob: "Hob",
    hood: "Cooker hood", fridge: "Fridge", wine: "Wine cabinet", vacuum: "Robot vacuum", other: "Miele appliance" },
};

const STRINGS = { nl, en };

export const languageOf = (hass, config) => {
  const l = String(config?.language || hass?.locale?.language || hass?.language || "en").slice(0, 2).toLowerCase();
  return STRINGS[l] ? l : "en";
};

// t("nl", "ask.stop", { name: "wasmachine" })
export function t(lang, key, vars) {
  const s = key.split(".").reduce((o, k) => o?.[k], STRINGS[lang] ?? en) ?? key.split(".").reduce((o, k) => o?.[k], en) ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? "") : s;
}

// Miele's own enum values, in the user's language, from Home Assistant's translations.
export function mieleLabel(hass, kind, key) {
  if (key == null) return "";
  const tk = { program: "program_id", phase: "program_phase", dryness: "drying_step", status: "status" }[kind];
  const s = hass?.localize?.(`component.miele.entity.sensor.${tk}.state.${key}`);
  return s || String(key).replace(/_/g, " ").replace(/^./, c => c.toUpperCase());
}
