import { Instagram } from "lucide-react";
import InstagramGrid from "../client/InstagramGrid";

interface InstagramPost {
  id: number;
  idPost: string;
}

interface InstagramSectionProps {
  posts: InstagramPost[];
}

/**
 * Instagram Section - Server Component
 * Renders Instagram heading server-side, embeds via client component
 */
export default function InstagramSection({ posts }: InstagramSectionProps) {
  return (
    <section id="instagram" className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50 dark:from-purple-950/10 dark:via-pink-950/10 dark:to-orange-950/10">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
        <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 rounded-full mb-3 sm:mb-4 shadow-lg">
          <Instagram className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent px-4">
          Follow Our Journey
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
          Get inspired by our latest Instagram content and join our community of Egypt explorers
        </p>
      </div>

      <InstagramGrid posts={posts} />
    </section>
  );
}
