import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
const DEV_API_URL = Platform.select({
    android: 'http://10.0.2.2:8005/api/v1',
    ios: 'http://localhost:8005/api/v1',
    default: 'http://localhost:8005/api/v1',
});

export const API_URL = DEV_API_URL;

export interface RiskResponse {
    risk_score: number;
    risk_level: string;
    risk_factors: string[];
}

export interface FatigueResponse {
    fatigue_score: number;
    fit_to_work: boolean;
    risk_level: string;
    contributors: string[];
}

// Mock Data for Fallback
const MOCK_RISK_DATA = {
    risk_score: 35,
    risk_level: "Moderate",
    risk_factors: ["Elevated Resting HR", "Low HRV"]
};

const MOCK_FATIGUE_DATA = {
    fatigue_score: 42,
    fit_to_work: true,
    risk_level: "Moderate",
    contributors: ["Mild Sleep Debt"]
};

export const fetchRiskData = async (): Promise<{ cardiac: RiskResponse, fatigue: FatigueResponse }> => {
    try {
        // In a real app, we would send the user's recent health metrics here
        // For now, we'll send sample data to the risk engine
        const cardiacPayload = {
            age: 35,
            resting_hr: 72,
            hrv_sdnn: 45,
            hrv_rmssd: 25,
            systolic_bp: 120,
            diastolic_bp: 80,
            bmi: 24
        };

        const fatiguePayload = {
            last_sleep_duration_hours: 6.5,
            avg_sleep_7days: 6.8,
            hours_awake: 14,
            current_hour: new Date().getHours(),
            shift_type: "day"
        };

        const [cardiacRes, fatigueRes] = await Promise.all([
            fetch(`${API_URL}/risk/cardiac`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardiacPayload)
            }),
            fetch(`${API_URL}/risk/fatigue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fatiguePayload)
            })
        ]);

        if (cardiacRes.ok && fatigueRes.ok) {
            const cardiac = await cardiacRes.json();
            const fatigue = await fatigueRes.json();
            return { cardiac, fatigue };
        }

        throw new Error('Backend unavailable');

    } catch (error) {
        console.log('Using Mock Data (Backend unreachable)');
        return {
            cardiac: MOCK_RISK_DATA,
            fatigue: MOCK_FATIGUE_DATA
        };
    }
};
