# Performance Optimization Guide

## Overview
This document outlines additional performance optimizations you can implement to further improve your ZoeHolidays app.

---

## 1. Image Optimization (Advanced)

### Convert Images to WebP

```bash
# Install sharp for image conversion
npm install sharp

# Create conversion script
# scripts/convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convertToWebP = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath);
};

// Usage: node scripts/convert-images.js
```

### Implement Lazy Loading

Already implemented via Next.js Image component! ✅

### Image CDN

Consider using Cloudinary or similar:

```typescript
// lib/utils.ts
export const getOptimizedImageUrl = (url: string, width?: number) => {
  if (url.includes('cloudinary.com')) {
    // Already optimized
    return url;
  }
  // Add your CDN transformation logic
  return url;
};
```

---

## 2. Code Splitting

### Dynamic Imports

Implement for heavy components:

```typescript
// Example: Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // If component doesn't need SSR
});
```

### Route-based Splitting

Next.js does this automatically! ✅

---

## 3. Bundle Analysis

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Update next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### Remove Unused Dependencies

```bash
# Check for unused dependencies
npx depcheck

# Remove unused packages
npm uninstall [package-name]
```

---

## 4. Database Optimization

### Strapi Performance

```javascript
// config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      // ... connection details
      pool: {
        min: 2,
        max: 10,
      },
    },
    acquireConnectionTimeout: 60000,
  },
});
```

### API Response Caching

```typescript
// Example: Cache API responses
const cache = new Map();

export const fetchWithCache = async (key: string, fetcher: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetcher();
  cache.set(key, data);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);
  
  return data;
};
```

---

## 5. Font Optimization

### Use next/font

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 6. Prefetching

### Link Prefetching

Next.js Link component prefetches automatically! ✅

### Manual Prefetching

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// Prefetch on hover
<div onMouseEnter={() => router.prefetch('/programs')}>
  Programs
</div>
```

---

## 7. Service Worker (PWA)

### Install next-pwa

```bash
npm install next-pwa
```

```javascript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
```

---

## 8. Compression

### Already Enabled! ✅

```typescript
// next.config.ts
compress: true, // ✅ Already added
```

---

## 9. Monitoring

### Web Vitals

```typescript
// app/layout.tsx
export function reportWebVitals(metric: any) {
  console.log(metric);
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}
```

---

## 10. Advanced Caching

### Redis Caching (Server-side)

```typescript
// lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheGet = async (key: string) => {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const cacheSet = async (key: string, value: any, ttl = 3600) => {
  await redis.setex(key, ttl, JSON.stringify(value));
};
```

---

## Performance Checklist

- [x] Image optimization (Next.js Image)
- [x] Caching headers configured
- [x] Compression enabled
- [x] Package imports optimized
- [ ] WebP image conversion (optional)
- [ ] Bundle analysis (run when needed)
- [ ] Service Worker/PWA (optional)
- [ ] Redis caching (optional)
- [ ] CDN setup (recommended)

---

## Expected Results

After implementing all optimizations:

- **Mobile Performance**: 90+ (from 42)
- **Desktop Performance**: 95+ (from 65)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

---

## Tools for Testing

```bash
# Lighthouse CLI
lighthouse https://your-site.com --view

# WebPageTest
# Visit: https://www.webpagetest.org/

# Chrome DevTools
# Performance tab + Lighthouse tab
```

---

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
