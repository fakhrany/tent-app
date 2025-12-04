# 🏠 Tent - AI-Powered Real Estate Search Platform

A modern real estate search platform powered by AI, featuring conversational search, semantic understanding, and an interactive map interface.

---

## 🚀 **ONE-CLICK DEPLOY** (5 Minutes!)

Deploy to production instantly with one button click:

### ⭐ **Railway** (Recommended - Easiest!)
**All-in-one:** App + Database + SSL included

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/tent-app)

- ✅ **FREE:** $5 credit/month to start
- ✅ **3 minutes** setup time
- ✅ **PostgreSQL included** - No separate database needed
- ✅ **Auto-SSL** - HTTPS automatically configured

---

### 🚀 **Vercel** (Best Performance)
**Ultra-fast** hosting with global CDN

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

- ✅ **FREE:** 100GB bandwidth
- ✅ **5 minutes** setup time
- ⚠️ **Requires Neon database** (also FREE 0.5GB)
- ✅ **Edge Network** - Fastest performance

---

### 💚 **Render** (True Free Tier)
**No credit card** required for free tier

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

- ✅ **FREE:** 750 hours/month
- ✅ **4 minutes** setup time
- ✅ **Database included** - PostgreSQL built-in
- ✅ **No credit card** for free tier

---

## 📖 **Documentation**

### Quick Start Guides:
- 🚀 [**ONE-CLICK DEPLOY**](../ONE_CLICK_DEPLOY.md) - Deploy in 5 minutes
- ⚡ [**5-Minute Setup**](../QUICK_START.md) - Fastest path to production
- 📚 [**Complete Guide**](../DEPLOYMENT_GUIDE.md) - Detailed walkthrough (45 min)
- ✅ [**Deployment Checklist**](../DEPLOYMENT_CHECKLIST.md) - Step-by-step

### For Your Team:
- 👤 [**Admin Panel Guide**](../ADMIN_PANEL_GUIDE.md) - Data entry team (50 pages)
- 📊 [**Analytics Guide**](../ANALYTICS_GUIDE.md) - User tracking (80 pages)
- 🎯 [**Quick Reference**](../ADMIN_QUICK_START.md) - Fast lookups

---

## ✨ **Features**

