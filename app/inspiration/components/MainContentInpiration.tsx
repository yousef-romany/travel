/* eslint-disable @next/next/no-img-element */
"use client";

import Loading from "@/components/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { fetchInspirationCategories } from "@/fetch/category";
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
    applyHieroglyphEffect()
  }, [])
  const { data, error, isLoading } = useQuery<InspirationCategory, Error>({
    queryKey: ["fetchInspirationCategories2"],
    queryFn: () => fetchInspirationCategories(),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="bg-primary w-full p-2 px-[2em]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-secondary">
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-secondary">
              <BreadcrumbPage className="text-secondary border-b-2">
                {"Inspiration"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative h-full w-full">
        {/* Background Image */}
        <img
          src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1738236129/2639898_f1hvdj.jpg"
          alt="Hero background"
          className="object-cover opacity-50 bg-black w-full h-full"
        />

        {/* Content */}
        <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-full h-fit z-20 flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <h1 role="heading"  className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4">
            Discover Amazing Content
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-center mb-8 max-w-2xl">
            Explore our curated collection of articles, guides, and inspiration
            across various categories.
          </p>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {data?.data?.map((category: InspirationCategoryData) => (
              <Link
                key={category.id}
                href={`/inspiration/${category.categoryName}`}
                // className="px-4 py-2 text-sm font-medium text-white bg-button/20 rounded-full hover:bg-button/30 transition-colors cursor-pointer"
              >
                <Button>{category.categoryName}</Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(MainContentInpiration);
