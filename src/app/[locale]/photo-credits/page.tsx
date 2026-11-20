import {useCopy} from "@/i18n/copy";
import {Hero} from "@/components/Hero";
import {SectionHeading} from "@/components/SectionHeading";
import {pageMetadata} from "@/lib/seo";

const description = "Background on the destination illustrations and business images used on this website.";
export function generateMetadata() { return pageMetadata("Photo Credits", description, "/photo-credits"); }

export default function PhotoCredits() {
  const copy = useCopy();
  return <>
    <Hero title={copy("Photo credits")} eyebrow={copy("Image sources")} description={copy(description)} />
    <section className="section"><div className="wrap compact">
      <SectionHeading title={copy("Destination illustrations")}>{copy("The scenic images are AI-generated illustrations for planning inspiration. Replace them with original Sri Lanka photography as it becomes available.")}</SectionHeading>
      <SectionHeading title={copy("Guide and vehicle photos")}>{copy("The guide and vehicle images are cropped from screenshots supplied for this project. The vehicle plate is obscured.")}</SectionHeading>
    </div></section>
  </>;
}
