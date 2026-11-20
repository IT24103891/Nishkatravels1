import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";
import {Hero} from "@/components/Hero";

export default function NotFound() {
  const copy = useCopy();
  return <Hero title={copy("This page took a detour")} eyebrow={copy("Page not found")} description={copy("Explore the sample tours or head back to the home page.")}>
    <Link href="/" className="button button-gold">{copy("Back to Home")}</Link><Link href="/tours" className="button button-light">{copy("Explore Tours")}</Link>
  </Hero>;
}
