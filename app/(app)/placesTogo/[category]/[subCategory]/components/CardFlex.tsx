 
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
    <Card className="group overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
      <div className="flex flex-col sm:flex-row h-full justify-between">
        <div className="relative lg:w-2/5 md:w-2/5 sm:w-full h-[200px] sm:h-auto overflow-hidden">
          <OptimizedImage
            src={getImageUrl(imageUrl)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent sm:block hidden"></div>
        </div>
        <div className="flex flex-col justify-between h-full w-full sm:w-3/5 p-6">
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden text-muted-foreground">
              <MDXRenderer mdxString={details.slice(0, 150)} /> ...
            </CardContent>
          </div>
          <CardFooter className="p-0 mt-6">
            <Button asChild className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white">
              <Link href={link}>
                Read More
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
export default memo(CardFlex);
