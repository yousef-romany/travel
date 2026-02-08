import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const BlogGridSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header Skeleton */}
            <div className="mb-12 space-y-4">
                <Skeleton className="h-12 w-64 rounded-lg" />
                <Skeleton className="h-6 w-full max-w-lg" />
            </div>

            {/* Featured Blog Skeleton (Optional, simulating first item larger) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden border-none shadow-none bg-transparent">
                        <Skeleton className="aspect-video w-full rounded-2xl mb-4" />
                        <CardContent className="p-0 space-y-3">
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-20 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BlogGridSkeleton;
