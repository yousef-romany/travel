# Events Feature Setup Guide

## Current Status

✅ **Frontend Implementation Complete**
- Events page created at `/app/(app)/events/page.tsx`
- Event detail page at `/app/(app)/events/[slug]/page.tsx`
- Events API functions in `/fetch/events.ts`
- Events link added to NavBar, Footer, and mobile Menu

⚠️ **Backend Setup Required - Strapi v5**
The events page shows "404 Error" because the Strapi v5 backend doesn't have the Events collection type yet.

**Error you're seeing**:
```
GET /api/events?populate=*&filters[isActive][$eq]=true... (404)
```

This is normal - the collection doesn't exist yet in Strapi.

## Setting Up Events in Strapi

### Step 1: Create Events Collection Type

1. Open your Strapi admin panel (usually at https://dashboard.zoeholidays.com/admin)
2. Go to **Content-Type Builder**
3. Click **Create new collection type**
4. Name it **"event"** (singular)

### Step 2: Add Fields to Events Collection

Add the following fields to your Events collection:

| Field Name | Type | Settings |
|------------|------|----------|
| title | Text (short) | Required |
| slug | UID (attached to title) | Required, Unique |
| description | Text (long) | Optional |
| content | Rich text | Optional |
| eventType | Enumeration | Values: `live_blog`, `music`, `festival`, `cultural`, `sports`, `exhibition`, `other` |
| startDate | DateTime | Required |
| endDate | DateTime | Optional |
| location | Text (short) | Optional |
| venue | Text (short) | Optional |
| price | Number (decimal) | Optional |
| ticketUrl | Text (short) | Optional |
| featuredImage | Media (single) | Optional |
| gallery | Media (multiple) | Optional |
| videoUrl | Text (short) | Optional |
| youtubeUrl | Text (short) | Optional |
| isFeatured | Boolean | Default: false |
| isActive | Boolean | Default: true |
| organizer | Text (short) | Optional |
| contactEmail | Email | Optional |
| contactPhone | Text (short) | Optional |
| tags | JSON | Optional |
| capacity | Number (integer) | Optional |
| attendees | Number (integer) | Optional |

### Step 3: Configure Permissions

1. Go to **Settings** → **Roles** → **Public**
2. Find **Event** permissions
3. Check the following:
   - `find` (to list all events)
   - `findOne` (to view single event)
4. Save

### Step 4: Add Sample Events

1. Go to **Content Manager** → **Events**
2. Click **Create new entry**
3. Fill in the fields:
   - Title: "Cairo Jazz Festival 2025"
   - Slug: "cairo-jazz-festival-2025"
   - Description: "Annual jazz festival featuring local and international artists"
   - Event Type: music
   - Start Date: Choose a future date
   - Location: "Cairo Opera House"
   - Is Active: true
   - Is Featured: true
4. Click **Save** and **Publish**

### Step 5: Test the Events Page

1. Restart your Next.js development server if needed
2. Visit https://zoeholidays.com/events
3. You should now see your events displayed!

## Event Types and Their Use Cases

- **live_blog**: Real-time coverage of ongoing events
- **music**: Concerts, festivals, performances
- **festival**: Cultural celebrations, food festivals
- **cultural**: Museum exhibitions, theater, art shows
- **sports**: Sporting events, tournaments
- **exhibition**: Trade shows, conventions
- **other**: Miscellaneous events

## API Endpoints

The following API endpoints are already configured:

- `GET /api/events` - List all events with filtering
- `GET /api/events?filters[slug][$eq]=:slug` - Get event by slug
- `GET /api/events?filters[startDate][$gte]=:date` - Get upcoming events
- `GET /api/events?filters[isFeatured][$eq]=true` - Get featured events

## Troubleshooting

### "Error loading events" message
- **Cause**: Strapi doesn't have Events collection or no events published
- **Solution**: Follow Steps 1-4 above

### Events not showing up
- **Cause**: Permissions not set correctly
- **Solution**: Check Step 3, ensure public can `find` and `findOne`

### "Event not found" on detail page
- **Cause**: Slug doesn't match or event not published
- **Solution**: Verify slug in URL matches event slug in Strapi

## Environment Variables

Make sure these are set in your `.env` file:

```env
NEXT_PUBLIC_STRAPI_URL=https://dashboard.zoeholidays.com
NEXT_PUBLIC_STRAPI_TOKEN=your-api-token-here
```

## Feature Highlights

✨ **Event Filtering**: Filter by event type (music, cultural, sports, etc.)
✨ **Featured Events**: Highlight special events
✨ **Rich Details**: Images, galleries, videos, pricing
✨ **Mobile Responsive**: Works perfectly on all devices
✨ **SEO Optimized**: Breadcrumbs and metadata included
