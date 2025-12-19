/**
 * Font Optimization Utilities
 *
 * Advanced font loading strategies for optimal performance
 * - Preload critical fonts
 * - Font-display optimization
 * - Subsetting for faster loads
 * - FOIT/FOUT prevention
 */

export interface FontConfig {
  family: string;
  weights?: number[];
  styles?: ('normal' | 'italic')[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
  subset?: string;
}

/**
 * Preload critical fonts for faster rendering
 * Reduces Font Load Time and prevents FOIT (Flash of Invisible Text)
 */
export function preloadFont(
  href: string,
  options?: {
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }
) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = options?.type || 'font/woff2';
  link.crossOrigin = options?.crossOrigin || 'anonymous';
  link.href = href;

  document.head.appendChild(link);
}

/**
 * Generate optimized font-face declarations
 * Uses font-display: swap for better perceived performance
 */
export function generateFontFace(config: FontConfig): string {
  const {
    family,
    weights = [400],
    styles = ['normal'],
    display = 'swap',
    subset,
  } = config;

  const declarations: string[] = [];

  weights.forEach((weight) => {
    styles.forEach((style) => {
      const unicodeRange = subset ? `unicode-range: ${subset};` : '';

      declarations.push(`
@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: ${display};
  ${unicodeRange}
  src: local('${family}');
}
      `.trim());
    });
  });

  return declarations.join('\n\n');
}

/**
 * Optimize Google Fonts loading
 * - Preconnect to fonts.googleapis.com and fonts.gstatic.com
 * - Add display=swap parameter
 * - Subset for specific languages
 */
export function optimizeGoogleFonts(
  families: string[],
  options?: {
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    subset?: string;
  }
) {
  if (typeof document === 'undefined') return;

  const display = options?.display || 'swap';
  const subset = options?.subset || 'latin';

  // Preconnect to Google Fonts domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  preconnectDomains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Create optimized Google Fonts link
  const familiesParam = families
    .map((family) => family.replace(' ', '+'))
    .join('&family=');

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = `https://fonts.googleapis.com/css2?family=${familiesParam}&display=${display}&subset=${subset}`;
  document.head.appendChild(fontLink);
}

/**
 * System Font Stack - Ultra-fast fallback
 * Uses system fonts for instant rendering
 */
export const SYSTEM_FONT_STACK = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
].join(', ');

/**
 * Font loading event handler
 * Detect when fonts are loaded and apply optimizations
 */
export function onFontsLoaded(callback: () => void) {
  if (typeof document === 'undefined') return;

  if ('fonts' in document) {
    (document as any).fonts.ready.then(() => {
      callback();
    });
  } else {
    // Fallback for browsers without Font Loading API
    window.addEventListener('load', callback);
  }
}

/**
 * Detect if font is available
 */
export function isFontAvailable(fontFamily: string): boolean {
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return false;

  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';

  context.font = `${testSize} monospace`;
  const monospaceWidth = context.measureText(testString).width;

  context.font = `${testSize} ${fontFamily}, monospace`;
  const fontWidth = context.measureText(testString).width;

  return monospaceWidth !== fontWidth;
}

/**
 * Critical fonts configuration for ZoeHoliday
 * These should be preloaded for optimal LCP
 */
export const CRITICAL_FONTS = [
  {
    family: 'System UI',
    weights: [400, 600, 700],
    display: 'swap' as const,
    preload: true,
  },
];

/**
 * Preload all critical fonts
 */
export function preloadCriticalFonts() {
  CRITICAL_FONTS.forEach((font) => {
    if (font.preload && font.weights) {
      font.weights.forEach((weight) => {
        // Only preload system fonts for now
        // Custom fonts should be added as needed
      });
    }
  });
}

/**
 * Font loading observer
 * Monitors font loading performance
 */
export class FontLoadingObserver {
  private observer: PerformanceObserver | null = null;
  private callback: (entries: PerformanceEntry[]) => void;

  constructor(callback: (entries: PerformanceEntry[]) => void) {
    this.callback = callback;
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list
          .getEntries()
          .filter((entry) => entry.entryType === 'resource' && entry.name.includes('font'));

        if (entries.length > 0) {
          this.callback(entries);
        }
      });

      this.observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.error('FontLoadingObserver failed:', e);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Report font loading metrics
 */
export function reportFontMetrics() {
  if (typeof window === 'undefined' || !window.performance) return;

  const fontEntries = performance
    .getEntriesByType('resource')
    .filter((entry) => entry.name.includes('font'));

  fontEntries.forEach((entry) => {
    if (window.gtag) {
      window.gtag('event', 'font_load', {
        font_name: entry.name,
        duration: entry.duration,
        size: (entry as PerformanceResourceTiming).encodedBodySize,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Font Metrics]', {
        name: entry.name,
        duration: `${entry.duration.toFixed(2)}ms`,
        size: `${((entry as PerformanceResourceTiming).encodedBodySize / 1024).toFixed(2)}KB`,
      });
    }
  });
}
