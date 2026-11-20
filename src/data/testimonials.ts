type Testimonial = {date: string; trip: string} & (
  | {status: "pending approval"}
  | {status: "approved"; quotation: string; sourceUrl: string; reviewer: string}
);

export const testimonials: Testimonial[] = [
  { status: "pending approval", date: "March 2026", trip: "Six-day family trip through Kandy, Nuwara Eliya, Mirissa and Colombo" },
];
