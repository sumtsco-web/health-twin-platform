import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';

const API_URL = 'https://health-twin-auth-service-v2.onrender.com/api/v1';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and navigate to main app
                navigation.replace('Main');
            } else {
                Alert.alert('Login Failed', data.message || 'Invalid credentials');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to server. Using demo mode.');
            // For demo purposes, allow login anyway
            navigation.replace('Main');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.logo}>Health Twin™</Text>
                <Text style={styles.subtitle}>Your Digital Health Companion</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="employee@healthtwin.com"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#6b7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.demoButton} onPress={() => navigation.replace('Main')}>
                    <Text style={styles.demoText}>Continue as Demo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Demo Credentials:</Text>
                <Text style={styles.footerText}>employee1@healthtwin.com / password123</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e27',
        padding: 20,
    },
    header: {
        marginTop: 80,
        marginBottom: 60,
        alignItems: 'center',
    },
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#00d4ff',
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#9ca3af',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#1a1f3a',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#00d4ff33',
    },
    button: {
        backgroundColor: '#00d4ff',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 32,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0a0e27',
    },
    demoButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    demoText: {
        fontSize: 14,
        color: '#00d4ff',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#6b7280',
        marginVertical: 2,
    },
});
