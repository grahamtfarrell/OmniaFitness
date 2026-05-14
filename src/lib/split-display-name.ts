/** Split a single display name into first / last for Klaviyo (last falls back when mononym). */

const FALLBACK_LAST = "—";

export function splitDisplayName(raw: string): {
  firstName: string;
  lastName: string;
} {
  const t = raw.trim().replace(/\s+/g, " ");
  if (!t) return { firstName: "", lastName: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { firstName: t, lastName: FALLBACK_LAST };
  const last = t.slice(i + 1).trim();
  return { firstName: t.slice(0, i), lastName: last || FALLBACK_LAST };
}
