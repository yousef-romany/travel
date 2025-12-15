import { InspireSubcategories, meta } from "@/type/inspiration";
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
  data: { data: InspireSubcategories[]; meta: meta };
}) => {
  const blogs = data?.data?.at(-1)?.inspire_blogs || [];

  return (
    <div className="flex gap-4 flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Background decorative elements - responsive sizing and hidden on mobile */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-48 h-48 md:w-96 md:h-96 bg-primary rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-amber-500 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      {/* Hero section with responsive height */}
      <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image)}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-4 sm:px-6 md:px-8 text-center">
          <div className="inline-block mb-3 md:mb-4">
            <span className="px-4 py-2 sm:px-6 sm:py-3 bg-primary/10 backdrop-blur-sm text-primary text-xs sm:text-sm font-semibold rounded-full border border-primary/20 shadow-lg">
              ✨ Get Inspired
            </span>
          </div>
          <h1
            role="heading"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent drop-shadow-2xl px-2"
          >
            {slug}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mt-3 md:mt-4 max-w-2xl mx-auto px-4">
            Discover amazing stories and tips about {slug}
          </p>
        </div>
      </div>

      <SubCategoryContent slug={slug} routes={routes} blogs={blogs} />
    </div>
  );
};

export default IndexPageInspireSubCategory;
