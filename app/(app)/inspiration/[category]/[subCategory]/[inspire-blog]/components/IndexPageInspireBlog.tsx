import MDXRenderer from "@/components/MDXRenderer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { InspireBlogs, meta } from "@/type/inspiration";
import { FaYoutube } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import { Media } from "@/type/programs";

const IndexPageInspireBlog = ({
  slug,
  data
}: {
  slug: string;
  data: { data: InspireBlogs[]; meta: meta };
}) => {
  const blog = data?.data?.at(-1);
  if (!blog) return <p className="text-center py-8">Blog not found</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Image Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <OptimizedImage
          src={getImageUrl(blog.image as Media) as string}
          alt={blog.title as string}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="container mx-auto max-w-5xl text-center md:text-left">
            <div className="inline-block mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="px-6 py-2 bg-black/30 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20 shadow-xl tracking-wide uppercase">
                ✨ Get Inspired
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12 relative z-10">

        {/* Content Section */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="prose prose-base md:prose-lg lg:prose-xl max-w-none dark:prose-invert 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground 
            prose-p:text-muted-foreground prose-p:leading-relaxed 
            prose-strong:text-foreground prose-a:text-primary 
            prose-img:rounded-3xl prose-img:shadow-xl prose-img:w-full
            [&>h1]:text-2xl md:[&>h1]:text-4xl 
            [&>h2]:text-xl md:[&>h2]:text-3xl">
            <MDXRenderer mdxString={blog.details as string} />
          </div>
        </div>

        {/* YouTube Section */}
        {blog.youtubeUrl && (
          <section className="mb-12">
            <Separator className="mb-8" />
            <div className="flex items-center gap-3 mb-6">
              <FaYoutube className="text-4xl text-red-600" />
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Video Tour
              </h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8">
              Experience {blog.title} through our curated video content
            </p>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              <YouTubeEmbed videoUrl={blog.youtubeUrl as string} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default IndexPageInspireBlog;
