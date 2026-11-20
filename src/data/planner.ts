export interface PlannerPlace {
  id: string;
  name: string;
  region: string;
  coordinates: [longitude: number, latitude: number];
}

export const plannerPlaces: PlannerPlace[] = [
  {id: "colombo", name: "Colombo", region: "West coast", coordinates: [79.8612, 6.9271]},
  {id: "negombo", name: "Negombo", region: "West coast", coordinates: [79.838, 7.2084]},
  {id: "anuradhapura", name: "Anuradhapura", region: "Cultural Triangle", coordinates: [80.4037, 8.3114]},
  {id: "sigiriya", name: "Sigiriya", region: "Cultural Triangle", coordinates: [80.7603, 7.9554]},
  {id: "dambulla", name: "Dambulla", region: "Cultural Triangle", coordinates: [80.651, 7.8567]},
  {id: "polonnaruwa", name: "Polonnaruwa", region: "Cultural Triangle", coordinates: [81.0024, 7.9403]},
  {id: "kandy", name: "Kandy", region: "Central Highlands", coordinates: [80.6337, 7.2906]},
  {id: "nuwara-eliya", name: "Nuwara Eliya", region: "Central Highlands", coordinates: [80.7891, 6.9497]},
  {id: "ella", name: "Ella", region: "Central Highlands", coordinates: [81.0461, 6.8667]},
  {id: "udawalawe", name: "Udawalawe", region: "Southern lowlands", coordinates: [80.8985, 6.4388]},
  {id: "yala", name: "Yala (Palatupana entrance)", region: "Southeast", coordinates: [81.4008, 6.2825]},
  {id: "mirissa", name: "Mirissa", region: "South coast", coordinates: [80.4716, 5.9483]},
  {id: "galle", name: "Galle", region: "South coast", coordinates: [80.217, 6.0329]},
  {id: "bentota", name: "Bentota", region: "Southwest coast", coordinates: [79.994, 6.4259]},
  {id: "trincomalee", name: "Trincomalee", region: "East coast", coordinates: [81.233, 8.5874]},
  {id: "jaffna", name: "Jaffna", region: "Northern peninsula", coordinates: [80.0255, 9.6615]},
];

export const placesById = new Map(plannerPlaces.map(place => [place.id, place]));
export const durationPresets = [3, 5, 7, 10, 14];
export const maxTripDays = 30;
export const maxTravelers = 50;
export const maxBudgetInput = 100_000;
export const drivingWarningMinutes = 240;

export const accommodationOptions = {
  budget: {label: "Budget", perRoomNight: 35},
  midrange: {label: "Mid-range", perRoomNight: 75},
  premium: {label: "Premium", perRoomNight: 150},
};

export const sampleRates = {
  accommodation: accommodationOptions.midrange.perRoomNight,
  food: 22,
  activities: 18,
};

export const costFields = [
  {name: "transport", label: "Transport", unit: "per group / day"},
  {name: "accommodation", label: "Accommodation", unit: "per room / night"},
  {name: "food", label: "Food", unit: "per traveler / day"},
  {name: "activities", label: "Activities", unit: "per traveler / day"},
] as const;
