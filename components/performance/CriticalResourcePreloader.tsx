"use client";

import { useEffect } from "react";

interface PreloadResource {
  href: string;
  as: "image" | "script" | "style" | "font" | "fetch";
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  imageSrcSet?: string;
  imageSizes?: string;
}

interface CriticalResourcePreloaderProps {
  resources?: PreloadResource[];
  /**
   * Preload hero images for LCP optimization
   */
  heroImages?: string[];
  /**
   * Preload fonts
   */
  fonts?: string[];
}

/**
 * CriticalResourcePreloader Component
 *
 * Preloads critical resources to improve LCP (Largest Contentful Paint)
 * Should be used in the root layout or page components
 *
 * @example
 * ```tsx
 * <CriticalResourcePreloader
 *   heroImages={["/hero-image.jpg"]}
 *   fonts={["/fonts/custom-font.woff2"]}
 * />
 * ```
 */
export function CriticalResourcePreloader({
  resources = [],
  heroImages = [],
  fonts = [],
}: CriticalResourcePreloaderProps) {
  useEffect(() => {
    // Preload hero images for LCP
    heroImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      link.fetchPriority = "high";
      document.head.appendChild(link);
    });

    // Preload fonts
    fonts.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload custom resources
    resources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
      if (resource.imageSrcSet) link.setAttribute("imagesrcset", resource.imageSrcSet);
      if (resource.imageSizes) link.setAttribute("imagesizes", resource.imageSizes);
      link.href = resource.href;
      document.head.appendChild(link);
    });
  }, [resources, heroImages, fonts]);

  return null;
}

/**
 * PreconnectLinks Component
 *
 * Establishes early connections to important third-party origins
 * Reduces DNS, TCP, and TLS round-trip times
 */
export function PreconnectLinks({ domains }: { domains: string[] }) {
  return (
    <>
      {domains.map((domain) => (
        <link
          key={domain}
          rel="preconnect"
          href={domain}
          crossOrigin="anonymous"
        />
      ))}
    </>
  );
}

/**
 * DNSPrefetchLinks Component
 *
 * Performs DNS lookups for third-party domains in advance
 */
export function DNSPrefetchLinks({ domains }: { domains: string[] }) {
  return (
    <>
      {domains.map((domain) => (
        <link key={domain} rel="dns-prefetch" href={domain} />
      ))}
    </>
  );
}
