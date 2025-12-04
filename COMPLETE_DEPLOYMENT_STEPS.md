# Health Twin™ - Complete Deployment Instructions

## 🎯 FULL DEPLOYMENT STEPS

### STEP 1: Create GitHub Repository

1. **Go to GitHub:** https://github.com/new
2. **Repository Name:** `health-twin-platform`
3. **Description:** `AI-powered occupational health monitoring platform`
4. **Visibility:** Private (or Public if you prefer)
5. **Click:** "Create repository"

---

### STEP 2: Install Git (if not installed)

**Download Git for Windows:**
https://git-scm.com/download/win

**Or install via command:**
```powershell
winget install --id Git.Git -e --source winget
```

After installation, restart PowerShell.

---

### STEP 3: Initialize Git and Push Code

**Open PowerShell in your project folder and run:**

```powershell
# Navigate to project
cd "c:\Users\Dell\Documents\Development Projects\Project 3"

# Initialize git
git init

# Configure git (replace with your info)
git config user.name "Your Name"
git config user.email "sumtsco@gmail.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Health Twin Platform"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/health-twin-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** GitHub will ask for authentication. Use your GitHub username and a Personal Access Token (not password).

**To create a token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the token and use it as password when pushing

---

### STEP 4: Deploy Database on Railway

**Option A: Via Railway Dashboard (Easiest)**

1. Go to: https://railway.com/project/43b2959a-d185-4755-bed3-3a58cdb1ac13
2. Click "+ New"
3. Select "Database"
4. Choose "PostgreSQL"
5. Click "Add PostgreSQL"
6. Wait for deployment (30 seconds)
7. Click on the PostgreSQL service
8. Go to "Variables" tab
9. Copy the `DATABASE_URL` value

**Option B: Via CLI**

```powershell
cd "c:\Users\Dell\Documents\Development Projects\Project 3"

# This will open Railway dashboard in browser
railway open

# Then manually add PostgreSQL database from the dashboard
```

---

### STEP 5: Deploy Backend Services to Railway

**For each backend service, we'll connect it to your GitHub repo:**

#### A. Deploy Risk Engine

1. **In Railway Dashboard:**
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose `health-twin-platform`
   - Set root directory: `backend/services/risk-engine-service`
   - Click "Deploy"

2. **Add Environment Variables:**
   - Go to service → Variables
   - Add:
     ```
     DATABASE_URL=<paste from PostgreSQL service>
     PORT=8005
     CORS_ORIGINS=["https://health-twin-dashboard.vercel.app"]
     ```

3. **Generate Domain:**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://risk-engine-production.up.railway.app`)

#### B. Deploy User Service

1. **In Railway Dashboard:**
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose `health-twin-platform`
   - Set root directory: `backend/services/user-service`
   - Click "Deploy"

2. **Add Environment Variables:**
   ```
   DATABASE_URL=<paste from PostgreSQL service>
   JWT_SECRET=your-super-secret-key-change-this-in-production
   PORT=8001
   CORS_ORIGIN=https://health-twin-dashboard.vercel.app
   ```

3. **Generate Domain**

#### C. Deploy Auth Service

1. **In Railway Dashboard:**
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose `health-twin-platform`
   - Set root directory: `backend/services/auth-service`
   - Click "Deploy"

2. **Add Environment Variables:**
   ```
   DATABASE_URL=<paste from PostgreSQL service>
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRY=7d
   PORT=8002
   CORS_ORIGIN=https://health-twin-dashboard.vercel.app
   ```

3. **Generate Domain**

#### D. Deploy PDF Service

1. **In Railway Dashboard:**
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose `health-twin-platform`
   - Set root directory: `backend/services/pdf-service`
   - Click "Deploy"

2. **Add Environment Variables:**
   ```
   PORT=8006
   CORS_ORIGIN=https://health-twin-dashboard.vercel.app
   ```

3. **Generate Domain**

---

### STEP 6: Run Database Migrations

**Once PostgreSQL is deployed:**

```powershell
# Get database connection string from Railway
railway variables

# Connect and run migrations
railway run psql < backend/database/migrations/001_initial_schema.sql
```

