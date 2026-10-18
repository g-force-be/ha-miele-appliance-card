// The cards' own words. Miele's programmes, phases and statuses come from Home Assistant's translations instead.
// Terms follow miele.be and HA-NL ("Bediening op afstand", "Start op afstand", "Slim starten").

const nl = {
  state: { off: "Uit", offline: "Niet verbonden", standby: "Aan", ready: "Klaar om te starten", scheduled: "Gepland", running: "Bezig",
    paused: "Gepauzeerd", done: "Klaar", interrupted: "Onderbroken", error: "Storing" },
  lcd: { ready: "Klaar", starts: "Start om", smart_grid: "Slim starten", end: "Einde", interrupted: "Onderbroken", error: "Storing",
    almost_done: "Bijna klaar", heating: "Opwarmen", at_temp: "Op temperatuur", paused: "Pauze", rinsing: "Spoelen", offline: "Geen verbinding", drinks: "Dranken" },
  row: { program: "Programma", temp: "Temperatuur", spin: "Centrifuge", dryness: "Droogtegraad", ends: "Klaar om", ended: "Klaar om",
    duration: "Duur", starts: "Start om", elapsed: "Verstreken", core: "Kerntemperatuur" },
  pill: { almost_done: "Bijna klaar", smart_grid: "Wacht op slim starten", lost: "Geen verbinding", door_open: "Deur open", drawer_open: "Lade open" },
  btn: { pause: "Pauzeren", resume: "Hervatten", start: "Starten", stop: "Stoppen", off: "Uitzetten", on: "Aanzetten", cancel: "Annuleren" },
  ask: {
    stop: "{name} stoppen? Het programma wordt afgebroken.",
    off: "{name} uitzetten?", off_running: "{name} uitzetten? Het programma stopt.",
    start: "{program} starten op de {name}?",
  },
  icon: { remote: "Bediening op afstand", mobile: "Start op afstand", door_open: "Deur open", door_closed: "Deur dicht",
    door_locked: "Deur vergrendeld", lost: "Geen verbinding, laatste toestand", light: "Licht aan/uit" },
  err: { send: "Niet verstuurd: {msg}", no_device: "Geen Miele-toestel gevonden. Kies een toestel in de kaartinstellingen." },
  prog: {
    title: "Programma's", all: "Alle programma's ({n})", fewer: "Minder programma's", remote_on: "Start op afstand aan", remote_off: "Start op afstand uit",
    temp: "Temperatuur", time: "Tijd", none: "Geen", until_stop: "tot je stopt", start: "Starten", ask: "{what} starten op de {name}?",
    prepare: "Klaarzetten", ask_prepare: "{what} klaarzetten op de {name}? Starten doe je daarna op het toestel.",
    started: "{program} gestart.", prepared: "{program} staat klaar. Druk op Start op de {name}.", cached: "Lijst van {when}, bewaard in deze browser.",
    why: {
      mobile_start: "Zet Start op afstand aan op de {name} om hier een programma te starten.",
      prepare: "Start op afstand staat uit. Je kunt een programma klaarzetten en het daarna op het toestel starten.",
      waiting: "{program} staat klaar op de {name}. Druk op Start op het toestel, of zet Start op afstand aan om hier te starten.",
      busy: "Er loopt al een programma. Starten kan weer als het klaar is.",
      offline: "De {name} is niet verbonden.",
      no_programs: "Miele biedt voor de {name} geen programma's aan om op afstand te starten.",
      no_remote: "Deze {name} kan niet op afstand starten.",
      no_list: "De programmalijst is nog niet binnen.",
    },
  },
  ed: {
    found: "Herkend: {model} ({kind}), tekening {drawing}.", more: "Meer instellingen", appliances: "Toestellen",
    suggest: "Stel layout voor", export: "Kopieer als losse kaarten",
    copied: "Gekopieerd. Plak het in de YAML-editor van een nieuwe view.", copy_by_hand: "Selecteer de tekst hierboven en kopieer hem.",
    layout: { rooms: "Per ruimte", grid: "Raster", active: "Alleen actieve", phone: "Telefoon", display: "Keukenscherm (alleen kijken)" },
    f: { entity: "Toestel", name: "Naam", finish: "Frontkleur", drawing: "Tekening", theme: "Thema", animations: "Animaties",
      controls: "Bediening tonen", big_countdown: "Grote aftelling", accent: "Accentkleur", language: "Taal",
      max_width: "Maximale breedte tekening", images: "Map met eigen tekeningen", programs: "Favorieten",
      show_all: "Ook alle andere programma's", collapsed: "Ingeklapt", layout: "Layout", programmes: "Programmakaart" },
    h: { entity: "Elke entiteit van het toestel werkt.", accent: "Bijvoorbeeld #4fa3e0", max_width: "Bijvoorbeeld 380px",
      images: "Bijvoorbeeld /local/miele/ met washer.svg, dryer.svg, …", programs: "Leeg: een voorstel per type toestel." },
    finish: { lotus_white: "Lotuswit", brilliant_white: "Briljantwit", pearl_beige: "Parelbeige", clean_steel: "CleanSteel",
      graphite_grey: "Grafietgrijs", obsidian_black: "Obsidiaanzwart" },
    drawing: { washer: "wasmachine (W1)", dryer: "droogkast (T1)", steam_oven: "stoomoven (ArtLine)", microwave: "oven met microgolf (ArtLine)",
      coffee: "koffiemachine (CM 7750)", drawer: "warmhoudlade", generic: "algemeen" },
    theme: { dark: "Donker", light: "Licht", auto: "Volgt Home Assistant", ha: "Kleuren van Home Assistant" },
    anim: { full: "Volledig", reduced: "Beperkt", off: "Uit" },
    w: { buttons: "De start-, pauze- en stopknop staan uit in Home Assistant.", enable: "Inschakelen",
      enabled: "Ingeschakeld. Home Assistant laadt de Miele-integratie zo opnieuw.", offline: "Niet verbonden.",
      mobile_start: "Start op afstand staat nu uit." },
  },
  ov: { all_off: "Alle toestellen staan uit" },
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
    almost_done: "Almost done", heating: "Heating up", at_temp: "At temperature", paused: "Paused", rinsing: "Rinsing", offline: "No connection", drinks: "Drinks" },
  row: { program: "Programme", temp: "Temperature", spin: "Spin", dryness: "Dryness", ends: "Ends at", ended: "Ended at",
    duration: "Duration", starts: "Starts at", elapsed: "Elapsed", core: "Core temperature" },
  pill: { almost_done: "Almost done", smart_grid: "Waiting for smart start", lost: "No connection", door_open: "Door open", drawer_open: "Drawer open" },
  btn: { pause: "Pause", resume: "Resume", start: "Start", stop: "Stop", off: "Switch off", on: "Switch on", cancel: "Cancel" },
  ask: {
    stop: "Stop the {name}? This cancels the programme.",
    off: "Switch the {name} off?", off_running: "Switch the {name} off? The programme stops.",
    start: "Start {program} on the {name}?",
  },
  icon: { remote: "Remote control", mobile: "Remote start", door_open: "Door open", door_closed: "Door closed",
    door_locked: "Door locked", lost: "No connection, last known state", light: "Light on/off" },
  err: { send: "Not sent: {msg}", no_device: "No Miele appliance found. Pick one in the card settings." },
  prog: {
    title: "Programmes", all: "All programmes ({n})", fewer: "Fewer programmes", remote_on: "Remote start on", remote_off: "Remote start off",
    temp: "Temperature", time: "Time", none: "None", until_stop: "until you stop it", start: "Start", ask: "Start {what} on the {name}?",
    prepare: "Set up", ask_prepare: "Set up {what} on the {name}? You then start it on the appliance.",
    started: "{program} started.", prepared: "{program} is set. Press Start on the {name}.", cached: "List from {when}, kept in this browser.",
    why: {
      mobile_start: "Turn on Remote start on the {name} to start a programme here.",
      prepare: "Remote start is off. You can set up a programme and start it on the appliance.",
      waiting: "{program} is set on the {name}. Press Start on the appliance, or turn on Remote start to start it here.",
      busy: "A programme is running. You can start again once it's finished.",
      offline: "The {name} isn't connected.",
      no_programs: "Miele offers no programmes to start remotely on the {name}.",
      no_remote: "This {name} can't be started remotely.",
      no_list: "The programme list hasn't arrived yet.",
    },
  },
  ed: {
    found: "Found: {model} ({kind}), drawing {drawing}.", more: "More settings", appliances: "Appliances",
    suggest: "Suggest a layout", export: "Copy as separate cards",
    copied: "Copied. Paste it into the YAML editor of a new view.", copy_by_hand: "Select the text above and copy it.",
    layout: { rooms: "Per room", grid: "Grid", active: "Active only", phone: "Phone", display: "Kitchen display (view only)" },
    f: { entity: "Appliance", name: "Name", finish: "Front colour", drawing: "Drawing", theme: "Theme", animations: "Animations",
      controls: "Show controls", big_countdown: "Large countdown", accent: "Accent colour", language: "Language",
      max_width: "Maximum drawing width", images: "Folder with your own drawings", programs: "Favourites",
      show_all: "Also all other programmes", collapsed: "Folded", layout: "Layout", programmes: "Programmes card" },
    h: { entity: "Any entity of the appliance works.", accent: "For example #4fa3e0", max_width: "For example 380px",
      images: "For example /local/miele/ with washer.svg, dryer.svg, …", programs: "Empty: a suggestion per appliance type." },
    finish: { lotus_white: "Lotus white", brilliant_white: "Brilliant white", pearl_beige: "Pearl beige", clean_steel: "CleanSteel",
      graphite_grey: "Graphite grey", obsidian_black: "Obsidian black" },
    drawing: { washer: "washing machine (W1)", dryer: "tumble dryer (T1)", steam_oven: "steam oven (ArtLine)", microwave: "oven with microwave (ArtLine)",
      coffee: "coffee machine (CM 7750)", drawer: "warming drawer", generic: "generic" },
    theme: { dark: "Dark", light: "Light", auto: "Follows Home Assistant", ha: "Home Assistant's colours" },
    anim: { full: "Full", reduced: "Reduced", off: "Off" },
    w: { buttons: "The start, pause and stop buttons are switched off in Home Assistant.", enable: "Switch on",
      enabled: "Switched on. Home Assistant reloads the Miele integration shortly.", offline: "Not connected.",
      mobile_start: "Remote start is off right now." },
  },
  ov: { all_off: "All appliances are off" },
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

