# Google Search Console Sitemap Fix

## Problem
Google Search Console is showing "Sitemap is HTML" errors for:
1. `/placesTogo` - This is a regular page, NOT a sitemap
2. `/image-sitemap.xml` - This sitemap doesn't exist (removed from robots.txt)

## Root Cause
- The `/placesTogo` URL was incorrectly added to Google Search Console as a sitemap
- The robots.txt referenced a non-existent `/image-sitemap.xml` sitemap

## Solution

### Step 1: Clean Up Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property: `zoeholiday.com`
3. Navigate to **Indexing** → **Sitemaps** in the left sidebar
4. Look for these incorrect sitemaps:
   - `/placesTogo`
   - `/image-sitemap.xml`
5. For each incorrect sitemap:
   - Click on it
   - Click the **⋮** (three dots menu)
   - Select **Remove sitemap**
   - Confirm removal

### Step 2: Verify Correct Sitemap
After removing incorrect sitemaps, ensure only this sitemap is listed:
- ✅ `/sitemap.xml` - This is the ONLY valid sitemap

### Step 3: Test Your Sitemap
Test that your sitemap is serving correctly:

```bash
curl -I https://zoeholiday.com/sitemap.xml
```

You should see:
- `Content-Type: application/xml`
- Status: `200 OK`

You can also test in browser:
- https://zoeholiday.com/sitemap.xml - Should show XML content
- https://zoeholiday.com/robots.txt - Should only reference `/sitemap.xml`

### Step 4: Submit Correct Sitemap (if needed)
If the sitemap wasn't automatically discovered:
1. In Google Search Console → Sitemaps
2. Enter: `sitemap.xml`
3. Click **Submit**

## What's in the Sitemap?
The `/sitemap.xml` includes:
- ✅ Static pages (home, programs, events, destinations, placesTogo listing, etc.)
- ✅ Dynamic program pages
- ✅ Dynamic event pages
- ✅ Dynamic destination hub pages
- ✅ Dynamic place category pages

## Changes Made
- ✅ Removed `/image-sitemap.xml` reference from robots.txt
- ✅ robots.txt now only references `/sitemap.xml`

## Expected Timeline
- **Immediate**: robots.txt change takes effect
- **1-7 days**: Google Search Console updates after sitemap cleanup
- **Ongoing**: Google will recrawl based on changeFrequency in sitemap

## Verification
After 24-48 hours, check Google Search Console:
- Sitemap errors should be cleared
- "Discovered pages" count should increase as Google crawls
- No "Sitemap is HTML" errors
