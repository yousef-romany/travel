import Link from "next/link";
import Image from "next/image";
import { Heart, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/utils";

interface InspireBlog {
  id: number;
  documentId: string;
  title: string;
  details?: string;
  image: any;
}

interface InspireSectionProps {
  blogs: InspireBlog[];
}

/**
 * Be Inspired Section - Server Component
 * Renders inspiration blog cards with SEO-friendly links and content
 */
export default function InspireSection({ blogs }: InspireSectionProps) {
  return (
    <section id="be-inspired" className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
        <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-3 sm:mb-4">
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Be Inspired</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
          Discover the wonders that await you in the land of the pharaohs
        </p>
      </div>

      <div className="!w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => {
            const image = blog.image;

            return (
              <article key={blog.id} className="overflow-hidden group hover-lift animate-on-scroll">
                <Card className="h-full">
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <Image
                      src={getImageUrl(image)}
                      alt={`${blog.title} - Egypt travel inspiration`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white line-clamp-2">
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                      {blog.details?.replace(/<[^>]*>/g, "") ||
                        "Explore amazing destinations"}
                    </p>
                    <Link
                      href={`/inspiration/${blog.documentId}`}
                      className="text-primary font-medium hover:underline inline-flex items-center transition-smooth text-sm sm:text-base"
                    >
                      Read more about {blog.title}{" "}
                      <Compass className="ml-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              </article>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No inspiration stories available</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8 sm:mt-10">
        <Link href="/inspiration">
          <Button variant="outline" size="lg" className="gap-2 text-sm sm:text-base">
            View All Stories
            <Heart className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
