import {useMemo} from "react";
import {useTranslations} from "next-intl";
import {messageKey} from "./message-key";

export type CopyValues = Record<string, string | number>;
export type Copy = (source: string, values?: CopyValues) => string;
type Translator = ReturnType<typeof useTranslations<"Copy">>;

export function makeCopy(t: Translator): Copy {
  return (source, values) => {
    const key = messageKey(source);
    if (t.has(key)) return t(key, values);
    return source.replace(/\{(\w+)(?:, number)?\}/g, (token, name: string) => values?.[name]?.toString() ?? token);
  };
}

export function useCopy() {
  const t = useTranslations("Copy");
  return useMemo(() => makeCopy(t), [t]);
}
