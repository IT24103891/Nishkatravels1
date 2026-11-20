import {useLocale} from "next-intl";
import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";
import {Instagram} from "lucide-react";
import {Brand} from "./Navbar";
import {business, navigation} from "@/lib/business";

export function Footer() {
  const copy = useCopy();
  const number = new Intl.NumberFormat(useLocale(), {useGrouping: false});
  return <footer className="footer">
    <div className="wrap footer-main">
      <div><Brand /><p>{copy("Private driver-guided journeys across Sri Lanka for couples, families and small groups.")}</p></div>
      <div><h2>{copy("Explore")}</h2><nav aria-label={copy("Footer navigation")} className="footer-links">{navigation.slice(1).map(({href,label}) => <Link key={href} href={href}>{copy(label)}</Link>)}</nav></div>
      <div><h2>{copy("Follow the journey")}</h2><a className="social" href={business.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} aria-hidden="true" /> {business.instagramHandle}</a></div>
    </div>
    <div className="wrap footer-bottom"><span>© {number.format(new Date().getFullYear())} {business.name}</span><Link href="/photo-credits">{copy("Photo credits")}</Link></div>
  </footer>;
}
