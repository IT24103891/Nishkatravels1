import {useCopy} from "@/i18n/copy";
import {Plus} from "lucide-react";
import {faqs} from "@/data/faq";

export function FAQ({items = faqs}: {items?: typeof faqs}) {
  const copy = useCopy();
  return <div className="faq">
    {items.map(({question,answer}) => <details key={question}>
      <summary>{copy(question)}<Plus size={19} aria-hidden="true" /></summary>
      <p>{copy(answer)}</p>
    </details>)}
  </div>;
}
