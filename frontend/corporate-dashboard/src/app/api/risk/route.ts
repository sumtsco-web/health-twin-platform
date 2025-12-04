import { NextResponse } from 'next/server';

// Mock data for fallback
const MOCK_DATA = {
    cardiac: {
        risk_score: 45,
        risk_level: "Moderate",
        risk_factors: [
            "Reduced HRV (SDNN < 100ms)",
            "Elevated Resting HR (82 bpm)"
        ]
    },
    fatigue: {
        fatigue_score: 65,
        fit_to_work: false,
        risk_level: "High",
        contributors: [
            "Chronic Sleep Debt (Avg 5.5 hrs/night)",
            "Circadian Low (Biological Night)"
        ]
    },
    trends: [
        { name: 'Mon', risk: 42, fatigue: 30 },
        { name: 'Tue', risk: 35, fatigue: 25 },
        { name: 'Wed', risk: 50, fatigue: 65 },
        { name: 'Thu', risk: 45, fatigue: 40 },
        { name: 'Fri', risk: 38, fatigue: 35 },
        { name: 'Sat', risk: 30, fatigue: 20 },
        { name: 'Sun', risk: 25, fatigue: 15 },
    ]
};

export async function GET() {
    try {
        // 1. Try to fetch from the Real Python Risk Engine
        // We'll send some sample data to calculate risk
        const cardiacPayload = {
            age: 45,
            resting_hr: 82,
            hrv_sdnn: 45,
            hrv_rmssd: 18,
            systolic_bp: 135,
            diastolic_bp: 85,
            bmi: 28
        };

        const fatiguePayload = {
            last_sleep_duration_hours: 5.5,
            avg_sleep_7days: 6.0,
            hours_awake: 18,
            current_hour: 3, // 3 AM - Circadian low
            shift_type: "night"
        };

        // Parallel fetch to Python Microservice
        const [cardiacRes, fatigueRes] = await Promise.all([
            fetch('http://localhost:8005/api/v1/risk/cardiac', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardiacPayload)
            }),
            fetch('http://localhost:8005/api/v1/risk/fatigue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fatiguePayload)
            })
        ]);

        if (cardiacRes.ok && fatigueRes.ok) {
            const cardiacData = await cardiacRes.json();
            const fatigueData = await fatigueRes.json();

            return NextResponse.json({
                cardiac: cardiacData,
                fatigue: fatigueData,
                trends: MOCK_DATA.trends // We'll keep mock trends for now as the engine is stateless
            });
        }

        throw new Error('Backend service unavailable');

    } catch (error) {
        console.warn('Risk Engine unavailable, using mock data:', error);
        // 2. Fallback to Mock Data if Python is down
        return NextResponse.json(MOCK_DATA);
    }
}
