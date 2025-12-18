"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    } else {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="max-w-md rounded-lg border border-destructive bg-card p-6 text-center shadow-lg">
            <h2 className="mb-2 text-2xl font-bold text-destructive">Oops! Something went wrong</h2>
            <p className="mb-4 text-muted-foreground">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-semibold">Error Details</summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
