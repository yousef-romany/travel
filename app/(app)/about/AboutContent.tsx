"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, MapPin, Users } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { BackgroundVideo } from "@/components/ui/background-video";
import { useEffect } from "react";

// Helper function to get stagger delay class
const getStaggerDelay = (index: number): string => {
  const delay = Math.min(index * 100, 800);
  const delayClasses = {
    0: "animate-delay-0",
    100: "animate-delay-100",
    200: "animate-delay-200",
    300: "animate-delay-300",
    400: "animate-delay-400",
    500: "animate-delay-500",
    600: "animate-delay-600",
    700: "animate-delay-700",
    800: "animate-delay-800",
  } as const;
  return delayClasses[delay as keyof typeof delayClasses] || "animate-delay-0";
};

// Egypt travel videos from Cloudinary
const ABOUT_HERO_VIDEOS = [
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922572/This_is_Egypt_x6b0oo.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922614/Egypt_Unmatched_Diversity_fbtjmf.mp4",
];

export default function AboutContent() {
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
    <div className="flex flex-col min-h-screen !w-full">
      {/* Hero Section with Background Video */}
      <section className="relative h-[95.5vh] sm:h-[95.5vh] overflow-hidden">
        <BackgroundVideo
          videos={ABOUT_HERO_VIDEOS}
          priority
          autoRotate
          rotationInterval={25000}
        >
          <div className="flex flex-col items-center justify-center text-white text-center p-4 h-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display drop-shadow-lg animate-slide-up">
              About Egypt Tourism
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl drop-shadow-md animate-slide-up animate-delay-200">
              Discover the wonders of ancient civilization and modern adventures
            </p>
          </div>
        </BackgroundVideo>
      </section>
      <main className="flex-1 !w-full">
        {/* History and Culture Section */}
        <section className="py-16  px-[2em] !w-full">
          <div className="!w-full grid lg:!grid-cols-2 md:!grid-cols-2 sm:!grid-cols-1 gap-12 items-center">
            <div className="animate-on-scroll">
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
              <Button className="mt-4 transition-smooth hover-glow">Explore Our Tours</Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden animate-on-scroll animate-delay-200">
              <OptimizedImage
                src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764621217/21_Beautiful_Places_to_Travel_in_Egypt_You_Must__f6bw1r.jpg"
                alt="Egyptian Pyramids and Sphinx at Giza"
                className="object-cover hover-scale"
              />
            </div>
          </div>
        </section>

        {/* Mission and Values Section */}
        <section className="!w-full py-16 bg-secondary/50 flex items-center justify-center">
          <div className="!w-full container">
            <h2 className="text-3xl font-bold mb-12 text-center font-display animate-on-scroll">
              Our Mission and Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover-lift animate-on-scroll">
                <CardContent className="pt-6">
                  <Globe className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 font-display">
                    Sustainable Tourism
                  </h3>
                  <p className="text-muted-foreground">
                    We are committed to promoting responsible and sustainable
                    tourism practices that preserve Egypt&apos;s natural and cultural
                    heritage for future generations.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift animate-on-scroll animate-delay-200">
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
              <Card className="hover-lift animate-on-scroll animate-delay-400">
                <CardContent className="pt-6">
                  <MapPin className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 font-display">
                    Authentic Experiences
                  </h3>
                  <p className="text-muted-foreground">
                    We strive to provide authentic, immersive experiences that
                    go beyond typical tourist attractions, allowing visitors to
                    truly connect with Egypt&apos;s rich culture and history.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="!w-full py-16 px-[2em]">
          <h2 className="text-3xl font-bold mb-12 text-center font-display animate-on-scroll">
            Meet Our Team
          </h2>
          <div className="grid lg:!grid-cols-4 md:!grid-cols-4 sm:!grid-cols-1 gap-8">
            {[
              { name: "Amira Hassan", role: "Founder & CEO" },
              { name: "Mohamed Farid", role: "Head of Operations" },
              { name: "Laila Zaki", role: "Chief Experience Officer" },
              { name: "Ahmed Nour", role: "Marketing Director" },
            ].map((member, index) => (
              <Card key={index} className={`hover-lift animate-on-scroll ${getStaggerDelay(index)}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4"></div>
                  <h3 className="font-semibold font-display">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> */}
      </main>
      {/* CTA Section */}
      <section className="py-16 bg-secondary text-primary-foreground">
        <div className="text-center animate-on-scroll">
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
            className="bg-background text-primary hover:bg-background/90 transition-smooth hover-glow"
          >
            Book Your Tour Now
          </Button>
        </div>
      </section>
    </div>
  );
}
