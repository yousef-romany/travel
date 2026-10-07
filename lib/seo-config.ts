export const SITE_NAME = "ZoeHoliday";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com"
).replace(/\/+$/, "");

export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg";

export const BUSINESS = {
  name: SITE_NAME,
  email: "info@zoeholidays.com",
  telephone: "+201555100961",
  locality: "Cairo",
  country: "EG",
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function plainText(value?: string | null): string {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function metaDescription(
  value: string | null | undefined,
  fallback: string,
  maxLength = 160,
): string {
  const text = plainText(value) || fallback;
  if (text.length <= maxLength) return text;

  const shortened = text.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 100 ? lastSpace : undefined)}…`;
}
