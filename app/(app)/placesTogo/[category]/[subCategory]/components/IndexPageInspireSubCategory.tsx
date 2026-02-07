import { meta } from "@/type/inspiration";
import { PlacesToGoSubcategories } from "@/type/placesToGo";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import SubCategoryContent from "./SubCategoryContent";

const IndexPageInspireSubCategory = ({
  routes,
  slug,
  data,
}: {
  routes: string;
  slug: string;
  data: { data: PlacesToGoSubcategories[]; meta: meta };
}) => {
  const blogs = data?.data?.at(-1)?.place_to_go_blogs || [];
  return (
    <div className="flex gap-4 flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image) as string}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-4 text-center z-10">
          <div className="inline-block mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="px-4 py-2 bg-black/30 backdrop-blur-md text-white text-xs md:text-sm font-medium rounded-full border border-white/20 shadow-xl tracking-wide uppercase">
              ✨ Explore
            </span>
          </div>
          <h1
            role="heading"
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100"
          >
            {slug}
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 line-clamp-3">
            {data?.data?.at(-1)?.description || `Discover everything about ${slug}`}
          </p>
        </div>
      </div>

      <SubCategoryContent slug={slug} routes={routes} blogs={blogs} />
    </div>
  );
};

export default IndexPageInspireSubCategory;
