import type {MetadataRoute} from "next";
import {locales} from "@/i18n/routing";
import {alternateUrls, localizedPath} from "@/lib/seo";
import {navigation, siteUrl} from "@/lib/business";
import {tours} from "@/data/tours";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const paths = [...navigation.map(item => item.href), "/photo-credits", ...tours.map(tour => `/tours/${tour.slug}`)];
  return paths.flatMap(path => locales.map(locale => ({
    url: new URL(localizedPath(locale, path), siteUrl).href,
    alternates: {languages: alternateUrls(path)},
  })));
}
