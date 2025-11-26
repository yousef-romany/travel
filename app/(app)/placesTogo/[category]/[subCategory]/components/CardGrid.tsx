 
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
  link: string
}) {
  return (
    <Card className="group overflow-hidden flex flex-col h-full border-primary/20 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300">
      <div className="relative w-full overflow-hidden">
        <OptimizedImage
          src={getImageUrl(imageUrl)}
          alt={title}
          className="w-full h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="flex flex-col flex-grow p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow text-muted-foreground">
          <MDXRenderer mdxString={details.slice(0,100)} /> ...
        </CardContent>
        <CardFooter className="p-0 mt-4">
          <Button asChild className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white">
            <Link href={link}>Read More</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
