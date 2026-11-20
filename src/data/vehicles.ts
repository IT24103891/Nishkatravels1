import {photos, type Photo} from "./photos";

export const rideIds = ["van", "car"] as const;
export type RideId = (typeof rideIds)[number];
export const defaultRide: RideId = "van";

export function isRideId(value: unknown): value is RideId {
  return value === "van" || value === "car";
}

export const clipKinds = ["exterior", "interior", "scenic-driving"] as const;
export type ClipKind = (typeof clipKinds)[number];

export const clipTitles: Record<ClipKind, string> = {
  exterior: "Exterior",
  interior: "Interior",
  "scenic-driving": "Scenic drive",
};

type VideoFile = ({mp4: string; webm?: string} | {mp4?: string; webm: string}) & {
  poster: Photo;
  captions: Partial<Record<"en" | "ja" | "zh" | "hi" | "ta", string>> & {en: string};
  decorative?: boolean;
};

export type VehicleClip = VideoFile & {footage: "actual" | "concept"};
type VehicleClips = {
  exterior?: VehicleClip;
  interior?: VideoFile & {footage: "actual"};
  "scenic-driving"?: VehicleClip;
};

type Ride = {
  name: string;
  model: string | null;
  description: string;
  photo: Photo | null;
  sampleDailyRateUsd: number;
  verifiedPassengerCapacity: number | null;
  verifiedLuggageCapacity: number | null;
  clips: VehicleClips;
};

// Capacity counts passengers excluding the driver, and standard suitcases.
export const rides: Record<RideId, Ride> = {
  van: {
    name: "Private Van",
    model: "White Nissan Caravan E25",
    description: "Travel in Nishaka’s white Nissan Caravan E25, whether you need an airport pickup or a driver for a trip across the island.",
    photo: photos.vehicle,
    sampleDailyRateUsd: 80,
    verifiedPassengerCapacity: null,
    verifiedLuggageCapacity: null,
    clips: {},
  },
  car: {
    name: "Private Car",
    model: null,
    description: "Enquire about a private car for your airport transfer or journey around Sri Lanka. Confirm the vehicle and luggage arrangements with Nishaka before booking.",
    photo: null,
    sampleDailyRateUsd: 60,
    verifiedPassengerCapacity: null,
    verifiedLuggageCapacity: null,
    clips: {},
  },
};
