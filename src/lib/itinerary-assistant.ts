import {discoveryCategories, discoveryPlaces} from "@/data/discovery";
import {drivingWarningMinutes, maxTripDays, placesById} from "@/data/planner";
import type {TripDraft} from "./trip-planner";

export const tripStyles = [...discoveryCategories, "Mixed"] as const;
export const tripGroups = ["Solo", "Couple", "Family", "Friends"] as const;
export type TripPreferences = {style: typeof tripStyles[number]; group: typeof tripGroups[number]; duration: number};

const styleRoutes: Record<TripPreferences["style"], string[]> = {
  Nature: ["kandy","nuwara-eliya","ella","yala","mirissa"],
  Beaches: ["galle","mirissa","bentota"],
  Culture: ["sigiriya","dambulla","kandy","galle","colombo"],
  Wildlife: ["yala","udawalawe"],
  Adventure: ["sigiriya","ella","yala","mirissa"],
  Mixed: ["sigiriya","kandy","ella","galle","mirissa"],
};
const groupStartingPoints: Partial<Record<TripPreferences["group"], Partial<Record<TripPreferences["style"], string>>>> = {
  Solo: {Culture:"dambulla", Mixed:"kandy"},
  Couple: {Beaches:"mirissa", Nature:"nuwara-eliya"},
  Family: {Wildlife:"udawalawe", Adventure:"ella"},
  Friends: {Adventure:"ella", Mixed:"ella"},
};

export function recommendStops({style, group, duration}: TripPreferences) {
  const count = Math.min(group === "Family" ? Math.ceil(duration / 2) : duration, duration >= 7 ? 5 : 3);
  const curated = styleRoutes[style];
  const start = groupStartingPoints[group]?.[style] ?? curated[0];
  const ranked = [start, ...curated.filter(id => id !== start)];
  const ids = style === "Mixed" && count === 2 ? [start, "galle"] : ranked.slice(0, count);
  return ids.map(id => {
    const place = placesById.get(id)!;
    const story = discoveryPlaces.find(destination => destination.id === id);
    const attraction = story?.attractions[id === "yala" ? 1 : 0] ?? ({
      bentota: "Bentota Beach",
      udawalawe: "Udawalawe National Park",
    } as Record<string, string>)[id];
    return {...place, attraction};
  });
}

export function buildQuizTrip(draft: TripDraft, preferences: TripPreferences): TripDraft {
  const requested = Math.max(1, Math.min(maxTripDays, preferences.duration));
  const kept = draft.days.findLastIndex(day => day.length) + 1;
  const days = Array.from({length:Math.max(requested, kept)}, (_, index) => [...(draft.days[index] ?? [])]);
  const saved = new Set(days.flat());
  const recommendations = recommendStops(preferences).filter(place => !saved.has(place.id));
  for (const [index, place] of recommendations.entries()) {
    const preferredDay = Math.floor(index * requested / recommendations.length);
    // Preserve existing stop order and use free days before adding to busy days.
    const candidates = days.slice(0, requested).map((day, dayIndex) => ({day, dayIndex}));
    candidates.sort((a,b) => a.day.length - b.day.length || Math.abs(a.dayIndex-preferredDay) - Math.abs(b.dayIndex-preferredDay));
    candidates[0].day.push(place.id);
  }
  return {...draft, days, activeDay:Math.min(draft.activeDay, days.length - 1), preferences};
}

const nearby: Record<string, string[]> = {
  sigiriya:["dambulla","polonnaruwa"], dambulla:["sigiriya","polonnaruwa"],
  kandy:["nuwara-eliya"], "nuwara-eliya":["kandy","ella"], ella:["nuwara-eliya"],
  yala:["udawalawe"], udawalawe:["yala"], mirissa:["galle"], galle:["mirissa","bentota"],
  colombo:["negombo"], negombo:["colombo"], bentota:["galle"],
};

function separation(first: string, second: string) {
  const [x1,y1] = placesById.get(first)!.coordinates;
  const [x2,y2] = placesById.get(second)!.coordinates;
  return Math.hypot(x1-x2, y1-y2);
}

function score(stops: string[], before?: string, after?: string) {
  const path = [...(before ? [before] : []), ...stops, ...(after ? [after] : [])];
  return path.slice(1).reduce((total, id, index) => total + separation(path[index], id), 0);
}

type Change =
  | {kind:"order"; day:number; stops:string[]}
  | {kind:"move"; day:number; to:number; from:string}
  | {kind:"replace"; day:number; from:string; with:string};
export type ItineraryChange = Change;

export function reviewItinerary(days: string[][], roadMinutes: (number | undefined)[]) {
  const issues: {day:number; kind:"busy" | "driving" | "spread"}[] = [];
  const changes: Change[] = [];
  const used = new Set(days.flat());

  days.forEach((stops, day) => {
    if (!stops.length) return;
    const previous = days.slice(0, day).findLast(items => items.length)?.at(-1);
    const next = days.slice(day + 1).find(items => items.length)?.[0];
    const road = roadMinutes[day];
    const busy = stops.length >= 4 ||
      stops.reduce((load, id) => load + (discoveryPlaces.find(place => place.id === id)?.visit === "Half a day" ? 1 : 2), 0) >= 5;
    const driving = road !== undefined && road > drivingWarningMinutes;
    const path = previous ? [previous, ...stops] : stops;
    const spread = road === undefined && path.slice(1).some((id, index) => separation(path[index], id) > 1.3);
    if (busy) issues.push({day, kind:"busy"});
    if (driving) issues.push({day, kind:"driving"});
    if (spread) issues.push({day, kind:"spread"});

    const original = score(stops, previous, next);
    let best = original;
    let order: string[] | undefined;
    for (let from = 0; from < stops.length - 1; from++) {
      for (let to = from + 1; to < stops.length; to++) {
        const candidate = [...stops.slice(0,from), ...stops.slice(from,to+1).reverse(), ...stops.slice(to+1)];
        const cost = score(candidate, previous, next);
        if (cost < best) { best = cost; order = candidate; }
      }
    }
    if (order && original - best > Math.max(.12, original * .12)) changes.push({kind:"order", day, stops:order});

    const openDay = [day + 1, day - 1].find(index => days[index]?.length === 0);
    if ((busy || driving) && stops.length > 1 && openDay !== undefined) {
      changes.push({kind:"move", day, to:openDay, from:openDay > day ? stops.at(-1)! : stops[0]});
    }
    if (driving || spread) {
      const longLeg = path.slice(1).map((id, index) => ({id, base:path[index], gap:separation(path[index], id)}))
        .sort((a,b) => b.gap-a.gap)[0];
      const replacement = longLeg && nearby[longLeg.base]?.find(id => !used.has(id) && separation(longLeg.base,id) < longLeg.gap);
      if (replacement) changes.push({kind:"replace", day, from:longLeg.id, with:replacement});
    }
  });
  return {issues, changes};
}

export function applyItineraryChange(days: string[][], change: ItineraryChange) {
  if (change.kind === "order") return days.map((stops,index) => index === change.day ? change.stops : stops);
  if (change.kind === "replace") return days.map((stops,index) => index === change.day
    ? stops.map(id => id === change.from ? change.with : id) : stops);
  return days.map((stops,index) => index === change.day ? stops.filter(id => id !== change.from)
    : index === change.to ? [...stops, change.from] : stops);
}
