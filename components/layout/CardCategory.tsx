import { memo } from "react";
import { Skeleton } from "../ui/skeleton";
import ProgressiveImage from "../ProgressiveImage";
import Link from "next/link";

interface props {
  categoryName: string;
  imageUrl: string;
  url: string
}

const CardCategory = ({ categoryName, imageUrl, url }: props) => {
  return (
    <Link href={url}>
      <div className="w-[210px] h-[210px] flex flex-col rounded-xl bg-sidebar gap-6">
        {imageUrl ? (
          <div className="relative h-[140px] w-full rounded-xl overflow-hidden">
            <ProgressiveImage
              src={imageUrl}
              alt={categoryName}
              fill
              sizes="210px"
              quality={80}
              priority={false}
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        ) : (
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        )}
        <h1 role="heading"  className="text-lg font-bold text-center p-4">{categoryName}</h1>
      </div>
    </Link>
  );
};
export default memo(CardCategory);
