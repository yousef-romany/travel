"use client";

import { Skeleton } from "../ui/skeleton";

export default function NavBarSkeleton() {
  return (
    <nav className="z-50 w-full h-[76px] px-3 sm:px-4 md:px-6 lg:px-8 fixed top-0 left-0 border-b-2 border-primary bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 flex justify-between items-center shadow-sm">
      {/* Mobile Menu Skeleton */}
      <div className="lg:hidden flex-shrink-0">
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      {/* Logo Skeleton */}
      <div className="flex-shrink-0 mx-auto lg:mx-0">
        <Skeleton className="h-10 w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px]" />
      </div>

      {/* Desktop Navigation Skeleton */}
      <div className="hidden lg:flex flex-1 justify-center gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-20" />
      </div>

      {/* Right Actions Skeleton */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Comparison Button */}
        <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-md" />

        {/* Wishlist Button */}
        <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-md hidden sm:block lg:block" />

        {/* Theme Toggle */}
        <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-md" />

        {/* Login Button */}
        <Skeleton className="h-9 sm:h-10 w-20 sm:w-24 rounded-md" />
      </div>
    </nav>
  );
}
