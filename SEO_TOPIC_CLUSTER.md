# ZoeHoliday SEO Topic Cluster

Updated: 2026-10-07

## Current-state diagnosis

The generated sitemap contains 122 canonical URLs:

- 95 destination URLs under `/placesTogo`
- 10 program URLs under `/programs`
- 6 inspiration URLs, including only two article URLs
- 11 other public pages

The site already has strong destination coverage, but the editorial layer is too
small to connect informational searches to the commercial tour pages. The
cluster strategy therefore prioritizes itinerary, Nile cruise, planning, and
traveler-type content. Existing destination pages remain the authority source
for individual attractions.

## URL and intent rules

1. `/programs` owns the broad commercial term **Egypt tour packages**.
2. Individual `/programs/[slug]` pages own their exact itinerary or activity.
3. `/placesTogo/[destination]` owns **things to do in [destination]**.
4. Inspiration category pages act as pillar hubs; their articles answer one
   specific planning question each.
5. Do not create an article with the same primary keyword as a program page.
   The article should compare, explain, or plan; the program page should sell.
6. Each supporting article links upward to its pillar, sideways to two related
   guides, and downward to one or two relevant programs.

## Cluster 1 — Egypt tour packages

**Pillar:** `/programs`

**Primary intent:** commercial investigation / booking

**Primary keyword:** Egypt tour packages

**Secondary keywords:** private Egypt tours, guided Egypt tours, Egypt vacation
packages, tailor-made Egypt tours, Egyptologist guided tours

Supporting content:

| Priority | Proposed URL | Primary keyword | Intent | Conversion target |
| --- | --- | --- | --- | --- |
| P1 | `/inspiration/egypt-travel-guide/tour-planning/how-to-choose-an-egypt-tour-package` | how to choose an Egypt tour package | Commercial investigation | `/programs` |
| P1 | `/inspiration/egypt-travel-guide/tour-planning/private-vs-group-tours-egypt` | private vs group tours Egypt | Comparison | `/programs` |
| P2 | `/inspiration/egypt-travel-guide/tour-planning/what-is-included-in-egypt-tour-packages` | what is included in Egypt tour packages | Informational/commercial | `/programs` |
| P2 | `/inspiration/egypt-travel-guide/tour-planning/how-much-does-an-egypt-tour-cost` | Egypt tour cost | Cost research | `/programs`, `/plan-your-trip` |
| P3 | `/inspiration/egypt-travel-guide/tour-planning/egyptologist-guide-egypt` | Egyptologist guide Egypt | Commercial investigation | Relevant private tours |

Every program page should link back to `/programs`, its destination hub, one
planning guide, and one closely related program.

## Cluster 2 — Egypt itineraries

**Pillar category:** `Egypt Itineraries`

**Pillar URL:** `/inspiration/egypt-itineraries`

**Subcategory:** `Day-by-Day Itineraries`

**Primary intent:** trip planning with a strong route to booking

| Priority | Proposed URL | Primary keyword | Must cover | Conversion target |
| --- | --- | --- | --- | --- |
| P1 | `/inspiration/egypt-itineraries/day-by-day/egypt-itinerary-7-days` | 7 day Egypt itinerary | Cairo, Giza, Luxor, Aswan, transport choices | Existing 7-day program |
| P1 | `/inspiration/egypt-itineraries/day-by-day/egypt-itinerary-10-days` | 10 day Egypt itinerary | Cairo, Nile cruise, Luxor, Aswan, Red Sea option | Existing 10-day program |
| P1 | `/inspiration/egypt-itineraries/day-by-day/egypt-itinerary-5-days` | 5 day Egypt itinerary | Fast first-time route and what to skip | Existing 5-day program |
| P2 | `/inspiration/egypt-itineraries/day-by-day/egypt-itinerary-14-days` | 2 week Egypt itinerary | Cairo, Alexandria, Nile, Red Sea, optional Siwa | `/plan-your-trip` |
| P2 | `/inspiration/egypt-itineraries/day-by-day/how-many-days-in-egypt` | how many days in Egypt | Compare 5, 7, 10, and 14 days | All itinerary articles |
| P3 | `/inspiration/egypt-itineraries/day-by-day/cairo-luxor-aswan-itinerary` | Cairo Luxor Aswan itinerary | Route order, flights vs train, pacing | Relevant multi-day programs |

