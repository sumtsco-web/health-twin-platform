import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Menu, Thermometer, Moon, Activity } from 'lucide-react-native';
import DigitalTwin from '../components/DigitalTwin';
import { COLORS } from '../constants/theme';
import { fetchRiskData, RiskResponse, FatigueResponse } from '../services/api';

export default function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cardiacData, setCardiacData] = useState<RiskResponse | null>(null);
    const [fatigueData, setFatigueData] = useState<FatigueResponse | null>(null);

    const loadData = useCallback(async () => {
        try {
            const { cardiac, fatigue } = await fetchRiskData();
            setCardiacData(cardiac);
            setFatigueData(fatigue);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, COLORS.surface]}
                style={styles.background}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Menu color={COLORS.white} size={24} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.greeting}>Good Evening,</Text>
                        <Text style={styles.username}>John Doe</Text>
                    </View>
                    <TouchableOpacity style={styles.iconButton}>
                        <Bell color={COLORS.white} size={24} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>

                {/* Digital Twin Centerpiece */}
                <DigitalTwin
                    riskScore={cardiacData?.risk_score || 0}
                    status={cardiacData?.risk_level as any || 'Healthy'}
                />

                {/* Status Cards */}
                <View style={styles.statsGrid}>
                    <View style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                            <Activity color={COLORS.primary} size={24} />
                        </View>
                        <Text style={styles.cardValue}>
                            {cardiacData?.risk_score ? Math.round(100 - cardiacData.risk_score) : '--'}
                        </Text>
                        <Text style={styles.cardLabel}>Health Score</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Moon color={COLORS.safe} size={24} />
                        </View>
                        <Text style={styles.cardValue}>
                            {fatigueData?.fatigue_score ? Math.round(fatigueData.fatigue_score) : '--'}
                        </Text>
                        <Text style={styles.cardLabel}>Fatigue Index</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                            <Thermometer color={COLORS.warning} size={24} />
                        </View>
                        <Text style={styles.cardValue}>
                            {fatigueData?.fit_to_work ? 'FIT' : 'UNFIT'}
                        </Text>
                        <Text style={styles.cardLabel}>Status</Text>
                    </View>
                </View>

                {/* Risk Factors Section */}
                {cardiacData && cardiacData.risk_factors.length > 0 && (
                    <View style={styles.riskSection}>
                        <Text style={styles.sectionTitle}>Active Risk Factors</Text>
                        {cardiacData.risk_factors.map((factor, index) => (
                            <View key={index} style={styles.riskItem}>
                                <View style={styles.riskDot} />
                                <Text style={styles.riskText}>{factor}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Action Button */}
                <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
                    <LinearGradient
                        colors={['#6366F1', '#4F46E5']}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Sync Vitals Now</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        color: COLORS.gray,
        fontSize: 14,
    },
    username: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 10,
        backgroundColor: COLORS.surfaceHighlight,
        borderRadius: 12,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.danger,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    card: {
        backgroundColor: COLORS.surfaceHighlight,
        borderRadius: 20,
        padding: 15,
        width: '30%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconBox: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
    },
    cardValue: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardLabel: {
        color: COLORS.gray,
        fontSize: 12,
    },
    riskSection: {
        marginTop: 30,
        backgroundColor: COLORS.surfaceHighlight,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    riskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    riskDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.warning,
        marginRight: 12,
    },
    riskText: {
        color: COLORS.gray,
        fontSize: 14,
        flex: 1,
    },
    actionButton: {
        marginTop: 40,
        marginBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
