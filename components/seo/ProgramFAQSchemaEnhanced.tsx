/**
 * Enhanced FAQ Schema Generator for Program Pages
 * Automatically generates common travel FAQs for SEO
 */

interface ProgramFAQSchemaProps {
  programTitle: string;
  programLocation: string;
  duration: number;
  price: number;
  includes?: string[];
  excludes?: string[];
}

export default function ProgramFAQSchemaEnhanced({
  programTitle,
  programLocation,
  duration,
  price,
  includes = [],
  excludes = [],
}: ProgramFAQSchemaProps) {
  const faqs = [
    {
      question: `How long is the ${programTitle}?`,
      answer: `The ${programTitle} is ${duration} ${duration === 1 ? 'day' : 'days'} long, giving you ample time to explore ${programLocation} and experience all the highlights.`,
    },
    {
      question: `What is included in the ${programTitle} price?`,
      answer: includes.length > 0
        ? `The tour price of $${price} includes: ${includes.join(', ')}. ${excludes.length > 0 ? `Please note that the following are not included: ${excludes.join(', ')}.` : ''}`
        : `The tour is priced at $${price} per person. Please contact us for a detailed breakdown of inclusions.`,
    },
    {
      question: `Is ${programLocation} safe for tourists?`,
      answer: `Yes, ${programLocation} is generally safe for tourists. Egypt has made significant improvements in tourism security. Our tours include experienced guides who ensure your safety and provide local insights throughout your journey.`,
    },
    {
      question: `What is the best time to visit ${programLocation}?`,
      answer: `The best time to visit ${programLocation} is from October to April when the weather is cooler and more comfortable for sightseeing. However, tours operate year-round with appropriate accommodations for the season.`,
    },
    {
      question: `Do I need a visa to visit Egypt?`,
      answer: `Most travelers need a visa to enter Egypt. You can obtain a visa on arrival at Egyptian airports or apply for an e-visa online before your trip. We can provide guidance on the visa process when you book your tour.`,
    },
    {
      question: `What should I wear during the ${programTitle}?`,
      answer: `We recommend comfortable, modest clothing suitable for the climate. Lightweight, breathable fabrics are ideal. For religious sites, shoulders and knees should be covered. Don't forget sunscreen, a hat, and comfortable walking shoes.`,
    },
    {
      question: `Can I customize the ${programTitle} itinerary?`,
      answer: `Yes! We offer flexible itineraries and can customize the ${programTitle} to match your interests and schedule. Contact us to discuss your preferences and we'll create a personalized experience for you.`,
    },
    {
      question: `What is your cancellation policy for ${programTitle}?`,
      answer: `We offer flexible cancellation policies. Tours can be cancelled up to 24 hours before departure for a full refund. For detailed terms and conditions, please review our cancellation policy or contact our support team.`,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
