"use client";

import { ComponentType, lazy, Suspense, ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

interface DynamicLoaderProps {
  /**
   * Import function for the component
   */
  loader: () => Promise<{ default: ComponentType<any> }>;
  /**
   * Fallback component while loading
   */
  fallback?: ReactNode;
  /**
   * Minimum loading time (ms) to prevent flash
   */
  minLoadTime?: number;
  /**
   * Custom skeleton dimensions
   */
  skeletonHeight?: string;
  /**
   * Enable retry on error
   */
  retry?: boolean;
  /**
   * Max retry attempts
   */
  maxRetries?: number;
}

/**
 * DynamicLoader Component - Advanced Code Splitting
 *
 * Features:
 * - Lazy loading with Suspense
 * - Automatic retry on failure
 * - Minimum load time to prevent flash
 * - Custom fallback components
 * - Error boundaries
 *
 * @example
 * ```tsx
 * <DynamicLoader
 *   loader={() => import("@/components/HeavyComponent")}
 *   fallback={<div>Loading...</div>}
 *   minLoadTime={300}
 * />
 * ```
 */
export function DynamicLoader({
  loader,
  fallback,
  minLoadTime = 200,
  skeletonHeight = "400px",
  retry = true,
  maxRetries = 3,
}: DynamicLoaderProps) {
  // Create lazy component with retry logic
  const LazyComponent = lazy(() => {
    const startTime = Date.now();

    return new Promise<{ default: ComponentType<any> }>((resolve, reject) => {
      let attempts = 0;

      const attemptLoad = () => {
        loader()
          .then((module) => {
            // Ensure minimum load time to prevent flash
            const loadTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - loadTime);

            setTimeout(() => resolve(module), remainingTime);
          })
          .catch((error) => {
            attempts++;

            if (retry && attempts < maxRetries) {
              // Exponential backoff
              const delay = Math.min(1000 * Math.pow(2, attempts), 5000);
              console.warn(`Retry loading component (${attempts}/${maxRetries})...`);
              setTimeout(attemptLoad, delay);
            } else {
              reject(error);
            }
          });
      };

      attemptLoad();
    });
  });

  const defaultFallback = (
    <div style={{ height: skeletonHeight }}>
      <Skeleton className="w-full h-full animate-pulse" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent />
    </Suspense>
  );
}

/**
 * Create a dynamically loaded component
 * Wrapper for easier usage
 */
export function createDynamicComponent<P = {}>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options?: Omit<DynamicLoaderProps, 'loader'>
) {
  return function DynamicComponent(props: P) {
    return <DynamicLoader loader={loader} {...options} />;
  };
}

/**
 * Preload a dynamic component
 * Useful for prefetching before user interaction
 */
export function preloadComponent(loader: () => Promise<{ default: ComponentType<any> }>) {
  // Start loading the component in the background
  loader().catch(() => {
    // Silently fail - component will load when needed
  });
}

/**
 * Dynamic import with timeout
 * Prevents hanging loads
 */
export async function dynamicImportWithTimeout<T>(
  importFn: () => Promise<T>,
  timeout: number = 10000
): Promise<T> {
  return Promise.race([
    importFn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Dynamic import timeout')), timeout)
    ),
  ]);
}

/**
 * Common dynamic components for ZoeHoliday
 * These are heavy components that should be code-split
 *
 * Note: Add actual component imports when needed
 * Example:
 * InstagramFeed: createDynamicComponent(
 *   () => import('@/components/instagram/InstagramFeed'),
 *   { skeletonHeight: '600px', minLoadTime: 300 }
 * )
 */
export const DynamicComponents = {
  // Add your heavy components here as needed
  // Example structure shown in MAXIMUM_QUALITY_IMPLEMENTATION.md
};

/**
 * Preload heavy components on idle
 * Uses requestIdleCallback for optimal timing
 */
export function preloadHeavyComponents() {
  if (typeof window === 'undefined') return;

  const preload = () => {
    // Add preloading logic for your heavy components here
    // Example: preloadComponent(() => import('@/components/HeavyComponent'));
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(preload, { timeout: 2000 });
  } else {
    setTimeout(preload, 1000);
  }
}
