#!/bin/bash

# Quick script to test and rebuild after updating API token
echo "================================================"
echo "Testing Strapi API Token..."
echo "================================================"

# Load environment
source .env

# Test token
echo ""
echo "1. Testing API connection..."
RESPONSE=$(curl -s -w "\n%{http_code}" "https://dashboard.zoeholidays.com/api/programs?pagination%5Blimit%5D=1" \
  -H "Authorization: Bearer $NEXT_PUBLIC_STRAPI_TOKEN")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API Token is VALID! (HTTP 200)"
    echo ""
    echo "2. Checking if programs exist..."
    PROGRAM_COUNT=$(echo "$BODY" | grep -o '"data"' | wc -l)
    if [ "$PROGRAM_COUNT" -gt 0 ]; then
        echo "✅ Programs found in response!"
        echo ""
        echo "3. Cleaning old build..."
        rm -rf .next
        echo "✅ Cleaned"
        echo ""
        echo "4. Building with valid token..."
        npm run build 2>&1 | tee build-log.txt
        echo ""
        ERROR_COUNT=$(grep -c "401" build-log.txt 2>/dev/null || echo "0")
        if [ "$ERROR_COUNT" = "0" ]; then
            echo "================================================"
            echo "🎉 SUCCESS! No 401 errors!"
            echo "================================================"
            echo ""
            echo "Next steps:"
            echo "1. Deploy to production"
            echo "2. Request Google re-indexing"
        else
            echo "⚠️  Still found $ERROR_COUNT 401 errors. Check build-log.txt"
        fi
    else
        echo "⚠️  Token works but no programs found"
        echo "    Content might be unpublished in Strapi"
    fi
else
    echo "❌ API Token is INVALID! (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    echo ""
    echo "Please:"
    echo "1. Go to https://dashboard.zoeholidays.com/admin"
    echo "2. Settings → API Tokens → Create new token"
    echo "3. Update line 3 in .env file"
    echo "4. Run this script again"
fi
