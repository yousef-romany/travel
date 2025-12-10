# PWA Install Prompt - User Guide

## 🎉 What's New

Your ZoeHoliday app now has a **beautiful install prompt** that appears to users, encouraging them to install the app on their device!

## ✨ Features

### 1. **Smart Detection**
- ✅ Automatically detects if the app is installable
- ✅ Detects iOS devices and shows custom instructions
- ✅ Only shows to users who haven't installed yet
- ✅ Respects user preferences (if dismissed, waits 7 days before showing again)

### 2. **Beautiful UI**
- 🎨 Modern card design with smooth animations
- 📱 Responsive (looks great on mobile and desktop)
- 🌙 Supports dark/light theme
- ✨ Framer Motion animations for smooth entrance/exit

### 3. **User Benefits Highlighted**
- ⚡ **Fast Access** - One tap to open
- 📶 **Works Offline** - Browse tours even without internet
- 🔔 **Get Updates** - Receive notifications about new tours

### 4. **Cross-Platform Support**
- 🤖 **Android/Chrome**: Native install prompt with one-click installation
- 🍎 **iOS/Safari**: Custom instructions modal showing how to "Add to Home Screen"
- 💻 **Desktop**: Chrome, Edge, and other modern browsers

## 🧪 Testing the Install Prompt

### Testing on Desktop (Chrome/Edge)

1. **Build and start the app:**
   ```bash
   npm run build
   npm start
   ```

2. **Open Chrome DevTools:**
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to **Application** tab
   - In the left sidebar, click **Manifest**
   - Verify the manifest is loaded correctly

3. **Test the install prompt:**
   - Wait 5 seconds after page load
   - You should see the install prompt appear in the bottom-right corner
   - Click "Install App" to test installation
   - Or click "Not Now" to test dismissal

4. **Manually trigger install (for testing):**
   - In DevTools, go to **Application** > **Service Workers**
   - Check "Update on reload"
   - Look for the install icon in the address bar (⊕ symbol)

### Testing on Android

1. **Deploy to production or use ngrok:**
   ```bash
   # Option 1: Deploy to Vercel/production
   npm run build
   vercel --prod

   # Option 2: Use ngrok for local testing
   npm start
   ngrok http 3000
   ```

2. **Open the URL in Chrome on Android**

3. **Expected behavior:**
   - After 5 seconds, the beautiful install prompt appears
   - Tap "Install App"
   - Native Android install dialog appears
   - App installs to home screen

4. **Verify installation:**
   - Find the app icon on your home screen
   - Open it - should open in standalone mode (no browser UI)
   - Check that it works offline (turn off wifi/data)

### Testing on iOS (iPhone/iPad)

1. **Open Safari on iOS** (must be Safari, not Chrome)

2. **Navigate to your site**

3. **Expected behavior:**
   - After 5 seconds, the install prompt appears
   - Tap "How to Install"
   - Beautiful instructions modal appears showing:
     1. Tap Share button (⎙)
     2. Tap "Add to Home Screen"
     3. Tap "Add"

4. **Follow the instructions to install**

5. **Verify installation:**
   - Find ZoeHoliday icon on home screen
   - Open it - should open as standalone app
   - No Safari UI visible

## 📱 Prompt Behavior

### When the prompt appears:
- ✅ **5 seconds** after initial page load (for better UX)
- ✅ Only if the app is **not already installed**
- ✅ Only if the user **hasn't dismissed it in the last 7 days**
- ✅ Only if the browser **supports PWA installation**

### When dismissed:
- 📅 Won't appear again for **7 days**
- 💾 Preference saved in `localStorage`
- 🔄 Resets after 7 days automatically

### Already installed:
- ✅ Prompt never appears
- ✅ Detects standalone display mode
- ✅ Clean user experience

## 🎨 UI Components

### Install Prompt Card
```
┌─────────────────────────────────────┐
│  [📱 Icon]  Install ZoeHoliday   [×]│
│             Get instant access...    │
├─────────────────────────────────────┤
│  [⚡]      [📶]      [🔔]           │
│  Fast    Offline  Updates           │
├─────────────────────────────────────┤
│  [📥 Install App]  [Not Now]       │
│  Free • No download • 2 seconds    │
└─────────────────────────────────────┘
```

