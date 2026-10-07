import axios from "axios";
import { resolveBySlugThenField } from "./resolve";

export const fetchInspirationCategories = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/inspire-categories?populate=*`;

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

export const fetchInspirationOneCategory = async (name: string) => {
  try {
    return await resolveBySlugThenField({
      collection: "inspire-categories",
      query: name,
      legacyField: "categoryName",
      populate:
        `&populate[image]=true` +
        `&populate[inspire_subcategories][populate][image]=true` +
        `&populate[inspire_subcategories][populate][inspire_blogs][populate][image]=true`,
    });
  } catch (error) {
    console.error("Error fetching inspiration category:", error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};


export const fetchInspirationOneSubCategory = async (name: string) => {
  try {
    return await resolveBySlugThenField({
      collection: "inspire-subcategories",
      query: name,
      legacyField: "categoryName",
      populate:
        `&populate[image]=true` +
        `&populate[inspire_blogs][populate][image]=true`,
    });
  } catch (error) {
    console.error("Error fetching inspiration subcategory:", error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};
// fetchInspirationOneSubCategory

export const fetchInspirationOneBlog = async (name: string) => {
  try {
    return await resolveBySlugThenField({
      collection: "inspire-blogs",
      query: name,
      legacyField: "title",
      populate: `&populate=*`,
    });
  } catch (error) {
    console.error("Error fetching inspiration blog:", error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};