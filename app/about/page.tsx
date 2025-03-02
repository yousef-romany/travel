"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, MapPin, Users } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen !w-full">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <OptimizedImage
          src="/placeholder.svg?height=1080&width=1920"
          alt="Egyptian Landscape"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
            About Egypt Tourism
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Discover the wonders of ancient civilization and modern adventures
          </p>
        </div>
      </section>
      <main className="flex-1 !w-full">
        {/* History and Culture Section */}
        <section className="py-16  px-[2em] !w-full">
          <div className="!w-full grid lg:!grid-cols-2 md:!grid-cols-2 sm:!grid-cols-1 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-display">
                A Land of Rich History and Culture
              </h2>
              <p className="text-muted-foreground mb-4 font-serif">
                Egypt, a country linking northeast Africa with the Middle East,
                dates to the time of the pharaohs. Millennia-old monuments still
                sit along the fertile Nile River Valley, including the colossal
                Pyramids and Sphinx at Giza and the hieroglyph-lined Karnak
                Temple and Valley of the Kings tombs in Luxor.
              </p>
              <p className="text-muted-foreground mb-4 font-serif">
                With a history spanning over 5000 years, Egypt is a treasure
                trove of ancient wonders, breathtaking landscapes, and vibrant
                culture. From the bustling streets of Cairo to the serene
                beaches of the Red Sea, Egypt offers a diverse range of
                experiences for every traveler.
              </p>
              <Button className="mt-4">Explore Our Tours</Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <OptimizedImage
                src="/placeholder.svg?height=800&width=600"
                alt="Egyptian Artifacts"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission and Values Section */}
        <section className="!w-full py-16 bg-secondary/50 flex items-center justify-center">
          <div className="!w-full container">
            <h2 className="text-3xl font-bold mb-12 text-center font-display">
              Our Mission and Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <Globe className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 font-display">
                    Sustainable Tourism
                  </h3>
                  <p className="text-muted-foreground">
                    We are committed to promoting responsible and sustainable
                    tourism practices that preserve Egypt's natural and cultural
                    heritage for future generations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 font-display">
                    Cultural Exchange
                  </h3>
                  <p className="text-muted-foreground">
                    We believe in fostering meaningful connections between
                    visitors and local communities, promoting mutual
                    understanding and respect.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <MapPin className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 font-display">
                    Authentic Experiences
                  </h3>
                  <p className="text-muted-foreground">
                    We strive to provide authentic, immersive experiences that
                    go beyond typical tourist attractions, allowing visitors to
                    truly connect with Egypt's rich culture and history.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="!w-full py-16 px-[2em]">
          <h2 className="text-3xl font-bold mb-12 text-center font-display">
            Meet Our Team
          </h2>
          <div className="grid lg:!grid-cols-4 md:!grid-cols-4 sm:!grid-cols-1 gap-8">
            {[
              { name: "Amira Hassan", role: "Founder & CEO" },
              { name: "Mohamed Farid", role: "Head of Operations" },
              { name: "Laila Zaki", role: "Chief Experience Officer" },
              { name: "Ahmed Nour", role: "Marketing Director" },
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4"></div>
                  <h3 className="font-semibold font-display">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      {/* CTA Section */}
      <section className="py-16 bg-secondary text-primary-foreground">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 font-display">
            Ready to Explore Egypt?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join us on an unforgettable journey through the land of pharaohs,
            pyramids, and endless adventures.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-background text-primary hover:bg-background/90"
          >
            Book Your Tour Now
          </Button>
        </div>
      </section>
    </div>
  );
}
