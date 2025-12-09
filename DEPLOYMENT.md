# Production Deployment Guide - ZoeHolidays

## Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Strapi Backend
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
NEXT_PUBLIC_STRAPI_TOKEN=your_production_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=ZoeHolidays

# Instagram Integration
NEXT_PUBLIC_INSTAGRAM_TOKEN=your_instagram_token_here

# Analytics (if using)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Node Environment
NODE_ENV=production
```

### 2. Update next.config.ts

Replace the CORS origin on line 78:

```typescript
// Change this:
value: process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "https://dashboard.zoeholidays.com"

// To your actual domain:
value: process.env.NODE_ENV === "production" ? "https://your-actual-domain.com" : "https://dashboard.zoeholidays.com"
```

### 3. Build and Test

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Test production build locally
npm run start

# Check for build errors
# Verify all pages load correctly
# Test API connections
```

### 4. Performance Verification

Run Lighthouse audits:

```bash
# Install Lighthouse CLI (optional)
npm install -g lighthouse

# Run audit
lighthouse https://localhost:3000 --view
```

**Expected Scores:**
- Performance: 85+ (Mobile), 90+ (Desktop)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### 5. Security Checklist

- [ ] HTTPS enabled on production server
- [ ] Environment variables secured (not in git)
- [ ] API tokens rotated for production
- [ ] CORS configured for production domain
- [ ] Security headers verified (check with curl -I)
- [ ] CSP policy tested and working
- [ ] No console.log statements in production code

### 6. Strapi Backend Configuration

Ensure your Strapi backend has:

```javascript
// config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:', 'http:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:', 'http:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 7. Database Backup

Before deployment:

```bash
# Backup your Strapi database
# For PostgreSQL:
pg_dump your_database > backup_$(date +%Y%m%d).sql

# For MySQL:
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

### 8. Deployment Platforms

#### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 9. Post-Deployment Verification

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Images load properly
- [ ] API calls succeed
- [ ] Authentication works
- [ ] Booking system functional
- [ ] Reviews can be submitted
- [ ] Background audio works
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Instagram integration works

### 10. Monitoring Setup

#### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

#### Analytics

Already configured for Google Analytics. Verify tracking:

```javascript
// Check in browser console
window.gtag
```

### 11. Performance Monitoring

Set up Core Web Vitals monitoring:

```javascript
// app/layout.tsx or _app.tsx
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}
```

### 12. CDN Configuration

If using a CDN (Cloudflare, etc.):

- Enable caching for static assets
- Set cache TTL to match headers (1 year)
- Enable Brotli compression
- Enable HTTP/2
- Configure image optimization

### 13. SSL/TLS Certificate

Ensure HTTPS is properly configured:

```bash
# Test SSL configuration
curl -I https://your-domain.com

# Should see:
# Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### 14. Backup Strategy

Set up automated backups:

- Database: Daily backups
- Media files: Weekly backups
- Code: Git repository (already done)
- Environment variables: Secure vault

### 15. Rollback Plan

In case of issues:

```bash
# Vercel
vercel rollback

# Or redeploy previous version
vercel --prod [deployment-url]
```

## Common Issues and Solutions

### Issue: Images not loading

**Solution**: Check CORS headers and image domains in next.config.ts

### Issue: API calls failing

**Solution**: Verify NEXT_PUBLIC_STRAPI_URL and CORS configuration

### Issue: Slow performance

**Solution**: 
- Enable CDN
- Check image optimization
- Verify caching headers
- Review bundle size

### Issue: Security headers not working

**Solution**: Some hosting platforms override headers. Check platform docs.

## Success Metrics

After deployment, monitor:

- **Uptime**: Target 99.9%
- **Response Time**: < 2s for pages
- **Error Rate**: < 0.1%
- **Lighthouse Scores**: Maintain 85+ across all metrics

## Support and Maintenance

- Regular dependency updates: Monthly
- Security patches: Immediate
- Feature updates: As needed
- Performance reviews: Quarterly

---

## Quick Deploy Commands

```bash
# Development
npm run dev

# Production Build
npm run build
npm run start

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

## Emergency Contacts

- Hosting Support: [Your hosting provider]
- Strapi Backend: [Your backend team]
- Domain Registrar: [Your registrar]

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
