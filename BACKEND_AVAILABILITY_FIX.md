# Program Availability Validation Error - Fix Guide

## Issue
"Validation error: Invalid status" when adding program availability

## Root Cause
The `status` field in the program-availability content type has a strict enumeration that only allows these values:
- `available`
- `limited`
- `sold-out`
- `cancelled`

## Backend Schema Location
`/home/yousefx00/Documents/Programing Projects/ZoeHolidays/travel-backend/src/api/program-availability/content-types/program-availability/schema.json`

## Valid Status Values (Lines 45-48)
```json
"status": {
  "type": "enumeration",
  "enum": ["available", "limited", "sold-out", "cancelled"],
  "default": "available"
}
```

## How to Fix

### Option 1: Use Valid Status Values (Recommended)
When creating/updating program availability in Strapi admin panel, ensure you select one of:
- **available** - Program has spots available
- **limited** - Few spots remaining
- **sold-out** - No spots available
- **cancelled** - Program date cancelled

### Option 2: Add More Status Values (If Needed)
If you need additional status values, update the backend schema:

1. Open the schema file:
```bash
cd /home/yousefx00/Documents/Programing\ Projects/ZoeHolidays/travel-backend
nano src/api/program-availability/content-types/program-availability/schema.json
```

2. Update the enum array (line 47):
```json
"enum": ["available", "limited", "sold-out", "cancelled", "your-new-status"],
```

3. Restart Strapi backend:
```bash
npm run develop
```

## Frontend Integration
The frontend is already configured to work with these status values. No changes needed on the frontend.

## Testing
After applying the fix:
1. Navigate to Strapi admin panel
2. Go to Program Availabilities
3. Create a new availability entry
4. Select a valid status from the dropdown
5. Save - should work without validation errors

## Note
This is a **backend data validation issue**, not a frontend bug. The schema is correctly configured.
