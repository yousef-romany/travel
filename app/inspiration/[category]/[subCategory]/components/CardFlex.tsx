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
    <Card className="overflow-hidden lg:max-h-[15em] md:max-h-[15em] sm:max-h-fit">
      <div className="flex sm:flex-row h-full justify-between !items-stretch">
        <div className="relative lg:w-2/5 md:w-2/5 sm:w-full !h-full ">
          <img src={imageUrl} alt={title} className="!h-full object-cover" />
        </div>
        <div className="flex flex-col justify-between h-full w-full sm:w-3/5 p-4 sm:p-6">
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
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
