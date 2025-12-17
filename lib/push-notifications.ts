// lib/push-notifications.ts - Push notification system

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    throw new Error("Push notifications are not supported");
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    console.error("Push notifications not supported");
    return null;
  }

  try {
    // Request permission first
    const permission = await requestNotificationPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    // Note: In production, you need a VAPID public key from your backend
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "DEMO_VAPID_KEY"
      ),
    });

    // Send subscription to backend
    await sendSubscriptionToBackend(subscription);

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
        auth: arrayBufferToBase64(subscription.getKey("auth")!),
      },
    };
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      // Notify backend
      await removeSubscriptionFromBackend(subscription);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    return false;
  }
}

/**
 * Check if user is subscribed
 */
export async function isSubscribedToPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Show local notification (doesn't require service worker)
 */
export function showLocalNotification(payload: NotificationPayload): void {
  if (!("Notification" in window)) {
    console.error("Notifications not supported");
    return;
  }

  if (Notification.permission === "granted") {
    const notificationOptions: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || "/icon-192x192.png",
      badge: payload.badge || "/icon-72x72.png",
      data: payload.data,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction || false,
    };

    // @ts-ignore - image is supported in Chrome/Edge but not in TypeScript types yet
    if (payload.image) {
      // @ts-ignore
      notificationOptions.image = payload.image;
    }

    new Notification(payload.title, notificationOptions);
  }
}

/**
 * Send subscription to backend
 */
async function sendSubscriptionToBackend(subscription: globalThis.PushSubscription): Promise<void> {
  // In production, send to your backend API
  try {
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        userId: getUserId(), // Get from auth context
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save subscription");
    }
  } catch (error) {
    console.error("Error sending subscription to backend:", error);
  }
}

/**
 * Remove subscription from backend
 */
async function removeSubscriptionFromBackend(subscription: globalThis.PushSubscription): Promise<void> {
  try {
    await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });
  } catch (error) {
    console.error("Error removing subscription from backend:", error);
  }
}

/**
 * Utility: Convert URL-safe base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const arrayBuffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Utility: Convert ArrayBuffer to base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Get user ID from localStorage/auth
 */
function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  // Get from your auth context or localStorage
  try {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      // Decode JWT or get user ID from your auth system
      return "user_id"; // Placeholder
    }
  } catch (error) {
    return null;
  }
  return null;
}

/**
 * Predefined notification types
 */
export const NotificationTypes = {
  BOOKING_CONFIRMED: {
    title: "Booking Confirmed! 🎉",
    body: "Your trip has been confirmed. Check your email for details.",
    icon: "/icon-192x192.png",
    tag: "booking",
  },
  PRICE_DROP: (programName: string, oldPrice: number, newPrice: number) => ({
    title: `Price Drop Alert! 💰`,
    body: `${programName} is now $${newPrice} (was $${oldPrice})`,
    icon: "/icon-192x192.png",
    tag: "price-drop",
    requireInteraction: true,
    actions: [
      { action: "view", title: "View Program" },
      { action: "close", title: "Dismiss" },
    ],
  }),
  WISHLIST_AVAILABLE: (programName: string) => ({
    title: "Wishlist Program Available! ⭐",
    body: `${programName} now has available dates!`,
    icon: "/icon-192x192.png",
    tag: "wishlist",
    actions: [
      { action: "book", title: "Book Now" },
      { action: "close", title: "Later" },
    ],
  }),
  TRIP_REMINDER: (programName: string, daysUntil: number) => ({
    title: "Trip Reminder 🌍",
    body: `Your ${programName} trip is in ${daysUntil} days!`,
    icon: "/icon-192x192.png",
    tag: "trip-reminder",
  }),
  NEW_PROGRAM: (programName: string) => ({
    title: "New Program Available! ✨",
    body: `Check out our new program: ${programName}`,
    icon: "/icon-192x192.png",
    tag: "new-program",
  }),
  LOYALTY_MILESTONE: (tierName: string, points: number) => ({
    title: "Congratulations! 🎊",
    body: `You've reached ${tierName} tier with ${points} points!`,
    icon: "/icon-192x192.png",
    tag: "loyalty",
  }),
};

/**
 * Test notification (for debugging)
 */
export function sendTestNotification(): void {
  showLocalNotification({
    title: "Test Notification",
    body: "This is a test notification from ZoeHolidays!",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
  });
}
