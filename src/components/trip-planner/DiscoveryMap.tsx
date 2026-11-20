"use client";

import {useRef, useState} from "react";
import {Compass, MapPin} from "lucide-react";
import {discoveryCategories, discoveryPlaces} from "@/data/discovery";
import {useCopy} from "@/i18n/copy";
import {DiscoveryCard} from "./DiscoveryCard";
import {PlannerMap, type PlannerMapProps} from "./PlannerMap";

type Props = Omit<PlannerMapProps, "discovery" | "onToggle"> & {
  onToggle: (id: string, day?: number) => void;
  days: string[][];
  activeDay: number;
  onSelectDay: (day: number) => void;
  routingEnabled: boolean;
};

export function DiscoveryMap({days, activeDay, onSelectDay, routingEnabled, ...map}: Props) {
  const copy = useCopy();
  const [quickEdit, setQuickEdit] = useState(false);
  const [category, setCategory] = useState<(typeof discoveryCategories)[number] | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const browse = useRef<HTMLSelectElement>(null);
  const visible = discoveryPlaces.filter(place => !category || place.categories.includes(category));
  const selected = visible.find(place => place.id === focusedId);

  return <section className="planner-panel planner-map-panel" id="planner-map" aria-labelledby="planner-map-title">
    <div className="discovery-heading">
      <div className="planner-heading">
        <Compass size={21} aria-hidden="true" />
        <div><h2 id="planner-map-title">{copy("Sri Lanka Discovery Map")}</h2>
          <p>{quickEdit ? copy("Pick markers to add or remove stops for day {day, number}.", {day:activeDay + 1})
            : copy("Choose a marker or destination to see what to explore and add it to your trip.")}</p></div>
      </div>
      <button type="button" className="planner-chip discovery-mode" aria-pressed={quickEdit}
        onClick={() => setQuickEdit(!quickEdit)}>{copy("Quick map editing")}</button>
    </div>
    <div className="discovery-toolbar">
      {!quickEdit && <div className="discovery-filters" role="group" aria-label={copy("Filter destinations")}>
        {[null, ...discoveryCategories].map(item => <button className="planner-chip" type="button" key={item ?? "all"}
          aria-pressed={category === item} onClick={() => {
            setCategory(item);
            if (item && !selected?.categories.includes(item)) setFocusedId(null);
          }}>{copy(item ?? "All destinations")}</button>)}
      </div>}
      <div className="discovery-selects">
        {!quickEdit && <label>{copy("Destination")}
          <select ref={browse} value={selected?.id ?? ""} onChange={event => setFocusedId(event.currentTarget.value || null)}>
            <option value="">{copy("Choose a destination")}</option>
            {visible.map(place => <option key={place.id} value={place.id}>{copy(place.name)}</option>)}
          </select>
        </label>}
        <label>{copy("Itinerary day")}
          <select value={activeDay} onChange={event => onSelectDay(Number(event.currentTarget.value))}>
            {days.map((_, index) => <option key={index} value={index}>{copy("Day {day, number}", {day:index + 1})}</option>)}
          </select>
        </label>
      </div>
    </div>
    <div className="discovery-layout" data-quick={quickEdit}>
      <PlannerMap {...map} onToggle={quickEdit ? map.onToggle : setFocusedId}
        discovery={quickEdit ? undefined : {visibleIds:new Set(visible.map(place => place.id)), focusedId}} />
      {!quickEdit && (selected ? <DiscoveryCard key={selected.id} place={selected}
        days={days.flatMap((day, index) => day.includes(selected.id) ? [index] : [])} itineraryDay={activeDay}
        onAdd={() => {
          if (!days.some(day => day.includes(selected.id))) map.onToggle(selected.id);
        }}
        onRemove={day => map.onToggle(selected.id, day)}
        onClose={() => {
          setFocusedId(null);
          browse.current?.focus();
        }} /> : <aside className="discovery-empty">
        <MapPin size={28} aria-hidden="true" />
        <p>{copy("Select a destination to see its highlights.")}</p>
      </aside>)}
    </div>
    <div className="planner-map-key"><span><i /> {copy("Available")}</span><span><i /> {copy("In itinerary")}</span>
      <span><i /> {copy(quickEdit ? "On selected day" : "Viewing destination")}</span></div>
    <p className="planner-note">{copy("Numbers show the first visit in your trip order.")} {routingEnabled
      ? copy("Road lines appear after you check a day’s route.") : copy("Road routes and driving times are currently unavailable.")}</p>
  </section>;
}
