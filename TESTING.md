# Pre-Deployment Testing Checklist

## 🧪 Complete Testing Guide

Use this checklist to verify everything works before deploying to production.

---

## ✅ Phase 1: Local Development Testing

### 1.1 Start Development Server

```bash
cd /home/yousefx00/Documents/Programing\ Projects/ZoeHolidays/travel
npm run dev
```

**Expected**: Server starts on https://zoeholidays.com

---

### 1.2 Homepage Tests

- [ ] Homepage loads without errors
- [ ] Hero video plays correctly
- [ ] Navigation menu works
- [ ] All sections visible (Be Inspired, Places to Go, Programs, etc.)
- [ ] Images load properly
- [ ] Background audio controls appear
- [ ] Background audio plays/pauses correctly
- [ ] Scroll animations work
- [ ] Dark mode toggle works
- [ ] Mobile menu works (resize browser)

**Check Console**: Should have ZERO errors ✅

---

### 1.3 Navigation Tests

Test all main navigation links:

- [ ] **Be Inspired** → `/inspiration`
  - Categories load
  - Blog posts display
  - Images load
  - Links work

- [ ] **Places To Go** → `/placesTogo`
  - Categories display
  - Destination cards load
  - Images load
  - Navigation works

- [ ] **Plan Your Trip** → `/plan-your-trip`
  - Custom trip planner loads
  - Form works
  - Can create trip (if logged in)

- [ ] **Programs** → `/programs`
  - All programs display
  - Images load
  - Filters work (if implemented)
  - Program details page works

- [ ] **Events** → `/events`
  - Events display
  - Details load

---

### 1.4 User Authentication Tests

- [ ] Login page loads → `/login`
- [ ] Registration page loads → `/register`
- [ ] Can create account
- [ ] Can login
- [ ] User dashboard loads → `/dashboard`
- [ ] Profile page works
- [ ] Can logout

---

### 1.5 Booking System Tests

- [ ] Can view program details
- [ ] Booking form appears
- [ ] Can fill booking form
- [ ] Form validation works
- [ ] Can submit booking (test mode)
- [ ] Booking confirmation appears
- [ ] Booking appears in user dashboard

---

### 1.6 Review System Tests

- [ ] Reviews display on programs
- [ ] Can write a review (when logged in)
- [ ] Review form validation works
- [ ] Can submit review
- [ ] Review appears after submission
- [ ] Can edit own review
- [ ] "Was this helpful?" voting works
- [ ] Vote counts update correctly

---

### 1.7 API Connection Tests

Open browser console and check:

- [ ] No 400 errors (Bad Request)
- [ ] No 403 errors (Forbidden)
- [ ] No 404 errors (Not Found)
- [ ] No 500 errors (Server Error)
- [ ] All API calls succeed
- [ ] Images load from Strapi
- [ ] Instagram posts load

**Network Tab**: All requests should be 200 OK ✅

---

### 1.8 Performance Tests

#### Run Lighthouse Audit (Development)

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Click "Analyze page load"

**Expected Scores (Development)**:
- Performance: 70+ (lower in dev is normal)
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

---

## ✅ Phase 2: Production Build Testing

### 2.1 Build the Application

```bash
npm run build
```

**Expected Output**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Check for**:
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] No warnings (or only minor ones)
- [ ] Build completes successfully

---

### 2.2 Test Production Build Locally

```bash
npm run start
```

**Server starts on**: https://zoeholidays.com

**Test Everything Again**:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] All pages accessible
- [ ] No console errors
- [ ] Images load
- [ ] API calls work

---

### 2.3 Production Lighthouse Audit

Run Lighthouse on production build:

**Expected Scores (Production)**:
- Performance: 85+ (Mobile), 90+ (Desktop)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**If scores are lower**:
- Check PERFORMANCE.md for optimization tips
- Verify caching headers
- Check image optimization

---

## ✅ Phase 3: Environment Configuration

### 3.1 Environment Variables Check

```bash
# Check if .env.local exists
ls -la .env.local

# Verify required variables
cat .env.local
```

**Required Variables**:
- [ ] `NEXT_PUBLIC_STRAPI_URL` - Set correctly
- [ ] `NEXT_PUBLIC_STRAPI_TOKEN` - Valid token
- [ ] `NEXT_PUBLIC_INSTAGRAM_TOKEN` - Valid token
- [ ] Other variables as needed

---

### 3.2 Production Environment Setup

Create `.env.production`:

