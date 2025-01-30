/* eslint-disable @next/next/no-img-element */
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

export default function CardGrid({
  imageUrl,
  title,
  details,
  link,
}: {
  title: string;
  details: string;
  imageUrl: string;
  routes: string;
  slug: string;
  link: string
}) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative w-full ">
        <img
          src={imageUrl}
          alt={title}
          className="w-full max-h-[200px] object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-bold mb-2 line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <MDXRenderer mdxString={details.slice(0,15)} /> ...
        </CardContent>
        <CardFooter className="p-0 mt-4">
          <Button asChild variant="outline">
            <Link href={link}>Read More</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
