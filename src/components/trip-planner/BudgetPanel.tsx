import {useFormatting} from "@/i18n/format";
import {Calculator} from "lucide-react";
import {accommodationOptions, costFields, maxBudgetInput} from "@/data/planner";
import {boundedNumber, transportRate, tripEstimate, type Accommodation, type TripDraft} from "@/lib/trip-planner";

export function BudgetPanel({draft, onChange}: {draft: TripDraft; onChange: (draft: TripDraft) => void}) {
  const {copy, money} = useFormatting();
  const estimate = tripEstimate(draft);
  const balance = Math.round((draft.target - estimate.total) * 100) / 100;
  return <section className="planner-panel" id="planner-budget" aria-labelledby="budget-title">
    <div className="planner-heading">
      <Calculator size={21} aria-hidden="true" />
      <div><h2 id="budget-title">{copy("Budget estimate")}</h2><p>{copy("Editable sample rates in USD")}</p></div>
    </div>
    <div className="planner-fields">
      <label>{copy("Accommodation preference")}<select value={draft.accommodation} onChange={event => {
          const accommodation = event.target.value as Accommodation;
          onChange({...draft, accommodation, rates: {...draft.rates, accommodation: accommodationOptions[accommodation].perRoomNight}});
        }}>
          {Object.entries(accommodationOptions).map(([value, option]) => <option key={value} value={value}>{copy(option.label)}</option>)}
        </select>
      </label>
      <label>{copy("Group budget target (USD)")}<input type="number" min={0} max={maxBudgetInput} step="0.01" inputMode="decimal" placeholder={copy("Optional")} value={draft.target || ""} onChange={event => onChange({...draft, target: boundedNumber(event.target.valueAsNumber, 0, 0, maxBudgetInput, false)})} />
      </label>
    </div>
    <details className="planner-rates">
      <summary>{copy("Edit sample rates")}</summary>
      <div className="planner-fields">
        {costFields.map(({name, label, unit}) => <label key={name}>{copy(label)} <small>{copy(unit)}</small>
          <input type="number" min={0} max={maxBudgetInput} step="0.01" inputMode="decimal" value={name === "transport" ? transportRate(draft) : draft.rates[name]} onChange={event => {
            const rate = boundedNumber(event.currentTarget.valueAsNumber, 0, 0, maxBudgetInput, false);
            onChange(name === "transport"
              ? {...draft, transportOverrides: {...draft.transportOverrides, [draft.vehicle]: rate}}
              : {...draft, rates: {...draft.rates, [name]: rate}});
          }} />
        </label>)}
      </div>
    </details>
    <dl className="planner-costs">
      {costFields.map(({name, label}) => <div key={name}><dt>{copy(label)}</dt><dd>{money(estimate.costs[name])}</dd></div>)}
    </dl>
    <div className="planner-total">
      <div><span>{copy("Estimated group total")}</span><strong>{money(estimate.total)}</strong></div>
      <div><span>{copy("Per traveler")}</span><strong>{money(estimate.perTraveler)}</strong></div>
    </div>
    <p className={balance < 0 ? "planner-budget-state is-over" : "planner-budget-state"} role="status">
      {draft.target > 0 ? balance === 0 ? copy("Matches your group budget target.") : copy(balance < 0 ? "{amount} over your group budget target." : "{amount} under your group budget target.", {amount: money(Math.abs(balance))}) : copy("Set a group budget target to compare.")}
    </p>
    <p className="planner-note">{copy("Estimate assumes up to two travelers per room: {rooms, number} rooms for {nights, number} nights. Flights, visas, insurance and personal expenses are excluded. Actual costs vary by season, route and choices. This is for planning only.", {rooms:estimate.rooms,nights:estimate.nights})}</p>
  </section>;
}
