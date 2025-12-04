# Health Twin™ - System Architecture

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                           │
├─────────────────────────────────────────────────────────────────────┤
│  Mobile App (iOS/Android)  │  Corporate Dashboard  │  Provider Portal│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY                                 │
│              (Authentication, Rate Limiting, Routing)                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     MICROSERVICES LAYER                               │
├──────────────────────────────────────────────────────────────────────┤
│  User Service  │  Device Integration  │  Data Ingestion  │  Auth     │
│  Risk Engine   │  Digital Twin Engine │  Alerting        │  Analytics│
│  Corporate Svc │  Provider Service    │  Compliance      │  Billing  │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      AI/ML LAYER                                      │
├──────────────────────────────────────────────────────────────────────┤
│  Cardiac Model  │  Fatigue Model  │  Burnout Model  │  Metabolic    │
│  Sleep Apnea    │  Accident Risk  │  Anomaly Detection │  Causal AI │
│                   Continuous Learning Engine                          │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                       │
├──────────────────────────────────────────────────────────────────────┤
│  PostgreSQL     │  TimescaleDB    │  MongoDB      │  Redis           │
│  (User Data)    │  (Time-Series)  │  (Unstructured)│  (Cache/Queue)  │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   DATA INGESTION SOURCES                              │
├──────────────────────────────────────────────────────────────────────┤
│  Wearables (Apple, Garmin, Fitbit, Oura, Whoop)                     │
│  EMR/EHR (FHIR, HL7)                                                 │
│  Environmental Sensors (Heat, Noise, Light)                          │
│  Occupational Data (IVMS, Shift Schedules, Incident Reports)        │
└──────────────────────────────────────────────────────────────────────┘
```

## 2. Data Ingestion Layer

### 2.1 Data Sources

#### Wearables & Smart Devices
- **Apple Health** - HealthKit API
- **Garmin** - Garmin Connect API
- **Fitbit** - Web API
- **Oura Ring** - Oura API v2
- **Whoop** - Whoop API
- **Smart BP Monitors** - Withings, Omron
- **Smart Scales** - Withings, Fitbit Aria
- **ECG Devices** - AliveCor KardiaMobile
- **Sleep Trackers** - Beddit, Eight Sleep

#### Medical Data Sources
- **EMR/EHR Systems** - FHIR R4, HL7 v2/v3
- **Laboratory Systems** - LIS integration
- **POCT Devices** - Point-of-care testing
- **Radiology** - DICOM, HL7 ORU messages
- **Pharmacy** - Medication lists, prescriptions

#### Environmental & Occupational
- **Shift Management Systems**
- **IVMS (In-Vehicle Monitoring)** - Driving logs
- **Environmental Sensors** - Heat index, humidity, noise
- **Fatigue Scoring Systems**
- **Incident Reporting Systems**
- **Job Risk Classification** - OSHA, IOGP standards

#### Lifestyle & Self-Reported
- **Health Questionnaires**
- **Mood Logs**
- **Sleep Quality Ratings**
- **Nutrition Tracking**
- **Stress Assessments**

### 2.2 Data Ingestion Pipeline

```
Wearable Device → OAuth Authentication → API Polling/Webhook
                                              │
                                              ▼
                                    Data Validation Layer
                                              │
                                              ▼
                                    Data Normalization
                                              │
                                              ▼
                                    Feature Extraction
                                              │
                                              ▼
                                    Time-Series Database
                                              │
                                              ▼
                                    Digital Twin Engine
```

### 2.3 Data Processing Requirements

#### Real-Time Processing
- Heart rate variability (HRV) analysis
- ECG anomaly detection
- Fatigue scoring
- Alert triggering

#### Batch Processing
- Daily health reports
- Weekly trend analysis
- Model retraining
- Risk recalculation

#### Data Quality Checks
- Missing data detection
- Outlier identification
- Sensor accuracy validation
- Timestamp consistency

## 3. Database Architecture

### 3.1 PostgreSQL - User & Medical Data

**Tables:**
```sql
users
├── user_id (PK)
├── email
├── phone
├── demographics (age, gender, ethnicity)
├── medical_history
└── created_at

