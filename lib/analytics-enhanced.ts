// Enhanced Google Analytics Event Tracking Functions

import { trackEvent } from "./analytics";

// Add new conversion tracking events
export const trackConversion = (conversionType: string, value?: number, transactionId?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
            send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
            value: value,
            currency: "USD",
            transaction_id: transactionId,
            event_category: "Conversion",
            event_label: conversionType,
        });
    }
};

// Track form submissions
export const trackFormSubmission = (formName: string, formLocation: string, success: boolean) => {
    trackEvent({
        action: success ? "form_submit_success" : "form_submit_error",
        category: "Forms",
        label: `${formName} - ${formLocation}`,
    });

    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", success ? "generate_lead" : "form_error", {
            form_name: formName,
            form_location: formLocation,
        });
    }
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string, fileUrl: string) => {
    trackEvent({
        action: "file_download",
        category: "Downloads",
        label: `${fileName} (${fileType})`,
    });

    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "file_download", {
            file_name: fileName,
            file_extension: fileType,
            link_url: fileUrl,
        });
    }
};

// Track comparison tool usage
export const trackComparison = (itemsCompared: string[], comparisonType: string) => {
    trackEvent({
        action: "compare_items",
        category: "Comparison",
        label: comparisonType,
        value: itemsCompared.length,
    });

    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "view_item_list", {
            item_list_name: `Comparison - ${comparisonType}`,
            items: itemsCompared.map((item, index) => ({
                item_id: item,
                item_name: item,
                index: index,
            })),
        });
    }
};

// Track print actions
export const trackPrint = (contentType: string, contentTitle: string) => {
    trackEvent({
        action: "print",
        category: "Print",
        label: `${contentType} - ${contentTitle}`,
    });
};

// Track error occurrences
export const trackError = (errorType: string, errorMessage: string, errorLocation: string) => {
    trackEvent({
        action: "error",
        category: "Errors",
        label: `${errorType} - ${errorLocation}`,
    });

    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "exception", {
            description: errorMessage,
            fatal: false,
        });
    }
};

// Track user engagement score
export const trackEngagement = (engagementType: string, engagementValue: number) => {
    trackEvent({
        action: "user_engagement",
        category: "Engagement",
        label: engagementType,
        value: engagementValue,
    });

    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "user_engagement", {
            engagement_type: engagementType,
            engagement_value: engagementValue,
        });
    }
};

// Track custom trip planning steps
export const trackPlanningStep = (stepNumber: number, stepName: string, completed: boolean) => {
    trackEvent({
        action: completed ? "planning_step_complete" : "planning_step_start",
        category: "Trip Planning",
        label: `Step ${stepNumber}: ${stepName}`,
        value: stepNumber,
    });
};

// Track review/testimonial submissions
export const trackReviewSubmission = (itemType: string, itemId: string, rating: number) => {
    trackEvent({
        action: "submit_review",
        category: "Reviews",
        label: `${itemType} - Rating: ${rating}`,
        value: rating,
    });

    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "review", {
            content_type: itemType,
            content_id: itemId,
            value: rating,
        });
    }
};

// Track promotional banner clicks
export const trackPromoClick = (promoName: string, promoLocation: string, promoOffer?: string) => {
    trackEvent({
        action: "promo_click",
        category: "Promotions",
        label: `${promoName} - ${promoLocation}`,
    });

    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "select_promotion", {
            creative_name: promoName,
            creative_slot: promoLocation,
            promotion_name: promoOffer,
        });
    }
};

// Track date picker interactions
export const trackDateSelection = (dateType: string, selectedDate: string, context: string) => {
    trackEvent({
        action: "date_selected",
        category: "Date Picker",
        label: `${dateType} - ${context}`,
    });
};

// Track map interactions
export const trackMapInteraction = (action: "zoom" | "pan" | "marker_click", location?: string) => {
    trackEvent({
        action: `map_${action}`,
        category: "Map",
        label: location || "unknown",
    });
};

// Track currency/price filter changes
export const trackPriceFilter = (minPrice: number, maxPrice: number, currency: string = "USD") => {
    trackEvent({
        action: "price_filter",
        category: "Filters",
        label: `${currency} ${minPrice} - ${maxPrice}`,
        value: maxPrice - minPrice,
    });
};

// Track duration filter changes
export const trackDurationFilter = (minDays: number, maxDays: number) => {
    trackEvent({
        action: "duration_filter",
        category: "Filters",
        label: `${minDays} - ${maxDays} days`,
        value: maxDays,
    });
};

// Track sort changes
export const trackSort = (sortBy: string, sortOrder: "asc" | "desc", contentType: string) => {
    trackEvent({
        action: "sort_change",
        category: "Sorting",
        label: `${contentType} - ${sortBy} (${sortOrder})`,
    });
};

// Track pagination
export const trackPagination = (pageNumber: number, totalPages: number, contentType: string) => {
    trackEvent({
        action: "pagination",
        category: "Navigation",
        label: `${contentType} - Page ${pageNumber}/${totalPages}`,
        value: pageNumber,
    });
};

// Track modal/popup interactions
export const trackModalInteraction = (modalName: string, action: "open" | "close", trigger?: string) => {
    trackEvent({
        action: `modal_${action}`,
        category: "Modals",
        label: `${modalName}${trigger ? ` - ${trigger}` : ""}`,
    });
};

// Track tooltip/popover views
export const trackTooltipView = (tooltipContent: string, tooltipLocation: string) => {
    trackEvent({
        action: "tooltip_view",
        category: "UI Interactions",
        label: `${tooltipLocation} - ${tooltipContent}`,
    });
};
