// Google Analytics Event Tracking Functions

type EventParams = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// Generic event tracking
export const trackEvent = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track page views manually
export const trackPageView = (url: string) => {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track program views
export const trackProgramView = (programTitle: string, programId: string) => {
  trackEvent({
    action: "view_program",
    category: "Programs",
    label: programTitle,
  });

  // E-commerce tracking
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "view_item", {
      items: [
        {
          item_id: programId,
          item_name: programTitle,
          item_category: "Egypt Tours",
        },
      ],
    });
  }
};

// Track booking initiation
export const trackBookingClick = (programTitle: string, programId: string, price: number) => {
  trackEvent({
    action: "begin_checkout",
    category: "Booking",
    label: programTitle,
    value: price,
  });

  // E-commerce tracking
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: "USD",
      value: price,
      items: [
        {
          item_id: programId,
          item_name: programTitle,
          item_category: "Egypt Tours",
          price: price,
          quantity: 1,
        },
      ],
    });
  }
};

// Track wishlist actions
export const trackWishlistAction = (action: "add" | "remove", programTitle: string) => {
  trackEvent({
    action: action === "add" ? "add_to_wishlist" : "remove_from_wishlist",
    category: "Wishlist",
    label: programTitle,
  });
};

// Track search
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent({
    action: "search",
    category: "Search",
    label: searchTerm,
    value: resultsCount,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "search", {
      search_term: searchTerm,
    });
  }
};

// Track filters usage
export const trackFilterUse = (filterType: string, filterValue: string) => {
  trackEvent({
    action: "use_filter",
    category: "Filters",
    label: `${filterType}: ${filterValue}`,
  });
};

// Track social shares
export const trackSocialShare = (platform: string, contentType: string, contentId: string) => {
  trackEvent({
    action: "share",
    category: "Social",
    label: `${platform} - ${contentType}`,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "share", {
      method: platform,
      content_type: contentType,
      content_id: contentId,
    });
  }
};

// Track newsletter signup
export const trackNewsletterSignup = (email: string) => {
  trackEvent({
    action: "newsletter_signup",
    category: "Newsletter",
    label: email,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "sign_up", {
      method: "Newsletter",
    });
  }
};

// Track authentication
export const trackAuth = (action: "login" | "signup" | "logout") => {
  trackEvent({
    action: action,
    category: "Authentication",
  });

  if (typeof window !== "undefined" && window.gtag) {
    if (action === "login") {
      window.gtag("event", "login", { method: "Email" });
    } else if (action === "signup") {
      window.gtag("event", "sign_up", { method: "Email" });
    }
  }
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent({
    action: "click_external_link",
    category: "Outbound Links",
    label: `${linkText} - ${url}`,
  });
};

// Track video plays (for Instagram content, etc.)
export const trackVideoPlay = (videoTitle: string, videoId: string) => {
  trackEvent({
    action: "video_play",
    category: "Video",
    label: videoTitle,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "video_start", {
      video_title: videoTitle,
      video_url: videoId,
    });
  }
};

// Track scroll depth
export const trackScrollDepth = (depth: 25 | 50 | 75 | 100) => {
  trackEvent({
    action: "scroll_depth",
    category: "Engagement",
    label: `${depth}%`,
    value: depth,
  });
};

// Track time on page (call when user leaves)
export const trackTimeOnPage = (seconds: number, pagePath: string) => {
  trackEvent({
    action: "time_on_page",
    category: "Engagement",
    label: pagePath,
    value: seconds,
  });
};

// Extend Window interface
declare global {
  interface Window {
    gtag: (
      command: string,
      targetIdOrEventName: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
