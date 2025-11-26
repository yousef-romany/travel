"use client";

import { useEffect } from "react";
import { Newspaper, Camera, FileText, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MediaindustryContent() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Media & Industry</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resources and partnerships for media professionals and tourism industry stakeholders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-slide-up animate-delay-200">
          <Card className="border-border hover:border-primary/50 transition-all hover-lift">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Newspaper className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Press Releases</CardTitle>
              <CardDescription>
                Latest news, announcements, and updates from ZoeHoliday
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Stay informed about our new destinations, partnerships, special events, and company milestones.
              </p>
              <Button variant="outline" className="w-full">View Press Releases</Button>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/50 transition-all hover-lift">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Media Kit</CardTitle>
              <CardDescription>
                High-resolution images, logos, and brand guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download our official media kit containing logos, photos, fact sheets, and branding materials.
              </p>
              <Button variant="outline" className="w-full">Download Media Kit</Button>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/50 transition-all hover-lift">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Industry Reports</CardTitle>
              <CardDescription>
                Market insights and tourism statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access comprehensive reports on Egypt's tourism industry, travel trends, and market analysis.
              </p>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/50 transition-all hover-lift">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Press Inquiries</CardTitle>
              <CardDescription>
                Contact our media relations team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For press inquiries, interview requests, or media collaborations, reach out to our team.
              </p>
              <Button variant="outline" className="w-full">Contact Media Team</Button>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12 animate-on-scroll">
          <h2 className="text-3xl font-bold mb-6 text-primary">Industry Partnerships</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <p className="text-lg mb-6">
              ZoeHoliday collaborates with tourism boards, hospitality providers, and travel organizations to promote
              Egyptian tourism and deliver exceptional travel experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Tour Operators</h3>
                <p className="text-sm text-muted-foreground">
                  Partner with us to expand your Egypt tour offerings and reach international travelers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Hotels & Resorts</h3>
                <p className="text-sm text-muted-foreground">
                  Join our network of premium accommodations and showcase your property to global audiences.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Travel Agencies</h3>
                <p className="text-sm text-muted-foreground">
                  Collaborate on custom itineraries and benefit from our local expertise and connections.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button>Become a Partner</Button>
            </div>
          </div>
        </section>

        <section className="mb-12 animate-on-scroll">
          <h2 className="text-3xl font-bold mb-6 text-primary">Media Contact</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Press & Media Relations</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:media@zoeholiday.com" className="text-primary hover:underline">
                        media@zoeholiday.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+201555100961" className="text-primary hover:underline">
                        +20 155 510 0961
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">Egypt, Cairo</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Working Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium text-foreground">Monday - Friday:</span> 9:00 AM - 6:00 PM EET</p>
                  <p><span className="font-medium text-foreground">Saturday:</span> 10:00 AM - 4:00 PM EET</p>
                  <p><span className="font-medium text-foreground">Sunday:</span> Closed</p>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  For urgent media inquiries outside business hours, please email us and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-on-scroll">
          <h2 className="text-3xl font-bold mb-6 text-primary">Featured in Media</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <p className="text-center text-muted-foreground mb-6">
              ZoeHoliday has been featured in leading travel publications and media outlets
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              <div className="text-2xl font-bold">Travel Weekly</div>
              <div className="text-2xl font-bold">Tourism Today</div>
              <div className="text-2xl font-bold">Egypt Travel</div>
              <div className="text-2xl font-bold">Global Tours</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
