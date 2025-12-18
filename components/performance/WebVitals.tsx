/**
 * Web Vitals Monitoring Component
 * Tracks and reports Core Web Vitals metrics to Google Analytics
 */

'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Web Vitals tracking component - add to root layout
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    }
  });

  // Track long tasks that might affect INP
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Long task threshold
            if (window.gtag) {
              window.gtag('event', 'long_task', {
                value: Math.round(entry.duration),
                event_label: entry.name,
                non_interaction: true,
              });
            }

            if (process.env.NODE_ENV === 'development') {
              console.warn('[Performance] Long task detected:', {
                name: entry.name,
                duration: entry.duration,
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    } catch (error) {
      console.error('Error setting up PerformanceObserver:', error);
    }
  }, []);

  return null;
}

/**
 * Hook to manually track custom performance metrics
 */
export function usePerformanceMetric(metricName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_metric', {
          metric_name: metricName,
          value: Math.round(duration),
          non_interaction: true,
        });
      }
    };
  }, [metricName]);
}

/**
 * Track resource loading performance
 */
export function useResourcePerformance() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Track slow resources
          if (resourceEntry.duration > 1000) {
            if (window.gtag) {
              window.gtag('event', 'slow_resource', {
                resource_url: resourceEntry.name,
                value: Math.round(resourceEntry.duration),
                resource_type: resourceEntry.initiatorType,
                non_interaction: true,
              });
            }

            if (process.env.NODE_ENV === 'development') {
              console.warn('[Performance] Slow resource:', {
                url: resourceEntry.name,
                type: resourceEntry.initiatorType,
                duration: resourceEntry.duration,
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });

      return () => observer.disconnect();
    } catch (error) {
      console.error('Error setting up resource performance observer:', error);
    }
  }, []);
}
