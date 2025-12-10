# Cloudflare Setup Guide - ZoeHolidays

**Last Updated**: December 10, 2025
**Status**: Ready for Implementation

---

## 🌐 Why Cloudflare?

After the recent security incident, Cloudflare adds critical protection layers:

✅ **DDoS Protection** - Automatic mitigation of attacks
✅ **Web Application Firewall (WAF)** - Block malicious requests
✅ **Bot Protection** - Stop automated attacks
✅ **Rate Limiting** - Prevent API abuse
✅ **SSL/TLS** - Free SSL certificates
✅ **CDN** - Faster content delivery worldwide
✅ **Analytics** - Security and performance insights
✅ **Zero Trust Access** - Secure your admin endpoints

---

## 📋 Prerequisites

- [ ] Domain name (e.g., zoeholidays.com)
- [ ] Access to domain registrar (for DNS changes)
- [ ] Cloudflare account (free tier works great!)
- [ ] 15-30 minutes for setup

---

## 🚀 Step-by-Step Setup

### Phase 1: Cloudflare Account Setup (5 minutes)

#### 1. Create Cloudflare Account
1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with your email
3. Verify your email address

#### 2. Add Your Site
1. Click "Add Site" in Cloudflare dashboard
2. Enter your domain: `zoeholidays.com`
3. Select plan:
   - **Free** - Great for most sites (DDoS, SSL, CDN)
   - **Pro** ($20/mo) - Advanced DDoS, WAF, Image optimization
   - **Business** ($200/mo) - Full WAF ruleset, Custom SSL

**Recommendation**: Start with **Free**, upgrade to **Pro** later if needed.

#### 3. DNS Scan & Import
Cloudflare will automatically scan your existing DNS records:
1. Review the scanned DNS records
2. Ensure all records are correct:
   ```
   A     @              [Your server IP]
   A     www            [Your server IP]
   CNAME dashboard      [Your Strapi host]
   ```
3. Click "Continue"

#### 4. Update Nameservers
Cloudflare will provide nameservers like:
```
carter.ns.cloudflare.com
lola.ns.cloudflare.com
```

**At your domain registrar** (GoDaddy, Namecheap, etc.):
1. Go to DNS settings
2. Replace existing nameservers with Cloudflare's
3. Save changes
4. Return to Cloudflare and click "Done, check nameservers"

⏰ **Wait time**: DNS propagation takes 5 minutes to 24 hours (usually ~15 minutes)

---

### Phase 2: SSL/TLS Configuration (2 minutes)

#### 1. Set SSL/TLS Mode
Dashboard → SSL/TLS → Overview

**Choose encryption mode**:
```
Flexible    ❌ - Not secure (HTTP to origin)
Full        ⚠️  - Better, but no validation
Full (Strict) ✅ - RECOMMENDED (validates certificate)
```

**Select**: **Full (Strict)**

#### 2. Enable Always Use HTTPS
SSL/TLS → Edge Certificates → Enable:
- ✅ Always Use HTTPS
- ✅ Automatic HTTPS Rewrites
- ✅ Minimum TLS Version: 1.2

#### 3. Enable HSTS (Recommended)
SSL/TLS → Edge Certificates → Enable HSTS:
```
Max Age: 6 months
Include subdomains: Yes
Preload: Yes
```

---

### Phase 3: Security Rules (10 minutes)

#### 1. Enable Bot Fight Mode (Free)
Security → Bots → Enable "Bot Fight Mode"

**What it does**:
- Blocks known bad bots
- Challenges suspicious bots
- Allows good bots (Google, Bing)

#### 2. Create Firewall Rules

**Dashboard → Security → WAF → Create firewall rule**

**Rule 1: Block Bad Countries** (if applicable)
```yaml
Rule Name: Block High-Risk Countries
Field: Country
Operator: equals
Value: [Select countries with high bot traffic]
Action: Block
```

**Rule 2: Protect Admin Routes**
```yaml
Rule Name: Protect Admin Endpoints
Expression:
  (http.request.uri.path contains "/admin" or
   http.request.uri.path contains "/dashboard" or
   http.request.uri.path contains "/api/admin")
  and not ip.src in {YOUR_OFFICE_IP}
Action: Challenge (Managed Challenge)
```

