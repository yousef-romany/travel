/**
 * Check if a booking can be cancelled based on 24-hour policy
 * Users can only cancel bookings within 24 hours of creation
 */
export const canCancelBooking = (bookingCreatedAt: string): boolean => {
  const createdDate = new Date(bookingCreatedAt);
  const now = new Date();
  const hoursSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

  return hoursSinceCreation <= 24;
};

/**
 * Get the remaining time to cancel a booking
 */
export const getRemainingCancellationTime = (bookingCreatedAt: string): string => {
  const createdDate = new Date(bookingCreatedAt);
  const now = new Date();
  const hoursSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

  if (hoursSinceCreation >= 24) {
    return "Cancellation period expired";
  }

  const hoursRemaining = 24 - hoursSinceCreation;

  if (hoursRemaining >= 1) {
    return `${Math.floor(hoursRemaining)} hours remaining`;
  } else {
    const minutesRemaining = Math.floor(hoursRemaining * 60);
    return `${minutesRemaining} minutes remaining`;
  }
};

/**
 * Get the cancellation deadline date
 */
export const getCancellationDeadline = (bookingCreatedAt: string): Date => {
  const createdDate = new Date(bookingCreatedAt);
  return new Date(createdDate.getTime() + (24 * 60 * 60 * 1000));
};
