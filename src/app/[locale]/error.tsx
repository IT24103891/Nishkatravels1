"use client";
import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";

export default function ErrorPage({reset}: {reset: () => void}) {
  const copy = useCopy();
  return <section className="section"><div className="wrap compact"><h1>{copy("Something went wrong")}</h1><p>{copy("Retry this page or return to the home page.")}</p><div className="actions"><button type="button" className="button button-dark" onClick={reset}>{copy("Try Again")}</button><Link className="button button-outline" href="/">{copy("Go Home")}</Link></div></div></section>;
}
