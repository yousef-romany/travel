import Image from "next/image";
import { memo } from "react";
import { Skeleton } from "../ui/skeleton";
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
          <Image
            src={imageUrl}
            alt="name"
            className="h-[140px] rounded-xl"
            loading="lazy"
            height={140}
            width={200}
          />
        ) : (
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        )}
        <h1 role="heading"  className="text-lg font-bold text-center p-4">{categoryName}</h1>
      </div>
    </Link>
  );
};
export default memo(CardCategory);
