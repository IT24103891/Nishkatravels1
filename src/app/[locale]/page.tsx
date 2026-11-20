import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";
import Image from "next/image";
import {Hero} from "@/components/Hero";
import {SectionHeading} from "@/components/SectionHeading";
import {TourCard} from "@/components/TourCard";
import {DestinationStories} from "@/components/DestinationStories";
import {Reveal} from "@/components/TravelMotion";
import {PlannerPreview} from "@/components/PlannerPreview";
import {VehicleShowcase} from "@/components/VehicleShowcase";
import {Testimonials} from "@/components/Testimonials";
import {FAQ} from "@/components/FAQ";
import {WhatsAppButton} from "@/components/WhatsAppButton";
import {photos} from "@/data/photos";
import {tours} from "@/data/tours";
import {pageMetadata} from "@/lib/seo";
import "./home.css";

export function generateMetadata() { return pageMetadata("Sri Lanka Private Tours & Driver", "Discover Sri Lanka with Nishaka, a private driver and tour guide. Explore sample routes, custom van tours and airport transfers.", "/"); }

export default function Home() {
  const copy = useCopy();
  return <div className="home-editorial">
    <Hero home photo={photos.hero} eyebrow={copy("Private driver-guided tours in Sri Lanka")} title={<>{copy("Discover Sri Lanka.")}<br /><em>{copy("Travel Your Way.")}</em></>} description={copy("Ancient cities, tea-covered hills and Indian Ocean shores. Discover the island at your own pace with Nishaka, your local private driver and guide.")}>
      <Link className="button button-gold" href="/trip-planner">{copy("Open Trip Planner")}</Link>
      <a className="button button-light" href="#destinations">{copy("Explore Sri Lanka")}</a>
    </Hero>
    <DestinationStories />
    <PlannerPreview />

    <section className="section home-tours" aria-labelledby="home-tours-title">
      <div className="wrap">
        <Reveal className="section-top">
          <div className="section-heading">
            <p className="eyebrow">{copy("Sample itineraries")}</p>
            <h2 id="home-tours-title">{copy("Find a route to make your own")}</h2>
            <p>{copy("Illustrative routes and durations to start planning your private tour.")}</p>
          </div>
          <Link className="button button-outline" href="/tours">{copy("See All Tours")}</Link>
        </Reveal>
        <div className="grid cards">{tours.slice(0,3).map((tour, index) => <Reveal key={tour.slug} className="tour-reveal" delay={index * 0.075}><TourCard tour={tour} /></Reveal>)}</div>
      </div>
    </section>

    <VehicleShowcase editorial />

    <section id="meet-nishaka" className="section home-host">
      <div className="wrap home-host-grid">
        <Reveal><figure className="home-host-portrait">
          <Image src={photos.portrait.src} alt={copy(photos.portrait.alt)} fill sizes="(max-width: 760px) 92vw, 520px" />
        </figure></Reveal>
        <Reveal delay={0.08} className="home-host-copy">
          <SectionHeading eyebrow={copy("Meet Nishaka")} title={copy("Explore Sri Lanka with a local driver.")}>
            {copy("Nishaka offers private tours and transfers across Sri Lanka. He has taken travelers through Kandy, Nuwara Eliya, Mirissa and Colombo, and can help you choose stops that suit your time on the island.")}
          </SectionHeading>
          <Link href="/about" className="button button-outline">{copy("Meet Your Guide")}</Link>
        </Reveal>
      </div>
    </section>
    <Testimonials />
    <section className="section soft home-faq">
      <div className="wrap home-faq-grid">
        <SectionHeading eyebrow={copy("Before you go")} title={copy("Frequently asked questions")} />
        <FAQ />
      </div>
    </section>
    <section className="section inverse home-contact">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow={copy("Trip enquiries")} title={copy("Talk through your itinerary")}>
            {copy("Share your dates and group size with Nishaka to discuss availability and timing.")}
          </SectionHeading>
          <WhatsAppButton />
        </Reveal>
      </div>
    </section>
  </div>;
}
