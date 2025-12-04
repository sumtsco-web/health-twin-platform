# 🚀 Railway Backend Deployment - Step-by-Step Guide

**Project URL:** https://railway.com/project/43b2959a-d185-4755-bed3-3a58cdb1ac13

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] Step 1: Add PostgreSQL Database
- [ ] Step 2: Deploy Risk Engine Service
- [ ] Step 3: Deploy User Service
- [ ] Step 4: Deploy Auth Service
- [ ] Step 5: Deploy PDF Service
- [ ] Step 6: Run Database Migrations
- [ ] Step 7: Update Vercel Environment Variables
- [ ] Step 8: Test Everything

---

## STEP 1: Add PostgreSQL Database ⚡

### Instructions:

1. **Open Railway Dashboard:**
   - Go to: https://railway.com/project/43b2959a-d185-4755-bed3-3a58cdb1ac13

2. **Click the "+ New" button** (top right of the project)

3. **Select "Database"** from the menu

4. **Choose "Add PostgreSQL"**

5. **Wait 30 seconds** for deployment to complete

6. **Click on the PostgreSQL service** (the purple database icon)

7. **Go to "Variables" tab**

8. **Find and COPY the `DATABASE_URL`** 
   - It looks like: `postgresql://postgres:password@host:5432/railway`
   - **SAVE THIS!** You'll need it for all backend services

9. **Keep this tab open** - you'll need to copy this URL multiple times

---

## STEP 2: Deploy Risk Engine Service 🧠

### Instructions:

1. **Click "+ New" button** again

2. **Select "GitHub Repo"**

3. **Authorize Railway** (if asked)
   - Click "Configure GitHub App"
   - Select "sumtsco-web" organization
   - Choose "Only select repositories"
   - Select "health-twin-platform"
   - Click "Install & Authorize"

4. **Select Repository:**
   - Choose `sumtsco-web/health-twin-platform`
   - Click "Deploy"

5. **Configure the Service:**
   - Click on the newly created service
   - Go to **"Settings"** tab
   - Scroll to **"Root Directory"**
   - Enter: `backend/services/risk-engine-service`
   - Click "Update"

6. **Add Environment Variables:**
   - Go to **"Variables"** tab
   - Click **"+ New Variable"**
   - Add these one by one:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: [Paste the PostgreSQL URL you copied]

   **Variable 2:**
   - Name: `PORT`
   - Value: `8005`

   **Variable 3:**
   - Name: `CORS_ORIGINS`
   - Value: `["https://health-twin-dashboard.vercel.app"]`

7. **Generate Public URL:**
   - Go to **"Settings"** tab
   - Scroll to **"Networking"**
   - Click **"Generate Domain"**
   - **COPY THE URL** (e.g., `https://risk-engine-production.up.railway.app`)
   - **SAVE THIS URL!**

8. **Wait for Deployment:**
   - Go to **"Deployments"** tab
   - Wait until status shows **"SUCCESS"** (green checkmark)
   - This may take 2-3 minutes

---

## STEP 3: Deploy User Service 👥

### Instructions:

1. **Click "+ New" button**

2. **Select "GitHub Repo"**

3. **Select `sumtsco-web/health-twin-platform`**

4. **Click "Deploy"**

5. **Configure Root Directory:**
   - Click on the service
   - Go to **"Settings"**
   - Set **"Root Directory"** to: `backend/services/user-service`
   - Click "Update"

6. **Add Environment Variables:**
   - Go to **"Variables"** tab
   - Add these variables:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: [Paste PostgreSQL URL]

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: `your-super-secret-jwt-key-change-in-production-2024`

   **Variable 3:**
   - Name: `PORT`
   - Value: `8001`

   **Variable 4:**
   - Name: `CORS_ORIGIN`
   - Value: `https://health-twin-dashboard.vercel.app`

7. **Generate Domain:**
   - Settings → Networking → Generate Domain
   - **COPY AND SAVE THE URL**

8. **Wait for deployment to succeed**

---

## STEP 4: Deploy Auth Service 🔐

### Instructions:

1. **Click "+ New" button**

2. **Select "GitHub Repo"**

3. **Select `sumtsco-web/health-twin-platform`**

4. **Click "Deploy"**

5. **Configure Root Directory:**
   - Settings → Root Directory: `backend/services/auth-service`

6. **Add Environment Variables:**

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: [Paste PostgreSQL URL]

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: `your-super-secret-jwt-key-change-in-production-2024`

   **Variable 3:**
   - Name: `JWT_EXPIRY`
   - Value: `7d`

   **Variable 4:**
   - Name: `PORT`
   - Value: `8002`

   **Variable 5:**
   - Name: `CORS_ORIGIN`
   - Value: `https://health-twin-dashboard.vercel.app`

7. **Generate Domain and save URL**

8. **Wait for deployment**

---

## STEP 5: Deploy PDF Service 📄

### Instructions:

1. **Click "+ New" button**

2. **Select "GitHub Repo"**

3. **Select `sumtsco-web/health-twin-platform`**

4. **Click "Deploy"**

5. **Configure Root Directory:**
   - Settings → Root Directory: `backend/services/pdf-service`

6. **Add Environment Variables:**

   **Variable 1:**
   - Name: `PORT`
   - Value: `8006`

   **Variable 2:**
   - Name: `CORS_ORIGIN`
   - Value: `https://health-twin-dashboard.vercel.app`

7. **Generate Domain and save URL**

8. **Wait for deployment**

---

## STEP 6: Run Database Migrations 🗄️

### Option A: Using Railway CLI (Recommended)

**In PowerShell, run:**

