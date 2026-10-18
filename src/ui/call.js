// A service call from a card. Resolves to null when Home Assistant accepted it, else to a readable message: the
// integration's own translated text when it has one (set_program_error, get_programs_error, …).
export async function callService(hass, domain, service, data) {
  try { await hass.callService(domain, service, data); return null; }
  catch (e) { return errorText(hass, e); }
}

export async function errorText(hass, e) {
  let msg = e?.message || String(e);
  if (e?.translation_key && e?.translation_domain) {
    const localize = await hass.loadBackendTranslation?.("exceptions", e.translation_domain);
    msg = localize?.(`component.${e.translation_domain}.exceptions.${e.translation_key}.message`, e.translation_placeholders) || msg;
  }
  return msg;
}
