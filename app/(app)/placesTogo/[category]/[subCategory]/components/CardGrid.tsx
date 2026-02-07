
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MDXRenderer from "@/components/MDXRenderer";
import OptimizedImage from "@/components/OptimizedImage";
import { Media } from "@/type/programs";
import { getImageUrl } from "@/lib/utils";
import { MdArrowOutward } from "react-icons/md";

export default function CardGrid({
  imageUrl,
  title,
  details,
  link,
}: {
  title: string;
  details: string;
  imageUrl: Media;
  routes: string;
  slug: string;
  link: string
}) {
  return (
    <Link href={link} className="block h-full">
      <Card className="group h-full rounded-3xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card flex flex-col">
        <div className="relative overflow-hidden aspect-[4/3] w-full">
          <OptimizedImage
            src={getImageUrl(imageUrl)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        </div>
        <div className="flex flex-col flex-grow p-6">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-lg font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {details.replace(/[*#_`]/g, '').slice(0, 150)}...
            </div>
          </CardContent>
          <CardFooter className="p-0 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
              <span>Explore Details</span>
              <MdArrowOutward />
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}
