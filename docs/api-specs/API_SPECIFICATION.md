# Health Twin™ - API Specification

## Base URL

**Production:** `https://api.healthtwin.com/v1`  
**Staging:** `https://api-staging.healthtwin.com/v1`  
**Development:** `http://localhost:8000/v1`

## Authentication

All API requests require authentication using JWT tokens.

### Get Access Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Use Token

```http
GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Endpoints

### 1. Authentication & User Management

#### 1.1 Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-05-15",
  "gender": "male",
  "phone": "+971501234567"
}
```

**Response:** `201 Created`
```json
{
  "user_id": "user_67890",
  "email": "newuser@example.com",
  "message": "User registered successfully. Please verify your email."
}
```

#### 1.2 Get Current User Profile

```http
GET /users/me
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-05-15",
  "gender": "male",
  "phone": "+971501234567",
  "created_at": "2025-01-15T10:30:00Z",
  "profile_completed": true,
  "subscription_tier": "premium"
}
```

#### 1.3 Update User Profile

```http
PATCH /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "height_cm": 175,
  "weight_kg": 75,
  "blood_type": "O+",
  "emergency_contact": {
    "name": "Jane Doe",
    "relationship": "spouse",
    "phone": "+971509876543"
  }
}
```

**Response:** `200 OK`

---

### 2. Device Integration

#### 2.1 Connect Wearable Device

```http
POST /devices/connect
Authorization: Bearer {token}
Content-Type: application/json

{
  "device_type": "apple_health",
  "oauth_code": "auth_code_from_oauth_flow"
}
```

**Response:** `200 OK`
```json
{
  "device_id": "device_abc123",
  "device_type": "apple_health",
  "status": "connected",
  "last_sync": "2025-12-03T21:00:00Z",
  "data_types": ["heart_rate", "steps", "sleep", "hrv"]
}
```

#### 2.2 List Connected Devices

```http
GET /devices
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "devices": [
    {
      "device_id": "device_abc123",
      "device_type": "apple_health",
      "status": "connected",
      "last_sync": "2025-12-03T21:00:00Z",
      "sync_frequency": "hourly"
    },
    {
      "device_id": "device_xyz789",
      "device_type": "garmin",
      "status": "connected",
      "last_sync": "2025-12-03T20:45:00Z",
      "sync_frequency": "hourly"
    }
  ]
}
```

#### 2.3 Sync Device Data

```http
POST /devices/{device_id}/sync
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "device_id": "device_abc123",
  "sync_status": "completed",
  "records_synced": 1247,
  "last_sync": "2025-12-03T21:30:00Z"
}
```

#### 2.4 Disconnect Device

```http
DELETE /devices/{device_id}
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

### 3. Health Data

#### 3.1 Get Vital Signs

```http
GET /health/vitals?start_date=2025-12-01&end_date=2025-12-03&metric=heart_rate
Authorization: Bearer {token}
```

**Query Parameters:**
- `start_date` (required): ISO 8601 date
- `end_date` (required): ISO 8601 date
- `metric` (optional): `heart_rate`, `hrv`, `blood_pressure`, `spo2`, `temperature`, `all`
- `granularity` (optional): `raw`, `hourly`, `daily` (default: `hourly`)

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "metric": "heart_rate",
  "unit": "bpm",
  "granularity": "hourly",
  "data": [
    {
      "timestamp": "2025-12-01T00:00:00Z",
      "value": 62,
      "source": "apple_health",
      "quality": "high"
    },
    {
      "timestamp": "2025-12-01T01:00:00Z",
      "value": 58,
      "source": "apple_health",
      "quality": "high"
    }
  ],
  "summary": {
    "min": 52,
    "max": 78,
    "avg": 64,
    "baseline": 65
  }
}
```

#### 3.2 Get Sleep Data

```http
GET /health/sleep?start_date=2025-12-01&end_date=2025-12-03
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "sleep_sessions": [
    {
      "date": "2025-12-01",
      "sleep_start": "2025-12-01T23:15:00Z",
      "sleep_end": "2025-12-02T06:45:00Z",
      "total_duration_minutes": 450,
      "stages": {
        "deep_minutes": 95,
        "light_minutes": 220,
        "rem_minutes": 105,
        "awake_minutes": 30
      },
      "quality_score": 82,
      "hrv_avg": 65,
      "respiratory_rate_avg": 14,
      "restlessness": "low",
      "source": "oura_ring"
    }
  ],
  "summary": {
    "avg_duration_minutes": 435,
    "avg_quality_score": 79,
    "sleep_debt_hours": 2.5
  }
}
```

