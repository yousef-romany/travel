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
  link: string;
}) {
  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-card to-card/50">
      <div className="relative w-full overflow-hidden">
        <OptimizedImage
          src={getImageUrl(imageUrl)}
          alt={title}
          className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-col flex-grow p-4 md:p-5">
        <CardHeader className="p-0">
          <CardTitle className="text-lg md:text-xl font-bold mb-2 line-clamp-2 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-primary transition-all">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <div className="text-sm text-muted-foreground line-clamp-3">
            <MDXRenderer mdxString={details.slice(0, 100)} />
          </div>
        </CardContent>
        <CardFooter className="p-0 mt-4">
          <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Link href={link}>Read More</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
