import {getTranslations} from "next-intl/server";
import {makeCopy} from "./copy";

export async function getCopy() {
  return makeCopy(await getTranslations("Copy"));
}
