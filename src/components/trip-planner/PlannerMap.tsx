"use client";

import {useLocale} from "next-intl";
import {useCopy, type Copy} from "@/i18n/copy";
import {useEffect, useMemo, useRef, useState, type CSSProperties} from "react";
import {LocateFixed, MapPin} from "lucide-react";
import type {GeoJSONSource, Map as MapLibreMap, Marker, StyleSpecification} from "maplibre-gl";
import {plannerPlaces} from "@/data/planner";
import outline from "@/data/planner-outline.json";
import type {RoadRoute} from "@/lib/trip-planner";

const customMapStyle = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim();
const mapStyle = customMapStyle || "https://tiles.openfreemap.org/styles/liberty";
const bounds: [[number, number], [number, number]] = [[79.45, 5.63], [82.1, 9.98]];
const project = ([lng, lat]: number[]) => [
  (lng - bounds[0][0]) / (bounds[1][0] - bounds[0][0]) * 100,
  (bounds[1][1] - lat) / (bounds[1][1] - bounds[0][1]) * 100,
];
const coastline = outline.coordinates.map(([ring]) => `polygon(${ring.map(point => project(point).map(v => v.toFixed(3) + "%").join(" ")).join(",")})`);

const overviewStyle: StyleSpecification = {
  version: 8,
  sources: {
    coastline: {type: "geojson", data: {
      type: "Feature", properties: {}, geometry: {type: "MultiPolygon", coordinates: outline.coordinates},
    }},
  },
  layers: [
    {id: "water", type: "background", paint: {"background-color": "#d9e8e5"}},
    {id: "island", type: "fill", source: "coastline", paint: {"fill-color": "#bacaa9", "fill-outline-color": "#819677"}},
  ],
};

export type PlannerMapProps = {
  order: Record<string, number>;
  activeStops: string[];
  onToggle: (id: string) => void;
  routes: RoadRoute[];
  activeRoute?: RoadRoute;
  discovery?: {visibleIds: ReadonlySet<string>; focusedId: string | null};
};

function FallbackRoutes({routes, activeRoute}: Pick<PlannerMapProps, "routes" | "activeRoute">) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, 500, 820);
    context.lineCap = "round";
    for (const route of routes) {
      context.beginPath();
      route.coordinates.forEach((point, index) => {
        const [x, y] = project(point);
        if (index === 0) context.moveTo(x * 5, y * 8.2);
        else context.lineTo(x * 5, y * 8.2);
      });
      context.lineWidth = route === activeRoute ? 6 : 3;
      context.strokeStyle = route === activeRoute ? "#96652a" : "#657d61";
      context.stroke();
    }
  }, [routes, activeRoute]);
  return <canvas ref={canvas} width={500} height={820} aria-hidden="true" />;
}

function markerLabel(copy: Copy, name: string, active: boolean, order: number | undefined) {
  const action = copy(active ? "Remove {place} from the selected day" : "Add {place} to the selected day", {place:copy(name)});
  return order ? action + " · " + copy("First visit #{order, number}", {order}) : action;
}

