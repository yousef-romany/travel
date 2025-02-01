"use client";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { instaGramVedios } from "@/type/placesToGo";
import { Button } from "./ui/button";
import { useState } from "react";
import MediaContent from "./MediaContent";

export default function InstagramModal({
  createdAtInsta,
  imageUrl,
  thumbnail_url,
  caption,
  permalink,
  media_type,
}: instaGramVedios) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedDate = new Date(createdAtInsta as string).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
    }
  );

  return (
    <>
      <img
        src={thumbnail_url}
        alt={caption}
        onClick={() => setIsModalOpen(true)}
        className="w-full h-full rounded-[2rem] cursor-pointer"
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-card flex items-center justify-center z-50">
          <div className="relative max-w-5xl w-full mx-4 bg-muted rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary/75">
                  @ZoeHolidays
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-primary hover:text-primary-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}

            <div className="flex flex-col md:flex-row">
              {/* Media */}
              <div className="relative flex-1 bg-card aspect-square md:aspect-auto">
                <button className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-card/50 text-muted z-10">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="h-full">
                  <MediaContent
                    media_type={media_type}
                    imageUrl={imageUrl}
                    thumbnail_url={thumbnail_url}
                    // className="w-full h-full"
                  />
                </div>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-card/50 text-muted z-10">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Caption */}
              <div className="w-full md:w-[400px] flex flex-col">
                {/* Caption and comments */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex gap-2 mb-4">
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold text-primary/75">
                          @ZoeHolidays
                        </span>{" "}
                        {caption}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <a
                      href={permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View on Instagram
                    </a>
                    <span className="text-secondary-300">•</span>
                    <span className="text-sm text-secondary-500">
                      {media_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
