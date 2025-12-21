"use client";

import dynamic from "next/dynamic";

// Dynamically import InstagramModal (client component for embeds)
const InstagramModal = dynamic(() => import("@/components/InstagramModal"), {
  ssr: false,
});

interface InstagramPost {
  id: number;
  idPost: string;
}

interface InstagramGridProps {
  posts: InstagramPost[];
}

/**
 * Instagram Grid - Client Component
 * Renders Instagram embeds using client-side scripts
 */
export default function InstagramGrid({ posts }: InstagramGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
      {posts && posts.length > 0 ? (
        posts.map((item) => (
          <div key={item.id} className="animate-on-scroll w-full flex justify-center">
            <InstagramModal idPost={item.idPost} />
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No Instagram posts available</p>
        </div>
      )}
    </div>
  );
}
