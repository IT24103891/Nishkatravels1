import {defaultRide, isRideId, rides, type RideId} from "@/data/vehicles";
import {englishCopy} from "@/i18n/enquiry";
import {formatDate, formatUsd} from "@/i18n/format";
import type {Copy} from "@/i18n/copy";
import {tripGroups, tripStyles, type TripPreferences} from "./itinerary-assistant";
import {
  accommodationOptions, maxBudgetInput, maxTravelers, maxTripDays, placesById, sampleRates,
} from "@/data/planner";

export type Accommodation = keyof typeof accommodationOptions;
export type TripRates = typeof sampleRates & {transport: number};
export type TripDraft = {
  preferences?: TripPreferences;
  days: string[][];
  activeDay: number;
  startDate: string;
  travelers: number;
  accommodation: Accommodation;
  vehicle: RideId;
  luggage: number | null;
  transportOverrides: Partial<Record<RideId, number>>;
  rates: typeof sampleRates;
  target: number;
};

export const draftStorageKey = "nishaka.trip-planner.v1";
export const starterDraft: TripDraft = {
  days: [[], [], [], [], []],
  activeDay: 0,
  startDate: "",
  travelers: 2,
  accommodation: "midrange",
  vehicle: defaultRide,
  luggage: null,
  transportOverrides: {},
  rates: sampleRates,
  target: 0,
};

export function boundedNumber(value: unknown, fallback: number, min: number, max: number, integer = true) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  const bounded = Math.min(max, Math.max(min, value));
  return integer ? Math.trunc(bounded) : Math.round(bounded * 100) / 100;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : "";
}

export function restoreDraft(raw: string | null): TripDraft {
  if (!raw) return starterDraft;
  try {
    const saved: unknown = JSON.parse(raw);
    if (!isRecord(saved)) return starterDraft;
    const days = Array.isArray(saved.days) && saved.days.length
      ? saved.days.slice(0, maxTripDays).map(day => Array.isArray(day)
        ? [...new Set(day.filter((id): id is string => typeof id === "string" && placesById.has(id)))]
        : [])
      : starterDraft.days;
    const rates = isRecord(saved.rates) ? saved.rates : {};
    const overrides = isRecord(saved.transportOverrides) ? saved.transportOverrides : {};
    const vehicle = isRideId(saved.vehicle) ? saved.vehicle : defaultRide;
    const transportOverrides: TripDraft["transportOverrides"] = {};
    // Older drafts used a single van transport rate. Preserve their edited value.
    const vanRate = overrides.van ?? (rates.transport !== 80 ? rates.transport : undefined);
    if (typeof vanRate === "number" && Number.isFinite(vanRate)) transportOverrides.van = boundedNumber(vanRate, 0, 0, maxBudgetInput, false);
    if (typeof overrides.car === "number" && Number.isFinite(overrides.car)) transportOverrides.car = boundedNumber(overrides.car, 0, 0, maxBudgetInput, false);
    const prefs = isRecord(saved.preferences) ? saved.preferences : {};
    const style = tripStyles.find(value => value === prefs.style);
    const group = tripGroups.find(value => value === prefs.group);
    return {
      days,
      preferences: style && group ? {style, group, duration:boundedNumber(prefs.duration, days.length, 1, maxTripDays)} : undefined,
      activeDay: boundedNumber(saved.activeDay, 0, 0, days.length - 1),
      startDate: readDate(saved.startDate),
      travelers: boundedNumber(saved.travelers, starterDraft.travelers, 1, maxTravelers),
      accommodation: saved.accommodation === "budget" || saved.accommodation === "premium" ? saved.accommodation : "midrange",
      vehicle,
      luggage: typeof saved.luggage === "number" && Number.isFinite(saved.luggage) ? boundedNumber(saved.luggage, 0, 0, 200) : null,
      transportOverrides,
      rates: {
        accommodation: boundedNumber(rates.accommodation, sampleRates.accommodation, 0, maxBudgetInput, false),
        food: boundedNumber(rates.food, sampleRates.food, 0, maxBudgetInput, false),
        activities: boundedNumber(rates.activities, sampleRates.activities, 0, maxBudgetInput, false),
      },
      target: boundedNumber(saved.target, 0, 0, maxBudgetInput, false),
    };
  } catch {
    return starterDraft;
  }
}

