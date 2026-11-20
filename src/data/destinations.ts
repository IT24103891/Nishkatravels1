import {photos, type Photo} from "./photos";

interface Destination {
  name: string;
  region: string;
  description: string;
  photo: Photo;
  tour: string;
}
export const destinations: Destination[] = [
  {name:"Sigiriya", region:"Cultural Triangle", description:"A rock fortress above the forest and ancient gardens below.", photo:photos.cultural, tour:"sigiriya-dambulla"},
  {name:"Ella", region:"Central Highlands", description:"Railway arches, tea-country roads and quiet hillside walks.", photo:photos.ella, tour:"kandy-ella"},
  {name:"Galle", region:"Southern Coast", description:"Lighthouse views and streets made for an unhurried wander.", photo:photos.coast, tour:"southern-coast"},
  {name:"Udawalawe", region:"Southern Lowlands", description:"Open grasslands and the chance to see wild elephants.", photo:photos.safari, tour:"wildlife-safari"},
];
