/**
 * Resource Preloader Component
 * Preloads critical resources to improve LCP and overall performance
 */

'use client';

import { useEffect } from 'react';
import {
  preloadCriticalResources,
  preconnectDomains,
  optimizeFontLoading,
} from '@/lib/performance-optimization';

interface ResourcePreloaderProps {
  /**
   * Critical images to preload (hero images, above-fold content)
   */
  criticalImages?: string[];

  /**
   * Critical fonts to preload
   */
  criticalFonts?: string[];

  /**
   * External domains to preconnect (CDNs, APIs, etc.)
   */
  externalDomains?: string[];

  /**
   * Font families to optimize
   */
  fontFamilies?: string[];
}

export default function ResourcePreloader({
  criticalImages = [],
  criticalFonts = [],
  externalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  fontFamilies = ['Inter', 'system-ui', '-apple-system'],
}: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload critical resources
    if (criticalImages.length > 0 || criticalFonts.length > 0) {
      preloadCriticalResources({
        images: criticalImages,
        fonts: criticalFonts,
      });
    }

    // Preconnect to external domains
    if (externalDomains.length > 0) {
      preconnectDomains(externalDomains);
    }

    // Optimize font loading
    if (fontFamilies.length > 0) {
      optimizeFontLoading(fontFamilies);
    }
  }, []); // Run once on mount

  return null; // This component doesn't render anything
}

/**
 * Preset configurations for common scenarios
 */
export const ResourcePresets = {
  /**
   * Homepage preset - preload hero images and critical fonts
   */
  homepage: {
    criticalImages: ['/images/hero-bg.jpg'],
    externalDomains: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://dashboard.zoeholidays.com',
      'https://res.cloudinary.com',
    ],
  },

  /**
   * Program listing preset - preconnect to image CDNs
   */
  programListing: {
    externalDomains: [
      'https://dashboard.zoeholidays.com',
      'https://res.cloudinary.com',
      'https://th.bing.com',
    ],
  },

  /**
   * Program detail preset - preload hero image
   */
  programDetail: (heroImage?: string) => ({
    criticalImages: heroImage ? [heroImage] : [],
    externalDomains: [
      'https://dashboard.zoeholidays.com',
      'https://res.cloudinary.com',
      'https://unpkg.com', // For Leaflet maps
    ],
  }),

  /**
   * Booking page preset - preconnect to payment providers
   */
  bookingPage: {
    externalDomains: [
      'https://dashboard.zoeholidays.com',
      'https://js.stripe.com', // If using Stripe
      'https://www.paypal.com', // If using PayPal
    ],
  },
} as const;
