# ZoeHolidays - New Professional Features Documentation

This document outlines all the new professional features implemented to enhance the ZoeHolidays travel booking platform.

## Table of Contents
1. [Availability Calendar System](#1-availability-calendar-system)
2. [Advanced Filters & Sort](#2-advanced-filters--sort)
3. [Personalization Features](#3-personalization-features)
4. [Promo Code System](#4-promo-code-system)
5. [Program Comparison Tool](#5-program-comparison-tool)
6. [Booking Statistics](#6-booking-statistics)
7. [FAQ Sections](#7-faq-sections)
8. [Offline PWA Support](#8-offline-pwa-support)
9. [Travel Insurance](#9-travel-insurance-add-on)
10. [Group Booking Discounts](#10-group-booking-discounts)
11. [Saved Searches](#11-saved-searches--filter-persistence)

---

## 1. Availability Calendar System

### Overview
Real-time calendar showing available and booked dates for programs to prevent double bookings.

### Files Created
- `/fetch/availability.ts` - API functions for availability management
- `/components/availability/AvailabilityCalendar.tsx` - Calendar component

### Key Features
- ✅ Visual calendar with available/unavailable dates
- ✅ Date selection with validation
- ✅ Available spots tracking
- ✅ 90-day lookahead window
- ✅ Automatic booking date updates

### Strapi Schema Required
Create a new collection type `program-availabilities`:
```javascript
{
  program: { type: 'relation', relation: 'manyToOne', target: 'api::program.program' },
  date: { type: 'date', required: true },
  totalSpots: { type: 'integer', required: true, default: 20 },
  availableSpots: { type: 'integer', required: true },
  isAvailable: { type: 'boolean', default: true }
}
```

### Usage Example
```tsx
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';

<AvailabilityCalendar
  programId={program.documentId}
  onDateSelect={(date) => setSelectedDate(date)}
/>
```

---

## 2. Advanced Filters & Sort

### Overview
Professional filtering system with duration, difficulty, language, group size, and multiple sort options.

### Files Created
- `/components/programs/AdvancedFilters.tsx` - Advanced filter component
- `/components/programs/SortOptions.tsx` - Sort dropdown component

### Filter Options
- **Duration**: 1-3 days, 4-7 days, 8-14 days, 15+ days
- **Difficulty**: Easy, Moderate, Challenging, Extreme
- **Language**: English, Arabic, French, German, Spanish, Italian, Chinese, Russian
- **Group Size**: Private, Small, Medium, Large
- **Price Range**: $0 - $5000 (slider)

### Sort Options
- Recommended
- Most Popular
- Highest/Lowest Rated
- Price: Low to High / High to Low
- Shortest/Longest Duration
- Newest First

### Usage Example
```tsx
import { AdvancedFilters, FilterOptions } from '@/components/programs/AdvancedFilters';
import { SortOptions, SortOption } from '@/components/programs/SortOptions';

const [filters, setFilters] = useState<FilterOptions>({
  duration: "all",
  difficulty: "all",
  language: "all",
  groupSize: "all",
  priceRange: [0, 5000],
});

<AdvancedFilters filters={filters} onFilterChange={setFilters} onReset={handleReset} />
<SortOptions value={sortBy} onChange={setSortBy} />
```

---

## 3. Personalization Features

### Overview
AI-powered recommendation engine and recently viewed tracking for personalized user experience.

### Files Created
- `/lib/recently-viewed.ts` - Recently viewed programs tracking
- `/lib/recommendations.ts` - Recommendation algorithm
- `/components/programs/RecentlyViewed.tsx` - Recently viewed UI
- `/components/programs/RecommendedPrograms.tsx` - Recommendations UI

### Features
- **Recently Viewed**: Tracks last 10 programs viewed (30-day expiry)
- **Recommendations**: Based on location, price, duration, and rating similarity
- **Personalized Suggestions**: Uses viewing history and wishlist data

### Recommendation Algorithm
- 40% weight on location similarity
- 20% weight on price range (within 30%)
- 20% weight on duration (within 3 days)
- 20% weight on rating similarity

### Usage Example
```tsx
import { RecentlyViewed } from '@/components/programs/RecentlyViewed';
import { RecommendedPrograms } from '@/components/programs/RecommendedPrograms';
import { addToRecentlyViewed } from '@/lib/recently-viewed';

// Track view
addToRecentlyViewed({
  id: program.id,
  documentId: program.documentId,
  title: program.title,
  price: program.price,
  duration: program.duration,
  Location: program.Location,
  rating: program.rating,
  imageUrl: program.images[0]?.url
});

// Display components
<RecentlyViewed />
<RecommendedPrograms currentProgram={program} allPrograms={allPrograms} />
```

---

## 4. Promo Code System

### Overview
Complete promo code validation system with percentage and fixed discounts, usage limits, and date restrictions.

### Files Created
- `/fetch/promo-codes.ts` - Promo code API functions
- `/components/booking/PromoCodeInput.tsx` - Promo code input UI

### Features
- ✅ Percentage-based discounts (with max cap)
- ✅ Fixed amount discounts
- ✅ Minimum purchase requirements
- ✅ Usage limits tracking
- ✅ Date range validation
- ✅ Program-specific codes
- ✅ Real-time validation

### Strapi Schema Required
Create collection type `promo-codes`:
```javascript
{
  code: { type: 'string', required: true, unique: true },
  discountType: { type: 'enumeration', enum: ['percentage', 'fixed'] },
  discountValue: { type: 'decimal', required: true },
  minimumPurchase: { type: 'decimal' },
  maximumDiscount: { type: 'decimal' },
  isActive: { type: 'boolean', default: true },
  validFrom: { type: 'datetime', required: true },
  validUntil: { type: 'datetime', required: true },
  usageLimit: { type: 'integer' },
  usageCount: { type: 'integer', default: 0 },
  description: { type: 'text' },
  applicablePrograms: { type: 'json' } // Array of program documentIds
}
```

### Usage Example
```tsx
import { PromoCodeInput } from '@/components/booking/PromoCodeInput';

<PromoCodeInput
  totalAmount={1200}
  programId={program.documentId}
  onPromoApplied={(code, discount, finalPrice) => {
    setAppliedPromo({ code, discount, finalPrice });
  }}
  onPromoRemoved={() => setAppliedPromo(null)}
/>
```

---

## 5. Program Comparison Tool

### Overview
Side-by-side comparison of up to 3 programs with detailed feature comparison.

### Files Created
- `/lib/comparison.ts` - Comparison list management
- `/components/programs/CompareButton.tsx` - Add to comparison button
- `/app/(app)/compare/page.tsx` - Comparison view page

### Features
- ✅ Compare up to 3 programs simultaneously
- ✅ Side-by-side feature comparison
- ✅ Desktop table view & mobile card view
- ✅ localStorage persistence
- ✅ Quick add/remove functionality

### Comparison Criteria
- Price
- Duration
- Rating
- Location
- Description
- Quick booking links

### Usage Example
```tsx
import { CompareButton } from '@/components/programs/CompareButton';

<CompareButton
  program={{
    id: program.id,
    documentId: program.documentId,
    title: program.title,
    price: program.price,
    duration: program.duration,
    Location: program.Location,
    rating: program.rating,
    descraption: program.descraption,
    imageUrl: program.images[0]?.url
  }}
/>
```

Access comparison page at: `/compare`

---

## 6. Booking Statistics

### Overview
Real-time booking statistics display to create urgency and social proof.

### Files Created
- `/components/programs/BookingStats.tsx` - Statistics component

### Displays
- 🔥 "X people booked today"
- 📈 "Y bookings this week"
- ⏰ "Last booked Z minutes ago"
- ⭐ "Popular Choice - 100+ travelers" (for high-demand programs)

### Usage Example
```tsx
import { BookingStats } from '@/components/programs/BookingStats';

<BookingStats
  programId={program.documentId}
  programTitle={program.title}
/>
```

---

## 7. FAQ Sections

### Overview
Collapsible FAQ component with default questions and customizable content.

### Files Created
- `/components/programs/ProgramFAQ.tsx` - FAQ accordion component

### Default FAQs
1. What is included in the tour price?
2. What is your cancellation policy?
3. Do I need a visa to visit Egypt?
4. What should I pack for the trip?
5. Are tours suitable for children and elderly?
6. What is the group size?
7. Is travel insurance required?
8. What language do tour guides speak?

### Usage Example
```tsx
import { ProgramFAQ } from '@/components/programs/ProgramFAQ';

// Use default FAQs
<ProgramFAQ programTitle={program.title} />

// Use custom FAQs
<ProgramFAQ
  programTitle={program.title}
  faqs={[
    { question: "Custom question?", answer: "Custom answer..." }
  ]}
/>
```

---

## 8. Offline PWA Support

### Overview
Service Worker implementation for offline functionality and improved PWA experience.

### Files Created
- `/public/sw.js` - Service worker script
- `/public/offline.html` - Offline fallback page
- `/lib/register-sw.ts` - Service worker registration utility

### Features
- ✅ Offline page caching
- ✅ Static asset caching
- ✅ Image caching
- ✅ Smart cache management
- ✅ Auto-reload on connection restore
- ✅ Push notification support (ready for future)
- ✅ Background sync capability

### Setup
Add to your root layout:
```tsx
import { registerServiceWorker } from '@/lib/register-sw';

useEffect(() => {
  registerServiceWorker();
}, []);
```

### Cached Assets
- Home page
- Program pages
- Place pages
- Images (JPG, PNG, WebP, SVG)
- CSS/JS files
- PWA icons

---

## 9. Travel Insurance Add-on

### Overview
Comprehensive travel insurance selection with 3 coverage tiers.

### Files Created
- `/components/booking/TravelInsurance.tsx` - Insurance selection component

### Insurance Tiers

#### Basic Coverage ($49)
- Trip cancellation up to $5,000
- Medical emergencies up to $50,000
- Lost luggage up to $1,000
- 24/7 emergency assistance

#### Standard Coverage ($89) ⭐ Recommended
- Trip cancellation up to $10,000
- Medical emergencies up to $100,000
- Lost luggage up to $2,500
- Trip delay coverage
- Emergency evacuation
- 24/7 emergency assistance

#### Premium Coverage ($149)
- Trip cancellation up to $25,000
- Medical emergencies up to $250,000
- Lost luggage up to $5,000
- Trip delay & interruption
- Emergency evacuation & repatriation
- Cancel for any reason (CFAR)
- Adventure sports coverage
- 24/7 premium concierge

### Usage Example
```tsx
import { TravelInsurance } from '@/components/booking/TravelInsurance';

<TravelInsurance
  tripPrice={1200}
  onInsuranceSelected={(option) => {
    if (option) {
      setInsurance({ name: option.name, price: option.price });
    } else {
      setInsurance(null);
    }
  }}
/>
```

---

## 10. Group Booking Discounts

### Overview
Automatic group discount calculation based on number of travelers.

### Files Created
- `/lib/group-discounts.ts` - Discount calculation logic
- `/components/booking/GroupDiscountCalculator.tsx` - Discount display UI

### Discount Tiers
- **4-6 travelers**: 5% discount (Small Group)
- **7-10 travelers**: 10% discount (Group)
- **11-15 travelers**: 15% discount (Large Group)
- **16+ travelers**: 20% discount (Extra Large Group)

### Features
- ✅ Real-time discount calculation
- ✅ Per-person savings display
- ✅ Next tier incentive messaging
- ✅ Visual discount tier table
- ✅ Customizable discount rules

### Usage Example
```tsx
import { GroupDiscountCalculator } from '@/components/booking/GroupDiscountCalculator';
import { calculateGroupDiscount } from '@/lib/group-discounts';

<GroupDiscountCalculator
  numberOfTravelers={8}
  basePrice={150}
  onDiscountCalculated={(discountAmount, finalTotal) => {
    setTotalPrice(finalTotal);
  }}
/>
```

---

## 11. Saved Searches & Filter Persistence

### Overview
Save favorite search criteria and automatically restore filters between sessions.

### Files Created
- `/lib/saved-searches.ts` - Search management utilities
- `/components/programs/SavedSearches.tsx` - Saved searches UI

### Features
- ✅ Save up to 10 custom searches
- ✅ Auto-restore last filter state
- ✅ Quick apply saved searches
- ✅ Rename/delete searches
- ✅ Last used tracking
- ✅ Filter persistence across sessions

### Saved Data
- Search terms
- Price range
- Duration filter
- Difficulty level
- Language preference
- Group size
- Sort order

### Usage Example
```tsx
import { SavedSearches } from '@/components/programs/SavedSearches';
import { saveSearch, getSavedSearches } from '@/lib/saved-searches';

// Save current search
saveSearch("Cairo 5-day tours under $500", {
  searchTerm: "Cairo",
  priceRange: [0, 500],
  duration: "4-7"
}, "price-asc");

// Component usage
<SavedSearches
  currentFilters={{ searchTerm, ...filters }}
  currentSort={sortBy}
  onApplySearch={(search) => {
    // Apply saved filters
    setFilters(search.filters);
    setSortBy(search.sortBy);
  }}
/>
```

---

## Integration Guide

### Step 1: Update Strapi Schema
Add the following collection types to your Strapi backend:

1. **program-availabilities** (see section 1)
2. **promo-codes** (see section 4)

### Step 2: Replace Current Programs Page
Replace the existing `/app/(app)/programs/components/PageContent.tsx` with `EnhancedPageContent.tsx`:

```bash
# Backup current file
mv app/(app)/programs/components/PageContent.tsx app/(app)/programs/components/PageContent.backup.tsx

# Use enhanced version
mv app/(app)/programs/components/EnhancedPageContent.tsx app/(app)/programs/components/PageContent.tsx
```

### Step 3: Enable Service Worker
Add to `app/layout.tsx`:

```tsx
"use client";
import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/register-sw';

export default function RootLayout({ children }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Step 4: Update Program Detail Pages
Add new features to individual program pages:

```tsx
import { BookingStats } from '@/components/programs/BookingStats';
import { RecommendedPrograms } from '@/components/programs/RecommendedPrograms';
import { ProgramFAQ } from '@/components/programs/ProgramFAQ';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { CompareButton } from '@/components/programs/CompareButton';
import { addToRecentlyViewed } from '@/lib/recently-viewed';

// In your program detail component
<BookingStats programId={program.documentId} programTitle={program.title} />
<AvailabilityCalendar programId={program.documentId} onDateSelect={setDate} />
<CompareButton program={programData} />
<RecommendedPrograms currentProgram={program} allPrograms={allPrograms} />
<ProgramFAQ programTitle={program.title} />

// Track view
useEffect(() => {
  addToRecentlyViewed({...programData});
}, [programData]);
```

### Step 5: Update Booking Flow
Integrate insurance and discounts into booking process:

```tsx
import { TravelInsurance } from '@/components/booking/TravelInsurance';
import { GroupDiscountCalculator } from '@/components/booking/GroupDiscountCalculator';
import { PromoCodeInput } from '@/components/booking/PromoCodeInput';

// In booking form
<GroupDiscountCalculator
  numberOfTravelers={travelers}
  basePrice={program.price}
  onDiscountCalculated={(discount, total) => setTotal(total)}
/>

<PromoCodeInput
  totalAmount={subtotal}
  programId={program.documentId}
  onPromoApplied={(code, discount, final) => setPromoDiscount(discount)}
  onPromoRemoved={() => setPromoDiscount(0)}
/>

<TravelInsurance
  tripPrice={subtotal}
  onInsuranceSelected={(option) => setInsurance(option)}
/>
```

---

## Testing Checklist

### Functionality Tests
- [ ] Availability calendar displays correctly
- [ ] Filters work independently and in combination
- [ ] Sort options produce correct order
- [ ] Recently viewed tracks programs correctly
- [ ] Recommendations are relevant
- [ ] Promo codes validate properly
- [ ] Comparison tool works with 1-3 programs
- [ ] Booking stats display real data
- [ ] FAQ accordion expands/collapses
- [ ] Service worker caches assets
- [ ] Insurance selection updates total
- [ ] Group discounts calculate correctly
- [ ] Saved searches persist between sessions

### UI/UX Tests
- [ ] Mobile responsive on all screen sizes
- [ ] Filters accessible on mobile (sheet)
- [ ] Comparison table scrolls horizontally
- [ ] Tooltips display correctly
- [ ] Loading states show appropriately
- [ ] Error messages are clear
- [ ] Success toasts appear
- [ ] Animations are smooth

### Data Persistence Tests
- [ ] Recently viewed survives page refresh
- [ ] Comparison list persists
- [ ] Filter state restores on return
- [ ] Saved searches remain after browser close
- [ ] Promo code usage increments

---

## Future Enhancements

### Planned Features
1. **Email Notifications** - Booking confirmations, trip reminders
2. **Payment Gateway Integration** - Stripe/PayPal
3. **Multi-currency Support** - Live currency conversion
4. **Push Notifications** - Booking updates via service worker
5. **Analytics Integration** - Track all user interactions
6. **Admin Dashboard** - Manage bookings, availability, promo codes
7. **Review with Photos** - User-uploaded travel photos
8. **Virtual Tours** - 360° photos and videos
9. **Live Chat** - Customer support widget
10. **Wishlist Price Alerts** - Notify when prices drop

---

## Performance Optimization

### Implemented
- ✅ LocalStorage for client-side data
- ✅ Debounced search inputs
- ✅ Optimistic UI updates
- ✅ Lazy loading of components
- ✅ Service worker caching
- ✅ Efficient filter algorithms

### Recommendations
- Implement React Query for server state
- Add virtual scrolling for large lists
- Optimize images with Next.js Image
- Use ISR for program pages
- Add rate limiting for API calls

---

## Support & Maintenance

### Troubleshooting

**Issue: Filters not persisting**
- Check localStorage is enabled
- Clear browser cache
- Verify `persistFilterState` is called

**Issue: Service worker not updating**
- Unregister old worker: `navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()))`
- Hard refresh: Ctrl+Shift+R
- Update cache version in `sw.js`

**Issue: Promo codes not validating**
- Verify Strapi API is accessible
- Check `NEXT_PUBLIC_STRAPI_TOKEN` is set
- Ensure promo code collection exists in Strapi

### Maintenance Tasks
- Weekly: Review and clean old cached searches
- Monthly: Audit promo code usage
- Quarterly: Update default FAQ content
- Annually: Review and update insurance tiers

---

## License & Credits

All features developed for ZoeHolidays Travel Platform.
Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

For questions or support, contact the development team.
