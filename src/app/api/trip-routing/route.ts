import {plannerPlaces, placesById} from "@/data/planner";
import type {RoadRoute} from "@/lib/trip-planner";

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

  try {
    const upstream = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
      method: "POST",
      headers: {Authorization: apiKey, "Content-Type": "application/json"},
      body: JSON.stringify({coordinates: points, instructions: false}),
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if (!upstream.ok) return Response.json({error: "The routing provider could not calculate this route."}, {status: 502});

    const result = await upstream.json();
    const feature = result?.features?.[0];
    const seconds = feature?.properties?.summary?.duration;
    const coordinates = feature?.geometry?.coordinates;
    if (feature?.geometry?.type !== "LineString" || !Array.isArray(coordinates) || coordinates.length < 2 ||
        typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0 ||
        !coordinates.every(point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite))) {
      return Response.json({error: "The routing provider returned an incomplete route."}, {status: 502});
    }
    const route: RoadRoute = {minutes: seconds / 60, coordinates};
    return Response.json(route);
  } catch {
    return Response.json({error: "Road routing is temporarily unavailable."}, {status: 502});
  }
}