**Rule 3: Rate Limit API Endpoints**
```yaml
Rule Name: API Rate Limiting
Expression:
  http.request.uri.path contains "/api/"
Rate: 100 requests per minute
Action: Block for 1 hour
```

**Rule 4: Block SQL Injection Attempts**
```yaml
Rule Name: Block SQL Injection
Expression:
  http.request.uri contains "union" or
  http.request.uri contains "select" or
  http.request.uri contains "drop table" or
  http.request.body contains "union select"
Action: Block
```

**Rule 5: Block XSS Attempts**
```yaml
Rule Name: Block XSS
Expression:
  http.request.uri contains "<script" or
  http.request.uri contains "javascript:" or
  http.request.uri contains "onerror="
Action: Block
```

#### 3. Enable Security Level
Security → Settings → Security Level: **Medium** or **High**

#### 4. Enable Browser Integrity Check
Security → Settings → Browser Integrity Check: **Enabled**

---

### Phase 4: Performance Optimization (5 minutes)

#### 1. Enable Auto Minify
Speed → Optimization → Auto Minify:
- ✅ JavaScript
- ✅ CSS
- ✅ HTML

#### 2. Enable Brotli Compression
Speed → Optimization → Brotli: **Enabled**

#### 3. Configure Caching
Caching → Configuration:
```yaml
Browser Cache TTL: 4 hours
```

#### 4. Create Page Rules for Better Caching

**Rule 1: Cache Static Assets**
```yaml
URL: *zoeholidays.com/_next/static/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 month
```

**Rule 2: Cache Images**
```yaml
URL: *zoeholidays.com/icons/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 week
```

**Rule 3: Don't Cache API Routes**
```yaml
URL: *zoeholidays.com/api/*
Settings:
  - Cache Level: Bypass
```

---

### Phase 5: Rate Limiting (Pro/Business Only)

If on Pro or Business plan:

**Dashboard → Security → Rate Limiting → Create rate limiting rule**

**Rule 1: General API Protection**
```yaml
Rule Name: API Rate Limit
If: URI Path contains /api/
Then:
  Requests per period: 100
  Period: 1 minute
  Action: Block
  Duration: 1 hour
```

**Rule 2: Login Endpoint Protection**
```yaml
Rule Name: Login Rate Limit
If: URI Path is /api/auth/login
Then:
  Requests per period: 5
  Period: 5 minutes
  Action: Block
  Duration: 15 minutes
```

**Rule 3: Signup Protection**
```yaml
Rule Name: Signup Rate Limit
If: URI Path is /api/auth/signup
Then:
  Requests per period: 3
  Period: 10 minutes
  Action: Block
  Duration: 1 hour
```

---

### Phase 6: Advanced Security (Optional)

#### 1. Cloudflare Access (Zero Trust)

Protect your admin dashboard with Zero Trust:

1. Dashboard → Zero Trust → Access → Applications → Add application
2. Choose "Self-hosted"
3. Configure:
   ```yaml
   Application name: Admin Dashboard
   Session duration: 4 hours
   Application domain: zoeholidays.com
   Path: /admin*
   ```
4. Add policies:
   ```yaml
   Policy name: Admin Only
   Action: Allow
   Include:
     - Emails: admin@zoeholidays.com
   ```

#### 2. Transform Rules (Rewrite Headers)

**Add security headers** via Transform Rules:
```yaml
Rule Name: Security Headers
If: All incoming requests
Then modify response header:
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
```

#### 3. Enable DNSSEC

DNS → Settings → DNSSEC: **Enable**

This prevents DNS spoofing attacks.

---

## 🔧 Next.js Configuration for Cloudflare

### Update next.config.ts

Add Cloudflare-specific optimizations:

```typescript
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  // ... existing config ...

  // Cloudflare-specific headers (if not using Transform Rules)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Let Cloudflare handle HSTS
          // {
          //   key: "Strict-Transport-Security",
          //   value: "max-age=31536000; includeSubDomains; preload"
          // },

          // Cloudflare handles these, but good to have as backup
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
        ],
      },
    ];
  },

  // Optimize images for Cloudflare CDN
  images: {
    // ... existing image config ...

    // Add Cloudflare domains
    remotePatterns: [
      // ... existing patterns ...
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
    ],
  },
};

export default pwaConfig(nextConfig);
```

