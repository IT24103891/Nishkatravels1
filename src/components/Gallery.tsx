"use client";

import {useCopy} from "@/i18n/copy";
import {useState} from "react";
import Image from "next/image";
import {ImageIcon} from "lucide-react";
import {photos, type Photo} from "@/data/photos";

const categories = ["Destinations", "Tour Experiences", "Vehicle", "Happy Guests"] as const;
type Category = (typeof categories)[number];
const collections: Record<Category, {photo: Photo; title: string}[]> = {
  Destinations: [{photo: photos.hero, title: "Sigiriya from above"}, {photo: photos.ella, title:"Nine Arches Bridge, Ella"}, {photo: photos.coast, title:"Galle Fort"}, {photo: photos.mirissa, title:"Southern coast"}],
  "Tour Experiences": [{photo: photos.cultural, title:"Looking out from Pidurangala"}, {photo: photos.safari, title:"Wildlife in Udawalawe"}],
  Vehicle: [{photo: photos.vehicle, title:"Nishaka and the Nissan Caravan E25"}],
  "Happy Guests": [],
};

export function Gallery() {
  const copy = useCopy();
  const [category, setCategory] = useState<Category>("Destinations");
  return <div>
    <div className="filters" role="group" aria-label={copy("Photo categories")}>
      {categories.map(item => <button className="button button-outline" type="button" key={item} aria-pressed={category === item} aria-controls="gallery-results" onClick={() => setCategory(item)}>{copy(item)}</button>)}
    </div>
    <div id="gallery-results" className="grid cards" aria-live="polite">
      {collections[category].map(({photo,title}) => <figure key={photo.src} className="gallery-item">
        <div className="media"><Image src={photo.src} alt={copy(photo.alt)} fill sizes="(max-width: 650px) 92vw, (max-width: 1000px) 45vw, 380px" /></div>
        <figcaption>{copy(title)}{category !== "Vehicle" && (" · " + copy("Illustration"))}</figcaption>
      </figure>)}
      {category === "Happy Guests" && <p className="notice"><ImageIcon size={20} aria-hidden="true" /> {copy("Guest photos will appear here after publication approval.")}</p>}
    </div>
  </div>;
}
