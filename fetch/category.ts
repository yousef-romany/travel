import axios from "axios";

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
  // https://dashboard.zoeholidays.com/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
const url =
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/inspire-categories` +
  `?filters[categoryName][$eq]=${encodeURIComponent(name)}` +
  `&populate[image]=true` + 
  `&populate[inspire_subcategories][populate][image]=true` +
  `&populate[inspire_subcategories][populate][inspire_blogs][populate][image]=true`;



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


export const fetchInspirationOneSubCategory = async (name: string) => {
  try {
    const url =
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/inspire-subcategories` +
      `?filters[categoryName][$eq]=${encodeURIComponent(name)}` +
      `&populate[image]=true` +
      `&populate[inspire_blogs][populate][image]=true`;

    const response = await axios.get(String(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inspiration subcategory:", error || error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};
// fetchInspirationOneSubCategory

export const fetchInspirationOneBlog = async (name: string) => {
  // https://dashboard.zoeholidays.com/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/inspire-blogs?filters[title][$eq]=${name}&populate=*`;

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