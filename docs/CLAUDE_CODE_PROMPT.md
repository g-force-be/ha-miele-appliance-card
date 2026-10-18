We bouwen een Home Assistant-dashboardkaart voor mijn Miele-toestellen in een nieuwe repo, gebaseerd op spikey1965/ha-hon-appliance-card (MIT) met bronvermelding.

De repo-map bestaat al: `C:\Users\peterg\source\repos\ha-miele-appliance-card`. Het onderzoek staat in die map in `docs/SPEC.md` en `docs/fixtures.json`. Er is ook een kopie in mijn claude.ai-project "HomeAssistant". `CLAUDE.md` in de root vat de vaste regels samen.

Lees SPEC.md volledig voor je iets doet. Daarin staan:
- de entiteitsrollen;
- het toestandsmodel;
- tijd en voortgang;
- bediening;
- de programmakaart;
- de tekeningen;
- de editor met auto-detectie en layoutvoorstel;
- wat we uit andere kaarten halen (§12, met licenties);
- mijn beslissingen en de open punten (§13).

Ik heb al beslist:
- een nieuwe repo, geen fork;
- wasmachine en droogkast in lotuswit, de keukentoestellen in obsidiaanzwart, met een kleurinstelling per toestel;
- het keukenscherm (Nest Hub) is alleen om te kijken;
- bediening gebeurt in de HA-app op mijn iPhones.

Stappen:

1. **Repo.**
   - Doe `git init` in de bestaande map (`docs/` en `CLAUDE.md` staan er al).
   - Maak de GitHub-repo met `gh repo create ha-miele-appliance-card --public --source . --remote origin`.
   - Eerste commit: `hon-appliance-card.js` van spikey1965/ha-hon-appliance-card ongewijzigd als `reference/hon-appliance-card.js`, samen met `docs/`. Vermeld in het commitbericht de bron en de upstream-commit.
   - LICENSE (MIT) met de originele copyright plus mijn regel, een NOTICE en een README met credits en een Miele-disclaimer (§11).
   - Een `hacs.json`.
   - Kopieer **niets** uit technogrady/ha_washdata_card (geen open source). Code uit ADNPolymerase/ha-appliance-card of sionetta/wm_animated_ha_card alleen met de MIT-attributie uit §12.
   - Geen Miele-logo en geen Miele-productfoto's in de repo.

2. **Plan eerst.** Leg me een kort plan voor en wacht op mijn akkoord:
   - de bestandsstructuur: `src/` met esbuild naar `dist/miele-appliance-card.js`;
   - de mijlpalen;
   - welke **[verifiëren]**-punten je eerst in mijn HA controleert.

3. **Mijlpaal 1: datamodel en dev-harnas.**
   - `src/miele-model.js` met:
     - rol-detectie via `hass.entities` (platform `miele`, `translation_key`, `device_class`), met de fallback via unique_id;
     - modelfamilies;
     - de status- en fasemapping;
     - tijd en voortgang: `elapsed/(elapsed+remaining)`, finish-timestamp, ovens zonder timer op temperatuur, blip-filter van 60 s.
   - `dev/index.html` met een mock-`hass` die `docs/fixtures.json` afspeelt aan 60× snelheid.
   - Unit-tests op het model met die fixtures.

4. **Mijlpaal 2: `miele-appliance-card`.**
   - Herbruik de hOn-structuur: GEOM-overlays, ring, LCD, fase-pill, paneel, bediening met bevestigingsbalk. Bouw de DOM één keer en wissel daarna alleen klassen.
   - Begin met wasmachine en droogkast: eigen SVG-tekeningen in Miele-vormtaal, zonder logo. Mijn echte toestellen zijn de referentie (tabel in §0 en §7): W1 WEI 895 met draaiknop en chromen deur, en T1 TEF 775 WP in dezelfde reeks (wit met chroom). Ze moeten naast elkaar als set kloppen.
   - Daarna:
     - stoomoven DGC 7845 X en oven-microgolf H 7440 BMX (ArtLine, grepeloos);
     - de vrijstaande koffiemachine CM 7750;
     - warmhoudlade ESW 7020 (dezelfde reeks als de ovens: zwart glazen front zonder greep, naadloos onder de ovens in de inbouwkolom);
     - een generieke fallback.
   - De tekening wordt gekozen op `model_id`.
   - `finish`-kleurpalet met defaults per familie.
   - Thema auto/licht/donker/ha.
   - `animations: full|reduced|off`, plus `prefers-reduced-motion`.
   - NL en EN, met HA's eigen vertalingen voor de Miele-enums.

5. **Mijlpaal 3: `miele-programmes-card`.**
   - Starten via `miele.set_program` / `set_program_oven`.
   - ID's via `miele.get_programs`: lazy ophalen, cachen, met de fallback-tabel uit de spec.
   - Altijd bevestigen.
   - Grijs met uitleg zolang "Start op afstand" uit staat.

6. **Mijlpaal 4: `miele-overview-card` met visuele editor.**
   - `ha-form` met auto-detectie van alle Miele-toestellen.
   - Layoutpresets:
     - Per ruimte: bijkeuken naast elkaar, keuken als inbouwkolom plus koffiemachine ernaast;
     - Raster;
     - Alleen actieve;
     - Telefoon;
     - Keukenscherm (zonder bediening).
   - Instellingen per toestel.
   - Waarschuwing plus inschakelknop voor uitgeschakelde start/pauze/stop-knoppen.
   - Export naar losse kaarten.

7. **Na elke mijlpaal:**
   - Playwright-screenshots per toestel × status × thema × frontkleur × breedte (390 iPhone, 500, 1024×600 keukenscherm) in `dev/screenshots/`.
   - Toon me de belangrijkste screenshots en wacht op feedback voor je verdergaat.

Regels:
- Raak mijn bestaande HA-dashboards en -helpers niet aan.
- Live testen doe je alleen op een apart testdashboard, na mijn akkoord.
- Punten die in de spec als **[verifiëren]** staan, controleer je in de echte HA (browserconsole of HA API). Rapporteer de uitkomst voor je erop bouwt.
