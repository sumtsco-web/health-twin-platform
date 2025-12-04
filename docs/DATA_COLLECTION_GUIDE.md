# Health Twin™ - Employee Data Collection Architecture

**Version:** 1.0  
**Date:** December 4, 2025  
**Purpose:** Complete guide on how the system collects employee health information

---

## 📊 OVERVIEW

The Health Twin™ platform collects employee health data through **multiple channels** to create a comprehensive digital health replica. Data flows from various sources into the central platform for AI analysis.

---

## 🔄 DATA COLLECTION METHODS

### 1. **Wearable Devices Integration** (Primary Source)

**Supported Devices:**
- Apple Watch
- Fitbit
- Garmin
- Samsung Galaxy Watch
- Whoop
- Oura Ring
- Polar devices

**Data Collected:**
- ✅ Heart Rate (continuous)
- ✅ Heart Rate Variability (HRV)
- ✅ Sleep patterns (duration, quality, stages)
- ✅ Activity levels (steps, calories, exercise)
- ✅ Blood Oxygen (SpO2)
- ✅ Body temperature
- ✅ Stress levels
- ✅ Respiratory rate

**How It Works:**
```
Wearable Device → Device API → Health Twin API → Database → AI Analysis
```

**Implementation:**
```typescript
// Example: Apple HealthKit Integration
import HealthKit from 'react-native-health';

async function syncWearableData(userId: string) {
  // Request permissions
  const permissions = {
    permissions: {
      read: [
        HealthKit.Constants.Permissions.HeartRate,
        HealthKit.Constants.Permissions.HeartRateVariability,
        HealthKit.Constants.Permissions.SleepAnalysis,
        HealthKit.Constants.Permissions.Steps,
      ],
    },
  };

  // Fetch latest data
  const heartRateData = await HealthKit.getHeartRateSamples({
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // Send to backend
  await fetch('http://api.healthtwin.com/api/v1/vitals/sync', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      heartRate: heartRateData,
      timestamp: new Date(),
    }),
  });
}
```

---

### 2. **Mobile App (Self-Reporting)**

**Data Collected:**
- ✅ Daily check-ins (How do you feel?)
- ✅ Symptom reporting
- ✅ Medication tracking
- ✅ Sleep quality ratings
- ✅ Stress levels (self-assessed)
- ✅ Fatigue levels
- ✅ Pain levels
- ✅ Mood tracking

**How It Works:**
```
Employee Mobile App → User Input → API → Database
```

**Implementation:**
```typescript
// Daily Check-in Form
interface DailyCheckIn {
  userId: string;
  date: Date;
  overallFeeling: 1 | 2 | 3 | 4 | 5; // 1=Poor, 5=Excellent
  fatigueLevel: number; // 0-100
  stressLevel: number; // 0-100
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  symptoms: string[];
  notes?: string;
}

// Submit daily check-in
async function submitDailyCheckIn(data: DailyCheckIn) {
  await fetch('/api/v1/checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
```

---

### 3. **Medical Records Integration**

**Data Sources:**
- Electronic Health Records (EHR) systems
- Occupational health clinic records
- Pre-employment medical assessments
- Annual health screenings

**Data Collected:**
- ✅ Medical history
- ✅ Chronic conditions
- ✅ Medications
- ✅ Allergies
- ✅ Previous injuries
- ✅ Lab results
- ✅ Vital signs from clinic visits
- ✅ Vaccination records

**How It Works:**
```
Hospital/Clinic EHR → HL7/FHIR API → Health Twin → Database
```

**Implementation:**
```typescript
// FHIR Integration Example
import { Client } from 'fhir-kit-client';

const fhirClient = new Client({
  baseUrl: 'https://hospital-ehr.com/fhir',
});

async function fetchMedicalRecords(patientId: string) {
  // Fetch patient data
  const patient = await fhirClient.read({
    resourceType: 'Patient',
    id: patientId,
  });

  // Fetch conditions
  const conditions = await fhirClient.search({
    resourceType: 'Condition',
    searchParams: { patient: patientId },
  });

  // Fetch medications
  const medications = await fhirClient.search({
    resourceType: 'MedicationStatement',
    searchParams: { patient: patientId },
  });

  return { patient, conditions, medications };
}
```

---

### 4. **Environmental Sensors** (Workplace)

**Sensors Deployed:**
- Temperature sensors
- Humidity sensors
- Air quality monitors
- Noise level monitors
- Light intensity sensors

**Data Collected:**
- ✅ Ambient temperature
- ✅ Heat stress index (WBGT)
- ✅ Air quality (CO2, particulates)
- ✅ Noise exposure
- ✅ Light levels

**How It Works:**
```
IoT Sensors → MQTT/HTTP → Health Twin API → Database
```

