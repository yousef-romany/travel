import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface HeroStats {
  totalPrograms: number;
  averageRating: number;
  totalDestinations: number;
}

/**
 * Fetch statistics for the hero section
 */
export const fetchHeroStats = async (): Promise<HeroStats> => {
  try {
    // Fetch programs to get total count and average rating
    const programsUrl = `${API_URL}/api/programs?pagination[limit]=1000&fields[0]=rating`;

    const programsResponse = await axios.get(programsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      timeout: 10000,
    });

    const programs = programsResponse.data.data;
    const totalPrograms = programsResponse.data.meta?.pagination?.total || programs.length;

    // Calculate average rating
    const ratings = programs.map((p: any) => p.rating || 0).filter((r: number) => r > 0);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      : 0;

    // Fetch destinations count (place-to-go-subcategories)
    const destinationsUrl = `${API_URL}/api/place-to-go-subcategories?pagination[limit]=1000&fields[0]=categoryName`;

    const destinationsResponse = await axios.get(destinationsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      timeout: 10000,
    });

    const totalDestinations = destinationsResponse.data.meta?.pagination?.total || destinationsResponse.data.data.length;

    return {
      totalPrograms,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalDestinations,
    };
  } catch (error: any) {
    console.error("Error fetching hero stats:", error);

    // Return default values on error
    return {
      totalPrograms: 0,
      averageRating: 0,
      totalDestinations: 0,
    };
  }
};
