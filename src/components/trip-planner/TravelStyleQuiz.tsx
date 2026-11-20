"use client";

import {useState} from "react";
import {Sparkles} from "lucide-react";
import {useCopy} from "@/i18n/copy";
import {maxTripDays} from "@/data/planner";
import {recommendStops, tripGroups, tripStyles, type TripPreferences} from "@/lib/itinerary-assistant";

export function TravelStyleQuiz({saved, days, onBuild}: {
  saved?: TripPreferences; days:number; onBuild:(preferences:TripPreferences) => void;
}) {
  const copy = useCopy();
  const [style,setStyle] = useState<TripPreferences["style"]>(saved?.style ?? "Mixed");
  const [group,setGroup] = useState<TripPreferences["group"]>(saved?.group ?? "Couple");
  const [length,setLength] = useState(String(saved?.duration ?? days));
  const [built,setBuilt] = useState("");
  const duration = Number(length);
  const valid = Number.isInteger(duration) && duration >= 1 && duration <= maxTripDays;
  const preferences = {style, group, duration};
  const answerKey = JSON.stringify(preferences);
  const recommendations = valid ? recommendStops(preferences) : [];

  return <details className="planner-panel planner-advice" id="planner-quiz">
    <summary><Sparkles size={20} aria-hidden="true" /> {copy("Travel style quiz")}</summary>
    <p>{copy("Optional: pick your interests and who’s coming to find stops for your trip.")}</p>
    <div className="planner-quiz-fields">
      <label>{copy("Travel style")}<select value={style} onChange={event => {
        const value = tripStyles.find(item => item === event.target.value);
        if (value) setStyle(value);
      }}>{tripStyles.map(value => <option key={value} value={value}>{copy(value)}</option>)}</select></label>
      <label>{copy("Trip duration")}<input type="number" min={1} max={maxTripDays} value={length}
        aria-invalid={!valid} onChange={event => setLength(event.target.value)} /></label>
      <label>{copy("Travel group")}<select value={group} onChange={event => {
        const value = tripGroups.find(item => item === event.target.value);
        if (value) setGroup(value);
      }}>{tripGroups.map(value => <option key={value} value={value}>{copy(value)}</option>)}</select></label>
    </div>
    {!valid && <p role="status">{copy("Choose a trip length from 1 to {max, number} days.", {max:maxTripDays})}</p>}
    {valid && <>
      {group === "Family" && <p>{copy("The family suggestions leave more open time between stops.")}</p>}
      <ul className="planner-recommendations">{recommendations.map(place => <li key={place.id}>
        <strong>{copy(place.name)}</strong>
        <p>{copy("Explore {attraction}.", {attraction:copy(place.attraction)})}</p>
      </li>)}</ul>
      <p className="planner-note">{copy("Recommended stops will be added to your draft. Existing stops and trip settings are kept.")}</p>
      <button type="button" className="button button-dark" onClick={() => {
        onBuild(preferences);
        setBuilt(answerKey);
      }}>{copy("Build This Trip")}</button>
      <p role="status">{built === answerKey && copy("Recommendations added to your draft.")}</p>
    </>}
  </details>;
}
