"use client";

import { useCallback } from "react";
import {
    trackFormSubmission,
    trackComparison,
    trackPlanningStep,
    trackReviewSubmission,
    trackModalInteraction,
    trackPriceFilter,
    trackDurationFilter,
    trackSort,
    trackError,
} from "@/lib/analytics-enhanced";

/**
 * Hook for tracking form submissions
 */
export function useFormTracking() {
    const trackSubmission = useCallback((formName: string, formLocation: string, success: boolean) => {
        trackFormSubmission(formName, formLocation, success);
    }, []);

    return { trackSubmission };
}

/**
 * Hook for tracking comparison tool usage
 */
export function useComparisonTracking() {
    const trackCompare = useCallback((itemsCompared: string[], comparisonType: string) => {
        trackComparison(itemsCompared, comparisonType);
    }, []);

    return { trackCompare };
}

/**
 * Hook for tracking trip planning steps
 */
export function usePlanningTracking() {
    const trackStep = useCallback((stepNumber: number, stepName: string, completed: boolean) => {
        trackPlanningStep(stepNumber, stepName, completed);
    }, []);

    return { trackStep };
}

/**
 * Hook for tracking review/testimonial submissions
 */
export function useReviewTracking() {
    const trackReview = useCallback((itemType: string, itemId: string, rating: number) => {
        trackReviewSubmission(itemType, itemId, rating);
    }, []);

    return { trackReview };
}

/**
 * Hook for tracking modal interactions
 */
export function useModalTracking(modalName: string) {
    const trackOpen = useCallback((trigger?: string) => {
        trackModalInteraction(modalName, "open", trigger);
    }, [modalName]);

    const trackClose = useCallback((trigger?: string) => {
        trackModalInteraction(modalName, "close", trigger);
    }, [modalName]);

    return { trackOpen, trackClose };
}

/**
 * Hook for tracking filter changes
 */
export function useFilterTracking() {
    const trackPriceChange = useCallback((minPrice: number, maxPrice: number, currency: string = "USD") => {
        trackPriceFilter(minPrice, maxPrice, currency);
    }, []);

    const trackDurationChange = useCallback((minDays: number, maxDays: number) => {
        trackDurationFilter(minDays, maxDays);
    }, []);

    return { trackPriceChange, trackDurationChange };
}

/**
 * Hook for tracking sort changes
 */
export function useSortTracking() {
    const trackSortChange = useCallback((sortBy: string, sortOrder: "asc" | "desc", contentType: string) => {
        trackSort(sortBy, sortOrder, contentType);
    }, []);

    return { trackSortChange };
}

/**
 * Hook for tracking errors
 */
export function useErrorTracking() {
    const trackErrorEvent = useCallback((errorType: string, errorMessage: string, errorLocation: string) => {
        trackError(errorType, errorMessage, errorLocation);
    }, []);

    return { trackErrorEvent };
}