medical_records
├── record_id (PK)
├── user_id (FK)
├── record_type (lab, imaging, diagnosis)
├── data (JSONB)
└── recorded_at

medications
├── medication_id (PK)
├── user_id (FK)
├── drug_name
├── dosage
├── frequency
└── start_date

risk_profiles
├── profile_id (PK)
├── user_id (FK)
├── risk_type (cardiac, metabolic, fatigue)
├── risk_score
├── risk_level (green, yellow, orange, red, critical)
├── risk_drivers (JSONB)
└── calculated_at
```

### 3.2 TimescaleDB - Time-Series Vital Signs

**Hypertables:**
```sql
vital_signs
├── time (timestamp)
├── user_id
├── metric_type (hr, hrv, bp_sys, bp_dia, spo2, temp)
├── value
├── device_source
└── quality_score

sleep_data
├── time (timestamp)
├── user_id
├── sleep_stage (deep, light, rem, awake)
├── duration_minutes
├── hrv_avg
├── respiratory_rate
└── movement_count

activity_data
├── time (timestamp)
├── user_id
├── activity_type (steps, exercise, sedentary)
├── duration_minutes
├── calories_burned
└── intensity_level
```

### 3.3 MongoDB - Unstructured Data

**Collections:**
- `raw_device_data` - Original API responses
- `ecg_recordings` - ECG waveforms
- `questionnaire_responses` - Survey data
- `incident_reports` - Workplace incidents
- `medical_documents` - PDFs, images
- `ai_model_metadata` - Model versions, parameters

### 3.4 Redis - Caching & Real-Time

**Use Cases:**
- User session management
- Real-time alert queue
- API rate limiting
- Device sync status
- Temporary calculation cache
- WebSocket connection state

## 4. AI/ML Architecture

### 4.1 Model Pipeline

```
Raw Data → Feature Engineering → Model Training → Model Validation
                                                         │
                                                         ▼
                                                  Model Registry (MLflow)
                                                         │
                                                         ▼
                                                  Model Serving (FastAPI)
                                                         │
                                                         ▼
                                                  Prediction API
                                                         │
                                                         ▼
                                                  Digital Twin Engine