### User-Facing:
- 🤖 **AI-Powered Search** - Natural language queries ("Find me 3BR under 5M")
- 🗺️ **Interactive Map** - Click properties on map with clustering
- 💬 **Conversational UI** - Chat-like interface for property search
- 🌍 **Bilingual** - Full English/Arabic support with RTL
- 📱 **Mobile-Friendly** - Responsive design for all devices
- ⚡ **Real-time** - Streaming AI responses with typewriter effect
- 🎨 **Beautiful UI** - Perplexity-style design (#20B8CD teal)

### Admin Panel:
- 📊 **Dashboard** - Real-time analytics and metrics
- 👥 **User Tracking** - Total, active, and new users
- 💬 **Conversation Analytics** - Track all chat sessions
- 🏢 **Developer Management** - Add real estate companies
- 🗺️ **Project Management** - Add compounds/developments
- 🏠 **Unit Management** - Add properties with full specs
- 🔍 **Popular Searches** - See what users are looking for
- 📈 **Engagement Metrics** - Messages, searches, quality scores

### Technical:
- ⚡ **Next.js 14** - Modern React framework
- 🔐 **NextAuth** - Secure authentication
- 🗄️ **PostgreSQL** - Reliable database with pgvector
- 🔄 **tRPC** - Type-safe APIs
- 🤖 **OpenAI GPT-4** - Powerful AI
- 🔍 **Vector Search** - Semantic property matching
- 📊 **Drizzle ORM** - Type-safe database queries
- 🎨 **Tailwind CSS** - Modern styling

---

## 💰 **Costs**

### Free Tier Available:
- ✅ **Railway:** $5 credit/month (plenty for starting)
- ✅ **Vercel:** 100GB bandwidth/month
- ✅ **Render:** 750 hours/month
- ✅ **Neon:** 0.5GB database

### Paid Services:
- 💵 **OpenAI API:** $5-20/month (usage-based)
- 💵 **Domain (optional):** $10-15/year

**Total: $5-20/month** to run in production

---

## 🛠️ **Local Development**

### Prerequisites:
- Node.js 20+
- pnpm 8+
- PostgreSQL 16+ with pgvector

### Quick Setup:

#### Option 1: Automated (Recommended)
```bash
# Extract the package
tar -xzf tent-app-ready-to-deploy.tar.gz
cd tent-app

# Run setup script
chmod +x setup.sh
./setup.sh

# Or on Windows:
setup.bat
```

The script will:
1. Create `.env` file with your keys
2. Install dependencies
3. Initialize database
4. You're ready to dev!

#### Option 2: Manual Setup
```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your keys
nano .env

# Initialize database
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables:

Create `.env` file:

```bash
# Database (from Neon/Railway/Render)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# OpenAI (from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-..."

# Perplexity (optional, from https://www.perplexity.ai/settings/api)
PERPLEXITY_API_KEY="pplx-..."

# NextAuth (generate: https://generate-secret.vercel.app/32)
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Available Scripts:

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm db:push      # Update database schema
pnpm db:studio    # Open database GUI
pnpm test         # Run tests
```

---

## 📂 **Project Structure**

```
tent-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Homepage with search
│   │   ├── admin/             # Admin panel
│   │   │   ├── dashboard/     # Analytics dashboard
│   │   │   ├── developers/    # Developer management
│   │   │   ├── projects/      # Project management
│   │   │   └── units/         # Unit management
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI primitives
│   │   ├── ChatInterface.tsx  # Chat UI
│   │   └── MapView.tsx        # Map component
│   ├── server/               # Backend code
│   │   ├── api/              # tRPC routers
│   │   │   ├── chat.ts       # Chat API
│   │   │   ├── admin.ts      # Admin API
│   │   │   └── analytics.ts  # Analytics API
│   │   └── db/               # Database
│   │       ├── schema.ts     # Database schema
│   │       └── seed.ts       # Seed data
│   └── lib/                  # Utilities
│       ├── trpc.ts           # tRPC client
│       └── openai.ts         # OpenAI integration
├── public/                   # Static files
├── .env.example             # Environment template
├── setup.sh                 # Quick setup script (Linux/Mac)
├── setup.bat                # Quick setup script (Windows)
├── railway.json             # Railway config
├── vercel.json              # Vercel config
├── render.yaml              # Render config
└── package.json             # Dependencies
```

---

## 🗄️ **Database Schema**

### Main Tables:
- **developers** - Real estate companies
- **projects** - Compounds/developments
- **units** - Individual properties
- **users** - Platform users
- **conversations** - Chat sessions
- **messages** - Chat messages
- **searchLogs** - Search analytics

### Key Features:
- ✅ **Vector embeddings** for semantic search
- ✅ **Spatial indexes** for location queries
- ✅ **Full-text search** for text queries
- ✅ **Foreign keys** for data integrity
- ✅ **Indexes** for performance

---

## 🧪 **Testing**

### After Deployment:

1. **Homepage** (10 seconds)
   - Visit your URL
   - Check map loads
   - Check search bar visible

2. **Search** (30 seconds)
   - Type: "3 bedroom apartment"
   - Press Enter
   - Verify AI responds
   - Verify results appear

3. **Admin Panel** (20 seconds)
   - Go to: `/admin/dashboard`
   - Check dashboard loads
   - Check stats visible

4. **Add Data** (2 minutes)
   - Go to: `/admin/developers/new`
   - Add test developer
   - Verify it appears in list

**All working? You're live!** 🎉

---

## 📊 **Architecture**

### Frontend:
```
Next.js 14 (App Router)
    ↓
React Components
    ↓
Tailwind CSS + shadcn/ui
    ↓
MapLibre GL for maps
```

### Backend:
```
tRPC API
    ↓
Drizzle ORM
    ↓
PostgreSQL + pgvector
```

### AI:
```
User Query
    ↓
OpenAI Embeddings (text-embedding-3-small)
    ↓
Vector Search (pgvector)
    ↓
GPT-4 Response
    ↓
Streaming to User
```

---

## 🎯 **Deployment Options Comparison**

| Feature | Railway | Vercel + Neon | Render |
|---------|---------|---------------|--------|
| **Setup Time** | ⚡ 3 min | 🚀 5 min | 💚 4 min |
| **Complexity** | ⭐ Easiest | ⭐⭐ Easy | ⭐⭐ Easy |
| **Free Tier** | $5 credit | 100GB | 750 hrs |
| **Database** | ✅ Included | ❌ Separate | ✅ Included |
| **Credit Card** | ✅ Required | ✅ Required | ❌ Not required |
| **Best For** | Beginners | Performance | Testing |
| **Auto-Deploy** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Yes |

**All platforms are excellent!** Choose based on your preference.

---

## 🔐 **Security**

### Built-in Security:
- ✅ **Environment variables** - No secrets in code
- ✅ **SSL/HTTPS** - Automatic on all platforms
- ✅ **SQL injection protection** - Drizzle ORM parameterized queries
- ✅ **CSRF protection** - NextAuth built-in
- ✅ **Rate limiting** - Can be added via middleware
- ✅ **Input validation** - Zod schemas

### Best Practices:
- ✅ Never commit `.env` file
- ✅ Use strong `NEXTAUTH_SECRET`
- ✅ Set OpenAI usage limits
- ✅ Enable database backups
- ✅ Monitor error logs
- ✅ Update dependencies regularly

---

## 📈 **Analytics Included**

### User Metrics:
- Total users
- Active users (30 days)
- New users (this month)
- User growth over time

### Conversation Metrics:
- Total conversations
- Active conversations
- New conversations
- Average messages per chat

### Engagement Metrics:
- Total messages sent
- Total searches made
- Popular search queries
- Search trends

**See the dashboard at:** `/admin/dashboard`

---

## 🚀 **What You Get**

### Immediately After Deploy:
- ✅ Live AI-powered search
- ✅ Admin panel with analytics
- ✅ Database with vector search
- ✅ Automatic SSL (HTTPS)
- ✅ Global CDN
- ✅ Production-ready
- ✅ Mobile-friendly
- ✅ Bilingual support

### After Adding Data:
- ✅ Searchable properties
- ✅ Interactive map
- ✅ User tracking
- ✅ Conversation logs
- ✅ Analytics dashboard
- ✅ Popular searches
- ✅ Revenue-ready platform

---

## 🎓 **Training Your Team**

### For Data Entry Team:
Give them: [**ADMIN_PANEL_GUIDE.md**](../ADMIN_PANEL_GUIDE.md)

**3-Step Workflow:**
1. Add Developer (company info)
2. Add Project (compound/development)
3. Add Units (individual properties)

**Training time:** 30 minutes

### For Technical Team:
Give them: [**ADMIN_QUICK_START.md**](../ADMIN_QUICK_START.md)

**Topics:**
- API endpoints
- Database schema
- Integration examples
- Environment setup

**Training time:** 15 minutes

---

## 📞 **Support**

### Documentation:
- **Deployment:** See deployment guides in package
- **Admin:** See ADMIN_PANEL_GUIDE.md
- **Analytics:** See ANALYTICS_GUIDE.md
- **API:** See ADMIN_QUICK_START.md

### Platform Support:
- **Railway:** https://railway.app/help
- **Vercel:** https://vercel.com/support
- **Render:** https://render.com/docs
- **Neon:** https://neon.tech/docs

### Common Issues:
- **Build fails:** Check environment variables
- **Search not working:** Verify OpenAI key and credits
- **Database errors:** Run `pnpm db:push`
- **Admin broken:** Check browser console for errors

---

## 📜 **License**

MIT License - See LICENSE file for details

---

## 🎉 **Ready to Deploy?**

1. **Choose platform** above (Railway/Vercel/Render)
2. **Click deploy button**
3. **Add your OpenAI key**
4. **Wait 3-5 minutes**
5. **You're live!** 🚀

---

## 💡 **Pro Tips**

### Before Deploy:
- ✅ Get OpenAI API key ready
- ✅ Have GitHub account
- ✅ Add $5 to OpenAI account

### After Deploy:
- ✅ Test immediately
- ✅ Add 5-10 test properties
- ✅ Set OpenAI usage alerts
- ✅ Monitor analytics daily

### For Production:
- ✅ Add custom domain
- ✅ Set up backups
- ✅ Enable monitoring
- ✅ Train your team

---

**Deploy in 5 minutes ⚡ Start searching with AI 🤖**

**Ready? Click a deploy button above!** 🚀✨

---

*Built with ❤️ using Next.js, OpenAI, and PostgreSQL*