export function resizeItinerary(days: string[][], count: number) {
  if (count >= days.length) return [...days, ...Array.from({length: count - days.length}, () => [])];
  return [...days.slice(0, count - 1), [...new Set(days.slice(count - 1).flat())]];
}

export function routeStops(days: string[][], dayIndex: number) {
  const current = days[dayIndex];
  if (!current.length) return [];
  const previous = days.slice(0, dayIndex).findLast(day => day.length)?.at(-1);
  return previous && previous !== current[0] ? [previous, ...current] : current;
}

export type RoadRoute = {
  minutes: number;
  coordinates: [number, number][];
};

export function transportRate(draft: TripDraft) {
  return draft.transportOverrides[draft.vehicle] ?? rides[draft.vehicle].sampleDailyRateUsd;
}

export function rideSuitability(draft: TripDraft) {
  const {verifiedPassengerCapacity: passengers, verifiedLuggageCapacity: luggage} = rides[draft.vehicle];
  return {
    passengerLimit: passengers, luggageLimit: luggage,
    tooManyPassengers: passengers !== null && draft.travelers > passengers,
    tooMuchLuggage: luggage !== null && draft.luggage !== null && draft.luggage > luggage,
  };
}

export function tripEstimate(draft: TripDraft) {
  const {days, travelers, rates} = draft;
  const rooms = Math.ceil(travelers / 2);
  const nights = days.length - 1;
  const costs: TripRates = {
    transport: transportRate(draft) * days.length,
    accommodation: rates.accommodation * rooms * nights,
    food: rates.food * days.length * travelers,
    activities: rates.activities * days.length * travelers,
  };
  const total = Math.round(Object.values(costs).reduce((sum, cost) => sum + cost, 0) * 100) / 100;
  return {rooms, nights, costs, total, perTraveler: total / travelers};
}

export function tripDates(draft: TripDraft, locale = "en", copy: Copy = englishCopy) {
  const start = readDate(draft.startDate);
  if (!start) return copy("Flexible / to be confirmed");
  const end = new Date(start + "T00:00:00Z");
  end.setUTCDate(end.getUTCDate() + draft.days.length - 1);
  return copy("{start} to {end}", {start: formatDate(start, locale), end: formatDate(end.toISOString().split("T")[0], locale)});
}

export function enquiryMessage(draft: TripDraft, copy: Copy = englishCopy, locale = "en") {
  const {total, perTraveler} = tripEstimate(draft);
  const place = (id: string) => copy(placesById.get(id)?.name ?? id);
  const names = (items: string[]) => items.map(place).join(" → ");
  const destinations = new Intl.ListFormat(locale).format([...new Set(draft.days.flat())].map(place));
  return [
    copy("Hello Nishaka, I’d like to enquire about a private Sri Lanka trip."),
    "",
    copy("Travel dates: {value}", {value: tripDates(draft, locale, copy)}),
    copy("Trip length: {days, number} days", {days: draft.days.length}),
    copy("Travelers: {count, number}", {count: draft.travelers}),
    copy("Vehicle: {vehicle}", {vehicle: copy(rides[draft.vehicle].name)}),
    ...(draft.luggage === null ? [] : [copy("Standard suitcases: {count, number}", {count: draft.luggage})]),
    copy("Destinations: {value}", {value: destinations || copy("Open to suggestions")}),
    copy("Accommodation: {value}", {value: copy(accommodationOptions[draft.accommodation].label)}),
    copy("Planning estimate: {total} total / {person} per traveler (sample rates)", {total: formatUsd(total, locale), person: formatUsd(perTraveler, locale)}),
    ...(draft.target ? [copy("Group budget target: {value}", {value: formatUsd(draft.target, locale)})] : []),
    "",
    copy("Suggested itinerary"),
    ...draft.days.map((day, index) => copy("Day {day, number}: {places}", {day: index + 1, places: names(day) || copy("Open / flexible")})),
    "",
    copy("Could you advise on the route, availability and a quote? Thank you!"),
  ].join("\n");
}
