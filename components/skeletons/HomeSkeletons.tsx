import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function InspireCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full rounded-none" />
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-24 mt-4" />
      </CardContent>
    </Card>
  );
}

export function PlaceCategorySkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-4 text-center space-y-2">
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6 mx-auto" />
        <Skeleton className="h-9 w-full mt-3" />
      </CardContent>
    </Card>
  );
}

export function ProgramCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export function InstagramPostSkeleton() {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <Skeleton className="aspect-square w-full" />
    </div>
  );
}

export function InspireSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <InspireCardSkeleton />
      <InspireCardSkeleton />
      <InspireCardSkeleton />
    </div>
  );
}

export function PlacesSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <PlaceCategorySkeleton />
      <PlaceCategorySkeleton />
      <PlaceCategorySkeleton />
      <PlaceCategorySkeleton />
    </div>
  );
}

export function ProgramsSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProgramCardSkeleton />
      <ProgramCardSkeleton />
      <ProgramCardSkeleton />
    </div>
  );
}

export function InstagramSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <InstagramPostSkeleton />
      <InstagramPostSkeleton />
      <InstagramPostSkeleton />
      <InstagramPostSkeleton />
      <InstagramPostSkeleton />
      <InstagramPostSkeleton />
    </div>
  );
}
