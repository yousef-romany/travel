import axios from "axios";

export const fetchProgramsList = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/programs?populate=*`;

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
}
export const fetchProgramOne = async (title: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/programs?populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories&populate[includes]=true&populate[images]=true&populate[excludes]=true&filters[title][$eq]=${title}`;
    
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
}