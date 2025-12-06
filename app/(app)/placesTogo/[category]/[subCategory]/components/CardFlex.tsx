import MDXRenderer from "@/components/MDXRenderer";
import OptimizedImage from "@/components/OptimizedImage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getImageUrl } from "@/lib/utils";
import { Media } from "@/type/programs";
import Link from "next/link";
import { memo } from "react";
import { MdArrowOutward } from "react-icons/md";

const CardFlex = ({
  link,
  title,
  imageUrl,
  details,
}: {
  link: string;
  routes: string;
  slug: string;
  title: string;
  details: string;
  imageUrl: Media;
}) => {
  return (
    <Link href={link} className="block h-full">
      <Card className="group h-full rounded-3xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card">
        <div className="flex flex-col sm:flex-row h-full">
          <div className="relative w-full sm:w-2/5 h-[240px] sm:h-auto overflow-hidden">
            <OptimizedImage
              src={getImageUrl(imageUrl)}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col justify-between flex-1 p-6 sm:p-8">
            <div>
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl sm:text-2xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-sm text-muted-foreground line-clamp-2">
                  <MDXRenderer mdxString={details.slice(0, 100) + "..."} />
                </div>
              </CardContent>
            </div>
            <CardFooter className="p-0 mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span>Explore Details</span>
                <MdArrowOutward />
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
  );
};
export default memo(CardFlex);
