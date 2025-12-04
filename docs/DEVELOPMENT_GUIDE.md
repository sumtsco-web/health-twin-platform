# Health Twin™ - Development & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.10+
- **Docker** and Docker Compose
- **Expo CLI** (for mobile development)
- **Git**

---

## 📦 Project Structure

```
health-twin/
├── backend/
│   ├── services/
│   │   ├── user-service/          # Node.js - User management
│   │   ├── auth-service/          # Node.js - Authentication
│   │   └── risk-engine-service/   # Python - AI Risk Calculation
│   └── shared/                     # Shared utilities
├── frontend/
│   ├── corporate-dashboard/       # Next.js - Corporate Web App
│   └── mobile-app/                # React Native - User Mobile App
├── infrastructure/
│   └── docker/
└── docs/
```

---

## 🏗️ Infrastructure Setup

### 1. Start Databases (Docker)

```bash
# From project root
docker-compose up -d
```

This starts:
- **PostgreSQL + TimescaleDB** (port 5432)
- **MongoDB** (port 27017)
- **Redis** (port 6379)
- **Kafka + Zookeeper** (port 9092)

**Verify:**
```bash
docker ps
```

---

## 🔧 Backend Services

### A. Risk Engine (Python)

```bash
cd backend/services/risk-engine-service

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the service
python app/main.py
```

**Service runs on:** `http://localhost:8005`

**Test the API:**
```bash
curl -X POST http://localhost:8005/api/v1/risk/cardiac \
  -H "Content-Type: application/json" \
  -d '{
    "age": 45,
    "resting_hr": 82,
    "hrv_sdnn": 45,
    "hrv_rmssd": 18,
    "systolic_bp": 135,
    "diastolic_bp": 85,
    "bmi": 28
  }'
```

### B. User Service (Node.js)

```bash
cd backend/services/user-service

# Install dependencies
npm install

# Run in development mode
npm run dev
```

**Service runs on:** `http://localhost:8001`

### C. Auth Service (Node.js)

```bash
cd backend/services/auth-service

# Install dependencies
npm install

# Run in development mode
npm run dev
```

**Service runs on:** `http://localhost:8002`

---

## 🎨 Frontend Applications

### A. Corporate Dashboard (Next.js)

```bash
cd frontend/corporate-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

**Access at:** `http://localhost:3000`

**Features:**
- Real-time risk monitoring
- Employee health heatmap
- Interactive charts
- Alert management

**Build for production:**
```bash
npm run build
npm start
```

### B. Mobile App (React Native + Expo)

```bash
cd frontend/mobile-app

# Install dependencies
npm install

# Start Expo development server
npm start
```

**Run on devices:**
```bash
# Android
npm run android

# iOS (Mac only)
npm run ios

# Web (for testing)
npm run web
```

**Scan QR code** with Expo Go app on your phone.

---

## 🔗 API Integration Flow

```
Mobile App → API Service → Risk Engine (Python) → Response
                ↓
        Corporate Dashboard
```

### Mobile App API Configuration

The mobile app automatically detects the platform:
- **Android Emulator:** Uses `http://10.0.2.2:8005`
- **iOS Simulator:** Uses `http://localhost:8005`
- **Physical Device:** Update `src/services/api.ts` with your computer's IP

**Find your IP:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

Then update `api.ts`:
```typescript
const DEV_API_URL = 'http://YOUR_IP_ADDRESS:8005/api/v1';
```

---

## 🧪 Testing the Full Stack

### 1. Start All Services

**Terminal 1 - Databases:**
```bash
docker-compose up
```

**Terminal 2 - Risk Engine:**
```bash
cd backend/services/risk-engine-service
venv\Scripts\activate  # or source venv/bin/activate
python app/main.py
```

**Terminal 3 - Corporate Dashboard:**
```bash
cd frontend/corporate-dashboard
npm run dev
```

**Terminal 4 - Mobile App:**
```bash
cd frontend/mobile-app
npm start
```

### 2. Verify Integration

