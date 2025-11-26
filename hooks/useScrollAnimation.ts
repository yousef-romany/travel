import { useEffect } from 'react';

/**
 * Hook to observe elements with animate-on-scroll class and trigger animations
 * @param dependencies - Array of dependencies that trigger re-observation
 */
export function useScrollAnimation(dependencies: any[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            // Optionally unobserve after animation to improve performance
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
      }
    );

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(".animate-on-scroll:not(.animate-visible)");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, dependencies);
}
