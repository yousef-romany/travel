/**
 * Performance Optimization Utilities
 * Helpers for improving Core Web Vitals (LCP, CLS, INP, FID)
 */

/**
 * Preload critical resources for faster LCP
 */
export function preloadCriticalResources(resources: {
  images?: string[];
  fonts?: string[];
  scripts?: string[];
  stylesheets?: string[];
}) {
  if (typeof document === 'undefined') return;

  // Preload images
  resources.images?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Preload fonts
  resources.fonts?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload scripts
  resources.scripts?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    document.head.appendChild(link);
  });

  // Preload stylesheets
  resources.stylesheets?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch resources for next navigation
 */
export function prefetchResources(urls: string[]) {
  if (typeof document === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Preconnect to external domains for faster resource loading
 */
export function preconnectDomains(domains: string[]) {
  if (typeof document === 'undefined') return;

  domains.forEach((domain) => {
    // Preconnect
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = domain;
    document.head.appendChild(preconnect);

    // DNS prefetch as fallback
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);
  });
}

/**
 * Optimize image loading with lazy loading and proper sizing
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  priority: boolean = false
) {
  return {
    src,
    alt,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    ...(priority && { fetchPriority: 'high' as const }),
  };
}

/**
 * Debounce function for optimizing INP by reducing event handler frequency
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for optimizing INP by limiting execution frequency
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Request idle callback wrapper for scheduling non-critical work
 */
export function scheduleIdleWork(callback: () => void, options?: IdleRequestOptions) {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Optimize third-party script loading
 */
export function loadScriptAsync(
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    onLoad?: () => void;
    onError?: () => void;
  } = {}
) {
  if (typeof document === 'undefined') return;

  const script = document.createElement('script');
  script.src = src;
  script.async = options.async !== false;
  script.defer = options.defer || false;

  if (options.onLoad) {
    script.onload = options.onLoad;
  }

  if (options.onError) {
    script.onerror = options.onError;
  }

  document.body.appendChild(script);
}

/**
 * Measure and report custom timing metrics
 */
export function measurePerformance(name: string, startMark?: string, endMark?: string) {
  if (typeof performance === 'undefined') return;

  try {
    if (startMark && endMark) {
      performance.measure(name, startMark, endMark);
    }

    const measures = performance.getEntriesByName(name, 'measure');
    if (measures.length > 0) {
      const measure = measures[measures.length - 1];
      console.log(`[Performance] ${name}:`, measure.duration);
      return measure.duration;
    }
  } catch (error) {
    console.error('Error measuring performance:', error);
  }
}

/**
 * Create performance marks for custom measurements
 */
export function markPerformance(name: string) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Prevent layout shift by reserving space for dynamic content
 */
export function calculateAspectRatio(width: number, height: number): string {
  return `${(height / width) * 100}%`;
}

/**
 * Get optimal image sizes for responsive images
 */
export function generateImageSizes(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string {
  const sizes: string[] = [];

  if (breakpoints.mobile) {
    sizes.push(`(max-width: 640px) ${breakpoints.mobile}px`);
  }

  if (breakpoints.tablet) {
    sizes.push(`(max-width: 1024px) ${breakpoints.tablet}px`);
  }

  if (breakpoints.desktop) {
    sizes.push(`${breakpoints.desktop}px`);
  }

  return sizes.join(', ');
}

/**
 * Optimize font loading to reduce CLS
 */
export function optimizeFontLoading(fontFamilies: string[]) {
  if (typeof document === 'undefined') return;

  fontFamilies.forEach((fontFamily) => {
    if ('fonts' in document && document.fonts) {
      document.fonts.load(`1rem ${fontFamily}`).catch((error) => {
        console.error(`Error loading font ${fontFamily}:`, error);
      });
    }
  });
}

/**
 * Check if user prefers reduced motion (for accessibility and performance)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection speed to optimize resource loading
 */
export function getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'medium';
  }

  const connection = (navigator as Navigator & {
    connection?: { effectiveType?: string };
  }).connection;

  if (!connection?.effectiveType) return 'medium';

  const effectiveType = connection.effectiveType;

  if (effectiveType === '4g') return 'fast';
  if (effectiveType === '3g') return 'medium';
  return 'slow';
}

/**
 * Adaptive loading based on connection speed
 */
export function shouldLoadHeavyResources(): boolean {
  const speed = getConnectionSpeed();
  return speed === 'fast' || speed === 'medium';
}

/**
 * Intersection Observer helper for lazy loading
 */
export function createIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.01,
      ...options,
    }
  );
}

/**
 * Performance budget checker
 */
export function checkPerformanceBudget(budgets: {
  lcp?: number; // in ms
  fid?: number; // in ms
  cls?: number; // score
  fcp?: number; // in ms
  ttfb?: number; // in ms
}) {
  if (typeof performance === 'undefined') return;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (navigation) {
    const results: Record<string, { value: number; budget: number; pass: boolean }> = {};

    // Check TTFB
    if (budgets.ttfb) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      results.ttfb = {
        value: ttfb,
        budget: budgets.ttfb,
        pass: ttfb <= budgets.ttfb,
      };
    }

    if (process.env.NODE_ENV === 'development') {
      console.table(results);
    }

    return results;
  }
}
