import {rideIds, rides, isRideId} from "@/data/vehicles";
import {useFormatting} from "@/i18n/format";
import {boundedNumber, rideSuitability, transportRate, type TripDraft} from "@/lib/trip-planner";

export function RidePicker({draft, onChange}: {draft: TripDraft; onChange: (next: TripDraft) => void}) {
  const {copy, money} = useFormatting();
  const {passengerLimit, luggageLimit, tooManyPassengers, tooMuchLuggage} = rideSuitability(draft);

  return <fieldset className="planner-ride" aria-describedby="planner-ride-rate planner-ride-suitability">
    <legend>{copy("Choose your ride")}</legend>
    <div className="planner-fields">
      <label>{copy("Vehicle")}
        <select value={draft.vehicle} onChange={event => {
          const vehicle = event.currentTarget.value;
          if (isRideId(vehicle)) onChange({...draft, vehicle});
        }}>
          {rideIds.map(id => <option key={id} value={id}>{copy(rides[id].name)}</option>)}
        </select>
      </label>
      <label>{copy("Standard suitcases")}
        <input type="number" min={0} max={200} step={1} value={draft.luggage ?? ""} placeholder={copy("Optional")} onChange={event => {
          const value = event.currentTarget.valueAsNumber;
          onChange({...draft, luggage: Number.isFinite(value) ? boundedNumber(value, 0, 0, 200) : null});
        }} />
      </label>
    </div>
    <p className="planner-note" id="planner-ride-rate">{copy("Illustrative transport rate: {rate} per day", {rate:money(transportRate(draft))})}</p>
    <div id="planner-ride-suitability" role="status">
      {(passengerLimit === null || luggageLimit === null) && <p className="planner-note">
        {copy("Vehicle capacity is subject to confirmation. Share your party size and luggage needs with Nishaka.")}
      </p>}
      {tooManyPassengers && passengerLimit !== null && <p className="planner-note planner-drive-warning">
        {copy("This vehicle has a verified limit of {count, number} passengers. Ask Nishaka about another arrangement.", {count:passengerLimit})}
      </p>}
      {tooMuchLuggage && luggageLimit !== null && <p className="planner-note planner-drive-warning">
        {copy("This vehicle has a verified limit of {count, number} standard suitcases. Ask Nishaka about another arrangement.", {count:luggageLimit})}
      </p>}
    </div>
  </fieldset>;
}
