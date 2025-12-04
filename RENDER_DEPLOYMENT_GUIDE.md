# 🚀 Render.com Deployment Guide - Health Twin™

**Account:** ✅ Created via GitHub  
**Time Needed:** 20-30 minutes  
**Cost:** $0/month (FREE!)

---

## 📋 DEPLOYMENT STEPS

### **STEP 1: Deploy PostgreSQL Database** ⚡

**Go to:** https://dashboard.render.com/

1. Click **"New +"** button (top right)

2. Select **"PostgreSQL"**

3. Fill in the form:
   - **Name:** `health-twin-db`
   - **Database:** `healthtwin`
   - **User:** `healthtwin_user`
   - **Region:** Choose closest to you (e.g., Oregon USA, Frankfurt EU, Singapore)
   - **PostgreSQL Version:** 16 (latest)
   - **Datadog API Key:** Leave blank
   - **Plan:** Select **"Free"**

4. Click **"Create Database"**

5. Wait 30-60 seconds for deployment

6. Once deployed, click on the database name

7. Scroll down to **"Connections"** section

8. **COPY the "Internal Database URL"** (starts with `postgresql://`)
   - It looks like: `postgresql://healthtwin_user:xxxxx@dpg-xxxxx/healthtwin`
   - **SAVE THIS!** You'll need it for all 3 backend services

9. Keep this tab open!

✅ **Database deployed!** (1/5 complete)

---

### **STEP 2: Deploy Risk Engine Service** 🧠

1. Go back to Render dashboard: https://dashboard.render.com/

2. Click **"New +"** → **"Web Service"**

3. **Connect Repository:**
   - If first time: Click **"Connect account"** → Authorize Render
   - Select **"sumtsco-web/health-twin-platform"**
   - Click **"Connect"**

4. **Configure the service:**
   
   **Basic Info:**
   - **Name:** `health-twin-risk-engine`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend/services/risk-engine-service`
   - **Runtime:** **Python 3**

   **Build & Deploy:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   **Plan:**
   - Select **"Free"**

5. **Add Environment Variables:**
   - Click **"Advanced"** button
   - Click **"Add Environment Variable"**
   
   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: [Paste the Internal Database URL from Step 1]
   
   **Variable 2:**
   - Key: `PORT`
   - Value: `8005`
   
   **Variable 3:**
   - Key: `CORS_ORIGINS`
   - Value: `["https://health-twin-dashboard.vercel.app"]`

6. Click **"Create Web Service"**

7. Wait 3-5 minutes for build and deployment
   - You'll see logs scrolling
   - Wait for **"Your service is live 🎉"** message

8. Once live, **COPY THE URL** (e.g., `https://health-twin-risk-engine.onrender.com`)
   - **SAVE THIS URL!**

✅ **Risk Engine deployed!** (2/5 complete)

---

### **STEP 3: Deploy User Service** 👥

1. Click **"New +"** → **"Web Service"**

2. Select **"sumtsco-web/health-twin-platform"**

3. **Configure:**
   - **Name:** `health-twin-user-service`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend/services/user-service`
   - **Runtime:** **Node**

   **Build & Deploy:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`

   **Plan:** **Free**

4. **Environment Variables:**
   
   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: [Paste Database URL]
   
   **Variable 2:**
   - Key: `JWT_SECRET`
   - Value: `health-twin-jwt-secret-key-2024-change-in-production`
   
   **Variable 3:**
   - Key: `PORT`
   - Value: `8001`
   
   **Variable 4:**
   - Key: `CORS_ORIGIN`
   - Value: `https://health-twin-dashboard.vercel.app`
   
   **Variable 5:**
   - Key: `NODE_ENV`
   - Value: `production`

5. Click **"Create Web Service"**

6. Wait for deployment (3-5 minutes)

7. **COPY AND SAVE THE URL**

✅ **User Service deployed!** (3/5 complete)

---

### **STEP 4: Deploy Auth Service** 🔐

1. Click **"New +"** → **"Web Service"**

2. Select **"sumtsco-web/health-twin-platform"**

3. **Configure:**
   - **Name:** `health-twin-auth-service`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend/services/auth-service`
   - **Runtime:** **Node**

   **Build & Deploy:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`

   **Plan:** **Free**

4. **Environment Variables:**
   
   - `DATABASE_URL` = [Paste Database URL]
   - `JWT_SECRET` = `health-twin-jwt-secret-key-2024-change-in-production`
   - `JWT_EXPIRY` = `7d`
   - `PORT` = `8002`
   - `CORS_ORIGIN` = `https://health-twin-dashboard.vercel.app`
   - `NODE_ENV` = `production`

5. Click **"Create Web Service"**

6. Wait for deployment

7. **SAVE THE URL**

✅ **Auth Service deployed!** (4/5 complete)

---

### **STEP 5: Deploy PDF Service** 📄

1. Click **"New +"** → **"Web Service"**

2. Select **"sumtsco-web/health-twin-platform"**

3. **Configure:**
   - **Name:** `health-twin-pdf-service`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend/services/pdf-service`
   - **Runtime:** **Node**

   **Build & Deploy:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`

   **Plan:** **Free**

4. **Environment Variables:**
   
   - `PORT` = `8006`
   - `CORS_ORIGIN` = `https://health-twin-dashboard.vercel.app`
   - `NODE_ENV` = `production`

5. Click **"Create Web Service"**

6. Wait for deployment

7. **SAVE THE URL**

✅ **PDF Service deployed!** (5/5 complete)

---

## 📝 YOUR SERVICE URLS

**Save these as you deploy:**

