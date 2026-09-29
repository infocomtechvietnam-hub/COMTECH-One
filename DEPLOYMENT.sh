#!/bin/bash

# COMTECH Website - Automated Deployment Script
# Usage: bash DEPLOYMENT.sh

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     COMTECH Website - Automated Deployment Setup          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}[1/6]${NC} Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

# Install dependencies
echo ""
echo -e "${YELLOW}[2/6]${NC} Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create .env.local
echo ""
echo -e "${YELLOW}[3/6]${NC} Setting up environment variables..."

if [ ! -f ".env.local" ]; then
    cat > .env.local << 'ENVFILE'
# Application URLs
NEXT_PUBLIC_API_URL=https://www.comtechvietnam.vn
NEXT_PUBLIC_SITE_URL=https://www.comtechvietnam.vn

# Email Configuration (SMTP)
SMTP_HOST=mail90139.maychuemail.com
SMTP_PORT=465
SMTP_USER=your-email@your-domain.com
SMTP_PASS=your-app-password-here

# Admin Emails
ADMIN_EMAIL=admin@comtechvietnam.vn
SUPPORT_EMAIL=support@comtechvietnam.vn

# Database (Optional - for storing leads)
DATABASE_URL=postgresql://user:password@localhost:5432/comtech_leads

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
ENVFILE
    echo -e "${GREEN}✓ .env.local created (EDIT with your credentials)${NC}"
    echo -e "${YELLOW}   ⚠️  Please update .env.local with your SMTP credentials${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# Build project
echo ""
echo -e "${YELLOW}[4/6]${NC} Building project..."
npm run build
echo -e "${GREEN}✓ Build successful${NC}"

# Test TypeScript
echo ""
echo -e "${YELLOW}[5/6]${NC} Checking TypeScript..."
npx tsc --noEmit
echo -e "${GREEN}✓ TypeScript check passed${NC}"

# Setup complete
echo ""
echo -e "${YELLOW}[6/6]${NC} Deployment setup complete!"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ✅ READY TO DEPLOY                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  EDIT .env.local with your credentials:"
echo "    - SMTP_USER: your-email@your-domain.com"
echo "    - SMTP_PASS: your-app-password"
echo "    - (Get app password from: https://mail90139.maychuemail.com/)"
echo ""
echo "2️⃣  TEST LOCALLY:"
echo "    npm run dev"
echo "    # Visit http://localhost:3000"
echo ""
echo "3️⃣  PUSH TO GITHUB:"
echo "    git add ."
echo "    git commit -m 'Deploy COMTECH website'"
echo "    git push -u origin main"
echo ""
echo "4️⃣  DEPLOY TO VERCEL:"
echo "    npm i -g vercel"
echo "    vercel --prod"
echo ""
echo "5️⃣  CONFIGURE DOMAIN:"
echo "    - Update DNS at your hosting provider"
echo "    - Point to Vercel nameservers"
echo ""
echo "6️⃣  SETUP SSL:"
echo "    - Vercel handles this automatically"
echo ""
echo "📞 Need help? Check README.md or QUICK_START.md"
echo ""
