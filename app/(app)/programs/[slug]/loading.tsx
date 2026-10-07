
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Header Skeleton */}
                <div className="text-center mb-12 space-y-4 flex flex-col items-center">
                    <Skeleton className="h-8 w-48 rounded-full mb-2" />
                    <Skeleton className="h-12 w-3/4 md:w-1/2" />
                    <Skeleton className="h-10 w-40 rounded-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Image Carousel Skeleton */}
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />

                    {/* Booking Card Skeleton */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <Skeleton className="h-8 w-1/3" />
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-24 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Itinerary Skeleton */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>

                    <div className="space-y-8 pl-6 border-l-2 border-muted ml-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="pl-8 relative">
                                <Skeleton className="absolute -left-[37px] top-0 h-4 w-4 rounded-full" />
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
