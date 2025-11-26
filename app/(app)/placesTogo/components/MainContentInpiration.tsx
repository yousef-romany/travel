"use client";

import Loading from "@/components/Loading";
import OptimizedImage from "@/components/OptimizedImage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { fetchPlaceToGoCategories } from "@/fetch/placesToGo";
import {
  InspirationCategory,
  InspirationCategoryData,
} from "@/type/inspiration";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { memo, useEffect } from "react";

const MainContentInpiration = () => {
  useEffect(() => {
    applyHieroglyphEffect();
  }, []);
  const { data, error, isLoading } = useQuery<InspirationCategory, Error>({
    queryKey: ["fetchPlaceToGoCategories2"],
    queryFn: () => fetchPlaceToGoCategories(),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>
      <div className="bg-primary w-full p-2 px-[2em]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-secondary">
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-secondary">
              <BreadcrumbPage className="text-secondary border-b-2">
                {"Places To Go"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative h-full w-full">
        {/* Background Image */}
        <OptimizedImage
          src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1738236129/2639898_f1hvdj.jpg"
          alt="Hero background"
          className="object-cover opacity-50 bg-black w-full h-full"
        />

        {/* Content */}
        <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-full h-fit z-20 flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <h1
            role="heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 animate-slide-up"
          >
            Discover Amazing Content
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-center mb-8 max-w-2xl animate-slide-up animate-delay-200">
            Explore our curated collection of articles, guides, and inspiration
            across various categories.
          </p>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-slide-up animate-delay-400">
            {data?.data?.map((category: InspirationCategoryData) => (
              <Link
                key={category.id}
                href={`/placesTogo/${category.categoryName}`}
              // className="px-4 py-2 text-sm font-medium text-white bg-button/20 rounded-full hover:bg-button/30 transition-colors cursor-pointer"
              >
                <Button className="hover-lift hover-glow transition-smooth">{category.categoryName}</Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(MainContentInpiration);
