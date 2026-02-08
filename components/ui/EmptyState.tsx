import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        variant?: "default" | "outline" | "secondary";
    };
    illustration?: ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    illustration,
}: EmptyStateProps) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                {illustration ? (
                    <div className="mb-6">{illustration}</div>
                ) : (
                    <div className="mb-6 p-4 bg-muted rounded-full">
                        <Icon className="w-12 h-12 text-muted-foreground" />
                    </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground max-w-md mb-6">{description}</p>

                {action && (
                    <Button
                        onClick={action.onClick}
                        variant={action.variant || "default"}
                        size="lg"
                    >
                        {action.label}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

// Specific empty states for common scenarios
export function NoBookingsEmpty({ onExplore }: { onExplore: () => void }) {
    return (
        <EmptyState
            icon={require("lucide-react").Plane}
            title="No trips yet"
            description="Start your Egyptian adventure today! Browse our curated programs and book your dream vacation."
            action={{
                label: "Explore Programs",
                onClick: onExplore,
            }}
        />
    );
}

export function NoWishlistEmpty({ onBrowse }: { onBrowse: () => void }) {
    return (
        <EmptyState
            icon={require("lucide-react").Heart}
            title="Your wishlist is empty"
            description="Save your favorite programs and places to easily find them later."
            action={{
                label: "Browse Programs",
                onClick: onBrowse,
                variant: "outline",
            }}
        />
    );
}

export function NoReviewsEmpty({ onWrite }: { onWrite: () => void }) {
    return (
        <EmptyState
            icon={require("lucide-react").MessageSquare}
            title="No reviews yet"
            description="Share your travel experiences and help other travelers plan their perfect trip."
            action={{
                label: "Write a Review",
                onClick: onWrite,
            }}
        />
    );
}

export function NoPlannedTripsEmpty({ onCreate }: { onCreate: () => void }) {
    return (
        <EmptyState
            icon={require("lucide-react").MapPin}
            title="No custom trips planned"
            description="Create a personalized itinerary tailored to your interests and travel style."
            action={{
                label: "Plan Your Trip",
                onClick: onCreate,
            }}
        />
    );
}
