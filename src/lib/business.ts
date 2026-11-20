export const business = {
  name: "Nishaka Private Tours",
  tagline: "Discover Sri Lanka. Travel Your Way.",
  instagram: "https://www.instagram.com/ni_ki_a_sulan/",
  instagramHandle: "@ni_ki_a_sulan",
  vehicle: "Nissan Caravan E25",
  country: "Sri Lanka",
};

const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
export const whatsappNumber = /^[1-9]\d{6,14}$/.test(configuredNumber) ? configuredNumber : "";

export function whatsappUrl(message: string) {
  return whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : null;
}

function configuredSiteUrl() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "");
    return /^https?:$/.test(url.protocol) ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

export const siteUrl = configuredSiteUrl();
export const navigation = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/trip-planner", label: "Trip Planner" },
  { href: "/about", label: "About" },
  { href: "/vehicle", label: "Our Vehicle" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];
