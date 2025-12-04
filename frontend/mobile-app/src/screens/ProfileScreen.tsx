import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function ProfileScreen({ navigation }: any) {
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => navigation.replace('Login')
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>E</Text>
                </View>
                <Text style={styles.name}>Employee User</Text>
                <Text style={styles.email}>employee1@healthtwin.com</Text>
            </View>

            {/* Profile Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Department</Text>
                        <Text style={styles.infoValue}>Engineering</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Employee ID</Text>
                        <Text style={styles.infoValue}>EMP-001</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Age</Text>
                        <Text style={styles.infoValue}>35 years</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Height</Text>
                        <Text style={styles.infoValue}>175 cm</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Weight</Text>
                        <Text style={styles.infoValue}>75 kg</Text>
                    </View>
                </View>
            </View>

            {/* Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingLabel}>🔔 Notifications</Text>
                    <Text style={styles.settingValue}>On</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingLabel}>📱 Connected Devices</Text>
                    <Text style={styles.settingValue}>2 devices</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingLabel}>🔒 Privacy</Text>
                    <Text style={styles.settingValue}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingLabel}>ℹ️ About</Text>
                    <Text style={styles.settingValue}>v1.0.0</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Health Twin™ v1.0.0</Text>
                <Text style={styles.footerText}>© 2025 All rights reserved</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e27',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#00d4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#0a0e27',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#9ca3af',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: '#1a1f3a',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#00d4ff33',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff11',
    },
    infoLabel: {
        fontSize: 16,
        color: '#9ca3af',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    settingItem: {
        backgroundColor: '#1a1f3a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00d4ff33',
    },
    settingLabel: {
        fontSize: 16,
        color: '#ffffff',
    },
    settingValue: {
        fontSize: 16,
        color: '#9ca3af',
    },
    logoutButton: {
        backgroundColor: '#ef444433',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    footer: {
        alignItems: 'center',
        padding: 32,
    },
    footerText: {
        fontSize: 12,
        color: '#6b7280',
        marginVertical: 2,
    },
});
