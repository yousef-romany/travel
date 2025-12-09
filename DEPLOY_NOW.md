# 🎯 Step-by-Step Deployment Guide

## Quick Start - Deploy in 10 Minutes!

### Option 1: Use the Deployment Script (Easiest!)

```bash
cd /home/yousefx00/Documents/Programing\ Projects/ZoeHolidays/travel

# Run the deployment helper
./deploy.sh
```

**Choose option 5** for complete deployment with all checks!

---

### Option 2: Manual Deployment

Follow these steps:

#### Step 1: Test Locally (2 minutes)

```bash
npm run dev
```

- Open https://zoeholidays.com
- Check homepage loads
- Test navigation
- Verify no console errors

Press `Ctrl+C` to stop

---

#### Step 2: Build for Production (2 minutes)

```bash
npm run build
```

**Expected output**:
```
✓ Compiled successfully
✓ Generating static pages
✓ Finalizing page optimization
```

**If build fails**: Check for TypeScript errors

---

#### Step 3: Test Production Build (2 minutes)

```bash
npm run start
```

- Open https://zoeholidays.com
- Test everything again
- Should be faster than dev mode

Press `Ctrl+C` to stop

---

#### Step 4: Deploy to Vercel (4 minutes)

```bash
# Install Vercel CLI (first time only)
npm install -g vercel

# Deploy
vercel --prod
```

**Follow the prompts**:
1. "Set up and deploy?" → **Yes**
2. "Which scope?" → Select your account
3. "Link to existing project?" → **No** (first time)
4. "What's your project's name?" → **zoeholidays** (or your choice)
5. "In which directory is your code located?" → **./** (press Enter)

**Wait for deployment** (~2-3 minutes)

---

## ✅ Post-Deployment Checklist

After deployment, Vercel will give you a URL like:
`https://zoeholidays-xxx.vercel.app`

### Test Your Live Site:

1. **Homepage**
   - [ ] Loads correctly
   - [ ] Images display
   - [ ] Navigation works

2. **All Pages**
   - [ ] Programs page
   - [ ] Places to go
   - [ ] Inspiration
   - [ ] Plan your trip

3. **Features**
   - [ ] Login/Register
   - [ ] Bookings
   - [ ] Reviews
   - [ ] Background audio

4. **Performance**
   - [ ] Run Lighthouse audit
   - [ ] Check scores (should be 85+)

---

## 🔧 Configure Custom Domain (Optional)

### In Vercel Dashboard:

1. Go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `zoeholidays.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

---

## 📊 Monitor Your Site

### Vercel Dashboard Shows:

- **Deployments**: All your deployments
- **Analytics**: Page views, performance
- **Logs**: Error logs and function logs
- **Environment Variables**: Manage secrets

---

## 🐛 Troubleshooting

### Issue: Build fails on Vercel

**Solution**:
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Try building locally first

### Issue: Environment variables not working

**Solution**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_STRAPI_URL`
   - `NEXT_PUBLIC_STRAPI_TOKEN`
   - `NEXT_PUBLIC_INSTAGRAM_TOKEN`
   - etc.
3. Redeploy

### Issue: API calls fail

**Solution**:
1. Check CORS settings in Strapi
2. Verify `NEXT_PUBLIC_STRAPI_URL` is correct
3. Check Strapi is accessible from internet

### Issue: Images don't load

**Solution**:
1. Verify Strapi URL in environment variables
2. Check image domains in `next.config.ts`
3. Ensure Strapi media is publicly accessible

---

## 🔄 Update Your Site

When you make changes:

```bash
# 1. Test locally
npm run dev

# 2. Build and test
npm run build
npm run start

# 3. Deploy
vercel --prod
```

Or use the script:
```bash
./deploy.sh
# Choose option 5
```

---

## 📈 Performance Monitoring

### Check Lighthouse Scores:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit on your live site
lighthouse https://your-site.vercel.app --view
```

**Target Scores**:
- Performance: 85+ (Mobile), 90+ (Desktop)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 🎉 Success!

Your site is now live! 🚀

**Next Steps**:
1. Share the URL with stakeholders
2. Monitor analytics
3. Collect user feedback
4. Plan future enhancements

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Your Docs**: 
  - `TESTING.md` - Testing checklist
  - `DEPLOYMENT.md` - Detailed deployment guide
  - `PERFORMANCE.md` - Optimization tips

---

## 🆘 Need Help?

1. Check Vercel deployment logs
2. Review `TESTING.md` checklist
3. Check browser console for errors
4. Review Strapi backend logs

---

**Happy Deploying!** 🎊
