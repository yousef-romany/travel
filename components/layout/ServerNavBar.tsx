import { fetchInspirationCategories } from "@/fetch/category";
import { fetchPlaceToGoCategories } from "@/fetch/placesToGo";
import NavBar from "./NavBar";

/**
 * Server component wrapper for NavBar that fetches navigation data server-side
 * This ensures navigation links are in the initial HTML for SEO
 */
export default async function ServerNavBar() {
  // Fetch both category types in parallel with error handling
  const [inspirationResult, placesResult] = await Promise.allSettled([
    fetchInspirationCategories(),
    fetchPlaceToGoCategories(),
  ]);

  // Extract data with graceful fallbacks
  const inspirationCategories =
    inspirationResult.status === 'fulfilled' && inspirationResult.value?.data
      ? inspirationResult.value.data
      : [];

  const placesCategories =
    placesResult.status === 'fulfilled' && placesResult.value?.data
      ? placesResult.value.data
      : [];

  return (
    <NavBar
      inspirationCategories={inspirationCategories}
      placesCategories={placesCategories}
    />
  );
}
