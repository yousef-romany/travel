"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configure QueryClient with consistent defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests up to 2 times
      retry: 2,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus in production (can be annoying for users)
      refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data is still fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Show error notifications by default
      onError: (error) => {
        // You can integrate with toast notifications here
        console.error('Mutation error:', error);
      },
    },
  },
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </QueryClientProvider>
  );
}
