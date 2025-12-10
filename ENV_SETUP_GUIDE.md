# Environment Variables Setup Guide

**Quick Start**: `npm run env:setup` → Edit `.env` → `npm run env:check`

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create .env File

```bash
# Option 1: Automated setup
npm run env:setup

# Option 2: Manual setup
cp .env.example .env
```

### Step 2: Get Your API Keys

Open `.env` in your editor and replace the placeholder values:

#### Required Variables:

| Variable | Get From | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_STRAPI_TOKEN` | Strapi Dashboard → Settings → API Tokens | `abc123def456...` |
| `NEXT_PUBLIC_INSTAGRAM_TOKEN` | Facebook Developers → Your App | `IGAABcd123...` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp Business Number | `201000000000` |

#### Optional Variables:

| Variable | Get From | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics → Data Streams | `G-ABC123DEF4` |
| `CLOUDFLARE_ZONE_ID` | Cloudflare Dashboard → Overview | `1234567890abc...` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → API Tokens | `abc123def456...` |

### Step 3: Validate Configuration

```bash
# Check all environment variables
npm run env:check

# Check only Cloudflare variables
npm run env:check:cloudflare
```

You should see:
```
✅ All required variables are set
✅ Environment validation PASSED! ✨
```

---

## 📋 Detailed Instructions

### 1. Strapi Configuration

**Variables Needed:**
- `NEXT_PUBLIC_STRAPI_URL`
- `STRAPI_HOST`
- `NEXT_PUBLIC_STRAPI_TOKEN`

**How to Get Strapi Token:**

1. Login to your Strapi Dashboard: https://dashboard.zoeholidays.com
2. Go to **Settings** → **API Tokens**
3. Click **Create new API Token**
4. Configure:
   - **Name**: `ZoeHolidays Frontend`
   - **Token type**: `Read-only` or `Full access`
   - **Token duration**: `Unlimited`
5. Click **Save**
6. **Copy the token immediately** (you won't see it again!)
7. Paste into `.env`:
   ```bash
   NEXT_PUBLIC_STRAPI_TOKEN=your_actual_token_here
   ```

**Required Permissions:**
- Find
- FindOne
- (All content types you want to access)

---

### 2. Instagram Integration

**Variable Needed:**
- `NEXT_PUBLIC_INSTAGRAM_TOKEN`

**How to Get Instagram Token:**

1. Go to **Facebook Developers**: https://developers.facebook.com/apps
2. Select your app (or create a new one)
3. Add **Instagram Graph API** product
4. Go to **Instagram → Basic Display**
5. Generate an **Access Token**
6. Copy the token and paste into `.env`:
   ```bash
   NEXT_PUBLIC_INSTAGRAM_TOKEN=IGAAB...your_token_here
   ```

**Required Permissions:**
- `instagram_basic`
- `instagram_manage_insights`

**Token Duration:**
- Instagram tokens expire after 60 days
- Set a reminder to refresh your token monthly
- See Instagram documentation for long-lived tokens

---

### 3. WhatsApp Number

**Variable Needed:**
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

**Format:**
- **Country code + number** (no + or spaces)
- Example: `201000000000` (Egypt)
- Example: `14155551234` (USA)

**How to Use:**
1. Get your WhatsApp Business number
2. Remove all spaces and special characters
3. Add country code without the + sign
4. Paste into `.env`:
   ```bash
   NEXT_PUBLIC_WHATSAPP_NUMBER=201000000000
   ```

---

### 4. Google Analytics (Optional)

**Variable Needed:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**How to Get GA4 Measurement ID:**

1. Go to **Google Analytics**: https://analytics.google.com/
2. Select your property
3. Click **Admin** (gear icon)
4. Under **Property**, click **Data Streams**
5. Click on your web stream
6. Copy the **Measurement ID** (starts with `G-`)
7. Paste into `.env`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ABC123DEF4
   ```

**Setup GA4:**
- Enable Enhanced Measurement
- Set up conversion events
- Configure audience demographics

---

### 5. Cloudflare Integration (Optional but Recommended)

**Variables Needed:**
- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID` (optional)

**Prerequisites:**
1. Have a Cloudflare account
2. Your domain added to Cloudflare
3. DNS configured properly

**How to Get Zone ID:**

1. Login to **Cloudflare Dashboard**: https://dash.cloudflare.com
2. Click on your domain
3. Scroll to **API** section in the right sidebar
4. Copy the **Zone ID**
5. Paste into `.env`:
   ```bash
   CLOUDFLARE_ZONE_ID=1234567890abcdef1234567890abcdef
   ```

**How to Get API Token:**

1. In Cloudflare Dashboard, click your profile icon
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use template: **Edit zone DNS** or create custom:
   - **Permissions**:
     - Zone → Cache Purge → Purge
     - Zone → Zone → Read
   - **Zone Resources**:
     - Include → Specific zone → `zoeholidays.com`
5. Create token and **copy it immediately**
6. Paste into `.env`:
   ```bash
   CLOUDFLARE_API_TOKEN=abcdef1234567890_abcdef1234567890
   ```

**How to Get Account ID (Optional):**

1. In Cloudflare Dashboard
2. Click on your domain
3. Look in the right sidebar under **API**
4. Copy **Account ID**
5. Paste into `.env`:
   ```bash
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```

**Note:** If you set up Cloudflare, **both** `ZONE_ID` and `API_TOKEN` are required.

---

## 🔧 Environment Variable Commands

### Setup Commands

```bash
# Create .env from template
npm run env:setup

# Check all variables
npm run env:check

