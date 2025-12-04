import { Platform } from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AppleHealthKit, { HealthValue, HealthKitPermissions } from 'react-native-health';

export interface HealthData {
    steps: number;
    heartRate: number;
    sleepHours: number;
    weight: number;
    source: 'Google Fit' | 'Apple Health' | 'Simulated';
}

class HealthDataService {
    private isInitialized = false;

    async initialize(): Promise<boolean> {
        if (this.isInitialized) return true;

        if (Platform.OS === 'android') {
            return this.initGoogleFit();
        } else if (Platform.OS === 'ios') {
            return this.initAppleHealth();
        }
        return false;
    }

    // ANDROID: Google Fit Configuration
    private async initGoogleFit(): Promise<boolean> {
        const options = {
            scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_BODY_READ,
                Scopes.FITNESS_SLEEP_READ,
                Scopes.FITNESS_HEART_RATE_READ,
            ],
        };

        try {
            const authResult = await GoogleFit.authorize(options);
            if (authResult.success) {
                this.isInitialized = true;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Google Fit Auth Error:', error);
            return false;
        }
    }

    // iOS: Apple Health Configuration
    private async initAppleHealth(): Promise<boolean> {
        const permissions = {
            permissions: {
                read: [
                    AppleHealthKit.Constants.Permissions.HeartRate,
                    AppleHealthKit.Constants.Permissions.Steps,
                    AppleHealthKit.Constants.Permissions.SleepAnalysis,
                    AppleHealthKit.Constants.Permissions.Weight,
                ],
            },
        } as HealthKitPermissions;

        return new Promise((resolve) => {
            AppleHealthKit.initHealthKit(permissions, (error: string) => {
                if (error) {
                    console.error('Apple Health Auth Error:', error);
                    resolve(false);
                } else {
                    this.isInitialized = true;
                    resolve(true);
                }
            });
        });
    }

    // FETCH DATA
    async getHealthMetrics(): Promise<HealthData> {
        if (!this.isInitialized) {
            // Fallback to simulated data if native sensors aren't ready (e.g. in Expo Go)
            return {
                steps: 0,
                heartRate: 0,
                sleepHours: 0,
                weight: 0,
                source: 'Simulated'
            };
        }

        if (Platform.OS === 'android') {
            return this.getAndroidData();
        } else {
            return this.getIOSData();
        }
    }

    // ANDROID DATA FETCHING
    private async getAndroidData(): Promise<HealthData> {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const opt = {
            startDate: yesterday.toISOString(),
            endDate: today.toISOString(),
        };

        const steps = await GoogleFit.getDailyStepCountSamples(opt);
        const heartRate = await GoogleFit.getHeartRateSamples(opt);

        // Simple aggregation logic
        const stepCount = steps.length > 0 ? (steps[0].steps[0]?.value || 0) : 0;
        const lastHeartRate = heartRate.length > 0 ? heartRate[heartRate.length - 1].value : 72;

        return {
            steps: stepCount,
            heartRate: lastHeartRate,
            sleepHours: 7.5, // Google Fit sleep API is complex, using placeholder for MVP
            weight: 75,
            source: 'Google Fit'
        };
    }

    // iOS DATA FETCHING
    private async getIOSData(): Promise<HealthData> {
        return new Promise((resolve) => {
            const options = {
                startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
            };

            AppleHealthKit.getStepCount(options, (err, results) => {
                const steps = results ? results.value : 0;

                // In a real app, we'd nest these callbacks or use Promises properly
                resolve({
                    steps: steps,
                    heartRate: 72, // Placeholder for async simplicity
                    sleepHours: 7.5,
                    weight: 75,
                    source: 'Apple Health'
                });
            });
        });
    }
}

export default new HealthDataService();
