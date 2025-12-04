import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { API_URL } from '../services/api';

export default function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [healthData, setHealthData] = useState({
        healthScore: 92,
        heartRate: 72,
        hrv: 65,
        spo2: 98,
        temperature: 36.8,
        cardiacRisk: 'Low',
        fatigueLevel: 'Medium',
        steps: 8432,
        calories: 2145,
        sleep: 7.5,
    });

    const fetchHealthData = async () => {
        try {
            // Try to fetch real data from backend
            const response = await fetch(`${API_URL}/risk/cardiac`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    age: 35,
                    resting_hr: 72,
                    hrv_sdnn: 45,
                    hrv_rmssd: 25,
                    systolic_bp: 120,
                    diastolic_bp: 80,
                    bmi: 24
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Backend data:', data);
                // Update with real data when available
            }
        } catch (error) {
            console.log('Using demo data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHealthData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHealthData();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00d4ff" />
                <Text style={styles.loadingText}>Loading your health data...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00d4ff" />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
                <Text style={styles.userName}>Employee</Text>
            </View>

            {/* Health Score Card */}
            <View style={styles.scoreCard}>
                <Text style={styles.cardTitle}>Health Score</Text>
                <Text style={styles.scoreText}>{healthData.healthScore}</Text>
                <Text style={styles.scoreLabel}>Excellent</Text>
                <View style={styles.scoreBar}>
                    <View style={[styles.scoreBarFill, { width: `${healthData.healthScore}%` }]} />
                </View>
            </View>

            {/* Vital Signs */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Vital Signs</Text>

                <View style={styles.vitalRow}>
                    <Text style={styles.vitalLabel}>❤️ Heart Rate</Text>
                    <Text style={styles.vitalValue}>{healthData.heartRate} bpm</Text>
                </View>

                <View style={styles.vitalRow}>
                    <Text style={styles.vitalLabel}>📊 HRV</Text>
                    <Text style={styles.vitalValue}>{healthData.hrv} ms</Text>
                </View>

                <View style={styles.vitalRow}>
                    <Text style={styles.vitalLabel}>🫁 SpO2</Text>
                    <Text style={styles.vitalValue}>{healthData.spo2}%</Text>
                </View>

                <View style={styles.vitalRow}>
                    <Text style={styles.vitalLabel}>🌡️ Temperature</Text>
                    <Text style={styles.vitalValue}>{healthData.temperature}°C</Text>
                </View>
            </View>

            {/* Risk Assessment */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Risk Assessment</Text>

                <View style={styles.riskRow}>
                    <Text style={styles.riskLabel}>Cardiac Risk</Text>
                    <View style={[styles.riskBadge, styles.riskLow]}>
                        <Text style={styles.riskText}>{healthData.cardiacRisk}</Text>
                    </View>
                </View>

                <View style={styles.riskRow}>
                    <Text style={styles.riskLabel}>Fatigue Level</Text>
                    <View style={[styles.riskBadge, styles.riskMedium]}>
                        <Text style={styles.riskText}>{healthData.fatigueLevel}</Text>
                    </View>
                </View>
            </View>

            {/* Today's Activity */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Today's Activity</Text>

                <View style={styles.activityRow}>
                    <Text style={styles.activityLabel}>👟 Steps</Text>
                    <Text style={styles.activityValue}>{healthData.steps.toLocaleString()}</Text>
                </View>

                <View style={styles.activityRow}>
                    <Text style={styles.activityLabel}>🔥 Calories</Text>
                    <Text style={styles.activityValue}>{healthData.calories.toLocaleString()} kcal</Text>
                </View>

                <View style={styles.activityRow}>
                    <Text style={styles.activityLabel}>😴 Sleep</Text>
                    <Text style={styles.activityValue}>{healthData.sleep} hrs</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Last updated: Just now</Text>
                <Text style={styles.footerText}>Pull down to refresh</Text>
            </View>
        </ScrollView>
    );
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e27',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0a0e27',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#9ca3af',
        marginTop: 16,
        fontSize: 14,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    greeting: {
        fontSize: 16,
        color: '#9ca3af',
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 4,
    },
    scoreCard: {
        backgroundColor: '#1a1f3a',
        borderRadius: 20,
        padding: 24,
        margin: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#00d4ff33',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    scoreText: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#00d4ff',
        marginVertical: 10,
    },
    scoreLabel: {
        fontSize: 18,
        color: '#4ade80',
        marginBottom: 16,
    },
    scoreBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#ffffff11',
        borderRadius: 4,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: '100%',
        backgroundColor: '#00d4ff',
    },
    card: {
        backgroundColor: '#1a1f3a',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#00d4ff33',
    },
    vitalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff11',
    },
    vitalLabel: {
        fontSize: 16,
        color: '#9ca3af',
    },
    vitalValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    riskRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    riskLabel: {
        fontSize: 16,
        color: '#9ca3af',
    },
    riskBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    riskLow: {
        backgroundColor: '#4ade8033',
    },
    riskMedium: {
        backgroundColor: '#fbbf2433',
    },
    riskText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    activityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff11',
    },
    activityLabel: {
        fontSize: 16,
        color: '#9ca3af',
    },
    activityValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00d4ff',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#6b7280',
        marginVertical: 2,
    },
});