```

### 4.2 Prediction Models

#### Cardiac Risk Model
**Inputs:**
- HRV (SDNN, RMSSD, pNN50)
- Resting heart rate
- Blood pressure (systolic, diastolic)
- ECG patterns (QT interval, ST segment)
- SpO2 levels
- Age, BMI, family history
- Cholesterol, glucose levels

**Outputs:**
- Cardiac event probability (1-6 months)
- Risk level (green → critical)
- Contributing factors
- Recommended interventions

**Algorithm:** Gradient Boosting (XGBoost) + LSTM for temporal patterns

#### Fatigue Model
**Inputs:**
- Sleep duration & quality (last 7 days)
- Shift history (hours, night shifts)
- HRV trends
- Activity load
- Recovery time
- Caffeine intake
- Stress markers

**Outputs:**
- Fatigue index (0-100)
- Collapse probability
- Fitness-to-work status
- Recovery time needed

**Algorithm:** Random Forest + Time-series analysis

#### Burnout Model
**Inputs:**
- Sleep trends (30-day)
- Work hours per week
- Mood logs
- HRV baseline deviation
- Step count trends
- Social interaction patterns
- Stress questionnaire scores

**Outputs:**
- Burnout stage (1-5)
- Timeline to critical burnout
- Primary stressors
- Intervention recommendations

**Algorithm:** Multi-task Neural Network

#### Metabolic Risk Model
**Inputs:**
- BMI, waist circumference
- Blood glucose (fasting, HbA1c)
- Blood pressure
- Lipid panel
- Physical activity level
- Diet patterns
- Family history
- Age, ethnicity

**Outputs:**
- Diabetes risk (3-18 months)
- Hypertension risk
- Obesity progression
- Metabolic syndrome probability

**Algorithm:** Logistic Regression + Deep Learning ensemble

#### Sleep Apnea Detection Model
**Inputs:**
- Overnight HRV patterns
- SpO2 dips
- Respiratory rate variability
- Movement/restlessness
- Snoring data (if available)
- BMI, neck circumference

**Outputs:**
- Sleep apnea probability
- Severity estimate (mild, moderate, severe)
- Recommended sleep study

**Algorithm:** CNN on time-series data

#### Accident Probability Model
**Inputs:**
- Current fatigue score
- Driving duration
- Time of day
- Sleep debt (last 48 hours)
- Cognitive load markers
- Recent shift pattern
- Road conditions (if available)

**Outputs:**
- Accident risk (next 1-4 hours)
- Recommended break time
- Alertness level

**Algorithm:** Ensemble (Random Forest + Neural Network)

### 4.3 Anomaly Detection

**Method:** Isolation Forest + Autoencoders

**Detects:**
- Sudden HRV drops
- Abnormal BP spikes
- Sleep pattern disruptions
- Activity level changes
- Mood anomalies

**Triggers:**
- Automatic alerts
- Model recalibration
- Baseline adjustment

### 4.4 Causal AI Engine

**Purpose:** Identify root causes of risk increases

**Techniques:**
- Causal inference (DoWhy, CausalML)
- Counterfactual analysis
- Intervention simulation

**Outputs:**
- "Your cardiac risk increased by 15% due to:"
  - 60% - Poor sleep (avg 4.5 hrs/night)
  - 25% - Elevated stress (HRV down 30%)
  - 15% - Reduced activity (steps down 40%)

### 4.5 Continuous Learning Engine

**Daily Updates:**
1. Collect new data from all users
2. Retrain models on updated dataset
3. Validate against holdout set
4. Deploy if accuracy improves
5. Update personal baselines

**Personalization:**
- Individual baseline calculation
- Personal risk thresholds
- Customized intervention effectiveness
- Adaptive alert sensitivity

## 5. Digital Twin Engine

### 5.1 Twin Components

Each user has 8 specialized twins:

1. **Cardiac Twin**
   - Real-time heart monitoring
   - ECG pattern analysis
   - Arrhythmia detection
   - Cardiac risk prediction

2. **Metabolic Twin**
   - Glucose regulation
   - Insulin sensitivity
   - Lipid metabolism
   - Weight trajectory

3. **Sleep Twin**
   - Sleep architecture
   - Sleep debt tracking
   - Circadian rhythm
   - Sleep apnea risk

4. **Fatigue Twin**
   - Work-rest balance
   - Recovery capacity
   - Shift impact
   - Fitness-to-work

5. **Mental Health Twin**
   - Stress levels
   - Burnout progression
   - Mood patterns
   - Resilience score

6. **Environmental Exposure Twin**
   - Heat stress
   - Noise exposure
   - Air quality impact
   - Hazard exposure

7. **Occupational/Workload Twin**
   - Shift patterns
   - Work intensity
   - Physical demands
   - Job-specific risks

8. **Driving Twin**
   - Driving fatigue
   - Alertness level
   - Accident risk
   - Safe driving capacity

### 5.2 Twin Fusion Layer

**Process:**
1. Each twin runs independently
2. Outputs synchronized every 15 minutes
3. Fusion algorithm combines all signals
4. Unified health status calculated
5. Overall risk score generated
6. Personalized recommendations created

**Fusion Algorithm:**
```python
overall_health_score = weighted_average([
    cardiac_twin.score * 0.25,
    metabolic_twin.score * 0.15,
    sleep_twin.score * 0.15,
    fatigue_twin.score * 0.15,
    mental_health_twin.score * 0.15,
    environmental_twin.score * 0.05,
    occupational_twin.score * 0.05,
    driving_twin.score * 0.05
])
```

### 5.3 Personal Baseline

**Calculated from:**
- First 30 days of data
- Rolling 90-day average
- Seasonal adjustments
- Life event corrections

**Updated:**
- Weekly recalculation
- Major life event triggers
- Significant health changes

## 6. Risk Scoring Engine

### 6.1 Risk Levels

| Level | Color | Score Range | Action Required |
|-------|-------|-------------|-----------------|
| Normal | Green | 0-20 | Routine monitoring |
| Mild Risk | Yellow | 21-40 | Awareness, minor adjustments |
| Rising Risk | Orange | 41-60 | Intervention recommended |
| High Risk | Red | 61-80 | Immediate intervention |
| Critical | Critical | 81-100 | Emergency response |

### 6.2 Risk Drivers

**Identified factors:**
- ECG instability (QT prolongation, arrhythmias)
- HRV drop (>30% from baseline)
- Shift overload (>60 hrs/week, >3 night shifts)
- Heat exposure (WBGT >28°C)
- Sleep debt (>10 hours cumulative)
- Stress signals (cortisol markers, mood)
- Driving load (>8 hrs/day)
- Medical flags (abnormal labs)

**Risk Driver Output:**
```json
{
  "overall_risk_score": 67,
  "risk_level": "high",
  "primary_drivers": [
    {
      "factor": "Sleep Debt",
      "contribution": 45,
      "severity": "critical",
      "trend": "worsening",
      "recommendation": "Immediate rest required - 8+ hours sleep tonight"
    },
    {
      "factor": "HRV Drop",
      "contribution": 30,
      "severity": "high",
      "trend": "stable",
      "recommendation": "Reduce stress, practice breathing exercises"
    },
    {
      "factor": "Shift Overload",
      "contribution": 25,
      "severity": "moderate",
      "trend": "improving",
      "recommendation": "Limit overtime, schedule recovery days"
    }
  ]
}
```

## 7. Microservices Architecture

### 7.1 Service Catalog

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| API Gateway | Kong/Express | 8000 | Routing, auth, rate limiting |
| User Service | Node.js | 8001 | User management, profiles |
| Auth Service | Node.js | 8002 | Authentication, authorization |
| Device Integration | Node.js | 8003 | Wearable API connections |
| Data Ingestion | Python | 8004 | Data processing, validation |
| Risk Engine | Python | 8005 | Risk calculation, scoring |
| Digital Twin Engine | Python | 8006 | Twin simulation, fusion |
| Alerting Service | Node.js | 8007 | Notifications, alerts |
| Corporate Dashboard | Node.js | 8008 | Corporate API endpoints |
| Provider Dashboard | Node.js | 8009 | Medical provider API |
| Compliance Service | Node.js | 8010 | Audit logs, compliance |
| Analytics Service | Python | 8011 | Reporting, insights |
| Billing Service | Node.js | 8012 | Subscriptions, payments |

### 7.2 Inter-Service Communication

**Synchronous:** REST APIs (for immediate responses)
**Asynchronous:** Message Queue (Kafka/RabbitMQ) for:
- Data ingestion events
- Model prediction requests
- Alert notifications
- Batch processing jobs

### 7.3 Service Dependencies

```
API Gateway
├── Auth Service (authentication)
├── User Service (user data)
└── All other services (routing)

