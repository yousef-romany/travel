#!/bin/bash

echo "================================================"
echo "🔧 Fix Google Content Issue - ZoeHolidays"
echo "================================================"
echo ""
echo "المشكلة: جوجل مش شايف المحتوى لأن Strapi API Token منتهي"
echo "الحل: جيب token جديد وعمل rebuild"
echo ""
echo "================================================"
echo "الخطوات المطلوبة:"
echo "================================================"
echo ""
echo "1️⃣  روح على Strapi Dashboard:"
echo "   https://dashboard.zoeholidays.com/admin"
echo ""
echo "2️⃣  اعمل Login"
echo ""
echo "3️⃣  Settings → API Tokens → Create new API Token"
echo ""
echo "4️⃣  اختار:"
echo "   - Name: Frontend Token 2025"
echo "   - Token type: Full access (أو Read-only)"
echo "   - Duration: Unlimited"
echo ""
echo "5️⃣  اضغط Save وانسخ الـ Token فوراً (بيظهر مرة واحدة بس!)"
echo ""
echo "================================================"
echo ""
read -p "جبت الـ Token؟ (y/n): " got_token

if [ "$got_token" != "y" ]; then
    echo ""
    echo "❌ لازم تجيب الـ Token الأول"
    echo "روح جيبه وارجع شغل الـ script تاني"
    exit 1
fi

echo ""
read -p "الصق الـ Token الجديد هنا: " new_token

if [ -z "$new_token" ]; then
    echo ""
    echo "❌ الـ Token فاضي!"
    exit 1
fi

echo ""
echo "================================================"
echo "🔍 بفحص الـ Token الجديد..."
echo "================================================"

# Test the token
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://dashboard.zoeholidays.com/api/programs?pagination%5Blimit%5D=1" \
  -H "Authorization: Bearer $new_token")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ الـ Token شغال!"
    echo ""

    # Backup old .env
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ عملت backup لـ .env القديم"

    # Update .env
    sed -i "3s|.*|NEXT_PUBLIC_STRAPI_TOKEN=$new_token|" .env
    echo "✅ اتحدث الـ .env"
    echo ""

    echo "================================================"
    echo "🗑️  بمسح الـ build القديم..."
    echo "================================================"
    rm -rf .next
    echo "✅ اتمسح"
    echo ""

    echo "================================================"
    echo "🏗️  بعمل build جديد..."
    echo "================================================"
    npm run build 2>&1 | tee build-output.log

    echo ""
    echo "================================================"
    echo "📊 فحص النتيجة..."
    echo "================================================"

    ERROR_COUNT=$(grep -c "401" build-output.log 2>/dev/null || echo "0")

    if [ "$ERROR_COUNT" = "0" ]; then
        echo ""
        echo "🎉🎉🎉 نجحت! مفيش 401 errors! 🎉🎉🎉"
        echo ""
        echo "✅ المحتوى دلوقتي موجود في البيلد"
        echo "✅ جوجل هيشوف المحتوى بعد ما تعمل deploy"
        echo ""
        echo "================================================"
        echo "الخطوات الجاية:"
        echo "================================================"
        echo "1. Deploy الموقع"
        echo "2. روح Google Search Console"
        echo "3. اطلب re-indexing للصفحات"
        echo "4. استنى 3-7 أيام"
        echo ""
        echo "🚀 الموقع جاهز!"

    else
        echo ""
        echo "⚠️  لسه في $ERROR_COUNT أخطاء 401"
        echo ""
        echo "ممكن يكون:"
        echo "1. الـ Token مش صح"
        echo "2. المحتوى مش published في Strapi"
        echo ""
        echo "شوف build-output.log للتفاصيل"
    fi

else
    echo "❌ الـ Token مش شغال! (HTTP $HTTP_CODE)"
    echo ""
    echo "ارجع للـ Strapi Dashboard وتأكد:"
    echo "1. الـ Token اتنسخ كامل"
    echo "2. اخترت Full access أو Read-only"
    echo "3. مفيش spaces في الـ Token"
fi
