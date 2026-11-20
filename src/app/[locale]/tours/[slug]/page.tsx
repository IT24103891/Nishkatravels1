import {getCopy} from "@/i18n/server";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {notFound} from "next/navigation";
import {Hero} from "@/components/Hero";
import {SectionHeading} from "@/components/SectionHeading";
import {FAQ} from "@/components/FAQ";
import {WhatsAppButton} from "@/components/WhatsAppButton";
import {sampleTerms, tours} from "@/data/tours";
import {pageMetadata} from "@/lib/seo";

type Props = {params: Promise<{slug: string}>};
export const dynamicParams = false;
export function generateStaticParams() {return tours.map(({slug}) => ({slug}));}
export async function generateMetadata({params}: Props) {
  const {slug} = await params;
  const tour = tours.find(item => item.slug === slug);
  if (!tour) notFound();
  return pageMetadata(tour.title, tour.description, `/tours/${slug}`, tour.photo);
}
export default async function TourPage({params}: Props) {
  const copy = await getCopy();
  const {slug} = await params;
  const tour = tours.find(item => item.slug === slug);
  if (!tour) notFound();
  const enquiry = `/contact?tour=${encodeURIComponent(slug)}`;
  return <>
    <Hero title={copy(tour.title)} eyebrow={copy("{theme} · Sample duration: {duration}", {theme:copy(tour.theme),duration:copy(tour.duration)})} description={copy(tour.description)} photo={tour.photo}>
      <Link className="button button-gold" href={enquiry}>{copy("Enquire About This Route")}</Link>
    </Hero>
    <section className="section">
      <div className="wrap tour-layout">
        <div>
          <Link className="text-link" href="/tours">{copy("All sample tours")}</Link>
          <SectionHeading title={copy("Tour overview")}>{copy(tour.description)}</SectionHeading>
          <p className="notice">{copy("This example is for planning. Confirm the itinerary, duration and arrangements with Nishaka.")}</p>
          <h2>{copy("Suggested itinerary")}</h2>
          <ol className="itinerary">{tour.itinerary.map(stop => <li key={copy(stop.title)}><h3>{copy(stop.title)}</h3><p>{copy(stop.detail)}</p></li>)}</ol>
        </div>
        <aside className="sidebar">
          <h2>{copy("Main destinations")}</h2><ul>{tour.destinations.map(item => <li key={item}>{copy(item)}</li>)}</ul>
          <h2>{copy("Highlights")}</h2><ul>{tour.highlights.map(item => <li key={item}>{copy(item)}</li>)}</ul>
        </aside>
      </div>
    </section>
    <section className="section soft">
      <div className="wrap">
        <SectionHeading title={copy("Sample inclusions and exclusions")}>{copy("Confirm these arrangements with Nishaka for your own trip.")}</SectionHeading>
        <div className="grid two">{Object.entries(sampleTerms).map(([label,items]) => <article className="benefit" key={label}><h3>{label === "included" ? copy("Typically included") : copy("Typically arranged separately")}</h3><ul className="list">{items.map(item => <li key={item}>{copy(item)}</li>)}</ul></article>)}</div>
      </div>
    </section>
    <section className="section"><div className="wrap">
      <SectionHeading title={copy("Along the route")} />
      <div className="grid cards">{tour.gallery.map(photo => <figure className="media" key={photo.src}><Image src={photo.src} alt={copy(photo.alt)} fill sizes="(max-width: 650px) 92vw, 380px" /></figure>)}</div>
    </div></section>
    <section className="section soft"><div className="wrap compact"><SectionHeading title={copy("Tour FAQ")} /><FAQ items={[tour.faq]} /></div></section>
    <section className="section inverse"><div className="wrap">
      <SectionHeading title={copy("Talk through your itinerary")}>{copy("Share your dates and group size with Nishaka to discuss availability and timing.")}</SectionHeading>
      <div className="actions"><Link className="button button-gold" href={enquiry}>{copy("Open Enquiry Form")}</Link><WhatsAppButton fallback={enquiry} tour={tour.title} /></div>
    </div></section>
  </>;
}
