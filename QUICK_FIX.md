# 🚀 Quick Fix - Google Content Issue

## The Problem
Google can't see your tours because Strapi API token is invalid (401 errors).

## The Solution (5 minutes)

### Step 1: Get New Token
```
https://dashboard.zoeholidays.com/admin
→ Settings → API Tokens → Create new
→ Full access, Unlimited duration
→ COPY THE TOKEN!
```

### Step 2: Update .env
```bash
nano .env
# Line 3: Paste new token
# Ctrl+X, Y, Enter
```

### Step 3: Rebuild
```bash
rm -rf .next
npm run build
```

### Step 4: Deploy
```bash
git add .
git commit -m "fix: update API token"
git push
```

### Step 5: Request Google Re-index
- Google Search Console
- Request indexing for main pages
- Wait 3-7 days

## Automated Fix
```bash
./fix-google-content.sh
```
Follow the prompts!

---

**Result:** Google will show your actual tour programs instead of "No programs available"
