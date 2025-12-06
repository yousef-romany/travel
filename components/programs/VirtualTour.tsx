"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Camera, Video, Image as ImageIcon, Maximize2, Volume2, VolumeX } from "lucide-react";

interface VirtualTourProps {
  programTitle: string;
  virtualTours?: VirtualTourItem[];
  videos?: VideoItem[];
  photos360?: Photo360Item[];
}

interface VirtualTourItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tourUrl: string; // URL to 360° tour (e.g., Matterport, Kuula)
  type: "360" | "video" | "photos";
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeId?: string;
  videoUrl?: string;
}

interface Photo360Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export function VirtualTour({ programTitle, virtualTours, videos, photos360 }: VirtualTourProps) {
  const [selectedTour, setSelectedTour] = useState<VirtualTourItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Default demo data if none provided
  const defaultVirtualTours: VirtualTourItem[] = virtualTours || [
    {
      id: "1",
      title: "360° Temple Walkthrough",
      description: "Explore the ancient temple in full 360° view",
      thumbnailUrl: "https://res.cloudinary.com/dxhzepmdf/image/upload/v1732983945/1_5ba10d0abe.png",
      tourUrl: "https://www.google.com/maps/@29.9792345,31.1342019,3a,75y,90t/data=!3m6!1e1!3m4!1sAF1QipNVKKVEgdVSKDzJm_xmPHCbD-Qd4vA-EE9GqJ1f!2e10!7i5760!8i2880",
      type: "360",
    },
    {
      id: "2",
      title: "Pyramids Drone Tour",
      description: "Aerial view of the Great Pyramids",
      thumbnailUrl: "https://res.cloudinary.com/dxhzepmdf/image/upload/v1732983945/1_5ba10d0abe.png",
      tourUrl: "#",
      type: "360",
    },
  ];

  const defaultVideos: VideoItem[] = videos || [
    {
      id: "1",
      title: "Program Highlights",
      description: "Watch what makes this tour special",
      thumbnailUrl: "https://res.cloudinary.com/dxhzepmdf/image/upload/v1732983945/1_5ba10d0abe.png",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual video
    },
    {
      id: "2",
      title: "Guest Testimonial",
      description: "Hear from past travelers",
      thumbnailUrl: "https://res.cloudinary.com/dxhzepmdf/image/upload/v1732983945/1_5ba10d0abe.png",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual video
    },
  ];

  const defaultPhotos360: Photo360Item[] = photos360 || [
    {
      id: "1",
      title: "Sunset at the Nile",
      description: "360° panoramic view",
      imageUrl: "https://res.cloudinary.com/dxhzepmdf/image/upload/v1732983945/1_5ba10d0abe.png",
    },
    {
      id: "2",
      title: "Inside the Mosque",
      description: "Immersive interior view",
      imageUrl: "https://res.cloudinary.com/dxhzepmdf/image/upload/v1732983945/1_5ba10d0abe.png",
    },
  ];

  return (
    <Card className="border-border dark:border-gray-800 bg-card dark:bg-gray-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
          <Camera className="h-5 w-5 text-primary" />
          Virtual Tours & Media
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-gray-400">
          Explore {programTitle} before you book
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="360tours" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted dark:bg-gray-800/50">
            <TabsTrigger value="360tours" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm">
              <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">360° Tours</span>
              <span className="sm:hidden">360°</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm">
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Videos</span>
              <span className="sm:hidden">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="photos360" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">360° Photos</span>
              <span className="sm:hidden">Photos</span>
            </TabsTrigger>
          </TabsList>

          {/* 360° Tours Tab */}
          <TabsContent value="360tours" className="space-y-4 mt-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              {defaultVirtualTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden group cursor-pointer hover:shadow-lg dark:hover:shadow-primary/20 transition-all border-border dark:border-gray-700 bg-card dark:bg-gray-800/50">
                  <div
                    className="relative h-40 sm:h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${tour.thumbnailUrl})` }}
                    onClick={() => setSelectedTour(tour)}
                  >
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 group-hover:bg-black/30 dark:group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <Button size="lg" className="gap-2 text-xs sm:text-sm md:text-base">
                        <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Launch 360° Tour</span>
                        <span className="sm:hidden">View Tour</span>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base text-foreground dark:text-white">{tour.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">{tour.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4 mt-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              {defaultVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden group cursor-pointer hover:shadow-lg dark:hover:shadow-primary/20 transition-all border-border dark:border-gray-700 bg-card dark:bg-gray-800/50">
                  <div
                    className="relative h-40 sm:h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${video.thumbnailUrl})` }}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 group-hover:bg-black/30 dark:group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="bg-primary dark:bg-primary/90 rounded-full p-3 sm:p-4 shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-white text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base text-foreground dark:text-white">{video.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 360° Photos Tab */}
          <TabsContent value="photos360" className="space-y-4 mt-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {defaultPhotos360.map((photo) => (
                <Card key={photo.id} className="overflow-hidden group cursor-pointer hover:shadow-lg dark:hover:shadow-primary/20 transition-all border-border dark:border-gray-700 bg-card dark:bg-gray-800/50">
                  <div
                    className="relative h-40 sm:h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo.imageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-black/0 dark:bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="secondary" size="sm" className="gap-2 text-xs sm:text-sm dark:bg-gray-700 dark:hover:bg-gray-600">
                        <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        View 360°
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-semibold text-xs sm:text-sm mb-1 text-foreground dark:text-white">{photo.title}</h4>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">{photo.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* VR Ready Badge */}
        <div className="mt-6 p-3 sm:p-4 bg-muted dark:bg-gray-800/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-border dark:border-gray-700">
          <div className="flex-1">
            <h4 className="font-semibold mb-1 text-sm sm:text-base text-foreground dark:text-white">VR Ready</h4>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
              Experience these tours in virtual reality with a VR headset
            </p>
          </div>
          <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-primary dark:text-primary/90" />
        </div>
      </CardContent>

      {/* 360° Tour Dialog */}
      <Dialog open={!!selectedTour} onOpenChange={() => setSelectedTour(null)}>
        <DialogContent className="max-w-4xl h-[80vh] bg-background dark:bg-gray-900 border-border dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-white">{selectedTour?.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-gray-400">{selectedTour?.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 relative bg-muted dark:bg-gray-800 rounded-lg overflow-hidden">
            {selectedTour && (
              <iframe
                src={selectedTour.tourUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; gyroscope; vr"
              />
            )}
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button variant="outline" className="flex-1 dark:border-gray-600 dark:hover:bg-gray-800">
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
            <Button variant="outline" className="flex-1 dark:border-gray-600 dark:hover:bg-gray-800">
              <Camera className="h-4 w-4 mr-2" />
              VR Mode
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl bg-background dark:bg-gray-900 border-border dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-white">{selectedVideo?.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-gray-400">{selectedVideo?.description}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-black dark:bg-gray-950 rounded-lg overflow-hidden">
            {selectedVideo?.youtubeId && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
              className="gap-2 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
