// lib/comparison.ts
import { ProgramType } from "@/fetch/programs";

const STORAGE_KEY = "programComparison";
const MAX_ITEMS = 3;

export interface ComparisonProgram {
  id: number;
  documentId: string;
  title: string;
  price: number;
  duration: number;
  Location: string;
  rating: number;
  descraption: string;
  imageUrl?: string;
  addedAt: string;
}

/**
 * Add a program to comparison list
 */
export function addToComparison(program: Omit<ComparisonProgram, "addedAt">): boolean {
  if (typeof window === "undefined") return false;

  try {
    const existing = getComparisonList();

    // Check if already in list
    if (existing.some((p) => p.documentId === program.documentId)) {
      return false;
    }

    // Check if limit reached
    if (existing.length >= MAX_ITEMS) {
      throw new Error(`You can only compare up to ${MAX_ITEMS} programs at once`);
    }

    const updated = [
      ...existing,
      {
        ...program,
        addedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Get programs in comparison list
 */
export function getComparisonList(): ComparisonProgram[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored);
  } catch (error) {
    console.error("Error getting comparison list:", error);
    return [];
  }
}

/**
 * Remove a program from comparison list
 */
export function removeFromComparison(documentId: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getComparisonList();
    const filtered = existing.filter((p) => p.documentId !== documentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing from comparison:", error);
  }
}

/**
 * Clear comparison list
 */
export function clearComparison(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing comparison:", error);
  }
}

/**
 * Check if a program is in comparison list
 */
export function isInComparison(documentId: string): boolean {
  const list = getComparisonList();
  return list.some((p) => p.documentId === documentId);
}

/**
 * Get comparison count
 */
export function getComparisonCount(): number {
  return getComparisonList().length;
}
