import {getCopy} from "@/i18n/server";
import {Instagram, MapPin} from "lucide-react";
import {Hero} from "@/components/Hero";
import {SectionHeading} from "@/components/SectionHeading";
import {TripEnquiryForm} from "@/components/TripEnquiryForm";
import {business} from "@/lib/business";
import {tours} from "@/data/tours";
import {pageMetadata} from "@/lib/seo";

const description = "Share your dates, pickup point and travel plans to enquire about a private Sri Lanka tour or transfer with Nishaka.";
export function generateMetadata() { return pageMetadata("Plan Your Trip & Enquire", description, "/contact"); }

export default async function ContactPage({searchParams}: {searchParams: Promise<{tour?: string | string[]}>}) {
  const copy = await getCopy();
  const {tour} = await searchParams;
  const initialTour = tour === "airport" ? copy("Airport transfer") : tour === "islandwide" ? copy("Islandwide transfer") : tours.find(item => item.slug === tour)?.title;
  return <>
    <Hero title={copy("Plan your Sri Lanka trip")} eyebrow={copy("Trip enquiries")} description={copy(description)} />
    <section className="section"><div className="wrap contact-layout">
      <aside>
        <SectionHeading title={copy("Tell us where you’d like to go")}>{copy("A rough route is enough to start. Include any dates, luggage details or special stops you already have in mind.")}</SectionHeading>
        <p className="social"><MapPin size={18} aria-hidden="true" /> {copy("Islandwide travel, Sri Lanka")}</p>
        <a className="social text-link" href={business.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} aria-hidden="true" /> {business.instagramHandle}</a>
      </aside>
      <TripEnquiryForm key={initialTour} initialTour={initialTour} />
    </div></section>
  </>;
}