The “how many days” page is the comparison hub. It links to every duration
article; each duration article links back to it and to exactly one primary tour.

## Cluster 3 — Nile cruises

**Pillar category:** `Nile Cruise Guide`

**Pillar URL:** `/inspiration/nile-cruise-guide`

**Subcategory:** `Cruise Planning`

**Primary intent:** commercial investigation

| Priority | Proposed URL | Primary keyword | Must cover | Conversion target |
| --- | --- | --- | --- | --- |
| P1 | `/inspiration/nile-cruise-guide/cruise-planning/luxor-to-aswan-nile-cruise` | Luxor to Aswan Nile cruise | 5-day direction, stops, embarkation | Cruise-inclusive programs |
| P1 | `/inspiration/nile-cruise-guide/cruise-planning/aswan-to-luxor-nile-cruise` | Aswan to Luxor Nile cruise | 4-day direction and differences | Cruise-inclusive programs |
| P1 | `/inspiration/nile-cruise-guide/cruise-planning/best-nile-cruise-egypt` | best Nile cruise Egypt | Selection criteria, ship classes, cabin location | `/programs` |
| P2 | `/inspiration/nile-cruise-guide/cruise-planning/nile-cruise-itinerary` | Nile cruise itinerary | Edfu, Kom Ombo, Luxor, Aswan | Destination pages + programs |
| P2 | `/inspiration/nile-cruise-guide/cruise-planning/best-time-for-a-nile-cruise` | best time for Nile cruise | Weather, crowds, water experience | Programs |
| P3 | `/inspiration/nile-cruise-guide/cruise-planning/nile-cruise-cost` | Nile cruise cost | What changes price and what is included | `/plan-your-trip` |

Do not create a separate sales page until ZoeHoliday has cruise-only inventory.
Until then, the pillar should send users to cruise-inclusive program pages.

## Cluster 4 — Egypt travel planning

**Pillar category:** `Egypt Travel Guide`

**Pillar URL:** `/inspiration/egypt-travel-guide`

**Subcategory:** `Planning Essentials`

| Priority | Proposed URL | Primary keyword | Content requirement | Conversion target |
| --- | --- | --- | --- | --- |
| P1 | `/inspiration/egypt-travel-guide/planning-essentials/best-time-to-visit-egypt` | best time to visit Egypt | Month-by-month weather and crowds | Relevant seasonal programs |
| P1 | `/inspiration/egypt-travel-guide/planning-essentials/egypt-first-time-travel-guide` | Egypt travel guide first time | Route, money, clothing, transport | `/plan-your-trip` |
| P1 | `/inspiration/egypt-travel-guide/planning-essentials/egypt-visa-guide` | Egypt visa requirements | Link to official Egyptian source; dated review | `/programs` |
| P2 | `/inspiration/egypt-travel-guide/planning-essentials/what-to-wear-in-egypt` | what to wear in Egypt | Seasons, cultural sites, cruise, Red Sea | Relevant guides |
| P2 | `/inspiration/egypt-travel-guide/planning-essentials/egypt-packing-list` | Egypt packing list | Printable checklist by season | Newsletter / programs |
| P2 | `/inspiration/egypt-travel-guide/planning-essentials/getting-around-egypt` | how to travel around Egypt | Flight, train, driver, cruise comparison | `/plan-your-trip` |
| P3 | `/inspiration/egypt-travel-guide/planning-essentials/egypt-travel-cost` | Egypt travel cost | Budget ranges with dated assumptions | Programs |
| P3 | `/inspiration/egypt-travel-guide/planning-essentials/is-egypt-safe-to-visit` | is Egypt safe to visit | Official advisories, update date, no blanket claims | Contact / planning |

Visa, safety, opening hours, ticket prices, and transport prices must display a
visible “last reviewed” date and cite an official primary source.

## Cluster 5 — Destination hubs

**Pillar:** `/placesTogo`

Existing destination pages should be the destination pillars. Prioritize their
copy and internal links in this order:

