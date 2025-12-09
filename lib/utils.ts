import { Media } from "@/type/programs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the best image URL from various sources
 * Handles both string URLs and Media objects with formats
 * @param source - Can be a string URL, Media object, or undefined
 * @param fallback - Fallback image URL (default: "/placeholder.svg?height=600&width=800")
 * @returns Full image URL
 */
export function getImageUrl(
  source: string | Media | undefined | null,
  fallback: string = "/placeholder.svg?height=600&width=800"
): string {
  // Handle null/undefined
  if (!source) return fallback;

  // Handle string URL
  if (typeof source === "string") {
    if (!source) return fallback;
    return source.startsWith("http") ? source : `${API_URL}${source}`;
  }

  // Handle Media object
  if (typeof source === "object" && "url" in source) {
    // Try to get the best format: large > medium > small > thumbnail > original
    const imageUrl =
      source.formats?.large?.url ||
      source.formats?.medium?.url ||
      source.formats?.small?.url ||
      source.formats?.thumbnail?.url ||
      source.url;

    if (!imageUrl) return fallback;
    return imageUrl.startsWith("http") ? imageUrl : `${API_URL}${imageUrl}`;
  }

  return fallback;
}

/**
 * Get image URL from a program object
 * @param program - Program object with images array
 * @param imageIndex - Index of the image to use (default: 0)
 * @param fallback - Fallback image URL
 * @returns Full image URL
 */
export function getProgramImageUrl(
  program: { images?: Media[] | { imageUrl?: string }[] } | undefined,
  imageIndex: number = 0,
  fallback: string = "/placeholder.svg?height=600&width=800"
): string {
  if (!program?.images || program.images.length === 0) {
    return fallback;
  }

  const image = program.images[imageIndex];

  if (!image) return fallback;

  // Handle both imageUrl property and Media object
  if ("imageUrl" in image && image.imageUrl) {
    return getImageUrl(image.imageUrl, fallback);
  }

  return getImageUrl(image as Media, fallback);
}