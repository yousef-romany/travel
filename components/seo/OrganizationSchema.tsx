import JsonLd from "./JsonLd";
import { absoluteUrl, BUSINESS, SITE_URL } from "@/lib/seo-config";

/** Primary business entity. Render once on the homepage. */
export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    alternateName: "Zoe Holidays Egypt Tours",
    description:
      "Egypt travel agency offering private tours, Nile cruises, cultural experiences and custom itineraries with local guides.",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icons/icon-512x512.png"),
      width: 512,
      height: 512,
    },
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.locality,
      addressCountry: BUSINESS.country,
    },
    areaServed: {
      "@type": "Country",
      name: "Egypt",
    },
    availableLanguage: ["English", "Arabic"],
    currenciesAccepted: "USD, EUR, EGP",
    paymentAccepted: "Cash, Credit Card, Debit Card, PayPal, Bank Transfer",
    sameAs: [
      "https://www.facebook.com/zoeholiday",
      "https://www.instagram.com/zoeholiday",
      "https://twitter.com/zoeholiday",
      "https://youtube.com/@zoeholiday",
      "https://www.tripadvisor.com/Attraction_Review-g294205-d33951827-Reviews-ZoeHolidays-Luxor_Nile_River_Valley.html",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      contactType: "customer service",
      areaServed: "EG",
      availableLanguage: ["English", "Arabic"],
    },
  };

  return <JsonLd data={schema} id="organization-schema" />;
}