### iOS Instructions Modal (iOS only)
```
┌─────────────────────────────────────┐
│  Install on iOS                  [×]│
├─────────────────────────────────────┤
│  To install on your iOS device:     │
│                                      │
│  [1] Tap Share button ⎙             │
│  [2] Tap "Add to Home Screen" ➕    │
│  [3] Tap "Add"                      │
├─────────────────────────────────────┤
│           [Got it!]                 │
└─────────────────────────────────────┘
```

## 🔧 Configuration

### Delay before showing prompt:
```typescript
// In InstallPrompt.tsx, line ~45
setTimeout(() => {
  setShowPrompt(true);
}, 5000); // 5 seconds - change as needed
```

### Days before re-showing after dismissal:
```typescript
// In InstallPrompt.tsx, line ~30
if (daysSinceDismissed < 7) { // 7 days - change as needed
  return;
}
```

### Position:
```typescript
// In InstallPrompt.tsx, line ~134
className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md"
// Change position as needed: top-4, left-4, center, etc.
```

## 📊 Analytics Integration (Optional)

Want to track install prompt interactions? Add this:

```typescript
// In handleInstall function
import { trackButtonClick } from "@/lib/analytics";

const handleInstall = async () => {
  trackButtonClick("PWA Install", "Install Prompt", "install");
  // ... rest of code
};

const handleDismiss = () => {
  trackButtonClick("PWA Dismiss", "Install Prompt", "dismiss");
  // ... rest of code
};
```

## 🐛 Troubleshooting

### Prompt not appearing?

1. **Check if already installed:**
   - Open DevTools > Application > Storage
   - Look for display-mode: standalone

2. **Check localStorage:**
   - Open DevTools > Application > Local Storage
   - Look for `pwa-prompt-dismissed`
   - Delete it to reset the 7-day timer

3. **Check service worker:**
   - DevTools > Application > Service Workers
   - Ensure service worker is active
   - Try "Unregister" then reload

4. **Check manifest:**
   - DevTools > Application > Manifest
   - Verify all fields are present
   - Check for errors in console

5. **HTTPS required:**
   - PWAs require HTTPS (or localhost)
   - Won't work on plain HTTP

### iOS not working?

1. **Must use Safari** (not Chrome)
2. **Must be HTTPS** (or localhost won't work on device)
3. **Check manifest display mode** (must be "standalone")
4. **iOS 11.3+** required

### Android not working?

1. **Chrome 76+** required
2. **Must meet PWA criteria:**
   - HTTPS
   - Service worker registered
   - Manifest with icons
   - Meets engagement heuristics

## 🚀 Production Checklist

Before deploying to production:

- [ ] Test on Chrome desktop
- [ ] Test on Android Chrome
- [ ] Test on iOS Safari
- [ ] Verify manifest.json loads correctly
- [ ] Verify service worker is active
- [ ] Test offline functionality
- [ ] Verify icons display correctly
- [ ] Test "Not Now" dismissal (check 7-day behavior)
- [ ] Test "Install" flow completely
- [ ] Verify app opens in standalone mode after install
- [ ] Check analytics tracking (if added)

## 📸 Screenshots

To enhance the PWA experience, add screenshots to your manifest:

1. **Create screenshots:**
   - Desktop: 1280x720px
   - Mobile: 750x1334px

2. **Save to:** `/public/screenshots/`
   - `desktop-1.png`
   - `mobile-1.png`

3. **Already configured in manifest.json!** ✅

## 🎯 User Experience Tips

1. **Timing is key**: 5 seconds gives users time to explore before prompting
2. **Respect dismissal**: 7 days is a good balance between persistence and annoyance
3. **Clear benefits**: The 3 benefit icons quickly communicate value
4. **One-click action**: "Install App" is clear and direct
5. **Easy dismissal**: "Not Now" respects user choice

## 🔮 Future Enhancements

Consider adding:
- [ ] A/B testing different prompt timings
- [ ] Custom triggers (e.g., after viewing 3 programs)
- [ ] Gamification (e.g., "Install to earn 100 loyalty points!")
- [ ] Push notification permission request after install
- [ ] Share prompt after install ("Share ZoeHoliday with friends!")

---

**Component Location:** `components/pwa/InstallPrompt.tsx`
**Added to:** `app/layout.tsx`
**Build Status:** ✅ Successful
**Ready for Production:** ✅ Yes