// Dutch for Miele values that Home Assistant 2026.10 still shows in English: [English as HA shows it, Dutch].
// Used only while HA returns exactly that English text, so a real HA translation always wins.
// Brand and international names (QuickPowerWash, Cappuccino, ECO 40-60, …) need no entry.
const NL_FALLBACK = {
  status: {
    autocleaning: ["Automatic cleaning", "Automatisch spoelen"], reserved: ["Reserved", "Gereserveerd"],
    supercooling: ["Supercooling", "SuperKoelen"], superfreezing: ["Superfreezing", "SuperVriezen"],
    supercooling_superfreezing: ["Supercooling/superfreezing", "SuperKoelen/SuperVriezen"], superheating: ["Superheating", "Snel opwarmen"],
  },
  phase: {
    "2nd_espresso": ["2nd espresso coffee", "2e espresso"], "2nd_grinding": ["2nd grinding", "2e keer malen"],
    "2nd_pre_brewing": ["2nd pre-brewing", "2e voorbrouwen"], comfort_cooling: ["Comfort cooling", "Comfortkoeling"],
    cooling_phase: ["Cooling phase", "Afkoelen"], dispensing: ["Dispensing", "Uitschenken"], dust_box_missing: ["Missing dust box", "Stofbox ontbreekt"],
    energy_save: ["Energy save", "Energiebesparing"], espresso: ["Espresso coffee", "Espresso"], final_rinse: ["Final rinse", "Laatste spoeling"],
    flex_load_active: ["FlexLoad active", "FlexLoad actief"], freshen_up_and_moisten: ["Freshen up & moisten", "Opfrissen en bevochtigen"],
    going_to_target_area: ["Going to target area", "Onderweg naar doelzone"], grinding: ["Grinding", "Malen"], hand_iron: ["Hand iron", "Strijkdroog"],
    hygiene_drying: ["Hygiene drying", "Hygiënisch drogen"], interim_rinse: ["Interim rinse", "Tussenspoeling"], keep_warm: ["Keep warm", "Warmhouden"],
    keeping_warm: ["Keeping warm", "Warmhouden"], milk_foam: ["Milk foam", "Melkschuim"], moisten: ["Moisten", "Bevochtigen"],
    motor_overload: ["Check dust box and filter", "Controleer stofbox en filter"], perfect_dry_active: ["PerfectDry active", "PerfectDry actief"],
    pre_brewing: ["Pre-brewing", "Voorbrouwen"], pre_dishwash: ["Pre-cleaning", "Voorreinigen"], process_finished: ["Process finished", "Klaar"],
    process_running: ["Process running", "Bezig"], program_running: ["Program running", "Programma loopt"], reactivating: ["Reactivating", "Opnieuw starten"],
    remote_controlled: ["Remote controlled", "Op afstand bediend"], rinse_out_lint: ["Rinse out lint", "Pluizen uitspoelen"], rinses: ["Rinses", "Spoelen"],
    roasting: ["Roasting", "Braden"], safety_cooling: ["Safety cooling", "Veiligheidskoeling"], searing: ["Searing", "Aanbraden"],
    slightly_dry: ["Slightly dry", "Licht droog"], slow_roasting: ["Slow roasting", "Lagetemperatuurgaren"], soak: ["Soak", "Inweken"],
    starch_stop: ["Starch stop", "Stijfselstop"], steam_reduction: ["Steam reduction", "Stoomreductie"], steam_smoothing: ["Steam smoothing", "Stoomgladmaken"],
    thermo_spin: ["Thermo spin", "ThermoSpin"], timed_drying: ["Timed drying", "Drogen op tijd"], venting: ["Venting", "Ontluchten"],
    waiting_for_start: ["Waiting for start", "Wacht op start"], warm_cups_glasses: ["Warm cups/glasses", "Kopjes en glazen voorverwarmen"],
    warm_dishes_plates: ["Warm dishes/plates", "Borden voorverwarmen"], wheel_lifted: ["Wheel lifted", "Wiel opgetild"],
  },
  program: {
    clean_machine: ["Clean machine", "Machine reinigen"], easy_care: ["Easy care", "Onderhoudsarm"], freshen_up: ["Freshen up", "Opfrissen"],
    outdoor_garments: ["Outdoor garments", "Outdoorkleding"], rinse_out_lint: ["Rinse out lint", "Pluizen uitspoelen"],
    separate_rinse_starch: ["Separate rinse/starch", "Apart spoelen/stijven"], steam_care: ["Steam care", "Stoomverzorging"],
    stuffed_toys: ["Stuffed toys", "Knuffels"], towels: ["Towels", "Handdoeken"], trainers_refresh: ["Trainers refresh", "Sportschoenen opfrissen"],
    downs_duvets: ["Downs/Duvets", "Dons/dekbedden"], pillows_sanitize: ["Pillows sanitize", "Kussens hygiëne"], steam_smoothing: ["Steam smoothing", "Stoomgladmaken"],
    fan_plus: ["Fan plus", "Hetelucht plus"], conventional_heat: ["Conventional heat", "Boven- en onderwarmte"], intensive_bake: ["Intensive bake", "Intensief bakken"],
    fan_grill: ["Fan grill", "Grill met circulatie"], eco_fan_heat: ["ECO fan heat", "ECO hetelucht"], top_heat: ["Top heat", "Bovenwarmte"],
    eco_steam_cooking: ["ECO steam cooking", "ECO stoomgaren"],
    steam_cooking: ["Steam cooking", "Stoomgaren"], rapid_steam_cooking: ["Rapid steam cooking", "Snel stoomgaren"],
    reheating_with_steam: ["Reheating with steam", "Opwarmen met stoom"], moisture_plus_fan_plus: ["Moisture plus + Fan plus", "Klimaatgaren + hetelucht plus"],
    keeping_warm: ["Keeping warm", "Warmhouden"], descale: ["Descale", "Ontkalken"], microwave_fan_plus: ["Microwave + Fan plus", "Microgolf + hetelucht plus"],
    microwave_fan_grill: ["Microwave + Fan grill", "Microgolf + grill met circulatie"], microwave_auto_roast: ["Microwave + Auto roast", "Microgolf + automatisch braden"],
    reheating_with_microwave: ["Reheating with microwave", "Opwarmen met microgolf"], auto_roast: ["Auto roast", "Automatisch braden"],
    low_temperature_cooking: ["Low temperature cooking", "Lagetemperatuurgaren"], appliance_settings: ["Appliance settings menu", "Instellingen"],
    brewing_unit_degrease: ["Brewing unit degrease", "Zetgroep ontvetten"], coffee_pot: ["Coffee pot", "Koffiepot"], descaling: ["Appliance descaling", "Ontkalken"],
    fruit_tea: ["Fruit tea", "Vruchtenthee"], herbal_tea: ["Herbal tea", "Kruidenthee"], intermediate_rinsing: ["Intermediate rinsing", "Tussentijds spoelen"],
    long_coffee: ["Long coffee", "Lange koffie"], very_hot_water: ["Very hot water", "Zeer heet water"], white_tea: ["White tea", "Witte thee"],
    evaporate_water: ["Evaporate water", "Water verdampen"],
    // no translation at all in HA yet (warming drawer and two microwave programmes)
    quick_microwave: ["", "Snel microgolf"], microwave_grill: ["", "Microgolf + grill"], keep_warm: ["", "Warmhouden"],
    slow_roasting: ["", "Lagetemperatuurgaren"], warm_cups_glasses: ["", "Kopjes en glazen voorverwarmen"], warm_dishes_plates: ["", "Borden voorverwarmen"],
  },
};

// Miele's own enum values, in the user's language, from Home Assistant's translations.
export function mieleLabel(hass, kind, key, lang) {
  if (key == null) return "";
  const tk = { program: "program_id", phase: "program_phase", dryness: "drying_step", status: "status" }[kind];
  const s = hass?.localize?.(`component.miele.entity.sensor.${tk}.state.${key}`);
  const nl = lang === "nl" ? NL_FALLBACK[kind]?.[key] : null;
  if (nl && (!s || s === nl[0])) return nl[1];
  return s || String(key).replace(/_/g, " ").replace(/^./, c => c.toUpperCase());
}
