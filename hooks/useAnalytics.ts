"use client";

import { useEffect, useRef, useCallback } from "react";
import {
    trackPageView,
    trackScrollDepth,
    trackTimeOnPage,
    trackButtonClick,
    trackCTA,
    trackVideoPlay,
    trackExternalLink,
    trackTabChange,
    trackAccordionToggle,
} from "@/lib/analytics";
import { usePathname } from "next/navigation";

// Hook to track page views
export function usePageTracking() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) {
            trackPageView(pathname);
        }
    }, [pathname]);
}

// Hook to track scroll depth
export function useScrollTracking() {
    const tracked25 = useRef(false);
    const tracked50 = useRef(false);
    const tracked75 = useRef(false);
    const tracked100 = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercentage >= 25 && !tracked25.current) {
                trackScrollDepth(25);
                tracked25.current = true;
            }
            if (scrollPercentage >= 50 && !tracked50.current) {
                trackScrollDepth(50);
                tracked50.current = true;
            }
            if (scrollPercentage >= 75 && !tracked75.current) {
                trackScrollDepth(75);
                tracked75.current = true;
            }
            if (scrollPercentage >= 100 && !tracked100.current) {
                trackScrollDepth(100);
                tracked100.current = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
}

// Hook to track time on page
export function useTimeTracking() {
    const pathname = usePathname();
    const startTime = useRef(Date.now());

    useEffect(() => {
        startTime.current = Date.now();

        const handleBeforeUnload = () => {
            const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
            trackTimeOnPage(timeSpent, pathname || "unknown");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            handleBeforeUnload();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [pathname]);
}

// Hook to track external links
export function useExternalLinkTracking() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a");
            if (target && target.href) {
                const url = new URL(target.href);
                if (url.hostname !== window.location.hostname) {
                    trackExternalLink(target.href, target.textContent || "External Link");
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);
}

// Hook to track video interactions
export function useVideoTracking(videoTitle: string, videoId: string) {
    const hasTracked = useRef(false);

    const trackPlay = useCallback(() => {
        if (!hasTracked.current) {
            trackVideoPlay(videoTitle, videoId);
            hasTracked.current = true;
        }
    }, [videoTitle, videoId]);

    return { trackPlay };
}

// Hook to track button clicks with analytics
export function useButtonTracking() {
    const trackClick = useCallback((buttonName: string, location: string, destination?: string) => {
        trackButtonClick(buttonName, location, destination);
    }, []);

    return { trackClick };
}

// Hook to track CTA interactions
export function useCTATracking() {
    const trackCTAClick = useCallback((ctaName: string, ctaLocation: string, ctaDestination: string) => {
        trackCTA(ctaName, ctaLocation, ctaDestination);
    }, []);

    return { trackCTAClick };
}

// Hook to track tab changes
export function useTabTracking(tabGroup: string) {
    const trackTab = useCallback(
        (tabName: string) => {
            trackTabChange(tabName, tabGroup);
        },
        [tabGroup]
    );

    return { trackTab };
}

// Hook to track accordion/collapsible interactions
export function useAccordionTracking() {
    const trackToggle = useCallback((accordionTitle: string, isOpen: boolean) => {
        trackAccordionToggle(accordionTitle, isOpen);
    }, []);

    return { trackToggle };
}

// Combined analytics hook for common page tracking
export function useAnalytics() {
    usePageTracking();
    useScrollTracking();
    useTimeTracking();
    useExternalLinkTracking();
}
