"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents, Event } from "@/fetch/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Music, Sparkles, Trophy, Eye, Ticket, Clock } from "lucide-react";
import Loading from "@/components/Loading";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { trackCardClick, trackTabChange, trackButtonClick } from "@/lib/analytics";

const eventTypeIcons: Record<string, any> = {
  live_blog: Sparkles,
  music: Music,
  festival: Sparkles,
  cultural: Calendar,
  sports: Trophy,
  exhibition: Eye,
  other: Calendar,
};

const eventTypeColors: Record<string, string> = {
  live_blog: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  music: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  festival: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  cultural: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  sports: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  exhibition: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
};

export default function EventsContent() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", activeTab],
    queryFn: () =>
      fetchEvents({
        eventType: activeTab !== "all" ? activeTab : undefined,
        isActive: true,
        pageSize: 50,
      }),
  });

  const handleTabChange = (tab: string) => {
    trackTabChange(tab, "Events Page");
    setActiveTab(tab);
  };

  const handleEventClick = (event: Event) => {
    trackCardClick("Event", event.title, event.documentId || event.id.toString());
  };

  const handleViewAllClick = () => {
    trackButtonClick("View All Events", "Events Page - Empty State", "/events");
    setActiveTab("all");
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">Error loading events. Please try again later.</p>
      </div>
    );
  }

  const events = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12 animate-slide-down">
        <div className="inline-block mb-4">
          <span className="px-6 py-3 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20 shadow-lg">
            ✨ Discover Amazing Events
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent mb-4">
          Events in Egypt
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore live blogs, music concerts, cultural festivals, and more
        </p>
      </div>

      {/* Event Type Filters */}
      <div className="mb-8 animate-slide-up animate-delay-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8 bg-card border border-border shadow-sm p-1 rounded-lg">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="live_blog">Live Blogs</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="festival">Festivals</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="exhibition">Exhibition</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <Card className="border-primary/20 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">
              No events found
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              There are no {activeTab !== "all" ? activeTab : ""} events available at the moment
            </p>
            <Button onClick={handleViewAllClick}>View All Events</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up animate-delay-300">
          {events.map((event) => {
            const Icon = eventTypeIcons[event.eventType] || Calendar;
            const startDate = new Date(event.startDate);
            const isUpcoming = startDate > new Date();

            return (
              <Card
                key={event.id}
                className="group border-primary/20 shadow-xl hover:shadow-2xl transition-all overflow-hidden hover:-translate-y-1"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.featuredImage ? (
                    <OptimizedImage
                      src={getImageUrl(event.featuredImage)}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-primary/40" />
                    </div>
                  )}

                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={eventTypeColors[event.eventType]}>
                      <Icon className="w-3 h-3 mr-1" />
                      {event.eventType.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {event.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-amber-600 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </CardTitle>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {event.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      {format(startDate, "PPP")}
                    </span>
                    {isUpcoming && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Upcoming
                      </Badge>
                    )}
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{event.location}</span>
                    </div>
                  )}

                  {/* Price */}
                  {event.price !== null && event.price !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <Ticket className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {event.price === 0 ? "Free Entry" : `$${event.price}`}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/events/${event.slug || event.documentId}`} onClick={() => handleEventClick(event)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 mt-4">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