---

## 📊 Monitoring & Analytics

### 1. Security Analytics
Dashboard → Security → Analytics

Monitor:
- Threats blocked
- Countries blocking
- Top attack vectors
- Bot traffic

### 2. Performance Analytics
Dashboard → Analytics → Traffic

Monitor:
- Bandwidth saved
- Requests served from cache
- Response time improvements

### 3. Set Up Notifications

Dashboard → Notifications → Add:

**Alert 1: DDoS Attack**
```yaml
Notification: HTTP DDoS Attack Alert
Delivery: Email + Webhook
```

**Alert 2: High Error Rate**
```yaml
Notification: Origin Error Rate Alert
Threshold: > 5% errors
Delivery: Email
```

**Alert 3: SSL Certificate Expiry**
```yaml
Notification: SSL Certificate Expiry
Days before expiry: 14
Delivery: Email
```

---

## 🔒 Cloudflare Security Best Practices

### ✅ Essential Security Settings

1. **Enable Under Attack Mode** (when under DDoS):
   ```
   Dashboard → Quick Actions → I'm Under Attack!
   ```
   This shows challenge pages to all visitors temporarily.

2. **Geo-blocking** (if applicable):
   ```
   Firewall Rules → Block countries with no customers
   ```

3. **IP Access Rules** (whitelist your office):
   ```
   Security → WAF → Tools → IP Access Rules
   Add: Your Office IP → Allow
   ```

4. **Challenge Passage**: Set to 30 minutes
   ```
   Security → Settings → Challenge Passage: 30 minutes
   ```

### 🚫 What NOT to Do

- ❌ Don't disable "Browser Integrity Check"
- ❌ Don't use "Flexible" SSL mode
- ❌ Don't disable bot protection
- ❌ Don't cache dynamic API responses
- ❌ Don't expose your origin server IP

---

## 🔐 Environment Variables

### Update .env file

```bash
# Cloudflare Configuration (Optional)
CLOUDFLARE_ZONE_ID=your_zone_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here

# For programmatic cache purging
CLOUDFLARE_CACHE_PURGE_TOKEN=your_purge_token_here
```

To get these:
1. Zone ID: Dashboard → Overview → API section (right sidebar)
2. API Token: Profile → API Tokens → Create Token

### Create Cloudflare API Token

For automated deployments/cache purging:

1. Profile → API Tokens → Create Token
2. Use template: "Edit zone DNS"
3. Permissions:
   - Zone → Cache Purge → Purge
   - Zone → DNS → Edit
4. Zone Resources:
   - Include → Specific zone → zoeholidays.com
5. Create token and save it securely

---

## 🧪 Testing Your Cloudflare Setup

### 1. Verify DNS Propagation
```bash
# Check if Cloudflare is active
dig zoeholidays.com
# Should return Cloudflare IPs (104.x.x.x or 172.x.x.x)

# Or use online tools
https://www.whatsmydns.net/#A/zoeholidays.com
```

### 2. Test SSL/TLS
```bash
# Check SSL grade
https://www.ssllabs.com/ssltest/analyze.html?d=zoeholidays.com

# Should get A+ rating
```

### 3. Test Security Headers
```bash
# Check headers
curl -I https://zoeholidays.com

# Or use online tool
https://securityheaders.com/?q=zoeholidays.com
```

### 4. Test Firewall Rules
```bash
# Try accessing admin route (should be challenged)
curl https://zoeholidays.com/admin

# Try SQL injection (should be blocked)
curl "https://zoeholidays.com/api/test?id=1' union select * from users--"
```

### 5. Test Caching
```bash
# Check cache status
curl -I https://zoeholidays.com
# Look for: cf-cache-status: HIT
```

---

## 📱 Cloudflare Mobile App

Install for on-the-go management:
- iOS: https://apps.apple.com/app/cloudflare/id1182897623
- Android: https://play.google.com/store/apps/details?id=com.cloudflare.cloudflare

Features:
- Enable "Under Attack" mode instantly
- View analytics
- Purge cache
- Check SSL status

---

## 💰 Cost Optimization

