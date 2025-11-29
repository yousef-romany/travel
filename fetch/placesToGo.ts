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
  // http://localhost:1337/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
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
  // http://localhost:1337/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-subcategories?filters[categoryName][$eq]=${encodeURIComponent(name)}&populate=*`;

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
  // http://localhost:1337/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/place-to-go-blogs?filters[title][$eq]=${name}&populate=*`;

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
