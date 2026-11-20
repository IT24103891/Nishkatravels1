import {useCopy} from "@/i18n/copy";
import {testimonials} from "@/data/testimonials";
import {SectionHeading} from "./SectionHeading";

export function Testimonials() {
  const copy = useCopy();
  const approved = testimonials.filter(review => review.status === "approved");
  if (!approved.length) return null;
  return <section className="section testimonial">
    <div className="wrap compact">
      <SectionHeading eyebrow={copy("Guest feedback")} title={copy("Stories from the road")} />
      {approved.map(review => <figure key={review.sourceUrl}>
        <blockquote>{copy(review.quotation)}</blockquote>
        <figcaption><a href={review.sourceUrl}>{review.reviewer} · {copy(review.trip)} · {copy(review.date)}</a></figcaption>
      </figure>)}
    </div>
  </section>;
}
