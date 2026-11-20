import {useCopy} from "@/i18n/copy";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {destinations} from "@/data/destinations";
import {photos} from "@/data/photos";
import {ParallaxPhoto, Reveal} from "./TravelMotion";
import {SectionHeading} from "./SectionHeading";

const stories = [
  {name: "Sigiriya", region: "Cultural Triangle", description: "Ancient water gardens lead to a rock fortress high above the forest.", photo: photos.cultural, href: "/tours/sigiriya-dambulla", action: "Explore the Cultural Route"},
  {name: "Ella", region: "Central Highlands", description: "Follow hill-country roads to the railway arches and tea-covered slopes around Ella.", photo: photos.ella, href: "/tours/kandy-ella", action: "Explore the Hill Country"},
  {name: "Yala", region: "Southeastern Sri Lanka", description: "Make time for dry-zone landscapes and wildlife spotting. Ask about adding Yala to a custom itinerary.", photo: photos.yala, href: "/contact", action: "Ask About Yala"},
  {name: "Southern Coast", region: "Indian Ocean", description: "Wander the lanes of Galle Fort, then slow down by the water around Mirissa.", photo: photos.mirissa, href: "/tours/southern-coast", action: "Explore the Coast"},
];

export function DestinationStories() {
  const copy = useCopy();
  return <section id="destinations" tabIndex={-1} className="section destination-stories" aria-label={copy("Destination stories")}>
    <div className="wrap">
      <Reveal>
        <SectionHeading eyebrow={copy("Destination stories")} title={copy("Four stops, four sides of Sri Lanka")}>{copy("From the Cultural Triangle to the Indian Ocean. The scenes below are destination illustrations.")}</SectionHeading>
      </Reveal>
      <div className="story-grid">
        {stories.map(({name, region, description, photo, href, action}) => <article className="story" key={name}>
          <ParallaxPhoto>
            <Image src={photo.src} alt={copy(photo.alt)} fill sizes="(max-width: 760px) 92vw, (max-width: 1240px) 56vw, 690px" className="story-photo" />
          </ParallaxPhoto>
          <div className="story-copy">
            <Reveal>
              <p className="eyebrow">{copy(region)}</p>
              <h3>{copy(name)}</h3>
              <p>{copy(description)}</p>
              <Link className="button button-light" href={href}>{copy(action)}</Link>
            </Reveal>
          </div>
        </article>)}
      </div>
      <div className="home-destination-links">
        {destinations.filter(item => item.name === "Galle" || item.name === "Udawalawe").map(item =>
          <Link key={item.tour} href={"/tours/" + item.tour}><strong>{copy(item.name)}</strong><span>{copy(item.description)}</span></Link>
        )}
      </div>
    </div>
  </section>;
}
