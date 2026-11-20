import {useCopy} from "@/i18n/copy";
import {Hero} from "@/components/Hero";
import {Gallery} from "@/components/Gallery";
import {pageMetadata} from "@/lib/seo";

const description = "Browse Sri Lanka destination illustrations, tour inspiration and a look at Nishaka’s private tour vehicle.";
export function generateMetadata() { return pageMetadata("Sri Lanka Photo Gallery", description, "/gallery"); }

export default function GalleryPage() {
  const copy = useCopy();
  return <>
    <Hero title={copy("Postcards from Sri Lanka")} eyebrow={copy("Photo gallery")} description={copy(description)} />
    <section className="section"><div className="wrap"><h2 className="sr-only">{copy("Browse the photo collections")}</h2><Gallery /></div></section>
  </>;
}