Digital Twin Engine
├── Data Ingestion Service (raw data)
├── Risk Engine (risk scores)
└── User Service (user profiles)

Risk Engine
├── AI Models (predictions)
├── Data Ingestion (vital signs)
└── User Service (medical history)

Alerting Service
├── Risk Engine (risk events)
├── User Service (contact info)
└── Corporate Dashboard (workplace alerts)
```

## 8. Security Architecture

### 8.1 Authentication & Authorization

**Authentication Methods:**
- Email/Password (bcrypt hashed)
- OAuth 2.0 (Google, Apple)
- Biometric (mobile app)
- Multi-factor authentication (MFA)

**Authorization:**
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- Resource-level permissions

**Roles:**
- `user` - Individual access
- `corporate_admin` - Company dashboard
- `corporate_viewer` - Read-only company data
- `medical_provider` - Patient health data
- `system_admin` - Full system access

### 8.2 Data Encryption

**At Rest:**
- AES-256 encryption for databases
- Encrypted file storage
- Encrypted backups

**In Transit:**
- TLS 1.3 for all API calls
- Certificate pinning (mobile apps)
- VPN for internal services

**PHI Separation:**
- Separate database for personally identifiable health information
- Tokenized references in main database
- Encrypted field-level storage

### 8.3 Compliance Requirements

#### UAE Health Data Laws
- DoH Abu Dhabi regulations
- DHA (Dubai Health Authority) compliance
- Data residency in UAE (if required)

#### GDPR
- Right to access
- Right to erasure
- Data portability
- Consent management
- Privacy by design

#### HIPAA
- Access controls
- Audit trails
- Data integrity
- Transmission security
- Breach notification

#### ISO 45001 & IOGP
- Occupational health standards
- Incident reporting
- Risk assessment documentation
- Worker safety protocols

### 8.4 Audit Logging

**Logged Events:**
- User authentication
- Data access (who, what, when)
- Risk score changes
- Alert triggers
- Model predictions
- Administrative actions
- Data exports

**Retention:** 7 years (compliance requirement)

## 9. Deployment Architecture

### 9.1 Kubernetes Cluster

```
Production Cluster
├── Namespace: auth
│   └── Auth Service (3 replicas)
├── Namespace: core-services
│   ├── User Service (3 replicas)
│   ├── Device Integration (2 replicas)
│   └── Data Ingestion (5 replicas)
├── Namespace: ai-services
│   ├── Risk Engine (3 replicas)
│   ├── Digital Twin Engine (3 replicas)
│   └── Model Serving (5 replicas)
├── Namespace: application
│   ├── Corporate Dashboard (2 replicas)
│   ├── Provider Dashboard (2 replicas)
│   └── Alerting Service (3 replicas)
└── Namespace: monitoring
    ├── Prometheus
    ├── Grafana
    └── ELK Stack
