# Miele-toestelreeksen met wifi, 2021–2026 (onderzoek 18-10-2026)

Basis voor M5: tekeningen voor meer reeksen. Bronnen zijn vooral Miele's eigen productfiches (media.miele.com), plus retailers waar
nodig. Geen beelden bewaard. **(uncertain)** = niet bevestigd.

Afkortingen voor de bronnen (vervang *n* door het materiaalnummer):
FS-AT *n* = `https://media.miele.com/downloads/e-/at/FS_n_ATD_AT-de-AT.pdf`, FS-DE = `…/e-/de/FS_n_DED_DE-de-DE.pdf`,
FS-GB = `…/n-/gb/FS_n_GBE_GB-en-GB.pdf`, FS-IE = `…/n-/ie/FS_n_IEE_IE-en-IE.pdf`, FS-CE = `…/n-/ce/FS_n_OVE_OV-en-CE.pdf`,
FS-BE = `…/l-/be/FS_n_BEN_BE-nl-BE.pdf`, FS-CH = `…/e-/ch/FS_n_CHD_CH-de-CH.pdf`, FS-US = `…/n-/us/FS_n_USE_US-en-US.pdf`.

## Wat telt voor de kaarten

- **`model_id` is de `techType` van de API** (homeassistant/components/miele/entity.py). HA's eigen testdata toont `"WCI870"`,
  `"H7660BP"`, `"KS 28423 D ed/c"`, `"FNS 28463 E ed/"` (tests/components/miele/fixtures/4_devices.json). Geen WCS/WPS-achtervoegsel
  en meestal geen kleur: de kleur blijft via `finish`, de tekening via `model_id`.
- **Niet elk model heeft wifi.** Instapmodellen missen vaak Miele@home (W1 WCA032 WPS, WCB210 WCS, G 5210 C SCi, CM 5).
- **HA-docs** (home-assistant.io/integrations/miele): wasmachines, droogkasten, vaatwassers, ovens, kookplaten (alleen kijken),
  dampkappen (ventilator/licht), koelen/vriezen/wijn (climate), koffie, robotstofzuigers ("beperkt"). (Semi-)professioneel niet.
- **Miele-API v1.1.0** (developer.miele.com/docs/get-started): "in ontwikkeling" voor wasmachines WQ 1XXXX, droogkasten TQ 1XXXX
  (W2/T2 Nova), Guard L1, kookplaten KM8XXX, nieuwe DAD-dampkappen en nieuwe koelmodellen. **De nieuwste generaties komen
  waarschijnlijk nog niet in HA.**

## 1. Wasmachines (W1, 596 × 850 mm, lotuswit; laatje linksboven, display midden, draaiknop rechts, luikje linksonder)

| Reeks | Jaren | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|---|
| W1 met draaiknop | 2015–2025/26 | W + C/E/D (Chrome Edition) of S/W (White Edition) + niveau A…J (uncertain) + 3 cijfers: WCA032, WCB390, WSB363, WSG883, WEG375, WCI870 | Ronde deur: lotuswit; obsidiaanzwart met witte ring (WCB390 "125 Edition"); grafietgrijs PearlFinish. Knop lotuswit, of met chromen ring. Display: EasyControl geel, DirectSensor geel/wit 7-segment, ComfortSensor tekstregel | middensegment en hoger | FS-DE 12518820, 12518680, 12397110; FS-IE 12721250; FS-GB 12721190; FS-BE 11331920 |
| W1 M Touch | ~2018–2025 | WWV980 Passion, WWR860 (R/V, uncertain) | Geen knop, kleuren-touchstrook; deur alu-zilver met chromen ring | ja | miele.de/de/m/4628.htm |
| W2 Nova Edition | 2025– | WQ 1000/1200 WPS | Donkere glazen deur en glazen paneel (BlackEffect), M Touch Pro | ja, **API nog niet** | miele.de/product/12698680 |
| W2 Platinum/Gold/Silver | DE okt 2026– | WE770Q, WK770Q, WS770Q, WE720I, WK720I | Tweekleurige glazen deur met bijpassende knopring | **HA onzeker** | FS-DE 13060250, 13060230, 13060260, 13141750 |

## 2. Droogkasten (T1: W1-kast, deur links scharnierend)

| Reeks | Jaren | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|---|
| T1 met draaiknop | 2015–2026 | T + 2 letters + 3 cijfers + WP: TCL780WP, TWH780WP, TWF760WP | TCL780: grafietgrijze deur, recht paneel, ComfortSensor wit. TWH780: obsidiaanzwarte deur met ring, paneel 5° schuin, DirectSensor wit | ja | FS-AT 11819910, 11819590 |
| T1 M Touch | ~2019–2025 | TWV780WP, TWR780WP | Alu-zilveren deur, chromen ring, M Touch | ja | FS-AT 11820350 |
| T2 Nova / Silver / Gold | 2025– | TQ 1000 WP, TS100C, TK100C, TE100C | Glazen deur, M Touch Pro of EasyControl | **API nog niet** | zajadacz.de …TQ1000WP.pdf; FS-DE 13057820 |

