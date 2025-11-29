# Quick Fix Guide

## Issues Found & Solutions

### 1. Events Page Shows "Error loading events" ❌

**Root Cause**: Events collection exists in Strapi but either:
- Strapi backend is not running
- Public permissions not set
- No events are published

**Solution**:

#### Step 1: Start Strapi Backend
```bash
cd /home/yousefx00/Documents/Programing\ Projects/ZoeHolidays/travel-backend
npm run develop
```

#### Step 2: Set Public Permissions
1. Go to Strapi Admin: http://localhost:1337/admin
2. Navigate to **Settings** → **Roles** → **Public**
3. Scroll to **Event** permissions
4. Check these boxes:
   - ☑ `find` (to list all events)
   - ☑ `findOne` (to view single event)
5. Click **Save**

#### Step 3: Publish Some Events
1. Go to **Content Manager** → **Event**
2. Click **Create new entry**
3. Fill in the fields:
   - **Title**: "Cairo Jazz Festival 2025"
   - **Slug**: Auto-generated from title
   - **Event Type**: Select "music"
   - **Start Date**: Choose a date
   - **Is Active**: Toggle ON
   - **Is Featured**: Toggle ON
4. Click **Save**
5. **IMPORTANT**: Click **Publish** button

#### Step 4: Test
Visit: http://localhost:3000/events

---

### 2. Plan Your Trip Tab Shows Empty (But Has Data) ❌

**Root Cause**: Data parsing issue with Strapi v5 response format

**Solution**: ✅ **FIXED** - Updated `PlanYourTripContent.tsx` to properly parse Strapi v5 response

The component now correctly extracts `data` array from the response `{data: [...], meta:{...}}`

#### Verify the Fix:
1. Visit: http://localhost:3000/plan-your-trip
2. Check browser console for debug logs:
   ```
   Plan Your Trip - Data is array: true
   Plan Your Trip - Trips count: X
   ```
3. You should now see the trips displayed

---

## Quick Test Checklist

### Events Feature:
- [ ] Strapi backend running on port 1337
- [ ] Public permissions set for Event (find, findOne)
- [ ] At least 1 event created and published
- [ ] Visit /events - should show events grid
- [ ] Click event - should show detail page

### Plan Your Trip Feature:
- [ ] Visit /plan-your-trip
- [ ] Should see existing trips (not empty)
- [ ] Debug panel shows correct data
- [ ] Click "Create Your Own Trip" works

### PWA Feature:
- [ ] Background audio plays (after first click on mobile)
- [ ] Floating mute button appears
- [ ] Visit /manifest.json - should load
- [ ] Icons exist in /icons/ folder
- [ ] On mobile: "Add to Home Screen" option available

---

## Still Having Issues?

### Events Still 404?

Check if Strapi is running:
```bash
curl http://localhost:1337/api/events
```

Expected: JSON response with data or empty array
If error: Start Strapi backend first

### Trips Still Empty?

1. Check browser console logs
2. Look at the debug panel on the page
3. If `allTrips?.data` shows as array with items but `trips.length` is 0, there's still a parsing issue
4. Share the console output

### Backend Not Starting?

```bash
cd /home/yousefx00/Documents/Programing\ Projects/ZoeHolidays/travel-backend
npm install
npm run develop
```

---

## Environment Variables

Make sure these are set in your frontend `.env`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_TOKEN=your-token-here
```

And these in your backend `.env`:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-keys-here
API_TOKEN_SALT=your-salt-here
ADMIN_JWT_SECRET=your-secret-here
TRANSFER_TOKEN_SALT=your-salt-here
JWT_SECRET=your-secret-here
```

---

## Summary of Changes Made

✅ **Events Navigation** - Added to NavBar, Footer, Mobile Menu
✅ **Plan Your Trip** - Fixed data parsing for Strapi v5
✅ **Background Audio** - Auto-playing with mute control
✅ **PWA Configuration** - Complete iOS/Android support
✅ **App Icons** - 8 sizes generated

**Next Steps**:
1. Start Strapi backend
2. Set Event permissions to Public
3. Create and publish at least 1 event
4. Test all features