| Destination pillar | Primary keyword | First supporting guides to strengthen |
| --- | --- | --- |
| `/placesTogo/Cairo & Giza` | things to do in Cairo and Giza | Pyramids, Grand Egyptian Museum, Saqqara, Islamic Cairo |
| `/placesTogo/Luxor` | things to do in Luxor | East Bank, West Bank, Valley of the Kings, Karnak, balloon ride |
| `/placesTogo/Aswan` | things to do in Aswan | Philae, Abu Simbel, Nubian village, felucca |
| `/placesTogo/Alexandria` | things to do in Alexandria Egypt | Library, Catacombs, Citadel, day trip from Cairo |
| `/placesTogo/The Red Sea` | best Red Sea destinations Egypt | Hurghada, Marsa Alam, diving, family beaches |
| `/placesTogo/Siwa Oasis` | Siwa Oasis travel guide | How to get there, itinerary, salt lakes, desert safari |

Each attraction page links to its destination pillar and any program whose
itinerary includes that attraction. Each program itinerary already links toward
destination content; preserve and expand that connection.

## Cluster 6 — Travel styles

**Pillar category:** `Egypt Travel Styles`

**Pillar URL:** `/inspiration/egypt-travel-styles`

**Subcategory:** `Trips by Traveler Type`

| Priority | Proposed URL | Primary keyword | Conversion target |
| --- | --- | --- | --- |
| P2 | `/inspiration/egypt-travel-styles/traveler-type/egypt-family-tours-guide` | Egypt family tours | Family-friendly programs |
| P2 | `/inspiration/egypt-travel-styles/traveler-type/egypt-honeymoon-guide` | Egypt honeymoon packages | Custom trip planner |
| P2 | `/inspiration/egypt-travel-styles/traveler-type/luxury-egypt-tours-guide` | luxury Egypt tours | Premium programs |
| P3 | `/inspiration/egypt-travel-styles/traveler-type/solo-travel-egypt-guide` | solo travel Egypt | Private tours / contact |
| P3 | `/inspiration/egypt-travel-styles/traveler-type/egypt-tours-for-seniors` | Egypt tours for seniors | Slower-paced custom tours |

Only publish a traveler-type page when the programs and on-page claims actually
support that audience.

## Internal linking specification

Every new article must contain:

- one contextual link to its pillar in the first 25% of the article;
- two links to sibling articles with distinct, descriptive anchor text;
- one link to a destination page when a city or attraction is discussed;
- one primary CTA to a matching program or `/plan-your-trip`;
- one breadcrumb path generated from category and subcategory relations;
- a “Related guides” block containing three editorially selected pages.

Avoid anchors such as “click here” and “learn more.” Use anchors such as
“7-day Egypt itinerary,” “Luxor to Aswan Nile cruise,” or “things to do in
Luxor.” Do not repeat the same exact-match anchor more than once on a page.

## First 12 pieces to publish

1. How many days in Egypt?
2. 7-day Egypt itinerary
3. 10-day Egypt itinerary
4. Best time to visit Egypt
5. First-time Egypt travel guide
6. Luxor to Aswan Nile cruise
7. Aswan to Luxor Nile cruise
8. How to choose an Egypt tour package
9. Private vs group tours in Egypt
10. Cairo vs Luxor vs Aswan
11. Egypt family tours guide
12. Egypt honeymoon guide

Publish the itinerary cluster first because matching 5-, 7-, and 10-day
programs already exist. This creates the shortest path from informational
searches to a bookable product.

## Content quality checklist

- Use one primary query per URL and keep it in the title, H1, introduction, and
  one H2 where natural.
- Answer the main question directly in the opening paragraph.
- Add a route table, comparison table, or day-by-day summary when useful.
- Include first-hand operational details from ZoeHoliday guides.
- Use original photos with descriptive alt text and stable image URLs.
- Add author, published date, updated date, and a visible review date for facts
  that change.
- Keep travel claims specific and verifiable; never invent review counts,
  inclusions, prices, or safety guarantees.
- End with one clear next action: view a program, build a custom trip, or contact
  the team.

## Measurement

Track each cluster separately in Search Console:

- impressions and clicks to pillar pages;
- non-brand queries entering through supporting articles;
- clicks from articles to programs;
- `begin_checkout` events originating from editorial landing pages;
- pages with impressions but CTR below the site median;
- orphan pages and articles with fewer than three internal links.

Review results after 8–12 weeks of indexing. Expand clusters that generate
qualified program visits rather than publishing unrelated high-volume topics.
