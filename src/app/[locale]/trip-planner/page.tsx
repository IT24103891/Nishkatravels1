import {useCopy} from "@/i18n/copy";
import {TripPlannerEntry} from "@/components/trip-planner/TripPlanner";
import {pageMetadata} from "@/lib/seo";
import "./planner.css";

const description = "Build a custom itinerary for Sri Lanka, choose destinations, estimate your budget and send your travel plans to Nishaka.";
export function generateMetadata() { return pageMetadata("Sri Lanka Trip Planner", description, "/trip-planner"); }

export default function TripPlannerPage() {
  const copy = useCopy();
  return <>
    <header className="planner-header">
      <div className="wrap">
        <p className="eyebrow">{copy("Sri Lanka, at your pace")}</p>
        <h1>{copy("Plan your Sri Lanka trip")}</h1>
        <p>{copy("Pick the places you want to see, put them in order, and share your draft with Nishaka.")}</p>
      </div>
    </header>
    <TripPlannerEntry routingEnabled={Boolean(process.env.OPENROUTESERVICE_API_KEY?.trim())} />
  </>;
}
