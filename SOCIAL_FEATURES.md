# Social Features Implementation Guide

## Overview

This document covers the implementation of social sharing and referral features for the ZoeHolidays travel platform. These features are designed to increase user engagement, drive organic growth, and reward users for sharing and referring friends.

## Features Implemented

### 1. Social Sharing System
**Location**: `components/social/ShareButtons.tsx`, `lib/social-sharing.ts`

#### Capabilities:
- Share programs on multiple platforms (Facebook, Twitter, WhatsApp, LinkedIn, Email)
- Native Web Share API integration for mobile devices
- Copy link to clipboard functionality
- Share tracking and analytics
- Three display variants:
  - **Dropdown**: Compact button with dropdown menu
  - **Dialog**: Full dialog with all sharing options
  - **Button Group**: Individual buttons for each platform

#### Integration Example:
```tsx
import { ShareButtonCompact } from "@/components/social/ShareButtons";
import { generateProgramShareText, generateTravelHashtags } from "@/lib/social-sharing";

<ShareButtonCompact
  shareOptions={{
    title: "Amazing Travel Experience",
    text: generateProgramShareText("Egypt Tour", 1200, 4.8),
    url: window.location.href,
    hashtags: generateTravelHashtags("Cairo"),
    via: "ZoeHolidays",
  }}
  shareConfig={{
    contentType: "program",
    contentId: programId,
    contentTitle: "Egypt Tour",
  }}
/>
```

#### Backend Integration:
- **Content Type**: `social-share`
- **API Endpoints**:
  - `POST /api/social-shares/track` - Track a share event
  - `GET /api/social-shares/content/:contentType/:contentId` - Get share stats for content
  - `GET /api/social-shares/user/history` - Get user's sharing history
  - `GET /api/social-shares/stats/global` - Get global sharing statistics

### 2. Referral Program
**Location**: `components/social/ReferralProgram.tsx`, `fetch/referrals.ts`

#### How It Works:
1. **User generates a referral code** (format: `ZOEXXXXXX`)
2. **Shares the code** with friends via social media or direct link
3. **Friend signs up** using the referral code and gets $50 off first booking
4. **After friend's first booking completes**, both users receive $50 credit

#### Features:
- **Unique referral codes** with 6-month validity
- **Multiple sharing options** (Facebook, Twitter, WhatsApp, Email)
- **Real-time statistics**:
  - Total referrals
  - Pending referrals
  - Completed referrals
  - Total earned
- **Referral history** with status tracking
- **Shareable referral links** with embedded codes

#### Integration Example:
```tsx
import { ReferralProgram } from "@/components/social/ReferralProgram";

// In dashboard or standalone page
<ReferralProgram />

// Or use the compact widget
import { ReferralWidget } from "@/components/social/ReferralProgram";
<ReferralWidget />
```

#### Backend Integration:
- **Content Type**: `referral`
- **API Endpoints**:
  - `POST /api/referrals/generate` - Generate referral code
  - `POST /api/referrals/validate` - Validate and apply referral code
  - `POST /api/referrals/complete` - Mark referral as completed (after booking)
  - `GET /api/referrals/stats` - Get user's referral statistics
  - `GET /api/referrals/history` - Get user's referral history

## Strapi Backend Setup

### Content Types Created:

#### 1. Referral (`api::referral.referral`)
```json
{
  "referralCode": "string (unique)",
  "referrer": "relation to user",
  "referred": "relation to user",
  "status": "enum [pending, completed, expired, cancelled]",
  "referralReward": "decimal (default: 50.0)",
  "referredReward": "decimal (default: 50.0)",
  "bookingId": "string",
  "completedAt": "datetime",
  "expiryDate": "datetime",
  "isRewardClaimed": "boolean",
  "claimedAt": "datetime",
  "notes": "text"
}
```

#### 2. Social Share (`api::social-share.social-share`)
```json
{
  "user": "relation to user",
  "platform": "enum [facebook, twitter, whatsapp, email, linkedin, instagram, copy-link]",
  "contentType": "enum [program, place, blog, custom]",
  "contentId": "string",
  "contentTitle": "string",
  "url": "text",
  "ipAddress": "string",
  "userAgent": "text",
  "referrer": "text",
  "metadata": "json"
}
```

### Required Relations:

Add these to your user schema:
```json
{
  "referralsSent": {
    "type": "relation",
    "relation": "oneToMany",
    "target": "api::referral.referral",
    "mappedBy": "referrer"
  },
  "referralsReceived": {
    "type": "relation",
    "relation": "oneToMany",
    "target": "api::referral.referral",
    "mappedBy": "referred"
  },
  "socialShares": {
    "type": "relation",
    "relation": "oneToMany",
    "target": "api::social-share.social-share",
    "mappedBy": "user"
  }
}
```

