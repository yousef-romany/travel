/**
 * Enhanced E-commerce Analytics Tracking
 * Comprehensive tracking for bookings, conversions, and user behavior
 */

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  item_variant?: string;
  item_brand?: string;
  price: number;
  quantity?: number;
  currency?: string;
}

export interface EcommerceTransaction {
  transaction_id: string;
  value: number;
  currency?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: EcommerceItem[];
}

/**
 * Track when user views product/tour details
 */
export function trackProductView(
  programId: string,
  programTitle: string,
  price: number,
  category?: string,
  location?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: programId,
        item_name: programTitle,
        item_category: category || 'Tour Package',
        item_category2: location || 'Egypt',
        price: price,
        quantity: 1,
      }],
    });
  }
}

/**
 * Track when user adds item to cart/wishlist
 */
export function trackAddToCart(
  programId: string,
  programTitle: string,
  price: number,
  quantity: number = 1,
  category?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: programId,
        item_name: programTitle,
        item_category: category || 'Tour Package',
        price: price,
        quantity: quantity,
      }],
    });
  }
}

/**
 * Track when user removes item from cart/wishlist
 */
export function trackRemoveFromCart(
  programId: string,
  programTitle: string,
  price: number,
  quantity: number = 1
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: programId,
        item_name: programTitle,
        price: price,
        quantity: quantity,
      }],
    });
  }
}

/**
 * Track when user initiates checkout
 */
export function trackBeginCheckout(
  items: EcommerceItem[],
  totalValue: number,
  coupon?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: totalValue,
      coupon: coupon,
      items: items,
    });
  }
}

/**
 * Track checkout progress (step completion)
 */
export function trackCheckoutProgress(
  step: number,
  stepName: string,
  items: EcommerceItem[],
  totalValue: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'checkout_progress', {
      checkout_step: step,
      checkout_option: stepName,
      currency: 'USD',
      value: totalValue,
      items: items,
    });
  }
}

/**
 * Track when user adds payment information
 */
export function trackAddPaymentInfo(
  paymentType: string,
  items: EcommerceItem[],
  totalValue: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_payment_info', {
      currency: 'USD',
      value: totalValue,
      payment_type: paymentType,
      items: items,
    });
  }
}

/**
 * Track successful purchase/booking
 */
export function trackPurchase(transaction: EcommerceTransaction) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transaction.transaction_id,
      value: transaction.value,
      currency: transaction.currency || 'USD',
      tax: transaction.tax || 0,
      shipping: transaction.shipping || 0,
      coupon: transaction.coupon,
      items: transaction.items,
    });
  }
}

/**
 * Track refund
 */
export function trackRefund(
  transactionId: string,
  value: number,
  items?: EcommerceItem[]
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'refund', {
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
      items: items,
    });
  }
}

/**
 * Track promotion view
 */
export function trackPromotionView(
  promotionId: string,
  promotionName: string,
  creativeName?: string,
  creativeSlot?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_promotion', {
      promotion_id: promotionId,
      promotion_name: promotionName,
      creative_name: creativeName,
      creative_slot: creativeSlot,
    });
  }
}

/**
 * Track promotion click
 */
export function trackPromotionClick(
  promotionId: string,
  promotionName: string,
  creativeName?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_promotion', {
      promotion_id: promotionId,
      promotion_name: promotionName,
      creative_name: creativeName,
    });
  }
}

/**
 * Track product list view
 */
export function trackProductListView(
  listId: string,
  listName: string,
  items: EcommerceItem[]
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item_list', {
      item_list_id: listId,
      item_list_name: listName,
      items: items.slice(0, 10), // Limit to first 10 items
    });
  }
}

/**
 * Track when user selects item from list
 */
export function trackProductListClick(
  listId: string,
  listName: string,
  item: EcommerceItem,
  position: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_item', {
      item_list_id: listId,
      item_list_name: listName,
      items: [{
        ...item,
        index: position,
      }],
    });
  }
}

/**
 * Track search with results
 */
export function trackSearchWithResults(
  searchTerm: string,
  resultsCount: number,
  filters?: Record<string, string>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
      ...filters,
    });
  }
}

/**
 * Track filter usage on listing pages
 */
export function trackFilterUsage(
  filterType: string,
  filterValue: string | number,
  resultsCount: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'filter_applied', {
      filter_type: filterType,
      filter_value: filterValue.toString(),
      results_count: resultsCount,
    });
  }
}

/**
 * Track when user views their cart
 */
export function trackViewCart(items: EcommerceItem[], totalValue: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_cart', {
      currency: 'USD',
      value: totalValue,
      items: items,
    });
  }
}

/**
 * Track add to wishlist
 */
export function trackAddToWishlist(
  programId: string,
  programTitle: string,
  price: number,
  category?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_wishlist', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: programId,
        item_name: programTitle,
        item_category: category || 'Tour Package',
        price: price,
        quantity: 1,
      }],
    });
  }
}

/**
 * Track user engagement time on page
 */
export function trackEngagementTime(
  pageUrl: string,
  timeInSeconds: number,
  scrollDepth: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_engagement', {
      page_url: pageUrl,
      engagement_time_msec: timeInSeconds * 1000,
      scroll_depth: scrollDepth,
    });
  }
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  formId: string,
  success: boolean,
  errorMessage?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submit', {
      form_name: formName,
      form_id: formId,
      success: success,
      ...(errorMessage && { error_message: errorMessage }),
    });
  }
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(
  ctaText: string,
  ctaLocation: string,
  destinationUrl: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_text: ctaText,
      cta_location: ctaLocation,
      destination_url: destinationUrl,
    });
  }
}

/**
 * Track booking form abandonment
 */
export function trackFormAbandonment(
  formName: string,
  completedFields: string[],
  totalFields: number,
  timeSpent: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_abandon', {
      form_name: formName,
      completed_fields: completedFields.length,
      total_fields: totalFields,
      completion_rate: (completedFields.length / totalFields) * 100,
      time_spent_seconds: timeSpent,
    });
  }
}

/**
 * Track custom conversion events
 */
export function trackCustomConversion(
  conversionName: string,
  conversionValue?: number,
  additionalData?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', conversionName, {
      ...(conversionValue && { value: conversionValue, currency: 'USD' }),
      ...additionalData,
    });
  }
}

/**
 * Set user properties for better segmentation
 */
export function setUserProperties(properties: {
  user_id?: string;
  customer_type?: 'new' | 'returning' | 'vip';
  preferred_destination?: string;
  booking_count?: number;
  lifetime_value?: number;
  language_preference?: string;
  [key: string]: string | number | undefined;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
}
