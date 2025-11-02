"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ProgramCarousel } from "./ProgramCarousel";
import { memo } from "react";
import { dataTypeCardTravel } from "@/type/programs";
import { useRouter } from "next/navigation";

const CardTravels = ({
  images,
  title,
  descraption,
  Location,
  duration,
  price,
  rating,
}: dataTypeCardTravel) => {
  const route = useRouter();
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        {images && <ProgramCarousel images={images} />}
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription>{descraption}</CardDescription>
        <p className="mt-2">
          <strong>Location:</strong> {Location}
        </p>
        <p>
          <strong>Duration:</strong> {duration}
        </p>
        <p>
          <strong>Price:</strong> ${Number(price)}
        </p>
        <div className="flex items-center mt-2 text-primary">
          <strong className="mr-2">Rating:</strong>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(Number(rating))
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2">{Number(rating).toFixed(1)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => route.push(`/programs/${title}`)}
        >
          More Info
        </Button>
      </CardFooter>
    </Card>
  );
};
export default memo(CardTravels);
