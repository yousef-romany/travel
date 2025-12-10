# Deployment CSP & CORS Fix Guide

## Problem
CSP (Content Security Policy) blocked browser requests to Strapi backend, but Postman worked because it doesn't enforce CSP.

## What Was Fixed in Next.js

### 1. Fixed `app/middleware.ts`
The middleware had a restrictive CSP that blocked all external connections. Updated to allow:
- Strapi backend at `https://dashboard.zoeholidays.com`
- Google Analytics, Instagram, Google Translate
- All required CDNs and external resources

**Key change in `connect-src` directive:**
```
connect-src 'self' https://dashboard.zoeholidays.com https://www.google-analytics.com ...
```

## What You Need to Configure in Strapi v5

### 1. Configure CORS in Strapi Backend

In your **Strapi project**, edit `config/middlewares.ts` (or `config/middlewares.js`):

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://zoeholidays.com',
        'https://www.zoeholidays.com',
        'http://localhost:3000',  // For local development
      ],
      credentials: true,
      headers: [
        'Content-Type',
        'Authorization',
        'X-Frame-Options',
        'Accept',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 2. Configure Security Middleware in Strapi

In `config/middlewares.ts`, also update the security middleware:

```typescript
{
  name: 'strapi::security',
  config: {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'connect-src': ["'self'", 'https:', 'https://zoeholidays.com'],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'res.cloudinary.com',
          'dl.airtable.com',
        ],
        'media-src': [
          "'self'",
          'data:',
          'blob:',
          'res.cloudinary.com',
          'dl.airtable.com',
        ],
        upgradeInsecureRequests: null,
      },
    },
  },
},
```

### 3. Environment Variables

Make sure your Next.js project has the correct production URLs:

**.env.production** (or in Coolify environment variables):
```env
NEXT_PUBLIC_STRAPI_URL=https://dashboard.zoeholidays.com
STRAPI_HOST=https://dashboard.zoeholidays.com
NEXT_PUBLIC_STRAPI_TOKEN=your_actual_token_here
NEXT_PUBLIC_SITE_URL=https://zoeholidays.com
```

## Deployment Steps

### For Next.js (Frontend) on Coolify:
1. Push the middleware.ts changes to your repository
2. Rebuild the Next.js application in Coolify
3. Ensure environment variables are set correctly

### For Strapi v5 (Backend) on Coolify:
1. Edit `config/middlewares.ts` in your Strapi repository
2. Add the CORS and security configurations above
3. Commit and push changes
4. Rebuild Strapi application in Coolify

## Testing After Deployment

### 1. Check Browser Console
Open Developer Tools (F12) and check:
- No CSP errors in Console tab
- Network tab shows successful requests to `https://dashboard.zoeholidays.com`

### 2. Test API Calls
```javascript
// In browser console on your deployed site
fetch('https://dashboard.zoeholidays.com/api/programs?populate=*', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
})
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e))
```

### 3. Expected Results
✅ No CSP violations in console
✅ API requests return 200 status
✅ Images load from Strapi backend
✅ Authentication works properly

## Common Issues & Solutions

### Issue: Still getting CSP errors
**Solution:** Clear browser cache completely or test in Incognito mode

### Issue: CORS errors persist
**Solution:** Check Strapi logs - ensure the `origin` in CORS config matches exactly (with/without www, http/https)

### Issue: 401 Unauthorized
**Solution:** Check that `NEXT_PUBLIC_STRAPI_TOKEN` is set correctly in production environment

### Issue: Images not loading
**Solution:** Ensure Strapi `img-src` in CSP includes your Cloudinary domain and Strapi upload paths

## Additional Recommendations

### 1. Use Different Tokens for Dev/Prod
Create separate API tokens in Strapi:
- Development token for localhost
- Production token for live site

### 2. Enable Rate Limiting
In Strapi `config/middlewares.ts`, add rate limiting:
```typescript
{
  name: 'strapi::ratelimit',
  config: {
    interval: { min: 1 },
    max: 100,
  },
},
```

### 3. Monitor CSP Violations
Consider adding CSP reporting to catch issues:
```typescript
report-uri https://your-csp-report-endpoint.com/report
```

## Verification Checklist

After deployment, verify:
- [ ] Next.js builds successfully
- [ ] Strapi starts without errors
- [ ] Homepage loads without CSP errors
- [ ] Programs list fetches correctly
- [ ] Program detail pages work
- [ ] User authentication works
- [ ] Images from Strapi display properly
- [ ] Booking flow completes
- [ ] Forms submit successfully

---

**Last Updated:** 2025-12-10
**Status:** ✅ CSP Fixed in Next.js - Awaiting Strapi CORS Configuration
