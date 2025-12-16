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
import {
  InspirationCategory,
  InspirationCategoryData,
} from "@/type/inspiration";
import Link from "next/link";

const MainContentInpiration = ({ data }: { data: InspirationCategory }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>
      <div className="bg-gradient-to-r from-primary to-amber-600 w-full p-4 px-[2em] shadow-lg relative z-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-white">
              <BreadcrumbLink href="/" className="hover:text-white/80 transition-colors">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60" />
            <BreadcrumbItem className="text-white">
              <BreadcrumbPage className="text-white font-semibold">
                Places To Go
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative h-full w-full min-h-[80vh]">
        {/* Background Image */}
        <OptimizedImage
          src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1738236129/2639898_f1hvdj.jpg"
          alt="Hero background"
          className="object-cover opacity-30 w-full h-full absolute inset-0"
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] text-white px-4 sm:px-6 lg:px-8 py-20">
          {/* Badge */}
          <div className="inline-block mb-6 animate-slide-up">
            <span className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20 shadow-lg">
              ✨ Explore Egypt's Wonders
            </span>
          </div>

          {/* Main Heading */}
          <h1
            role="heading"
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-6 animate-slide-up animate-delay-100 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent drop-shadow-2xl"
          >
            Discover Amazing Places
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-center mb-12 max-w-3xl animate-slide-up animate-delay-200 text-white/90 leading-relaxed">
            Explore our curated collection of Egypt's most breathtaking destinations,
            historical sites, and cultural experiences across various categories.
          </p>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up animate-delay-300 max-w-5xl">
            {data?.data?.map((category: InspirationCategoryData) => (
              <Link
                key={category.id}
                href={`/placesTogo/${category.categoryName}`}
              >
                <Button className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-xl hover:scale-105 transition-all duration-200 px-6 py-6 text-base font-semibold">
                  {category.categoryName}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContentInpiration;
