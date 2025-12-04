# Health Twin™ - Deployment Guide 🚀

**Version:** 1.0  
**Date:** December 4, 2025  
**Purpose:** Complete guide to deploy Health Twin™ platform online

---

## 🎯 DEPLOYMENT OPTIONS

### Option 1: **Vercel** (Recommended for Frontend) ⚡
- **Best for:** Next.js Corporate Dashboard
- **Cost:** Free tier available
- **Speed:** Fastest deployment (2 minutes)
- **Features:** Auto-scaling, CDN, SSL included

### Option 2: **Railway** (Recommended for Full Stack) 🚂
- **Best for:** Complete platform (Frontend + Backend)
- **Cost:** $5/month starter
- **Features:** PostgreSQL included, easy setup

### Option 3: **AWS/Azure/GCP** (Enterprise) ☁️
- **Best for:** Production at scale
- **Cost:** Pay-as-you-go
- **Features:** Full control, enterprise features

### Option 4: **DigitalOcean** (Balanced) 🌊
- **Best for:** Mid-size deployment
- **Cost:** $12/month droplet
- **Features:** Simple, reliable, good docs

---

## 🚀 QUICK START: Deploy to Vercel (5 Minutes)

### Step 1: Prepare the Project

**1. Create a GitHub repository:**
```bash
# Initialize git (if not already)
cd "c:\Users\Dell\Documents\Development Projects\Project 3"
git init
git add .
git commit -m "Initial commit - Health Twin Platform"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/health-twin.git
git branch -M main
git push -u origin main
```

**2. Install Vercel CLI:**
```bash
npm install -g vercel
```

### Step 2: Deploy Corporate Dashboard

```bash
# Navigate to dashboard
cd frontend/corporate-dashboard

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? health-twin-dashboard
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**🎉 Done! Your dashboard is now live at: `https://health-twin-dashboard.vercel.app`**

---

## 🔧 COMPLETE DEPLOYMENT (All Services)

### Architecture Overview:

```
┌─────────────────────────────────────────────────────┐
│                    PRODUCTION                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Frontend (Vercel)                                   │
│  ├─ Corporate Dashboard                              │
│  └─ https://dashboard.healthtwin.com                 │
│                                                      │
│  Backend (Railway/Render)                            │
│  ├─ Risk Engine (Python)                             │
│  ├─ User Service (Node.js)                           │
│  ├─ Auth Service (Node.js)                           │
│  └─ PDF Service (Node.js)                            │
│                                                      │
│  Database (Railway/Supabase)                         │
│  ├─ PostgreSQL + TimescaleDB                         │
│  ├─ MongoDB                                          │
│  └─ Redis                                            │
│                                                      │
│  Mobile App (Expo)                                   │
│  └─ Published to App Store / Play Store              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📦 DEPLOYMENT STEPS

### 1. Deploy Database (Railway)

**Create Railway Account:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

**Deploy PostgreSQL:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add postgresql

# Add TimescaleDB extension
railway run psql -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"

# Run migrations
railway run psql < backend/database/migrations/001_initial_schema.sql
```

**Get Database URL:**
```bash
railway variables
# Copy DATABASE_URL
```

---

### 2. Deploy Backend Services

#### A. Deploy Risk Engine (Python)

**Create `backend/services/risk-engine-service/Procfile`:**
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Create `backend/services/risk-engine-service/runtime.txt`:**
```
python-3.11.0
```

**Deploy to Railway:**
```bash
cd backend/services/risk-engine-service

# Initialize Railway
railway init

# Deploy
railway up

# Get URL
railway domain
# Example: https://risk-engine-production.up.railway.app
```

#### B. Deploy Node.js Services

**For each service (user-service, auth-service, pdf-service):**

**Create `Procfile`:**
```
web: npm start
```

**Update `package.json`:**
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "deploy": "npm run build && npm start"
  }
}
```

**Deploy:**
```bash
cd backend/services/user-service
railway init
railway up
```

---

### 3. Deploy Frontend

#### A. Corporate Dashboard (Vercel)

**Create `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.healthtwin.com",
    "NEXT_PUBLIC_RISK_ENGINE_URL": "https://risk-engine-production.up.railway.app"
  }
}
```

**Deploy:**
```bash
cd frontend/corporate-dashboard
vercel --prod
```

#### B. Mobile App (Expo)

**Build for production:**
```bash
cd frontend/mobile-app

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

### 4. Configure Environment Variables

