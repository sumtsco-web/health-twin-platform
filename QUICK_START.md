# ⚡ Health Twin™ - Quick Start Card

## 🎯 What's Running Right Now

| Service | URL | Status |
|---------|-----|--------|
| **Corporate Dashboard** | http://localhost:3000 | ✅ LIVE |
| **Risk Engine API** | http://localhost:8005 | ✅ LIVE |
| **Mobile App** | Scan QR / Press `w` | ✅ LIVE |

---

## 🚀 Access Your Apps

### Corporate Dashboard
```
http://localhost:3000
```
**Pages:**
- `/` - Dashboard Overview
- `/employees` - Employee Health Grid
- `/alerts` - Critical Alerts
- `/monitoring` - Live Vital Signs

### Mobile App
**Option 1:** Scan QR code with Expo Go  
**Option 2:** Press `w` in terminal for web view

### API Testing
```bash
curl http://localhost:8005/api/v1/risk/cardiac \
  -H "Content-Type: application/json" \
  -d '{"age": 45, "resting_hr": 82, "hrv_sdnn": 45, "hrv_rmssd": 18, "systolic_bp": 135, "diastolic_bp": 85, "bmi": 28}'
```

---

## 📁 Key Files

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `PROJECT_SUMMARY.md` | Complete deliverables list |
| `DEMO_GUIDE.md` | Step-by-step demo instructions |
| `docs/DEVELOPMENT_GUIDE.md` | Setup & deployment |
| `docs/architecture/SYSTEM_ARCHITECTURE.md` | Technical design |
| `docs/api-specs/API_SPECIFICATION.md` | API reference |

---

## 🎨 Features Implemented

✅ Evidence-based AI risk models  
✅ Real-time data integration  
✅ Premium glassmorphism UI  
✅ Animated Digital Twin  
✅ Interactive charts  
✅ Search & filters  
✅ Mobile + Web apps  
✅ Microservices architecture  
✅ Docker infrastructure  
✅ Complete documentation  

---

## 🔬 AI Models

### Cardiac Risk
- **Inputs:** Age, HR, HRV, BP, BMI
- **Output:** Risk score (0-100) + factors
- **Science:** HRV analysis, Framingham Study

### Fatigue Assessment
- **Inputs:** Sleep data, hours awake, time of day
- **Output:** Fatigue score + fit-to-work status
- **Science:** Two-Process Model, circadian rhythm

---

## 🎯 Quick Demo (2 Minutes)

1. **Open Dashboard** → http://localhost:3000
2. **View real-time data** on homepage
3. **Click Employees** → See health grid
4. **Click Alerts** → View critical warnings
5. **Open Mobile App** → Press `w` in terminal
6. **Pull to refresh** → Watch scores update

---

## 🛠️ Stop/Restart Services

### Stop All
Press `Ctrl+C` in each terminal window

### Restart Dashboard
```bash
cd frontend/corporate-dashboard
npm run dev
```

### Restart Risk Engine
```bash
cd backend/services/risk-engine-service
.\venv\Scripts\python.exe app\main.py
```

### Restart Mobile App
```bash
cd frontend/mobile-app
npm start
```

---

## 📞 Need Help?

**Documentation:** Check `DEMO_GUIDE.md` for detailed walkthrough  
**API Docs:** http://localhost:8005/docs  
**Architecture:** `docs/architecture/SYSTEM_ARCHITECTURE.md`  

---

## 🎉 You're All Set!

**Health Twin™ is fully operational and ready to demo.**

**Built with:** Next.js • React Native • Python FastAPI • TypeScript  
**Status:** ✅ MVP Complete  
**Version:** 1.0.0-alpha  
