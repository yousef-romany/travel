/**
 * Intelligent Prefetching System
 *
 * Predictively loads resources for better perceived performance
 * - Link hover prefetching
 * - Viewport-based prefetching
 * - User behavior prediction
 * - Network-aware prefetching
 */

interface PrefetchOptions {
  /**
   * Delay before prefetching (ms)
   */
  delay?: number;
  /**
   * Only prefetch on fast connections
   */
  networkAware?: boolean;
  /**
   * Priority level
   */
  priority?: 'high' | 'low' | 'auto';
  /**
   * Cache the prefetched resource
   */
  cache?: boolean;
}

/**
 * Check if connection is fast enough for prefetching
 */
function isFastConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return true; // Assume fast if API not available
  }

  const connection = (navigator as any).connection;

  if (!connection) return true;

  // Don't prefetch on 2G or slow-2g
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return false;
  }

  // Don't prefetch if save-data is enabled
  if (connection.saveData) {
    return false;
  }

  return true;
}

/**
 * Prefetch a URL
 */
export function prefetchURL(url: string, options: PrefetchOptions = {}) {
  const {
    delay = 0,
    networkAware = true,
    priority = 'low',
    cache = true,
  } = options;

  // Skip if network-aware and connection is slow
  if (networkAware && !isFastConnection()) {
    return;
  }

  const prefetch = () => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';

    if (priority === 'high') {
      link.setAttribute('importance', 'high');
    }

    if (!cache) {
      link.setAttribute('crossorigin', 'use-credentials');
    }

    document.head.appendChild(link);
  };

  if (delay > 0) {
    setTimeout(prefetch, delay);
  } else {
    prefetch();
  }
}

/**
 * Prefetch on link hover
 * Significantly improves perceived navigation speed
 */
export function enableHoverPrefetch(options: PrefetchOptions = {}) {
  if (typeof document === 'undefined') return;

  const prefetchedURLs = new Set<string>();
  let hoverTimeout: NodeJS.Timeout | null = null;

  const handleMouseEnter = (e: Event) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (!link) return;

    const url = link.href;

    // Skip external links, already prefetched, or anchors
    if (
      !url ||
      url.startsWith('javascript:') ||
      url.includes('#') ||
      prefetchedURLs.has(url) ||
      !url.startsWith(window.location.origin)
    ) {
      return;
    }

    // Clear previous timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Prefetch after short delay (prevents accidental hovers)
    hoverTimeout = setTimeout(() => {
      prefetchURL(url, options);
      prefetchedURLs.add(url);
    }, options.delay || 50);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  };

  // Attach event listeners to document
  document.addEventListener('mouseenter', handleMouseEnter, true);
  document.addEventListener('mouseleave', handleMouseLeave, true);

  // Cleanup function
  return () => {
    document.removeEventListener('mouseenter', handleMouseEnter, true);
    document.removeEventListener('mouseleave', handleMouseLeave, true);
  };
}

/**
 * Prefetch visible links in viewport
 */
export function prefetchVisibleLinks(options: PrefetchOptions = {}) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const prefetchedURLs = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const url = link.href;

          if (
            url &&
            !prefetchedURLs.has(url) &&
            url.startsWith(window.location.origin) &&
            !url.includes('#')
          ) {
            prefetchURL(url, options);
            prefetchedURLs.add(url);
            observer.unobserve(link);
          }
        }
      });
    },
    {
      rootMargin: '200px', // Start prefetching 200px before entering viewport
    }
  );

  // Observe all internal links
  document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]').forEach((link) => {
    observer.observe(link);
  });

  return () => observer.disconnect();
}

/**
 * Prefetch likely next pages based on user behavior
 * Uses heuristics to predict navigation
 */
export function enableSmartPrefetch() {
  if (typeof window === 'undefined') return;

  // Track user interactions
  const interactions = {
    clicks: new Map<string, number>(),
    time: new Map<string, number>(),
  };

  // Track time spent on page
  const startTime = Date.now();

  window.addEventListener('beforeunload', () => {
    const duration = Date.now() - startTime;
    interactions.time.set(window.location.pathname, duration);
  });

  // Predict and prefetch likely next pages
  const predictNextPages = (): string[] => {
    const currentPath = window.location.pathname;
    const predictions: string[] = [];

    // Common navigation patterns for ZoeHoliday
    if (currentPath === '/') {
      predictions.push('/programs', '/placesTogo', '/inspiration');
    } else if (currentPath === '/programs') {
      // Prefetch first few program detail pages
      document.querySelectorAll('a[href^="/programs/"]').forEach((link, index) => {
        if (index < 3) {
          predictions.push((link as HTMLAnchorElement).href);
        }
      });
    } else if (currentPath.startsWith('/programs/')) {
      predictions.push('/programs', '/booking');
    } else if (currentPath === '/placesTogo') {
      // Prefetch popular places
      document.querySelectorAll('a[href^="/placesTogo/"]').forEach((link, index) => {
        if (index < 3) {
          predictions.push((link as HTMLAnchorElement).href);
        }
      });
    }

    return predictions;
  };

  // Prefetch predicted pages after short delay
  setTimeout(() => {
    if (isFastConnection()) {
      const predictions = predictNextPages();
      predictions.forEach((url) => {
        prefetchURL(url, { delay: 1000, networkAware: true });
      });
    }
  }, 2000); // Wait 2s before predicting
}

/**
 * Prefetch images that are likely to be viewed
 */
export function prefetchImages(selector: string = 'img[data-src]') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);

            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '400px', // Prefetch images 400px before viewport
    }
  );

  document.querySelectorAll(selector).forEach((img) => {
    observer.observe(img);
  });

  return () => observer.disconnect();
}

/**
 * Prefetch API data
 */
export async function prefetchData(url: string, cacheTime: number = 5 * 60 * 1000) {
  if (typeof window === 'undefined') return null;

  // Check cache first
  const cacheKey = `prefetch_${url}`;
  const cached = sessionStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTime) {
        return data;
      }
    } catch (e) {
      // Invalid cache, continue to fetch
    }
  }

  // Fetch and cache
  try {
    const response = await fetch(url);
    const data = await response.json();

    sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );

    return data;
  } catch (error) {
    console.error('Prefetch failed:', error);
    return null;
  }
}

/**
 * Initialize all prefetching strategies
 */
export function initPrefetching(options: {
  hover?: boolean;
  visible?: boolean;
  smart?: boolean;
  images?: boolean;
} = {}) {
  const {
    hover = true,
    visible = true,
    smart = true,
    images = true,
  } = options;

  const cleanups: (() => void)[] = [];

  if (hover) {
    const cleanup = enableHoverPrefetch({ delay: 50, networkAware: true });
    if (cleanup) cleanups.push(cleanup);
  }

  if (visible) {
    const cleanup = prefetchVisibleLinks({ networkAware: true });
    if (cleanup) cleanups.push(cleanup);
  }

  if (smart) {
    enableSmartPrefetch();
  }

  if (images) {
    const cleanup = prefetchImages();
    if (cleanup) cleanups.push(cleanup);
  }

  // Return cleanup function
  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

/**
 * Prerender next page (experimental)
 * Only use for very high confidence predictions
 */
export function prerenderPage(url: string) {
  if (typeof document === 'undefined') return;

  // Check if browser supports prerendering
  if ('prerender' in document.createElement('link')) {
    const link = document.createElement('link');
    link.rel = 'prerender';
    link.href = url;
    document.head.appendChild(link);
  } else {
    // Fallback to prefetch
    prefetchURL(url, { priority: 'high' });
  }
}
