# Miele Appliance Card for Home Assistant

Dashboard cards for Miele appliances connected through Home Assistant's built-in **Miele** integration. Each appliance is drawn to look like the real thing, with a progress ring, the time left on its display, a moving animation, the current phase and the controls you need.

> **Status: in development.** Nothing is released yet. The build spec is in [`docs/SPEC.md`](docs/SPEC.md).

## Planned cards

| Card | What it does |
|---|---|
| `custom:miele-appliance-card` | One appliance: drawing, progress ring, countdown, phase, details and controls (pause, stop, power) with a confirmation step. |
| `custom:miele-programmes-card` | Favourite programmes as buttons plus a searchable list. A programme only starts after you confirm, and only when MobileStart (remote start) is on at the appliance. |
| `custom:miele-overview-card` | Finds all your Miele appliances and suggests a layout: per room, grid, active only, phone, or a view-only kitchen display. |

Appliance types: washing machine, tumble dryer, steam oven, oven, microwave, coffee machine and warming drawer, with a generic drawing for the rest (dishwasher, hob, hood, fridge, wine cabinet, robot vacuum). Light and dark themes, Dutch and English, and front colours such as lotus white and obsidian black.

## Use (preview)

```yaml
type: custom:miele-appliance-card
device_id: 82ddfc7a46859e3c356f96713e446d32   # or: entity: sensor.miele_washing_machine
```

| Option | What it does |
|---|---|
| `device_id` / `entity` | The appliance. Without either, the card takes the first Miele appliance it finds. |
| `name` | Card title. Default: the name you gave the device, else its type. |
| `finish` | Front colour: `lotus_white`, `obsidian_black`, `graphite_grey`, `brilliant_white`, `pearl_beige`, `clean_steel` or a hex colour. Default: lotus white for laundry, obsidian black for the rest. |
| `theme` | `dark` (default), `light`, `auto` (follows Home Assistant) or `ha` (Home Assistant's own card colours). |
| `animations` | `full` (default), `reduced` or `off`. Reduced motion in the operating system is respected. |
| `controls` | `false` hides the buttons, e.g. on a wall display. |
| `accent` | Ring and highlight colour. |
| `language` | `nl` or `en`. Default: Home Assistant's language. |
| `max_width` | Maximum width of the drawing, e.g. `380px`. |
| `drawing` | Another drawing: `washer`, `dryer`, `steam_oven`, `microwave`, `coffee`, `drawer` or `generic`. |
| `images` | A folder with your own drawings (`washer.svg`, `dryer.svg`, …), e.g. `/local/miele/`. |
| `entities` | Override a detected entity, e.g. `{ remaining: sensor.my_remaining_time }`. |

Own drawings: washing machine and tumble dryer (W1/T1), steam oven and oven with microwave (ArtLine, 45 cm), the CM 7750 coffee machine and the ESW 7020 warming drawer. Other appliances (dishwasher, hob, hood, fridge, …) get a plain fallback drawing. `drawing:` picks another one.

## Requirements

- Home Assistant with the core **Miele** integration (Settings → Devices & services → Add integration → Miele).
- To start programmes from Home Assistant: **MobileStart** (remote start) switched on at the appliance.

## Development

Requires Node 20+. The dev harness replays real appliance cycles (`docs/fixtures.json`, `dev/data/fixtures-extra.json`) through a mock Home Assistant.

```sh
npm install
npm test          # model tests (node:test)
npm run dev       # harness at http://127.0.0.1:5173/dev/
npm run shots     # Playwright screenshots in dev/screenshots/ (uses the installed Chrome)
```

## Credits

Based on [hOn Washer & Dryer Card](https://github.com/spikey1965/ha-hon-appliance-card) by My Media Build (MIT). The original card is kept unchanged in [`reference/`](reference/). See [`NOTICE`](NOTICE) for details.

## Disclaimer

Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. This project contains no Miele logo, wordmark or product photography; the appliance drawings are original artwork.

## Licence

MIT, see [`LICENSE`](LICENSE).
