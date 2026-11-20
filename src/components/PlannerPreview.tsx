import {Compass, MapPin} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {useCopy} from "@/i18n/copy";
import {placesById} from "@/data/planner";
import outline from "@/data/planner-outline.json";
import {Reveal} from "./TravelMotion";

function position([longitude, latitude]: number[]) {
  return [((longitude - 79.4) / 2.8) * 100, ((10.05 - latitude) / 4.4) * 100];
}

const island = outline.coordinates.map(([ring]) =>
  "polygon(" + ring.map(point => position(point).map(value => value.toFixed(2) + "%").join(" ")).join(",") + ")",
);
const mapPlaces = ["sigiriya", "kandy", "ella", "galle"].map(id => placesById.get(id)!);

export function PlannerPreview() {
  const copy = useCopy();
  return <section className="section home-planner" aria-labelledby="home-planner-title">
    <div className="wrap">
      <Reveal className="home-planner-panel">
        <div className="home-planner-copy">
          <p className="eyebrow"><Compass size={19} aria-hidden="true" /> {copy("Trip Planner")}</p>
          <h2 id="home-planner-title">{copy("Build the trip around your group")}</h2>
          <p>{copy("Choose your stops, plan each day, and compare a car or van using illustrative rates. Share the itinerary with Nishaka when you’re ready.")}</p>
          <div className="actions">
            <Link href="/trip-planner" className="button button-gold">{copy("Open Trip Planner")}</Link>
            <Link href="/trip-planner#planner-map" className="button button-outline">{copy("Explore the map")}</Link>
          </div>
        </div>
        <figure className="home-map">
          <div className="home-map-shape" aria-hidden="true">
            {island.map((shape, index) => <i key={index} style={{clipPath:shape}} />)}
            {mapPlaces.map(({id,name,coordinates}) => {
              const [x,y] = position(coordinates);
              return <span className="home-map-marker" key={id} style={{left:x+"%",top:y+"%"}}>
                <MapPin size={17} strokeWidth={2.4}/>{copy(name)}
              </span>;
            })}
          </div>
          <figcaption>{copy("Island overview")} <span>· Natural Earth</span></figcaption>
        </figure>
      </Reveal>
    </div>
  </section>;
}
