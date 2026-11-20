"use client";

import {useCopy, type Copy} from "@/i18n/copy";
import {useFormatting} from "@/i18n/format";
import {bilingualEnquiry} from "@/i18n/enquiry";

import {useRef, useState, useSyncExternalStore} from "react";
import {ArrowDown, ArrowUp, CalendarDays, Check, MapPin, MessageCircle, Plus, Route, Trash2} from "lucide-react";
import {rides} from "@/data/vehicles";
import {RidePicker} from "./RidePicker";
import {drivingWarningMinutes, durationPresets, maxTravelers, maxTripDays, plannerPlaces, placesById} from "@/data/planner";
import {
  boundedNumber, draftStorageKey, enquiryMessage, resizeItinerary, restoreDraft, routeStops, starterDraft,
  tripDates, type RoadRoute, type TripDraft,
} from "@/lib/trip-planner";
import {whatsappUrl} from "@/lib/business";
import {BudgetPanel} from "./BudgetPanel";
import {DiscoveryMap} from "./DiscoveryMap";
import {ItineraryAssistant} from "./ItineraryAssistant";
import {TravelStyleQuiz} from "./TravelStyleQuiz";
import {applyItineraryChange, buildQuizTrip, type TripPreferences} from "@/lib/itinerary-assistant";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function TripPlannerEntry({routingEnabled}: {routingEnabled: boolean}) {
  const copy = useCopy();
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return hydrated
    ? <TripPlanner routingEnabled={routingEnabled} />
    : <div className="wrap planner-shell"><p className="planner-panel" id="planner-map" role="status">{copy("Loading your trip planner…")}</p></div>;
}

type RouteState = {status: "loading"} | {status: "error"; message: string} | {status: "ready"; route: RoadRoute};
const routeKey = (stops: string[]) => stops.join("|");

function formatDriveTime(minutes: number, copy: Copy) {
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const remainder = rounded % 60;
  return hours ? copy("{hours, number} hr {minutes, number} min", {hours, minutes:remainder}) : copy("{minutes, number} min", {minutes:rounded});
}