**Implementation:**
```typescript
// IoT Sensor Data Ingestion
interface EnvironmentalData {
  sensorId: string;
  location: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  noiseLevel: number;
  timestamp: Date;
}

// MQTT Subscription
import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://iot.healthtwin.com');

client.on('message', (topic, message) => {
  const data: EnvironmentalData = JSON.parse(message.toString());
  
  // Store in database
  await db.environmentalData.create(data);
  
  // Check for hazardous conditions
  if (data.temperature > 35 || data.airQuality > 150) {
    triggerEnvironmentalAlert(data);
  }
});
```

---

### 5. **HR System Integration**

**Data Sources:**
- HRIS (Human Resources Information System)
- Payroll system
- Time & attendance system

**Data Collected:**
- ✅ Employee demographics
- ✅ Department/role
- ✅ Shift schedules
- ✅ Work hours
- ✅ Overtime hours
- ✅ Leave records
- ✅ Job hazards/risk factors

**How It Works:**
```
HR System → REST API → Health Twin → Database
```

**Implementation:**
```typescript
// HR System Sync
interface EmployeeHRData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  shiftPattern: string;
  startDate: Date;
  riskCategory: 'low' | 'medium' | 'high';
}

async function syncHRData() {
  // Fetch from HR system
  const employees = await fetch('https://hr-system.com/api/employees');
  
  // Update Health Twin database
  for (const emp of employees) {
    await db.users.upsert({
      where: { employeeCode: emp.employeeId },
      update: emp,
      create: emp,
    });
  }
}
```

---

### 6. **Manual Data Entry** (Admin/Medical Staff)

**Entry Points:**
- Corporate dashboard
- Medical professional portal
- Occupational health clinic interface

**Data Entered:**
- ✅ Medical assessments
- ✅ Fitness-to-work evaluations
- ✅ Incident reports
- ✅ Health screening results
- ✅ Doctor's notes

**How It Works:**
```
Medical Staff → Dashboard Form → API → Database
```

---

## 🔐 DATA COLLECTION WORKFLOW

### Step-by-Step Process:

**1. Employee Onboarding**
```
1. Employee hired
2. HR creates account in system
3. Employee receives welcome email
4. Employee downloads mobile app
5. Employee completes profile
6. Employee connects wearable device
7. Employee grants data permissions
8. System starts collecting data
```

**2. Continuous Data Collection**
```
Every 5 minutes:
- Wearable syncs vital signs
- Environmental sensors update
- System calculates risk scores

Every hour:
- AI analyzes trends
- Checks for anomalies
- Updates risk assessments

Daily:
- Employee completes check-in
- System generates daily report
- Alerts sent if needed

Weekly:
- Comprehensive health summary
- Trend analysis
- Recommendations generated
```

**3. Data Flow Architecture**
```
┌─────────────────┐
│  Wearables      │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │    ┌──────────────┐    ┌──────────────┐
│  Mobile App     │──┼───→│  API Gateway │───→│   Database   │
└─────────────────┘  │    └──────────────┘    └──────────────┘
                     │            │                    │
┌─────────────────┐  │            ↓                    ↓
│  IoT Sensors    │──┤    ┌──────────────┐    ┌──────────────┐
└─────────────────┘  │    │  AI Engine   │←───│  Analytics   │
                     │    └──────────────┘    └──────────────┘
┌─────────────────┐  │            │
│  HR System      │──┤            ↓
└─────────────────┘  │    ┌──────────────┐
                     │    │   Alerts     │
┌─────────────────┐  │    └──────────────┘
│  EHR/Medical    │──┘
└─────────────────┘
```

---

## 📱 EMPLOYEE MOBILE APP FEATURES

### Data Collection Features:

**1. Automatic Sync**
- Background sync every 5 minutes
- Syncs when app is opened
- Syncs when connected to WiFi
- Battery-optimized

**2. Manual Input**
- Daily check-in form
- Symptom logger
- Medication tracker
- Sleep diary
- Mood journal

**3. Permissions Management**
- Granular data permissions
- Opt-in/opt-out controls
- Data sharing preferences
- Privacy settings

---

## 🔒 PRIVACY & CONSENT

### Data Collection Consent:

**Required Consents:**
1. ✅ General health data collection
2. ✅ Wearable device integration
3. ✅ Medical records access
4. ✅ Data sharing with employer
5. ✅ AI analysis consent

**Employee Rights:**
- Right to access their data
- Right to export their data
- Right to delete their data
- Right to opt-out
- Right to limit sharing

