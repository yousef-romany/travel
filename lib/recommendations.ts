// lib/recommendations.ts
import { ProgramType } from "@/fetch/programs";

/**
 * Calculate similarity score between two programs
 */
function calculateSimilarity(program1: ProgramType, program2: ProgramType): number {
  let score = 0;

  // Location similarity (40% weight)
  if (program1.Location === program2.Location) {
    score += 40;
  }

  // Price similarity (20% weight) - within 30% range
  const priceDiff = Math.abs(program1.price - program2.price);
  const avgPrice = (program1.price + program2.price) / 2;
  const pricePercentDiff = (priceDiff / avgPrice) * 100;
  if (pricePercentDiff < 30) {
    score += 20 * (1 - pricePercentDiff / 30);
  }

  // Duration similarity (20% weight) - within 3 days
  const durationDiff = Math.abs(program1.duration - program2.duration);
  if (durationDiff <= 3) {
    score += 20 * (1 - durationDiff / 3);
  }

  // Rating similarity (20% weight)
  const ratingDiff = Math.abs(program1.rating - program2.rating);
  if (ratingDiff < 1) {
    score += 20 * (1 - ratingDiff);
  }

  return score;
}

/**
 * Get recommended programs based on a current program
 */
export function getRecommendedPrograms(
  currentProgram: ProgramType,
  allPrograms: ProgramType[],
  limit: number = 4
): ProgramType[] {
  // Filter out the current program
  const otherPrograms = allPrograms.filter(
    (p) => p.documentId !== currentProgram.documentId
  );

  // Calculate similarity scores
  const programsWithScores = otherPrograms.map((program) => ({
    program,
    score: calculateSimilarity(currentProgram, program),
  }));

  // Sort by score (highest first)
  programsWithScores.sort((a, b) => b.score - a.score);

  // Return top programs
  return programsWithScores.slice(0, limit).map((item) => item.program);
}

/**
 * Get personalized recommendations based on user's viewed programs and wishlist
 */
export function getPersonalizedRecommendations(
  viewedPrograms: ProgramType[],
  wishlistPrograms: ProgramType[],
  allPrograms: ProgramType[],
  limit: number = 6
): ProgramType[] {
  if (viewedPrograms.length === 0 && wishlistPrograms.length === 0) {
    // Return highest rated programs if no history
    return allPrograms
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  const userPrograms = [...wishlistPrograms, ...viewedPrograms];
  const viewedIds = new Set(userPrograms.map((p) => p.documentId));

  // Calculate average user preferences
  const avgPrice =
    userPrograms.reduce((sum, p) => sum + p.price, 0) / userPrograms.length;
  const avgDuration =
    userPrograms.reduce((sum, p) => sum + p.duration, 0) / userPrograms.length;

  // Find locations user is interested in
  const locationCounts: Record<string, number> = {};
  userPrograms.forEach((p) => {
    locationCounts[p.Location] = (locationCounts[p.Location] || 0) + 1;
  });
  const favoriteLocations = Object.entries(locationCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([location]) => location);

  // Score all programs
  const recommendations = allPrograms
    .filter((p) => !viewedIds.has(p.documentId))
    .map((program) => {
      let score = 0;

      // Favorite location bonus (30%)
      const locationIndex = favoriteLocations.indexOf(program.Location);
      if (locationIndex >= 0) {
        score += 30 * (1 - locationIndex / favoriteLocations.length);
      }

      // Price match (25%)
      const priceDiff = Math.abs(program.price - avgPrice);
      const priceScore = Math.max(0, 1 - priceDiff / avgPrice);
      score += 25 * priceScore;

      // Duration match (20%)
      const durationDiff = Math.abs(program.duration - avgDuration);
      const durationScore = Math.max(0, 1 - durationDiff / avgDuration);
      score += 20 * durationScore;

      // Rating (25%)
      score += 25 * (program.rating / 5);

      return { program, score };
    });

  // Sort by score and return top programs
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.program);
}

/**
 * Get trending programs (most viewed recently)
 * Note: This is a placeholder. In production, you'd track views in the backend
 */
export function getTrendingPrograms(
  allPrograms: ProgramType[],
  limit: number = 6
): ProgramType[] {
  // For now, return highest rated programs
  // In production, this would use actual view count data from the backend
  return allPrograms
    .sort((a, b) => {
      // Sort by rating first, then by price (more expensive = more popular assumption)
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.price - a.price;
    })
    .slice(0, limit);
}
