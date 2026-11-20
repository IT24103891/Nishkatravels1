import {defineRouting} from "next-intl/routing";

export const locales = ["en", "ja", "zh", "hi", "ta"] as const;
export type Locale = (typeof locales)[number];
export const localeNames: Record<Locale, string> = {
  en: "English", ja: "日本語", zh: "简体中文", hi: "हिन्दी", ta: "தமிழ்",
};
export const languageTags: Record<Locale, string> = {
  en: "en", ja: "ja", zh: "zh-Hans", hi: "hi", ta: "ta",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
  alternateLinks: false,
});
