import type {Copy, CopyValues} from "./copy";

export function englishCopy(source: string, values?: CopyValues) {
  return source.replace(/\{(\w+)(?:, number)?\}/g, (token, name: string) => values?.[name]?.toString() ?? token);
}

export function bilingualEnquiry(locale: string, build: (copy: Copy, locale: string) => string, copy: Copy) {
  const localized = build(copy, locale);
  return locale === "en" ? localized : localized + "\n\n--- English summary ---\n" + build(englishCopy, "en");
}

