
import MDXRenderer from "@/components/MDXRenderer";
import OptimizedImage from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
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

const CardFlex = ({
  title,
  imageUrl,
  details,
  link,
}: {
  routes: string;
  slug: string;
  title: string;
  details: string;
  imageUrl: Media;
  link: string;
}) => {
  return (
    <Card className="overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-card to-card/50">
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image section - full width on mobile, 40% on larger screens */}
        <div className="relative w-full sm:w-2/5 lg:w-2/5 h-[200px] sm:h-auto overflow-hidden">
          <OptimizedImage
            src={getImageUrl(imageUrl)}
            alt={title as string}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content section */}
        <div className="flex flex-col justify-between w-full sm:w-3/5 lg:w-3/5 p-4 sm:p-6 md:p-8">
          <div>
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-primary transition-all">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-sm md:text-base text-muted-foreground line-clamp-3 sm:line-clamp-4">
                <MDXRenderer mdxString={details.slice(0, 150)} />
              </div>
            </CardContent>
          </div>
          <CardFooter className="p-0 mt-4 sm:mt-6">
            <Button asChild variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Link href={link}>Read More</Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
export default memo(CardFlex);
