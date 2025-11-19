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
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
import { ProgramCarousel } from "./ProgramCarousel";
import { memo } from "react";
import { useRouter } from "next/navigation";
import WishlistButton from "@/components/WishlistButton";

interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

interface Media {
  id: number;
  name: string;
  url: string;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

interface CardTravelsProps {
  id: number;
  documentId: string;
  images: Media[];
  title: string;
  descraption: string;
  Location: string;
  duration: number;
  price: number;
  rating: number;
  overView: string;
}

const CardTravels = ({
  id,
  documentId,
  images,
  title,
  descraption,
  Location,
  duration,
  price,
  rating,
}: CardTravelsProps) => {
  const router = useRouter();

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0 relative">
        {images && <ProgramCarousel images={images} />}
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton 
            programId={id} 
            className="bg-background hover:text-primary dark:bg-background-800/90 hover:dark:bg-background-800"
          />
        </div>

        {/* Rating Badge */}
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {Number(rating).toFixed(1)}
        </Badge>
      </CardHeader>

      <CardContent className="flex-grow pt-4 space-y-3">
        <CardTitle className="text-primary text-xl line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{descraption}</CardDescription>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{Location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{duration} {duration === 1 ? 'Day' : 'Days'}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">${Number(price)}</span>
            <span className="text-sm text-muted-foreground">/ person</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full"
          onClick={() => router.push(`/programs/${documentId}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default memo(CardTravels);