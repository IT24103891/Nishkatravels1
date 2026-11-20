import type {Metadata} from "next";
import {getLocale} from "next-intl/server";
import {getCopy} from "@/i18n/server";
import {languageTags, locales, type Locale} from "@/i18n/routing";
import {business, siteUrl} from "./business";
import {photos, type Photo} from "@/data/photos";

export function localizedPath(locale: string, path: string) {
  return "/" + locale + (path === "/" ? "" : path);
}

export function alternateUrls(path: string) {
  const forLocale = (locale: Locale) => {
    const localized = localizedPath(locale, path);
    return siteUrl ? new URL(localized, siteUrl).href : localized;
  };
  return {...Object.fromEntries(locales.map(locale => [languageTags[locale], forLocale(locale)])), "x-default": forLocale("en")};
}

const socialLocales: Record<Locale, string> = {en: "en_US", ja: "ja_JP", zh: "zh_CN", hi: "hi_IN", ta: "ta_IN"};

export async function pageMetadata(title: string, description: string, path: string, photo: Photo = photos.hero): Promise<Metadata> {
  const [locale, copy] = await Promise.all([getLocale(), getCopy()]);
  const language = locale as Locale;
  const localizedTitle = copy(title);
  const localizedDescription = copy(description);
  const fullTitle = `${localizedTitle} | ${business.name}`;
  const canonical = localizedPath(locale, path);
  return {
    title: localizedTitle, description: localizedDescription,
    alternates: {canonical, languages: alternateUrls(path)},
    openGraph: {
      title: fullTitle, description: localizedDescription, siteName: business.name, type: "website", locale: socialLocales[language],
      alternateLocale: locales.filter(item => item !== language).map(item => socialLocales[item]),
      url: canonical, images: [{url: photo.src, alt: copy(photo.alt)}],
    },
    twitter: {card: "summary_large_image", title: fullTitle, description: localizedDescription, images: [photo.src]},
  };
}
