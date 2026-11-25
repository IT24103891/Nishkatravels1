import {plannerPlaces, placesById} from "@/data/planner";
import type {RoadRoute} from "@/lib/trip-planner";

const cache = new Map<string, {route: RoadRoute; expires: number}>();
const pending = new Map<string, Promise<RouteResult>>();
const recentRequests: number[] = [];
const minute = 60_000;
const cacheHours = 6;
const maxCachedRoutes = 100;
const maxRequestsPerMinute = 20;
type RouteResult = {route: RoadRoute} | {error: string};

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY?.trim();
  if (!apiKey) return Response.json({error: "Road routing is not configured."}, {status: 503});

  // Only accept curated waypoint IDs and cap the request before contacting the provider.
  const body = await request.text();
  if (body.length > 1024) return Response.json({error: "Request is too large."}, {status: 413});
  let stops: unknown;
  try {
    stops = JSON.parse(body)?.stops;
  } catch {
    return Response.json({error: "Invalid request."}, {status: 400});
  }
  if (!Array.isArray(stops) || stops.length < 2 || stops.length > plannerPlaces.length + 1) {
    return Response.json({error: "Select at least two valid route stops."}, {status: 400});
  }
  const points = stops.map((id: unknown) => typeof id === "string" ? placesById.get(id)?.coordinates : undefined);
  if (points.some(point => !point)) return Response.json({error: "Unrecognized destination."}, {status: 400});

  const key = JSON.stringify(stops);
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expires > now) return Response.json(cached.route);
  if (cached) cache.delete(key);
  let lookup = pending.get(key);
  if (!lookup) {
    while (recentRequests.length && recentRequests[0] <= now - minute) recentRequests.shift();
    if (recentRequests.length >= maxRequestsPerMinute) {
      const retryAfter = Math.ceil((recentRequests[0] + minute - now) / 1000);
      return Response.json({error: "Road routing is temporarily unavailable."}, {
        status: 429, headers: {"Retry-After": String(retryAfter)},
      });
    }
    recentRequests.push(now);
    lookup = lookupRoute(points, apiKey).then(result => {
      if ("route" in result) {
        if (cache.size >= maxCachedRoutes) cache.delete(cache.keys().next().value!);
        cache.set(key, {route:result.route, expires:Date.now() + cacheHours * 60 * minute});
      }
      return result;
    }).finally(() => pending.delete(key));
    pending.set(key, lookup);
  }
  const result = await lookup;
  return "route" in result ? Response.json(result.route) : Response.json(result, {status: 502});
}

async function lookupRoute(points: ([number, number] | undefined)[], apiKey: string): Promise<RouteResult> {
  try {
    const upstream = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
      method: "POST",
      headers: {Authorization: apiKey, "Content-Type": "application/json"},
      body: JSON.stringify({coordinates: points, instructions: false}),
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if (!upstream.ok) return {error: "The routing provider could not calculate this route."};

    const result = await upstream.json();
    const feature = result?.features?.[0];
    const seconds = feature?.properties?.summary?.duration;
    const coordinates = feature?.geometry?.coordinates;
    if (feature?.geometry?.type !== "LineString" || !Array.isArray(coordinates) || coordinates.length < 2 ||
        typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0 ||
        !coordinates.every(point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite))) {
      return {error: "The routing provider returned an incomplete route."};
    }
    return {route: {minutes: seconds / 60, coordinates}};
  } catch {
    return {error: "Road routing is temporarily unavailable."};
  }
}
