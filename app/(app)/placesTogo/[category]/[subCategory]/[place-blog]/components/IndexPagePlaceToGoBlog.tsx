"use client";
import { memo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MDXRenderer from "@/components/MDXRenderer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { fetchPlaceToGoOneBlog } from "@/fetch/placesToGo";
import MapComponent from "@/components/Map";
import { instagramPostsType, meta, PlacesToGoBlogs } from "@/type/placesToGo";
import { FaMapMarkerAlt, FaInstagram, FaYoutube } from "react-icons/fa";
import InstagramModal from "@/components/InstagramModal";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/Loading";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import RelatedPrograms from "./RelatedPrograms";

const IndexPagePlaceToGoBlog = ({ slug, category }: { slug: string; category: string }) => {
  useEffect(() => {
    applyHieroglyphEffect();
  }, []);

  const { data, error, isLoading } = useQuery<
    { data: PlacesToGoBlogs[]; meta: meta },
    Error
  >({
    queryKey: ["fetchPlaceToGoOneBlog", slug],
    queryFn: () => fetchPlaceToGoOneBlog(decodeURIComponent(slug)),
  });

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const place = data?.data?.at(-1);
  if (!place) return <p>Place not found</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Image Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <OptimizedImage
          src={getImageUrl(place.image) as string}
          alt={place.title as string}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="container mx-auto max-w-5xl text-center md:text-left">
            <div className="inline-block mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="px-6 py-2 bg-black/30 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20 shadow-xl tracking-wide uppercase">
                ✨ Discover
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 leading-tight">
              {place.title}
            </h1>
            {(place.price !== undefined && place.price !== null) && (
              <div className="flex items-center justify-center md:justify-start gap-4 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <span className="text-lg font-medium opacity-90">
                  {Number(place.price) === 0 ? "Price" : "Starting from"}
                </span>
                <span className="text-3xl md:text-4xl font-bold bg-white text-black px-6 py-2 rounded-full shadow-lg">
                  {Number(place.price) === 0 ? "Free" : `$${place.price}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12 relative z-10">

        {/* Content Section */}
        {/* Content Section */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-img:rounded-3xl prose-img:shadow-xl">
            <MDXRenderer mdxString={place.details as string} />
          </div>
        </div>

        {/* Instagram Section */}
        {(place.instagram_posts?.length || 0) > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FaInstagram className="text-4xl text-pink-500" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Instagram Highlights
              </h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8">
              See what travelers are sharing about {place.title}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(place.instagram_posts as instagramPostsType[] | undefined)?.map((itemPost: instagramPostsType) => (
                <div
                  key={itemPost.id}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <InstagramModal idPost={itemPost.idPost} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* YouTube Section */}
        {place.youtubeUrl && (
          <section className="mb-12">
            <Separator className="mb-8" />
            <div className="flex items-center gap-3 mb-6">
              <FaYoutube className="text-4xl text-red-600" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Video Tour
              </h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8">
              Experience {place.title} through our curated video content
            </p>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              <YouTubeEmbed videoUrl={place.youtubeUrl as string} />
            </div>
          </section>
        )}

        {/* Map Section */}
        {place.lat && place.lng && (
          <section className="mb-8">
            <Separator className="mb-8" />
            <div className="flex items-center gap-3 mb-6">
              <FaMapMarkerAlt className="text-4xl text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Location
              </h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8">
              Find {place.title} on the map
            </p>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-primary/20 h-[400px] md:h-[500px]">
              <MapComponent
                title={place.title as string}
                lat={place.lat as number}
                lng={place.lng as number}
              />
            </div>
          </section>
        )}

        {/* Related Programs Section */}
        <Separator className="mb-8" />
        <RelatedPrograms placeTitle={place.title as string} query={category} />
      </div>
    </div>
  );
};

export default memo(IndexPagePlaceToGoBlog);
