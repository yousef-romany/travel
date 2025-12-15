"use client";

import { Event } from "@/fetch/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, DollarSign, Users, Mail, Phone, Sparkles, ExternalLink, Music, MessageSquare, Star } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import Testimonials from "@/components/testimonials";
import ReviewDialog from "@/components/review/ReviewDialog";
import { fetchEventTestimonials } from "@/fetch/testimonials";
import AverageRating from "@/components/review/AverageRating";
import ExportReviews from "@/components/review/ExportReviews";

interface EventDetailContentProps {
  event: Event;
  initialData?: { data: Event };
}

const eventTypeIcons: Record<string, any> = {
  live_blog: Sparkles,
  music: Music,
  festival: Sparkles,
  cultural: Calendar,
  sports: Users,
  exhibition: Sparkles,
  other: Calendar,
};

export default function EventDetailContent({ event }: EventDetailContentProps) {
  const Icon = eventTypeIcons[event.eventType] || Calendar;
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const isUpcoming = startDate > new Date();

  // Fetch testimonials for this event
  const { data: testimonialsData, refetch: refetchTestimonials } = useQuery({
    queryKey: ["eventTestimonials", event.documentId],
    queryFn: () => fetchEventTestimonials(event.documentId),
    enabled: !!event.documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Image */}
      {event.featuredImage && (
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <OptimizedImage
            src={getImageUrl(event.featuredImage)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Badges on Image */}
          <div className="absolute top-6 left-6 flex gap-2">
            <Badge className="bg-amber-600 text-white text-sm px-4 py-2">
              <Icon className="w-4 h-4 mr-2" />
              {event.eventType.replace("_", " ").toUpperCase()}
            </Badge>
            {event.isFeatured && (
              <Badge className="bg-primary text-white text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Featured
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Description */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent mb-4">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-xl text-muted-foreground">{event.description}</p>
            )}
          </div>

          {/* Content */}
          {event.content && (
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </CardContent>
            </Card>
          )}

          {/* Video */}
          {event.youtubeUrl && (
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Event Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full pt-[56.25%]">
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-lg"
                    src={event.youtubeUrl.replace("watch?v=", "embed/")}
                    title={event.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Photo Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((image: any, idx: number) => (
                    <div key={idx} className="relative h-48 rounded-lg overflow-hidden group">
                      <OptimizedImage
                        src={getImageUrl(image)}
                        alt={`${event.title} - Image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-primary/20 shadow-xl sticky top-4">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-amber-500/10">
              <CardTitle className="text-xl">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Status */}
              {isUpcoming && (
                <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-center font-semibold">
                  Upcoming Event
                </div>
              )}

              {/* Date */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold">{format(startDate, "PPP")}</p>
                  {endDate && (
                    <>
                      <p className="text-sm text-muted-foreground mt-2">End Date</p>
                      <p className="font-semibold">{format(endDate, "PPP")}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{event.location}</p>
                    {event.venue && (
                      <p className="text-sm text-muted-foreground mt-1">{event.venue}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Price */}
              {event.price !== null && event.price !== undefined && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Ticket Price</p>
                    <p className="font-semibold text-2xl text-primary">
                      {event.price === 0 ? "Free" : `$${event.price}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Capacity */}
              {event.capacity && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold">
                      {event.attendees || 0} / {event.capacity} attendees
                    </p>
                  </div>
                </div>
              )}

              {/* Organizer */}
              {event.organizer && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Organized by</p>
                  <p className="font-semibold">{event.organizer}</p>
                </div>
              )}

              {/* Contact */}
              {(event.contactEmail || event.contactPhone) && (
                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Contact</p>
                  {event.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href={`mailto:${event.contactEmail}`} className="hover:text-primary">
                        {event.contactEmail}
                      </a>
                    </div>
                  )}
                  {event.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href={`tel:${event.contactPhone}`} className="hover:text-primary">
                        {event.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Ticket Button */}
              {event.ticketUrl && (
                <div className="border-t pt-4">
                  <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Tickets
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials & Reviews Section */}
      <div className="mt-12">
        <Card className="border-primary/20 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
                  <MessageSquare className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Event Reviews
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {testimonialsData?.data && testimonialsData.data.length > 0
                      ? `${testimonialsData.data.length} ${testimonialsData.data.length === 1 ? 'review' : 'reviews'} from attendees`
                      : "Be the first to review this event"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {testimonialsData?.data && testimonialsData.data.length > 0 && (
                  <ExportReviews
                    testimonials={testimonialsData.data}
                    programTitle={event.title}
                  />
                )}
                <ReviewDialog
                  type="event"
                  relatedId={event.documentId}
                  relatedTitle={event.title}
                  onSuccess={() => refetchTestimonials()}
                  triggerButton={
                    <Button className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Write a Review
                    </Button>
                  }
                />
              </div>
            </div>

            {testimonialsData?.data && testimonialsData.data.length > 0 ? (
              <>
                <AverageRating testimonials={testimonialsData.data} className="mb-8" />
                <Testimonials
                  testimonials={testimonialsData.data}
                  showRelatedContent={false}
                />
              </>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-xl bg-muted/20">
                <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your experience with this event!
                </p>
                <ReviewDialog
                  type="event"
                  relatedId={event.documentId}
                  relatedTitle={event.title}
                  onSuccess={() => refetchTestimonials()}
                  triggerButton={
                    <Button size="lg" className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2">
                      <Star className="w-5 h-5" />
                      Write the First Review
                    </Button>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
