# ha-miele-appliance-card

Lovelace-kaarten voor Miele-toestellen in Home Assistant (core `miele`-integratie). De basis is spikey1965/ha-hon-appliance-card (MIT, © 2026 My Media Build). Dit is een nieuwe repo met bronvermelding, geen fork.

## Lees eerst
- `docs/SPEC.md` is de volledige bouwspec: entiteitsrollen, toestandsmodel, timing, bediening, programmakaart, tekeningen, kleur, editor met auto-detectie, lessen uit andere kaarten en de open punten.
- `docs/fixtures.json` bevat echte cycli uit Peters HA, gebruikt voor het dev-harnas en de tests.
- `docs/CLAUDE_CODE_PROMPT.md` is de startopdracht met de mijlpalen.

## Vaste regels
- **Entiteiten:** herken ze op device + `translation_key` (fallback: unique_id-suffix), nooit op de suffix van een entity_id. Die suffixen zijn half Nederlands, half Engels en misleidend.
- **Tekening:** kies die op `hass.devices[id].model_id` (Miele-typenummer).
- **Frontkleur:** via `finish`. Defaults: wasgoed lotuswit, keuken obsidiaanzwart.
- **Merk en beeld:** geen Miele-logo, geen Miele-productfoto's in de repo. Teken alles zelf als inline SVG.
- **Licenties:**
  - Niets kopiëren uit technogrady/ha_washdata_card (geen open source).
  - Code uit ADNPolymerase/ha-appliance-card of sionetta/wm_animated_ha_card mag alleen met MIT-attributie in NOTICE.
- **Gebruik:** het keukenscherm (Nest Hub, gecast) is alleen om te kijken. Bediening gebeurt in de HA-app op iPhone (390 px).
- **Starten:** een programma start nooit zonder bevestiging.
- **Peters HA:** raak bestaande dashboards en helpers niet aan. Live testen alleen op een apart testdashboard, na akkoord.
- **[verifiëren]-punten** uit de spec controleer je eerst in de echte HA en rapporteer je voor je erop bouwt.
- **Samenwerking:**
  - Werk per mijlpaal.
  - Toon na elke mijlpaal screenshots (Playwright) en wacht op feedback.
  - Communiceer in het Nederlands.
