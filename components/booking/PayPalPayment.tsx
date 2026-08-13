"use client";

import { useEffect, useRef, useState } from "react";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2, AlertCircle, Info, ChevronDown } from "lucide-react";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

interface PayPalPaymentProps {
    amount: number;
    currency?: string;
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
    onCancel?: () => void;
    disabled?: boolean;
}

const ButtonWrapper = ({ amount, currency, onSuccess, onError, onCancel, disabled }: PayPalPaymentProps) => {
    const [{ options, isPending, isRejected }, dispatch] = usePayPalScriptReducer();
    // Guard against calling callbacks after unmount
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        dispatch({
            type: "resetOptions" as any,
            value: {
                ...options,
                currency: currency || "USD",
            },
        });
    }, [currency, amount]);

    if (isRejected) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Failed to load PayPal. Please refresh the page or try another browser.</span>
            </div>
        );
    }

    return (
        <div className="w-full relative z-0">
            {isPending && (
                <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            )}
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect", color: "gold" }}
                disabled={disabled || isPending}
                forceReRender={[amount, currency, disabled]}
                fundingSource={undefined}
                createOrder={(_data, actions) => {
                    // Guard: amount must be positive and finite
                    if (!amount || amount <= 0 || !isFinite(amount)) {
                        return Promise.reject(new Error("Invalid payment amount"));
                    }
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    // Round to 2 decimal places to avoid PayPal precision errors
                                    value: amount.toFixed(2),
                                    currency_code: currency || "USD",
                                },
                            },
                        ],
                        intent: "CAPTURE",
                    });
                }}
                onApprove={async (_data, actions) => {
                    if (!actions.order) return;
                    try {
                        const details = await actions.order.capture();
                        if (isMounted.current) {
                            onSuccess(details);
                        }
                    } catch (captureErr) {
                        if (isMounted.current) {
                            onError(captureErr);
                        }
                    }
                }}
                onCancel={(_data) => {
                    if (isMounted.current && onCancel) {
                        onCancel();
                    }
                }}
                onError={(err) => {
                    if (isMounted.current) {
                        onError(err);
                    }
                }}
            />
            <PayPalFee amount={amount} currency={currency} />
        </div>
    );
};

const PayPalFee = ({ amount, currency }: { amount: number; currency?: string }) => {
    const [showDetails, setShowDetails] = useState(false);

    if (!amount || amount <= 0 || !isFinite(amount)) return null;

    const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    const percentage = 0.0349;
    const fixedFee = 0.49;
    const fee = amount * percentage + fixedFee;
    const total = amount + fee;

    return (
        <div className="mt-3 rounded-lg border border-muted bg-muted/30 px-3 py-2">
            <div className="flex items-center justify-between text-xs">
                <button
                    type="button"
                    onClick={() => setShowDetails((v) => !v)}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-expanded={showDetails}
                >
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    PayPal fee
                    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${showDetails ? "rotate-180" : ""}`} />
                </button>
                <span className="font-semibold text-foreground">
                    {symbol}
                    {fee.toFixed(2)}
                </span>
            </div>
            {showDetails && (
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">{symbol}{amount.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>PayPal fee (3.49% + $0.49)</span>
                        <span className="font-medium">{symbol}{fee.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between border-t pt-1 font-semibold text-foreground">
                        <span>Total charged</span>
                        <span>{symbol}{total.toFixed(2)}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default function PayPalPayment(props: PayPalPaymentProps) {
    if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === "test") {
        console.warn("[PayPalPayment] Running in sandbox mode — set NEXT_PUBLIC_PAYPAL_CLIENT_ID for production.");
    }

    return (
        <PayPalScriptProvider
            options={{
                clientId: PAYPAL_CLIENT_ID,
                components: "buttons",
                currency: props.currency || "USD",
                intent: "capture",
            }}
        >
            <ButtonWrapper {...props} />
        </PayPalScriptProvider>
    );
}
