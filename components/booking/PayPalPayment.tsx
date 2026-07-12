"use client";

import { useEffect, useRef } from "react";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2, AlertCircle } from "lucide-react";

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
