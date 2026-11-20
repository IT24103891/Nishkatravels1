import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";
import {Hero} from "@/components/Hero";
import {SectionHeading} from "@/components/SectionHeading";
import {VehicleDetails, VehicleShowcase} from "@/components/VehicleShowcase";
import {photos} from "@/data/photos";
import {rideIds} from "@/data/vehicles";
import {pageMetadata} from "@/lib/seo";

const description = "Compare a private van and a private car for your Sri Lanka trip. Discuss your group and luggage needs with Nishaka before booking.";
export function generateMetadata() { return pageMetadata("Private Van and Car in Sri Lanka", description, "/vehicle", photos.vehicle); }

export default function VehiclePage() {
  const copy = useCopy();
  return <>
    <Hero title={copy("Private Van and Car in Sri Lanka")} eyebrow={copy("Private Sri Lanka transport")} description={copy(description)} />
    <VehicleShowcase />
    {rideIds.map(id => <VehicleDetails id={id} key={id} />)}
    <section className="section inverse"><div className="wrap">
      <SectionHeading title={copy("Arrange private transport")}>{copy("Share your pickup point, destination, passenger count and luggage details.")}</SectionHeading>
      <div className="actions">
        <Link className="button button-gold" href="/trip-planner">{copy("Open Trip Planner")}</Link>
        <Link className="button button-light" href="/contact?tour=airport">{copy("Airport Transfer Enquiry")}</Link>
        <Link className="button button-light" href="/contact?tour=islandwide">{copy("Islandwide Travel Enquiry")}</Link>
      </div>
    </div></section>
  </>;
}
