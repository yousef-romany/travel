import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProfileStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="border border-primary/20 animate-pulse">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="h-3 bg-muted rounded w-20 mb-3" />
                                <div className="h-8 bg-muted rounded w-16" />
                            </div>
                            <div className="w-12 h-12 bg-muted rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function BookingCardSkeleton() {
    return (
        <Card className="animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4 p-4">
                <div className="w-full sm:w-48 h-32 bg-muted rounded-lg" />
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="flex gap-4">
                        <div className="h-4 bg-muted rounded w-24" />
                        <div className="h-4 bg-muted rounded w-24" />
                    </div>
                    <div className="h-8 bg-muted rounded w-32 mt-4" />
                </div>
            </div>
        </Card>
    );
}

export function BookingListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <BookingCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function LoyaltyDashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Tier Card Skeleton */}
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-8 bg-muted rounded w-32" />
                            <div className="h-4 bg-muted rounded w-24" />
                        </div>
                        <div className="h-8 bg-muted rounded w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-2 bg-muted rounded-full w-full" />
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="pt-6">
                            <div className="h-4 bg-muted rounded w-20 mb-2" />
                            <div className="h-8 bg-muted rounded w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ReferralProgramSkeleton() {
    return (
        <div className="space-y-6">
            {/* Code Card Skeleton */}
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-48 mb-2" />
                    <div className="h-4 bg-muted rounded w-64" />
                </CardHeader>
                <CardContent>
                    <div className="h-12 bg-muted rounded w-full mb-4" />
                    <div className="flex gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-10 bg-muted rounded flex-1" />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="pt-6">
                            <div className="h-4 bg-muted rounded w-20 mb-2" />
                            <div className="h-8 bg-muted rounded w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
