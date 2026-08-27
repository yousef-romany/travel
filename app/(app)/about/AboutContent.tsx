import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Award,
  Briefcase,
  Compass,
  Globe,
  Handshake,
  HeartHandshake,
  Landmark,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Clock,
} from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { BackgroundVideo } from "@/components/ui/background-video";
import AnimatedSection from "@/components/AnimatedSection";

// Egypt travel videos from Cloudinary
const ABOUT_HERO_VIDEOS = [
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922572/This_is_Egypt_x6b0oo.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922614/Egypt_Unmatched_Diversity_fbtjmf.mp4",
];

const STATS = [
  { value: "40+", label: "Years of Experience", icon: Clock },
  { value: "50K+", label: "Happy Travelers", icon: Users },
  { value: "30+", label: "Destinations Across Egypt", icon: MapPin },
  { value: "4.9/5", label: "Average Guest Rating", icon: Star },
];

const VALUES = [
  {
    icon: Globe,
    title: "Sustainable Tourism",
    description:
      "We are committed to promoting responsible and sustainable tourism practices that preserve Egypt's natural and cultural heritage for future generations.",
  },
  {
    icon: Users,
    title: "Cultural Exchange",
    description:
      "We believe in fostering meaningful connections between visitors and local communities, promoting mutual understanding and respect.",
  },
  {
    icon: MapPin,
    title: "Authentic Experiences",
    description:
      "We provide authentic, immersive experiences that go beyond typical tourist attractions, allowing visitors to truly connect with Egypt's rich culture.",
  },
  {
    icon: Handshake,
    title: "Trust & Transparency",
    description:
      "Honest pricing, clear itineraries, and dependable service. We earn your trust on every journey, from the first enquiry to the final farewell.",
  },
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Your wellbeing is our priority. Every tour is planned with safety, comfort, and peace of mind at its core.",
  },
  {
    icon: Sparkles,
    title: "Personalized Journeys",
    description:
      "No two travelers are the same. We craft tailored itineraries that match your pace, interests, and travel style.",
  },
];

const TEAM = [
  { name: "Amira Hassan", role: "Founder & CEO", initials: "AH" },
  { name: "Mohamed Farid", role: "Head of Operations", initials: "MF" },
  { name: "Laila Zaki", role: "Chief Experience Officer", initials: "LZ" },
  { name: "Ahmed Nour", role: "Marketing Director", initials: "AN" },
];

const HIGHLIGHTS = [
  {
    icon: Compass,
    title: "Expert Local Guides",
    description:
      "Egyptologist guides and local specialists who bring every monument and story to life.",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description:
      "Recognized for excellence in travel planning, hospitality, and customer satisfaction.",
  },
  {
    icon: Briefcase,
    title: "Hassle-Free Planning",
    description:
      "We handle flights, visas, hotels, transport, and tickets so you simply enjoy the journey.",
  },
  {
    icon: Phone,
    title: "24/7 On-Ground Support",
    description:
      "A dedicated support team available around the clock during your entire trip.",
  },
];

const FAQS = [
  {
    question: "Who is ZoeHoliday?",
    answer:
      "ZoeHoliday is a trusted, family-run Egypt travel company that designs unforgettable premium journeys across the land of the pharaohs. With over 40 years of experience providing personal service and knowledgeable local guides, we blend expert local knowledge with luxury travel.",
  },
  {
    question: "What types of tours do you offer?",
    answer:
      "We offer a wide range of tours including classic Egypt itineraries, Nile cruises, Red Sea beach holidays, desert adventures, cultural city breaks, and fully customizable private journeys.",
  },
  {
    question: "Can you customize an itinerary for me?",
    answer:
      "Absolutely. Every traveler is different, so we tailor each itinerary to your interests, budget, and travel dates. Contact us and our experts will design the perfect plan for you.",
  },
  {
    question: "How do I book a trip?",
    answer:
      "Browse our tours and use the Book button on any program, or contact us directly. Our team will confirm availability, finalize details, and guide you through the booking process.",
  },
  {
    question: "What is included in the tour price?",
    answer:
      "Every tour clearly lists what's included and excluded. Typically this covers accommodation, guided tours, entrance fees, and transportation — with optional add-ons like flights and meals available.",
  },
  {
    question: "How can I contact your team?",
    answer:
      "You can reach us through the Contact page, via live chat on the website, or by phone/WhatsApp. Our friendly team is always happy to help you plan your Egyptian adventure.",
  },
];

