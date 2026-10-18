// Miele Appliance Card for Home Assistant — https://github.com/g-force-be/ha-miele-appliance-card
// Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT.
// Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG.
import { MieleApplianceCard } from "./cards/appliance-card.js";
import { MieleProgrammesCard } from "./cards/programmes-card.js";

// set by build.mjs (the release workflow passes 2026.42.1 and so on); "dev" when src/ runs unbundled
export const VERSION = typeof __CARD_VERSION__ === "string" ? __CARD_VERSION__ : "dev";

// Each name is only registered if it's free, so a second copy (manual plus HACS) can't stop the page with an error.
const define = (tag, cls, name, description) => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
  window.customCards = window.customCards || [];
  if (!window.customCards.some(c => c.type === tag))
    window.customCards.push({ type: tag, name, description, preview: true, documentationURL: "https://github.com/g-force-be/ha-miele-appliance-card" });
};

define("miele-appliance-card", MieleApplianceCard, "Miele appliance", "A Miele appliance with a progress ring, its own display and controls");
define("miele-programmes-card", MieleProgrammesCard, "Miele programmes", "Start a programme on a Miele appliance, always after confirmation");

console.info(`%c MIELE-APPLIANCE-CARD %c ${VERSION} `, "color:#fff;background:#3b3f44;font-weight:600", "color:#3b3f44;background:#e4e6e9");
