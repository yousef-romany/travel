
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header Skeleton */}
            <div className="mb-8 space-y-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-10 w-3/4 md:w-1/2" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Form Skeleton */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-8">
                            {/* Contact Info Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-48 mb-4" />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Trip Details Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-32 mb-4" />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Services Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-40 mb-4" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Summary Skeleton */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-8" />
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-lg mt-4" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