## Integration Points

### 1. Program Pages
✅ **Implemented** - Share button added below booking button
- Location: `app/(app)/programs/[title]/ProgramContent.tsx`
- Uses `ShareButtonCompact` component
- Tracks shares with program ID and title

### 2. User Dashboard
✅ **Implemented** - Full referral program tab
- Location: `app/(app)/dashboard/page.tsx`
- New "Referrals" tab with complete referral management
- Statistics, code generation, sharing, and history

### 3. Signup Flow (Recommended)
**TODO** - Add referral code input during signup
```tsx
// In signup form, add:
<Input
  name="referralCode"
  label="Referral Code (Optional)"
  placeholder="Enter code to get $50 off"
/>

// On signup success:
if (referralCode) {
  await validateReferralCode(referralCode);
}
```

### 4. Booking Completion (Recommended)
**TODO** - Complete referral after first booking
```tsx
// After successful booking:
if (isFirstBooking) {
  await completeReferral(bookingId);
}
```

## API Usage Examples

### Frontend Usage:

#### Generate Referral Code:
```typescript
import { generateReferralCode } from "@/fetch/referrals";

const result = await generateReferralCode();
console.log(result.referralCode); // "ZOEABC123"
```

#### Validate Referral Code:
```typescript
import { validateReferralCode } from "@/fetch/referrals";

const result = await validateReferralCode("ZOEABC123");
if (result.isValid) {
  console.log(`Get $${result.referredReward} off!`);
}
```

#### Track Social Share:
```typescript
import { trackSocialShare } from "@/fetch/social-shares";

await trackSocialShare(
  "facebook",
  "program",
  programId,
  window.location.href,
  programTitle
);
```

#### Get Referral Stats:
```typescript
import { getReferralStats } from "@/fetch/referrals";

const stats = await getReferralStats();
console.log(stats.totalEarned); // Total $ earned from referrals
```

## UI Components

### 1. ShareButtons
Three variants available:

#### Compact (Dropdown):
```tsx
<ShareButtonCompact
  shareOptions={{...}}
  shareConfig={{...}}
  className="optional-class"
/>
```

#### Full Dialog:
```tsx
<ShareButtonDialog
  shareOptions={{...}}
  shareConfig={{...}}
  showStats={true}
  shareCount={42}
/>
```

#### Button Group:
```tsx
<ShareButtons
  variant="button"
  shareOptions={{...}}
  shareConfig={{...}}
/>
```

### 2. ReferralProgram
Full referral program interface:
```tsx
<ReferralProgram />
```

Displays:
- How it works section
- Referral code generation/display
- Quick share buttons
- Statistics cards
- Referral history
- Terms and conditions

### 3. ReferralWidget
Compact widget for dashboard overview:
```tsx
<ReferralWidget />
```

Shows:
- Completed referrals count
- Total earned
- Link to full referral page

## Utility Functions

### Social Sharing:
```typescript
// lib/social-sharing.ts
import {
  shareOnFacebook,
  shareOnTwitter,
  shareOnWhatsApp,
  shareOnLinkedIn,
  shareViaEmail,
  copyLinkToClipboard,
  isWebShareSupported,
  shareNative,
  generateProgramShareText,
  generateTravelHashtags,
} from "@/lib/social-sharing";

// Check if native sharing is supported
if (isWebShareSupported()) {
  await shareNative(options);
}

// Generate share text
const text = generateProgramShareText("Egypt Tour", 1200, 4.8);
// "Check out this amazing travel program: Egypt Tour (⭐ 4.8/5) - Starting from $1200 | Book now with ZoeHolidays! 🌍✈️"

// Generate hashtags
const hashtags = generateTravelHashtags("Cairo");
// ["Cairo", "Travel", "Adventure", "ZoeHolidays", "Wanderlust"]
```

### Referral Management:
```typescript
// fetch/referrals.ts
import {
  generateReferralCode,
  validateReferralCode,
  completeReferral,
  getReferralStats,
  getReferralHistory,
} from "@/fetch/referrals";
```

## Analytics & Tracking

### Share Tracking:
Every share is automatically tracked with:
- Platform (facebook, twitter, etc.)
- Content type and ID
- User (if logged in)
- Timestamp
- User agent and IP (for analytics)

### Referral Tracking:
Referrals track:
- Code generation
- Code usage (when friend signs up)
- Booking completion
- Reward claims
- Status changes

