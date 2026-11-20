import type {ReactNode} from "react";

export function SectionHeading({eyebrow, title, children}: {eyebrow?: string; title: string; children?: ReactNode}) {
  return <div className="section-heading">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </div>;
}
