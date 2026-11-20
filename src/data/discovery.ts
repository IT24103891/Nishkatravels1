import {placesById} from "./planner";
import {photos, type Photo} from "./photos";

export const discoveryCategories = ["Nature", "Culture", "Beaches", "Wildlife", "Adventure"] as const;
type Category = typeof discoveryCategories[number];
type DiscoveryStory = {
  categories: Category[];
  description: string;
  attractions: string[];
  visit: "Half a day" | "One day" | "One to two days";
  photo: Photo;
  credit?: {author: string; file: string; license: "by-sa/4.0" | "by/2.0"};
  tour: string;
};

const stories = {
  sigiriya: {categories:["Culture","Adventure"], description:"Climb past rock-cut stairways to the fortress above ancient water gardens.", attractions:["Sigiriya rock fortress","Ancient water gardens"], visit:"Half a day", photo:photos.cultural, tour:"sigiriya-dambulla"},
  dambulla: {categories:["Culture"], description:"Explore hillside cave shrines filled with murals and Buddha statues.", attractions:["Dambulla cave temples","Golden Temple of Dambulla"], visit:"Half a day", tour:"sigiriya-dambulla",
    photo:{src:"/images/destinations/dambulla.jpg", alt:"Rock temple in Dambulla"},
    credit:{author:"Kaushiru90", file:"Dambulla_Cave_temple.jpg", license:"by-sa/4.0"}},
  kandy: {categories:["Culture","Nature"], description:"Walk around the lake and spend time at one of Sri Lanka’s most important Buddhist temples.", attractions:["Kandy Lake","Temple of the Sacred Tooth Relic"], visit:"One day", tour:"kandy-ella",
    photo:{src:"/images/destinations/kandy.jpg", alt:"Kandy Lake with the Temple of the Sacred Tooth Relic beyond"},
    credit:{author:"Niranjan Ramamurthy", file:"Kandy_Lake_and_the_Temple_of_the_Sacred_Tooth_Relic,_Kandy.jpg", license:"by-sa/4.0"}},
  "nuwara-eliya": {categories:["Nature"], description:"Slow down among tea estates, cool uplands and the shores of Lake Gregory.", attractions:["Nuwara Eliya tea country","Lake Gregory"], visit:"One day", tour:"kandy-ella",
    photo:{src:"/images/destinations/nuwara-eliya.jpg", alt:"Sunrise at Lake Gregory in Nuwara Eliya"},
    credit:{author:"Pavithra Packiyanathan", file:"Gregory_Lake_Nuwara_Eliya.jpg", license:"by-sa/4.0"}},
  ella: {categories:["Nature","Adventure"], description:"Follow trails through the hills to railway arches and views across Ella Gap.", attractions:["Nine Arches Bridge","Little Adam’s Peak"], visit:"One to two days", photo:photos.ella, tour:"kandy-ella"},
  yala: {categories:["Wildlife","Nature","Adventure"], description:"Explore dry forest and lagoons on a safari, with a chance to spot leopards and other wildlife.", attractions:["Yala National Park","Wildlife safari at Palatupana"], visit:"Half a day", photo:photos.yala, tour:"wildlife-safari"},
  mirissa: {categories:["Beaches","Nature"], description:"Take a slow coastal day around Mirissa’s palm-lined bay and headlands.", attractions:["Mirissa Beach","Coconut Tree Hill"], visit:"One day", photo:photos.mirissa, tour:"southern-coast"},
  galle: {categories:["Culture","Beaches"], description:"Explore the fort’s lanes, then follow the ramparts to the lighthouse and the sea.", attractions:["Galle Fort","Galle Lighthouse"], visit:"Half a day", photo:photos.coast, tour:"southern-coast"},
  colombo: {categories:["Culture"], description:"Spend a day exploring markets, museums and Colombo’s oceanfront promenade.", attractions:["Galle Face Green","Colombo National Museum"], visit:"One day", tour:"custom-7-day",
    photo:{src:"/images/destinations/colombo.jpg", alt:"The waterfront at Galle Face in Colombo"},
    credit:{author:"Jérôme Decq", file:"Colombo_Galle_Face.jpg", license:"by/2.0"}},
} satisfies Record<string, DiscoveryStory>;

export const discoveryPlaces = Object.entries<DiscoveryStory>(stories).map(([id, story]) => {
  const place = placesById.get(id);
  if (!place) throw new Error(`Discovery destination missing from planner: ${id}`);
  return {...place, ...story};
});
