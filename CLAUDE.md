# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Environment Setup

Required environment variables in `.env`:
- `NEXT_PUBLIC_STRAPI_URL` - Strapi backend URL (default: https://dashboard.zoeholidays.com)
- `STRAPI_HOST` - Strapi host URL
- `NEXT_PUBLIC_STRAPI_TOKEN` - Strapi API token for authenticated requests
- `NEXT_PUBLIC_INSTAGRAM_TOKEN` - Instagram API token for feed integration
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp number for booking notifications (format: 201000000000, without + or spaces)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID for tracking

## Architecture Overview

### Backend Integration
- **Strapi CMS**: Headless CMS backend running on port 1337
- **API Communication**: Centralized in `lib/api.ts` with JWT token authentication from localStorage
- **Data Fetching**: Domain-specific fetch functions in `fetch/` directory using axios with Strapi API tokens

### App Structure
- **Nested Layouts**: Uses Next.js App Router with dual layout system
  - Root layout (`app/layout.tsx`): Wraps entire app with AuthProvider, ThemeProvider, NavBar, Google Translate scripts, and Toaster
  - Nested layout (`app/(app)/layout.tsx`): For public pages, adds Footer and ScrollToTopButton
- **Route Groups**: `(app)` route group contains main application pages (programs, placesTogo, inspiration, etc.)
- **Auth Pages**: Outside route group (login, signup, complete-profile, reset-password, email-confirmation)

### Authentication Flow
- **Context**: `AuthContext` provides global authentication state with localStorage persistence
- **Token Storage**: JWT stored in localStorage as "authToken"
- **User State**: Loads on app mount from `/api/users/me?populate=profile`
- **Profile Completion**: After signup/login, redirects to `/complete-profile` if `isProfileCompleted` is false
- **Auth Methods**: login, signup, forgotPassword, resetPassword, resendConfirmation, logout
- **API Routes**: Email confirmation endpoints in `app/api/confirm-email` and `app/api/resend-confirmation`

### Data Architecture
- **Programs**: Main content type with images, includes, excludes, and content_steps (itinerary)
- **Content Steps**: Link to place_to_go_subcategories which link to place_to_go_categories
- **Complex Queries**: Program details require deeply nested population of relations
- **Filtering**: Support for search by title/location and price range filtering

### Strapi API Patterns
```javascript
// Standard fetch with population
`${API_URL}/api/programs?populate=images&sort=rating:desc`

// Deep nested population
`${API_URL}/api/programs/${id}?populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories`

// Search with $or filters
`${API_URL}/api/programs?filters[$or][0][title][$containsi]=${query}&filters[$or][1][Location][$containsi]=${query}`
```

### UI Components
- **Radix UI**: Extensive use of Radix primitives (Dialog, Dropdown, Select, Tabs, etc.)
- **Styling**: Tailwind CSS with custom theme using CSS variables (HSL color system)
- **Animations**: Framer Motion for interactions, tailwindcss-animate for CSS animations
- **Icons**: Lucide React and Radix Icons
- **Carousels**: Embla Carousel with autoplay plugin
- **State Management**: TanStack React Query for server state
- **Theme**: next-themes for dark/light mode support
- **Notifications**: Sonner for toast notifications

### Image Configuration
Next.js Image component configured for:
- Cloudinary (res.cloudinary.com)
- Bing images (th.bing.com)
- Instagram CDN (scontent.cdninstagram.com, instagram.fcai21-3.fna.fbcdn.net)
- Local Strapi uploads (localhost:1337/uploads/**)

### Special Features
- **Google Translate Integration**: Custom scripts in `/public/assets/scripts/` for multi-language support
- **Leaflet Maps**: React-Leaflet for interactive maps (CSS loaded via CDN)
- **Instagram Embeds**: Script loaded lazily for embedded Instagram posts
- **Audio Player**: React Audio Player for immersive background sounds

### Path Aliases
TypeScript configured with `@/*` alias pointing to root directory for clean imports.

### Custom Breakpoints
Tailwind configured with non-standard breakpoints:
- sm: 320px
- md: 768px
- lg: 1440px

## Working with the Codebase

### Adding New API Endpoints
Create fetch functions in `fetch/` directory following the pattern in `fetch/programs.ts`:
- Use axios with Authorization header containing STRAPI_TOKEN
- Handle population parameters for Strapi relations
- Export TypeScript types alongside fetch functions

### Authentication-Required Pages
Wrap with AuthProvider context and use `useAuth()` hook to access user state. Check `user` object and `loading` state before rendering protected content.

### Strapi Content Types
When creating new Strapi queries, deeply populate relations using bracket notation:
```
populate[relation][populate][nestedRelation]=*
```

### CORS Configuration
Next.js configured to allow credentials and requests from localhost:1337 Strapi backend.

## SEO Implementation

### Metadata Structure
- **Root Layout**: Comprehensive metadata with Open Graph, Twitter Cards, and schema.org organization data
- **Dynamic Pages**: Individual program and place pages generate metadata from CMS content
- **Title Template**: All pages use the template "%s | ZoeHoliday" for consistent branding

### Structured Data (JSON-LD)
Three schema components for rich search results:
- `OrganizationSchema`: TravelAgency schema in root layout
- `TourPackageSchema`: TouristTrip schema for program pages with pricing, ratings, and itinerary info
- `BreadcrumbSchema`: Breadcrumb navigation for improved site structure

### Sitemap & Robots
- **Dynamic Sitemap** (`app/sitemap.ts`): Auto-generates from Strapi content (programs, places, static pages)
- **Robots.txt** (`app/robots.ts`): Configured to block auth pages, allow crawling of public content

### SEO Best Practices Implemented
- Semantic HTML with proper heading hierarchy (h1, h2)
- Image alt attributes for accessibility and SEO
- Canonical URLs for duplicate content prevention
- Meta keywords for relevant search terms
- Language attribute set to "en"
- Proper formatDetection settings

## Analytics Implementation

### Google Analytics 4 (GA4) Setup
- **Component**: `components/analytics/GoogleAnalytics.tsx` - Handles GA4 script injection and automatic page view tracking
- **Environment Variable**: `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Set your GA4 measurement ID here
- **Integration**: Component added to root layout (`app/layout.tsx`) for site-wide tracking

### Event Tracking Functions (`lib/analytics.ts`)
Comprehensive tracking library with 15+ functions for user behavior analysis:

#### E-commerce Events
- `trackProgramView(programTitle, programId)` - Tracks when users view a tour program (view_item event)
- `trackBookingClick(programTitle, programId, price)` - Tracks booking initiation with e-commerce data (begin_checkout event)

#### User Actions
- `trackWishlistAction(action, programTitle)` - Tracks add/remove from wishlist
- `trackSearch(searchTerm, resultsCount)` - Tracks search queries and results
- `trackFilterUse(filterType, filterValue)` - Tracks filter usage on listing pages

#### Social & Engagement
- `trackSocialShare(platform, contentType, contentId)` - Tracks social media shares
- `trackNewsletterSignup(email)` - Tracks newsletter subscriptions
- `trackAuth(action)` - Tracks login, signup, and logout events
- `trackExternalLink(url, linkText)` - Tracks outbound link clicks
- `trackVideoPlay(videoTitle, videoId)` - Tracks video/Instagram content plays

#### Engagement Metrics
- `trackScrollDepth(depth)` - Tracks scroll depth at 25%, 50%, 75%, 100%
- `trackTimeOnPage(seconds, pagePath)` - Tracks time spent on pages

### Analytics Integration Points
- **Program Pages** (`app/(app)/programs/[title]/ProgramContent.tsx`):
  - Automatic program view tracking on mount
  - Booking button clicks tracked with price and item data
- **Future Integration Points**: Wishlist buttons, search components, filter panels, social share buttons, newsletter forms

### GA4 Configuration Notes
- Uses `afterInteractive` strategy for optimal performance
- Automatic page view tracking on route changes via `usePathname` and `useSearchParams`
- E-commerce tracking configured with currency (USD) and item details
- All events follow GA4 recommended event names and parameters