// lib/saved-searches.ts

export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    searchTerm?: string;
    priceRange?: number[];
    duration?: string;
    difficulty?: string;
    language?: string;
    groupSize?: string;
    location?: string;
  };
  sortBy?: string;
  createdAt: string;
  lastUsed?: string;
}

const STORAGE_KEY = "savedSearches";
const MAX_SAVED_SEARCHES = 10;

/**
 * Save a search with filters
 */
export function saveSearch(
  name: string,
  filters: SavedSearch["filters"],
  sortBy?: string
): SavedSearch {
  if (typeof window === "undefined") {
    throw new Error("Cannot save search on server side");
  }

  try {
    const existing = getSavedSearches();

    // Create new search
    const newSearch: SavedSearch = {
      id: generateId(),
      name,
      filters,
      sortBy,
      createdAt: new Date().toISOString(),
    };

    // Add to beginning, limit to MAX_SAVED_SEARCHES
    const updated = [newSearch, ...existing].slice(0, MAX_SAVED_SEARCHES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newSearch;
  } catch (error) {
    console.error("Error saving search:", error);
    throw error;
  }
}

/**
 * Get all saved searches
 */
export function getSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored);
  } catch (error) {
    console.error("Error getting saved searches:", error);
    return [];
  }
}

/**
 * Get a saved search by ID
 */
export function getSavedSearchById(id: string): SavedSearch | null {
  const searches = getSavedSearches();
  return searches.find((search) => search.id === id) || null;
}

/**
 * Delete a saved search
 */
export function deleteSavedSearch(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getSavedSearches();
    const filtered = existing.filter((search) => search.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting saved search:", error);
  }
}

/**
 * Update last used timestamp
 */
export function markSearchAsUsed(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getSavedSearches();
    const updated = existing.map((search) =>
      search.id === id
        ? { ...search, lastUsed: new Date().toISOString() }
        : search
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error marking search as used:", error);
  }
}

/**
 * Clear all saved searches
 */
export function clearSavedSearches(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing saved searches:", error);
  }
}

/**
 * Rename a saved search
 */
export function renameSavedSearch(id: string, newName: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getSavedSearches();
    const updated = existing.map((search) =>
      search.id === id ? { ...search, name: newName } : search
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error renaming saved search:", error);
  }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Store current filter state to localStorage for persistence
 */
export function persistFilterState(filters: any, key: string = "currentFilters"): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(filters));
  } catch (error) {
    console.error("Error persisting filter state:", error);
  }
}

/**
 * Restore filter state from localStorage
 */
export function restoreFilterState(key: string = "currentFilters"): any | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    return JSON.parse(stored);
  } catch (error) {
    console.error("Error restoring filter state:", error);
    return null;
  }
}

/**
 * Clear persisted filter state
 */
export function clearFilterState(key: string = "currentFilters"): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing filter state:", error);
  }
}
