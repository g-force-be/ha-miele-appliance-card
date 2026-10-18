// Time and number formatting in the user's locale and Home Assistant's time zone setting.
const pad = n => String(n).padStart(2, "0");

// 2:24:47 or 41:05
export function countdown(sec) {
  const s = Math.max(0, Math.round(sec)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
  return h ? `${h}:${pad(m)}:${pad(x)}` : `${m}:${pad(x)}`;
}

// 2:39, the way the appliance shows a programme's length
export function duration(sec) {
  const m = Math.round(sec / 60);
  return `${Math.floor(m / 60)}:${pad(m % 60)}`;
}

export function clockTime(ms, hass, lang) {
  const loc = hass?.locale ?? {};
  const opts = { hour: "2-digit", minute: "2-digit" };
  if (loc.time_zone === "server" && hass?.config?.time_zone) opts.timeZone = hass.config.time_zone;
  if (loc.time_format === "12") opts.hour12 = true;
  else if (loc.time_format === "24") opts.hour12 = false;
  try { return new Intl.DateTimeFormat(lang, opts).format(ms); } catch { return new Date(ms).toTimeString().slice(0, 5); }
}

export const temp = (v, unit = "°C") => `${Math.round(v)} ${unit}`;
