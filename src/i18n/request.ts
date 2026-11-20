import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import {routing, type Locale} from "./routing";

const dictionaries = {
  en: () => import("../../messages/en.json"),
  ja: () => import("../../messages/ja.json"),
  zh: () => import("../../messages/zh.json"),
  hi: () => import("../../messages/hi.json"),
  ta: () => import("../../messages/ta.json"),
} satisfies Record<Locale, () => Promise<unknown>>;

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {locale, messages: (await dictionaries[locale]()).default, timeZone: "UTC"};
});
