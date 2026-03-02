import axios from "axios";

export const fetchPlaceToGoCategories = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-categories?populate=*`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching inspiration categories:", error || error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};

export const fetchPlaceToGoCategoriesOneCategory = async (name: string) => {
  // https://dashboard.zoeholidays.com/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url =
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-categories` +
      `?filters[categoryName][$eq]=${encodeURIComponent(name)}` +
      `&populate[image]=true` +
      `&populate[place_to_go_subcategories][populate][image]=true` +
      `&populate[place_to_go_subcategories][populate][place_to_go_blogs][populate][image]=true`;



    const response = await axios.get(String(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inspiration categories:", error || error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};

export const fetchPlaceToOneSubCategory = async (name: string) => {
  // https://dashboard.zoeholidays.com/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url =
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-subcategories` +
      `?filters[categoryName][$eq]=${encodeURIComponent(name)}` +
      `&populate[image]=true` +
      `&populate[place_to_go_blogs][populate][image]=true`;

    const response = await axios.get(String(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching place to go subcategory:", error || error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};

export const fetchPlaceToGoOneBlog = async (name: string) => {
  // https://dashboard.zoeholidays.com/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs?filters[title][$eq]=${encodeURIComponent(name)}&populate=*`;

    const response = await axios.get(String(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inspiration categories:", error || error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};

// ========== CUSTOM SERVICE ENDPOINTS ==========

/**
 * Fetch blogs by category
 * GET /api/place-to-go-blogs/by-category/:categoryId
 */
export const fetchPlaceToGoBlogsByCategory = async (categoryId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/by-category/${categoryId}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    throw error;
  }
};

/**
 * Fetch blogs by subcategory
 * GET /api/place-to-go-blogs/by-subcategory/:subcategoryId
 */
export const fetchPlaceToGoBlogsBySubcategory = async (subcategoryId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/by-subcategory/${subcategoryId}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by subcategory:", error);
    throw error;
  }
};

/**
 * Fetch nearby blogs
 * GET /api/place-to-go-blogs/nearby?lat=30.0444&lng=31.2357&radius=50
 */
export const fetchNearbyPlaceToGoBlogs = async (
  lat: number,
  lng: number,
  radius: number = 50
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching nearby blogs:", error);
    throw error;
  }
};

/**
 * Fetch blogs by price range
 * GET /api/place-to-go-blogs/by-price?min=100&max=1000
 */
export const fetchPlaceToGoBlogsByPrice = async (minPrice: number, maxPrice: number) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/by-price?min=${minPrice}&max=${maxPrice}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by price range:", error);
    throw error;
  }
};

/**
 * Fetch featured blogs
 * GET /api/place-to-go-blogs/featured?limit=10
 */
export const fetchFeaturedPlaceToGoBlogs = async (limit: number = 10) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/featured?limit=${limit}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    throw error;
  }
};

/**
 * Search blogs
 * GET /api/place-to-go-blogs/search?q=search-term
 */
export const searchPlaceToGoBlogs = async (query: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/search?q=${encodeURIComponent(query)}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error searching blogs:", error);
    throw error;
  }
};

/**
 * Get blog with full details
 * GET /api/place-to-go-blogs/:id/full-details
 */
export const fetchPlaceToGoBlogFullDetails = async (id: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/${id}/full-details`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blog full details:", error);
    throw error;
  }
};

/**
 * Fetch blogs by program
 * GET /api/place-to-go-blogs/by-program/:programId
 */
export const fetchPlaceToGoBlogsByProgram = async (programId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/by-program/${programId}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by program:", error);
    throw error;
  }
};

/**
 * Fetch blogs with Instagram posts
 * GET /api/place-to-go-blogs/with-instagram
 */
export const fetchPlaceToGoBlogsWithInstagram = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/with-instagram`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs with Instagram posts:", error);
    throw error;
  }
};

/**
 * Get blog statistics
 * GET /api/place-to-go-blogs/statistics
 */
export const fetchPlaceToGoBlogStatistics = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs/statistics`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blog statistics:", error);
    throw error;
  }
};
