"use client";

import { useState } from "react";
import CardFlex from "./CardFlex";
import CardGrid from "./CardGrid";
import ViewToggle from "./ViewToggle";
import { PlacesToGoBlogs } from "@/type/placesToGo";

export default function SubCategoryContent({
  slug,
  routes,
  blogs,
}: {
  slug: string;
  routes: string;
  blogs: PlacesToGoBlogs[];
}) {
  const [view, setView] = useState<string>("grid");

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-[2em] py-8 md:py-12 relative z-10">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
          All About {slug}
        </h2>

        <ViewToggle view={view} setView={setView} />
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {blogs.map((item: PlacesToGoBlogs) => (
            <CardGrid
              key={item.id}
              details={item.details}
              title={item.title}
              imageUrl={item.image}
              routes={routes}
              slug={slug}
              link={`/placesTogo/${routes}/${slug}/${item.title}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          {blogs.map((item: PlacesToGoBlogs) => (
            <CardFlex
              key={item.id}
              details={item.details}
              title={item.title}
              imageUrl={item.image}
              routes={routes}
              slug={slug}
              link={`/placesTogo/${routes}/${slug}/${item.title}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
