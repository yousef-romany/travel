"use client";
import { Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButtonCompact } from "@/components/social/ShareButtons";
import { generateProgramShareText, generateTravelHashtags } from "@/lib/social-sharing";
import { trackBookingClick } from "@/lib/analytics";
import { dataTypeCardTravel } from "@/type/programs";

interface ProgramBookingCardProps {
  program: dataTypeCardTravel;
}

export function ProgramBookingCard({ program }: ProgramBookingCardProps) {
  const handleBookingClick = () => {
    if (program?.title && program?.documentId && program?.price) {
      trackBookingClick(
        program.title,
        program.documentId,
        Number(program.price)
      );
    }
    window.location.href = `/programs/${program.documentId}/book`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-6 shadow-xl">
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">{program.descraption}</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <MapPin className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Location</p>
              <span className="text-lg font-bold text-foreground">{program.Location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Duration</p>
              <span className="text-lg font-bold text-foreground">
                {program.tripType === "single-day" || Number(program.duration) === 1
                  ? "Single Day Trip"
                  : `${program.duration} Days`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-400/10 rounded-xl">
              <Star className="w-6 h-6 text-yellow-500 fill-current" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Rating</p>
              <span className="text-lg font-bold text-foreground">{program.rating} / 5</span>
            </div>
          </div>

          {program.startTime && program.endTime && (
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Time</p>
                <span className="text-lg font-bold text-foreground">
                  {program.startTime} - {program.endTime}
                </span>
              </div>
            </div>
          )}

          {program.meetingPoint && (
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-green-500/10 rounded-xl">
                <MapPin className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Meeting Point</p>
                <span className="text-sm font-medium text-foreground">{program.meetingPoint}</span>
              </div>
            </div>
          )}

          {program.departureLocation && (
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                <MapPin className="w-6 h-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Departure Location</p>
                <span className="text-sm font-medium text-foreground">{program.departureLocation}</span>
              </div>
            </div>
          )}

          {program.returnLocation && (
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-purple-500/10 rounded-xl">
                <MapPin className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Return Location</p>
                <span className="text-sm font-medium text-foreground">{program.returnLocation}</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-primary/10">
            <p className="text-xs text-muted-foreground font-semibold mb-2">Total Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                ${Number(program.price).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">per person</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-2xl text-lg py-6 hover:scale-105 transition-transform font-semibold"
          onClick={handleBookingClick}
        >
          Book This Experience
        </Button>

        <div className="flex justify-center">
          <ShareButtonCompact
            shareOptions={{
              title: program.title || "Amazing Travel Experience",
              text: generateProgramShareText(
                program.title || "Travel Program",
                Number(program.price),
                Number(program.rating)
              ),
              url: typeof window !== "undefined" ? window.location.href : "",
              hashtags: generateTravelHashtags(program.Location),
              via: "ZoeHolidays",
            }}
            shareConfig={{
              contentType: "program",
              contentId: program.documentId || "",
              contentTitle: program.title || "Travel Program",
            }}
          />
        </div>
      </div>
    </div>
  );
}
