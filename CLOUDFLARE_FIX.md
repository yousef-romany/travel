# Cloudflare CORS/API Blocking Fix

## Problem
Frontend at `localhost:3000` getting CORS errors when accessing Strapi backend at `https://dashboard.zoeholidays.com`. The issue is Cloudflare blocking API requests (HTTP 403).

## Root Cause
Cloudflare security features (WAF, Bot Fight Mode, Security Level) are blocking API requests before they reach Strapi.

## Solutions

### Solution 1: Create Cloudflare WAF Rule (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select your domain (zoeholidays.com)

2. **Create WAF Custom Rule**
   - Navigate to: Security → WAF → Custom rules
   - Click "Create rule"

3. **Configure Rule**
   ```
   Rule name: Allow API Requests

   Field: URI Path
   Operator: starts with
   Value: /api/

   Then:
   Action: Skip
   Select: All remaining custom rules, Security level, Bot Fight Mode, Rate limiting, Super Bot Fight Mode
   ```

4. **Save and Deploy**

### Solution 2: Create Page Rule for API Endpoints

1. **Go to Page Rules**
   - In Cloudflare Dashboard: Rules → Page Rules

2. **Create New Page Rule**
   ```
   URL: dashboard.zoeholidays.com/api/*

   Settings:
   - Security Level: Essentially Off
   - Browser Integrity Check: Off
   - Cache Level: Bypass
   ```

3. **Save and Deploy**

### Solution 3: Disable Bot Fight Mode Globally (Not Recommended)

1. Go to: Security → Bots
2. Turn off "Bot Fight Mode"

**Warning**: This reduces security for your entire site.

### Solution 4: Use Local Strapi Backend for Development

If you can't modify Cloudflare settings:

1. **Update frontend .env.local**
   ```bash
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   STRAPI_HOST=http://localhost:1337
   ```

2. **Start local Strapi backend**
   ```bash
   cd /home/yousefx00/Documents/Programing\ Projects/ZoeHolidays/travel-backend
   npm run develop
   ```

3. **Restart Next.js frontend**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

## Verifying the Fix

After applying any solution, test with:

```bash
# Should return 200 OK instead of 403
curl -I https://dashboard.zoeholidays.com/api/inspire-categories

# Or test from browser console
fetch('https://dashboard.zoeholidays.com/api/inspire-categories')
  .then(res => console.log(res.status))
```

## Backend Changes Made

The Strapi backend CORS configuration has been updated to allow:
- ✅ Production: `https://zoeholidays.com`, `https://www.zoeholidays.com`
- ✅ Dashboard: `https://dashboard.zoeholidays.com`
- ✅ Development: `http://localhost:3000`, `http://localhost:1337`

Changes are ready but need to be deployed to production.

## Next Steps

1. **Choose and implement** one of the solutions above
2. **Deploy backend changes** to production (if using production backend)
3. **Test** the API connections from your frontend
4. **Refresh** your frontend application

## Environment Variables Reference

Your current setup:
- Frontend URL (dev): `http://localhost:3000`
- Backend URL: `https://dashboard.zoeholidays.com`
- Strapi Token: Configured in `.env`
