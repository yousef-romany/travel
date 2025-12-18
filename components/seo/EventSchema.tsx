/**
 * Event Schema for Tour Departures and Special Events
 * Shows event rich results in Google Search
 */

interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string; // ISO 8601 format
  endDate?: string;
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  image?: string;
  price?: number;
  currency?: string;
  url: string;
  organizer?: {
    name: string;
    url: string;
  };
  performer?: string;
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
  availability?: 'InStock' | 'SoldOut' | 'PreOrder';
}

export default function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  price,
  currency = 'USD',
  url,
  organizer = {
    name: 'ZoeHoliday',
    url: 'https://zoeholiday.com',
  },
  performer,
  eventStatus = 'EventScheduled',
  eventAttendanceMode = 'OfflineEventAttendanceMode',
  availability = 'InStock',
}: EventSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      '@type': 'Place',
      name: location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address,
        addressLocality: location.city,
        addressCountry: location.country,
      },
    },
    ...(image && { image }),
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    ...(price && {
      offers: {
        '@type': 'Offer',
        url,
        price: price.toString(),
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
        validFrom: new Date().toISOString(),
      },
    }),
    organizer: {
      '@type': 'Organization',
      name: organizer.name,
      url: organizer.url,
    },
    ...(performer && { performer: { '@type': 'Person', name: performer } }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
