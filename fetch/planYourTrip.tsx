import axios from "axios";

export const fetchPlanYourTrip = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/place-to-go-categories?populate[place_to_go_subcategories][populate]=place_to_go_blogs`;

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