**Implementation:**
```typescript
interface ConsentRecord {
  userId: string;
  consentType: string;
  granted: boolean;
  grantedAt: Date;
  expiresAt?: Date;
  withdrawnAt?: Date;
}

// Check consent before collecting data
async function canCollectData(userId: string, dataType: string): Promise<boolean> {
  const consent = await db.consents.findFirst({
    where: {
      userId,
      consentType: dataType,
      granted: true,
      withdrawnAt: null,
    },
  });
  
  return !!consent;
}
```

---

## 📊 DATA STORAGE STRUCTURE

### Database Schema:

**1. vital_signs (TimescaleDB)**
```sql
CREATE TABLE vital_signs (
    time TIMESTAMPTZ NOT NULL,
    user_id UUID NOT NULL,
    metric_type VARCHAR(50), -- 'heart_rate', 'hrv', 'spo2', etc.
    value FLOAT,
    unit VARCHAR(20),
    device_source VARCHAR(100),
    confidence_score FLOAT
);

SELECT create_hypertable('vital_signs', 'time');
```

**2. daily_checkins**
```sql
CREATE TABLE daily_checkins (
    checkin_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    checkin_date DATE NOT NULL,
    overall_feeling INTEGER,
    fatigue_level INTEGER,
    stress_level INTEGER,
    sleep_quality INTEGER,
    symptoms JSONB,
    notes TEXT
);
```

**3. medical_records**
```sql
CREATE TABLE medical_records (
    record_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    record_date DATE,
    record_type VARCHAR(100),
    diagnosis TEXT,
    medications JSONB,
    allergies JSONB,
    chronic_conditions JSONB
);
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Basic Data Collection (Weeks 1-4)
- [ ] Mobile app with manual check-ins
- [ ] HR system integration
- [ ] Basic database setup
- [ ] Manual data entry forms

### Phase 2: Wearable Integration (Weeks 5-8)
- [ ] Apple HealthKit integration
- [ ] Fitbit API integration
- [ ] Garmin Connect API
- [ ] Automatic sync service

### Phase 3: Advanced Integration (Weeks 9-12)
- [ ] EHR/FHIR integration
- [ ] IoT sensor network
- [ ] Real-time data streaming
- [ ] AI analysis pipeline

### Phase 4: Optimization (Weeks 13-16)
- [ ] Data quality validation
- [ ] Anomaly detection
- [ ] Performance optimization
- [ ] Privacy enhancements

---

## 🔧 TECHNICAL REQUIREMENTS

### Backend Services:

**1. Data Ingestion Service**
```typescript
// Handles all incoming data
- REST API endpoints
- WebSocket connections
- MQTT broker
- Batch import jobs
```

**2. Data Validation Service**
```typescript
// Validates and cleans data
- Range validation
- Outlier detection
- Data normalization
- Quality scoring
```

**3. Sync Service**
```typescript
// Manages device synchronization
- Wearable API clients
- Retry logic
- Conflict resolution
- Deduplication
```

---

## 📈 DATA QUALITY ASSURANCE

### Quality Checks:

**1. Validation Rules**
- Heart rate: 40-200 bpm
- HRV: 10-150 ms
- SpO2: 85-100%
- Temperature: 35-42°C
- Sleep: 0-24 hours/day

**2. Anomaly Detection**
```typescript
async function detectAnomalies(userId: string, metric: string, value: number) {
  // Get historical baseline
  const baseline = await getBaselineValue(userId, metric);
  
  // Calculate deviation
  const deviation = Math.abs(value - baseline.mean) / baseline.stdDev;
  
  // Flag if > 3 standard deviations
  if (deviation > 3) {
    await createAnomaly Alert({
      userId,
      metric,
      value,
      baseline: baseline.mean,
      deviation,
    });
  }
}
```

---

## 🎯 BEST PRACTICES

### Data Collection:
1. ✅ Collect only necessary data
2. ✅ Obtain explicit consent
3. ✅ Encrypt data in transit and at rest
4. ✅ Validate all inputs
5. ✅ Log all access
6. ✅ Regular data audits
7. ✅ Respect opt-outs
8. ✅ Provide data export

### Employee Experience:
1. ✅ Make it easy to connect devices
2. ✅ Provide clear value proposition
3. ✅ Show employees their data
4. ✅ Give control over sharing
5. ✅ Minimize manual entry
6. ✅ Provide feedback on data quality

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues:

**Wearable Not Syncing:**
1. Check device battery
2. Verify Bluetooth connection
3. Check app permissions
4. Re-authenticate device
5. Contact support

**Missing Data:**
1. Check sync history
2. Verify device connection
3. Check data permissions
4. Review consent status

---

**This comprehensive data collection architecture ensures accurate, timely, and privacy-compliant health monitoring for all employees!**

**Version:** 1.0  
**Last Updated:** December 4, 2025  
**Status:** Complete Data Collection Architecture
