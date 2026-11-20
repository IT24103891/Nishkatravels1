import {useCopy} from "@/i18n/copy";
import {Hero} from "@/components/Hero";
import {TourCard} from "@/components/TourCard";
import {tours} from "@/data/tours";
import {photos} from "@/data/photos";
import {pageMetadata} from "@/lib/seo";

const description = "Explore sample Sri Lanka private tours covering ancient sites, the hill country, the southern coast and wildlife parks.";
export function generateMetadata() { return pageMetadata("Private Tour Itineraries", description, "/tours", photos.ella); }

export default function ToursPage() {
  const copy = useCopy();
  return <>
    <Hero title={copy("Private tours in Sri Lanka")} eyebrow={copy("Route inspiration")} description={copy("From ancient kingdoms to tea country and the coast, find a starting point for your journey.")} photo={photos.ella} />
    <section className="section"><div className="wrap">
      <h2>{copy("Explore sample routes")}</h2>
      <p className="notice">{copy("These are illustrative itineraries and durations. Discuss availability, timing and what’s included with Nishaka before booking.")}</p>
      <div className="grid cards">{tours.map(tour => <TourCard key={tour.slug} tour={tour} />)}</div>
    </div></section>
  </>;
}
