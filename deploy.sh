#!/bin/bash

# ZoeHolidays - Quick Deployment Script
# This script helps you deploy to Vercel quickly

echo "🚀 ZoeHolidays Deployment Helper"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${GREEN}✅ Found package.json${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

echo ""

# Check environment variables
echo "🔍 Checking environment variables..."
if [ ! -f ".env.local" ] && [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ No environment file found${NC}"
    echo "Please create .env.local or .env.production"
    echo "See env.production.template for reference"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Test locally (npm run dev)"
echo "2) Build for production (npm run build)"
echo "3) Test production build (npm run build && npm run start)"
echo "4) Deploy to Vercel"
echo "5) Run all checks and deploy"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}🚀 Starting development server...${NC}"
        npm run dev
        ;;
    2)
        echo ""
        echo -e "${GREEN}🔨 Building for production...${NC}"
        npm run build
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Build successful!${NC}"
            echo "Run 'npm run start' to test the production build"
        else
            echo -e "${RED}❌ Build failed${NC}"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo -e "${GREEN}🔨 Building for production...${NC}"
        npm run build
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Build successful!${NC}"
            echo -e "${GREEN}🚀 Starting production server...${NC}"
            echo ""
            npm run start
        else
            echo -e "${RED}❌ Build failed${NC}"
            exit 1
        fi
        ;;
    4)
        echo ""
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
                exit 1
            fi
        fi
        
        echo -e "${GREEN}🚀 Deploying to Vercel...${NC}"
        echo ""
        vercel --prod
        ;;
    5)
        echo ""
        echo -e "${GREEN}🔍 Running comprehensive checks...${NC}"
        echo ""
        
        # Run linter
        echo "1/4 Running linter..."
        npm run lint
        if [ $? -ne 0 ]; then
            echo -e "${YELLOW}⚠️  Linting issues found (continuing anyway)${NC}"
        else
            echo -e "${GREEN}✅ Linting passed${NC}"
        fi
        echo ""
        
        # Build
        echo "2/4 Building for production..."
        npm run build
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Build failed${NC}"
            exit 1
        fi
        echo -e "${GREEN}✅ Build successful${NC}"
        echo ""
        
        # Check if Vercel CLI is installed
        echo "3/4 Checking Vercel CLI..."
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
                exit 1
            fi
        fi
        echo -e "${GREEN}✅ Vercel CLI ready${NC}"
        echo ""
        
        # Deploy
        echo "4/4 Deploying to Vercel..."
        echo ""
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}🎉 Deployment successful!${NC}"
            echo ""
            echo "Next steps:"
            echo "1. Visit your deployment URL"
            echo "2. Test all features"
            echo "3. Run Lighthouse audit"
            echo "4. Monitor for errors"
        else
            echo -e "${RED}❌ Deployment failed${NC}"
            exit 1
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
