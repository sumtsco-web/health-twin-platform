import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HealthScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Health Metrics</Text>
                <Text style={styles.subtitle}>Detailed health analysis</Text>
            </View>

            {/* Heart Health */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>❤️ Heart Health</Text>

                <View style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>Resting Heart Rate</Text>
                        <Text style={styles.metricValue}>72 bpm</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '70%', backgroundColor: '#4ade80' }]} />
                    </View>
                    <Text style={styles.metricStatus}>Normal range</Text>
                </View>

                <View style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>Heart Rate Variability</Text>
                        <Text style={styles.metricValue}>65 ms</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '65%', backgroundColor: '#fbbf24' }]} />
                    </View>
                    <Text style={styles.metricStatus}>Could be better</Text>
                </View>
            </View>

            {/* Sleep Analysis */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>😴 Sleep Analysis</Text>

                <View style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>Last Night</Text>
                        <Text style={styles.metricValue}>7.5 hrs</Text>
                    </View>
                    <View style={styles.sleepPhases}>
                        <View style={styles.phaseRow}>
                            <Text style={styles.phaseLabel}>Deep Sleep</Text>
                            <Text style={styles.phaseValue}>1.8 hrs</Text>
                        </View>
                        <View style={styles.phaseRow}>
                            <Text style={styles.phaseLabel}>REM Sleep</Text>
                            <Text style={styles.phaseValue}>2.1 hrs</Text>
                        </View>
                        <View style={styles.phaseRow}>
                            <Text style={styles.phaseLabel}>Light Sleep</Text>
                            <Text style={styles.phaseValue}>3.6 hrs</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>👟 Activity</Text>

                <View style={styles.activityGrid}>
                    <View style={styles.activityCard}>
                        <Text style={styles.activityValue}>8,432</Text>
                        <Text style={styles.activityLabel}>Steps</Text>
                    </View>
                    <View style={styles.activityCard}>
                        <Text style={styles.activityValue}>2,145</Text>
                        <Text style={styles.activityLabel}>Calories</Text>
                    </View>
                    <View style={styles.activityCard}>
                        <Text style={styles.activityValue}>5.2</Text>
                        <Text style={styles.activityLabel}>km</Text>
                    </View>
                    <View style={styles.activityCard}>
                        <Text style={styles.activityValue}>42</Text>
                        <Text style={styles.activityLabel}>Active min</Text>
                    </View>
                </View>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💡 Recommendations</Text>

                <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationTitle}>Improve HRV</Text>
                    <Text style={styles.recommendationText}>
                        Try meditation or breathing exercises for 10 minutes daily
                    </Text>
                </View>

                <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationTitle}>Stay Hydrated</Text>
                    <Text style={styles.recommendationText}>
                        Drink at least 2 liters of water throughout the day
                    </Text>
                </View>
            </View>

            <View style={styles.footer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e27',
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 16,
        color: '#9ca3af',
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    metricCard: {
        backgroundColor: '#1a1f3a',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#00d4ff33',
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    metricLabel: {
        fontSize: 16,
        color: '#9ca3af',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00d4ff',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#ffffff11',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
    },
    metricStatus: {
        fontSize: 14,
        color: '#9ca3af',
    },
    sleepPhases: {
        marginTop: 12,
    },
    phaseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    phaseLabel: {
        fontSize: 14,
        color: '#9ca3af',
    },
    phaseValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    activityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    activityCard: {
        backgroundColor: '#1a1f3a',
        borderRadius: 16,
        padding: 20,
        width: '48%',
        borderWidth: 1,
        borderColor: '#00d4ff33',
        alignItems: 'center',
    },
    activityValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00d4ff',
        marginBottom: 4,
    },
    activityLabel: {
        fontSize: 14,
        color: '#9ca3af',
    },
    recommendationCard: {
        backgroundColor: '#1a1f3a',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#00d4ff33',
    },
    recommendationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 14,
        color: '#9ca3af',
        lineHeight: 20,
    },
    footer: {
        height: 20,
    },
});
