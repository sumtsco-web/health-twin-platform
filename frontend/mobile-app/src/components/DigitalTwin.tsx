import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Activity, Zap } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface TwinProps {
    riskScore: number;
    status: 'Healthy' | 'Warning' | 'Critical';
}

export default function DigitalTwin({ riskScore, status }: TwinProps) {
    const getStatusColor = () => {
        if (status === 'Critical') return COLORS.danger;
        if (status === 'Warning') return COLORS.warning;
        return COLORS.safe;
    };

    const color = getStatusColor();

    return (
        <View style={styles.container}>
            {/* Pulsing Aura Layers */}
            {[...Array(3)].map((_, index) => (
                <MotiView
                    key={index}
                    from={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 + index * 0.2 }}
                    transition={{
                        type: 'timing',
                        duration: 2000,
                        loop: true,
                        delay: index * 400,
                    }}
                    style={[styles.aura, { borderColor: color }]}
                />
            ))}

            {/* Core Twin Visualization */}
            <LinearGradient
                colors={[COLORS.surfaceHighlight, COLORS.background]}
                style={styles.core}
            >
                <MotiView
                    from={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    transition={{
                        type: 'timing',
                        duration: 1500,
                        loop: true,
                    }}
                    style={styles.innerCore}
                >
                    <Activity size={48} color={color} />
                    <Text style={[styles.score, { color }]}>{riskScore}</Text>
                    <Text style={styles.label}>Risk Score</Text>
                </MotiView>
            </LinearGradient>

            {/* Floating Status Indicators */}
            <MotiView
                from={{ translateY: 0 }}
                animate={{ translateY: -10 }}
                transition={{ type: 'timing', duration: 2000, loop: true }}
                style={[styles.indicator, { top: 0, right: 20 }]}
            >
                <Heart size={20} color={COLORS.primary} />
            </MotiView>

            <MotiView
                from={{ translateY: 0 }}
                animate={{ translateY: 10 }}
                transition={{ type: 'timing', duration: 2500, loop: true }}
                style={[styles.indicator, { bottom: 20, left: 20 }]}
            >
                <Zap size={20} color={COLORS.accentCyan} />
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        marginVertical: 20,
    },
    aura: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
    },
    core: {
        width: 180,
        height: 180,
        borderRadius: 90,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    innerCore: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    score: {
        fontSize: 42,
        fontWeight: 'bold',
        marginTop: 10,
    },
    label: {
        color: COLORS.gray,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    indicator: {
        position: 'absolute',
        backgroundColor: COLORS.surfaceHighlight,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    }
});
