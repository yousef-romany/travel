/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Globe,
  Award,
  Shield,
  HeadphonesIcon
} from "lucide-react";
import logo from "@/public/logo.png";
import logoLight from "@/public/logoLight.png";
import OptimizedImage from "../OptimizedImage";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchPlaceToGoCategories } from "@/fetch/placesToGo";
import TrustBadges from "@/components/trust-badges";
import { trackNewsletterSignup, trackFooterLink, trackSocialShare, trackExternalLink } from "@/lib/analytics";

export default function Footer() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchPlaceToGoCategories();
        // Extract categories and flatten to get destination links
        const destinationList = data?.data?.slice(0, 12).map((category: any) => ({
          name: category.categoryName,
          category: category.categoryName
        })) || [];
        setDestinations(destinationList);
      } catch (error) {
        console.error('Error loading destinations:', error);
        // Fallback to default destinations if API fails
        setDestinations([
          { name: "Cairo", category: "Cairo" },
          { name: "Giza", category: "Giza" },
          { name: "Luxor", category: "Luxor" },
          { name: "Aswan", category: "Aswan" },
          { name: "Alexandria", category: "Alexandria" },
          { name: "Sharm El-Sheikh", category: "Sharm El-Sheikh" },
        ]);
      }
    };

    loadDestinations();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';

      const response = await fetch(`${API_URL}/api/newsletters/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'footer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        trackNewsletterSignup(email);
        toast.success(data.message || "Successfully subscribed to our newsletter!");
        setEmail("");
      } else {
        toast.error(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleFooterLinkClick = (linkText: string, destination: string) => {
    trackFooterLink(linkText, destination);
  };

  const handleSocialClick = (platform: string) => {
    trackSocialShare(platform, "footer_social", platform);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-secondary/60 mt-2 border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Company Info & Newsletter */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              {theme === "light" ? (
                <OptimizedImage
                  src={logoLight as any}
                  alt="ZoeHoliday - Egypt Travel & Tours Logo"
                  className="!h-[80px] !w-[180px] object-contain mb-4 z-[-9] bg-none shadow-none"
                />
              ) : (
                <OptimizedImage
                  src={logo as any}
                  alt="ZoeHoliday - Egypt Travel & Tours Logo"
                  className="!h-[80px] !w-[180px] object-contain mb-4 z-[-9] bg-none shadow-none"
                />
              )}
              <p className="text-muted-foreground text-sm mb-4">
                Discover the magic of Egypt with our expert-curated travel experiences.
                Your journey to 7,000 years of history starts here.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Stay Updated
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get exclusive deals and travel tips
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubscribing}
                  className="flex-1"
                  aria-label="Email for newsletter subscription"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubscribing}
                  className="bg-primary hover:bg-primary/90"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Explore Egypt
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/programs"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/placesTogo"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/inspiration"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Travel Inspiration
                </Link>
              </li>
              <li>
                <Link
                  href="/plan-your-trip"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Plan Your Trip
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  About Egypt Tourism
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/business-events"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Business Events
                </Link>
              </li>
              <li>
                <Link
                  href="/media-industry"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Media & Industry
                </Link>
              </li>
              <li>
                <Link
                  href="/tourism-investment"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Tourism Investment
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Sitemap
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HeadphonesIcon className="w-5 h-5 text-primary" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Visit Us</p>
                    <p className="text-sm text-muted-foreground">
                      Cairo, Egypt
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Call Us</p>
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Support
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email Us</p>
                    <a
                      href="mailto:info@zoeholiday.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@zoeholiday.com
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">
                      24/7 Customer Support
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Follow Our Journey</h4>
              <div className="flex gap-3">
                <Link
                  href="https://www.facebook.com/profile.php?id=61584281130159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on Facebook"
                  onClick={() => handleSocialClick("Facebook")}
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/zoeholidayss1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on Instagram"
                  onClick={() => handleSocialClick("Instagram")}
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.youtube.com/@ZoeHolidays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Subscribe to our YouTube channel"
                  onClick={() => handleSocialClick("YouTube")}
                >
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-border pt-8 mb-8">
          <TrustBadges />
        </div>

        {/* Popular Destinations - SEO Enhancement */}
        <div className="border-t border-border pt-8 mb-8">
          <h3 className="text-lg font-semibold mb-4">Popular Egypt Destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {destinations.length > 0 ? (
              destinations.map((destination) => (
                <Link
                  key={destination.name}
                  href={`/placesTogo/${encodeURIComponent(destination.category)}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                  title={`Explore ${destination.name} - Egypt Travel Guide`}
                >
                  {destination.name}
                </Link>
              ))
            ) : (
              // Skeleton loader while loading
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-5 bg-muted animate-pulse rounded"></div>
              ))
            )}
          </div>
        </div>

        {/* Payment & Security */}
        {/* <div className="border-t border-border pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Secure Payment Methods</h4>
              <p className="text-xs text-muted-foreground">
                All transactions are encrypted and secured
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="px-4 py-2 bg-background border border-border rounded-md text-xs font-medium">
                Visa
              </div>
              <div className="px-4 py-2 bg-background border border-border rounded-md text-xs font-medium">
                Mastercard
              </div>
              <div className="px-4 py-2 bg-background border border-border rounded-md text-xs font-medium">
                PayPal
              </div>
              <div className="px-4 py-2 bg-background border border-border rounded-md text-xs font-medium">
                Stripe
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <p>
                © {currentYear} ZoeHoliday. All rights reserved. |
                <Link href="/privacy-policy" className="hover:text-primary ml-1">
                  Privacy Policy
                </Link> |
                <Link href="/terms-and-conditions" className="hover:text-primary ml-1">
                  Terms
                </Link>
              </p>
              <p className="text-xs mt-1">
                Licensed Egypt Tour Operator - Experience authentic Egyptian adventures with expert local guides
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Made with ♥ for Yousefx00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ZoeHoliday",
            "description": "Egypt Travel and Tour Packages - Explore Ancient Wonders",
            "url": "https://zoeholiday.com",
            "logo": "https://zoeholiday.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+20-XXX-XXXXXXX",
              "contactType": "customer service",
              "areaServed": "EG",
              "availableLanguage": ["English", "Arabic"]
            },
            "sameAs": [
              "https://facebook.com/zoeholiday",
              "https://instagram.com/zoeholiday",
              "https://twitter.com/zoeholiday",
              "https://youtube.com/@zoeholiday"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "EG",
              "addressLocality": "Cairo"
            }
          })
        }}
      />
    </footer>
  );
}
