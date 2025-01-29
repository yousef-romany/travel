import axios from "axios";

export const fetchInspirationCategories = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/inspire-categories?populate=*`;

    console.log("Request URL:", url);

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
  // http://localhost:1337/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/inspire-categories?filters[categoryName][$eq]=${name}&populate[inspire_subcategories][populate]=*`;

    const response = await axios.get(String(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });
    console.log("data slug : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching inspiration categories:", error || error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};


export const fetchInspirationOneSubCategory = async (name: string) => {
  // http://localhost:1337/api/inspire-categories?filters[categoryName][$eq]=culture&populate=*
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/inspire-subCategories?filters[categoryName][$eq]=${name}&populate=*`;

    const response = await axios.get(String(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN ?? ""}`,
      },
    });
    console.log("data slug : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching inspiration categories:", error || error);
    throw error; // Re-throw for higher-level error handling if needed
  }
};
// fetchInspirationOneSubCategory