from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Health Twin™ Risk Engine",
    description="Evidence-based AI Risk Calculation Service",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "risk-engine"}

@app.post("/api/v1/risk/cardiac")
def calculate_cardiac_risk(data: dict):
    """
    Calculate Cardiac Risk Score based on HRV and Vital Signs.
    """
    try:
        risk_score = 0
        risk_factors = []

        # Extract data
        age = data.get('age', 0)
        resting_hr = data.get('resting_hr', 0)
        hrv_sdnn = data.get('hrv_sdnn', 0)
        hrv_rmssd = data.get('hrv_rmssd', 0)
        systolic_bp = data.get('systolic_bp', 0)
        diastolic_bp = data.get('diastolic_bp', 0)
        bmi = data.get('bmi', 0)

        # HRV Analysis
        if hrv_sdnn < 50:
            risk_score += 30
            risk_factors.append("Critically Low HRV (SDNN < 50ms) - High Autonomic Stress")
        elif hrv_sdnn < 100:
            risk_score += 15
            risk_factors.append("Reduced HRV (SDNN < 100ms) - Moderate Stress")

        if hrv_rmssd < 20:
            risk_score += 20
            risk_factors.append("Low Vagal Tone (RMSSD < 20ms) - Poor Recovery")

        # Resting Heart Rate
        if resting_hr > 90:
            risk_score += 25
            risk_factors.append(f"Tachycardia (RHR {resting_hr} bpm)")
        elif resting_hr > 80:
            risk_score += 15
            risk_factors.append(f"Elevated Resting HR ({resting_hr} bpm)")

        # Blood Pressure
        if systolic_bp > 140 or diastolic_bp > 90:
            risk_score += 20
            risk_factors.append(f"Hypertension Stage 2 ({systolic_bp}/{diastolic_bp})")
        elif systolic_bp > 130 or diastolic_bp > 80:
            risk_score += 10
            risk_factors.append(f"Hypertension Stage 1 ({systolic_bp}/{diastolic_bp})")

        # BMI
        if bmi > 30:
            risk_score += 10
            risk_factors.append(f"Obesity (BMI {bmi})")

        risk_score = min(risk_score, 100)

        # Determine level
        if risk_score < 20:
            level = "Low"
        elif risk_score < 40:
            level = "Moderate"
        elif risk_score < 60:
            level = "High"
        else:
            level = "Critical"

        return {
            "risk_score": risk_score,
            "risk_level": level,
            "risk_factors": risk_factors,
            "clinical_note": "Risk score calculated based on HRV (SDNN/RMSSD), RHR, and BP guidelines."
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/v1/risk/fatigue")
def calculate_fatigue_risk(data: dict):
    """
    Calculate Fatigue Score based on Sleep History and Circadian Rhythm.
    """
    try:
        fatigue_score = 0
        contributors = []

        # Extract data
        last_sleep = data.get('last_sleep_duration_hours', 0)
        avg_sleep = data.get('avg_sleep_7days', 0)
        hours_awake = data.get('hours_awake', 0)
        current_hour = data.get('current_hour', 12)

        # Acute Sleep Loss
        sleep_deficit = 8.0 - last_sleep
        if sleep_deficit > 0:
            score_increase = (sleep_deficit ** 1.5) * 5
            fatigue_score += score_increase
            if sleep_deficit > 2:
                contributors.append(f"Acute Sleep Loss ({sleep_deficit:.1f} hrs deficit)")

        # Chronic Sleep Debt
        avg_deficit = 8.0 - avg_sleep
        if avg_deficit > 1:
            fatigue_score += (avg_deficit * 10)
            contributors.append(f"Chronic Sleep Debt (Avg {avg_sleep} hrs/night)")

        # Time Awake
        if hours_awake > 16:
            fatigue_score += 20
            contributors.append(f"Prolonged Wakefulness ({hours_awake} hrs)")
        elif hours_awake > 20:
            fatigue_score += 40
            contributors.append("Critical Wakefulness (>20 hrs) - High Accident Risk")

        # Circadian Phase
        if 2 <= current_hour <= 5:
            fatigue_score += 25
            contributors.append("Circadian Low (Biological Night)")
        elif 13 <= current_hour <= 15:
            fatigue_score += 10
            contributors.append("Post-Lunch Dip")

        fatigue_score = min(fatigue_score, 100)
        fit_to_work = fatigue_score <= 60

        return {
            "fatigue_score": round(fatigue_score, 1),
            "fit_to_work": fit_to_work,
            "risk_level": "Critical" if fatigue_score > 70 else "High" if fatigue_score > 50 else "Moderate" if fatigue_score > 30 else "Low",
            "contributors": contributors
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
