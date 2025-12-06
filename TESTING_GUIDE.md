# Testing Guide for Production Fixes

## Quick Start
```bash
# 1. Start Strapi backend (in separate terminal)
cd ../backend
npm run develop

# 2. Start Next.js dev server
npm run dev
```

## Test Cases

### ✅ Test 1: Bookings API (Issue #4)
**What to test:** Verify bookings load without 400 errors

**Steps:**
1. Login to your account
2. Navigate to `/me` page
3. Click on "Bookings" tab
4. **Expected:** Bookings list should load without errors
5. **Check console:** No 400 errors for bookings API

**Fixed File:** `fetch/bookings.ts:87`

---

### ✅ Test 2: Homepage Programs Display (Issue #9)
**What to test:** Verify 6 programs show on homepage instead of 3

**Steps:**
1. Navigate to homepage `/`
2. Scroll to "Programs" section
3. **Expected:** Should see 6 program cards displayed
4. **Previous:** Only 3 programs were showing

**Fixed Files:** `fetch/homepage.ts:116, 163`

---

### ✅ Test 3: Recently Viewed (Issue #5)
**What to test:** Verify recently viewed programs are tracked

**Steps:**
1. Logout if logged in, then login (to see the Recently Viewed section)
2. Navigate to any program page (e.g., `/programs/Classic Egypt Tour`)
3. Navigate to another program page
4. Navigate to another program page
5. Go back to homepage `/`
6. Scroll to "Continue Exploring" / "Recently Viewed" section
7. **Expected:** Should see the 3 programs you just viewed
8. **Check localStorage:** Open DevTools → Application → Local Storage → `recentlyViewedPrograms`

**Fixed File:** `app/(app)/programs/[title]/ProgramContent.tsx:62-87`

**Note:** Recently Viewed section only shows for logged-in users.

---

### ✅ Test 4: Performance Optimization (Issue #3)
**What to test:** Verify images load efficiently

**Steps:**
1. Open DevTools → Network tab
2. Filter by "Img"
3. Navigate to any program page
4. **Expected Behavior:**
   - First image loads immediately (priority)
   - Thumbnail images load lazily as you scroll
   - Itinerary images load when you scroll to them
   - Reduced image quality (70-85%) for faster loading

**Check:**
- Open DevTools → Network → Img
- Look for `quality=70` or `quality=80` in image URLs
- Images below the fold should load only when scrolling

**Fixed File:** `app/(app)/programs/[title]/ProgramContent.tsx:211-215, 415-420`

---

### ✅ Test 5: Availability Feature (Issues #1, #2)
**What to test:** Verify availability calendar component exists

**Steps:**
1. Check component exists: `components/availability/AvailabilityCalendar.tsx`
2. Navigate to booking page: `/programs/[any-program]/book`
3. **Expected:** Date selection calendar is present
4. **Note:** Availability highlighting requires Strapi data

**How to add availability data:**
1. Login to Strapi admin panel
2. Navigate to "Program Availabilities"
3. Create new availability records with:
   - Program reference
   - Date
   - Total spots
   - Available spots
   - Status: Available

---

### ✅ Test 6: Program Comparison (Issue #10)
**What to test:** Verify comparison feature works

**Steps:**
1. Navigate to homepage `/`
2. Scroll to "Try Our Program Comparison Tool" section
3. Click "+" on 2 or 3 programs
4. **Expected:** Programs get selected (checkmark appears)
5. Click "Compare Selected"
6. **Expected:** Navigate to `/compare` page
7. **Expected:** See side-by-side comparison

**Verified Working:** `components/programs/ComparisonDemo.tsx`

---

### ✅ Test 7: Navigation (Issue #8)
**What to test:** Verify program links work correctly

**Steps:**
1. Navigate to `/programs` page
2. Click on any program card
3. **Expected:** Navigate to `/programs/[encoded-title]`
4. **Expected:** Program details load correctly
5. Try programs with special characters in title
6. **Expected:** URL encoding works properly

**Verified Working:** All navigation uses proper `encodeURIComponent()`

---

## Browser Console Checks

### Before Fixes (Issues):
```
❌ GET /api/bookings?...&populate[user]=* → 400 Bad Request
❌ Only 3 programs on homepage
❌ No recently viewed tracking
```

### After Fixes (Expected):
```
✅ GET /api/bookings?...&filters[user][documentId][$eq]=xxx → 200 OK
✅ 6 programs on homepage
✅ localStorage has "recentlyViewedPrograms" array
✅ Images load with lazy loading
```

---

## Performance Testing

### Lighthouse Score Improvements

**Before:**
- Performance: ~75
- Large images loading eagerly

**After:**
- Performance: ~85-90 (expected)
- Optimized image loading
- Lazy loading implemented

**Test:**
1. Open DevTools → Lighthouse
2. Select "Performance" category
3. Click "Generate report"
4. **Check:**
   - Performance score improved
   - "Defer offscreen images" - should pass
   - Reduced "Total Blocking Time"

---

## API Response Validation

### Test Bookings API Response
```bash
# Using curl (replace TOKEN and USER_ID)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:1337/api/bookings?populate[program][populate][0]=images&populate[plan_trip][populate][0]=destinations&populate[event][populate][0]=images&filters[user][documentId][\$eq]=USER_ID"
```

**Expected:** 200 status code with bookings array

---

## Known Limitations

1. **Strapi Connection Required:** All features require Strapi backend running
2. **Availability Data:** Calendar highlighting requires availability data in Strapi
3. **Build Process:** Sitemap generation will show errors if Strapi is not running (this is normal)

---

## Troubleshooting

### Issue: Bookings still returning 400
**Solution:** Clear browser cache and localStorage, then retry

### Issue: Recently Viewed not showing
**Solution:**
1. Must be logged in
2. Must have viewed at least 1 program
3. Check localStorage for "recentlyViewedPrograms"

### Issue: Homepage shows less than 6 programs
**Solution:**
1. Check Strapi has at least 6 programs created
2. Check Strapi API is accessible
3. Check browser console for fetch errors

### Issue: Images not lazy loading
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check Network tab for `loading=lazy` parameter

---

## Test Completion Checklist

- [ ] Strapi backend running on port 1337
- [ ] Next.js dev server running
- [ ] Logged in with test account
- [ ] Bookings tab loads without 400 errors
- [ ] Homepage shows 6 programs
- [ ] Recently Viewed populates after viewing programs
- [ ] Images lazy load on program pages
- [ ] Program comparison works
- [ ] Navigation to program pages works
- [ ] No console errors in browser

---

**Last Updated:** December 5, 2025
**Status:** All fixes applied and ready for testing
