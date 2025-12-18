/**
 * ItemList Schema for Program Listings
 * Helps Google understand your list of tours and display carousels
 */

interface ListItem {
  name: string;
  url: string;
  image?: string;
  description?: string;
  position?: number;
}

interface ItemListSchemaProps {
  items: ListItem[];
  listName?: string;
  description?: string;
}

export default function ItemListSchema({
  items,
  listName = 'Egypt Tour Packages',
  description = 'Explore our curated collection of Egypt tours and travel packages',
}: ItemListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      item: {
        '@type': 'TouristTrip',
        name: item.name,
        url: item.url,
        ...(item.image && { image: item.image }),
        ...(item.description && { description: item.description }),
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
