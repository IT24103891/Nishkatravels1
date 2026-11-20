import {useCopy} from "@/i18n/copy";
export default function Loading() {
  const copy = useCopy();
  return <div className="section wrap" role="status">{copy("Loading your page…")}</div>;
}
