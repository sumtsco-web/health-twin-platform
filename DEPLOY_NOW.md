# 🚀 Railway Deployment - LIVE GUIDE

**Project:** health-twin-platform  
**Status:** Ready to Deploy  
**Time:** ~30 minutes

---

## ✅ PROJECT LINKED

Your local project is now linked to Railway!

---

## 🎯 DEPLOYMENT METHOD

**We'll use the Railway Dashboard** (web interface) because it's:
- More visual and easier to follow
- Better for first-time deployment
- Allows you to see everything clearly

---

## 📋 STEP-BY-STEP DEPLOYMENT

### **STEP 1: Add PostgreSQL Database** ⚡

**Open this URL:** https://railway.com/project/43b2959a-d185-4755-bed3-3a58cdb1ac13

**Then:**

1. Click the **"+ New"** button (top right)

2. Select **"Database"**

3. Click **"Add PostgreSQL"**

4. Wait 30 seconds for deployment

5. Click on the **PostgreSQL** service (purple database icon)

6. Click the **"Variables"** tab

7. Find **`DATABASE_URL`** and click the **copy icon** 📋

8. **PASTE IT HERE** (in a text file or notepad) - you'll need it 5 times!

**Your DATABASE_URL:**
```
postgresql://postgres:_______________@_____.railway.app:5432/railway
```

✅ **Database deployed!** (1/5 services complete)

---

### **STEP 2: Deploy Risk Engine** 🧠

**In Railway Dashboard:**

1. Click **"+ New"** button

2. Select **"GitHub Repo"**

3. **First time?** You'll need to authorize:
   - Click **"Configure GitHub App"**
   - Select **"sumtsco-web"** organization
   - Choose **"Only select repositories"**
   - Select **"health-twin-platform"**
   - Click **"Install & Authorize"**

4. Select **`sumtsco-web/health-twin-platform`**

5. Click **"Deploy"**

6. **Configure the service:**
   - Click on the newly created service
   - Go to **"Settings"** tab
   - Scroll to **"Root Directory"**
   - Enter: `backend/services/risk-engine-service`
   - Click **"Update"**

7. **Add Environment Variables:**
   - Go to **"Variables"** tab
   - Click **"+ New Variable"**
   
   **Add Variable 1:**
   - Key: `DATABASE_URL`
   - Value: [PASTE your DATABASE_URL from Step 1]
   - Click **"Add"**
   
   **Add Variable 2:**
   - Key: `PORT`
   - Value: `8005`
   - Click **"Add"**
   
   **Add Variable 3:**
   - Key: `CORS_ORIGINS`
   - Value: `["https://health-twin-dashboard.vercel.app"]`
   - Click **"Add"**

8. **Generate Public URL:**
   - Go to **"Settings"** tab
   - Scroll to **"Networking"**
   - Click **"Generate Domain"**
   - **COPY THE URL** (e.g., `https://risk-engine-production.up.railway.app`)
   - **SAVE IT!** You'll need this for Vercel

9. **Wait for deployment:**
   - Go to **"Deployments"** tab
   - Wait for **green checkmark** ✅
   - Takes 2-3 minutes

✅ **Risk Engine deployed!** (2/5 services complete)

---

### **STEP 3: Deploy User Service** 👥

**Repeat similar steps:**

1. Click **"+ New"** → **"GitHub Repo"**

2. Select **`sumtsco-web/health-twin-platform`**

3. Click **"Deploy"**

4. **Settings** → **Root Directory:** `backend/services/user-service`

5. **Variables** → Add these:
   - `DATABASE_URL` = [Your PostgreSQL URL]
   - `JWT_SECRET` = `health-twin-secret-key-2024-change-in-production`
   - `PORT` = `8001`
   - `CORS_ORIGIN` = `https://health-twin-dashboard.vercel.app`

6. **Settings** → **Networking** → **Generate Domain**

7. **SAVE THE URL!**

8. Wait for deployment ✅

✅ **User Service deployed!** (3/5 services complete)

---

