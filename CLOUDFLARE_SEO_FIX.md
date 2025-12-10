# Cloudflare SEO Configuration Guide

## Critical: Allow Google Bots to Access Your Site

### Issue
Cloudflare is blocking Google PageSpeed Insights and potentially other search engine crawlers from accessing your website. This is causing:
- PageSpeed Insights to show Cloudflare challenge page instead of your website
- SEO score of 42 (extremely low)
- Potential indexing issues in Google Search

### Solution: Configure Cloudflare Bot Protection

#### Step 1: Login to Cloudflare Dashboard
1. Go to https://dash.cloudflare.com/
2. Select your domain: **zoeholidays.com**

#### Step 2: Allow Verified Bots
1. Navigate to **Security** → **Bots**
2. Under "Bot Fight Mode" settings:
   - **Turn OFF "Bot Fight Mode"** (this blocks all bots including Google)
   - Or if you have Pro/Business plan, use "Super Bot Fight Mode" with custom rules

#### Step 3: Create Firewall Rules to Allow Search Engine Bots
1. Go to **Security** → **WAF** → **Firewall Rules**
2. Click **"Create a Firewall Rule"**
3. Name: `Allow Search Engine Bots`
4. Configure the rule:

**Expression:**
```
(cf.client.bot) or (http.user_agent contains "Googlebot") or (http.user_agent contains "bingbot") or (http.user_agent contains "Google PageSpeed Insights") or (http.user_agent contains "Chrome-Lighthouse") or (http.user_agent contains "PTST")
```

**Action:** `Allow`

5. Click **Deploy**

#### Step 4: Verify Legitimate Bots are Allowed
1. Go to **Security** → **Bots**
2. Ensure "Verified Bots" setting is set to **"Allow"**
3. Make sure these bot categories are ALLOWED:
   - ✅ Verified Bots (includes Google, Bing, etc.)
   - ✅ Search Engine Crawlers
   - ✅ Monitor/Uptime Bots

#### Step 5: Disable "I'm Under Attack Mode" (if active)
1. Go to **Security** → **Settings**
2. Check if "Security Level" is set to "I'm Under Attack"
3. Change it to **"Medium"** or **"High"** (NOT "I'm Under Attack")

#### Step 6: Configure Rate Limiting (Optional but Recommended)
Instead of blocking all bots, use rate limiting:
1. Go to **Security** → **WAF** → **Rate Limiting Rules**
2. Create rules that limit requests per IP (e.g., 100 requests per minute)
3. This protects against DDoS while allowing legitimate crawlers

#### Step 7: Test Your Changes
After making these changes, test your site:

1. **Google PageSpeed Insights:**
   - Go to https://pagespeed.web.dev/
   - Enter: https://zoeholidays.com
   - Should now show your actual website, not Cloudflare

2. **Google Search Console Inspection:**
   - Go to https://search.google.com/search-console
   - Use URL Inspection tool to test if Googlebot can access your pages

3. **Using curl to simulate Googlebot:**
   ```bash
   curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://zoeholidays.com
   ```
   Should return your HTML, not Cloudflare challenge

#### Step 8: Monitor Bot Traffic
1. Go to **Analytics** → **Traffic** → **Bots**
2. Monitor legitimate bot traffic (should see Googlebot, Bingbot, etc.)
3. Verify they're not being blocked

---

## Additional Cloudflare SEO Settings

### Enable "Always Online"
1. Go to **Caching** → **Configuration**
2. Enable **"Always Online"**
3. This ensures Google can cache your site even if your origin goes down

### Configure Page Rules for Better Caching
1. Go to **Rules** → **Page Rules**
2. Create rule for `zoeholidays.com/*`:
   - Cache Level: Standard
   - Browser Cache TTL: 4 hours
   - Edge Cache TTL: 2 hours

### Enable Rocket Loader (with caution)
1. Go to **Speed** → **Optimization**
2. Enable **"Rocket Loader"** (can improve load times)
3. **Important:** Test thoroughly as it can break some JavaScript

### Disable Email Obfuscation for Schema
1. Go to **Scrape Shield**
2. **Disable "Email Address Obfuscation"**
3. This prevents breaking structured data email fields

---

## Verification Checklist

After implementing all changes:

- [ ] PageSpeed Insights shows your website (not Cloudflare)
- [ ] Google Search Console can fetch your pages
- [ ] Bot Fight Mode is disabled or configured correctly
- [ ] Verified Bots are allowed
- [ ] Security Level is NOT "I'm Under Attack"
- [ ] Firewall rules allow search engine bots
- [ ] Test with: https://pagespeed.web.dev/
- [ ] Monitor bot traffic in Cloudflare Analytics

---

## Important Notes

1. **Changes take 5-10 minutes to propagate** - Wait before testing
2. **Keep monitoring for 24-48 hours** - Ensure no security issues arise
3. **Google may take 1-2 weeks** to fully re-crawl and update rankings
4. **Use Cloudflare Analytics** to monitor bot traffic and identify issues
5. **Don't disable all security** - Use smart rules instead

---

## Need Help?

If issues persist:
1. Check Cloudflare Firewall Events for blocked Googlebot requests
2. Review Security Events log for bot-related blocks
3. Contact Cloudflare Support with reference to "allowing search engine crawlers"
4. Verify your Strapi backend (dashboard.zoeholidays.com) is also accessible

---

## Expected Results After Fix

**Before:**
- SEO Score: 42
- PageSpeed shows: Cloudflare challenge page
- Google can't index properly

**After:**
- SEO Score: 80+ (after re-crawling)
- PageSpeed shows: Your actual website
- Google can properly index all pages
- Structured data is visible to search engines
