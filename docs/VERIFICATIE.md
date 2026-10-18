# Verificaties en bevindingen

Gecontroleerd op 18-10-2026 in Peters Home Assistant: HA 2026.10.2, frontend 20260930.4, Miele-integratie met pymiele 0.6.3. Bronnen:
- de HA-MCP, alleen lezend: `config/entity_registry/list_for_display`, de recorder-historie en `frontend/get_translations`;
- de browserconsole op `homeassistant.local`;
- de broncode van `homeassistant/components/miele` en `home-assistant/frontend`, op de tags die bij deze versies horen.

## Groep A: [verifiëren]-punten zonder actie aan een toestel

| # | Punt (spec) | Uitkomst |
|---|---|---|
| 1 | `translation_key` in `hass.entities` (§2) | **Ja.** De frontend vult `hass.entities[eid].translation_key` uit `tk` van `list_for_display`. Zonder translation_key zijn: deur (`device_class: door`), probleem (`problem`) en gemeten temperatuur (`temperature`). De meldingssensor heeft ook `device_class: problem`, maar wel `translation_key: notification_active`. Uitgeschakelde knoppen (start/pauze/stop van de wasmachine) staan **niet** in `hass.entities`; alleen `config/entity_registry/list` (admin) toont ze. |
| 2 | `returnResponse`-signatuur (§6) | `hass.callService(domein, dienst, data, target, notifyOnError = true, returnResponse = false)`. Getest met `miele.get_programs` op de koffiemachine: `{context, response: {programs: [{program, program_id, parameters}]}}`, 22 programma's (24001 "Ristretto" … 24030/24031 zonder naam). De wasmachine (uit) geeft `HomeAssistantError` met `translation_domain: miele`, `translation_key: get_programs_error` en placeholders `{status: "400", message: "Bad Request"}`. |
| 3 | Entity-vertalingen geladen (§6) | **Ja.** `hass.localize("component.miele.entity.sensor.program_id.state.cottons")` geeft "Katoen", ook voor niet-actieve waarden ("Kreukbeveiliging", "Strijkdroog plus", "Extra droog"). De kaart roept voor de zekerheid toch één keer `hass.loadBackendTranslation("entity", "miele")` aan. |
| 4 | Telt `elapsed_time` pauzes mee? (§12) | **Ja, bij de stoomoven.** Op 10-10 (12:48–13:27) liep de teller elke minuut door, ook tijdens 7 deurpauzes van samen 553,6 s. Het model trekt de pauzetijd dus af. Bij wasmachine en droogkast duurden de pauzes maar 2–9 s; dat schuift naar groep B. |

## Extra bevindingen

1. **De microgolf haalt de keuken van de wifi.**
   - Tijdens microgolfprogramma's worden alle keukentoestellen tegelijk `not_connected`: microgolf, stoomoven, koffie en lade. Dat duurt 1 tot 13 minuten. Voorbeelden: 10-10 19:06–19:25 (microgolf 328 s, 219 s en 104 s terwijl hij draait; lade 768 s) en 18-10 13:46–14:08.
   - In de bijkeuken gebeurt dat amper: de wasmachine had één blip, de droogkast twee keer ~6 min terwijl hij uit stond.
   - Gevolg: de "60 s vasthouden" uit §3 is te kort voor een lopende cyclus. Zie keuze B.
2. **Bij `not_connected` worden de andere sensoren `unknown`, niet `unavailable`.**
   - De beschikbaarheidscheck van de integratie vergelijkt een int met een enum (`state_status is not StateStatus.not_connected`) en grijpt dus nooit in.
   - Tijdens de uitval kwamen er zelfs nog waarden binnen (19:08:50).
   - Het model negeert alles van een toestel zolang de status `not_connected` is.
3. **De timer van de microgolf start pas na het opwarmen.**
   - `remaining` bleef op 16 staan tijdens `heating_up_phase` en sprong daarna heen en weer (16 → 0, 7 → 6 → 16).
   - Bij een programmawissel springt `elapsed` terug naar 0.
4. **Temperaturen komen ongeveer 1× per seconde binnen tijdens het opwarmen.** Dat bevestigt dat de kaart het renderen moet throttlen (§4).
5. **Eenheden zoals in de spec.** `start_in` staat in `h`, `remaining` en `elapsed` in `min`, temperaturen in `°C`. Het model rekent alles om via `unit_of_measurement`.

De sessies uit punten 1 en 3 staan als extra testcycli in `dev/data/fixtures-extra.json`.

## Keuzes in het model (ter goedkeuring)

- **A. Aftellen vanuit `remaining`, eindtijd vanuit `finish`.**
  - Het LCD telt per seconde af vanaf Miele's minuten, maar loopt nooit meer dan één minuut voor op Miele.
  - Een vastgelopen schatting ("41 min" voor 45 min) of een timer die nog niet loopt, holt zo niet weg. Bij 0 terwijl het toestel bezig is: "Bijna klaar".
  - "Klaar om HH:MM" komt uit `finish`, zoals §4 zegt.
- **B. Wegvallen tijdens een cyclus.**
  - Een lopende, gepauzeerde of geplande cyclus blijft zichtbaar, gemarkeerd als "verbinding weg", tot de verwachte eindtijd + 5 min (zonder eindtijd: 20 min). Het aftellen loopt door.
  - Een toestel dat uit of aan stond, toont na 60 s "Niet verbonden", zoals in de spec.