### **STEP 4: Deploy Auth Service** 🔐

1. Click **"+ New"** → **"GitHub Repo"**

2. Select **`sumtsco-web/health-twin-platform`**

3. **Settings** → **Root Directory:** `backend/services/auth-service`

4. **Variables:**
   - `DATABASE_URL` = [Your PostgreSQL URL]
   - `JWT_SECRET` = `health-twin-secret-key-2024-change-in-production`
   - `JWT_EXPIRY` = `7d`
   - `PORT` = `8002`
   - `CORS_ORIGIN` = `https://health-twin-dashboard.vercel.app`

5. **Generate Domain** and **SAVE URL**

6. Wait for deployment ✅

✅ **Auth Service deployed!** (4/5 services complete)

---

### **STEP 5: Deploy PDF Service** 📄

1. Click **"+ New"** → **"GitHub Repo"**

2. Select **`sumtsco-web/health-twin-platform`**

3. **Settings** → **Root Directory:** `backend/services/pdf-service`

4. **Variables:**
   - `PORT` = `8006`
   - `CORS_ORIGIN` = `https://health-twin-dashboard.vercel.app`

5. **Generate Domain** and **SAVE URL**

6. Wait for deployment ✅

✅ **PDF Service deployed!** (5/5 services complete)

---

## 📝 SAVE YOUR URLS

**Fill these in as you deploy:**

- PostgreSQL: `postgresql://postgres:___@___.railway.app:5432/railway`
- Risk Engine: `https://________________.up.railway.app`
- User Service: `https://________________.up.railway.app`
- Auth Service: `https://________________.up.railway.app`
- PDF Service: `https://________________.up.railway.app`

---

## ⏭️ AFTER ALL 5 SERVICES ARE DEPLOYED

### **Update Vercel Environment Variables:**

1. Go to: https://vercel.com/dr-ais-projects-9efd6b07/health-twin-dashboard/settings/environment-variables

2. Click **"Add New"** for each:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: [Your User Service URL]
   - Environments: Production, Preview, Development
   - Click **"Save"**

   **Variable 2:**
   - Key: `NEXT_PUBLIC_RISK_ENGINE_URL`
   - Value: [Your Risk Engine URL]
   - Click **"Save"**

   **Variable 3:**
   - Key: `NEXT_PUBLIC_AUTH_URL`
   - Value: [Your Auth Service URL]
   - Click **"Save"**

   **Variable 4:**
   - Key: `NEXT_PUBLIC_PDF_URL`
   - Value: [Your PDF Service URL]
   - Click **"Save"**

3. **Redeploy Vercel:**
   - Go to **"Deployments"** tab
   - Click **"..."** menu on latest deployment
   - Click **"Redeploy"**
   - Wait for completion

---

## 🧪 TEST EVERYTHING

**Test each service:**

1. **Risk Engine:** Visit `https://your-risk-engine-url/health`
   - Should return: `{"status": "healthy"}`

2. **User Service:** Visit `https://your-user-service-url/health`
   - Should return: `{"status": "healthy"}`

3. **Auth Service:** Visit `https://your-auth-service-url/health`
   - Should return: `{"status": "healthy"}`

4. **PDF Service:** Visit `https://your-pdf-service-url/health`
   - Should return: `{"status": "healthy"}`

5. **Dashboard:** Visit `https://health-twin-dashboard.vercel.app`
   - All pages should load
   - Try navigating around

---

## 🎉 SUCCESS!

Once all services show ✅ and health checks pass, your **Health Twin™ platform is FULLY DEPLOYED!**

---

## 📞 NEED HELP?

**If any step fails:**
1. Check the **"Logs"** tab in Railway for errors
2. Verify environment variables are correct
3. Make sure root directory is set correctly
4. Try redeploying the service

**Common issues:**
- Build fails → Check logs for missing dependencies
- Service crashes → Verify environment variables
- Can't connect → Check CORS settings

---

**Start with Step 1 now!** 🚀

Open: https://railway.com/project/43b2959a-d185-4755-bed3-3a58cdb1ac13
