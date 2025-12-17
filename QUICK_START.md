# ⚡ QUICK START - Fix Google Content Issue

## 🎯 The Problem
Your website shows "No programs available" because **Strapi API token is invalid (401 errors)**.

## ✅ The Solution (10 minutes)

### 1. Get New Token (5 min)
1. Go to: **https://dashboard.zoeholidays.com/admin**
2. Settings → API Tokens → Create new
3. Type: **Full access**, Duration: **Unlimited**
4. Save and **COPY THE TOKEN** (shown only once!)

### 2. Update .env (1 min)
```bash
nano .env
```

Replace line 3 with your new token:
```
NEXT_PUBLIC_STRAPI_TOKEN=YOUR_NEW_TOKEN_HERE
```

Save: `Ctrl+X`, `Y`, `Enter`

### 3. Verify (1 min)
```bash
node scripts/verify-token.js
```

Must show: `✅ SUCCESS: All API endpoints accessible!`

### 4. Rebuild (3 min)
```bash
rm -rf .next
npm run build
```

Watch for: NO "401" or "Error fetching..." messages

### 5. Deploy
Push to production however you normally deploy.

### 6. Request Google Re-index
- Go to: **https://search.google.com/search-console**
- URL Inspection → Enter: `https://zoeholidays.com`
- Click: **Request Indexing**

## ⏱️ Results
- **Today:** Site has content
- **3-7 days:** Google re-crawls
- **1-2 weeks:** See improved search results

## 🆘 If Stuck
Read: **COMPLETE_FIX_GUIDE.md** for detailed instructions

## ✅ Success = No More 401 Errors!
```bash
# All these should work:
node scripts/verify-token.js          # ✅ All green
node scripts/check-strapi-content.js   # ✅ Shows item counts
npm run build                          # ✅ No errors
```

That's it! 🎉
