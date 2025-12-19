"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
  /**
   * Skip lazy loading and render immediately
   * Use for above-fold content
   */
  eager?: boolean;
}

/**
 * LazySection Component
 *
 * Lazy loads below-fold sections using Intersection Observer
 * Improves initial page load performance by deferring non-critical content
 *
 * @example
 * ```tsx
 * <LazySection minHeight="400px" rootMargin="100px">
 *   <TestimonialsSection />
 * </LazySection>
 * ```
 */
export function LazySection({
  children,
  className,
  fallback,
  rootMargin = "200px",
  threshold = 0.01,
  minHeight,
  eager = false,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold, eager]);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      style={minHeight && !isVisible ? { minHeight } : undefined}
    >
      {isVisible ? (
        <div className="animate-fade-in">{children}</div>
      ) : (
        fallback || <Skeleton className="w-full h-full" />
      )}
    </div>
  );
}

/**
 * LazyComponent - Wrapper for lazy loading individual components
 */
export function LazyComponent({ children, eager = false }: { children: ReactNode; eager?: boolean }) {
  const [shouldRender, setShouldRender] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [eager]);

  return <div ref={ref}>{shouldRender ? children : null}</div>;
}
