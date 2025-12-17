import { Metadata } from "next";
import { PromoCodesShowcase } from "@/components/promo/PromoCodesShowcase";
import { getActivePromoCodes, PromoCode } from "@/fetch/promo-codes";
import OfferSchema from "@/components/seo/OfferSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { Gift, Tag, Sparkles } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

export const metadata: Metadata = {
  title: "Promo Codes & Special Offers | ZoeHoliday - Save on Egypt Tours",
  description: "Get exclusive promo codes and special discounts on Egypt tour packages. Save big on pyramids tours, Nile cruises, and cultural experiences. Limited time offers available!",
  keywords: [
    "Egypt tour promo codes",
    "travel discount codes",
    "Egypt vacation deals",
    "tour package discounts",
    "Egypt travel offers",
    "promo codes Egypt",
    "discount coupons Egypt tours",
    "special offers Egypt",
    "cheap Egypt tours",
    "Egypt tour deals 2025"
  ],
  authors: [{ name: "ZoeHoliday" }],
  alternates: {
    canonical: `${SITE_URL}/promo-codes`,
  },
  openGraph: {
    title: "Exclusive Promo Codes & Deals | ZoeHoliday Egypt Tours",
    description: "Save big with our exclusive promo codes! Get discounts on Egypt tour packages, Nile cruises, and more. Limited time offers!",
    type: "website",
    url: `${SITE_URL}/promo-codes`,
    siteName: "ZoeHoliday",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-promo.jpg`,
        width: 1200,
        height: 630,
        alt: "ZoeHoliday Promo Codes - Special Discounts on Egypt Tours",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exclusive Promo Codes & Deals | ZoeHoliday Egypt Tours",
    description: "Save big with our exclusive promo codes! Get discounts on Egypt tour packages, Nile cruises, and more.",
    images: [`${SITE_URL}/og-promo.jpg`],
    creator: "@zoeholiday",
    site: "@zoeholiday",
  },
};

export default async function PromoCodesPage() {
  // Fetch promo codes server-side for SEO
  let promoCodes: PromoCode[] = [];
  try {
    promoCodes = await getActivePromoCodes();
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    promoCodes = [];
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Promo Codes", item: "/promo-codes" }
        ]}
      />
      {promoCodes.length > 0 && <OfferSchema promoCodes={promoCodes} />}

      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 right-10 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-full border border-primary/20">
                <Gift className="h-6 w-6 text-primary" />
                <span className="font-semibold text-primary">Limited Time Offers</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent leading-tight">
                Exclusive Promo Codes & Deals
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Save big on your dream Egypt vacation! Browse our active promo codes and get amazing discounts on tour packages, Nile cruises, and cultural experiences.
              </p>

              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{promoCodes.length}</div>
                  <div className="text-sm text-muted-foreground">Active Codes</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">Up to 30%</div>
                  <div className="text-sm text-muted-foreground">Discount</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promo Codes Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <PromoCodesShowcase showTitle={false} />
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-gradient-to-br from-card to-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-full border border-primary/20 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Easy to Use</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">How to Use Promo Codes</h2>
                <p className="text-muted-foreground">
                  Follow these simple steps to apply your discount
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-lg">Choose Your Tour</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse our programs and select your perfect Egypt adventure
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-lg">Copy Promo Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the copy button on any active promo code above
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-lg">Apply at Checkout</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste the code during booking and enjoy your discount!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                <div className="bg-card p-6 rounded-xl border" itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold mb-2" itemProp="name">
                    Can I use multiple promo codes?
                  </h3>
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p className="text-muted-foreground" itemProp="text">
                      Only one promo code can be applied per booking. Choose the one that gives you the best discount!
                    </p>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border" itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold mb-2" itemProp="name">
                    Do promo codes expire?
                  </h3>
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p className="text-muted-foreground" itemProp="text">
                      Yes, each promo code has a validity period. The expiration date is shown on each code card. Use them before they expire!
                    </p>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border" itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold mb-2" itemProp="name">
                    Are there minimum purchase requirements?
                  </h3>
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p className="text-muted-foreground" itemProp="text">
                      Some promo codes may have minimum purchase requirements. These details are clearly mentioned on each code card.
                    </p>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border" itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold mb-2" itemProp="name">
                    Can I combine promo codes with other offers?
                  </h3>
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p className="text-muted-foreground" itemProp="text">
                      Promo codes cannot be combined with other promotional offers unless specifically stated. The discount is applied to the base price.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