#### 3.3 Get Activity Data

```http
GET /health/activity?date=2025-12-03
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "date": "2025-12-03",
  "steps": 8542,
  "distance_km": 6.2,
  "calories_burned": 2145,
  "active_minutes": 87,
  "sedentary_minutes": 456,
  "exercise_sessions": [
    {
      "type": "running",
      "start_time": "2025-12-03T06:30:00Z",
      "duration_minutes": 35,
      "avg_heart_rate": 145,
      "max_heart_rate": 168,
      "calories": 342
    }
  ],
  "activity_score": 75
}
```

#### 3.4 Submit Manual Health Data

```http
POST /health/manual
Authorization: Bearer {token}
Content-Type: application/json

{
  "metric_type": "blood_pressure",
  "timestamp": "2025-12-03T08:00:00Z",
  "values": {
    "systolic": 125,
    "diastolic": 82,
    "pulse": 68
  },
  "notes": "Measured after morning coffee"
}
```

**Response:** `201 Created`
```json
{
  "record_id": "rec_abc123",
  "metric_type": "blood_pressure",
  "timestamp": "2025-12-03T08:00:00Z",
  "status": "recorded"
}
```

---

### 4. Digital Twin & Risk Scoring

#### 4.1 Get Digital Twin Status

```http
GET /twin/status
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "last_updated": "2025-12-03T21:30:00Z",
  "overall_health_score": 78,
  "twins": {
    "cardiac": {
      "score": 82,
      "status": "good",
      "trend": "stable",
      "last_updated": "2025-12-03T21:30:00Z"
    },
    "metabolic": {
      "score": 75,
      "status": "fair",
      "trend": "improving",
      "last_updated": "2025-12-03T21:30:00Z"
    },
    "sleep": {
      "score": 68,
      "status": "fair",
      "trend": "declining",
      "last_updated": "2025-12-03T21:30:00Z"
    },
    "fatigue": {
      "score": 72,
      "status": "fair",
      "trend": "stable",
      "last_updated": "2025-12-03T21:30:00Z"
    },
    "mental_health": {
      "score": 80,
      "status": "good",
      "trend": "stable",
      "last_updated": "2025-12-03T21:30:00Z"
    },
    "environmental": {
      "score": 85,
      "status": "good",
      "trend": "stable",
      "last_updated": "2025-12-03T21:30:00Z"
    },
    "occupational": {
      "score": 70,
      "status": "fair",
      "trend": "declining",
      "last_updated": "2025-12-03T21:30:00Z"
    },
    "driving": {
      "score": 88,
      "status": "excellent",
      "trend": "stable",
      "last_updated": "2025-12-03T21:30:00Z"
    }
  }
}
```

#### 4.2 Get Risk Assessment

```http
GET /risk/assessment
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "assessment_date": "2025-12-03T21:30:00Z",
  "overall_risk_score": 35,
  "overall_risk_level": "yellow",
  "risk_categories": {
    "cardiac": {
      "risk_score": 28,
      "risk_level": "yellow",
      "probability_6_months": 0.08,
      "trend": "stable",
      "drivers": [
        {
          "factor": "Elevated resting heart rate",
          "contribution": 45,
          "severity": "moderate"
        },
        {
          "factor": "HRV below baseline",
          "contribution": 35,
          "severity": "mild"
        }
      ]
    },
    "metabolic": {
      "risk_score": 42,
      "risk_level": "orange",
      "probability_12_months": 0.15,
      "trend": "worsening",
      "drivers": [
        {
          "factor": "BMI trending upward",
          "contribution": 50,
          "severity": "moderate"
        },
        {
          "factor": "Reduced physical activity",
          "contribution": 30,
          "severity": "moderate"
        }
      ]
    },
    "fatigue": {
      "risk_score": 38,
      "risk_level": "yellow",
      "collapse_probability": 0.05,
      "trend": "improving",
      "drivers": [
        {
          "factor": "Sleep debt (3.5 hours)",
          "contribution": 60,
          "severity": "moderate"
        }
      ]
    }
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "sleep",
      "action": "Aim for 7-8 hours of sleep tonight to reduce fatigue risk",
      "expected_impact": "Reduce fatigue risk by 40%"
    },
    {
      "priority": "medium",
      "category": "activity",
      "action": "Increase daily steps to 10,000 to improve metabolic health",
      "expected_impact": "Reduce metabolic risk by 15% in 2 weeks"
    }
  ]
}
```

