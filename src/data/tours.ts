import {photos, type Photo} from "./photos";

export interface Tour {
  slug: string;
  title: string;
  duration: string;
  theme: string;
  destinations: string[];
  description: string;
  photo: Photo;
  highlights: string[];
  itinerary: { title: string; detail: string }[];
  gallery: Photo[];
  faq: { question: string; answer: string };
}

export const tours: Tour[] = [
  {
    slug: "sigiriya-dambulla", title: "Sigiriya & Dambulla Cultural Tour", duration: "1 day", theme: "Culture & heritage",
    destinations: ["Sigiriya", "Dambulla"], photo: photos.cultural,
    description: "Follow the story of Sri Lanka’s ancient kingdoms from Sigiriya’s gardens and rock fortress to the painted caves of Dambulla.",
    highlights: ["Sigiriya rock fortress", "Ancient water gardens", "Dambulla cave temples"],
    itinerary: [
      {title:"Morning · Sigiriya", detail:"Set out early for the water gardens and rock fortress. Allow time for the stairs and a slower descent."},
      {title:"Afternoon · Dambulla", detail:"After a lunch break, head to the cave temples to see the murals and Buddhist statues."},
    ],
    gallery: [photos.cultural, photos.hero],
    faq: {question:"Can I visit without climbing to the summit?", answer:"Yes. Ask about exploring the gardens and museum or adjusting the route to suit your mobility and comfort."},
  },
  {
    slug: "kandy-ella", title: "Kandy & Ella Hill Country Journey", duration: "3 days", theme: "Highlands & tea country",
    destinations: ["Kandy", "Nuwara Eliya", "Ella"], photo: photos.ella,
    description: "Take the scenic route through the central highlands, with time for a lakeside walk, tea country and Ella’s railway arches.",
    highlights: ["Kandy Lake", "Nuwara Eliya tea country", "Nine Arches Bridge"],
    itinerary: [
      {title:"Day 1 · Kandy", detail:"Explore around Kandy Lake and discuss time for a temple visit."},
      {title:"Day 2 · Nuwara Eliya", detail:"Drive through tea country and make time for a tea factory visit if available."},
      {title:"Day 3 · Ella", detail:"See Nine Arches Bridge and consider a short hillside walk depending on weather and interest."},
    ],
    gallery: [photos.ella, photos.portrait],
    faq: {question:"Can the route include a train ride?", answer:"Ask about adding a rail leg. Train reservations and pickup timing need to be coordinated separately."},
  },
  {
    slug: "southern-coast", title: "Southern Coast Discovery", duration: "2 days", theme: "Coast & heritage",
    destinations: ["Galle", "Mirissa"], photo: photos.coast,
    description: "Follow the coast from the lanes and ramparts of Galle Fort to a relaxed beach stop in Mirissa.",
    highlights: ["Galle Fort walk", "Lighthouse views", "Mirissa beach time"],
    itinerary: [
      {title:"Day 1 · Galle", detail:"Walk the ramparts and browse the streets inside the fort. Pause for lunch near the old town."},
      {title:"Day 2 · Mirissa", detail:"Spend an unhurried morning by the coast before continuing to your next stop."},
    ],
    gallery: [photos.coast, photos.mirissa],
    faq: {question:"Can we choose a different beach?", answer:"Yes. Share where you’re staying and the kind of beach stop you want when you enquire."},
  },
  {
    slug: "wildlife-safari", title: "Wildlife & Safari Adventure", duration: "2 days", theme: "Wildlife & nature",
    destinations: ["Udawalawe", "Southern Lowlands"], photo: photos.safari,
    description: "Build a trip around Udawalawe’s open landscapes, reserving time for an independently arranged safari jeep.",
    highlights: ["Udawalawe National Park", "Safari jeep option", "Elephant and birdwatching opportunities"],
    itinerary: [
      {title:"Day 1 · Travel to Udawalawe", detail:"Drive to the park area with stops chosen around your starting point."},
      {title:"Day 2 · Safari and onward transfer", detail:"Allow time for a morning safari with a local jeep operator, then continue toward your next destination."},
    ],
    gallery: [photos.safari],
    faq: {question:"Are elephant sightings guaranteed?", answer:"Wildlife sightings vary with conditions and animal movement. Jeep availability and park arrangements are confirmed separately."},
  },
  {
    slug: "custom-7-day", title: "Custom 7-Day Sri Lanka Journey", duration: "7 days", theme: "A little of everything",
    destinations: ["Sigiriya", "Kandy", "Nuwara Eliya", "Ella", "Mirissa", "Galle", "Colombo"], photo: photos.hero,
    description: "Start with an island-wide loop that blends culture, tea country and the south coast, then adapt the pace and stops to your group.",
    highlights: ["Cultural Triangle", "Hill country", "Southern coast"],
    itinerary: [
      {title:"Days 1–2 · Cultural Triangle", detail:"Travel from your pickup point to Sigiriya and leave time for Dambulla."},
      {title:"Days 3–5 · Kandy and the highlands", detail:"Head through Kandy and Nuwara Eliya to Ella, with time for tea-country stops."},
      {title:"Days 6–7 · Coast and Colombo", detail:"Make time for Mirissa or Galle, then continue to Colombo or your departure point."},
    ],
    gallery: [photos.hero, photos.ella, photos.coast],
    faq: {question:"Can we change the duration?", answer:"Yes. Share your dates and priorities so the plan can reflect the time you have."},
  },
];

export const sampleTerms = {
  included: ["Private driver and vehicle on the agreed route", "Pickup and drop-off as agreed with Nishaka"],
  excluded: ["Accommodation and meals", "Attraction tickets, trains, safari jeeps and third-party activities unless agreed separately"],
};
