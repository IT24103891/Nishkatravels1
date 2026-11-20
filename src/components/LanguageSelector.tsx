"use client";

import {Globe2} from "lucide-react";
import {useLocale} from "next-intl";
import {getPathname, usePathname} from "@/i18n/navigation";
import {localeNames, locales, languageTags} from "@/i18n/routing";
import {useCopy} from "@/i18n/copy";

export function LanguageSelector() {
  const copy = useCopy();
  const locale = useLocale();
  const pathname = usePathname();
  return <label className="language-selector">
    <Globe2 size={16} aria-hidden="true" />
    <span className="sr-only">{copy("Website language")}</span>
    <select value={locale} onChange={event => {
      const selected = locales.find(item => item === event.target.value);
      if (!selected || selected === locale) return;
      const {search, hash} = window.location;
      window.location.assign(getPathname({href: pathname, locale: selected}) + search + hash);
    }}>
      {locales.map(item => <option key={item} value={item} lang={languageTags[item]}>{localeNames[item]}</option>)}
    </select>
  </label>;
}
