import {defaultSolarDay, minutesPerDay, sigiriya} from "@/data/hero-atmosphere";

type SunTimes = {sunrise: Date | null; sunset: Date | null};
export type SolarCalculator = (date: Date) => SunTimes;
export type SolarDay = typeof defaultSolarDay;

const minute = 60_000;
const wrap = (value: number) => (value % minutesPerDay + minutesPerDay) % minutesPerDay;

export function colomboMinutes(date: Date) {
  return wrap(date.getTime() / minute + sigiriya.utcOffsetMinutes);
}

export function sigiriyaSolarDay(date: Date, calculate?: SolarCalculator): SolarDay {
  try {
    const times = calculate?.(date);
    const sunrise = times?.sunrise ? colomboMinutes(times.sunrise) : NaN;
    const sunset = times?.sunset ? colomboMinutes(times.sunset) : NaN;
    if (Number.isFinite(sunrise) && sunset > sunrise && sunset < minutesPerDay) return {sunrise, sunset};
  } catch {
    // Keep the scene aligned to the Colombo clock if solar calculations are unavailable.
  }
  return defaultSolarDay;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
function smooth(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function skyAt(minute: number, {sunrise, sunset}: SolarDay) {
  const light = smooth(sunrise - 65, sunrise + 55, minute) * (1 - smooth(sunset - 55, sunset + 65, minute));
  const dawn = smooth(sunrise - 100, sunrise - 15, minute) * (1 - smooth(sunrise + 10, sunrise + 125, minute));
  const dusk = smooth(sunset - 125, sunset - 10, minute) * (1 - smooth(sunset + 15, sunset + 100, minute));
  const sun = clamp((minute - sunrise + 12) / (sunset - sunrise + 24));
  const nightMinute = wrap(minute - sunset);
  const nightLength = minutesPerDay - sunset + sunrise;
  const moon = clamp(nightMinute / nightLength);
  return {
    day: light,
    dawn,
    dusk,
    night: 1 - light,
    stars: (1 - light) * (1 - Math.max(dawn, dusk)),
    sunX: 88 - 68 * sun,
    sunY: 68 - 33 * Math.sin(sun * Math.PI),
    sunOpacity: smooth(sunrise - 12, sunrise + 24, minute) * (1 - smooth(sunset - 24, sunset + 12, minute)),
    moonX: 88 - 68 * moon,
    moonY: 68 - 33 * Math.sin(moon * Math.PI),
    moonOpacity: smooth(5, 70, nightMinute) * (1 - smooth(nightLength - 70, nightLength - 5, nightMinute)),
  };
}
