// lib/gift-cards.ts - Gift card management system

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  recipientEmail?: string;
  recipientName?: string;
  senderName?: string;
  message?: string;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
  usedAmount: number;
  transactionHistory: GiftCardTransaction[];
}

export interface GiftCardTransaction {
  id: string;
  amount: number;
  type: "purchase" | "redemption" | "refund";
  description: string;
  date: string;
  bookingId?: string;
}

const STORAGE_KEY = "giftCards";

/**
 * Generate a unique gift card code
 */
export function generateGiftCardCode(): string {
  const prefix = "ZOEGIFT";
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  const checksum = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `${prefix}-${randomPart}-${checksum}`;
}

/**
 * Create a new gift card
 */
export function createGiftCard(
  amount: number,
  options: {
    recipientEmail?: string;
    recipientName?: string;
    senderName?: string;
    message?: string;
    expiryMonths?: number;
  } = {}
): GiftCard {
  const code = generateGiftCardCode();
  const now = new Date();
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + (options.expiryMonths || 12)); // Default 1 year

  const giftCard: GiftCard = {
    id: `gc_${Date.now()}`,
    code,
    balance: amount,
    originalAmount: amount,
    recipientEmail: options.recipientEmail,
    recipientName: options.recipientName,
    senderName: options.senderName,
    message: options.message,
    isActive: true,
    expiryDate: expiryDate.toISOString(),
    createdAt: now.toISOString(),
    usedAmount: 0,
    transactionHistory: [
      {
        id: `txn_${Date.now()}`,
        amount: amount,
        type: "purchase",
        description: "Gift card purchased",
        date: now.toISOString(),
      },
    ],
  };

  // Save to localStorage (in production, this would be saved to backend)
  saveGiftCard(giftCard);

  return giftCard;
}

/**
 * Save gift card to storage
 */
function saveGiftCard(giftCard: GiftCard): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getAllGiftCards();
    const updated = existing.filter((gc) => gc.id !== giftCard.id);
    updated.push(giftCard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving gift card:", error);
  }
}

/**
 * Get all gift cards from storage
 */
export function getAllGiftCards(): GiftCard[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error getting gift cards:", error);
    return [];
  }
}

/**
 * Get gift card by code
 */
export function getGiftCardByCode(code: string): GiftCard | null {
  const giftCards = getAllGiftCards();
  return giftCards.find((gc) => gc.code === code.toUpperCase()) || null;
}

/**
 * Validate gift card
 */
export function validateGiftCard(
  code: string
): { isValid: boolean; giftCard?: GiftCard; error?: string } {
  const giftCard = getGiftCardByCode(code);

  if (!giftCard) {
    return { isValid: false, error: "Gift card not found" };
  }

  if (!giftCard.isActive) {
    return { isValid: false, error: "Gift card is no longer active" };
  }

  if (giftCard.balance <= 0) {
    return { isValid: false, error: "Gift card balance is zero" };
  }

  const now = new Date();
  const expiry = new Date(giftCard.expiryDate);
  if (now > expiry) {
    return { isValid: false, error: "Gift card has expired" };
  }

  return { isValid: true, giftCard };
}

/**
 * Redeem gift card
 */
export function redeemGiftCard(
  code: string,
  amount: number,
  bookingId?: string
): {
  success: boolean;
  newBalance?: number;
  error?: string;
} {
  const validation = validateGiftCard(code);

  if (!validation.isValid || !validation.giftCard) {
    return { success: false, error: validation.error };
  }

  const giftCard = validation.giftCard;

  if (amount > giftCard.balance) {
    return {
      success: false,
      error: `Insufficient balance. Available: $${giftCard.balance.toFixed(2)}`,
    };
  }

  // Update gift card
  giftCard.balance -= amount;
  giftCard.usedAmount += amount;
  giftCard.transactionHistory.push({
    id: `txn_${Date.now()}`,
    amount: -amount,
    type: "redemption",
    description: bookingId ? `Redeemed for booking ${bookingId}` : "Redeemed",
    date: new Date().toISOString(),
    bookingId,
  });

  saveGiftCard(giftCard);

  return {
    success: true,
    newBalance: giftCard.balance,
  };
}

/**
 * Check gift card balance
 */
export function checkGiftCardBalance(code: string): number | null {
  const giftCard = getGiftCardByCode(code);
  return giftCard ? giftCard.balance : null;
}

/**
 * Get gift card transaction history
 */
export function getGiftCardHistory(code: string): GiftCardTransaction[] {
  const giftCard = getGiftCardByCode(code);
  return giftCard ? giftCard.transactionHistory : [];
}

/**
 * Deactivate gift card
 */
export function deactivateGiftCard(code: string): boolean {
  const giftCard = getGiftCardByCode(code);
  if (!giftCard) return false;

  giftCard.isActive = false;
  saveGiftCard(giftCard);
  return true;
}

/**
 * Refund to gift card
 */
export function refundToGiftCard(
  code: string,
  amount: number,
  reason: string
): boolean {
  const giftCard = getGiftCardByCode(code);
  if (!giftCard) return false;

  giftCard.balance += amount;
  giftCard.usedAmount = Math.max(0, giftCard.usedAmount - amount);
  giftCard.transactionHistory.push({
    id: `txn_${Date.now()}`,
    amount: amount,
    type: "refund",
    description: reason,
    date: new Date().toISOString(),
  });

  saveGiftCard(giftCard);
  return true;
}

/**
 * Format gift card code for display
 */
export function formatGiftCardCode(code: string): string {
  // Format: ZOEGIFT-XXXX-XX
  return code.toUpperCase();
}

/**
 * Get predefined gift card amounts
 */
export function getPredefinedAmounts(): number[] {
  return [50, 100, 200, 500, 1000];
}

/**
 * Calculate gift card discount percentage for display
 */
export function calculateGiftCardUsage(giftCard: GiftCard): {
  percentUsed: number;
  percentRemaining: number;
} {
  const percentUsed = (giftCard.usedAmount / giftCard.originalAmount) * 100;
  const percentRemaining = 100 - percentUsed;

  return {
    percentUsed: Math.round(percentUsed),
    percentRemaining: Math.round(percentRemaining),
  };
}

/**
 * Check if gift card is expiring soon (within 30 days)
 */
export function isGiftCardExpiringSoon(giftCard: GiftCard): boolean {
  const now = new Date();
  const expiry = new Date(giftCard.expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
}

/**
 * Get days until gift card expires
 */
export function getDaysUntilExpiry(giftCard: GiftCard): number {
  const now = new Date();
  const expiry = new Date(giftCard.expiryDate);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Generate mock gift cards for demo
 */
export function generateMockGiftCards(): GiftCard[] {
  return [
    {
      id: "gc_1",
      code: "ZOEGIFT-DEMO1234-01",
      balance: 150,
      originalAmount: 200,
      recipientName: "John Doe",
      senderName: "Jane Smith",
      message: "Happy Birthday! Enjoy your trip!",
      isActive: true,
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      usedAmount: 50,
      transactionHistory: [
        {
          id: "txn_1",
          amount: 200,
          type: "purchase",
          description: "Gift card purchased",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn_2",
          amount: -50,
          type: "redemption",
          description: "Redeemed for booking BOK-001",
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          bookingId: "BOK-001",
        },
      ],
    },
  ];
}
