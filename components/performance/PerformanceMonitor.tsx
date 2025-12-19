"use client";

import { useEffect } from "react";
import { initPerformanceMonitoring } from "@/lib/performance";

/**
 * PerformanceMonitor Component
 *
 * Monitors Core Web Vitals and reports to analytics
 * Add this component to your root layout
 *
 * Tracks:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <PerformanceMonitor />
 * ```
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring when component mounts
    initPerformanceMonitoring();

    // Report when page visibility changes (user leaves/returns)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Re-report final metrics when user leaves
        initPerformanceMonitoring();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