**Corporate Dashboard (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.healthtwin.com
NEXT_PUBLIC_RISK_ENGINE_URL=https://risk-engine.healthtwin.com
NEXT_PUBLIC_WS_URL=wss://api.healthtwin.com
```

**Backend Services (.env):**
```env
DATABASE_URL=postgresql://user:pass@host:5432/healthtwin_core
MONGODB_URL=mongodb://user:pass@host:27017/healthtwin
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=https://dashboard.healthtwin.com
PORT=8001
```

**Risk Engine (.env):**
```env
DATABASE_URL=postgresql://user:pass@host:5432/healthtwin_core
CORS_ORIGINS=["https://dashboard.healthtwin.com"]
PORT=8005
```

---

## 🌐 CUSTOM DOMAIN SETUP

### Option 1: Vercel Domain

**1. Add custom domain in Vercel:**
```
Dashboard → Settings → Domains → Add Domain
Enter: dashboard.healthtwin.com
```

**2. Update DNS records:**
```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com
```

### Option 2: Railway Domain

**1. Add custom domain:**
```bash
railway domain add api.healthtwin.com
```

**2. Update DNS:**
```
Type: CNAME
Name: api
Value: [railway-provided-value]
```

---

## 🔒 SSL/HTTPS Setup

**Automatic SSL (Vercel/Railway):**
- ✅ SSL certificates automatically provisioned
- ✅ Auto-renewal
- ✅ No configuration needed

**Manual SSL (if using VPS):**
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d healthtwin.com -d www.healthtwin.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 MONITORING & ANALYTICS

### 1. Setup Monitoring

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

**Add to layout.tsx:**
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

**Configure:**
```typescript
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### 3. Uptime Monitoring

**Use:**
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment:
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### Deployment:
- [ ] Deploy database
- [ ] Run migrations
- [ ] Deploy backend services
- [ ] Deploy frontend
- [ ] Configure domains
- [ ] Test all endpoints
- [ ] Enable monitoring
- [ ] Setup error tracking

### Post-Deployment:
- [ ] Verify all services running
- [ ] Test user flows
- [ ] Check SSL certificates
- [ ] Monitor performance
- [ ] Setup alerts
- [ ] Document URLs
- [ ] Train team

---

## 🔧 TROUBLESHOOTING

### Common Issues:

**1. Build Failures:**
```bash
# Clear cache
vercel --force

# Check logs
vercel logs
```

**2. Database Connection:**
```bash
# Test connection
railway run psql
\dt  # List tables
```

**3. CORS Errors:**
```typescript
// Update CORS settings
app.use(cors({
  origin: ['https://dashboard.healthtwin.com'],
  credentials: true
}));
```

**4. Environment Variables:**
```bash
# Verify variables
railway variables
vercel env ls
```

---

## 💰 COST ESTIMATION

### Starter Setup (Small Team):
```
Vercel (Frontend):        $0/month (Free tier)
Railway (Backend + DB):   $5/month (Starter)
Domain:                   $12/year
Total:                    ~$5-10/month
```

### Production Setup (100-500 employees):
```
Vercel (Pro):            $20/month
Railway (Pro):           $20/month
Database (Dedicated):    $25/month
Monitoring:              $10/month
Domain + SSL:            $12/year
Total:                   ~$75-100/month
```

### Enterprise Setup (1000+ employees):
```
AWS/Azure Infrastructure: $500-2000/month
Database (RDS):          $200/month
CDN:                     $100/month
Monitoring & Logging:    $150/month
Support:                 $500/month
Total:                   ~$1500-3000/month
```

---

## 📱 MOBILE APP DEPLOYMENT

### iOS App Store:

**1. Prepare:**
```bash
cd frontend/mobile-app
eas build --platform ios --profile production
```

**2. Submit:**
```bash
eas submit --platform ios
```

**3. Requirements:**
- Apple Developer Account ($99/year)
- App Store Connect access
- Privacy policy URL
- App screenshots

### Google Play Store:

**1. Build:**
```bash
eas build --platform android --profile production
```

**2. Submit:**
```bash
eas submit --platform android
```

**3. Requirements:**
- Google Play Developer Account ($25 one-time)
- Privacy policy URL
- App screenshots

---

## 🎯 RECOMMENDED DEPLOYMENT PLAN

### Phase 1: MVP (Week 1)
```
✅ Deploy Corporate Dashboard to Vercel
✅ Deploy Risk Engine to Railway
✅ Setup PostgreSQL on Railway
✅ Configure custom domain
✅ Enable SSL
```

### Phase 2: Full Backend (Week 2)
```
✅ Deploy all backend services
✅ Setup MongoDB
✅ Setup Redis
✅ Configure environment variables
✅ Run database migrations
```

### Phase 3: Mobile App (Week 3)
```
✅ Build iOS app
✅ Build Android app
✅ Submit to App Store
✅ Submit to Play Store
✅ Wait for approval
```

### Phase 4: Optimization (Week 4)
```
✅ Setup monitoring
✅ Configure alerts
✅ Performance optimization
✅ Security audit
✅ Load testing
```

---

## 📞 SUPPORT RESOURCES

### Documentation:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Expo: https://docs.expo.dev

### Community:
- Discord: Health Twin Community
- GitHub Issues
- Stack Overflow

---

## 🎉 NEXT STEPS

**Ready to deploy? Here's what to do:**

1. **Choose deployment platform** (Recommended: Vercel + Railway)
2. **Create accounts** on chosen platforms
3. **Push code to GitHub**
4. **Follow deployment steps** above
5. **Configure domains**
6. **Test thoroughly**
7. **Go live!** 🚀

---

**Your Health Twin™ platform will be live and accessible worldwide!**

**Estimated Time:** 2-4 hours for complete deployment  
**Difficulty:** Intermediate  
**Cost:** $5-10/month to start

---

**Ready to start? Let me know which deployment option you prefer!**