- **C. Pauzes tellen niet mee voor de voortgang.**
  - De voortgang is `(elapsed − pauzes) / (elapsed − pauzes + remaining)`. Tijdens een pauze staan de ring en het LCD stil.
  - Het model telt de pauzes zelf. Bij het herladen van de kaart midden in een cyclus is die telling weg. Ze uit de historie halen (ADN-aanpak, §12) staat open voor M2.
- **D. 100 % alleen bij "Klaar".** Een lopende cyclus komt hooguit op 99 %.
- **E. Ovens in de opwarmfase tonen opwarmvoortgang en temperatuur**, ook als `remaining` al gevuld is, want de timer loopt dan nog niet. Daarna volgt de tijdvoortgang. Die begint lager dan de volle "op temperatuur"-ring, want de opwarmtijd telt mee in `elapsed`.

## Groep B: met Peter aan het toestel

5. `get_programs` met de wasmachine en de droogkast aan en "Start op afstand" actief (§6).
6. Pauzeren via de API, en hervatten met START, tijdens een echte cyclus van de droogkast (§5). Meteen ook: telt `elapsed` daar de pauzes mee?
7. De warmhoudlade starten met `miele.set_program` (§6).
8. Open punt 3: de knoppen van de wasmachine inschakelen, alleen na akkoord.

### Stand 18-10, live gezien

- **Punt 5 (deels).** Tijdens een droogcyclus en bij de wasmachine op "Programma klaar" gaf `get_programs` nog 400, met "Start op afstand" uit. Met "Start op afstand" aan is het nog niet getest: in tien dagen historie stond het bij wasmachine, droogkast en koffiemachine nooit aan.
- **Punt 6 (deels).** De pauzeknop van de droogkast bleef `unavailable` terwijl hij droogde, dus de API biedt daar geen pauze aan. De kaart verbergt de knop dan.

## M3: programmakaart (18-10, browserconsole op het testdashboard, alleen lezen)

1. **`returnResponse`-signatuur: bevestigd.** `hass.callService("miele", "get_programs", {device_id}, undefined, false, true)` geeft `{context, response: {programs: [...]}}`. Elk item heeft `program_id`, `program` (Engels) en `parameters`.
2. **`get_programs` per toestel, met "Start op afstand" overal uit:**
   - Stoomoven (aan): 13 programma's, elk met temperatuur min/max/stap en tijd min/max (bv. Hetelucht plus 30–225 °C per 5, tot 12:00).
   - Oven-microgolf (uit): 7 programma's. Microgolf heeft geen temperatuur en 0:00–1:00 tijd. Grill heeft vast 230 °C.
   - Koffiemachine (aan): 22 items, waarvan 20 met naam. 24030 en 24031 hebben geen naam en worden verborgen.
   - Warmhoudlade (uit): `[]`.
   - Wasmachine en droogkast: 400 / Bad Request.
3. **De ID's volgen HA's eigen tabellen niet.** Ristretto is 24001 in `get_programs` en 24000 in HA's const; cappuccino 24005 tegenover 24004; caffè latte 24008 tegenover 24009. Daarom:
   - de kaart koppelt een programma aan HA's sleutel **op naam** (genormaliseerd, tegen de `options` van de programmasensor);
   - ze start **alleen met de ID's die het toestel zelf geeft** (vers of uit de cache), nooit met een fallback-tabel. Dat wijkt af van §6: een tabel-ID kan een ander programma starten.
   Koppelen op naam: koffie 20/20, oven-microgolf 7/7, stoomoven 12/13. "Cake plus" kent HA niet; die toont de kaart met de Miele-naam.
4. **Entity-vertalingen: geladen.** `hass.localize("component.miele.entity.sensor.program_id.state.cottons")` geeft "Katoen". Waar HA nog Engels geeft, vult de Nederlandse fallback aan.
5. **"Start op afstand" in de historie (10 dagen).** Bij de oven-microgolf en de stoomoven ging het vaak aan, steeds tijdens het koken. Bij wasmachine, droogkast en koffiemachine nooit.

Nog open voor groep B:
- starten met "Start op afstand" aan, per toestel;
- of de koffiemachine "Start op afstand" kent.

## Groep B: eerste starttest (18-10, oven-microgolf, met Peters akkoord)

- **Aanzetten** met de knop op de kaart werkte, maar `switch.turn_on` gaf "Failed to set state for switch.miele_microwave_oven_power". De Miele-cloud gaf een HTTP-fout terug en voerde het bevel toch uit. De kaart wist die melding nu zodra de schakelaar de gevraagde stand toont.
- **"Start op afstand"** ging bij het aanzetten niet vanzelf aan.
- **`set_program_oven`** (programma 13 Hetelucht plus, 60 °C) zonder "Start op afstand" gaf geen fout. De oven kreeg het programma en de doeltemperatuur, maar startte niet:
  - status `pause`, fase `not_running`, verstreken 0, starttijd 0;
  - de Miele-app toonde hetzelfde: Hetelucht Plus, doel 60 °C, met een grijze startknop.
  Klaarzetten kan dus van buitenaf, starten alleen aan het toestel of met "Start op afstand" aan.
- **De kaart** toont `pause` + `not_running` + 0 min nu als "Klaar om te starten", tenzij er eerder iets liep. Een deurpauze valt na zo'n 24 s ook terug op `not_running`.
