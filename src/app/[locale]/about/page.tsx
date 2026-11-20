import {useCopy} from "@/i18n/copy";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {Hero} from "@/components/Hero";
import {SectionHeading} from "@/components/SectionHeading";
import {photos} from "@/data/photos";
import {pageMetadata} from "@/lib/seo";

const description = "Meet Nishaka, a Sri Lankan private driver and tour guide offering flexible trips and islandwide transfers.";
export function generateMetadata() { return pageMetadata("About Nishaka", description, "/about", photos.portrait); }

export default function AboutPage() {
  const copy = useCopy();
  return <>
    <Hero title={copy("Meet Nishaka")} eyebrow={copy("Your private driver and guide")} description={copy(description)} />
    <section className="section"><div className="wrap split">
      <figure className="media portrait"><Image src={photos.portrait.src} alt={copy(photos.portrait.alt)} fill sizes="(max-width: 760px) 92vw, 550px" /></figure>
      <div><SectionHeading title={copy("Local experience, flexible days")}>{copy("Nishaka has guided travelers through Kandy, Nuwara Eliya, Mirissa and Colombo. He drives a white Nissan Caravan E25 and offers private transportation and trips around the island.")}</SectionHeading>
      <p>{copy("Spend more time at the places you came to see, and plan the pace around your group. Discuss special stops, shorter driving days or room for meal and rest breaks when you enquire.")}</p>
      <Link className="button button-dark spaced" href="/contact">{copy("Plan Your Trip")}</Link></div>
    </div></section>
    <section className="section soft"><div className="wrap compact"><SectionHeading title={copy("Professional credentials")}>{copy("Credential details are pending verification and will be added once confirmed.")}</SectionHeading></div></section>
  </>;
}
