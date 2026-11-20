"use client";

import {useLocale} from "next-intl";
import {bilingualEnquiry} from "@/i18n/enquiry";
import {formatDate} from "@/i18n/format";
import {useCopy} from "@/i18n/copy";
import {useState, type FormEvent} from "react";
import {ChevronDown, MessageCircle} from "lucide-react";
import {tours} from "@/data/tours";
import {whatsappNumber, whatsappUrl} from "@/lib/business";

export function TripEnquiryForm({initialTour = "Custom itinerary"}: {initialTour?: string}) {
  const copy = useCopy();
  const locale = useLocale();
  const [messageLink, setMessageLink] = useState<string | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    function value(field: string) {
      return String(data.get(field) ?? "").trim();
    }
    const message = bilingualEnquiry(locale, (t, language) => {
      const text = (field: string) => value(field) || t("To be discussed");
      return [
        t("Hello Nishaka, I’d like to enquire about private travel in Sri Lanka."),
        "",
        t("Name: {value}", {value: text("name")}),
        t("Travel date: {value}", {value: value("date") ? formatDate(value("date"), language) : text("date")}),
        t("Travelers: {count, number}", {count: Number(value("travelers"))}),
        t("Pickup location: {value}", {value: text("pickup")}),
        t("Tour or transfer: {value}", {value: t(text("tour"))}),
        t("Trip duration: {value}", {value: text("duration")}),
        t("Additional requirements: {value}", {value: text("requirements")}),
      ].join("\n");
    }, copy);
    const href = whatsappUrl(message);
    if (!href) return;
    setMessageLink(href);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return <form lang={locale === "zh" ? "zh-Hans" : locale} className="enquiry-form" onSubmit={submit} onChange={event => { setMessageLink(null); const field = event.target; if (field instanceof HTMLInputElement) field.setCustomValidity(""); }} onInvalid={event => { const field = event.target; if (field instanceof HTMLInputElement) field.setCustomValidity(copy(field.validity.valueMissing ? "Please fill out this field." : "Please enter a valid value.")); }}>
    <div className="fields">
      <label>{copy("Your name")} <input autoComplete="name" name="name" required maxLength={100} placeholder={copy("Full name")} /></label>
      <label>{copy("Travel date")} <input type="date" name="date" /></label>
      <label>{copy("Number of travelers")} <input name="travelers" type="number" required min={1} step={1} placeholder={copy("e.g. 2")} /></label>
      <label>{copy("Pickup location")} <input name="pickup" required maxLength={150} placeholder={copy("Airport, hotel or city")} /></label>
      <label>{copy("Tour or transfer")} <span className="select-wrap"><select name="tour" defaultValue={initialTour}>
        <option value="Custom itinerary">{copy("Custom itinerary")}</option><option value="Airport transfer">{copy("Airport transfer")}</option><option value="Islandwide transfer">{copy("Islandwide transfer")}</option>
        {tours.map(tour => <option key={tour.slug} value={tour.title}>{copy(tour.title)}</option>)}
      </select><ChevronDown size={16} aria-hidden="true" /></span></label>
      <label>{copy("Trip duration")} <input name="duration" maxLength={60} placeholder={copy("e.g. 6 days")} /></label>
      <label className="wide">{copy("Additional requirements")} <textarea name="requirements" maxLength={1000} rows={4} placeholder={copy("Tell us about your route, luggage or any needs for your group.")} /></label>
    </div>
    {!whatsappNumber && <p className="notice" id="whatsapp-setup">{copy("WhatsApp enquiries are unavailable. Site setup requires an international number in")} <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code>.</p>}
    <button type="submit" className="button button-dark" disabled={!whatsappNumber} aria-describedby={!whatsappNumber ? "whatsapp-setup" : undefined}><MessageCircle size={18} aria-hidden="true" /> {copy("Open WhatsApp enquiry")}</button>
    {messageLink && <p role="status">{copy("Your draft is ready.")} <a href={messageLink} target="_blank" rel="noopener noreferrer">{copy("Open in WhatsApp")}</a> {copy("and send it to begin the enquiry.")}</p>}
    <p className="muted">{copy("Your message asks about availability and does not confirm a booking.")}</p>
  </form>;
}
