"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Star, Clock, MapPin, Check, X, Info } from "lucide-react";
import { fetchProgramOne } from "@/fetch/programs";
import { dataTypeCardTravel } from "@/type/programs";
import { useQuery } from "@tanstack/react-query";
import { meta } from "@/type/placesToGo";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProgramPage = () => {
  const params: { title: string } = useParams();
  const { data, error, isLoading } = useQuery<
    { data: dataTypeCardTravel[]; meta: meta },
    Error
  >({
    queryKey: ["fetchProgramOne"],
    queryFn: async () =>
      await fetchProgramOne(decodeURIComponent(params.title)),
  });

  const [activeImage, setActiveImage] = useState(0);
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-primary">
        {data?.data?.at(0)?.title}
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            {data?.data?.at(0)?.images && (
              <Image
                src={
                  data?.data?.at(0)?.images?.at(activeImage)?.imageUrl ||
                  "/placeholder.svg"
                }
                alt={`Travel image ${activeImage + 1}`}
                layout="fill"
                objectFit="cover"
                className="transition-opacity duration-500"
              />
            )}
          </div>
          <div className="flex space-x-2">
            {data?.data?.at(0)?.images?.map((img, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                  index === activeImage ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={img.imageUrl || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1} ${img.title}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-primary">{data?.data?.at(0)?.descraption}</p>
          <div className="flex items-center space-x-4 text-primary text-[1.4rem] font-bold">
            <MapPin className="w-[1.4rem] h-[1.4rem]" />
            <span>{data?.data?.at(0)?.Location}</span>
          </div>
          <div className="flex items-center space-x-4 text-primary text-[1.4rem] font-bold">
            <Clock className="w-[1.4rem] h-[1.4rem]" />
            <span className="">{data?.data?.at(0)?.duration} days</span>
          </div>
          <div className="text-[1.4rem] font-bold text-primary">
            $ {Number(data?.data?.at(0)?.price).toFixed(2)}
          </div>
          <div className="flex items-center space-x-2 text-[1.4rem]">
            <Star className="w-[1.4rem] h-[1.4rem] text-yellow-400 fill-current" />
            <span className="text-primary">
              {data?.data?.at(0)?.rating} / 5
            </span>
          </div>
          <Button size="lg" className="w-full">
            Book Now
          </Button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Travel Itinerary
        </h2>
        <ol className="space-y-4">
          {data?.data?.at(0)?.content_steps &&
            data?.data?.at(0)?.content_steps?.map(
              (
                step: {
                  title: string;
                  place_to_go_subcategories: {
                    categoryName: string;
                    place_to_go_categories: { categoryName: string }[];
                  }[];
                },
                index: number
              ) => (
                <li key={index} className="flex items-center justify-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold mr-4">
                    {index + 1}
                  </span>
                  <span className="text-primary font-bold">{step?.title}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="ml-2">
                          <Info className="h-[1.4rem] w-[1.4rem]" />
                          <span className="sr-only">More info</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="!text-secondary">{step.title}</p>
                        <a
                          href={`/placesTogo/${
                            step?.place_to_go_subcategories
                              ?.at(-1)
                              ?.place_to_go_categories?.at(-1)?.categoryName 
                          }/${
                            step?.place_to_go_subcategories?.at(-1)
                              ?.categoryName
                          }/${step.title}`}
                          className="text-blue-500 hover:underline"
                        >
                          Learn more
                        </a>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              )
            )}
        </ol>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Overview</h2>
        <p className="text-primary">{data?.data?.at(0)?.overView}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            {"What's Included"}
          </h2>
          <ul className="space-y-2">
            {data?.data
              ?.at(0)
              ?.includes?.map((item: { id: number; title: string }) => (
                <li key={item.id} className="flex items-center text-primary">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>{item.title}</span>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            {"What's Excluded"}
          </h2>
          <ul className="space-y-2">
            {data?.data
              ?.at(0)
              ?.excludes?.map((item: { id: number; title: string }) => (
                <li key={item.id} className="flex items-center text-primary">
                  <X className="w-5 h-5 text-red-500 mr-2" />
                  <span>{item.title}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ProgramPage;
