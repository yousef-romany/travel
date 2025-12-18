"use client";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface PageErrorBoundaryProps {
  children: React.ReactNode;
}

export default function PageErrorBoundary({ children }: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-3xl font-bold">Unable to Load Page</h2>
            <p className="mb-6 text-muted-foreground">
              We encountered an error while loading this page. Please try again later.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="rounded-md border border-input bg-background px-6 py-2 hover:bg-accent"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
