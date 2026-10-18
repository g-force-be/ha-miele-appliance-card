# Miele Appliance Card — bouwspec

Een nieuwe repo (`ha-miele-appliance-card`), gebaseerd op [spikey1965/ha-hon-appliance-card](https://github.com/spikey1965/ha-hon-appliance-card) (MIT, © 2026 My Media Build), met vermelding van die bron. Hij wordt omgebouwd voor de **core Miele-integratie** van Home Assistant.

Dit document is de onderzoeksbasis voor de bouw in Claude Code. Alles hieronder is gecontroleerd tegen Peters eigen HA-installatie (HA **2026.10.2**, Miele via Home Assistant Cloud, gegevens van 18-10-2026) en tegen de broncode van `homeassistant/components/miele` (main, commit `12e822e`). Waar iets een vermoeden is, staat er **[verifiëren]**.

---

## 0. Doel en scope

Visueel dezelfde ervaring als de hOn-kaart: een realistisch getekend toestel, voortgangsring, aftellend display, bewegende animatie, fase-label, infopaneel en bediening. Daarbij komen alle Miele-toesteltypes, niet alleen wasmachine en droogkast.

| Kaart | Doel |
|---|---|
| `custom:miele-appliance-card` | Eén toestel. Opgebouwd zoals `hon-appliance-card`. |
| `custom:miele-programmes-card` | Favoriete programma's plus een doorzoekbare lijst, met start na bevestiging. Opgebouwd zoals `hon-programmes-card`. |
| `custom:miele-overview-card` | **Nieuw.** Detecteert alle Miele-toestellen automatisch en stelt een layout voor. Container rond de twee kaarten hierboven. |

Elke kaart krijgt een visuele editor (`getConfigElement`) en een `getStubConfig(hass)` die automatisch een Miele-toestel invult.

### Peters toestellen

| Toestel (`device.model`) | Typenummer (`device.model_id` = Miele techType) | Materiaalnr. (alleen diagnostics) | Uitvoering | Ruimte | device_id |
|---|---|---|---|---|---|
| Washing machine | `WEI895` = **WEI 895 WPS 125 Gala Edition** (W1 ChromeEdition, 9 kg) | 12440580 | **lotuswit**, chromen deur, draaiknop met lotuswit/chromen ring, ComfortSensor-display (wit, 1 regel), schuin bedieningspaneel, TwinDos, CapDosing, trommelverlichting | Bijkeuken | `82ddfc7a46859e3c356f96713e446d32` |
| Tumble dryer | `TEF775WP` (T1 warmtepomp) | 11855440 | **lotuswit met chroom**, zelfde reeks als de wasmachine (bevestigd door Peter): chromen deur, draaiknop met chromen ring, zelfde paneel | Bijkeuken | `16dcdde6211a28156e33bc53c65c55e4` |
| Steam oven combi | `DGC7845X` = **DGC 7845 X** (ArtLine, grepeloos, Touch2Open, 45 cm, M Touch, gemotoriseerd kantelbaar bedieningspaneel) | 10916960 | obsidiaanzwart | Keuken | `b8ee6dfe5e0f82d19997caf1ab237969` |
| Oven microwave | `H7440BMX` = **H 7440 BMX** (compacte combi-microgolfoven, grepeloos, 45 cm) | 11099850 | obsidiaanzwart (mat) | Keuken | `eeef45e3b771421c2439c81f17581b33` |
| Coffee system | `CM7750` = **CM 7750 CoffeeSelect** (**vrijstaand aanrechtmodel**, géén inbouw) | 10947370 | obsidiaanzwart; centrale in hoogte verstelbare uitloop met kopverlichting, 3 bonenreservoirs bovenaan, inox lekbak, kopjeswarmer bovenop, monochroom display midden | Keuken | `1f0fc39845233a82f0628ef7fb858053` |
| Warming drawer | `ESW7020` = **ESW 7020** (lade 29 cm hoog, grepeloos, Push2open; bevestigd door Peter 18-10) | 10891360 | **zwart glazen front zonder greep**, zelfde reeks als de ovens (bevestigd door Peter) | Keuken | `31c740bf126234441a0fd0e0f35dabfc` |

De frontend krijgt `model` (familie) en `model_id` (typenummer) uit `hass.devices`. Gebruik `model_id` om **vorm en tekening** te kiezen, zie §7. Het materiaalnummer staat alleen in de integratie-diagnostics en is niet bruikbaar in de kaart.

**Hoe Peter de kaarten bekijkt:**
- **Keukenscherm (Nest Hub):** alleen kijken, via cast.
- **HA-app op de iPhones:** interactief. Bediening en programma's horen dus thuis in de telefoonweergave.

De kaart moet ook werken voor types die Peter niet heeft: vaatwasser, oven, microgolf, was-droogcombinatie, kookplaat, dampkap, koelkast, wijnkast en robotstofzuiger. Voor deze types is een generieke fallback-tekening plus de juiste statusmapping voldoende.

---

## 1. Wat we van de hOn-kaart overnemen en wat verandert

**Overnemen (architectuur):**
- **Basisopbouw:** één JS-bestand dat zonder runtime-afhankelijkheden in HACS komt, met Shadow DOM.
- **Levenscyclus:** `setConfig` → `_build` → `_render` bij elke `hass`-update, plus een `_time()`-ticker van 1 s voor het aftellen.
- **Overlays:** de overlays op de tekening worden gepositioneerd met een `GEOM`-tabel per tekening (glas/deur, ring, LCD, icoontjes), in procenten van de tekening.
- **UI-bouwstenen:**
  - een ring rond de deur via `stroke-dashoffset` met `pathLength=100`;
  - een LCD met `container-type:size`;
  - een fase-pill op het glas;
  - een infopaneel;
  - een bedieningsrij met bevestigingsbalk (`_ask`);
  - een foutregel (`.err`).
- **Programmakaart:** favorieten als knoppen, een zoeklijst, een bevestigingsbalk en de truc "door dit dashboard gestart" in `localStorage`, zodat het juiste programma meteen zichtbaar is.
- **Registratie:** een `customElements.get(...)`-guard en registratie in `window.customCards`.
- **Opties:**
  - `finish`, dat de SVG herkleurt via `finishSVG()`. Uitgebreid tot het Miele-kleurpalet, zie §7 "Kleur en uitvoering".
  - `images:` voor eigen tekeningen.

**Veranderen:**

| hOn | Miele |
|---|---|
| Entiteiten op naamprefix (`binary_sensor.<entity>_status`) | Rollen op **device + translation_key**, zie §2 |
| Numerieke `mode`/`phase`-codes met eigen tabellen | Enum-strings uit de integratie, met labels uit **HA's eigen vertalingen**, zie §6 |
| Diensten `hon.set_mode`, `hon.start_program` | Knoppen `button.*` (start/stop/pause) en diensten `miele.set_program` / `miele.set_program_oven` |
| Twee tekeningen (wasmachine, droogkast) | Zes eigen tekeningen plus een fallback, zie §7 |
| Alleen donker thema, alleen Engels | Licht en donker, NL en EN |
| Voortgang uit start/eindtijd plus `remaining` | `elapsed / (elapsed + remaining)`, zie §4 |

---

## 2. Entiteitsdetectie: rollen per toestel

**Gebruik nooit de suffix van een entity_id.** Bij Peter zijn ze een mengeling van Nederlands en Engels, en misleidend:
- `sensor.miele_washing_machine_doeltemperatuur` is de **doel**temperatuur.
- Bij de stoomoven zijn `sensor.miele_steam_oven_temperatuur` (gemeten) en `sensor.miele_steam_oven_doeltemperatuur` (doel) **beide** "Temperatuur" genoemd.
- Knoppen heten `button.*_pauzeren`, `_starten` en `_stoppen`.

**Detectie:**
1. Neem alle `hass.entities` met `platform === "miele"` en groepeer ze op `device_id`.
2. Bepaal per entiteit de rol uit `domain` + `translation_key` (die staat in `hass.entities[eid].translation_key`) **[verifiëren in de browserconsole]**. Bij ontbrekende `translation_key` gebruik je `attributes.device_class` uit `hass.states`.
3. Fallback, robuust en alleen voor admins: haal via `hass.callWS({type: "config/entity_registry/list"})` de `unique_id` op. De rol is het deel **na de eerste `-`** (de `description.key`). Gecontroleerd bij Peter:
   - `000187896956-state_status`
   - `000187896956-state_program_phase`
   - `000187896956-state_target_temperature`
   - `000187896956-state_mobile_start`
   - `000177853792-pause`
   - `000175685894-state_temperature_1`
   - `000187896956-start`
4. Het toesteltype komt uit `hass.devices[device_id].model`. Waargenomen waarden: `Washing machine`, `Tumble dryer`, `Steam oven combi`, `Oven microwave`, `Coffee system`, `Warming drawer`. Mapping naar tekenfamilie: zie §7.
5. In de config kan elke rol overschreven worden: `entities: { remaining: sensor.x, ... }`.

| Rol | Domein | translation_key | description.key (uit unique_id) | Opmerking |
|---|---|---|---|---|
| `status` | sensor | `status` | `state_status` | Hoofdsensor, `name: null` (bv. `sensor.miele_washing_machine`) |
| `program` | sensor | `program_id` | `state_program_id` | Enum; `attributes.options` = alle programmasleutels van dit type |
| `phase` | sensor | `program_phase` | `state_program_phase` | Enum per toesteltype |
| `program_type` | sensor | `program_type` | `state_program_type` | normal_operation_mode / own_program / automatic_program / maintenance_program |
| `remaining` | sensor | `remaining_time` | `state_remaining_time` | min, int; 0 bij einde |
| `elapsed` | sensor | `elapsed_time` | `state_elapsed_time` | min; houdt laatste waarde bij einde |
| `start_in` | sensor | `start_time` | `state_start_time` | duur; **eenheid kan `h` zijn** (wasmachine) |
| `finish` | sensor | `finish` | `state_finish_timestamp` | timestamp, minuutprecisie, 90 s hysterese |
| `start_ts` | sensor | `start` | `state_start_timestamp` | timestamp |
| `target_temp` | sensor | `target_temperature` | `state_target_temperature` | °C |
| `temp` | sensor | — (device_class temperature) | `state_temperature_1` | gemeten (ovens, lade) |
| `core_temp` / `core_target` | sensor | `core_temperature` / `core_target_temperature` | idem | kerntemperatuurvoeler |
| `spin_speed` | sensor | `spin_speed` | `state_spinning_speed` | rpm |
| `drying_step` | sensor | `drying_step` | `state_drying_step` | doel-droogtegraad (droogkast) |
| `energy`, `water`, `energy_forecast`, `water_forecast` | sensor | `energy_consumption`, `water_consumption`, `energy_forecast`, `water_forecast` | | |
| `twindos_1`, `twindos_2` | sensor | `twin_dos_1_level`, `twin_dos_2_level` | | % |
| `door` | binary_sensor | — (device_class door) | `state_signal_door` | |
| `failure` | binary_sensor | — (device_class problem) | `state_signal_failure` | |
| `notification` | binary_sensor | `notification_active` | `state_signal_info` | |
| `remote_control` | binary_sensor | `remote_control` | `state_full_remote_control` | "Bediening op afstand" |
| `mobile_start` | binary_sensor | `mobile_start` | `state_mobile_start` | "Start op afstand"; vereist om te starten |
| `smart_grid` | binary_sensor | `smart_grid` | `state_smart_grid` | |
| `btn_start`, `btn_stop`, `btn_pause` | button | `start`, `stop`, `pause` | `start`, `stop`, `pause` | **Standaard uitgeschakeld** door de integratie |
| `power` | switch | `power` | `poweronoff` | |
| `light` | light | `light` | `light` | ovens, koffie |

**Uitgeschakelde knoppen:**
- Bij Peter zijn `button.miele_washing_machine_{starten,pauzeren,stoppen}` `disabled_by: integration`. Ze staan dus niet in `hass.states`. Bij de droogkast zijn ze wel ingeschakeld.
- De editor toont een melding: "Bediening uitgeschakeld — inschakelen?". Een klik zet `config/entity_registry/update {disabled_by: null}` (alleen voor admins). Daarna duurt het ~30 s tot HA herlaadt.
- Knoppen zijn `unavailable` zolang de API die actie niet aanbiedt (`process_actions`). Toon een knop alleen als `state !== "unavailable"`.

---

## 3. Toestandsmodel

### Statusenum (`sensor.<toestel>`)
`reserved, off, on, programmed, waiting_to_start, in_use, pause, program_ended, failure, program_interrupted, idle, rinse_hold, service, superfreezing, supercooling, superheating, supercooling_superfreezing, autocleaning, not_connected`

| Kaartstatus | Miele-status | Weergave |
|---|---|---|
| `off` | off, reserved | grijs, LCD `--:--` |
| `offline` | not_connected, unavailable, unknown | **eerst negeren** (zie hieronder), daarna gedimd "Niet verbonden" |
| `standby` | on, idle | "Aan"; LCD leeg |
| `ready` | programmed | "Klaar om te starten"; LCD = programmaduur (`remaining`), zoals hOn "Ready" |
| `scheduled` | waiting_to_start | "Start om HH:MM" of "Start over Xu" (`start_ts` / `start_in`) |
| `running` | in_use, rinse_hold, autocleaning, superheating… | accentkleur, animatie aan |
| `paused` | pause | rustig label "Gepauzeerd"; bij ovens/microgolf **meestal deur open**, geen alarmkleur |
| `done` | program_ended | groene ring; fase blijft zichtbaar (anti-kreuk/afkoelen) |
| `interrupted` | program_interrupted | oranje, "Onderbroken" |
| `error` | failure, service, `failure`-binary_sensor aan | rood |

**Blips negeren.** De historie toont dagelijks korte `not_connected`-perioden (1–3 s) en een nachtelijke `unavailable` (~04:11, 4 min) bij het herladen van de integratie. Zo ga je ermee om:
- Houd de laatste goede toestand **60 s** vast voordat je "offline" toont.
- Laat een lopende countdown gewoon doorlopen.

### Fasen per toesteltype (`attributes.options` van de phase-sensor, letterlijk bij Peter)
- **Wasmachine:** anti_crease, automatic_start, cancelled, cleaning, cooling_down, disinfecting, drain, drying, finished, flex_load_active, freshen_up_and_moisten, hygiene, main_wash, not_running, paused, pre_wash, rinse, rinse_hold, soak, spin, starch_stop, steam_smoothing, venting
- **Droogkast:** anti_crease, automatic_start, comfort_cooling, cooling_down, drying, extra_dry, finished, hand_iron, hand_iron_1, hand_iron_2, hygiene_drying, machine_iron, moisten, normal, normal_plus, not_running, perfect_dry_active, program_running, rinse_out_lint, rinses, safety_cooling, slightly_dry, smoothing, steam_smoothing, thermo_spin, timed_drying, warm_air
- **Stoomoven combi:** drying, energy_save, heating_up, heating_up_phase, not_running, pre_heating, process_finished, process_running, rinse, roasting, searing, steam_reduction, waiting_for_start
- **Oven-microgolf:** cooling_phase, energy_save, heating_up_phase, not_running, process_finished, process_running, steam_reduction, waiting_for_start
- **Koffie:** 2nd_espresso, 2nd_grinding, 2nd_pre_brewing, dispensing, espresso, grinding, heating_up, hot_milk, milk_foam, not_running, pre_brewing, rinse
- **Warmhoudlade:** cooling_down, door_open, heating_up, keeping_warm, not_running

### Waargenomen verlopen (echte cycli, zie `fixtures.json`)
- **Wasmachine:**
  - Verloop: off → on → programmed (`remaining` = 159, volledige duur) → in_use met main_wash → (pause 9 s) → rinse → drain → spin → **program_ended + anti_crease** → na ~30 min `finished` → off.
  - De kaart moet dus "Klaar" tonen met een trommel die nog traag draait tijdens anti-kreuk.
  - Tijdens `programmed` wisselt `program` snel als men aan de knop draait. Debounce de LCD-update ~1 s.
- **Droogkast:**
  - Verloop: programmed → in_use met drying → **hand_iron_1 → normal** (bereikte droogtegraden onderweg naar het doel `drying_step = extra_dry`) → program_ended + cooling_down → comfort_cooling → anti_crease (60 min) → finished → off.
  - Daarnaast komt `program_interrupted` voor.
  - **Idee:** toon een "droogteladder" (Strijkdroog → Normaal → Extra droog) met het doel gemarkeerd en de bereikte stap opgelicht.
- **Stoomoven:**
  - Verloop: in_use met heating_up_phase (168 → 195 °C in 70 s, `remaining` = 0) → process_running (`remaining` 11 → 0) → program_ended + process_finished → on → off.
  - Pause komt tientallen keren per sessie voor (deur open), telkens met de fase op `not_running`.
- **Oven-microgolf:**
  - Zelfde patroon. Programma's: `microwave`, `quick_microwave`, `fan_plus` en `microwave_fan_plus` (het programma kan midden in een sessie wisselen).
- **Koffie:**
  - Verloop: on → `autocleaning` (spoelen bij aan/uit) → in_use met grinding → dispensing (~1 min) → on.
  - Thee toont fase `rinse`. Daarnaast komt `program_interrupted` voor.
  - Er is geen tijdsinformatie.
- **Warmhoudlade:**
  - In 10 dagen niet gebruikt.
  - Toont geregeld `not_connected`-blips.
  - `temp` (20,1 °C) is altijd beschikbaar.

---

## 4. Tijd en voortgang

- **`remaining`:**
  - Gehele minuten. Al gevuld bij `programmed` (programmaduur).
  - Wordt 0 bij `program_ended` (integratie: `end_value_fn = 0`).
  - Is `unknown` bij off/on/idle.
- **`elapsed`:** minuten; houdt de laatste waarde vast bij einde.
- **`finish`:** timestamp. **Voorkeursbron voor het einde**; de integratie onderdrukt sprongen < 90 s.
  - Fallback: `now + remaining*60`, verankerd op `remaining.last_updated`. Dat is de hOn-aanpak.
- **Voortgang:** `elapsed / (elapsed + remaining)`. Je hebt geen history-call nodig: Miele levert beide waarden.
  - Tijdens pause houdt de ring stand en loopt het LCD niet af.
- **Schatting loopt uit:** de wasmachine stond 45 min vóór het einde op "41 min resterend". Laat het LCD bij 0:00 niet op "Klaar" springen zolang de status `in_use` is. Toon dan "Bijna klaar".
- **Ovens zonder timer** (`remaining` = 0 of unknown tijdens in_use):
  - de ring toont **opwarmvoortgang** `(temp − start_temp) / (target − start_temp)` in fase `heating_up_phase`/`pre_heating`;
  - daarna een volle ring met "Op temperatuur";
  - het LCD toont de gemeten **temperatuur** en `elapsed` als ondertitel.
- **Koffie:** geen tijden. De ring loopt per fase onbepaald, het LCD toont de drank.
- **`start_in`:** respecteer `unit_of_measurement` (`h` of `min`) en toon HH:MM.
- **Throttle:** ovens sturen na het einde temperatuur-updates met sub-secondetempo. Render dan hooguit 1×/s.

---

## 5. Bediening

- **Pauzeren:** `button.press` op rol `btn_pause` (wasmachine, droogkast, vaatwasser, was-droog).
- **Stoppen:**
  - `btn_stop`, met bevestiging zoals hOn "Standby".
  - Ovens en microgolf hebben enkel start en stop, geen pauze.
- **Hervatten:** Miele heeft geen aparte resume. Gebruik `btn_start` als het toestel op `pause` staat en de knop beschikbaar is **[verifiëren: hervat START een gepauzeerde cyclus?]**.
- **Aan/uit:** `switch.toggle` op rol `power`, met bevestiging als er iets loopt.
- **Licht:** toggle op rol `light` (ovens, koffie) als klein icoon op de tekening, zoals hOn wifi/deur.
- **Remote-iconen:**
  - wifi oplichten bij `remote_control` = on;
  - apart icoon "Start op afstand" bij `mobile_start` = on.
- **Programma starten** kan alleen bij `mobile_start` = on (wasmachine en droogkast: op het toestel "Start op afstand" activeren na het laden). Toon anders de hOn-achtige melding in het Nederlands.
- **Foutafhandeling:** neem `_send` met `.err` over. `HomeAssistantError`-teksten van de integratie (`set_program_error` enz.) leesbaar tonen.
- **Waar bediening zichtbaar is:**
  - op de iPhones (HA-app) altijd;
  - op het keukenscherm nooit (`controls: false` in de display-preset).

### Wat de Miele-API zegt (developer.miele.com)

- **Acties hangen af van toestel en toestand.** Beschikbare acties vraag je op met `GET actions`. In HA zie je dat aan de knoppen, die `unavailable` zijn zolang de actie niet is toegestaan.
  - Diagnostics van de wasmachine (uit): `processAction: []`, `programId: []`, `powerOn: true`, `powerOff: false`.
- **Capabilities-tabel v1.1.x:** de tabel markeert `processAction PAUSE` voor 0 toesteltypes. Toch maakt HA pauzeknoppen aan voor de wasmachine, de droogkast en de vaatwasser, en bij Peter bestaat `button.miele_tumble_dryer_pauzeren`.
  - **[verifiëren]** of pauzeren via de API echt werkt. Zo niet: verberg de pauzeknop als de knop `unavailable` is. Dat doet de kaart toch al.
- **`remoteEnable` heeft drie vlaggen:**
  - `fullRemoteControl` → rol `remote_control`;
  - `mobileStart` → rol `mobile_start`;
  - `smartGrid` → rol `smart_grid`.
  - Op 18-10 stond `mobileStart` alleen bij de oven-microgolf op true.
- **SmartGrid:** status `waiting_to_start` plus `smart_grid` = on betekent dat het toestel wacht op goedkope of zonne-energie, zoals het energiemanagement op miele.be beschrijft. Toon dan "Wacht op slim starten".
- **Realtime updates:** de API levert updates via **SSE**, en HA gebruikt die (`iot_class: cloud_push`). De kaart hoeft dus nooit te pollen.
- **Statuscodes die HA niet kent:** HA-diagnostics meldt `Missing StateStatus code: 144`, `Missing CoffeeSystemProgramId code: 24782` en `Missing OvenProgramId code: 639`.
  - Een status of programma kan dus tijdelijk `unknown` zijn terwijl het toestel draait. Dat verklaart de `unknown`-blips in de programmahistorie van de oven en de koffiemachine.
  - De kaart valt dan terug op de fase en het laatst bekende programma.
- **EcoFeedback (energie- en watervoorspelling):** bestaat voor wasmachine, droogkast, vaatwasser en was-droog. HA levert het als `energy_forecast` en `water_forecast` (%), en als verbruik.
  - Toon het optioneel als twee kleine balkjes in het paneel ("Energie" / "Water"), zoals de Miele-app de "inzichten in energie" toont.
- **Nieuw in de API, nog niet in HA** (HA gebruikt pymiele 0.6.3):
  - `GET LastUsedPrograms` (augustus 2026; zou ideaal zijn voor favorieten);
  - `failureDetails`;
  - `camera`.
  - Niet op bouwen; noteer ze als toekomstidee.

---

## 6. Programmakaart

- **Starten:**
  - `miele.set_program {device_id, program_id}` voor wasmachine, droogkast, koffie en lade.
  - `miele.set_program_oven {device_id, program_id, temperature?, duration?}` voor ovens.
  - Beide werken op het **device_id** en nemen een **numeriek** `program_id`.
- **ID's ophalen met `miele.get_programs {device_id}`** (alleen een response; frontend: `hass.callService("miele","get_programs",{device_id},undefined,false,true)`) **[verifiëren: signatuur voor returnResponse]**:
  - Koffie (uit): 22 programma's, `24001` Ristretto, `24002` espresso, `24003` coffee, `24004` Long coffee, `24005` cappuccino … `24020` Hot milk; plus 24030/24031 zonder naam (verbergen). Bereik 24000–24031 = profiel 1.
  - Warmhoudlade (uit): `[]`.
  - Wasmachine en droogkast (uit): **HTTP 400 Bad Request**. Vermoedelijk geeft de API de lijst alleen als het toestel aan staat en/of op afstand starten actief is **[verifiëren met toestel aan]**.
  - Aanpak: haal de lijst lazy op zodra het toestel aan staat, cache hem per device in `localStorage` en toon de cache als het toestel uit staat.
  - **Volgens de release notes van de Miele-API** (V1.0.5, juli 2021) gelden `GET programs` en `PUT programs` alleen voor toestellen met MobileStart- of MobileControl-ondersteuning.
- **Warmhoudlade:**
  - De lade krijgt zijn programma via de **actie** `programId` (V1.0.2), niet via het programs-endpoint.
  - HA's `miele.set_program` gebruikt het programs-endpoint. Starten werkt daar dus vermoedelijk **niet** **[verifiëren]**.
  - Toon voor de lade enkel de status, geen programmakaart, tenzij de test slaagt.
- **Fallback-tabel** (uit HA-const, sleutel → ID). Alleen bruikbaar waar het ID eenduidig is:
  - Wasmachine: cottons 1, minimum_iron 3, delicates 4, woollens 8, silks 9, rinse 18, drain_spin 21, shirts 23, denim 24, sportswear 29, cottons_hygiene 69, freshen_up 76, down_duvets 95, express_20 122, quick_power_wash 146, eco_40_60 190 (sommige modellen gebruiken 100xx-ID's: cottons 10001, eco_40_60 10007 …).
  - Droogkast: meerdere ID's per programma (bv. cottons = 2/20/90/10001). **Niet** uit de tabel starten, alleen via `get_programs`.
  - Warmhoudlade: warm_cups_glasses 1, warm_dishes_plates 2, keep_warm 3, slow_roasting 4.
- **Labels:**
  - **Gebruik de vertalingen van HA zelf.** `hass.formatEntityState(stateObj)` geeft "Katoen", "Hoofdwas" enz. in de taal van de gebruiker.
  - Voor programma's die niet actief zijn: `hass.localize("component.miele.entity.sensor.program_id.state.<sleutel>")` **[verifiëren of entity-vertalingen geladen zijn; anders `hass.loadBackendTranslation("entity","miele")`]**.
  - Namen uit `get_programs` zijn Engels en slordig (hoofdletters). Gebruik ze alleen als laatste fallback.
- **Favorieten-voorstel** (uit Peters gebruik van de afgelopen 10 dagen):
  - Wasmachine: cottons, eco_40_60, minimum_iron, denim, woollens, quick_power_wash, freshen_up, drain_spin, down_duvets, cottons_hygiene.
  - Droogkast: cottons, minimum_iron, warm_air, cottons_eco.
  - Koffie: long_coffee, herbal_tea, milk_foam.
  - Stoomoven: fan_plus.
  - Oven-microgolf: microwave, quick_microwave, fan_plus, microwave_fan_plus.
- **Ovens:** een tik op een programma opent een klein formulier (temperatuur via een slider binnen min/max/step uit `get_programs.parameters`, optioneel een duur). Start pas na bevestiging.
- **Veiligheid:** nooit automatisch starten, altijd bevestigen. Het startknopje is grijs met uitleg als `mobile_start` uit staat of het toestel bezig is.

---

## 7. Tekeningen en animaties

**Stijl:**
- "Fotorealistisch" zoals de hOn-SVG's: gradiënten, chroom en glans, als **inline SVG** (als string in het bundle).
- **Geen Miele-logo of -woordmerk op de tekeningen.**
  - Miele heeft een *Logo Guide* voor derden ("Brand_Guide-3rd_Party_Logo.pdf": wit woordmerk op Miele-rood RGB 140/0/20, vaste beschermzone). Het gebruik ervan valt onder de *3rd Party API License and Terms of Use*.
  - Deze kaart gebruikt de API niet rechtstreeks, en een logo voegt niets toe. Dus geen logo.
- **Geen productfoto's van miele.be of de perssite in de repo.** De perssite vermeldt geen gebruiksvoorwaarden voor beelden; ga dus uit van auteursrecht.
  - De optie `images:` blijft bestaan, zodat Peter lokaal eigen foto's kan gebruiken (`/local/...`). Die gaan niet mee in de repo.
- **De tekening komt uit `model_id`** (het typenummer). Peters echte toestellen zijn de referentie.

| Familie | Herkenning (`model` / `model_id`-prefix) | Tekening (Peters toestel als referentie) | Animatie (running) | Done |
|---|---|---|---|---|
| `washer` | Washing machine; `W*` (WEI, WED, WEG, WCR, WWD…) | **W1 WEI 895 WPS Gala/ChromeEdition:** lotuswit, schuin bedieningspaneel, **draaiknop** met lotuswit/chromen ring, ComfortSensor-display (wit, 1 regel), TwinDos-vakje links onder, ronde deur met **chromen** ring | waterlijn in de trommel; **spin**: snelheid ×4; **drain**: waterlijn zakt; trommelverlichting (LED) aan bij running en deur open | anti_crease: trommel traag, ring groen |
| `dryer` | Tumble dryer; `T*` (TEF, TCR, TWF…) | **T1 TEF 775 WP:** lotuswit met chroom, zelfde reeks en paneel als de W1: schuin paneel, draaiknop met chromen ring, display, ronde deur met **chromen** ring; condensaatbak linksboven. Wasmachine en droogkast moeten als set naast elkaar kloppen (zelfde hoogte, paneellijn en deurpositie). | trommel draait, warme gloed; `cooling_down`/`comfort_cooling`: blauwe gloed; **droogteladder** (§3) | anti_crease idem |
| `steam_oven` | Steam oven combi/Steam oven/Oven/Dialog oven; `DGC*`, `DG*`, `H*` zonder `M` | **DGC 7845 X ArtLine:** 45 cm, obsidiaanzwart glas, **grepeloos** (Touch2Open), M Touch-display in een zwarte strook bovenaan; het bedieningspaneel kantelt motorisch naar voren (waterreservoir erachter) | binnengloed, **stoom**-sliertjes bij stoomprogramma's; `heating_up_phase`: pulserende gloed; licht aan → ovenruimte verlicht | gloed uit, ring groen |
| `microwave` | Oven microwave/Microwave; `H*BM*`, `M*` | **H 7440 BMX:** 45 cm, obsidiaanzwart mat, grepeloos, zelfde ArtLine-familie als de stoomoven | **golven** (concentrische bogen) bij microgolfprogramma's (`microwave*`, `quick_microwave`); anders als de oven | |
| `coffee` | Coffee system; `CM*` = **vrijstaand**, `CVA*` = inbouw | **CM 7750 CoffeeSelect:** vrijstaand, obsidiaanzwart, smal-hoog; **centrale uitloop** met kopverlichting (rol `light`), drie bonenreservoirs bovenop, monochroom display midden, inox-lekbak, glazen melkreservoir aan de zijkant. `CVA*`: inbouwvariant (zwart front, uitloop in een nis) | `grinding`: lichte trilling plus bonen; `dispensing`: straal in het kopje plus damp; `rinse`: druppels; `autocleaning`: spoelen | kopje vol, damp |
| `drawer` | Warming drawer; `ESW*` | **ESW 7020:** lade 29 cm hoog (595 × 289 mm), **zwart glazen front zonder greep en zonder display**, zelfde ArtLine-reeks als de ovens. Glas, randen en zwart moeten naadloos aansluiten op de oventekeningen in de inbouwkolom. | warme gloed langs de bovenrand; `keeping_warm`: rustige puls; `door_open`: lade een stukje uit | |
| `generic` | rest | eenvoudige getekende kast | icoon plus ring | |

### Kleur en uitvoering

**Uit het typenummer is de kleur niet betrouwbaar af te leiden:**
- Hetzelfde inbouwtype bestaat in meerdere kleuren. Zo staat de DGC 7845 X bij Franse winkels als NR (noir), GR (grijs) en BB (blanc), en de ESW 7020 heeft per kleur een ander materiaalnummer.
- Alleen het **materiaalnummer** (`matNumber`) onderscheidt de kleurvariant. Dat zit alleen in de diagnostics en niet in `hass.devices`. Er bestaat ook geen publieke lijst van materiaalnummer naar kleur.
- Het typenummer bepaalt wel de **familie en vorm**. Wasgoed (W1/T1) is standaard lotuswit, inbouw en koffie standaard obsidiaanzwart.

**Instelling:**
- `finish` per kaart en per toestel in de editor.
- **Waarden:**
  - `lotus_white` (lotuswit), default voor `washer` en `dryer`;
  - `obsidian_black` (obsidiaanzwart), default voor de rest;
  - `graphite_grey` (grafietgrijs);
  - `brilliant_white` (briljantwit);
  - `pearl_beige` (pearlbeige);
  - `clean_steel` (roestvrij staal / CleanSteel);
  - een vrije hexkleur.
- **Hoe het werkt:** `finishSVG()` van de hOn-kaart herkleurt de witte tekening naar een donker front. Breid dat uit naar een palet.
  - Of teken de inbouwtoestellen meteen in zwart en herkleur naar licht.
  - Chroom, glas en displays blijven ongewijzigd.
- **Kleurwaarden:** benaderingen, af te stemmen op foto's. Miele publiceert geen kleurcodes voor fronten; alleen het logo-rood is gedocumenteerd.
- **Editor:** stelt per toestel de default voor en laat de kleur kiezen met een stalenkiezer.

**Performance (Google Nest Hub-cast!):**
- Optie `animations: full|reduced|off`. Volg ook `prefers-reduced-motion`.
- Vermijd de `filter: blur()` die hOn op de trommelfoto zet; die is duur op zwakke hardware.
- Animeer enkel `transform` en `opacity`.
- **Thema:**
  - Wel overnemen: de hOn-look als default ("dark").
  - Wel toevoegen: `theme: auto|light|dark` met CSS-variabelen, en de HA-variabelen (`--card-background-color`, `--primary-text-color`) als `theme: ha`.

---

## 8. Config-scherm met auto-detectie en layoutvoorstel

**`miele-overview-card`, de editor:**
1. **Scan:** alle devices met entiteiten waarvan `platform === "miele"`, met naam, model, area (`hass.areas`) en de rollen uit §2.
2. **Layoutvoorstel**, met een knop "Stel layout voor" en een keuze uit presets:
   - **Per ruimte** (standaard):
     - Bijkeuken: wasmachine en droogkast naast elkaar (2 kolommen), elk met een programmakaart eronder (ingeklapt).
     - Keuken:
       - een **inbouwkolom** met van boven naar onder de stoomoven (45 cm), de oven-microgolf (45 cm) en de warmhoudlade (29 cm), zoals een echte Miele-inbouwwand;
       - de **vrijstaande** koffiemachine ernaast "op het aanrecht" (CM = vrijstaand; een `CVA*` zou in de kolom komen).
       - De volgorde in de kolom is instelbaar.
   - **Raster:** alle toestellen in een automatisch raster.
   - **Alleen actieve:** toont enkel toestellen die niet `off` zijn (`hide_idle: true`) en schuift ze naar voren.
   - **Telefoon (iPhone-app):**
     - één kolom van 390 px;
     - compacte toestelkaart (tekening kleiner, LCD en ring blijven);
     - bediening en programmakaart aan;
     - actieve toestellen bovenaan.
   - **Keukenscherm (display):** voor het gecaste dashboard `google-home-hub-keuken` (Nest Hub, alleen kijken):
     - geen knoppen of programmakaarten (`controls: false`);
     - grote countdown;
     - alleen actieve toestellen, met een rustig overzicht als alles uit staat;
     - `animations: reduced`.
3. **Per toestel:** aan/uit-vinkje, volgorde (slepen), naam, accentkleur, **frontkleur** (`finish`, voorgesteld uit de familie, zie §7), programmakaart ja/nee en favorieten. Favorieten kies je uit `attributes.options` met vertaalde labels. De editor toont ook het herkende typenummer (`model_id`) en de gekozen tekening.
4. **Waarschuwingen:**
   - uitgeschakelde knoppen (§2), met een knop om ze in te schakelen;
   - "Start op afstand" staat uit;
   - toestel `not_connected`.
5. **Resultaat:** de overview-card rendert zelf de gekozen layout. Een knop "Kopieer als losse kaarten" geeft YAML met `miele-appliance-card`- en `miele-programmes-card`-kaarten voor wie liever zelf schikt.

**Verder:**
- Gebruik `ha-form` met selectors waar het kan, bijvoorbeeld de device-selector met `{ device: { integration: "miele" } }`.
- Implementeer `getGridOptions()` voor de sections-view.
- Fase 2 (optioneel): een **dashboard-strategy** `custom:miele` die automatisch een volledige view bouwt.

---

## 9. Taal

- **NL** (standaard voor Peter) **en EN**, op basis van `hass.locale.language`.
- **Eigen strings:**
  - knoppen;
  - meldingen;
  - kaartstatussen ("Klaar om te starten", "Bijna klaar", "Op temperatuur", "Deur open?");
  - editor.
- **HA-vertalingen** voor alle Miele-enums (status, fase, programma, droogtegraad).
- **Terminologie zoals Miele (miele.be) en HA-NL ze gebruiken:**
  - "Bediening op afstand" en "Start op afstand";
  - "meldingen";
  - "inzichten in energie" (EcoFeedback);
  - "software-updates op afstand";
  - "Slim starten" voor SmartGrid.
  - Merknamen niet vertalen: TwinDos, CapDosing, CoffeeSelect, Touch2Open, M Touch.

---

## 10. Bevindingen in Peters huidige HA (opruimkans)

- **Dashboards met flipdown-timer-cards:** `lovelace` (view 0) en `google-home-hub-keuken` (view 0).
  - Ze verwijzen naar `sensor.miele_*_einde_om` en `sensor.miele_*_status`. Die entiteiten **bestaan niet meer**: ze komen van de oude HACS-Miele-integratie.
  - Deze kaarten zijn dus kapot.
- **Template-helpers "Miele … Countdown" (5×):** ze lezen `sensor.miele_*_einde_om` en zijn daardoor permanent `unavailable`.
  - De nieuwe kaart maakt ze overbodig. Ruim ze pas op na de ingebruikname, en pas na Peters akkoord.
- **Droogkast-tiles:** in `lovelace` view 3, sectie 2 (power, pauzeren, starten, stoppen). Die worden vervangen door de nieuwe kaart.
- **Keukenscherm:** dat wordt gecast via `cast.show_lovelace_view`, het enige betrouwbare castpad in deze HA.
- **iPad mini 1 (iOS 9.3.5):** laadt geen `type: module`-resources. Deze kaart is daar **niet ondersteund**; dat valt buiten scope.

---

## 11. Repo, bouw en test

- **Repo:** een **nieuwe** repo `ha-miele-appliance-card` op Peters GitHub-account, geen GitHub-fork.
  - **Eerste commit:** importeer `hon-appliance-card.js` ongewijzigd als `reference/hon-appliance-card.js`. Vermeld in het commitbericht de bron en de upstream-commit, zodat de herkomst traceerbaar blijft.
  - **LICENSE (MIT):** behoud "Copyright (c) 2026 My Media Build" en voeg een eigen copyrightregel toe.
  - **NOTICE:**
    - "Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT";
    - plus eventuele regels voor ADNPolymerase en sionetta (§12).
  - **README:**
    - een sectie "Credits" met dezelfde vermelding;
    - een disclaimer: "Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG.";
    - geen Miele-logo.
  - De credits voor de hOn-integratie (gvigroux/Andre0512) vallen weg.
- **Bouw:**
  - de hOn-kaart is één bestand zonder build; met editor en 6 tekeningen wordt dat te groot om met de hand te onderhouden;
  - advies: `src/` in modules (cards/, editor/, drawings/, i18n/, miele-model.js) plus **esbuild** naar `dist/miele-appliance-card.js` (ES2020, één bestand);
  - `hacs.json` → `filename: miele-appliance-card.js`, type Dashboard.
- **Dev-harnas:** `dev/index.html` met een mock-`hass`:
  - `states`, `entities` (met `platform`, `device_id`, `translation_key`), `devices`, `areas`, `locale`, `formatEntityState`, `localize`;
  - `callService` en `callWS` die loggen;
  - replay van `fixtures.json` aan 60× snelheid.
- **Visuele tests:** Playwright-screenshots per toestel × status (off, ready, running, paused, done, interrupted, error) × thema (licht, donker) × frontkleur (lotus_white, obsidian_black, nog één) × breedte (390 iPhone, 500, 1024×600 keukenscherm).
- **Live test:** eerst als extra resource `/local/miele-appliance-card.js?v=x` op een testdashboard. Raak de bestaande dashboards niet aan tot Peter akkoord geeft.

---

## 12. Lessen uit andere kaarten

Er zijn drie kaarten onderzocht. Het rapport is gemaakt op basis van de gekloonde broncode; regelnummers verwijzen naar de bestanden in die repo's.

| Kaart | Licentie | Gebruik |
|---|---|---|
| ADNPolymerase/ha-appliance-card v2.27.1 (`dist/ha-appliance-card.js`, 957 KB) | MIT © 2026 ADNPolymerase | ideeën en kleine stukken, met attributie |
| sionetta/wm_animated_ha_card v1.4.0 (`washing-machine-card.js`) | MIT © 2026 sionetta | SVG-aanpak, thema, reduced-motion, met attributie |
| technogrady/ha_washdata_card | **geen open source** (persoonlijk gebruik; wijzigen en herverdelen verboden) | **niets kopiëren** |

**Waarom een eigen Miele-tabel nodig is.** De generieke keyword-normalisatie van ha-appliance-card (`STATE_KEYWORDS` + `normalizeState`, r. 2184–2207 en 3346–3363) gaat bij Miele fout:
- `on` → running, terwijl dat "aan, niets bezig" betekent;
- `programmed` → delayed;
- `in_use`, `program_ended`, `waiting_to_start`, `failure`, `program_interrupted` → unknown.

Daarom komt er een expliciete Miele-tabel (§3). Hun `CYCLE_STEP_PATTERNS` (r. 3714–3727, met Nederlandse woorden) zijn hooguit een fallback voor onbekende fasen.

**Overnemen, op volgorde van waarde:**
1. **Pre-fill vanuit hetzelfde toestel in de editor.**
   - Hun aanpak:
     - `siblingEntityIds` (r. 4222–4231, via `hass.entities[id].device_id`);
     - `autoSuggest` bij de eerste `hass` van de editor (r. 4464–4505 en 12609–12662);
     - de `_acceptsPick`-guard (r. 12465–12478), zodat een lege picker geen bestaande keuze wist.
   - Onze versie is sterker: rollen via `translation_key` (§2).
   - Gebruik `ha-form` met selectors, niet hun handgebouwde editor van ~900 regels.
2. **Thema `auto|light|dark|ha` via `hass.themes.darkMode`** (sionetta r. 1018–1100 en 1498–1504). Voeg daarbij een `prefers-reduced-motion`-blok toe dat **alle** animaties dekt (sionetta r. 1311–1320). ha-appliance-card doet dat niet voor oven, microgolf en koffie.
3. **Inline-SVG met gradiënten en ID-prefix per instantie** (`${u}`) als technische basis voor oven, stoomoven, combi en lade. Animeer via een klasse op de root (`.running`) met keyframes zoals `heatPulse` en `streamFall` (stroke-dashoffset, geschikt voor stoom en stroom).
   - Bronnen: sionetta `_svgOven` r. 848–926 en `_svgMicrowave` r. 928–1009, keyframes r. 1225–1310.
   - De artwork zelf (stoomoven, combi, warmhoudlade, inbouw-koffie) moet nieuw getekend worden; geen van de drie heeft ze.
4. **Woordenschat voor koffie:** schenkstraal, stoomsliertje, kopje dat zich vult en twee kopjes (ha-appliance-card CSS r. 7091–7182, HTML r. 8927–8963). Herteken die in onze stijl.
5. **Aparte `keep_warm`-status in amber** (r. 2196 en 3403) voor de warmhoudlade (`keeping_warm`) en ovens.
6. **Animaties niet herstarten bij redraw:**
   - `_stateSignature` (r. 9118–9155) slaat redraws over;
   - `--anim-offset` (r. 11725–11737) laat een animatie verder lopen.
   - De hOn-kaart vermijdt dit probleem al: hij bouwt de DOM één keer en wisselt daarna alleen klassen. Hou dat zo en gebruik geen `innerHTML` op de tekening.
7. **Klein spul:**
   - `getGridOptions` → `{columns: 12, min_columns: 4, rows: "auto"}`;
   - een `language`-override per kaart;
   - optioneel *hold-to-activate* (500 ms) voor stop en uit, als alternatief voor de bevestigingsbalk op tablets;
   - taps via HA's eigen `hass-action`-event (sionetta r. 501–515), zodat `tap_action` met bevestigingsdialoog gratis werkt.
8. **Dependency-vrije Node-testharnas** (`test/harness.mjs`, MIT) als voorbeeld voor de model-tests.

**Voortgang na herstart: ADN-aanpak als fallback.**
- Miele levert `elapsed` + `remaining`, dus de primaire voortgang heeft geen history nodig.
- Fallback als `elapsed` ontbreekt: haal de cyclusstart en de pauzes uit `history/history_during_period` (ADN `cycleFromHistory` r. 2236–2253 en `_lookUpCycle` r. 9322–9350; `progress = ran/(ran+remaining)`).
- **[verifiëren]** Telt Miele's `elapsed_time` pauzes mee? Zo ja, trek de pauzeduur af.

**Niet overnemen:**
- de 30 s-tick van ADN (de hOn-tick van 1 s is beter);
- `window.confirm` van sionetta (blokkeert de pagina; de hOn-bevestigingsbalk is beter);
- de stroomdrempel-logica van sionetta (bedoeld voor domme toestellen);
- ha-appliance-card als basis (veel te breed).

**Attributie bij kopiëren:**
- in LICENSE/NOTICE en als kopcommentaar: "Portions derived from ha-appliance-card, Copyright (c) 2026 ADNPolymerase, MIT" en/of "…wm_animated_ha_card, Copyright (c) 2026 sionetta, MIT";
- telkens met de MIT-toestemmingstekst.

---

## 13. Beslissingen en open punten

**Beslist door Peter (18-10-2026):**
- **Repo:** een nieuwe repo met bronvermelding, geen fork.
- **Kleur:**
  - wasmachine en droogkast in de witte reeks (lotuswit);
  - de keukentoestellen zwart (obsidiaanzwart);
  - een kleurinstelling per toestel voorzien.
- **Gebruik:** het keukenscherm (Nest Hub) is alleen om te kijken. Interactief gebruik gebeurt in de HA-app op de iPhones.

**Nog open, te verifiëren tijdens de bouw:**
1. (Opgelost 18-10: de droogkast is dezelfde reeks als de wasmachine, wit met chroom. De warmhoudlade is dezelfde reeks als de ovens, met een zwart glazen front zonder greep.)
2. Zie de **[verifiëren]**-punten in §2 tot §6:
   - `translation_key` in `hass.entities`;
   - hervatten met START;
   - pauzeren via de API;
   - `get_programs` bij een toestel dat aan staat;
   - starten van de warmhoudlade;
   - `returnResponse`-signatuur;
   - laden van de entity-vertalingen.
3. Moeten de start-, pauze- en stopknoppen van de wasmachine ingeschakeld worden? Dat gebeurt pas na akkoord, via de editor-knop of de HA-UI.

**Bronnen Miele:**
- developer.miele.com:
  - General concept, Best practices, Errors, Release notes, Downloads;
  - de capabilities-tabel v1.1.x;
  - de Logo Guide.
- miele.be Smart Home-pagina.
- miele.de perssite.
- de Miele-productfiche FS_12440580 (WEI 895 WPS).
- winkel-/productpagina's voor DGC 7845 X, H 7440 BMX en CM 7750.
