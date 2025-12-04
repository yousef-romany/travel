// lib/social-sharing.ts - Social sharing utilities

import { trackSocialShare } from "@/fetch/social-shares";

export interface ShareOptions {
  title: string;
  text?: string;
  url: string;
  hashtags?: string[];
  via?: string; // Twitter username
  image?: string;
}

export interface ShareConfig {
  contentType: "program" | "place" | "blog" | "custom";
  contentId: string;
  contentTitle: string;
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "share" in navigator;
}

/**
 * Share using native Web Share API
 */
export async function shareNative(options: ShareOptions): Promise<boolean> {
  if (!isWebShareSupported()) {
    console.error("Web Share API not supported");
    return false;
  }

  try {
    await navigator.share({
      title: options.title,
      text: options.text || options.title,
      url: options.url,
    });
    return true;
  } catch (error: any) {
    if (error.name !== "AbortError") {
      console.error("Error sharing:", error);
    }
    return false;
  }
}

/**
 * Share on Facebook
 */
export function shareOnFacebook(options: ShareOptions, config: ShareConfig): void {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(options.url)}`;
  openShareWindow(url, "facebook");
  trackShare("facebook", config, options.url);
}

/**
 * Share on Twitter/X
 */
export function shareOnTwitter(options: ShareOptions, config: ShareConfig): void {
  let url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(options.url)}&text=${encodeURIComponent(
    options.text || options.title
  )}`;

  if (options.hashtags && options.hashtags.length > 0) {
    url += `&hashtags=${options.hashtags.join(",")}`;
  }

  if (options.via) {
    url += `&via=${options.via}`;
  }

  openShareWindow(url, "twitter");
  trackShare("twitter", config, options.url);
}

/**
 * Share on WhatsApp
 */
export function shareOnWhatsApp(options: ShareOptions, config: ShareConfig): void {
  const text = `${options.title}\n${options.url}`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

  // WhatsApp works better with direct navigation on mobile
  if (isMobile()) {
    window.location.href = url;
  } else {
    openShareWindow(url, "whatsapp");
  }

  trackShare("whatsapp", config, options.url);
}

/**
 * Share on LinkedIn
 */
export function shareOnLinkedIn(options: ShareOptions, config: ShareConfig): void {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(options.url)}`;
  openShareWindow(url, "linkedin");
  trackShare("linkedin", config, options.url);
}

/**
 * Share via Email
 */
export function shareViaEmail(options: ShareOptions, config: ShareConfig): void {
  const subject = encodeURIComponent(options.title);
  const body = encodeURIComponent(
    `${options.text || options.title}\n\n${options.url}\n\nShared from ZoeHolidays`
  );
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

  window.location.href = mailtoUrl;
  trackShare("email", config, options.url);
}

/**
 * Copy link to clipboard
 */
export async function copyLinkToClipboard(url: string, config: ShareConfig): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      trackShare("copy-link", config, url);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          trackShare("copy-link", config, url);
        }
        return successful;
      } catch (error) {
        document.body.removeChild(textArea);
        console.error("Fallback copy failed:", error);
        return false;
      }
    }
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

/**
 * Track share event
 */
async function trackShare(
  platform: "facebook" | "twitter" | "whatsapp" | "email" | "linkedin" | "instagram" | "copy-link",
  config: ShareConfig,
  url: string
): Promise<void> {
  try {
    await trackSocialShare(platform, config.contentType, config.contentId, url, config.contentTitle);
  } catch (error) {
    console.error("Error tracking share:", error);
  }
}

/**
 * Open share window with optimal size
 */
function openShareWindow(url: string, platform: string): void {
  const width = 600;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
  );
}

/**
 * Check if user is on mobile device
 */
function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Generate share text for programs
 */
export function generateProgramShareText(programTitle: string, price?: number, rating?: number): string {
  let text = `Check out this amazing travel program: ${programTitle}`;

  if (rating) {
    text += ` (⭐ ${rating}/5)`;
  }

  if (price) {
    text += ` - Starting from $${price}`;
  }

  text += " | Book now with ZoeHolidays! 🌍✈️";

  return text;
}

/**
 * Generate hashtags for travel programs
 */
export function generateTravelHashtags(location?: string): string[] {
  const baseHashtags = ["Travel", "Adventure", "ZoeHolidays", "Wanderlust", "TravelGoals"];

  if (location) {
    // Clean location string and create hashtag
    const locationTag = location.replace(/[^a-zA-Z0-9]/g, "");
    baseHashtags.unshift(locationTag);
  }

  return baseHashtags.slice(0, 5); // Twitter has a limit
}

/**
 * Get share button configuration
 */
export interface ShareButton {
  platform: string;
  label: string;
  icon: string;
  color: string;
  action: (options: ShareOptions, config: ShareConfig) => void | Promise<boolean>;
}

export function getShareButtons(): ShareButton[] {
  return [
    {
      platform: "facebook",
      label: "Facebook",
      icon: "facebook",
      color: "#1877F2",
      action: shareOnFacebook,
    },
    {
      platform: "twitter",
      label: "Twitter",
      icon: "twitter",
      color: "#1DA1F2",
      action: shareOnTwitter,
    },
    {
      platform: "whatsapp",
      label: "WhatsApp",
      icon: "message-circle",
      color: "#25D366",
      action: shareOnWhatsApp,
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      icon: "linkedin",
      color: "#0A66C2",
      action: shareOnLinkedIn,
    },
    {
      platform: "email",
      label: "Email",
      icon: "mail",
      color: "#EA4335",
      action: shareViaEmail,
    },
  ];
}

/**
 * Generate Open Graph meta tags for better social sharing
 */
export interface OGMetaTags {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  siteName?: string;
}

export function generateOGMetaTags(tags: OGMetaTags): Record<string, string> {
  return {
    "og:title": tags.title,
    "og:description": tags.description,
    "og:image": tags.image,
    "og:url": tags.url,
    "og:type": tags.type || "website",
    "og:site_name": tags.siteName || "ZoeHolidays",
    "twitter:card": "summary_large_image",
    "twitter:title": tags.title,
    "twitter:description": tags.description,
    "twitter:image": tags.image,
  };
}
