
import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
export const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface ContactSubmission {
    name: string;
    email: string;
    subject?: string;
    message: string;
}

export const submitContactForm = async (data: ContactSubmission) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/contact-submissions`,
            {
                data: {
                    ...data,
                    status: "new",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.error.message || "Failed to submit message");
        }
        throw new Error("An error occurred while sending your message");
    }
};