function TripPlanner({routingEnabled}: {routingEnabled: boolean}) {
  const {copy, locale, number} = useFormatting();
  const dayLabel = (day: number) => copy("Day {day, number}", {day});
  const [draft, setDraft] = useState(() => {
    try {
      return restoreDraft(localStorage.getItem(draftStorageKey));
    } catch {
      return starterDraft;
    }
  });
  const activeDay = draft.activeDay;
  const [custom, setCustom] = useState(!durationPresets.includes(draft.days.length));
  const [customDays, setCustomDays] = useState(String(draft.days.length));
  const [copyStatus, setCopyStatus] = useState("");
  const [place, setPlace] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const [routeStates, setRouteStates] = useState<Record<string, RouteState>>({});
  const inFlight = useRef(new Set<string>());
  const [checkingRoutes, setCheckingRoutes] = useState(false);

  const activeStops = draft.days[activeDay];
  const stopCount = draft.days.reduce((count, day) => count + day.length, 0);
  const order: Record<string, number> = {};
  draft.days.flat().forEach((id, index) => {order[id] ??= index + 1;});
  const dayRoutes = draft.days.map((_, index) => {
    const stops = routeStops(draft.days, index);
    const state = stops.length > 1 ? routeStates[routeKey(stops)] : undefined;
    return {stops, state};
  });
  const roads = dayRoutes.flatMap(({state}) => state?.status === "ready" ? [state.route] : []);
  const unchecked = dayRoutes.filter(({stops,state}) => stops.length > 1 && state?.status !== "ready" && state?.status !== "loading");
  const activeState = dayRoutes[activeDay].state;
  const message = bilingualEnquiry(locale, (t, language) => enquiryMessage(draft, t, language), copy);
  const link = whatsappUrl(message);

  async function copyMessage() {

    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus(copy("Itinerary copied."));
    } catch {
      setCopyStatus(copy("Copy is unavailable here. You can select the message in the preview."));
    }
  }

  function update(next: TripDraft) {
    setDraft(next);
    setCopyStatus("");
    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(next));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }

  function changeDuration(count: number) {
    const shortenedWithStops = draft.days.slice(count).some(day => day.length > 0);
    update({...draft, activeDay: Math.min(activeDay, count - 1), days: resizeItinerary(draft.days, count)});
    setFeedback(shortenedWithStops ? copy("Stops from removed days were moved to day {day, number}. Repeated stops were merged.", {day:count}) : "");
  }

  function togglePlace(id: string, dayIndex = activeDay) {
    const day = draft.days[dayIndex];
    const exists = day.includes(id);
    const next = exists ? day.filter(stop => stop !== id) : [...day, id];
    update({...draft, days: draft.days.map((stops, index) => index === dayIndex ? next : stops)});
    setFeedback(copy(exists ? "{place} removed from day {day, number}." : "{place} added to day {day, number}.", {place:copy(placesById.get(id)?.name ?? id), day:dayIndex + 1}));
  }

  function reorder(dayIndex: number, stopIndex: number, offset: number) {
    const day = [...draft.days[dayIndex]];
    const target = stopIndex + offset;
    const id = day[stopIndex];
    [day[stopIndex], day[target]] = [day[target], id];
    update({...draft, days: draft.days.map((stops, index) => index === dayIndex ? day : stops)});
    setFeedback(copy("{place} moved to stop {stop, number} on day {day, number}.", {place:copy(placesById.get(id)?.name ?? id), stop:target + 1, day:dayIndex + 1}));
  }

  function moveToDay(id: string, from: number, to: number) {
    if (from === to || draft.days[to].includes(id)) return;
    update({...draft, days: draft.days.map((day, index) => index === from ? day.filter(stop => stop !== id) : index === to ? [...day, id] : day)});
    setFeedback(copy("{place} moved to day {day, number}.", {place:copy(placesById.get(id)?.name ?? id), day:to + 1}));
  }

  async function checkRoute(stops: string[]) {
    const key = routeKey(stops);
    if (inFlight.current.has(key)) return;
    inFlight.current.add(key);
    setRouteStates(current => ({...current, [key]: {status: "loading"}}));
    let result: RouteState;
    try {
      const response = await fetch("/api/trip-routing", {
        method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({stops}),
      });
      const data = await response.json();
      result = response.ok ? {status: "ready", route: data} : {status: "error", message: data.error ?? "Route unavailable."};
    } catch {
      result = {status: "error", message: "Route unavailable. Please try again."};
    }
    inFlight.current.delete(key);
    setRouteStates(current => ({...current, [key]: result}));
  }

  async function checkRemainingRoutes() {
    setCheckingRoutes(true);
    try {
      const routes = new Map(unchecked.map(({stops}) => [routeKey(stops),stops]));
      for (const stops of routes.values()) await checkRoute(stops);
    } finally {
      setCheckingRoutes(false);
    }
  }

  function applyQuiz(preferences: TripPreferences) {
    const next = buildQuizTrip(draft, preferences);
    update(next);
    setCustom(!durationPresets.includes(next.days.length));
    setCustomDays(String(next.days.length));
    setFeedback("");
  }

  return <div className="wrap planner-shell">
    <nav className="planner-jumps" aria-label={copy("Planner sections")}>
      <a href="#planner-map">{copy("Map & trip settings")}</a><a href="#planner-quiz">{copy("Travel style quiz")}</a><a href="#planner-itinerary">{copy("Itinerary")}</a><a href="#planner-budget">{copy("Budget estimate")}</a><a href="#planner-enquiry">{copy("Enquiry")}</a>
    </nav>
    <TravelStyleQuiz saved={draft.preferences} days={draft.days.length} onBuild={applyQuiz} />
    <div className="planner-top">
      <DiscoveryMap days={draft.days} activeDay={activeDay} onSelectDay={day => update({...draft, activeDay:day})}
        order={order} activeStops={activeStops} onToggle={togglePlace} routes={roads} routingEnabled={routingEnabled}
        activeRoute={activeState?.status === "ready" ? activeState.route : undefined} />

      <section className="planner-panel planner-settings" aria-labelledby="settings-title">
        <div className="planner-heading">
          <CalendarDays size={21} aria-hidden="true" />
          <div><h2 id="settings-title">{copy("Trip settings")}</h2><p>{copy("{days, number} days · {travelers, number} travelers · {stops, number} stops", {days:draft.days.length, travelers:draft.travelers, stops:stopCount})}</p></div>
        </div>
        <fieldset className="planner-duration">
          <legend>{copy("Trip duration")}</legend>
          <div>{durationPresets.map(days => <button type="button" className="planner-chip" aria-pressed={!custom && draft.days.length === days} key={days} onClick={() => {
            setCustom(false);
            changeDuration(days);
          }}>{copy("{days, number} days", {days})}</button>)}
          <button type="button" className="planner-chip" aria-pressed={custom} onClick={() => {
            setCustomDays(String(draft.days.length));
            setCustom(true);
          }}>{copy("Custom")}</button></div>
          {custom && <form className="planner-custom" onSubmit={event => {
            event.preventDefault();
            changeDuration(boundedNumber(Number(customDays), draft.days.length, 1, maxTripDays));
          }}>
            <label>{copy("Custom days (1–{max, number})", {max:maxTripDays})}
              <input type="number" min={1} max={maxTripDays} required value={customDays} onChange={event => { event.currentTarget.setCustomValidity(""); setCustomDays(event.currentTarget.value); }} onInvalid={event => event.currentTarget.setCustomValidity(copy(event.currentTarget.validity.valueMissing ? "Please fill out this field." : "Please enter a valid value."))} />
            </label>
            <button className="planner-chip" type="submit">{copy("Apply duration")}</button>
          </form>}
        </fieldset>
        <div className="planner-fields">
          <label>{copy("Arrival date")} <input type="date" defaultValue={draft.startDate} onInput={event => update({...draft, startDate: event.currentTarget.value})} /></label>
          <label>{copy("Travelers")} <input type="number" min={1} max={maxTravelers} value={draft.travelers} onChange={event => update({
            ...draft, travelers: boundedNumber(event.target.valueAsNumber, draft.travelers, 1, maxTravelers),
          })} /></label>
        </div>
        <RidePicker draft={draft} onChange={update} />
        <div className="planner-place-picker">
          <h3>{copy("Add a destination")}</h3>
          <div className="planner-fields">
            <label>{copy("Assign to day")} <select value={activeDay} onChange={event => update({...draft, activeDay: Number(event.target.value)})}>
              {draft.days.map((_, index) => <option value={index} key={index}>{dayLabel(index + 1)}</option>)}
            </select></label>
            <label>{copy("Destination")} <select value={place} onChange={event => setPlace(event.target.value)}>
              <option value="">{copy("Choose a place")}</option>
              {plannerPlaces.map(({id,name}) => <option value={id} disabled={activeStops.includes(id)} key={id}>{copy(name)}</option>)}
            </select></label>
          </div>
          <button className="button button-dark" type="button" disabled={!place || activeStops.includes(place)} onClick={() => {
            togglePlace(place);
            setPlace("");
          }}><Plus size={17} aria-hidden="true" /> {copy("Add to day {day, number}", {day:activeDay + 1})}</button>
        </div>
        <p className="planner-storage"><Check size={16} aria-hidden="true" /> {saveFailed ? copy("Local storage is unavailable. This draft will last until you leave the page.") : copy("Draft saves to this browser.")}</p>
      </section>
    </div>

    <p className="planner-feedback planner-shared-feedback" role="status">{feedback}</p>
    <ItineraryAssistant days={draft.days} roadMinutes={dayRoutes.map(({state}) => state?.status === "ready" ? state.route.minutes : undefined)}
      canCheck={routingEnabled && unchecked.length > 0} checking={checkingRoutes} onCheck={() => void checkRemainingRoutes()}
      onApply={change => {
        update({...draft, days:applyItineraryChange(draft.days, change)});
        setFeedback(copy("Suggestion applied."));
      }} />

    <section className="planner-panel planner-itinerary" id="planner-itinerary" aria-labelledby="itinerary-title">
      <div className="planner-heading">
        <Route size={21} aria-hidden="true" />
        <div><h2 id="itinerary-title">{copy("Day-by-day itinerary")}</h2><p>{copy("Reorder stops with the up and down buttons, or use “Move to day”.")}</p></div>
      </div>
      {routingEnabled && <p className="planner-note planner-routing-note">{copy("Road estimates include the previous planned day’s final stop when available. They exclude traffic, sightseeing and breaks.")} {copy("Map and routing sources")} · <a href="https://openrouteservice.org/">openrouteservice</a> · <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>.</p>}
      <div className="planner-days">
        {draft.days.map((day, dayIndex) => {
          const {stops, state} = dayRoutes[dayIndex];
          return <article key={dayIndex} className="planner-day" data-active={dayIndex === activeDay}>
            <div className="planner-day-head">
              <h3>{dayLabel(dayIndex + 1)}</h3>
              <button type="button" className="planner-chip" aria-pressed={dayIndex === activeDay} onClick={() => update({...draft, activeDay: dayIndex})} aria-label={copy("Select day {day, number} for map edits", {day:dayIndex + 1})}>
                {dayIndex === activeDay ? copy("Selected") : copy("Select")}
              </button>
            </div>
            {day.length ? <ol className="planner-stops">
              {day.map((id, stopIndex) => {
                const name = copy(placesById.get(id)?.name ?? id);
                return <li key={id}>
                  <div className="planner-stop-head">
                    <span className="planner-stop-label"><span>{number(stopIndex + 1)}</span><strong>{name}</strong></span>
                    <div className="planner-stop-actions">
                      <button type="button" title={copy("Move earlier")} aria-label={copy("Move {place} earlier on day {day, number}", {place:name, day:dayIndex + 1})} disabled={stopIndex === 0} onClick={() => reorder(dayIndex, stopIndex, -1)}><ArrowUp size={16} aria-hidden="true" /></button>
                      <button type="button" title={copy("Move later")} aria-label={copy("Move {place} later on day {day, number}", {place:name, day:dayIndex + 1})} disabled={stopIndex === day.length - 1} onClick={() => reorder(dayIndex, stopIndex, 1)}><ArrowDown size={16} aria-hidden="true" /></button>
                      <button type="button" title={copy("Remove stop")} aria-label={copy("Remove {place} from day {day, number}", {place:name, day:dayIndex + 1})} onClick={() => togglePlace(id, dayIndex)}><Trash2 size={16} aria-hidden="true" /></button>
                    </div>
                  </div>
                  {draft.days.length > 1 && <select className="planner-move" aria-label={copy("Move {place} from day {day, number} to another day", {place:name, day:dayIndex + 1})} value="" onChange={event => moveToDay(id, dayIndex, Number(event.target.value))}>
                    <option value="" disabled>{copy("Move to day")}</option>
                    {draft.days.map((other, index) => index !== dayIndex && <option key={index} value={index} disabled={other.includes(id)}>{dayLabel(index + 1)}</option>)}
                  </select>}
                </li>;
              })}
            </ol> : <p className="planner-empty"><MapPin size={15} aria-hidden="true" /> {copy("No stops planned.")}</p>}
            {routingEnabled && stops.length > 1 && <div className="planner-day-routing">
              {state?.status !== "ready" && <button className="planner-chip" type="button" disabled={state?.status === "loading"} onClick={() => void checkRoute(stops)}>
                {state?.status === "loading" ? copy("Checking route…") : copy("Check road route")}
              </button>}
              {state?.status === "error" && <p role="status">{copy(state.message)}</p>}
              {state?.status === "ready" && <p role="status" className={state.route.minutes > drivingWarningMinutes ? "planner-drive-warning" : undefined}>{copy("Estimated driving: {time}.", {time:formatDriveTime(state.route.minutes, copy)})}
                {state.route.minutes > drivingWarningMinutes && " " + copy("Above the {time} daily threshold. Consider moving a stop to another day.", {time:formatDriveTime(drivingWarningMinutes, copy)})}
              </p>}
            </div>}
          </article>;
        })}
      </div>
    </section>

    <div className="planner-bottom">
      <BudgetPanel draft={draft} onChange={update} />
      <section className="planner-panel planner-enquiry" id="planner-enquiry" aria-labelledby="enquiry-title">
        <div className="planner-heading">
          <MessageCircle size={21} aria-hidden="true" />
          <div><h2 id="enquiry-title">{copy("Share your trip")}</h2><p>{copy("Send your draft itinerary to Nishaka.")}</p></div>
        </div>
        <dl className="planner-costs">
          <div><dt>{copy("Travel dates")}</dt><dd>{tripDates(draft, locale, copy)}</dd></div>
          <div><dt>{copy("Travelers")}</dt><dd>{number(draft.travelers)}</dd></div>
          <div><dt>{copy("Vehicle")}</dt><dd>{copy(rides[draft.vehicle].name)}</dd></div>
          <div><dt>{copy("Planned stops")}</dt><dd>{copy("{stops, number} across {days, number} days", {stops:stopCount, days:draft.days.filter(day => day.length > 0).length})}</dd></div>
        </dl>
        <details className="planner-rates">
          <summary>{copy("Preview WhatsApp message")}</summary>
          <pre className="planner-message">{message}</pre>
          <button type="button" className="planner-chip" onClick={() => void copyMessage()}>{copy("Copy itinerary message")}</button>
          <p className="planner-note" role="status">{copyStatus}</p>
        </details>
        {link
          ? <a className="button button-gold" href={link} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> {copy("Open WhatsApp enquiry")}</a>
          : <><button type="button" className="button button-gold" disabled aria-describedby="planner-whatsapp-setup"><MessageCircle size={17} aria-hidden="true" /> {copy("Open WhatsApp enquiry")}</button>
            <p id="planner-whatsapp-setup" className="planner-note">{copy("WhatsApp is unavailable until the business configures")} <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code>.</p></>}
        <p className="planner-note">{copy("Your enquiry asks about availability and a quote. Booking confirmation is arranged separately with Nishaka.")}</p>
      </section>
    </div>
  </div>;
}
