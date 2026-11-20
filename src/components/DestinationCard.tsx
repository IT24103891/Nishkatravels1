import {useCopy} from "@/i18n/copy";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {destinations} from "@/data/destinations";

export function DestinationCard({destination}: {destination: (typeof destinations)[number]}) {
  const copy = useCopy();
  return <Link className="destination" href={`/tours/${destination.tour}`}>
    <Image src={destination.photo.src} alt={copy(destination.photo.alt)} fill sizes="(max-width: 650px) 45vw, 280px" />
    <div><span>{copy(destination.region)}</span><h3>{copy(destination.name)}</h3><p>{copy(destination.description)}</p></div>
  </Link>;
}
