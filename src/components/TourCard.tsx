import {useCopy} from "@/i18n/copy";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {Clock, MapPin} from "lucide-react";
import {WhatsAppButton} from "./WhatsAppButton";
import type {Tour} from "@/data/tours";

export function TourCard({tour}: {tour: Tour}) {
  const copy = useCopy();
  return <article className="tour-card">
    <Link href={`/tours/${tour.slug}`} tabIndex={-1} aria-hidden="true" className="card-image">
      <Image src={tour.photo.src} alt={copy(tour.photo.alt)} fill sizes="(max-width: 650px) 92vw, (max-width: 1000px) 45vw, 380px" />
    </Link>
    <div className="card-body">
      <p className="eyebrow">{copy(tour.theme)}</p>
      <h3>{copy(tour.title)}</h3>
      <div className="tour-meta"><span><Clock size={16} aria-hidden="true" /> {copy("Sample: {duration}", {duration:copy(tour.duration)})}</span><span><MapPin size={16} aria-hidden="true" /> {tour.destinations.map(item => copy(item)).join(" · ")}</span></div>
      <p>{copy(tour.description)}</p>
      <ul className="highlights">{tour.highlights.map(item => <li key={item}>{copy(item)}</li>)}</ul>
      <div className="actions">
        <Link className="button button-dark" href={`/tours/${tour.slug}`} aria-label={copy("View details for {tour}", {tour:copy(tour.title)})}>{copy("View Details")}</Link>
        <WhatsAppButton fallback={`/contact?tour=${tour.slug}`} tour={tour.title} />
      </div>
    </div>
  </article>;
}