#### 4.3 Get Fitness-to-Work Status

```http
GET /risk/fitness-to-work
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "assessment_time": "2025-12-03T21:30:00Z",
  "fitness_status": "fit_with_caution",
  "overall_score": 72,
  "valid_until": "2025-12-04T06:00:00Z",
  "restrictions": [
    {
      "type": "driving",
      "restriction": "Limit continuous driving to 4 hours",
      "reason": "Elevated fatigue score"
    },
    {
      "type": "heavy_lifting",
      "restriction": "Avoid lifting >25kg",
      "reason": "Cardiac risk elevated"
    }
  ],
  "clearances": {
    "office_work": "cleared",
    "light_physical": "cleared",
    "moderate_physical": "cleared_with_caution",
    "heavy_physical": "not_cleared",
    "driving": "cleared_with_restrictions",
    "height_work": "cleared",
    "confined_space": "cleared"
  },
  "next_assessment": "2025-12-04T06:00:00Z"
}
```

#### 4.4 Get Predictive Insights

```http
GET /risk/predictions?timeframe=6_months
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "prediction_date": "2025-12-03T21:30:00Z",
  "timeframe": "6_months",
  "predictions": [
    {
      "condition": "cardiac_event",
      "probability": 0.08,
      "confidence": 0.85,
      "timeline": "3-6 months",
      "severity": "moderate",
      "preventable": true,
      "prevention_actions": [
        "Improve sleep quality",
        "Reduce work stress",
        "Increase cardiovascular exercise"
      ]
    },
    {
      "condition": "type_2_diabetes",
      "probability": 0.15,
      "confidence": 0.78,
      "timeline": "9-12 months",
      "severity": "high",
      "preventable": true,
      "prevention_actions": [
        "Lose 5-7% body weight",
        "Reduce sugar intake",
        "Exercise 150 min/week"
      ]
    }
  ]
}
```

---

### 5. Alerts & Notifications

#### 5.1 Get Active Alerts

```http
GET /alerts?status=active
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "alerts": [
    {
      "alert_id": "alert_123",
      "type": "health_risk",
      "severity": "high",
      "title": "Elevated Fatigue Risk",
      "message": "Your fatigue score is critically high. Immediate rest recommended.",
      "created_at": "2025-12-03T20:00:00Z",
      "status": "active",
      "action_required": true,
      "recommended_actions": [
        "Stop driving immediately",
        "Get 8+ hours sleep tonight",
        "Avoid heavy machinery"
      ]
    },
    {
      "alert_id": "alert_124",
      "type": "anomaly_detected",
      "severity": "medium",
      "title": "Unusual Heart Rate Pattern",
      "message": "Your resting heart rate has been 15% higher than baseline for 3 days.",
      "created_at": "2025-12-03T18:30:00Z",
      "status": "active",
      "action_required": false,
      "recommended_actions": [
        "Monitor for additional symptoms",
        "Consider medical consultation if persists"
      ]
    }
  ]
}
```

#### 5.2 Acknowledge Alert

```http
POST /alerts/{alert_id}/acknowledge
Authorization: Bearer {token}
Content-Type: application/json

{
  "acknowledged_at": "2025-12-03T21:30:00Z",
  "user_response": "Will rest tonight and monitor"
}
```

**Response:** `200 OK`

#### 5.3 Get Notification Preferences

```http
GET /notifications/preferences
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "channels": {
    "push_notifications": true,
    "email": true,
    "sms": false
  },
  "alert_types": {
    "critical_health": {
      "enabled": true,
      "channels": ["push", "email", "sms"]
    },
    "high_risk": {
      "enabled": true,
      "channels": ["push", "email"]
    },
    "moderate_risk": {
      "enabled": true,
      "channels": ["push"]
    },
    "daily_summary": {
      "enabled": true,
      "channels": ["email"],
      "time": "08:00"
    },
    "weekly_report": {
      "enabled": true,
      "channels": ["email"],
      "day": "monday"
    }
  }
}
```

