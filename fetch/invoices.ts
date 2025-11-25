// fetch/invoices.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface InvoiceType {
  id: number;
  documentId: string;
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripName: string;
  tripDate: string;
  tripDuration: number;
  numberOfTravelers: number;
  pricePerPerson: number;
  totalAmount: number;
  pdfUrl?: string;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface InvoicesResponse {
  data: InvoiceType[];
  meta: Meta;
}

// Fetch all invoices for the current user
export const fetchUserInvoices = async (
  userId?: string
): Promise<InvoicesResponse> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    let url = `${API_URL}/api/invoices?populate=*&sort=createdAt:desc`;

    if (userId) {
      url += `&filters[user][documentId][$eq]=${userId}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken || API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (invoiceData: {
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripName: string;
  tripDate: string;
  tripDuration: number;
  numberOfTravelers: number;
  pricePerPerson: number;
  totalAmount: number;
  pdfUrl?: string;
  userId?: string;
}): Promise<{ data: InvoiceType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.post(
      `${API_URL}/api/invoices`,
      {
        data: {
          invoiceNumber: invoiceData.invoiceNumber,
          bookingId: invoiceData.bookingId,
          customerName: invoiceData.customerName,
          customerEmail: invoiceData.customerEmail,
          customerPhone: invoiceData.customerPhone,
          tripName: invoiceData.tripName,
          tripDate: invoiceData.tripDate,
          tripDuration: invoiceData.tripDuration,
          numberOfTravelers: invoiceData.numberOfTravelers,
          pricePerPerson: invoiceData.pricePerPerson,
          totalAmount: invoiceData.totalAmount,
          pdfUrl: invoiceData.pdfUrl,
          status: "pending",
          user: invoiceData.userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Fetch a single invoice by ID
export const fetchInvoiceById = async (
  invoiceId: string
): Promise<{ data: InvoiceType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.get(
      `${API_URL}/api/invoices/${invoiceId}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

// Update invoice status
export const updateInvoiceStatus = async (
  invoiceId: string,
  status: "pending" | "paid" | "cancelled"
): Promise<{ data: InvoiceType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.put(
      `${API_URL}/api/invoices/${invoiceId}`,
      {
        data: { status },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating invoice status:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Update invoice PDF URL
export const updateInvoicePdfUrl = async (
  invoiceId: string,
  pdfUrl: string
): Promise<{ data: InvoiceType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.put(
      `${API_URL}/api/invoices/${invoiceId}`,
      {
        data: { pdfUrl },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating invoice PDF URL:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
