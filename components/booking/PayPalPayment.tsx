"use client";

import { useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";

// You can use "test" as client-id for sandbox testing but it won't process real money.
// For production, this must be a real client ID.
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

interface PayPalPaymentProps {
    amount: number;
    currency?: string;
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
    disabled?: boolean;
}

const ButtonWrapper = ({ amount, currency, onSuccess, onError, disabled }: PayPalPaymentProps) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions" as any,
            value: {
                ...options,
                currency: currency || "USD",
            },
        });
    }, [currency, amount]);

    return (
        <div className="w-full relative z-0">
            {(isPending) && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>}
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                disabled={disabled}
                forceReRender={[amount, currency, disabled]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount.toString(),
                                    currency_code: currency || "USD"
                                },
                            },
                        ],
                        intent: "CAPTURE"
                    });
                }}
                onApprove={(data, actions) => {
                    if (!actions.order) return Promise.resolve();
                    return actions.order.capture().then((details) => {
                        onSuccess(details);
                    });
                }}
                onError={(err) => {
                    onError(err);
                }}
            />
        </div>
    );
}

export default function PayPalPayment(props: PayPalPaymentProps) {
    return (
        <PayPalScriptProvider
            options={{
                clientId: PAYPAL_CLIENT_ID,
                components: "buttons",
                currency: props.currency || "USD",
                intent: "capture"
            }}
        >
            <ButtonWrapper {...props} />
        </PayPalScriptProvider>
    );
}
