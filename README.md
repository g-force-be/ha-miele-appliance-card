![Miele Appliance Card](https://raw.githubusercontent.com/g-force-be/ha-miele-appliance-card/main/docs/images/banner.png)

# Miele Appliance Card for Home Assistant

Dashboard cards for Miele appliances connected through Home Assistant's built-in **Miele** integration. Each appliance is drawn to look like the real one, its display shows what the real display shows, and a ring around the door or window fills up as the programme runs.

![Washing machine and tumble dryer cards, both running](https://raw.githubusercontent.com/g-force-be/ha-miele-appliance-card/main/docs/images/laundry.png)

- **Looks like your appliance.** Own drawings of the W1 washing machine and T1 dryer, the ArtLine steam oven and oven with microwave, the CM 7750 coffee machine and the warming drawer. Front colours such as lotus white, obsidian black and graphite grey.
- **Shows what is going on.** Time left, end time, phase, temperatures, dryness level, door and remote-start status. Water, spinning drum, heat, steam, microwaves, coffee pouring and the oven light are animated, with movement that stays light on a Nest Hub.
- **Copes with a flaky connection.** When an appliance briefly drops off Wi-Fi, the card keeps the last known state instead of flashing "unavailable".
- **Starts programmes safely.** `miele-programmes-card` lists the programmes your appliance offers and always asks before it starts one.
- **Dutch and English**, light and dark themes, and Home Assistant's own Miele translations.

> **Status:** in development. The appliance card and the programmes card work; the overview card with a visual editor comes next. The build spec is in [`docs/SPEC.md`](docs/SPEC.md).

## Installation

**HACS** (recommended)

1. HACS → ⋮ → *Custom repositories* → add `https://github.com/g-force-be/ha-miele-appliance-card`, type *Dashboard*.
2. Install **Miele Appliance Card** and reload the browser (on a phone: close and reopen the Home Assistant app).

**By hand:** copy `dist/miele-appliance-card.js` to `config/www/` and add it under *Settings → Dashboards → ⋮ → Resources* as `/local/miele-appliance-card.js` (JavaScript module).

You need the core **Miele** integration (*Settings → Devices & services → Add integration → Miele*).

## The appliance card

```yaml
type: custom:miele-appliance-card
entity: sensor.miele_washing_machine
```

Point `entity` at any entity of the appliance. The card finds the appliance and its other entities by itself, by what each entity *is* (Home Assistant's translation key), not by its name. Renamed entities keep working.

![Steam oven, coffee machine, oven with microwave and warming drawer](https://raw.githubusercontent.com/g-force-be/ha-miele-appliance-card/main/docs/images/kitchen.png)

### More examples

A tumble dryer in graphite grey, light theme:

```yaml
type: custom:miele-appliance-card
entity: sensor.miele_tumble_dryer
finish: graphite_grey
theme: light
```

A kitchen display that only shows, without buttons (for a Nest Hub or wall tablet):

```yaml
type: custom:miele-appliance-card
entity: sensor.miele_steam_oven
name: Steam oven
controls: false
animations: reduced
```

A laundry room and a built-in column in a sections view, with the coffee machine next to the column:

```yaml
type: sections
sections:
  - type: grid
    column_span: 2
    cards:
      - type: heading
        heading: Laundry room
      - type: custom:miele-appliance-card
        entity: sensor.miele_washing_machine
        grid_options: { columns: 6 }
      - type: custom:miele-appliance-card
        entity: sensor.miele_tumble_dryer
        grid_options: { columns: 6 }
  - type: grid
    cards:
      - type: heading
        heading: Kitchen
      - type: custom:miele-appliance-card
        entity: sensor.miele_steam_oven
      - type: custom:miele-appliance-card
        entity: sensor.miele_microwave_oven
      - type: custom:miele-appliance-card
        entity: sensor.miele_warming_drawer
  - type: grid
    cards:
      - type: heading
        heading: Coffee
      - type: custom:miele-appliance-card
        entity: sensor.miele_coffee_machine
```

Your own pictures instead of the drawings, and a custom ring colour:

```yaml
type: custom:miele-appliance-card
entity: sensor.miele_washing_machine
images: /local/miele/        # washer.svg, dryer.svg, steam_oven.svg, …
accent: "#7bb661"
```

### Options

| Option | What it does |
|---|---|
| `entity` | Any entity of the appliance, e.g. `sensor.miele_washing_machine`. Without it, the card takes the first Miele appliance it finds. (`device_id` also works.) |
| `name` | Card title. Default: the name you gave the device, else its type. |
| `finish` | Front colour: `lotus_white`, `obsidian_black`, `graphite_grey`, `brilliant_white`, `pearl_beige`, `clean_steel` or a hex colour. Default: lotus white for laundry, obsidian black for the kitchen. |
| `theme` | `dark` (default), `light`, `auto` (follows Home Assistant) or `ha` (Home Assistant's own card colours). |
| `animations` | `full` (default), `reduced` or `off`. Reduced motion in the operating system is respected. |
| `controls` | `false` hides the buttons, e.g. on a wall display. |
| `accent` | Ring and highlight colour. |
| `language` | `nl` or `en`. Default: Home Assistant's language. |
| `max_width` | Maximum width of the drawing, e.g. `380px`. |
| `drawing` | Another drawing: `washer`, `dryer`, `steam_oven`, `microwave`, `coffee`, `drawer` or `generic`. |
| `images` | A folder with your own drawings (`washer.svg`, `dryer.svg`, …), e.g. `/local/miele/`. |
| `entities` | Use another entity for a role, e.g. `{ remaining: sensor.my_remaining_time }`. |

## The programmes card

![Programmes card: washing machine, steam oven and oven with microwave](https://raw.githubusercontent.com/g-force-be/ha-miele-appliance-card/main/docs/images/programmes.png)

```yaml
type: custom:miele-programmes-card
entity: sensor.miele_washing_machine
```

Your favourite programmes appear as tiles, with *All programmes* under them. Tap one and the card asks once more before anything starts: *Start Cottons on the washing machine?* For ovens you first pick a temperature and, if you like, a cooking time. Without a time the oven runs until you stop it. Microwave programmes always need a time.

Your own favourites, in your order, for the steam oven:

```yaml
type: custom:miele-programmes-card
entity: sensor.miele_steam_oven
programs: [fan_plus, steam_cooking, sous_vide, conventional_heat]
```

Only the favourites, for the coffee machine:

```yaml
type: custom:miele-programmes-card
entity: sensor.miele_coffee_machine
programs: [long_coffee, cappuccino, herbal_tea, milk_foam]
show_all: false
```

| Option | What it does |
|---|---|
| `entity` | Any entity of the appliance. |
| `programs` | Favourites, by Home Assistant's programme key (`cottons`, `eco_40_60`, `fan_plus`, `long_coffee`, …) or by Miele's programme number. Default: a sensible set per appliance type. |
| `show_all` | `false` shows the favourites only. Default `true`. |
| `name`, `theme`, `accent`, `language` | As on the appliance card. |

**Remote start.** Miele only accepts a programme from outside while *Remote start* (MobileStart) is on at the appliance. Until then the card is greyed out and says what to do. The programme lists, as the Miele API gave them for real appliances:

| Appliance | Programme list | The card starts |
|---|---|---|
| Ovens, microwave | Always available, with each programme's temperature and time limits | with Remote start on; *Set up* without it |
| Coffee machine | Always available | with Remote start on; *Set up* without it |
| Washing machine, tumble dryer | Only while Remote start is on | with Remote start on |
| Warming drawer | Empty: the API offers nothing to start | never |

**Set up without Remote start.** Miele does take a programme from outside while Remote start is off: the oven or coffee machine then shows it and waits until you press Start on the appliance. So with Remote start off and the appliance switched on, the card offers **Set up** instead of **Start**. Washing machine and tumble dryer give no programme list without Remote start.

The card keeps the last list it received in your browser, so the tiles are there even when the appliance is off. Programmes start with the numbers the appliance itself reports, never with numbers from a table.

## The overview card

One card for all your Miele appliances. It finds them by itself and lays them out:

```yaml
type: custom:miele-overview-card
layout: rooms
```

| Layout | What you get |
|---|---|
| `rooms` | Per area: the washing machine and dryer side by side; the built-in appliances as one column (oven, oven with microwave, warming drawer, like the real wall) with the coffee machine next to it. Programmes folded under each appliance. |
| `grid` | All appliances in a grid. |
| `active` | Only the appliances that are on, the busiest first. |
| `phone` | One column with smaller drawings, the busiest first. |
| `display` | For a wall or kitchen screen: only what's on, no buttons, the time left in large type, and a calm clock when everything is off. |

Use it in a view of type *Panel*, or in a sections view in a section that spans the full width. With `appliances` you set the order, names, front colours, which programmes card shows and the favourites, or hide one:

```yaml
type: custom:miele-overview-card
layout: phone
theme: light
appliances:
  - entity: sensor.miele_washing_machine
    programs: [cottons, eco_40_60, quick_power_wash]
  - entity: sensor.miele_tumble_dryer
  - entity: sensor.miele_coffee_machine
    name: Coffee
  - entity: sensor.miele_warming_drawer
    show: false
```

Appliances not in the list follow in the suggested order, so a new appliance shows up by itself.

**Visual editors.** All three cards have one. The overview editor lists every appliance with its type number and drawing. You can show or hide it, move it up or down, and set its name, colours, programmes card and favourites. It also warns you:

- when the start, pause and stop buttons are switched off in Home Assistant, with a button to switch them on;
- when Remote start is off;
- when an appliance isn't connected.

*Suggest a layout* fills in the list. *Copy as separate cards* gives the same layout as plain appliance and programmes cards, in YAML, for a sections view you arrange yourself.

## Supported appliances

| Drawing | Modelled on | Used for |
|---|---|---|
| `washer` | W1 front loader (WEI 895) | washing machines, washer-dryers |
| `dryer` | T1 heat-pump dryer (TEF 775 WP) | tumble dryers |
| `steam_oven` | ArtLine compact steam oven (DGC 7845 X) | ovens, steam ovens, combi steam ovens |
| `microwave` | ArtLine oven with microwave (H 7440 BMX) | microwaves, ovens with microwave |
| `coffee` | CM 7750 CoffeeSelect | coffee machines |
| `drawer` | Warming drawer (ESW 7020) | warming drawers |
| `generic` | — | everything else (dishwasher, hob, hood, fridge, robot vacuum, …) |

The card picks the drawing by the appliance's model number; `drawing:` overrides it.

## Releases and versions

Versions follow the calendar: **year.week.number**, e.g. `2026.42.1` is the first release in ISO week 42 of 2026, and `2026.42.2` the second. A release is made from the Actions tab (*Release → Run workflow*). It runs the tests, builds the card with its version inside and publishes it, and HACS then offers it as an update. The browser console shows the version that is loaded: `MIELE-APPLIANCE-CARD 2026.42.1`.

## Development

Requires Node 20+. The dev harness replays real appliance cycles (`docs/fixtures.json`) and real programme lists (`dev/data/programs.json`) through a mock Home Assistant.

```sh
npm install
npm test               # model and programme tests (node:test)
npm run dev            # harness at http://127.0.0.1:5173/dev/cards.html
npm run shots -- m3    # Playwright screenshots in dev/screenshots/ (uses the installed Chrome)
npm run shots -- readme   # the pictures on this page
node tools/brand.mjs   # logo, banner and social preview from docs/images/logo.svg
```

## Credits

Based on [hOn Washer & Dryer Card](https://github.com/spikey1965/ha-hon-appliance-card) by My Media Build (MIT). The original card is kept unchanged in [`reference/`](reference/). See [`NOTICE`](NOTICE) for details.

## Disclaimer

Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. This project contains no Miele logo, wordmark or product photography; the appliance drawings are original artwork.

## Licence

MIT, see [`LICENSE`](LICENSE).