**Or manually:**
1. Copy the `DATABASE_URL` from Railway
2. Use a PostgreSQL client (like pgAdmin or DBeaver)
3. Connect using the URL
4. Run the SQL from `backend/database/migrations/001_initial_schema.sql`

---

### STEP 7: Update Frontend Environment Variables

**In Vercel Dashboard:**

1. Go to: https://vercel.com/dr-ais-projects-9efd6b07/health-twin-dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:

```
NEXT_PUBLIC_API_URL=https://your-user-service.up.railway.app
NEXT_PUBLIC_RISK_ENGINE_URL=https://your-risk-engine.up.railway.app
NEXT_PUBLIC_AUTH_URL=https://your-auth-service.up.railway.app
NEXT_PUBLIC_PDF_URL=https://your-pdf-service.up.railway.app
```

4. Click "Save"
5. Go to "Deployments"
6. Click "..." on latest deployment → "Redeploy"

---

### STEP 8: Test Everything

**Test each service:**

1. **Frontend:** https://health-twin-dashboard.vercel.app
2. **Risk Engine:** `https://your-risk-engine.up.railway.app/health`
3. **User Service:** `https://your-user-service.up.railway.app/health`
4. **Auth Service:** `https://your-auth-service.up.railway.app/health`
5. **PDF Service:** `https://your-pdf-service.up.railway.app/health`

---

## 📊 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│                  PRODUCTION STACK                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  VERCEL (Frontend)                                   │
│  └─ Corporate Dashboard                              │
│     https://health-twin-dashboard.vercel.app         │
│                                                      │
│  RAILWAY (Backend + Database)                        │
│  ├─ PostgreSQL Database                              │
│  ├─ Risk Engine Service (Python)                     │
│  ├─ User Service (Node.js)                           │
│  ├─ Auth Service (Node.js)                           │
│  └─ PDF Service (Node.js)                            │
│                                                      │
│  GITHUB                                              │
│  └─ Source Code Repository                           │
│     Auto-deploys to Railway on push                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 💰 COST BREAKDOWN

**Monthly Costs:**

- **Vercel:** $0 (Free tier)
- **Railway:** $5-10 (Starter plan)
- **GitHub:** $0 (Free for public/private repos)
- **Domain (optional):** $1/month

**Total: ~$5-10/month**

---

## 🎯 QUICK START CHECKLIST

- [ ] Create GitHub repository
- [ ] Install Git
- [ ] Push code to GitHub
- [ ] Add PostgreSQL on Railway
- [ ] Deploy Risk Engine to Railway
- [ ] Deploy User Service to Railway
- [ ] Deploy Auth Service to Railway
- [ ] Deploy PDF Service to Railway
- [ ] Run database migrations
- [ ] Update Vercel environment variables
- [ ] Test all services
- [ ] Celebrate! 🎉

---

## 🔧 TROUBLESHOOTING

### Build Failures on Railway

**Check logs:**
```powershell
railway logs
```

**Common issues:**
- Missing dependencies in package.json
- Wrong root directory
- Missing environment variables

### Database Connection Issues

**Test connection:**
```powershell
railway run psql
```

**Verify DATABASE_URL is set in all services**

### CORS Errors

**Make sure CORS_ORIGIN matches your Vercel URL exactly**

---

## 📞 NEED HELP?

**Railway Support:**
- Dashboard: https://railway.app
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Vercel Support:**
- Dashboard: https://vercel.com
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

---

## 🎊 WHAT YOU'LL HAVE

After completing these steps:

✅ **Live Dashboard** - Accessible worldwide
✅ **Backend APIs** - All services running
✅ **Database** - PostgreSQL with TimescaleDB
✅ **Auto-deployment** - Push to GitHub = auto-deploy
✅ **SSL/HTTPS** - Automatic on all services
✅ **Monitoring** - Built-in Railway metrics
✅ **Scalable** - Auto-scales with traffic

---

**Your Health Twin™ platform will be fully deployed and production-ready!**

**Estimated Time:** 1-2 hours
**Difficulty:** Intermediate
**Cost:** $5-10/month
