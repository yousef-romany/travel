# SEO Testing Quick Guide 🚀

## Test Your Production Site in 5 Minutes

### 1. Test Server-Side Rendering (Most Important!)

**Command:**
```bash
curl https://zoeholiday.com/programs/YOUR_PROGRAM_ID | grep "Travel Itinerary"
```

**Expected Result:** ✅ You should see "Travel Itinerary" in the response
**If you see nothing:** ❌ Content is still client-side only

### 2. View Page Source

1. Open any program page: `https://zoeholiday.com/programs/YOUR_PROGRAM_ID`
2. Right-click → "View Page Source"
3. Search for (Ctrl+F): "Travel Itinerary"

**✅ GOOD:** You see complete HTML with tour details
**❌ BAD:** You see empty divs or "Loading..."

### 3. Test with Google Rich Results

1. Visit: https://search.google.com/test/rich-results
2. Paste your program URL
3. Click "Test URL"

**✅ Expected:** Detects TouristTrip schema, Breadcrumbs, FAQ
**❌ Problem:** No structured data found

### 4. Verify Sitemap

Visit: https://zoeholiday.com/sitemap.xml

**✅ Check:**
- Contains program URLs
- Uses https://zoeholiday.com domain
- Shows recent lastModified dates

### 5. Check Robots.txt

Visit: https://zoeholiday.com/robots.txt

**✅ Should contain:**
```
User-agent: *
Allow: /
Sitemap: https://zoeholiday.com/sitemap.xml
```

## Quick Fixes

### If content not showing:
1. Clear Cloudflare/CDN cache
2. Rebuild: `npm run build`
3. Redeploy to Coolify
4. Wait 5 minutes for propagation

### If sitemap 404:
1. Check environment: `NEXT_PUBLIC_SITE_URL=https://zoeholiday.com`
2. Rebuild application
3. Verify `.next/server/app/sitemap.xml` exists

### If metadata wrong:
1. Check `NEXT_PUBLIC_SITE_URL` in production
2. Ensure `generateMetadata` is async
3. Clear browser cache (Ctrl+Shift+R)

## Google Search Console

### Submit Your Sitemap (Do This First!)
1. Go to: https://search.google.com/search-console
2. Add property: `https://zoeholiday.com`
3. Sitemap → Add sitemap: `sitemap.xml`
4. Submit

### Request Indexing for Top Pages
1. URL Inspection → Enter program URL
2. Click "Request Indexing"
3. Repeat for your top 10 programs

## Success Indicators

✅ **Build shows SSG:** `● /programs/[title]`
✅ **Curl shows content:** HTML contains tour details
✅ **Source shows HTML:** Not empty React shells
✅ **Rich results valid:** Schema detected
✅ **Sitemap loads:** All program URLs listed

## Timeline

- **Immediate:** Build and deploy changes
- **1-2 hours:** Google crawls sitemap
- **24-48 hours:** Pages start appearing in search
- **1-2 weeks:** Full indexing and ranking

## Need Help?

Check the full documentation: `SEO_IMPROVEMENTS_2025.md`

---
**Status:** Ready for Production ✅
