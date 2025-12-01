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

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string, destination?: string) => {
  trackEvent({
    action: "button_click",
    category: "Navigation",
    label: `${buttonName} - ${location}`,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "click", {
      event_category: "Navigation",
      event_label: buttonName,
      page_location: location,
      link_destination: destination,
    });
  }
};

// Track navigation menu clicks
export const trackNavigation = (menuItem: string, destination: string) => {
  trackEvent({
    action: "navigate",
    category: "Navigation",
    label: `${menuItem} -> ${destination}`,
  });
};

// Track "Explore More" or "View Details" clicks
export const trackExploreClick = (contentType: string, contentTitle: string, contentId: string) => {
  trackEvent({
    action: "explore_content",
    category: contentType,
    label: contentTitle,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "select_content", {
      content_type: contentType,
      content_id: contentId,
      item_id: contentId,
    });
  }
};

// Track "Book Now" clicks (WhatsApp)
export const trackWhatsAppBooking = (programTitle: string, programId: string, price?: number) => {
  trackEvent({
    action: "whatsapp_booking",
    category: "Booking",
    label: programTitle,
    value: price,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "contact", {
      method: "WhatsApp",
      content_type: "Program",
      content_id: programId,
      value: price,
    });
  }
};

// Track card/program clicks in listings
export const trackCardClick = (cardType: string, cardTitle: string, cardId: string, position?: number) => {
  trackEvent({
    action: "card_click",
    category: cardType,
    label: cardTitle,
    value: position,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "select_item", {
      item_list_name: cardType,
      items: [
        {
          item_id: cardId,
          item_name: cardTitle,
          item_category: cardType,
          index: position,
        },
      ],
    });
  }
};

// Track CTA (Call-to-Action) button clicks
export const trackCTA = (ctaName: string, ctaLocation: string, ctaDestination: string) => {
  trackEvent({
    action: "cta_click",
    category: "CTA",
    label: `${ctaName} - ${ctaLocation}`,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "click", {
      event_category: "CTA",
      event_label: ctaName,
      page_location: ctaLocation,
      link_destination: ctaDestination,
    });
  }
};

// Track footer link clicks
export const trackFooterLink = (linkText: string, destination: string) => {
  trackEvent({
    action: "footer_link_click",
    category: "Footer",
    label: linkText,
  });
};

// Track "Read More" blog clicks
export const trackReadMore = (blogType: string, blogTitle: string, blogId: string) => {
  trackEvent({
    action: "read_more",
    category: blogType,
    label: blogTitle,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "select_content", {
      content_type: blogType,
      content_id: blogId,
    });
  }
};

// Track destination/place clicks
export const trackPlaceClick = (placeTitle: string, placeId: string, category?: string) => {
  trackEvent({
    action: "place_click",
    category: "Destinations",
    label: placeTitle,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "select_content", {
      content_type: "Destination",
      content_id: placeId,
      item_category: category,
    });
  }
};

// Track hero section CTA clicks
export const trackHeroCTA = (ctaText: string, destination: string) => {
  trackEvent({
    action: "hero_cta_click",
    category: "Hero Section",
    label: ctaText,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "click", {
      event_category: "Hero CTA",
      event_label: ctaText,
      link_destination: destination,
    });
  }
};

// Track carousel/slider interactions
export const trackCarouselInteraction = (action: "next" | "previous" | "dot", carouselName: string, slideIndex: number) => {
  trackEvent({
    action: `carousel_${action}`,
    category: "Carousel",
    label: carouselName,
    value: slideIndex,
  });
};

// Track tab changes
export const trackTabChange = (tabName: string, tabGroup: string) => {
  trackEvent({
    action: "tab_change",
    category: "Tabs",
    label: `${tabGroup} - ${tabName}`,
  });
};

// Track accordion/dropdown opens
export const trackAccordionToggle = (accordionTitle: string, isOpen: boolean) => {
  trackEvent({
    action: isOpen ? "accordion_open" : "accordion_close",
    category: "Accordion",
    label: accordionTitle,
  });
};

// Track image gallery interactions
export const trackGalleryView = (imageIndex: number, totalImages: number, galleryName: string) => {
  trackEvent({
    action: "gallery_view",
    category: "Gallery",
    label: galleryName,
    value: imageIndex,
  });
};

// Track language change
export const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
  trackEvent({
    action: "language_change",
    category: "Localization",
    label: `${fromLanguage} -> ${toLanguage}`,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "select_content", {
      content_type: "Language",
      content_id: toLanguage,
    });
  }
};

// Track theme toggle (dark/light mode)
export const trackThemeToggle = (theme: "light" | "dark") => {
  trackEvent({
    action: "theme_toggle",
    category: "UI Preferences",
    label: theme,
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
