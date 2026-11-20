import Image from "next/image";
import {BusFront, CarFront, Luggage, MapPin, Plane, UsersRound} from "lucide-react";
import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";
import {photos} from "@/data/photos";
import {clipKinds, clipTitles, rideIds, rides, type RideId} from "@/data/vehicles";
import {SectionHeading} from "./SectionHeading";
import {Reveal} from "./TravelMotion";
import {VehicleVideo} from "./VehicleVideo";

function VehicleImage({id}: {id: RideId}) {
  const copy = useCopy();
  const {photo} = rides[id];
  return <div className={photo ? "ride-image" : "ride-image ride-image-pending"}>
    {photo
      ? <Image src={photo.src} alt={copy(photo.alt)} fill sizes="(max-width: 760px) 92vw, 570px" />
      : <div><CarFront size={58} strokeWidth={1.15} aria-hidden="true" /><p>{copy("Vehicle photo pending")}</p></div>}
  </div>;
}

export function VehicleShowcase({editorial = false}: {editorial?: boolean}) {
  const copy = useCopy();
  return <section className="section soft vehicle-showcase">
    <div className="wrap">
      <Reveal><SectionHeading eyebrow={copy("Private transport")} title={copy("Choose your ride")}>
        {copy("Compare a private van and a private car for your Sri Lanka trip. Discuss your group and luggage needs with Nishaka before booking.")}
      </SectionHeading></Reveal>
      <div className="ride-grid">
        {rideIds.map((id, index) => {
          const ride = rides[id];
          const Icon = id === "van" ? BusFront : CarFront;
          return <Reveal className="ride-reveal" delay={index * 0.08} key={id}>
            <article className="ride-card">
              {editorial && !ride.photo ? <figure className="ride-image ride-editorial-image">
                <Image src={photos.coast.src} alt={copy(photos.coast.alt)} fill sizes="(max-width: 760px) 92vw, 570px" />
                <figcaption>{copy("Destination illustration")}</figcaption>
              </figure> : <VehicleImage id={id} />}
              <div className="ride-card-copy">
                <p className="eyebrow"><Icon size={18} aria-hidden="true" />{copy(ride.model ?? (editorial ? "Private transport" : "Make and model to be confirmed"))}</p>
                <h3>{copy(ride.name)}</h3>
                <p>{copy(ride.description)}</p>
                <Link href={"/vehicle#" + id} className="button button-dark"
                  aria-label={copy("View details for {tour}", {tour:copy(ride.name)})}>{copy("View Details")}</Link>
              </div>
            </article>
          </Reveal>;
        })}
      </div>
      <ul className="vehicle-trips ride-services">
        <li><Plane size={19} aria-hidden="true" /> {copy("Private airport transfers")}</li>
        <li><MapPin size={19} aria-hidden="true" /> {copy("Islandwide private travel")}</li>
      </ul>
    </div>
  </section>;
}

export function VehicleDetails({id}: {id: RideId}) {
  const copy = useCopy();
  const ride = rides[id];
  return <section className="section ride-detail" id={id} aria-labelledby={`ride-${id}-heading`}>
    <div className="wrap">
      <div className="split">
        <Reveal><VehicleImage id={id} /></Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">{copy(ride.model ?? "Make and model to be confirmed")}</p>
          <h2 id={`ride-${id}-heading`}>{copy(ride.name)}</h2>
          <p className="ride-detail-description">{copy(ride.description)}</p>
          <dl className="specs">
            <div><dt><UsersRound size={18} aria-hidden="true" /> {copy("Passenger capacity")}</dt>
              <dd>{ride.verifiedPassengerCapacity === null ? copy("To be confirmed") : copy("{count, number} passengers", {count:ride.verifiedPassengerCapacity})}</dd></div>
            <div><dt><Luggage size={18} aria-hidden="true" /> {copy("Luggage capacity")}</dt>
              <dd>{ride.verifiedLuggageCapacity === null ? copy("To be confirmed") : copy("{count, number} standard suitcases", {count:ride.verifiedLuggageCapacity})}</dd></div>
            <div><dt><CarFront size={18} aria-hidden="true" /> {copy("Comfort and safety features")}</dt><dd>{copy("Ask about specific requirements when you enquire.")}</dd></div>
          </dl>
        </Reveal>
      </div>
      <div className="ride-film">
        <Reveal><SectionHeading title={copy("Vehicle films")}>{copy("Exterior, interior and scenic-driving views will appear here when footage is available.")}</SectionHeading></Reveal>
        <div className="ride-film-grid">
          {clipKinds.map(kind => <VehicleVideo key={kind} clip={ride.clips[kind]} fallback={kind === "exterior" ? ride.photo ?? undefined : undefined} title={copy(clipTitles[kind])} />)}
        </div>
      </div>
    </div>
  </section>;
}
