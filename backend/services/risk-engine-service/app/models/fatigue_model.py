from pydantic import BaseModel
from datetime import datetime

class FatigueInput(BaseModel):
    last_sleep_duration_hours: float
    avg_sleep_7days: float
    hours_awake: float
    current_hour: int  # 0-23
    shift_type: str    # 'day', 'night', 'rotating'

class FatigueRiskModel:
    """
    Bio-Mathematical Fatigue Model (BMM).
    
    Based on:
    1. Two-Process Model of Sleep Regulation (Borbély, 1982) - Homeostatic (S) + Circadian (C).
    2. Dawson & Reid (1997) - Fatigue vs. Alcohol impairment equivalence.
    """

    def calculate_fatigue(self, data: FatigueInput) -> dict:
        fatigue_score = 0
        contributors = []

        # 1. Acute Sleep Loss (Homeostatic Process S)
        # Baseline need assumed at 8 hours.
        sleep_deficit = 8.0 - data.last_sleep_duration_hours
        if sleep_deficit > 0:
            # Exponential increase in fatigue for every hour lost
            score_increase = (sleep_deficit ** 1.5) * 5
            fatigue_score += score_increase
            if sleep_deficit > 2:
                contributors.append(f"Acute Sleep Loss ({sleep_deficit:.1f} hrs deficit)")

        # 2. Chronic Sleep Debt (Last 7 days)
        # Cumulative debt is dangerous.
        avg_deficit = 8.0 - data.avg_sleep_7days
        if avg_deficit > 1:
            fatigue_score += (avg_deficit * 10)
            contributors.append(f"Chronic Sleep Debt (Avg {data.avg_sleep_7days} hrs/night)")

        # 3. Time Awake (Homeostatic Pressure)
        # > 17 hours awake ≈ 0.05% BAC (Dawson & Reid)
        if data.hours_awake > 16:
            fatigue_score += 20
            contributors.append(f"Prolonged Wakefulness ({data.hours_awake} hrs)")
        elif data.hours_awake > 20:
            fatigue_score += 40
            contributors.append("Critical Wakefulness (>20 hrs) - High Accident Risk")

        # 4. Circadian Phase (Process C)
        # Nadir is typically 02:00 - 05:00
        if 2 <= data.current_hour <= 5:
            fatigue_score += 25
            contributors.append("Circadian Low (Biological Night)")
        elif 13 <= data.current_hour <= 15:
            fatigue_score += 10
            contributors.append("Post-Lunch Dip")

        # Cap score
        fatigue_score = min(fatigue_score, 100)

        # Fitness to Work Determination
        fit_to_work = True
        if fatigue_score > 60:
            fit_to_work = False

        return {
            "fatigue_score": round(fatigue_score, 1),
            "fit_to_work": fit_to_work,
            "risk_level": "Critical" if fatigue_score > 70 else "High" if fatigue_score > 50 else "Moderate" if fatigue_score > 30 else "Low",
            "contributors": contributors
        }