```powershell
cd "c:\Users\Dell\Documents\Development Projects\Project 3"

# Link to your Railway project
railway link

# Select your project when prompted

# Run the migration
railway run psql < backend/database/migrations/001_initial_schema.sql
```

### Option B: Using Database Client

1. **Download a PostgreSQL client:**
   - pgAdmin: https://www.pgadmin.org/download/
   - DBeaver: https://dbeaver.io/download/
   - TablePlus: https://tableplus.com/

2. **Connect using the DATABASE_URL:**
   - Copy the DATABASE_URL from Railway
   - Paste it into the connection dialog

3. **Run the migration SQL:**
   - Open: `backend/database/migrations/001_initial_schema.sql`
   - Execute the entire file

---

## STEP 7: Update Vercel Environment Variables 🌐

### Instructions:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dr-ais-projects-9efd6b07/health-twin-dashboard/settings/environment-variables

2. **Add these environment variables:**

   **Variable 1:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: [Your User Service URL from Railway]
   - Environment: Production, Preview, Development

   **Variable 2:**
   - Key: `NEXT_PUBLIC_RISK_ENGINE_URL`
   - Value: [Your Risk Engine URL from Railway]
   - Environment: Production, Preview, Development

   **Variable 3:**
   - Key: `NEXT_PUBLIC_AUTH_URL`
   - Value: [Your Auth Service URL from Railway]
   - Environment: Production, Preview, Development

   **Variable 4:**
   - Key: `NEXT_PUBLIC_PDF_URL`
   - Value: [Your PDF Service URL from Railway]
   - Environment: Production, Preview, Development

3. **Click "Save" for each variable**

4. **Redeploy Vercel:**
   - Go to "Deployments" tab
   - Click "..." menu on the latest deployment
   - Click "Redeploy"
   - Wait for redeployment to complete

---

## STEP 8: Test Everything ✅

### Test Each Service:

**1. PostgreSQL Database:**
```
✅ Check Railway dashboard - should show "Active"
```

**2. Risk Engine:**
```
Visit: https://your-risk-engine-url.up.railway.app/health
Should return: {"status": "healthy"}
```

**3. User Service:**
```
Visit: https://your-user-service-url.up.railway.app/health
Should return: {"status": "healthy"}
```

**4. Auth Service:**
```
Visit: https://your-auth-service-url.up.railway.app/health
Should return: {"status": "healthy"}
```

**5. PDF Service:**
```
Visit: https://your-pdf-service-url.up.railway.app/health
Should return: {"status": "healthy"}
```

**6. Frontend Dashboard:**
```
Visit: https://health-twin-dashboard.vercel.app
✅ All pages should load
✅ Try logging in
✅ Try generating a report
```

---

## 📊 YOUR DEPLOYMENT URLS

**Fill these in as you deploy:**

### Frontend:
- Dashboard: https://health-twin-dashboard.vercel.app

### Backend Services (Railway):
- PostgreSQL: `postgresql://...` (from Variables tab)
- Risk Engine: `https://________________.up.railway.app`
- User Service: `https://________________.up.railway.app`
- Auth Service: `https://________________.up.railway.app`
- PDF Service: `https://________________.up.railway.app`

### GitHub:
- Repository: https://github.com/sumtsco-web/health-twin-platform

---

## 🔧 TROUBLESHOOTING

### Service Won't Deploy:

**Check:**
1. Root directory is correct
2. All environment variables are set
3. Check "Logs" tab for errors

**Common Fixes:**
- Redeploy: Deployments → "..." → "Redeploy"
- Check build logs for missing dependencies
- Verify DATABASE_URL is correct

### Database Connection Fails:

**Check:**
1. DATABASE_URL is copied correctly (no extra spaces)
2. PostgreSQL service is running (green status)
3. All services have the same DATABASE_URL

### CORS Errors:

**Check:**
1. CORS_ORIGIN matches Vercel URL exactly
2. No trailing slash in URLs
3. HTTPS (not HTTP)

### Frontend Can't Connect to Backend:

**Check:**
1. All Vercel environment variables are set
2. Vercel has been redeployed after adding variables
3. Backend service URLs are correct (with https://)

---

## 💰 COST SUMMARY

**Monthly Costs:**
- Vercel: $0 (Free tier)
- Railway: $5-10 (Hobby plan with $5 credit)
- GitHub: $0 (Free)

**Total: ~$5-10/month**

---

## 🎉 SUCCESS CRITERIA

You'll know everything is working when:

✅ All 5 Railway services show "Active" status
✅ All health endpoints return `{"status": "healthy"}`
✅ Frontend dashboard loads without errors
✅ You can navigate between all pages
✅ Login/Register pages work
✅ Settings save successfully
✅ Reports can be generated

---

## 📞 SUPPORT

**Railway:**
- Dashboard: https://railway.com/project/43b2959a-d185-4755-bed3-3a58cdb1ac13
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Vercel:**
- Dashboard: https://vercel.com/dr-ais-projects-9efd6b07/health-twin-dashboard
- Docs: https://vercel.com/docs

---

## ⏭️ NEXT STEPS AFTER DEPLOYMENT

1. **Custom Domain:**
   - Add `dashboard.healthtwin.com` in Vercel
   - Add `api.healthtwin.com` in Railway

2. **Monitoring:**
   - Set up Railway alerts
   - Enable Vercel Analytics

3. **Security:**
   - Change JWT_SECRET to a strong random value
   - Enable 2FA on GitHub and Railway
   - Review CORS settings

4. **Scaling:**
   - Monitor Railway usage
   - Upgrade plan if needed
   - Consider CDN for assets

---

**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate  
**Result:** Fully deployed production platform! 🚀

---

**Start with Step 1 and work through each step carefully. Let me know when you complete each step or if you encounter any issues!**
