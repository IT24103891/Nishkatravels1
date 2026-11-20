import {useLocale} from "next-intl";
import {bilingualEnquiry} from "@/i18n/enquiry";
import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";
import {MessageCircle} from "lucide-react";
import {whatsappUrl} from "@/lib/business";

export function WhatsAppButton({message = "Hello Nishaka, I’d like to enquire about a private trip in Sri Lanka.", label = "Enquire on WhatsApp", tour, floating = false, fallback = "/contact"}: {
  message?: string; label?: string; tour?: string; floating?: boolean; fallback?: string;
}) {
  const copy = useCopy();
  const locale = useLocale();
  const href = whatsappUrl(bilingualEnquiry(locale, t => tour ? t("Hello Nishaka, I’d like to enquire about the {tour} sample itinerary.", {tour:t(tour)}) : t(message), copy));
  const content = <><MessageCircle size={floating ? 22 : 17} aria-hidden="true" /> <span>{floating ? copy("WhatsApp") : copy(label)}</span></>;
  const className = floating ? "floating" : "button button-outline";
  return href
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{content}</a>
    : <Link className={className} href={fallback} aria-label={floating ? copy("Trip enquiry and WhatsApp setup status") : copy("Trip enquiry form")}>{floating ? content : copy("Trip enquiry")}</Link>;
}