---

### 6. Medical Records

#### 6.1 Upload Medical Record

```http
POST /medical-records
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": <binary>,
  "record_type": "lab_result",
  "date": "2025-11-28",
  "description": "Annual blood work",
  "provider": "City Hospital"
}
```

**Response:** `201 Created`
```json
{
  "record_id": "rec_xyz789",
  "record_type": "lab_result",
  "filename": "blood_work_2025_11_28.pdf",
  "upload_date": "2025-12-03T21:30:00Z",
  "status": "processing",
  "extracted_data": null
}
```

#### 6.2 Get Medical Records

```http
GET /medical-records
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "records": [
    {
      "record_id": "rec_xyz789",
      "record_type": "lab_result",
      "date": "2025-11-28",
      "description": "Annual blood work",
      "provider": "City Hospital",
      "extracted_data": {
        "glucose_fasting": 95,
        "hba1c": 5.4,
        "cholesterol_total": 185,
        "ldl": 110,
        "hdl": 55,
        "triglycerides": 100
      },
      "file_url": "https://storage.healthtwin.com/records/rec_xyz789.pdf"
    }
  ]
}
```

#### 6.3 Share Medical Record

```http
POST /medical-records/{record_id}/share
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipient_email": "doctor@hospital.com",
  "recipient_type": "medical_provider",
  "expiry_date": "2025-12-10",
  "message": "Please review my recent lab results"
}
```

**Response:** `200 OK`
```json
{
  "share_id": "share_abc123",
  "share_link": "https://healthtwin.com/shared/share_abc123",
  "expires_at": "2025-12-10T23:59:59Z"
}
```

---

### 7. Corporate Dashboard API

#### 7.1 Get Employee Health Overview

```http
GET /corporate/employees/health-overview
Authorization: Bearer {corporate_token}
```

**Response:** `200 OK`
```json
{
  "company_id": "company_456",
  "total_employees": 1250,
  "last_updated": "2025-12-03T21:30:00Z",
  "risk_distribution": {
    "green": 875,
    "yellow": 245,
    "orange": 98,
    "red": 27,
    "critical": 5
  },
  "fitness_to_work": {
    "fully_fit": 1050,
    "fit_with_restrictions": 165,
    "not_fit": 35
  },
  "top_risks": [
    {
      "risk_type": "fatigue",
      "affected_employees": 187,
      "trend": "increasing"
    },
    {
      "risk_type": "metabolic",
      "affected_employees": 142,
      "trend": "stable"
    }
  ]
}
```

#### 7.2 Get High-Risk Employees

```http
GET /corporate/employees/high-risk?risk_level=red,critical
Authorization: Bearer {corporate_token}
```

**Response:** `200 OK`
```json
{
  "high_risk_employees": [
    {
      "employee_id": "emp_789",
      "employee_code": "EMP-0789",
      "department": "Operations",
      "risk_level": "critical",
      "risk_score": 85,
      "primary_risk": "fatigue",
      "fitness_status": "not_fit",
      "alert_triggered": "2025-12-03T19:00:00Z",
      "recommended_action": "Immediate rest, remove from duty"
    }
  ]
}
```

#### 7.3 Get Fatigue Heatmap

```http
GET /corporate/fatigue/heatmap?date=2025-12-03
Authorization: Bearer {corporate_token}
```

**Response:** `200 OK`
```json
{
  "company_id": "company_456",
  "date": "2025-12-03",
  "departments": [
    {
      "department": "Operations",
      "total_employees": 450,
      "fatigue_distribution": {
        "low": 280,
        "moderate": 120,
        "high": 40,
        "critical": 10
      },
      "avg_fatigue_score": 35,
      "trend": "increasing"
    }
  ],
  "shifts": [
    {
      "shift": "night_shift",
      "employees_count": 85,
      "avg_fatigue_score": 62,
      "high_risk_count": 23
    }
  ]
}
```

---

### 8. AI Health Assistant

#### 8.1 Ask Health Question

