export interface Photo {
  src: string;
  alt: string;
}

export const photos = {
  hero: {src: "/images/hero/sigiriya.jpg", alt: "Illustrated sunrise over Sigiriya rock and the surrounding forest"},
  ella: {src: "/images/destinations/ella.jpg", alt: "Illustration of Nine Arches Bridge among the green hills near Ella"},
  coast: {src: "/images/destinations/coast.jpg", alt: "Illustration of Galle’s white lighthouse above the southern coast"},
  yala: {src: "/images/destinations/yala.jpg", alt: "Illustration of a Sri Lankan leopard on a boulder in Yala National Park"},
  safari: {src: "/images/destinations/safari.jpg", alt: "Illustration of an elephant and calf in the grasslands of Udawalawe"},
  cultural: {src: "/images/tours/cultural.jpg", alt: "Illustration of Sigiriya rock viewed from the water gardens"},
  mirissa: {src: "/images/destinations/mirissa.jpg", alt: "Illustrated aerial view of a palm-lined Sri Lankan beach"},
  portrait: {src: "/images/nishaka/hill-country.jpg", alt: "Nishaka standing on a lawn with the Ambewela hills behind him"},
  vehicle: {src: "/images/vehicle/waterfall.jpg", alt: "Nishaka beside a white Nissan Caravan E25 near a waterfall"},
} satisfies Record<string, Photo>;
