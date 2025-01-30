/* eslint-disable @next/next/no-img-element */
import MDXRenderer from "@/components/MDXRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { memo } from "react";

const CardFlex = ({
  title,
  imageUrl,
  details,
  routes,
  slug,
}: {
  routes: string;
  slug: string;
  title: string;
  details: string;
  imageUrl: string;
}) => {
  return (
    <Card className="overflow-hidden max-h-[15em]">
      <div className="flex flex-col sm:flex-row h-full">
        <div className="relative w-full sm:w-2/5 h-full sm:h-full">
          <img src={imageUrl} alt={title} className="h-full object-cover" />
        </div>
        <div className="flex flex-col justify-between h-full w-full sm:w-3/5 p-4 sm:p-6">
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MDXRenderer mdxString={details.slice(0, 15)} /> ...
            </CardContent>
          </div>
          <CardFooter className="p-0 mt-4">
            <Button asChild variant="outline">
              <Link href={`/inspiration/${routes}/${slug}/${title}`}>
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
