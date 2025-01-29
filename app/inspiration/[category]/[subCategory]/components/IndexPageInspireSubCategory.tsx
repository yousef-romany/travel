import { fetchInspirationOneSubCategory } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

const IndexPageInspireSubCategory = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<any, Error>({
    queryKey: ["fetchInspirationOneSubCategory"],
    queryFn: () => fetchInspirationOneSubCategory(slug),
  });
  if (isLoading) return <p>Loading categories...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  console.log(data, slug);
  return <div className="flex gap-4 flex-col h-fit justify-between"></div>;
};
export default memo(IndexPageInspireSubCategory);
