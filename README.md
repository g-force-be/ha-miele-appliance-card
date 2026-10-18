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
