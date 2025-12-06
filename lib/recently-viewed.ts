// lib/recently-viewed.ts

export interface RecentlyViewedProgram {
  id: number;
  documentId: string;
  title: string;
  price: number;
  duration: number;
  Location: string;
  rating: number;
  imageUrl?: string;
  viewedAt: string;
}

const STORAGE_KEY = "recentlyViewedPrograms";
const MAX_ITEMS = 10;

/**
 * Add a program to recently viewed list
 */
export function addToRecentlyViewed(program: Omit<RecentlyViewedProgram, "viewedAt">): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getRecentlyViewed();

    // Remove if already exists
    const filtered = existing.filter((item) => item.documentId !== program.documentId);

    // Add to beginning with current timestamp
    const updated = [
      {
        ...program,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS); // Keep only MAX_ITEMS

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event to notify components
    window.dispatchEvent(new Event("recentlyViewedUpdated"));
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
  }
}

/**
 * Get recently viewed programs
 */
export function getRecentlyViewed(): RecentlyViewedProgram[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const items: RecentlyViewedProgram[] = JSON.parse(stored);

    // Filter out items older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filtered = items.filter((item) => {
      const viewedDate = new Date(item.viewedAt);
      return viewedDate > thirtyDaysAgo;
    });

    // Update storage if any items were filtered out
    if (filtered.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    return filtered;
  } catch (error) {
    console.error("Error getting recently viewed:", error);
    return [];
  }
}

/**
 * Clear recently viewed programs
 */
export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing recently viewed:", error);
  }
}

/**
 * Remove a specific program from recently viewed
 */
export function removeFromRecentlyViewed(documentId: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter((item) => item.documentId !== documentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing from recently viewed:", error);
  }
}
