/**
 * Centralized error handling utility
 * Provides consistent error handling and user-friendly error messages
 */

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  const axiosError = error as any;
  if (axiosError?.response?.data?.error?.message) {
    return axiosError.response.data.error.message;
  }

  if (axiosError?.message) {
    return axiosError.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Create standardized AppError from various error types
 */
export function createAppError(error: unknown): AppError {
  const axiosError = error as any;

  return {
    message: getErrorMessage(error),
    code: axiosError?.code,
    status: axiosError?.response?.status,
    details: axiosError?.response?.data,
  };
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  const axiosError = error as any;
  return (
    axiosError?.code === 'ECONNREFUSED' ||
    axiosError?.code === 'ETIMEDOUT' ||
    axiosError?.code === 'ECONNABORTED' ||
    axiosError?.message?.includes('Network Error')
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  const axiosError = error as any;
  return axiosError?.response?.status === 401 || axiosError?.response?.status === 403;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  const axiosError = error as any;
  return axiosError?.response?.status === 400 || axiosError?.response?.status === 422;
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  const axiosError = error as any;
  return axiosError?.response?.status === 404;
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (isAuthError(error)) {
    return 'Your session has expired. Please log in again.';
  }

  if (isNotFoundError(error)) {
    return 'The requested resource could not be found.';
  }

  if (isValidationError(error)) {
    return getErrorMessage(error);
  }

  const axiosError = error as any;
  if (axiosError?.response?.status >= 500) {
    return 'A server error occurred. Please try again later.';
  }

  return getErrorMessage(error);
}

/**
 * Handle error with optional callback
 */
export function handleError(
  error: unknown,
  onError?: (appError: AppError) => void
): AppError {
  const appError = createAppError(error);

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', appError);
  }

  // Call custom error handler if provided
  if (onError) {
    onError(appError);
  }

  return appError;
}
