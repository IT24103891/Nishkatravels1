import {useCopy} from "@/i18n/copy";
import Image from "next/image";
import {ChevronDown} from "lucide-react";
import type {ReactNode} from "react";
import type {Photo} from "@/data/photos";
import {Entrance} from "./TravelMotion";
import {HeroAtmosphere} from "./HeroAtmosphere";

export function Hero({title, eyebrow, description, photo, children, home = false}: {
  title: ReactNode; eyebrow: string; description: string; photo?: Photo; children?: ReactNode; home?: boolean;
}) {
  const copy = useCopy();
  const picture = photo && <Image src={photo.src} alt={copy(photo.alt)} fill preload sizes="100vw" className="hero-photo" />;
  const heading = <><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></>;
  const subtitle = <p className="hero-copy">{description}</p>;
  const actions = children && <div className="actions">{children}</div>;

  return <section className={`hero ${home ? "hero-home" : ""}${photo ? "" : " hero-solid"}`}>
    {home && photo ? <HeroAtmosphere photo={photo} /> : picture}
    <div className="wrap hero-content">
      {home ? <>
        <Entrance>{heading}</Entrance>
        <Entrance delay={0.13}>{subtitle}</Entrance>
        <Entrance delay={0.23}>{actions}</Entrance>
      </> : <>{heading}{subtitle}{actions}</>}
    </div>
    {photo && <div className="wrap hero-caption"><span /> {home ? copy("Sigiriya, Sri Lanka · Illustration") : copy("Destination illustration")}</div>}
    {home && <a className="hero-scroll" href="#destinations">
      <span>{copy("Scroll to explore")}</span><ChevronDown size={19} strokeWidth={1.65} aria-hidden="true" />
    </a>}
  </section>;
}