### Free Plan Features (Sufficient for most)
- Unlimited DDoS mitigation
- Global CDN
- Free SSL certificates
- 3 Page Rules
- Basic bot protection
- 100k Worker requests/day

### When to Upgrade to Pro ($20/mo)
- Need advanced DDoS protection
- Want custom WAF rules (more than 5)
- Need image optimization
- Require prioritized support
- Want detailed analytics

### When to Upgrade to Business ($200/mo)
- Running e-commerce
- Need PCI compliance
- Want custom SSL certificates
- Require 24/7 phone support
- Need 100% uptime SLA

---

## 🚨 Incident Response with Cloudflare

### If Under DDoS Attack:

1. **Enable "I'm Under Attack" Mode**
   ```
   Dashboard → Quick Actions → I'm Under Attack!
   ```

2. **Monitor Analytics**
   ```
   Security → Analytics → View attack patterns
   ```

3. **Block Attacking IPs/Countries**
   ```
   Firewall Rules → Create rule → Block
   ```

4. **Contact Cloudflare Support** (if Pro/Business)

### If Site is Down:

1. **Check Cloudflare Status**
   ```
   https://www.cloudflarestatus.com/
   ```

2. **Temporarily Bypass Cloudflare** (last resort)
   ```
   DNS → Toggle orange cloud to gray (DNS only)
   WARNING: Exposes origin IP!
   ```

3. **Check Origin Server**
   ```
   curl -I http://YOUR_ORIGIN_IP
   ```

---

## 📚 Additional Resources

### Cloudflare Documentation
- Getting Started: https://developers.cloudflare.com/fundamentals/get-started/
- WAF Rules: https://developers.cloudflare.com/waf/
- Page Rules: https://developers.cloudflare.com/rules/page-rules/

### Community & Support
- Community Forum: https://community.cloudflare.com/
- Support: https://support.cloudflare.com/
- Status Page: https://www.cloudflarestatus.com/

### Learning Resources
- Cloudflare Learning Center: https://www.cloudflare.com/learning/
- Cloudflare TV: https://cloudflare.tv/
- Blog: https://blog.cloudflare.com/

---

## ✅ Setup Checklist

### Initial Setup
- [ ] Create Cloudflare account
- [ ] Add your domain
- [ ] Update nameservers at registrar
- [ ] Wait for DNS propagation (check status)
- [ ] Verify site is accessible

### SSL/TLS
- [ ] Set SSL mode to "Full (Strict)"
- [ ] Enable "Always Use HTTPS"
- [ ] Enable HSTS
- [ ] Test SSL grade (aim for A+)

### Security
- [ ] Enable Bot Fight Mode
- [ ] Create firewall rules (at least 3-5 rules)
- [ ] Set security level to Medium/High
- [ ] Enable Browser Integrity Check
- [ ] Configure rate limiting (if Pro/Business)

### Performance
- [ ] Enable Auto Minify
- [ ] Enable Brotli compression
- [ ] Create Page Rules for caching
- [ ] Test cache hit rate

### Monitoring
- [ ] Set up email notifications
- [ ] Install Cloudflare mobile app
- [ ] Configure alerting for attacks
- [ ] Bookmark analytics dashboard

### Optional Advanced
- [ ] Configure Cloudflare Access for admin
- [ ] Enable DNSSEC
- [ ] Set up Transform Rules
- [ ] Configure Workers (if needed)

---

## 🎯 Expected Results After Setup

✅ **Security Improvements**:
- 99.9% of DDoS attacks blocked automatically
- SQL injection and XSS attempts blocked
- Bot traffic filtered
- Brute force attacks rate-limited

✅ **Performance Improvements**:
- 30-50% reduction in bandwidth usage
- 40-60% faster page loads (via CDN)
- Better TTFB (Time To First Byte)
- Improved mobile performance

✅ **Reliability**:
- 100% uptime during attacks
- Automatic failover
- Always-on SSL

---

**Next Steps**: Start with Phase 1 and work through each phase. The entire setup should take 30-45 minutes.

**Questions?** Check Cloudflare's excellent documentation or their community forum.

**Remember**: Cloudflare is just one layer. Keep your security scripts, npm audits, and monitoring tools active!
