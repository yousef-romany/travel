# Fix Strapi v5 API Token Permissions (401 Error)

## Problem
Getting 401 Unauthorized errors when fetching from Strapi API, even though the token is being sent correctly:
```
Error fetching inspiration categories: Error [AxiosError]: Request failed with status code 401
```

## Root Cause
Your Strapi API token doesn't have the necessary permissions to access certain collection types like:
- `inspire-categories`
- `inspire-subcategories`
- `inspire-blogs`
- `place-to-go-categories`
- `place-to-go-subcategories`
- `place-to-go-blogs`

## Solution: Configure Token Permissions in Strapi v5

### Step 1: Access Strapi Admin Panel

1. Go to your Strapi dashboard: `https://dashboard.zoeholidays.com/admin`
2. Login with your admin credentials

### Step 2: Navigate to API Tokens

1. Click **Settings** (⚙️ icon in sidebar)
2. Under **Global Settings**, click **API Tokens**
3. Find your existing token OR create a new one

### Step 3: Configure Token Permissions

#### Option A: Full Access (Recommended for Development)

1. Click on your token or **Create new API Token**
2. **Name**: `Next.js Frontend Token`
3. **Token type**: Select **Full Access** or **Custom**
4. **Token duration**: **Unlimited** (for production)

If you select **Custom**, you need to set permissions for EACH collection type:

#### Option B: Custom Permissions (Recommended for Production)

For each collection type, enable these permissions:

**All Collection Types Used in Your App:**
- ✅ `bookings`
- ✅ `events`
- ✅ `inspire-blogs`
- ✅ `inspire-categories`
- ✅ `inspire-subcategories`
- ✅ `instagram-posts`
- ✅ `invoices`
- ✅ `loyalty`
- ✅ `loyalty-transactions`
- ✅ `place-to-go-blogs`
- ✅ `place-to-go-categories`
- ✅ `place-to-go-subcategories`
- ✅ `plan-trips`
- ✅ `profiles`
- ✅ `program-availabilities`
- ✅ `programs`
- ✅ `promo-codes`
- ✅ `referrals`
- ✅ `social-shares`
- ✅ `testimonials`
- ✅ `testimonial-votes`
- ✅ `wishlists`

**Note:** `users` endpoint requires different authentication (user JWT token, not API token)

**Permissions to Enable for Each:**
- ✅ `find` - List/search entries
- ✅ `findOne` - Get a single entry
- ❌ `create` - Not needed for public API
- ❌ `update` - Not needed for public API
- ❌ `delete` - Not needed for public API

**Example Configuration:**

```
inspire-categories
  └─ find ✅
  └─ findOne ✅

inspire-subcategories
  └─ find ✅
  └─ findOne ✅

inspire-blogs
  └─ find ✅
  └─ findOne ✅

place-to-go-categories
  └─ find ✅
  └─ findOne ✅

place-to-go-subcategories
  └─ find ✅
  └─ findOne ✅

place-to-go-blogs
  └─ find ✅
  └─ findOne ✅

programs
  └─ find ✅
  └─ findOne ✅

events
  └─ find ✅
  └─ findOne ✅
```

### Step 4: Save and Copy Token

1. Click **Save**
2. **IMPORTANT**: Copy the generated token (you can only see it once!)
3. Update your `.env` file with the new token:

```env
NEXT_PUBLIC_STRAPI_TOKEN=paste_your_new_token_here
```

### Step 5: Restart Your Next.js App

```bash
# Stop the current server (Ctrl+C)
# Then restart
bun start
# or
npm start
```

## Alternative: Use Public Permissions (Not Recommended)

If you want to make the API publicly accessible without a token:

### In Strapi Admin:

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public** role
3. For each collection type, enable:
   - ✅ `find`
   - ✅ `findOne`
4. Click **Save**

### Then update your fetch functions to NOT require a token:

**Not recommended** because it exposes your API publicly without any rate limiting or access control.

## Verify Token Permissions

### Test with cURL:

```bash
# Replace with your actual token
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://dashboard.zoeholidays.com/api/inspire-categories?populate=*
```

**Expected Response:**
- ✅ Status 200 with data
- ❌ Status 401 = Token invalid or missing permissions

### Test in Browser Console:

On your deployed Next.js site, open console (F12) and run:

```javascript
fetch('https://dashboard.zoeholidays.com/api/inspire-categories?populate=*', {
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
  }
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.error('Error:', e))
```

## Common Issues

### Issue: Token works for some collections but not others

**Solution:** Check permissions for EACH collection type individually. Strapi v5 requires explicit permissions per collection.

### Issue: Still getting 401 after updating token

**Solution:**
1. Clear Next.js build cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Restart: `npm start`
4. Verify the new token is in your `.env` file

### Issue: Token disappeared after saving

**Solution:** Strapi only shows the token once. You need to:
1. Create a new token
2. Copy it immediately
3. Update your `.env` file
4. Restart your app

### Issue: Works in Postman but not in Next.js

**Solution:** This means:
1. Token is valid ✅
2. Permissions are set ✅
3. But the token in your `.env` file might be different
4. Check: `echo $NEXT_PUBLIC_STRAPI_TOKEN` matches the token that works in Postman

## Production Deployment Checklist

When deploying to Coolify:

1. **Create a production-only token** in Strapi with limited permissions
2. **Set environment variable** in Coolify for your Next.js app:
   ```
   NEXT_PUBLIC_STRAPI_TOKEN=your_production_token_here
   ```
3. **Set environment variable** in Coolify for your Strapi app (if using different tokens):
   ```
   API_TOKEN=your_strapi_internal_token
   ```
4. **Never commit tokens** to Git
5. **Use different tokens** for development and production

## Security Best Practices

### DO:
- ✅ Use custom permissions (not full access) in production
- ✅ Set token expiration for security
- ✅ Use different tokens for dev/staging/production
- ✅ Regularly rotate tokens
- ✅ Monitor token usage in Strapi logs

### DON'T:
- ❌ Use the same token everywhere
- ❌ Commit tokens to version control
- ❌ Give full access unless necessary
- ❌ Use admin tokens for frontend API calls
- ❌ Make all collections publicly accessible without authentication

## Quick Fix Summary

**Immediate solution:**

1. Go to Strapi Admin → Settings → API Tokens
2. Create new token with **Full Access**
3. Copy the token
4. Update `.env`: `NEXT_PUBLIC_STRAPI_TOKEN=new_token`
5. Restart Next.js: `bun start`
6. Test: Should now return 200 instead of 401

**Then configure proper permissions:**

1. Go back to the token settings
2. Change from Full Access to Custom
3. Enable only `find` and `findOne` for each collection
4. Save and test again

---

**Status:** 🔧 Awaiting Strapi token configuration
**Priority:** 🔴 High - Blocking all API calls
