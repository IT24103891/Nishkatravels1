"use client";

import Image from "next/image";
import {Check, Clock3, MapPin, Plus, X} from "lucide-react";
import {motion, useReducedMotion} from "motion/react";
import {useLocale} from "next-intl";
import {discoveryPlaces} from "@/data/discovery";
import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";

type Place = typeof discoveryPlaces[number];

export function DiscoveryCard({place, days, itineraryDay, onAdd, onRemove, onClose}: {
  place: Place;
  days: number[];
  itineraryDay: number;
  onAdd: () => void;
  onRemove: (day: number) => void;
  onClose: () => void;
}) {
  const copy = useCopy();
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const saved = days.length > 0;
  const name = copy(place.name);

  return <motion.article className="discovery-card" initial={reducedMotion ? false : {opacity: 0, y: 6}}
    animate={{opacity: 1, y: 0}} transition={{duration: reducedMotion ? 0 : .22}} aria-labelledby="discovery-place-name">
    <figure className="discovery-image">
      <Image src={place.photo.src} alt={copy(place.photo.alt)} fill sizes="(max-width: 760px) 90vw, 380px" />
      <figcaption>{place.credit ? <>
        <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(place.credit.file)}`}>{place.credit.author}</a>
        {" · "}<a href={`https://creativecommons.org/licenses/${place.credit.license}/`}>{place.credit.license === "by/2.0" ? "CC BY 2.0" : "CC BY-SA 4.0"}</a>
      </> : copy("Destination illustration")}</figcaption>
    </figure>
    <button className="discovery-close" type="button" aria-label={copy("Close destination card")} onClick={onClose}>
      <X size={19} aria-hidden="true" />
    </button>
    <div className="discovery-card-body">
      <p className="discovery-categories">{new Intl.ListFormat(locale).format(place.categories.map(category => copy(category)))}</p>
      <h3 id="discovery-place-name">{name}</h3>
      <p>{copy(place.description)}</p>
      <p className="discovery-duration"><Clock3 size={16} aria-hidden="true" />
        {copy("Suggested visit: {duration}", {duration:copy(place.visit)})}</p>
      <h4>{copy("Popular attractions")}</h4>
      <ul>{place.attractions.map(attraction => <li key={attraction}>{copy(attraction)}</li>)}</ul>
      <div className="discovery-actions">
        <button className="button button-dark" type="button" aria-disabled={saved} onClick={saved ? undefined : onAdd}>
          {saved ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
          {copy(saved ? "In itinerary" : "Add to My Trip")}
        </button>
        {saved ? days.map(day => <button key={day} type="button" className="planner-chip" onClick={() => onRemove(day)}>
            {copy("Remove from day {day, number}", {day:day + 1})}
          </button>) : <p className="planner-note">{copy("Adds to day {day, number}", {day:itineraryDay + 1})}</p>}
        <Link className="discovery-details" href={`/tours/${place.tour}`}><MapPin size={16} aria-hidden="true" /> {copy("View Details")}</Link>
      </div>
    </div>
  </motion.article>;
}
