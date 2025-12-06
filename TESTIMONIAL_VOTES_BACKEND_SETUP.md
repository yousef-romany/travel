# Testimonial Votes Backend Configuration

## Overview
This document explains how to configure the Strapi backend to ensure **one vote per user per testimonial**.

## Problem
Previously, votes were only stored in localStorage, allowing:
- Multiple votes from same user
- Votes not persisting across devices
- No server-side validation

## Solution Implemented

### Frontend Changes (✅ Complete)
The `HelpfulVotes.tsx` component now:
1. Loads existing votes from database on mount
2. Creates/updates/deletes votes in database
3. Tracks vote document ID for proper updates
4. Uses localStorage as fallback for offline support
5. Prevents duplicate votes via frontend logic

### Backend Configuration Required

#### 1. Create Testimonial Votes Collection (if not exists)

Navigate to Strapi Admin Panel → Content-Type Builder → Create new collection type

**Collection Name:** `testimonial-vote`

**Fields:**
```
- testimonialId (Text, Required)
- userId (Text, Required)
- voteType (Enumeration, Required)
  Values: helpful, unhelpful
```

#### 2. Add Unique Constraint (CRITICAL)

To prevent duplicate votes at the database level, add a **composite unique index**:

**Option A: Via Strapi Schema**
Edit: `travel-backend/src/api/testimonial-vote/content-types/testimonial-vote/schema.json`

Add this to the schema:
```json
{
  "kind": "collectionType",
  "collectionName": "testimonial_votes",
  "info": {
    "singularName": "testimonial-vote",
    "pluralName": "testimonial-votes",
    "displayName": "Testimonial Vote"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "testimonialId": {
      "type": "string",
      "required": true
    },
    "userId": {
      "type": "string",
      "required": true
    },
    "voteType": {
      "type": "enumeration",
      "enum": ["helpful", "unhelpful"],
      "required": true
    }
  },
  "indexes": [
    {
      "name": "unique_user_testimonial_vote",
      "columns": ["testimonial_id", "user_id"],
      "type": "unique"
    }
  ]
}
```

**Option B: Via Custom Lifecycle Hook**
Create: `travel-backend/src/api/testimonial-vote/content-types/testimonial-vote/lifecycles.js`

```javascript
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Check if vote already exists
    const existing = await strapi.db.query('api::testimonial-vote.testimonial-vote').findOne({
      where: {
        testimonialId: data.testimonialId,
        userId: data.userId,
      },
    });

    if (existing) {
      throw new Error('You have already voted on this testimonial');
    }
  },
};
```

**Option C: Via Database Migration (PostgreSQL example)**
```sql
CREATE UNIQUE INDEX unique_user_testimonial_vote
ON testimonial_votes (testimonial_id, user_id);
```

#### 3. Set Permissions

Navigate to: Settings → Users & Permissions → Roles → Authenticated

**Testimonial-vote permissions:**
- ☑ find (allow users to check their votes)
- ☑ findOne (allow users to see vote details)
- ☑ create (allow users to create votes)
- ☑ update (allow users to change their vote)
- ☑ delete (allow users to remove their vote)

**Important:** Keep these permissions limited to authenticated users only.

#### 4. Update Testimonial Model (Optional)

To efficiently count votes, you can add these to the Testimonial model:

Edit: `travel-backend/src/api/testimonial/content-types/testimonial/schema.json`

```json
{
  "attributes": {
    "helpfulVotes": {
      "type": "integer",
      "default": 0
    },
    "unhelpfulVotes": {
      "type": "integer",
      "default": 0
    }
  }
}
```

Then create a lifecycle hook to update counts:
`travel-backend/src/api/testimonial-vote/content-types/testimonial-vote/lifecycles.js`

```javascript
module.exports = {
  async afterCreate(event) {
    const { result } = event;
    await updateVoteCounts(result.testimonialId);
  },

  async afterUpdate(event) {
    const { result } = event;
    await updateVoteCounts(result.testimonialId);
  },

  async afterDelete(event) {
    const { result } = event;
    await updateVoteCounts(result.testimonialId);
  },
};

async function updateVoteCounts(testimonialId) {
  const votes = await strapi.db.query('api::testimonial-vote.testimonial-vote').findMany({
    where: { testimonialId },
  });

  const helpful = votes.filter(v => v.voteType === 'helpful').length;
  const unhelpful = votes.filter(v => v.voteType === 'unhelpful').length;

  await strapi.db.query('api::testimonial.testimonial').update({
    where: { documentId: testimonialId },
    data: {
      helpfulVotes: helpful,
      unhelpfulVotes: unhelpful,
    },
  });
}
```

## Testing

1. **Test Duplicate Prevention:**
   ```bash
   # Try voting twice on same testimonial
   # Should fail with error message
   ```

2. **Test Vote Update:**
   ```bash
   # Vote "helpful" then change to "unhelpful"
   # Should update existing vote, not create new one
   ```

3. **Test Vote Removal:**
   ```bash
   # Click vote button again
   # Should delete vote record
   ```

## Database Query Examples

**Check for existing vote:**
```javascript
GET /api/testimonial-votes?filters[testimonialId][$eq]=xyz123&filters[userId][$eq]=user456
```

**Create vote:**
```javascript
POST /api/testimonial-votes
{
  "data": {
    "testimonialId": "xyz123",
    "userId": "user456",
    "voteType": "helpful"
  }
}
```

**Update vote:**
```javascript
PUT /api/testimonial-votes/{voteId}
{
  "data": {
    "voteType": "unhelpful"
  }
}
```

**Delete vote:**
```javascript
DELETE /api/testimonial-votes/{voteId}
```

## Migration from localStorage-only

If you have users with existing localStorage votes, consider:
1. Creating a migration endpoint that reads localStorage and creates DB records
2. Adding logic to sync on first authenticated visit
3. Clearing localStorage after successful DB sync

## Summary

✅ Frontend now properly integrates with database
✅ Votes persist across devices
⚠️ Backend needs unique constraint configuration
⚠️ Permissions need to be set correctly

**Next Steps:**
1. Choose one of the unique constraint methods above
2. Apply it to your Strapi backend
3. Set appropriate permissions
4. Test thoroughly with multiple users