```

### 9.2 Scaling Strategy

**Horizontal Pod Autoscaling:**
- CPU threshold: 70%
- Memory threshold: 80%
- Custom metrics: Request queue length

**Database Scaling:**
- PostgreSQL: Read replicas
- TimescaleDB: Partitioning by time
- MongoDB: Sharding
- Redis: Cluster mode

### 9.3 Disaster Recovery

**Backup Strategy:**
- Database: Daily full backup, hourly incremental
- Object storage: Cross-region replication
- Configuration: Version controlled in Git

**RTO (Recovery Time Objective):** 4 hours
**RPO (Recovery Point Objective):** 1 hour

## 10. Monitoring & Observability

### 10.1 Metrics (Prometheus)

**System Metrics:**
- CPU, memory, disk usage
- Network throughput
- Pod health, restart count

**Application Metrics:**
- API request rate, latency, errors
- Database query performance
- Model prediction latency
- Alert delivery time

**Business Metrics:**
- Active users
- Data ingestion rate
- Risk score distribution
- Alert frequency

### 10.2 Logging (ELK Stack)

**Log Levels:**
- ERROR: System failures
- WARN: Potential issues
- INFO: Normal operations
- DEBUG: Detailed troubleshooting

**Structured Logging:**
```json
{
  "timestamp": "2025-12-03T21:30:00Z",
  "service": "risk-engine",
  "level": "INFO",
  "user_id": "user_12345",
  "event": "risk_calculated",
  "risk_score": 67,
  "risk_level": "high",
  "duration_ms": 234
}
```

### 10.3 Tracing (Jaeger)

**Distributed Tracing:**
- Track request flow across services
- Identify bottlenecks
- Debug complex interactions

### 10.4 Alerting

**Alert Channels:**
- PagerDuty (critical system alerts)
- Slack (team notifications)
- Email (non-urgent)

**Alert Rules:**
- Service down >2 minutes
- Error rate >5%
- API latency >2 seconds (p95)
- Database connection pool exhausted
- Disk usage >85%

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Author:** Health Twin™ Architecture Team
