// fetch/social-shares.ts - Social share tracking API

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface SocialShare {
  id: number;
  platform: "facebook" | "twitter" | "whatsapp" | "email" | "linkedin" | "instagram" | "copy-link";
  contentType: "program" | "place" | "blog" | "custom";
  contentId: string;
  contentTitle?: string;
  url: string;
  createdAt: string;
}

export interface ShareStats {
  totalShares: number;
  byPlatform: Record<string, number>;
  recentShares: Array<{ platform: string; createdAt: string }>;
}

export interface GlobalShareStats {
  totalShares: number;
  byPlatform: Record<string, number>;
  byContentType: Record<string, number>;
  topSharedContent: Array<{
    contentId: string;
    contentTitle: string;
    shares: number;
  }>;
}

/**
 * Track a social share event
 */
export async function trackSocialShare(
  platform: SocialShare["platform"],
  contentType: SocialShare["contentType"],
  contentId: string,
  url: string,
  contentTitle?: string,
  metadata?: any
): Promise<{ success: boolean; shareId: number; message: string }> {
  try {
    const token = localStorage.getItem("authToken");

    const response = await axios.post(
      `${API_URL}/api/social-shares/track`,
      {
        platform,
        contentType,
        contentId,
        contentTitle,
        url,
        metadata,
      },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error tracking share:", error);
    throw error;
  }
}

/**
 * Get sharing statistics for specific content
 */
export async function getContentShareStats(
  contentType: string,
  contentId: string
): Promise<ShareStats> {
  const response = await axios.get(
    `${API_URL}/api/social-shares/content/${contentType}/${contentId}`
  );

  return response.data;
}

/**
 * Get user's sharing history
 */
export async function getUserShareHistory(): Promise<SocialShare[]> {
  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `${API_URL}/api/social-shares/user/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/**
 * Get global sharing statistics
 */
export async function getGlobalShareStats(): Promise<GlobalShareStats> {
  const response = await axios.get(
    `${API_URL}/api/social-shares/stats/global`
  );

  return response.data;
}
