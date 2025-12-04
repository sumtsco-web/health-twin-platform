import numpy as np
from pydantic import BaseModel

class CardiacInput(BaseModel):
    age: int
    resting_hr: float
    hrv_sdnn: float  # Standard Deviation of NN intervals (ms)
    hrv_rmssd: float # Root Mean Square of Successive Differences (ms)
    systolic_bp: float
    diastolic_bp: float
    bmi: float

class CardiacRiskModel:
    """
    Evidence-Based Cardiac Risk Assessment Model.
    
    References:
    1. Shaffer, F., & Ginsberg, J. P. (2017). An Overview of Heart Rate Variability Metrics and Norms.
       Frontiers in Public Health.
    2. Framingham Heart Study Risk Factors (Age, BP, BMI).
    """

    def calculate_risk(self, data: CardiacInput) -> dict:
        risk_score = 0
        risk_factors = []

        # 1. HRV Analysis (The most sensitive real-time marker)
        # Scientific Basis: SDNN < 50ms is classified as "unhealthy" (Task Force of ESC/NASPE).
        if data.hrv_sdnn < 50:
            risk_score += 30
            risk_factors.append("Critically Low HRV (SDNN < 50ms) - High Autonomic Stress")
        elif data.hrv_sdnn < 100:
            risk_score += 15
            risk_factors.append("Reduced HRV (SDNN < 100ms) - Moderate Stress")

        # RMSSD Check (Parasympathetic Tone)
        if data.hrv_rmssd < 20:
            risk_score += 20
            risk_factors.append("Low Vagal Tone (RMSSD < 20ms) - Poor Recovery")

        # 2. Resting Heart Rate Analysis
        # Scientific Basis: RHR > 80 bpm correlates with higher cardiovascular mortality risk.
        if data.resting_hr > 90:
            risk_score += 25
            risk_factors.append(f"Tachycardia (RHR {data.resting_hr} bpm)")
        elif data.resting_hr > 80:
            risk_score += 15
            risk_factors.append(f"Elevated Resting HR ({data.resting_hr} bpm)")

        # 3. Blood Pressure (JNC 8 Guidelines)
        if data.systolic_bp > 140 or data.diastolic_bp > 90:
            risk_score += 20
            risk_factors.append(f"Hypertension Stage 2 ({data.systolic_bp}/{data.diastolic_bp})")
        elif data.systolic_bp > 130 or data.diastolic_bp > 80:
            risk_score += 10
            risk_factors.append(f"Hypertension Stage 1 ({data.systolic_bp}/{data.diastolic_bp})")

        # 4. BMI Impact
        if data.bmi > 30:
            risk_score += 10
            risk_factors.append(f"Obesity (BMI {data.bmi})")

        # Cap score at 100
        risk_score = min(risk_score, 100)

        # Determine Risk Level
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
