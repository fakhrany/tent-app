#!/bin/bash

# Tent App - Quick Setup Script
# This script helps you set up the app quickly

set -e

echo "🚀 Tent App - Quick Setup"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists!${NC}"
    read -p "Do you want to overwrite it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file"
        SKIP_ENV=true
    fi
fi

# Create .env file if needed
if [ "$SKIP_ENV" != true ]; then
    echo -e "${BLUE}📝 Setting up environment variables...${NC}"
    echo ""
    
    # Get OpenAI API Key
    echo "Enter your OpenAI API Key (from https://platform.openai.com/api-keys):"
    read -p "OPENAI_API_KEY: " OPENAI_KEY
    
    # Get Perplexity API Key (optional)
    echo ""
    echo "Enter your Perplexity API Key (optional, press Enter to skip):"
    read -p "PERPLEXITY_API_KEY: " PERPLEXITY_KEY
    
    # Get Database URL
    echo ""
    echo "Enter your Database URL (from Neon/Railway/Render):"
    read -p "DATABASE_URL: " DATABASE_URL
    
    # Generate NextAuth Secret
    echo ""
    echo -e "${BLUE}🔐 Generating NextAuth secret...${NC}"
    NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    
    # Create .env file
    cat > .env << EOF
# Database
DATABASE_URL="${DATABASE_URL}"

# OpenAI
OPENAI_API_KEY="${OPENAI_KEY}"

# Perplexity (optional)
PERPLEXITY_API_KEY="${PERPLEXITY_KEY}"

# NextAuth
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF
    
    echo -e "${GREEN}✅ .env file created!${NC}"
    echo ""
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm is not installed${NC}"
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Ask if user wants to setup database
echo ""
read -p "Do you want to initialize the database now? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
    echo -e "${BLUE}🗄️  Initializing database...${NC}"
    pnpm db:push
    echo -e "${GREEN}✅ Database initialized!${NC}"
else
    echo -e "${YELLOW}⚠️  Skipped database initialization${NC}"
    echo "Run 'pnpm db:push' when ready to initialize"
fi

# Success message
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start dev server:  ${BLUE}pnpm dev${NC}"
echo "  2. Open browser:      ${BLUE}http://localhost:3000${NC}"
echo "  3. Admin panel:       ${BLUE}http://localhost:3000/admin/dashboard${NC}"
echo ""
echo "Deployment options:"
echo "  - Railway:  See ONE_CLICK_DEPLOY.md"
echo "  - Vercel:   See ONE_CLICK_DEPLOY.md"
echo "  - Render:   See ONE_CLICK_DEPLOY.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