## 3. Was-droogcombinaties (WT1)

| Reeks | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|
| WT1 met draaiknop | WTD16x | Zoals W1, DirectSensor | ja | miele.de |
| WT1 M Touch | WTR870, WTW870 WPM | Lotuswit, chromen deur, schuin paneel, M Touch, TwinDos | ja | FS-AT 11568210, 11568180 |

## 4. Vaatwassers (60 cm; SL = 45 cm)

SC = vrijstaand, SCi = half-geïntegreerd (zichtbaar bedieningspaneel), SCVi = volledig geïntegreerd (bediening op de bovenrand),
K2O = Knock2open, XXL = hoog, AutoDos = automatische dosering.

| Reeks | Jaren | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|---|
| G 7000 vrijstaand | 2018– | G 7110 SC Front AutoDos | CleanSteel front, paneel boven met knoppen en witte tekstregel | ja | FS-CE 11780620 |
| G 7000 half-geïntegreerd | 2018– | G 7100 C SCi, G 7200 SCi, G 7310 C SCi, G 7604 C SCi | Rechte paneelband CleanSteel of wit, witte tekstregel, softkeys; meubelfront eronder | meestal | FS-CE 11433380, 11432550, 12583370; FS-GB 11869830 |
| G 7000 volledig geïntegreerd | 2018– | G 71xx SCVi; G 79xx SCVi (K2O, XXL) | Alleen het meubelfront; bovenrand met tekstregel of M Touch Vi; topmodellen BrilliantLight, Knock2open | ja | FS-US 11947240; FS-GB 12424010; FS-CE 12583480; FS-IE 11870320 |
| G 5000 SL (45 cm) | 2020– | G 5xxx SCVi SL | eerste koppelbare 45 cm | ja | miele.de presse 2020-047 |
| G 5000 (60 cm) | ~2016– | G 5110 SC, G 5210 C SCi | geel 7-segment | meestal niet | FS-GB 12153210; FS-CE 11690740 |
| G8 Diamond | 2027 | G8… | camera in de deur, touchdisplay | HA onbekend | yankodesign.com 2026/09/02 |

## 5. Ovens 60 cm (Generatie 7000, 2019–2026)

H 7 + klasse + nis (6 = 60 cm, 4 = 45 cm) + variant, dan B (oven), P (pyrolyse), X (ArtLine, grepeloos), M (microgolf).
H 71x4/72x4 DirectSensor S, H 74xx DirectSensor, H 76xx M Touch S, H 78xx M Touch (H 7860 met camera).
Ontwerplijn: **PureLine** (zwart glas, inox greep), **VitroLine** (volledig glas OBSW/BRWS/GRGR, greep in glaskleur),
**ArtLine** (X, grepeloos, Touch2Open; mat zwart sinds 2023/24), **ContourLine** (inox kader, bv. H 7164 BP).
Front 595 × 596 mm: bedieningsband boven met display midden, deurglas eronder, greep bovenaan de deur (niet bij ArtLine).

| Reeks | Typenummers | Wifi | Bron |
|---|---|---|---|
| PureLine | H 7464 BP CLST | ja | FS-AT 11105730 |
| VitroLine | H 7464 BP OBSW, H 7860 BP GRGR, H 7660 BP, H 7264 B | ja | FS-AT 11105710, 11106060, 11105860, 11104190 |
| ArtLine | H 7464 BPX, H 7860 BPX | ja | FS-AT 11105780; FS-GB 12305080 |
| ContourLine | H 7164 BP | ja | FS-AT 11104050 |
| H 2000 Active | H 2465 BP, H 2861 B (draaiknoppen + tekstdisplay) | ja | FS-AT 12144190, 12144500 |

Geen nieuwe ovengeneratie in 2024–2026.

## 6. Compact 45 cm en speciale ovens

DG = stoomoven, DGC = combi-stoomoven, DGM = stoomoven met microgolf, H …BM = oven met microgolf, X = grepeloos.

| Reeks | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|
| Combi-stoom Gen 7000 | DGC 7440 HC Pro (VitroLine), DGC 7440 HCX Pro (ArtLine) | DirectSensor; **gemotoriseerd bedieningspaneel dat opklapt** over het waterreservoir; BrilliantLight | ja | FS-AT 12099670, 12099940, 12305520 |
| Oven met microgolf | H 7440 BM (DirectSensor), H 7840 BM (M Touch) | VitroLine OBSW | ja | FS-AT 11104330, 11105940 |
| Dialog-oven | DO 7860 | Obsidiaanzwart, M Touch (het verlichte "M Chef"-logo weglaten) | ja | FS-GB 11108000 |

