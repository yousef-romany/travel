# PWA Installation Guide

ZoeHoliday is now a Progressive Web App (PWA)! Users can install it on their devices for a native app-like experience.

## ✅ What's Implemented

1. **Manifest.json** - PWA configuration file with app metadata
2. **App Icons** - 8 different sizes (72x72 to 512x512) for all devices
3. **PWA Metadata** - Apple-specific and general PWA meta tags
4. **Auto-playing Audio** - Background music with mute control
5. **Theme Colors** - Branded theme color (#d4af37 - gold)
6. **App Shortcuts** - Quick access to Programs, Places, and Events

## 📱 How Users Can Install

### On iOS (iPhone/iPad)

1. Open Safari browser (PWA installation only works in Safari on iOS)
2. Navigate to your website (e.g., https://zoeholiday.com)
3. Tap the **Share** button (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Edit the name if desired
6. Tap **"Add"**
7. The app icon will appear on the home screen

**iOS Features:**
- Full-screen experience (no browser UI)
- Splash screen with your logo
- Offline capability (with service worker)
- Push notifications (if implemented)

### On Android (Chrome)

1. Open Chrome browser
2. Navigate to your website
3. Chrome will automatically show an **"Install app"** banner
4. Tap **"Install"**
5. Or manually: Tap the menu (three dots) → **"Install app"** or **"Add to Home Screen"**
6. Confirm installation

**Android Features:**
- Native-like experience
- App appears in app drawer
- Task switcher integration
- Shortcuts menu (long-press app icon)

### On Desktop (Chrome/Edge)

1. Visit the website in Chrome or Edge
2. Look for the install icon in the address bar (⊕ or computer icon)
3. Click it and select **"Install"**
4. Or: Menu → **"Install ZoeHoliday..."**
5. The app will open in its own window

**Desktop Features:**
- Standalone window (no browser chrome)
- Taskbar/Dock integration
- Native window controls
- Offline support

## 🎵 Background Audio Feature

The app now includes immersive background music that:
- **Auto-plays** on app load (may require user interaction due to browser policies)
- Shows a **floating mute/unmute button** (bottom-right corner)
- **Loops continuously** for ambient experience
- **Respects user preference** - mute state is remembered

### Browser Autoplay Policies

Modern browsers restrict autoplay:
- **Desktop**: Usually allows autoplay with muted or low volume
- **Mobile**: Requires user interaction (tap/click) before audio can play
- **Solution**: Audio will auto-play after first user interaction

## 🔧 Technical Details

### Files Created/Modified

```
public/
  manifest.json                    # PWA manifest configuration
  icons/                           # All app icons (8 sizes)
    icon-72x72.png
    icon-96x96.png
    icon-128x128.png
    icon-144x144.png
    icon-152x152.png
    icon-192x192.png
    icon-384x384.png
    icon-512x512.png
  audio/
    videoplayback.mp3              # Background music file

components/
  BackgroundAudio.tsx              # Audio player component

app/
  layout.tsx                       # Updated with PWA meta tags

scripts/
  generate-icons.js                # Icon generation script
```

### PWA Features Checklist

- ✅ Web App Manifest
- ✅ Service Worker Ready (needs implementation for offline)
- ✅ HTTPS Required (for production)
- ✅ Responsive Design
- ✅ App Icons (all sizes)
- ✅ Theme Colors
- ✅ Splash Screens (iOS)
- ✅ Standalone Display Mode
- ✅ App Shortcuts

## 🚀 Next Steps for Full PWA

### 1. Implement Service Worker (Optional)

Create `/public/sw.js` for offline functionality:

```javascript
// Basic service worker for offline caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zoeholiday-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/programs',
        '/placesTogo',
        '/events',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

Then register it in `app/layout.tsx`:

```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

### 2. Test PWA Compliance

Use these tools to test:
- **Lighthouse** (Chrome DevTools) - PWA audit
- **PWA Builder** (https://www.pwabuilder.com/)
- **Chrome DevTools** → Application tab → Manifest

### 3. Deploy with HTTPS

PWAs require HTTPS in production:
- Most hosting platforms (Vercel, Netlify) provide HTTPS automatically
- Let's Encrypt for custom servers

### 4. Test Installation

Test on multiple devices:
- iOS Safari (iPhone/iPad)
- Android Chrome
- Desktop Chrome/Edge
- Test audio autoplay on each

## 📊 PWA Benefits

### For Users
- **Faster loading** - Cached assets
- **Offline access** - Continue browsing without internet
- **Native experience** - Full screen, no browser UI
- **Easy access** - App icon on home screen
- **Less data usage** - Cached content

### For Business
- **Higher engagement** - Native app experience
- **Better retention** - Easy to re-engage users
- **Increased conversions** - Faster, smoother UX
- **Push notifications** - Direct communication (when implemented)
- **SEO benefits** - Google favors PWAs

## 🎨 Customization

### Change Audio File

Replace `/public/audio/videoplayback.mp3` with your preferred audio:
```bash
cp your-audio-file.mp3 public/audio/videoplayback.mp3
```

### Regenerate Icons

If you change the logo:
```bash
npm run generate-icons
# or
node scripts/generate-icons.js
```

### Update Theme Color

Edit `public/manifest.json`:
```json
{
  "theme_color": "#your-color-here",
  "background_color": "#your-bg-color-here"
}
```

And update in `app/layout.tsx`:
```typescript
<meta name="theme-color" content="#your-color-here" />
```

## 🐛 Troubleshooting

### App not showing install prompt
- Clear browser cache
- Ensure manifest.json is accessible
- Check HTTPS (required in production)
- Verify all icons exist

### Audio not auto-playing
- Expected on mobile (browser restriction)
- Audio will play after first user tap/click
- This is intentional browser behavior for better UX

### Icons not displaying
- Run `node scripts/generate-icons.js`
- Check `/public/icons/` directory
- Verify icon paths in manifest.json

### iOS-specific issues
- Must use Safari browser
- Check apple-touch-icon links in head
- Test in Private Browsing mode

## 📚 Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [iOS PWA Support](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Android PWA](https://developer.chrome.com/docs/android/trusted-web-activity/)

---

**Your app is now ready to be installed as a PWA! 🎉**

Test the installation on your devices and enjoy the native app experience.
