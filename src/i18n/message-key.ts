// Prefixes make dictionary entries recognizable. The suffix distinguishes similar copy.
export function messageKey(source: string) {
  const prefix = source.toLowerCase().match(/[a-z0-9]+/g)?.slice(0,4).join("_") ?? "copy";
  let hash = 2166136261;
  for (let i = 0; i < source.length; i++) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
  return prefix + "_" + (hash >>> 0).toString(36);
}