```bash
cp env.production.template .env.production
nano .env.production
```

**Update with production values**:
- [ ] Production Strapi URL (HTTPS)
- [ ] Production API tokens
- [ ] Production domain
- [ ] Analytics IDs

---

## ✅ Phase 4: Security Verification

### 4.1 Check Security Headers (Local)

```bash
# Start production build
npm run start

# In another terminal, check headers
curl -I https://zoeholidays.com
```

**Should see**:
- [ ] `Strict-Transport-Security`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Content-Security-Policy`
- [ ] Other security headers

---

### 4.2 Verify HTTPS Configuration

**For Production**:
- [ ] Domain has valid SSL certificate
- [ ] HTTPS redirects work
- [ ] No mixed content warnings
- [ ] Security headers present

---

## ✅ Phase 5: Mobile Testing

### 5.1 Responsive Design

Test on different screen sizes:

**Chrome DevTools** (F12 → Toggle Device Toolbar):
- [ ] Mobile (375px) - iPhone SE
- [ ] Tablet (768px) - iPad
- [ ] Desktop (1440px) - Laptop

**Check**:
- [ ] Layout adapts correctly
- [ ] Images resize properly
- [ ] Text is readable
- [ ] Buttons are clickable (48px minimum)
- [ ] Navigation menu works
- [ ] No horizontal scroll

---

### 5.2 Touch Interactions

- [ ] Buttons are easy to tap
- [ ] Links are easy to tap
- [ ] Forms work on mobile
- [ ] Swipe gestures work (if implemented)

---

## ✅ Phase 6: Browser Compatibility

Test on different browsers:

- [ ] **Chrome** (Latest)
- [ ] **Firefox** (Latest)
- [ ] **Safari** (Latest)
- [ ] **Edge** (Latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

**Check**:
- [ ] All features work
- [ ] Styling is consistent
- [ ] No JavaScript errors
- [ ] Performance is good

---

## ✅ Phase 7: Accessibility Testing

### 7.1 Keyboard Navigation

- [ ] Can navigate with Tab key
- [ ] Can activate buttons with Enter/Space
- [ ] Focus indicators visible
- [ ] Skip to content link works
- [ ] No keyboard traps

---

### 7.2 Screen Reader Testing

**Optional but recommended**:
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All images have alt text
- [ ] Form labels are announced
- [ ] Buttons have clear labels
- [ ] Page structure makes sense

---

## ✅ Phase 8: Final Checks

### 8.1 Code Quality

```bash
# Run linter
npm run lint
```

**Expected**: No errors (warnings are okay)

---

### 8.2 Git Status

```bash
git status
```

**Check**:
- [ ] All changes committed
- [ ] No sensitive data in commits
- [ ] .env files in .gitignore
- [ ] Clean working directory

---

### 8.3 Documentation Review

- [ ] README.md updated
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented

---

## ✅ Phase 9: Deployment Readiness

### 9.1 Pre-Deployment Checklist

- [ ] All tests passed
- [ ] Production build successful
- [ ] Environment variables ready
- [ ] Domain configured
- [ ] SSL certificate ready
- [ ] Backup created (if updating existing site)
- [ ] Rollback plan ready

---

### 9.2 Choose Deployment Platform

**Recommended**: Vercel (easiest for Next.js)

**Alternatives**:
- Netlify
- AWS Amplify
- Docker + VPS
- Railway
- Render

---

## 🚀 Ready to Deploy?

If all checkboxes are ✅, you're ready!

**Next Steps**:
1. Follow DEPLOYMENT.md for platform-specific instructions
2. Deploy to production
3. Run post-deployment tests
4. Monitor for errors

---

## 🐛 Common Issues

### Issue: Build fails
**Solution**: Check TypeScript errors, run `npm install`

### Issue: API calls fail
**Solution**: Verify environment variables, check CORS

### Issue: Images don't load
**Solution**: Check Strapi URL, verify image domains in next.config.ts

### Issue: Performance is low
**Solution**: Check PERFORMANCE.md, verify caching headers

---

## 📊 Success Criteria

✅ **All tests passed**
✅ **No console errors**
✅ **Lighthouse scores meet targets**
✅ **All features work**
✅ **Mobile responsive**
✅ **Security headers present**

---

**Testing Date**: _____________
**Tested By**: _____________
**Status**: ⬜ Ready for Production / ⬜ Needs Fixes

---

**Next**: See DEPLOYMENT.md for deployment instructions!
