import {useLocale} from "next-intl";
import {useCopy} from "./copy";

export const formatUsd = (amount: number, locale = "en") => new Intl.NumberFormat(locale, {
  style: "currency", currency: "USD", currencyDisplay: "code",
}).format(amount);

export function formatDate(iso: string, locale: string) {
  const date = new Date(iso + "T00:00:00Z");
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat(locale, {dateStyle: "medium", timeZone: "UTC"}).format(date) : iso;
}

export function useFormatting() {
  const locale = useLocale();
  const copy = useCopy();
  return {locale, copy, number: (value: number) => new Intl.NumberFormat(locale).format(value), money: (value: number) => formatUsd(value, locale)};
}