export function PlannerMap({order, activeStops, onToggle, routes, activeRoute, discovery}: PlannerMapProps) {
  const copy = useCopy();
  const locale = useLocale();
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const [status, setStatus] = useState<"loading" | "ready" | "overview" | "fallback">("loading");

  useEffect(() => {
    let disposed = false;
    let map: MapLibreMap | undefined;
    let markers: Marker[] = [];
    let didLoad = false;
    let localMap = false;

    function switchToOverview() {
      if (disposed || didLoad || localMap || !map) return;
      localMap = true;
      try {
        map.setStyle(overviewStyle, {diff: false});
      } catch {
        setStatus("fallback");
      }
    }

    const timeout = window.setTimeout(() => {
      if (didLoad || disposed) return;
      if (map && !localMap) {
        switchToOverview();
        window.setTimeout(() => {
          if (!disposed && !didLoad) setStatus("fallback");
        }, 3000);
      } else setStatus("fallback");
    }, 6500);

    void import("maplibre-gl").then(({Map, Marker, NavigationControl, AttributionControl, setWorkerUrl}) => {
      if (disposed || !container.current) return;
      // Resolve the worker as a Webpack asset so its URL matches the deployed bundle.
      setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);
      map = new Map({
        container: container.current, locale: {
          "AttributionControl.ToggleAttribution": copy("Toggle attribution"),
          "NavigationControl.ZoomIn": copy("Zoom in"),
          "NavigationControl.ZoomOut": copy("Zoom out"),
          "Map.Title": copy("Map"),
        }, style: mapStyle, bounds, fitBoundsOptions: {padding: 36, duration: 0},
        minZoom: 4, maxZoom: 12, scrollZoom: false, dragRotate: false, pitchWithRotate: false,
        touchPitch: false, attributionControl: false,
      });
      mapRef.current = map;
      map.touchZoomRotate.disableRotation();
      map.addControl(new NavigationControl({showCompass: false}), "top-right");
      function finishLoading() {
        if (disposed || !map || didLoad) return;
        didLoad = true;
        window.clearTimeout(timeout);
        map.addControl(new AttributionControl({compact: true, customAttribution: localMap
          ? copy("Outline from") + ' <a href="https://www.naturalearthdata.com/">Natural Earth</a>'
          : undefined}));
        map.addSource("planner-routes", {type: "geojson", data: {type: "FeatureCollection", features: []}});
        map.addLayer({id: "planner-roads", type: "line", source: "planner-routes", layout: {"line-join": "round", "line-cap": "round"},
          paint: {"line-color": ["case", ["get", "active"], "#996823", "#52736a"],
            "line-width": ["case", ["get", "active"], 4, 2], "line-opacity": 0.92}});
        const loadedMap = map;
        markers = plannerPlaces.map(place => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "planner-marker";
          button.dataset.place = place.id;
          button.title = place.name;
          buttons.current.set(place.id, button);
          return new Marker({element: button}).setLngLat(place.coordinates).addTo(loadedMap);
        });
        setStatus(localMap ? "overview" : "ready");
      }
      map.on("load", finishLoading);
      map.on("style.load", () => { if (localMap) finishLoading(); });
      map.on("error", () => {
        if (!didLoad) {
          if (localMap) setStatus("fallback");
          else switchToOverview();
        }
      });
    }).catch(() => {
      if (!disposed) setStatus("fallback");
    });

    const elements = buttons.current;
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      markers.forEach(marker => marker.remove());
      elements.clear();
      map?.remove();
      mapRef.current = null;
    };
  }, [copy]);

  useEffect(() => {
    if (status !== "ready" && status !== "overview") return;
    for (const {id, name} of plannerPlaces) {
      const button = buttons.current.get(id);
      if (!button) continue;
      const active = discovery ? discovery.focusedId === id : activeStops.includes(id);
      const selected = order[id];
      button.hidden = Boolean(discovery && !discovery.visibleIds.has(id));
      button.title = copy(name);
      button.dataset.selected = String(Boolean(selected));
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", discovery ? copy("Explore {place}", {place:copy(name)}) : markerLabel(copy, name, active, selected));
      button.textContent = selected ? number.format(selected) : "";
    }
    const source = mapRef.current?.getSource<GeoJSONSource>("planner-routes");
    source?.setData({
      type: "FeatureCollection",
      features: routes.map(route => ({
        type: "Feature",
        properties: {active: route === activeRoute},
        geometry: {type: "LineString", coordinates: route.coordinates},
      })),
    });
  }, [status, activeStops, order, routes, activeRoute, copy, number, discovery]);

  const mapReady = status === "ready" || status === "overview";
  return <div className="planner-map-frame" data-discovery={Boolean(discovery)}>
    <div ref={container} className="planner-map-gl" aria-label={copy("Interactive map of Sri Lanka")} inert={!mapReady} onClick={event => {
      if (!(event.target instanceof HTMLElement)) return;
      const id = event.target.closest<HTMLButtonElement>("[data-place]")?.dataset.place;
      if (id) onToggle(id);
    }} />
    {!mapReady && <div className="planner-map-fallback">
      <span className="planner-map-badge" role="status"><MapPin size={14} aria-hidden="true" /> {status === "loading" ? copy("Loading detailed map") : copy("Detailed map unavailable · Island overview")}</span>
      <div className="planner-outline">
        {coastline.map((shape, i) => <div key={i} className="planner-coastline" aria-hidden="true" style={{clipPath: shape}} />)}
        {routes.length > 0 && <FallbackRoutes routes={routes} activeRoute={activeRoute} />}
        {plannerPlaces.filter(({id}) => !discovery || discovery.visibleIds.has(id)).map(({id, name, coordinates}) => {
          const [x, y] = project(coordinates);
          const selected = order[id];
          const active = discovery ? discovery.focusedId === id : activeStops.includes(id);
          return <button type="button" className="planner-marker planner-marker-fallback" data-selected={Boolean(selected)} key={id}
            style={{"--x": x + "%", "--y": y + "%"} as CSSProperties} title={copy(name)}
            aria-label={discovery ? copy("Explore {place}", {place:copy(name)}) : markerLabel(copy, name, active, selected)}
            aria-pressed={active} onClick={() => onToggle(id)}>{selected ? number.format(selected) : ""}</button>;
        })}
      </div>
      <p className="planner-map-credit">{copy("Outline from")} <a href="https://www.naturalearthdata.com/">{copy("Natural Earth")}</a></p>
    </div>}
    {status === "overview" && <span className="planner-map-badge" role="status"><MapPin size={14} aria-hidden="true" /> {copy("Detailed map unavailable · Island overview")}</span>}
    {mapReady && <button type="button" className="planner-map-reset" aria-label={copy("Reset map to Sri Lanka")} title={copy("Reset map to Sri Lanka")} onClick={() => mapRef.current?.fitBounds(bounds, {padding: 36, duration: 0})}><LocateFixed size={18} aria-hidden="true" /></button>}
  </div>;
}
