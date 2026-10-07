/**
 * Canonical internal URL builders.
 *
 * Every link into a detail route must go through these helpers so the whole
 * app agrees on which identifier a URL carries (the SEO slug, falling back to
 * the raw name/documentId for records created before slugs existed).
 *
 * Every argument accepts either an entity object or an already-resolved
 * segment string, so call sites can pass whatever they have.
 */

export interface Linkable {
  slug?: string | null;
  documentId?: string | number | null;
}

export interface LinkableCategory {
  slug?: string | null;
  categoryName?: string | null;
  documentId?: string | number | null;
}

export type SegmentLike =
  | string
  | null
  | undefined
  | Linkable
  | LinkableCategory;

/** Prefer the slug, fall back to the documentId. */
export function identityOf(entity?: Linkable | null): string | null {
  const slug = entity?.slug?.trim();
  if (slug) return slug;
  const documentId = String(entity?.documentId ?? "").trim();
  return documentId || null;
}

/** Prefer the slug, fall back to the categoryName. */
function categoryNameOf(category?: LinkableCategory | null): string | null {
  const slug = category?.slug?.trim();
  if (slug) return slug;
  const name = category?.categoryName?.trim();
  if (name) return name;
  const documentId = String(category?.documentId ?? "").trim();
  return documentId || null;
}

function segmentOf(segment?: SegmentLike): string {
  if (segment == null) return "";
  if (typeof segment === "string") return segment.trim();
  return categoryNameOf(segment) ?? "";
}

function identityOfSegment(segment?: SegmentLike): string {
  if (segment == null) return "";
  if (typeof segment === "string") return segment.trim();
  return identityOf(segment) ?? "";
}

export function programPath(program?: SegmentLike): string {
  return `/programs/${identityOfSegment(program)}`;
}

export function programBookPath(program?: SegmentLike): string {
  return `${programPath(program)}/book`;
}

export function eventPath(event?: SegmentLike): string {
  return `/events/${identityOfSegment(event)}`;
}

export function placeCategoryPath(category?: SegmentLike): string {
  return `/placesTogo/${segmentOf(category)}`;
}

export function placeSubCategoryPath(
  category?: SegmentLike,
  subCategory?: SegmentLike
): string {
  return `${placeCategoryPath(category)}/${segmentOf(subCategory)}`;
}

export function placeBlogPath(
  category?: SegmentLike,
  subCategory?: SegmentLike,
  blog?: SegmentLike
): string {
  return `${placeSubCategoryPath(category, subCategory)}/${identityOfSegment(blog)}`;
}

export function inspireCategoryPath(category?: SegmentLike): string {
  return `/inspiration/${segmentOf(category)}`;
}

export function inspireSubCategoryPath(
  category?: SegmentLike,
  subCategory?: SegmentLike
): string {
  return `${inspireCategoryPath(category)}/${segmentOf(subCategory)}`;
}

export function inspireBlogPath(
  category?: SegmentLike,
  subCategory?: SegmentLike,
  blog?: SegmentLike
): string {
  return `${inspireSubCategoryPath(category, subCategory)}/${identityOfSegment(blog)}`;
}

/** Percent-encode every segment of a helper-built path, leaving the slashes alone. */
export function encodePath(path: string): string {
  return path
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : segment))
    .join("/");
}