1. Open **Corporate Dashboard** at `http://localhost:3000`
2. Check that risk scores are displayed
3. Open **Mobile App** on your device/emulator
4. Pull to refresh - data should sync

---

## 📊 Database Schema Setup

### PostgreSQL/TimescaleDB

```sql
-- Connect to database
psql -U admin -d healthtwin_core

-- Create users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create vital_signs hypertable (TimescaleDB)
CREATE TABLE vital_signs (
  time TIMESTAMPTZ NOT NULL,
  user_id UUID NOT NULL,
  metric_type VARCHAR(50),
  value FLOAT,
  device_source VARCHAR(100)
);

SELECT create_hypertable('vital_signs', 'time');
```

---

## 🔐 Environment Variables

### Backend Services

Create `.env` files in each service directory:

**risk-engine-service/.env:**
```env
PORT=8005
LOG_LEVEL=INFO
```

**user-service/.env:**
```env
PORT=8001
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=healthtwin_core
JWT_SECRET=your-secret-key-here
```

**auth-service/.env:**
```env
PORT=8002
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=1h
```

### Frontend

**corporate-dashboard/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8005
```

---

## 🚢 Production Deployment

### Docker Build

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment (AWS/Azure/GCP)

1. **Containerize** all services
2. **Push** to container registry (ECR/ACR/GCR)
3. **Deploy** to Kubernetes cluster
4. **Configure** load balancers and DNS
5. **Enable** SSL/TLS certificates

---

## 📱 Mobile App Deployment

### iOS (App Store)

```bash
cd frontend/mobile-app

# Build for production
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android (Google Play)

```bash
# Build APK/AAB
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

---

## 🔍 Troubleshooting

### Issue: Mobile app can't connect to backend

**Solution:**
1. Ensure Risk Engine is running on port 8005
2. Check firewall settings
3. For physical devices, use your computer's IP address
4. Verify the API URL in `src/services/api.ts`

### Issue: Dashboard shows "Backend unavailable"

**Solution:**
1. Check if Python service is running: `curl http://localhost:8005/`
2. Check browser console for CORS errors
3. Verify the API route in `src/app/api/risk/route.ts`

### Issue: Database connection failed

**Solution:**
```bash
# Restart Docker containers
docker-compose down
docker-compose up -d

# Check logs
docker logs healthtwin-timescaledb
```

---

## 📚 API Documentation

### Risk Engine Endpoints

**POST /api/v1/risk/cardiac**
```json
{
  "age": 45,
  "resting_hr": 82,
  "hrv_sdnn": 45,
  "hrv_rmssd": 18,
  "systolic_bp": 135,
  "diastolic_bp": 85,
  "bmi": 28
}
```

**Response:**
```json
{
  "risk_score": 45,
  "risk_level": "Moderate",
  "risk_factors": [
    "Critically Low HRV (SDNN < 50ms)",
    "Low Vagal Tone (RMSSD < 20ms)"
  ],
  "clinical_note": "Risk score calculated based on HRV..."
}
```

**POST /api/v1/risk/fatigue**
```json
{
  "last_sleep_duration_hours": 5.5,
  "avg_sleep_7days": 6.0,
  "hours_awake": 18,
  "current_hour": 3,
  "shift_type": "night"
}
```

---

## 🎯 Next Steps

1. **Wearable Integration:** Connect Apple Health/Google Fit APIs
2. **Real-time Alerts:** Implement WebSocket for live notifications
3. **Machine Learning:** Train models on real user data
4. **Compliance:** Complete HIPAA/GDPR audit
5. **Scale Testing:** Load test with 10,000+ concurrent users

---

## 📞 Support

For issues or questions:
- **Documentation:** `/docs` folder
- **API Specs:** `/docs/api-specs/API_SPECIFICATION.md`
- **Architecture:** `/docs/architecture/SYSTEM_ARCHITECTURE.md`

---

**Version:** 1.0.0-alpha  
**Last Updated:** December 2025