```http
POST /ai/ask
Authorization: Bearer {token}
Content-Type: application/json

{
  "question": "Why is my cardiac risk increasing?",
  "context": "recent_data"
}
```

**Response:** `200 OK`
```json
{
  "question": "Why is my cardiac risk increasing?",
  "answer": "Your cardiac risk has increased by 12% over the past week primarily due to three factors:\n\n1. **Sleep Quality (45% contribution)**: You've averaged only 5.2 hours of sleep per night, which is 2.3 hours below your baseline. Poor sleep increases stress hormones and inflammation.\n\n2. **HRV Decline (35% contribution)**: Your heart rate variability has dropped 28% from your personal baseline, indicating reduced cardiovascular resilience and increased stress.\n\n3. **Reduced Activity (20% contribution)**: Your daily steps have decreased by 40% (from 9,500 to 5,700), reducing cardiovascular conditioning.\n\nTo reverse this trend, prioritize getting 7-8 hours of sleep and gradually increase your daily activity.",
  "confidence": 0.92,
  "sources": [
    "Your sleep data (last 7 days)",
    "HRV trends",
    "Activity patterns"
  ],
  "related_recommendations": [
    "Improve sleep hygiene",
    "Stress reduction techniques",
    "Gradual activity increase"
  ]
}
```

#### 8.2 Get Personalized Recommendations

```http
GET /ai/recommendations
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user_id": "user_12345",
  "generated_at": "2025-12-03T21:30:00Z",
  "recommendations": [
    {
      "id": "rec_1",
      "category": "sleep",
      "priority": "high",
      "title": "Improve Sleep Duration",
      "description": "Aim for 7.5-8 hours of sleep per night",
      "rationale": "Your sleep debt has accumulated to 8.5 hours over the past 2 weeks, significantly impacting your fatigue and cardiac risk scores.",
      "action_steps": [
        "Set a consistent bedtime of 10:30 PM",
        "Avoid screens 1 hour before bed",
        "Keep bedroom temperature at 18-20°C"
      ],
      "expected_impact": {
        "fatigue_risk": "-35%",
        "cardiac_risk": "-15%",
        "timeframe": "1 week"
      },
      "difficulty": "medium"
    },
    {
      "id": "rec_2",
      "category": "activity",
      "priority": "medium",
      "title": "Increase Daily Movement",
      "description": "Gradually increase daily steps to 8,000-10,000",
      "rationale": "Your activity level has declined 40% from your baseline, contributing to metabolic risk increase.",
      "action_steps": [
        "Take a 15-minute walk after lunch",
        "Use stairs instead of elevator",
        "Park farther from entrance"
      ],
      "expected_impact": {
        "metabolic_risk": "-20%",
        "cardiac_risk": "-10%",
        "timeframe": "2 weeks"
      },
      "difficulty": "easy"
    }
  ]
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is missing required parameter: start_date",
    "details": {
      "parameter": "start_date",
      "expected_format": "ISO 8601 date (YYYY-MM-DD)"
    },
    "request_id": "req_abc123xyz"
  }
}
```

### Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_REQUEST` | Malformed request or missing parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication token |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (e.g., duplicate) |
| 422 | `VALIDATION_ERROR` | Request validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

---

## Rate Limiting

**Limits:**
- **Free tier:** 100 requests/hour
- **Premium tier:** 1,000 requests/hour
- **Corporate tier:** 10,000 requests/hour

**Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1701634800
```

---

## Webhooks

### Register Webhook

```http
POST /webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://your-server.com/webhooks/healthtwin",
  "events": ["risk_alert", "device_sync", "prediction_update"],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

**risk_alert:**
```json
{
  "event": "risk_alert",
  "timestamp": "2025-12-03T21:30:00Z",
  "user_id": "user_12345",
  "data": {
    "alert_id": "alert_123",
    "risk_type": "cardiac",
    "risk_level": "red",
    "risk_score": 78
  }
}
```

---

## Pagination

For endpoints returning lists, use cursor-based pagination:

```http
GET /health/vitals?limit=100&cursor=eyJpZCI6MTIzNDU2fQ==
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzNTU2fQ==",
    "has_more": true,
    "total_count": 5420
  }
}
```

---

**API Version:** v1  
**Last Updated:** December 2025  
**Documentation:** https://docs.healthtwin.com
