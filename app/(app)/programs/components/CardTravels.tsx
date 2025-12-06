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
import { CompareButton } from "@/components/programs/CompareButton";
import { trackCardClick, trackExploreClick } from "@/lib/analytics";
import { getImageUrl } from "@/lib/utils";

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

  const handleViewDetails = () => {
    trackCardClick("Travel Program", title, documentId);
    trackExploreClick("Program", title, documentId);
    router.push(`/programs/${documentId}`);
  };

  return (
    <Card className="group flex flex-col overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="p-0 relative">
        {images && <ProgramCarousel images={images} />}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton
            programId={id}
            className="bg-background/95 hover:bg-background hover:text-primary hover:scale-110 shadow-lg transition-all duration-200"
          />
        </div>

        {/* Rating Badge */}
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-amber-600 text-white backdrop-blur-sm shadow-lg border-0">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {Number(rating).toFixed(1)}
        </Badge>
      </CardHeader>

      <CardContent className="flex-grow pt-5 space-y-4">
        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors duration-200 font-bold">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-base leading-relaxed">
          {descraption}
        </CardDescription>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium">{Location}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-muted-foreground font-medium">
              {duration} {duration === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-primary/10">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
              ${Number(price)}
            </span>
            <span className="text-sm text-muted-foreground font-medium">/ person</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-5 flex flex-col gap-2">
        <Button
          className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        <CompareButton
          program={{
            id,
            documentId,
            title,
            price,
            duration,
            Location,
            rating,
            descraption,
            imageUrl: images && images.length > 0 ? getImageUrl(images[0]) : undefined
          }}
          variant="outline"
          size="default"
        />
      </CardFooter>
    </Card>
  );
};

export default memo(CardTravels);