# Check only Cloudflare variables
npm run env:check:cloudflare
```

### Validation Output

**Success:**
```
✅ .env file found
✅ NEXT_PUBLIC_STRAPI_URL
✅ NEXT_PUBLIC_STRAPI_TOKEN
✅ NEXT_PUBLIC_INSTAGRAM_TOKEN
✅ NEXT_PUBLIC_WHATSAPP_NUMBER
✅ Environment validation PASSED! ✨
```

**Error:**
```
❌ NEXT_PUBLIC_STRAPI_TOKEN - MISSING!
  Description: Strapi API token
  Example: your_strapi_api_token_here
  Get from: Strapi Dashboard → Settings → API Tokens → Create Token
```

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Use `.env` for local development**
   ```bash
   # .env is gitignored automatically
   ```

2. **Use different values for dev and production**
   ```bash
   # Development .env
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

   # Production (set in hosting platform)
   NEXT_PUBLIC_STRAPI_URL=https://dashboard.zoeholidays.com
   ```

3. **Rotate API keys regularly**
   - Set calendar reminder every 3-6 months
   - Rotate immediately if compromised

4. **Use hosting platform secrets for production**
   - **Vercel**: Settings → Environment Variables
   - **Netlify**: Site settings → Environment variables
   - **AWS**: Secrets Manager or Parameter Store

5. **Validate before deployment**
   ```bash
   npm run env:check
   npm run build:safe
   ```

### ❌ DON'T:

1. **Never commit `.env` to git**
   ```bash
   # Already in .gitignore, but double-check:
   cat .gitignore | grep .env
   ```

2. **Never hardcode secrets in code**
   ```javascript
   // ❌ BAD
   const apiKey = "abc123def456";

   // ✅ GOOD
   const apiKey = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
   ```

3. **Never share `.env` files via email/Slack**
   - Use secure password managers (1Password, LastPass)
   - Or encrypted messaging (Signal)

4. **Never log environment variables**
   ```javascript
   // ❌ BAD
   console.log(process.env.NEXT_PUBLIC_STRAPI_TOKEN);

   // ✅ GOOD
   console.log("Strapi token exists:", !!process.env.NEXT_PUBLIC_STRAPI_TOKEN);
   ```

5. **Never use the same keys across environments**
   - Dev keys for development
   - Staging keys for staging
   - Prod keys for production

---

## 🐛 Troubleshooting

### Problem: "Missing required environment variable"

**Solution:**
1. Check if `.env` file exists
2. Verify the variable name is correct (exact match)
3. Ensure no extra spaces around `=`
4. Restart your dev server after changing `.env`

```bash
# Check if .env exists
ls -la .env

# Restart dev server
# Press Ctrl+C, then:
npm run dev
```

### Problem: "Cloudflare configuration incomplete"

**Solution:**
Both `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` are required.

```bash
# Option 1: Set both
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_API_TOKEN=your_token

# Option 2: Remove both (if not using Cloudflare)
# Just comment them out or delete the lines
```

### Problem: "Cannot read environment variable in browser"

**Solution:**
Only variables starting with `NEXT_PUBLIC_` are available in the browser.

```bash
# ✅ Available in browser
NEXT_PUBLIC_STRAPI_URL=...

# ❌ NOT available in browser (server-only)
STRAPI_ADMIN_KEY=...
```

### Problem: "Changes to .env not reflected"

**Solution:**
1. Restart your dev server
2. Clear Next.js cache

```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

### Problem: "Token expired" (Instagram)

**Solution:**
Instagram tokens expire after 60 days. Regenerate:

1. Go to Facebook Developers
2. Generate new token
3. Update `.env`
4. Restart server

---

## 📚 Additional Resources

### Official Documentation
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables
- **Strapi API Tokens**: https://docs.strapi.io/dev-docs/configurations/api-tokens
- **Instagram Graph API**: https://developers.facebook.com/docs/instagram-basic-display-api
- **Cloudflare API**: https://developers.cloudflare.com/api/

### Project Documentation
- **SECURITY.md** - Complete security guide
- **CLOUDFLARE_SETUP.md** - Cloudflare setup instructions
- **README_SECURITY_UPDATE.md** - Security overview

### Support
- **Environment Issues**: Run `npm run env:check`
- **Cloudflare Issues**: See `CLOUDFLARE_SETUP.md`
- **Security Issues**: See `SECURITY.md`

---

## ✅ Checklist

Use this to verify your setup:

### Initial Setup
- [ ] Created `.env` file from `.env.example`
- [ ] Set `NEXT_PUBLIC_STRAPI_URL`
- [ ] Set `STRAPI_HOST`
- [ ] Set `NEXT_PUBLIC_STRAPI_TOKEN`
- [ ] Set `NEXT_PUBLIC_INSTAGRAM_TOKEN`
- [ ] Set `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] Ran `npm run env:check` - passed ✅

### Optional Setup
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Google Analytics)
- [ ] Set `CLOUDFLARE_ZONE_ID` (if using Cloudflare)
- [ ] Set `CLOUDFLARE_API_TOKEN` (if using Cloudflare)
- [ ] Ran `npm run env:check:cloudflare` - passed ✅

### Verification
- [ ] Dev server starts without errors
- [ ] Can connect to Strapi backend
- [ ] Instagram feed loads (if configured)
- [ ] WhatsApp links work
- [ ] Analytics tracking works (if configured)
- [ ] Cloudflare cache purge works (if configured)

### Security
- [ ] `.env` is in `.gitignore`
- [ ] `.env` is NOT committed to git
- [ ] Using different keys for dev/prod
- [ ] Documented where to find keys (password manager)

---

**Next Steps:**
1. Complete the checklist above
2. Test your application: `npm run dev`
3. Set up Cloudflare (optional): See `CLOUDFLARE_SETUP.md`
4. Deploy to production with confidence!

**Need Help?** Run `npm run env:check` for detailed validation and error messages.