## 7. Koffie

| Reeks | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|
| CM 6 MilkPerfection | CM 6160/6360/6560 | ~25 cm breed, DirectSensor; obsidiaanzwart met CleanSteel, mat zwart, lotuswit, grafietgrijs, brons | 6360/6560 ja | FS-DE 11594940, 12531200 |
| CM 7 | CM 7350/7550/7750 | 311 mm breed, 397 mm (7550) of 420 mm hoog (7750); CM Touch-kleurendisplay | ja | FS-DE 10947410, 10947420, 12531140 |
| CVA 7000 inbouw | CVA 7845, CVA 7440/7840 | 45 cm nis; 7845: M Touch, verborgen deurgreep, verlichte zetgroep | ja | FS-DE 11164150 |
| CM 5 | CM 5310/5510/5710 | — | **geen wifi** | coffeeness.de |

## 8. Kookplaten (FR = inox kader, FL = kaderloos)

| Reeks | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|
| KM 7000 inductie | KM 7464 FR/FL, KM 7684 FL, KM 7897 FL | Zwart glaskeramiek; vooraan ComfortSelect (gele cijferrij) of SmartSelect (geel/wit) | ja; HA alleen kijken | FS-DE 11022890, 11022920; FS-AT 11128780 |
| KMDA (met afzuiging) | KMDA 7272 FR, KMDA 7473 FR | 780 mm, afzuigrooster in het midden | 7473 ja | FS-AT 12183180, 12904800, 12120710 |
| KM 8000 | KM 8xxx | DiamondFinish/MattFinish, LightLine | **API nog niet** | miele.de/de/m/…-7907.htm |

## 9. Dampkappen

| Reeks | Model | Uitzicht | Wifi | Bron |
|---|---|---|---|---|
| Puristic Plus (wand) | DA 4228 W | Inox, 1198 mm breed, 62 mm dun | ja | FS-AT 10749560 |
| Puristic (wand) | DA 6698 W | Inox, touch op glas | ja | FS-AT 10749650 |
| Aura 4.0 Ambient (eiland) | DA 7378 D | Witte "lamp", gemotoriseerde lamellen, gekleurd licht | ja | zajadacz.de …DA7378D.pdf |
| Plafondunit | DA 2808 | Wit of inox | ja | FS-GB 10851410 |

## 10. Koelen en vriezen

| Reeks | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|
| Inbouw K 7000 | K/KF/KFN/F/FNS 7xxx, bv. KFN 7774 D | Achter een meubeldeur: teken een kastdeur | ja | FS-AT 13078160 |
| Vrijstaand 4000 | KFN 47xx, KS 47xx, FNS 47xx/48xx | 597 × 2015 mm; CleanSteel met greep, of mat zwart Click2open | ja | FS-AT 12361950, 12361960 |
| Ouder vrijstaand | KS 28423 D, FNS 28463 E | Eéndeurs, ~185 cm (uncertain) | ja | HA-testdata |

## 11. Wijn

| Reeks | Typenummers | Uitzicht | Wifi | Bron |
|---|---|---|---|---|
| Vrijstaand | KWT 6834 SGS | 700 × 1920 mm, inox, getint glas, drie zones | ja | FS-CH 95268650 |
| Inbouw | KWT 6112/6422 iG, 6722 iGS, 6322 UG | Glazen deur in de nis | soms met XKS 3130 W-stick | retailer |

## 12. Warmhoudlades (Generatie 7000)

ESW 7010 (14 cm), ESW 7020 (29 cm) zwart/mat/grafiet; ESW 7110/7120 CleanSteel (ContourLine). Grepeloos, Push2open,
sensorstrook met symbolen. Wifi ja. FS-AT 11103100, 12305270, 11103160.

## 13. Robotstofzuigers

| Reeks | Uitzicht | Wifi | Bron |
|---|---|---|---|
| Scout RX2 (Home Vision) | grafietgrijs, twee zijborstels | ja | homeandsmart.de |
| Scout RX3 (2021–) | 34 × 33,5 × 8,5 cm, bijna rond; obsidiaanzwart, Runner brons, Home Vision HD roségoud met twee camera-"ogen" en touchdisplay | ja, beperkt in HA | miele.de …5680.htm |

## Kleurcodes

Wasgoed: LW lotuswit. Keuken: OBSW obsidiaanzwart (ook mat), GRGR grafietgrijs, BRWS briljantwit, CLST CleanSteel,
BST BlackSteel, "ed/cs" bij koelkasten.
