import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Upload a file (like PDF) to Strapi and return the file URL
 */
export const uploadFileToStrapi = async (
  file: Blob,
  filename: string
): Promise<string> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const formData = new FormData();
    formData.append("files", file, filename);

    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Strapi returns an array of uploaded files
    if (response.data && response.data.length > 0) {
      const uploadedFile = response.data[0];
      // Return the full URL
      return `${API_URL}${uploadedFile.url}`;
    }

    throw new Error("File upload failed: No file returned");
  } catch (error: any) {
    console.error("Error uploading file to Strapi:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
