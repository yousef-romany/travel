/**
 * Performance Monitoring and Optimization Utilities
 *
 * Tools for measuring and improving Core Web Vitals:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

/**
 * Web Vitals Thresholds
 * https://web.dev/vitals/
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

/**
 * Get performance rating based on value and metric type
 */
function getRating(
  metricName: keyof typeof THRESHOLDS,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Report Web Vitals to analytics
 * Can be integrated with Google Analytics, custom analytics, etc.
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${metric.name}:`, {
      value: `${metric.value.toFixed(2)}ms`,
      rating: metric.rating,
      id: metric.id,
    });
  }

  // Send to analytics in production
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }
}

/**
 * Measure LCP (Largest Contentful Paint)
 */
export function measureLCP(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
      renderTime: number;
      loadTime: number;
    };

    const value = lastEntry.renderTime || lastEntry.loadTime;
    callback({
      name: "LCP",
      value,
      rating: getRating("LCP", value),
      delta: value,
      id: `v1-${Date.now()}-${Math.random()}`,
    });
  });

  try {
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch (e) {
    console.error("LCP observation failed:", e);
  }
}

/**
 * Measure FID (First Input Delay)
 */
export function measureFID(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const firstInput = entries[0] as PerformanceEventTiming;

    const value = firstInput.processingStart - firstInput.startTime;
    callback({
      name: "FID",
      value,
      rating: getRating("FID", value),
      delta: value,
      id: `v1-${Date.now()}-${Math.random()}`,
    });
  });

  try {
    observer.observe({ type: "first-input", buffered: true });
  } catch (e) {
    console.error("FID observation failed:", e);
  }
}

/**
 * Measure CLS (Cumulative Layout Shift)
 */
export function measureCLS(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as PerformanceEntry[]) {
      if (!(entry as any).hadRecentInput) {
        const firstSessionEntry = clsEntries[0];
        const lastSessionEntry = clsEntries[clsEntries.length - 1];

        if (
          clsValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        } else {
          clsValue = (entry as any).value;
          clsEntries = [entry];
        }

        callback({
          name: "CLS",
          value: clsValue,
          rating: getRating("CLS", clsValue),
          delta: (entry as any).value,
          id: `v1-${Date.now()}-${Math.random()}`,
        });
      }
    }
  });

  try {
    observer.observe({ type: "layout-shift", buffered: true });
  } catch (e) {
    console.error("CLS observation failed:", e);
  }
}

/**
 * Measure FCP (First Contentful Paint)
 */
export function measureFCP(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const fcpEntry = entries.find((entry) => entry.name === "first-contentful-paint");

    if (fcpEntry) {
      const value = fcpEntry.startTime;
      callback({
        name: "FCP",
        value,
        rating: getRating("FCP", value),
        delta: value,
        id: `v1-${Date.now()}-${Math.random()}`,
      });
    }
  });

  try {
    observer.observe({ type: "paint", buffered: true });
  } catch (e) {
    console.error("FCP observation failed:", e);
  }
}

/**
 * Measure TTFB (Time to First Byte)
 */
export function measureTTFB(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === "undefined" || !window.performance) return;

  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;

  if (navigationEntry) {
    const value = navigationEntry.responseStart - navigationEntry.requestStart;
    callback({
      name: "TTFB",
      value,
      rating: getRating("TTFB", value),
      delta: value,
      id: `v1-${Date.now()}-${Math.random()}`,
    });
  }
}

/**
 * Initialize all Web Vitals monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === "undefined") return;

  measureLCP(reportWebVitals);
  measureFID(reportWebVitals);
  measureCLS(reportWebVitals);
  measureFCP(reportWebVitals);
  measureTTFB(reportWebVitals);
}

/**
 * Preload critical resources
 */
export function preloadResource(
  href: string,
  as: "image" | "script" | "style" | "font" | "fetch",
  options?: {
    type?: string;
    crossOrigin?: string;
    fetchPriority?: "high" | "low" | "auto";
  }
) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;

  if (options?.type) link.type = options.type;
  if (options?.crossOrigin) link.crossOrigin = options.crossOrigin;
  if (options?.fetchPriority) link.setAttribute("fetchpriority", options.fetchPriority);

  document.head.appendChild(link);
}

/**
 * Defer non-critical JavaScript
 */
export function deferScript(src: string, onLoad?: () => void) {
  if (typeof document === "undefined") return;

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  if (onLoad) script.onload = onLoad;

  document.body.appendChild(script);
}

/**
 * Prefetch resources for next navigation
 */
export function prefetchResource(href: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;

  document.head.appendChild(link);
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (event: string, action: string, params: Record<string, any>) => void;
  }
}
