# Traefik CORS Configuration for Coolify

## Option 1: Traefik Dynamic Configuration (Recommended)

Create this file on your **server** at `/data/coolify/proxy/dynamic/cors-middleware.yaml`:

```yaml
# /data/coolify/proxy/dynamic/cors-middleware.yaml
http:
  middlewares:
    cors-headers:
      headers:
        accessControlAllowOriginList:
          - "https://zoeholidays.com"
          - "https://www.zoeholidays.com"
        accessControlAllowMethods:
          - "GET"
          - "POST"
          - "PUT"
          - "PATCH"
          - "DELETE"
          - "OPTIONS"
        accessControlAllowHeaders:
          - "Authorization"
          - "Content-Type"
          - "Accept"
          - "Origin"
          - "X-Requested-With"
        accessControlAllowCredentials: true
        accessControlMaxAge: 86400
        addVaryHeader: true
        customResponseHeaders:
          X-Robots-Tag: "noindex,nofollow"
```

**To apply this middleware to your Strapi service in Coolify:**

In your Strapi application's **Docker Compose Override** or **Labels** section:
```yaml
labels:
  - "traefik.http.routers.your-strapi-router.middlewares=cors-headers@file"
```

## Option 2: Docker Compose Labels (Current Approach - Fixed)

Replace your current labels with these **corrected** ones:

```yaml
labels:
  # Enable Traefik
  - traefik.enable=true

  # Define CORS middleware properly
  - traefik.http.middlewares.strapi-cors.headers.accesscontrolalloworiginlist=https://zoeholidays.com,https://www.zoeholidays.com
  - traefik.http.middlewares.strapi-cors.headers.accesscontrolallowmethods=GET,POST,PUT,PATCH,DELETE,OPTIONS
  - traefik.http.middlewares.strapi-cors.headers.accesscontrolallowheaders=Authorization,Content-Type,Accept
  - traefik.http.middlewares.strapi-cors.headers.accesscontrolallowcredentials=true
  - traefik.http.middlewares.strapi-cors.headers.accesscontrolmaxage=86400
  - traefik.http.middlewares.strapi-cors.headers.addvaryheader=true

  # Apply middleware to your router
  - traefik.http.routers.your-strapi-router.middlewares=strapi-cors
```

**Note:** Replace `your-strapi-router` with your actual Strapi router name from Coolify.

## Option 3: Per-Service Configuration in Coolify

### For Your Strapi Backend:

1. Go to Coolify Dashboard → Your Strapi Application
2. Navigate to **Resource Labels** or **Advanced Settings**
3. Add these labels:

```
traefik.http.middlewares.strapi-cors.headers.accesscontrolalloworiginlist=https://zoeholidays.com
traefik.http.middlewares.strapi-cors.headers.accesscontrolallowcredentials=true
traefik.http.routers.{your-strapi-id}.middlewares=strapi-cors
```

## Complete Coolify Setup Guide

### Step 1: SSH to Your Coolify Server

```bash
ssh user@your-server-ip
```

### Step 2: Create Dynamic Configuration

```bash
# Create the dynamic config file
sudo nano /data/coolify/proxy/dynamic/cors-middleware.yaml
```

Paste the YAML configuration from Option 1 above.

### Step 3: Restart Traefik

```bash
docker restart coolify-proxy
```

### Step 4: Update Strapi Application Labels in Coolify

In Coolify UI:
1. Go to **Resources** → **Strapi Application**
2. Click **Edit Configuration**
3. Find **Resource Labels** or **Docker Compose Override**
4. Add the middleware reference:

```yaml
labels:
  - "traefik.http.routers.strapi.middlewares=cors-headers@file,gzip"
```

### Step 5: Update Next.js Application

Your Next.js app already has the correct CSP configuration after our fix. Just ensure these environment variables are set in Coolify:

**Next.js Environment Variables:**
```env
NEXT_PUBLIC_STRAPI_URL=https://dashboard.zoeholidays.com
STRAPI_HOST=https://dashboard.zoeholidays.com
NEXT_PUBLIC_STRAPI_TOKEN=your_token_here
NEXT_PUBLIC_SITE_URL=https://zoeholidays.com
```

**Strapi Environment Variables:**
```env
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
DATABASE_CLIENT=postgres
DATABASE_HOST=your_db_host
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
URL=https://dashboard.zoeholidays.com
```

## Strapi v5 Backend Configuration

You MUST also configure CORS in Strapi itself. Create/edit `config/middlewares.ts`:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
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
          ],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://zoeholidays.com',
        'https://www.zoeholidays.com',
        'http://localhost:3000', // For local development
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'X-Requested-With',
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

## Testing the Configuration

### Test 1: Check Traefik Dashboard

```bash
# Access Traefik dashboard (if enabled)
# Navigate to http://your-server-ip:8080/dashboard/
# Check that your middleware is loaded
```

### Test 2: Test CORS from Browser

Open your deployed site's console (F12) and run:

```javascript
fetch('https://dashboard.zoeholidays.com/api/programs?populate=*', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('CORS Headers:', {
    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
  });
  return response.json();
})
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### Test 3: Check Response Headers

```bash
curl -I -X GET \
  -H "Origin: https://zoeholidays.com" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://dashboard.zoeholidays.com/api/programs
```

Expected headers in response:
```
Access-Control-Allow-Origin: https://zoeholidays.com
Access-Control-Allow-Credentials: true
```

## Troubleshooting

### Issue: Still Getting CORS Errors

1. **Check Traefik logs:**
```bash
docker logs coolify-proxy
```

2. **Verify middleware is loaded:**
```bash
cat /data/coolify/proxy/dynamic/cors-middleware.yaml
```

3. **Restart services in order:**
```bash
# 1. Restart Traefik
docker restart coolify-proxy

# 2. Restart Strapi
# (Use Coolify UI to restart)

# 3. Restart Next.js
# (Use Coolify UI to restart)
```

### Issue: 401 Unauthorized

- Check that your `NEXT_PUBLIC_STRAPI_TOKEN` is correct
- Verify token hasn't expired in Strapi admin panel

### Issue: Headers Not Being Added

- Ensure the dynamic config file has correct YAML syntax
- Check file permissions: `sudo chmod 644 /data/coolify/proxy/dynamic/cors-middleware.yaml`
- Verify Traefik is watching the directory (should be automatic with `--providers.file.watch=true`)

## Recommended Architecture

```
Browser (zoeholidays.com)
    ↓
Traefik Proxy (CORS middleware)
    ↓
Next.js App (CSP configured) ← Fixed ✅
    ↓
Traefik Proxy (CORS middleware)
    ↓
Strapi Backend (CORS enabled in config/middlewares.ts)
```

**Three layers of CORS/CSP:**
1. ✅ Traefik - Infrastructure level
2. ✅ Next.js Middleware - Application CSP
3. ✅ Strapi - Backend CORS

## Quick Checklist

- [ ] Next.js `app/middleware.ts` updated with correct CSP
- [ ] Traefik dynamic CORS configuration created
- [ ] Strapi `config/middlewares.ts` configured with CORS
- [ ] Environment variables set in Coolify for both apps
- [ ] All services restarted in correct order
- [ ] Browser console shows no CSP errors
- [ ] API calls return 200 status
- [ ] CORS headers present in responses

---

**Status:** Configuration guide complete
**Next:** Apply these configurations to your Coolify deployment