- ✅ Database: `postgresql://healthtwin_user:___@dpg-___/healthtwin`
- ✅ Risk Engine: `https://health-twin-risk-engine.onrender.com`
- ✅ User Service: `https://health-twin-user-service.onrender.com`
- ✅ Auth Service: `https://health-twin-auth-service.onrender.com`
- ✅ PDF Service: `https://health-twin-pdf-service.onrender.com`

---

## 🔧 STEP 6: Update Vercel Environment Variables

1. **Go to:** https://vercel.com/dr-ais-projects-9efd6b07/health-twin-dashboard/settings/environment-variables

2. **Add these 4 variables:**

   **Click "Add New" for each:**

   **Variable 1:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://health-twin-user-service.onrender.com`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 2:**
   - Key: `NEXT_PUBLIC_RISK_ENGINE_URL`
   - Value: `https://health-twin-risk-engine.onrender.com`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 3:**
   - Key: `NEXT_PUBLIC_AUTH_URL`
   - Value: `https://health-twin-auth-service.onrender.com`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 4:**
   - Key: `NEXT_PUBLIC_PDF_URL`
   - Value: `https://health-twin-pdf-service.onrender.com`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

3. **Redeploy Vercel:**
   - Go to **"Deployments"** tab
   - Find the latest deployment
   - Click the **"..."** menu
   - Click **"Redeploy"**
   - Wait 2-3 minutes for redeployment

✅ **Vercel updated!**

---

## 🧪 STEP 7: Test Everything

### **Test Backend Services:**

**1. Risk Engine:**
```
Visit: https://health-twin-risk-engine.onrender.com/health
Should show: {"status": "healthy"}
```

**2. User Service:**
```
Visit: https://health-twin-user-service.onrender.com/health
Should show: {"status": "healthy"}
```

**3. Auth Service:**
```
Visit: https://health-twin-auth-service.onrender.com/health
Should show: {"status": "healthy"}
```

**4. PDF Service:**
```
Visit: https://health-twin-pdf-service.onrender.com/health
Should show: {"status": "healthy"}
```

### **Test Frontend:**

**Visit:** https://health-twin-dashboard.vercel.app

**Check:**
- ✅ Dashboard loads
- ✅ All pages accessible
- ✅ No console errors
- ✅ Data displays correctly

---

## 🎉 SUCCESS CRITERIA

**You'll know it's working when:**

✅ All 5 services show "Live" status in Render  
✅ All health endpoints return `{"status": "healthy"}`  
✅ Frontend dashboard loads without errors  
✅ You can navigate between pages  
✅ No CORS errors in browser console  

---

## 🔧 TROUBLESHOOTING

### **Service Build Fails:**

**Check:**
1. Go to service in Render
2. Click "Logs" tab
3. Look for error messages
4. Common issues:
   - Missing dependencies → Check package.json
   - Wrong root directory → Verify path
   - Build command error → Check syntax

**Fix:**
- Update environment variables
- Click "Manual Deploy" → "Deploy latest commit"

### **Service Crashes After Deploy:**

**Check:**
1. Logs tab for runtime errors
2. Environment variables are all set
3. DATABASE_URL is correct

**Fix:**
- Verify all env vars
- Redeploy

### **CORS Errors:**

**Check:**
1. CORS_ORIGIN matches Vercel URL exactly
2. No trailing slash
3. Uses https:// not http://

**Fix:**
- Update CORS_ORIGIN env var
- Redeploy service

### **Database Connection Fails:**

**Check:**
1. DATABASE_URL is the "Internal" URL (not External)
2. All services use same DATABASE_URL
3. Database is "Available" status

---

## 💰 COST BREAKDOWN

**Render Free Tier Includes:**
- ✅ PostgreSQL: 1 GB storage, 97 hours/month
- ✅ Web Services: 750 hours/month each (4 services = 3000 hours)
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ Auto-deploy from GitHub

**Total Cost: $0/month** 🎉

**Note:** Free services sleep after 15 min of inactivity. First request after sleep takes 30-60 seconds to wake up.

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] PostgreSQL database created
- [ ] Risk Engine deployed
- [ ] User Service deployed
- [ ] Auth Service deployed
- [ ] PDF Service deployed
- [ ] All service URLs saved
- [ ] Vercel environment variables added
- [ ] Vercel redeployed
- [ ] All health checks passing
- [ ] Frontend loads successfully

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Run Database Migrations:**
   - Connect to PostgreSQL using the External URL
   - Run: `backend/database/migrations/001_initial_schema.sql`

2. **Monitor Services:**
   - Check Render dashboard regularly
   - Review logs for errors
   - Monitor uptime

3. **Custom Domains (Optional):**
   - Add custom domain in Render
   - Update Vercel environment variables

4. **Upgrade to Paid (When Ready):**
   - Remove sleep time
   - More resources
   - Better performance

---

## 📞 SUPPORT

**Render Dashboard:** https://dashboard.render.com/  
**Render Docs:** https://render.com/docs  
**Render Status:** https://status.render.com/

**Vercel Dashboard:** https://vercel.com/dr-ais-projects-9efd6b07/health-twin-dashboard  
**GitHub Repo:** https://github.com/sumtsco-web/health-twin-platform

---

## ⏱️ TIME ESTIMATE

- Database: 2 minutes
- Risk Engine: 5 minutes
- User Service: 5 minutes
- Auth Service: 5 minutes
- PDF Service: 5 minutes
- Update Vercel: 3 minutes
- Testing: 5 minutes

**Total: ~30 minutes**

---

**Ready to start? Go to:** https://dashboard.render.com/

**Click:** "New +" → "PostgreSQL"

**Let me know when you've created the database and I'll help with the next steps!** 🚀
