"use client";

import {useState} from "react";
import {Route} from "lucide-react";
import {placesById} from "@/data/planner";
import {useCopy} from "@/i18n/copy";
import {reviewItinerary, type ItineraryChange} from "@/lib/itinerary-assistant";

const warning = {
  busy:"This day looks busy. Leave room for visits, meals and breaks.",
  driving:"The road estimate is above the daily driving threshold. Consider splitting this day.",
  spread:"These stops are far apart on the map. Check the roads before committing to this day.",
};

export function ItineraryAssistant({days, roadMinutes, canCheck, checking, onCheck, onApply}: {
  days:string[][]; roadMinutes:(number | undefined)[]; canCheck:boolean; checking:boolean;
  onCheck:() => void; onApply:(change:ItineraryChange) => void;
}) {
  const copy = useCopy();
  const [dismissed,setDismissed] = useState(new Set<string>());
  const {issues,changes} = reviewItinerary(days,roadMinutes);
  const draftKey = JSON.stringify(days);
  const visible = changes.filter(change => !dismissed.has(draftKey + JSON.stringify(change)));
  const place = (id: string) => copy(placesById.get(id)?.name ?? id);

  function describe(change: ItineraryChange) {
    const day = change.day + 1;
    if (change.kind === "order") return copy("Day {day, number}: try this order to reduce backtracking on the map.", {day});
    if (change.kind === "move") return copy("Move {place} from day {day, number} to open day {to, number}.", {place:place(change.from),day,to:change.to+1});
    return copy("Day {day, number}: consider {nearby} instead of {place}.", {day, nearby:place(change.with),place:place(change.from)});
  }

  return <section className="planner-panel planner-advice" id="planner-assistant" aria-labelledby="assistant-title">
    <div className="planner-heading"><Route size={21} aria-hidden="true" /><div>
      <h2 id="assistant-title">{copy("Itinerary assistant")}</h2>
      <p>{copy("Review your pace and travel order before making changes.")}</p>
    </div></div>
    {!days.some(day => day.length) ? <p>{copy("Add a few stops to get itinerary suggestions.")}</p> : <>
      {issues.length ? <ul className="planner-advice-list">{issues.map(issue => <li key={issue.day + issue.kind}>
        <strong>{copy("Day {day, number}", {day:issue.day + 1})}</strong> {copy(warning[issue.kind])}
      </li>)}</ul> : <p>{copy("No crowded days or long transfers have been flagged so far.")}</p>}
      {visible.length > 0 && <>
        <p className="planner-note">{copy("Ordering suggestions use map locations. Road times may differ.")}</p>
        <ul className="planner-advice-list">{visible.map(change => {
          const key = draftKey + JSON.stringify(change);
          return <li key={key}>
            <p>{describe(change)}</p>
            {change.kind === "order" && <p>{change.stops.map(place).join(" → ")}</p>}
            <div className="planner-advice-actions">
              <button type="button" className="planner-chip" onClick={() => onApply(change)}>{copy("Accept suggestion")}</button>
              <button type="button" className="planner-chip" onClick={() => setDismissed(current => new Set([...current,key]))}>{copy("Dismiss")}</button>
            </div>
          </li>;
        })}</ul>
      </>}
      {(canCheck || checking) && <button type="button" className="planner-chip" disabled={checking} onClick={onCheck}>
        {copy(checking ? "Checking route…" : "Check remaining road routes")}
      </button>}
    </>}
  </section>;
}