const NAV_ITEMS = [
  { href: "#about-story", label: "Our Story" },
  { href: "#about-history", label: "Egypt History" },
  { href: "#about-values", label: "Mission & Values" },
  { href: "#about-team", label: "Our Team" },
  { href: "#about-faq", label: "FAQ" },
];

export default function AboutContent() {
  return (
    <div className="flex flex-col min-h-screen !w-full">
      {/* Hero Section with Background Video */}
      <section className="relative h-[95.5vh] sm:h-[95.5vh] overflow-hidden" id="about-hero">
        <BackgroundVideo
          videos={ABOUT_HERO_VIDEOS}
          priority
          autoRotate
          rotationInterval={25000}
        >
          <div className="flex flex-col items-center justify-center text-white text-center p-4 h-full">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm uppercase tracking-widest animate-slide-up"
            >
              ZoeHoliday
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display drop-shadow-lg animate-slide-up">
              About Egypt Tourism
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl drop-shadow-md animate-slide-up animate-delay-200">
              Discover the wonders of ancient civilization and modern adventures
            </p>
            <div className="flex flex-wrap gap-4 mt-8 animate-slide-up animate-delay-300">
              <Button
                asChild
                size="lg"
                className="transition-smooth hover-glow"
              >
                <Link href="/programs">Explore Our Tours</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-smooth hover-glow"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </BackgroundVideo>
      </section>

      {/* In-page Section Navigation */}
      <nav
        aria-label="About page sections"
        className="sticky top-[60px] sm:top-[65px] z-30 w-full bg-background/80 backdrop-blur-md border-b"
      >
        <div className="!w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3 flex flex-wrap items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4 px-2 py-1"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="flex-1 !w-full">
        {/* Stats Section */}
        <section className="!w-full py-16 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="!w-full max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 100}>
                <Card className="hover-lift text-center h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
                    <stat.icon className="h-8 w-8 text-primary mb-1" />
                    <span className="text-3xl font-bold font-display">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Our Story Section */}
        <section className="!w-full py-16 bg-secondary/50 px-4 sm:px-6 md:px-8 lg:px-12" id="about-story">
          <div className="!w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <AnimatedSection className="order-2 md:order-1 relative h-[400px] rounded-lg overflow-hidden">
              <OptimizedImage
                src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764621217/21_Beautiful_Places_to_Travel_in_Egypt_You_Must__f6bw1r.jpg"
                alt="The Pyramids of Giza at sunset"
                className="object-cover hover-scale"
              />
            </AnimatedSection>
            <AnimatedSection delay={200} className="order-1 md:order-2">
              <Badge variant="secondary" className="mb-4 uppercase tracking-widest">
                Our Story
              </Badge>
              <h2 className="text-3xl font-bold mb-6 font-display">
                Your Trusted Egypt Travel Experts
              </h2>
              <p className="text-muted-foreground mb-4 font-serif">
                ZoeHoliday was born from a simple passion: sharing the magic of
                Egypt with the world. For over 40 years, our family-run business has guided travelers
                through the pyramids of Giza, the temples of Luxor, and the golden
                waters of the Nile, providing premium private tours and unforgettable experiences.
              </p>
              <p className="text-muted-foreground mb-4 font-serif">
                As a family-run company based in Luxor, we pride ourselves on delivering 
                exceptional personal service and employing only the most knowledgeable local guides. 
                Every premium journey is planned with the same personal care, local knowledge, 
                and love for our homeland as day one.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button asChild className="transition-smooth hover-glow">
                  <Link href="/programs">See Our Tours</Link>
                </Button>
                <Button asChild variant="outline" className="transition-smooth">
                  <Link href="/plan-your-trip">Plan Your Trip</Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* History and Culture Section */}
        <section className="py-16 px-4 sm:px-6 md:px-8 lg:px-12 !w-full" id="about-history">
          <div className="!w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <AnimatedSection>
              <Badge variant="secondary" className="mb-4 uppercase tracking-widest">
                History & Culture
              </Badge>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <Landmark className="h-8 w-8 text-primary shrink-0" />
                  <span className="text-sm font-medium">5000+ Years of History</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-primary shrink-0" />
                  <span className="text-sm font-medium">7 UNESCO Sites</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary shrink-0" />
                  <span className="text-sm font-medium">100+ Communities</span>
                </div>
              </div>
              <Button asChild className="mt-6 transition-smooth hover-glow">
                <Link href="/placesTogo">Explore Destinations</Link>
              </Button>
            </AnimatedSection>
            <AnimatedSection delay={200} className="relative h-[400px] rounded-lg overflow-hidden">
              <OptimizedImage
                src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764621217/21_Beautiful_Places_to_Travel_in_Egypt_You_Must__f6bw1r.jpg"
                alt="Egyptian Pyramids and Sphinx at Giza"
                className="object-cover hover-scale"
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Mission and Values Section */}
        <section className="!w-full py-16 bg-secondary/50 px-4 sm:px-6 md:px-8 lg:px-12" id="about-values">
          <div className="!w-full max-w-7xl mx-auto">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-4 uppercase tracking-widest">
                Mission & Values
              </Badge>
              <h2 className="text-3xl font-bold mb-4 font-display">
                What We Stand For
              </h2>
              <p className="text-muted-foreground font-serif">
                Our mission is to make the wonders of Egypt accessible to every
                traveler — responsibly, authentically, and with heartfelt
                hospitality.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {VALUES.map((value, index) => (
                <AnimatedSection key={value.title} delay={(index % 3) * 200}>
                  <Card className="hover-lift h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <value.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold font-display">
                          {value.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 bg-primary/5 border rounded-xl p-8">
              <Target className="h-10 w-10 text-primary shrink-0" />
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold font-display mb-1">
                  Our Vision
                </h3>
                <p className="text-muted-foreground font-serif">
                  To be the gateway through which the world discovers Egypt —
                  preserving its treasures for generations while creating
                  unforgettable moments for every traveler.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="!w-full py-16 px-4 sm:px-6 md:px-8 lg:px-12" id="about-team">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4 uppercase tracking-widest">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold mb-4 font-display">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground font-serif">
              A passionate group of travel experts dedicated to making your
              Egyptian journey truly unforgettable.
            </p>
          </AnimatedSection>
          <div className="!w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, index) => (
              <AnimatedSection key={member.name} delay={index * 100}>
                <Card className="hover-lift h-full">
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-display text-2xl">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold font-display">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="!w-full py-16 bg-secondary/50 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="!w-full max-w-7xl mx-auto">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-4 uppercase tracking-widest">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl font-bold mb-4 font-display">
                What Makes Us Different
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {HIGHLIGHTS.map((highlight, index) => (
                <AnimatedSection key={highlight.title} delay={(index % 2) * 200}>
                  <Card className="hover-lift h-full">
                    <CardContent className="p-6 flex gap-4 items-start">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <highlight.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 font-display">
                          {highlight.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {highlight.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="!w-full py-16 px-4 sm:px-6 md:px-8 lg:px-12" id="about-faq">
          <div className="!w-full max-w-3xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 uppercase tracking-widest">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold mb-4 font-display">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground font-serif">
                Everything you need to know about traveling with ZoeHoliday.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-base font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-primary-foreground px-4 sm:px-6 md:px-8 lg:px-12">
        <AnimatedSection className="text-center max-w-4xl mx-auto">
          <HeartHandshake className="h-14 w-14 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4 font-display">
            Ready to Explore Egypt?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join us on an unforgettable journey through the land of pharaohs,
            pyramids, and endless adventures.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-background text-primary hover:bg-background/90 transition-smooth hover-glow"
            >
              <Link href="/programs">Book Your Tour Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 bg-transparent hover:bg-primary/10 transition-smooth hover-glow"
            >
              <Link href="/contact">
                <MessageCircle className="h-4 w-4" />
                Talk to an Expert
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
