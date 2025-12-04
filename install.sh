#!/bin/bash

# 🏠 Tent - Quick Install Script
# This script will set up your Tent application in seconds!

set -e

echo "🏠 Welcome to Tent - AI Real Estate Search Setup"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the tent-app directory"
    exit 1
fi

echo "✅ Found package.json"
echo ""

# Step 1: Check Node.js
echo "📦 Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version must be 20 or higher (you have v$NODE_VERSION)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Step 2: Check pnpm
echo "📦 Step 2: Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v) ready"
echo ""

# Step 3: Install dependencies
echo "📦 Step 3: Installing dependencies..."
echo "This may take a few minutes..."
pnpm install --silent
echo "✅ Dependencies installed"
echo ""

# Step 4: Setup environment
echo "🔧 Step 4: Setting up environment..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "${YELLOW}⚠️  IMPORTANT: You need to configure .env.local${NC}"
    echo ""
    echo "Required settings:"
    echo "1. DATABASE_URL - Your PostgreSQL connection string"
    echo "2. NEXTAUTH_SECRET - Generate with: openssl rand -base64 32"
    echo "3. ANTHROPIC_API_KEY or OPENAI_API_KEY - Get from provider"
    echo ""
    echo "Open .env.local in your editor and add these values."
    echo ""
    read -p "Press Enter when you've configured .env.local..."
else
    echo "✅ .env.local already exists"
fi
echo ""

# Step 5: Check database
echo "🗄️  Step 5: Database setup..."
echo ""
echo "Make sure you have:"
echo "  • PostgreSQL 16+ installed and running"
echo "  • pgvector extension enabled"
echo "  • Database created (e.g., 'tent')"
echo ""
read -p "Is your database ready? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please set up PostgreSQL first:"
    echo ""
    echo "macOS:"
    echo "  brew install postgresql@16 pgvector"
    echo "  brew services start postgresql@16"
    echo "  createdb tent"
    echo "  psql tent -c 'CREATE EXTENSION vector;'"
    echo ""
    echo "Or use a cloud database:"
    echo "  • Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres"
    echo "  • Neon: https://neon.tech"
    echo "  • Supabase: https://supabase.com"
    echo ""
    exit 1
fi

# Step 6: Push schema and seed
echo ""
echo "🗄️  Step 6: Initializing database..."
echo ""
echo "Pushing schema..."
pnpm db:push
echo "✅ Schema created"
echo ""
echo "Seeding with sample data..."
pnpm db:seed
echo "✅ Database seeded"
echo ""

# Success!
echo "${GREEN}╔════════════════════════════════════════╗${NC}"
echo "${GREEN}║                                        ║${NC}"
echo "${GREEN}║   🎉 Setup Complete!                   ║${NC}"
echo "${GREEN}║                                        ║${NC}"
echo "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Your Tent application is ready! 🏠"
echo ""
echo "To start the development server:"
echo "  ${GREEN}pnpm dev${NC}"
echo ""
echo "Then open: ${GREEN}http://localhost:3000${NC}"
echo ""
echo "Try these search queries:"
echo "  • 3-bedroom apartments in New Cairo under 5M"
echo "  • Luxury villas in 6th of October"
echo "  • Penthouses in New Capital"
echo ""
echo "Happy coding! 🚀"