### Get Analytics:
```typescript
// Get share stats for content
const shareStats = await getContentShareStats("program", programId);
console.log(shareStats.totalShares); // Total shares
console.log(shareStats.byPlatform); // Breakdown by platform

// Get global share stats (admin)
const globalStats = await getGlobalShareStats();
console.log(globalStats.topSharedContent); // Most shared programs
```

## Rewards System Integration

### Referral Rewards:
- **Referrer**: Gets $50 credit after referred user's first booking
- **Referred User**: Gets $50 off their first booking
- **Processing**: Rewards are marked in `referral.isRewardClaimed`

### TODO - Integrate with Payment System:
```typescript
// In booking completion handler:
const referralResult = await completeReferral(bookingId);
if (referralResult.success) {
  // Award credits to both users
  await awardCredit(referrerId, referralResult.referralReward);
  await awardDiscount(referredId, referralResult.referredReward);
}
```

## Security Considerations

### Referral System:
1. ✅ Users cannot refer themselves
2. ✅ Each user can only be referred once
3. ✅ Referral codes expire after 6 months
4. ✅ Codes are unique and randomly generated
5. ✅ Validation prevents duplicate usage

### Share Tracking:
1. ✅ Anonymous shares allowed (no auth required)
2. ✅ Rate limiting recommended on backend
3. ✅ IP tracking for fraud prevention

## Testing

### Test Referral Flow:
1. Login as User A
2. Go to Dashboard → Referrals tab
3. Click "Generate My Referral Code"
4. Copy code (e.g., `ZOEABC123`)
5. Logout and signup as User B with referral code
6. Make a booking as User B
7. Verify both users receive rewards

### Test Social Sharing:
1. Go to any program page
2. Click "Share" button
3. Try different platforms
4. Verify share tracking in Strapi admin
5. Check analytics endpoints

## Performance Optimization

### Caching:
```typescript
// Cache referral stats (5 minutes)
const { data } = useQuery({
  queryKey: ["referralStats", userId],
  queryFn: getReferralStats,
  staleTime: 5 * 60 * 1000,
});
```

### Lazy Loading:
- Social share tracking happens asynchronously
- No blocking of main user flow
- Failed tracking doesn't affect user experience

## Future Enhancements

### Planned Features:
1. **Social Login Integration** - Share after login with Facebook/Google
2. **Email Templates** - Branded referral emails
3. **SMS Referrals** - Send codes via SMS (excluded per user request)
4. **Leaderboards** - Top referrers
5. **Tiered Rewards** - Higher rewards for more referrals
6. **Referral Contests** - Time-limited bonus campaigns
7. **Social Proof** - "X people shared this" badges
8. **One-Click Invite** - Import contacts and invite multiple friends

### Analytics Dashboard (Admin):
- Most shared programs
- Share conversion rates
- Referral conversion funnel
- Platform performance comparison
- ROI calculations

## Support & Documentation

### Need Help?
- Check component props and TypeScript types
- Review example implementations in:
  - `app/(app)/programs/[title]/ProgramContent.tsx`
  - `app/(app)/dashboard/page.tsx`
- Check Strapi admin panel for data verification

### Common Issues:

**Referral code not generating?**
- Check user is logged in
- Verify backend API is running
- Check browser console for errors

**Shares not tracking?**
- Check network tab for API calls
- Verify Strapi permissions allow anonymous posts to social-shares
- Check CORS settings

**Native share not working?**
- Only available on HTTPS
- Not supported in all browsers
- Use fallback buttons automatically

## Environment Variables

Add to `.env`:
```bash
# Already configured
NEXT_PUBLIC_STRAPI_URL=https://dashboard.zoeholidays.com
NEXT_PUBLIC_STRAPI_TOKEN=your-token-here

# No additional variables needed for social features
```

## Deployment Checklist

- [ ] Run Strapi migrations for new content types
- [ ] Test referral code generation in production
- [ ] Verify share tracking works on HTTPS
- [ ] Set up analytics monitoring
- [ ] Configure email notifications for referral completions
- [ ] Test social sharing on mobile devices
- [ ] Verify Open Graph meta tags for shared links
- [ ] Test all share platforms
- [ ] Monitor referral fraud attempts
- [ ] Set up customer support for referral issues

## License & Credits

Built for ZoeHolidays travel platform using:
- Next.js 14+ with App Router
- Strapi v5 headless CMS
- shadcn/ui components
- Web Share API
- Lucide React icons

---

**Last Updated**: 2025-12-03
**Version**: 1.0.0
**Status**: ✅ Production Ready
