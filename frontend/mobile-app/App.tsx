import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import HealthDataService from './src/services/HealthDataService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [watchConnected, setWatchConnected] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [dataSource, setDataSource] = useState('Local Sensor');

  useEffect(() => {
    initHealth();
  }, []);

  const initHealth = async () => {
    // 1. Try to initialize full Health Kit (Google Fit / Apple Health)
    const isHealthKitReady = await HealthDataService.initialize();

    if (isHealthKitReady) {
      const data = await HealthDataService.getHealthMetrics();
      setSteps(data.steps);
      setHeartRate(data.heartRate);
      setDataSource(data.source);
    } else {
      // 2. Fallback to Expo Pedometer (Works in Expo Go)
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        if (pastStepCountResult) {
          setSteps(pastStepCountResult.steps);
        }

        return Pedometer.watchStepCount(result => {
          setSteps(result.steps);
        });
      }
    }
  };

  const connectWatch = () => {
    setWatchConnected(true);
    Alert.alert("Watch Connected", "Syncing data from device...");
    // Simulate heart rate fluctuation
    setInterval(() => {
      setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
  };

  const HomeScreen = () => (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.greeting}>Good Evening</Text>
        <Text style={styles.userName}>Employee User</Text>
        <Text style={styles.smallText}>Source: {dataSource}</Text>
        {watchConnected && <Text style={styles.connectedText}>⌚ Watch Connected</Text>}
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.cardTitle}>Health Score</Text>
        <Text style={styles.scoreText}>92</Text>
        <Text style={styles.scoreLabel}>Excellent</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Live Activity (Real)</Text>
        <View style={styles.row}>
          <Text style={styles.label}>👟 Steps Today</Text>
          <Text style={styles.bigValue}>{steps}</Text>
        </View>
        <Text style={styles.smallText}>Sensor Status: {isPedometerAvailable === 'true' ? 'Active' : 'Unavailable'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vital Signs</Text>

        <View style={styles.row}>
          <Text style={styles.label}>❤️ Heart Rate</Text>
          <Text style={styles.value}>{heartRate} bpm</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>📊 HRV</Text>
          <Text style={styles.value}>65 ms</Text>
        </View>
      </View>

      {!watchConnected && (
        <TouchableOpacity style={styles.syncButton} onPress={connectWatch}>
          <Text style={styles.syncButtonText}>🔗 Connect Watch</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const HealthScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Metrics</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Heart Health</Text>
        <Text style={styles.bigValue}>72</Text>
        <Text style={styles.label}>Resting Heart Rate</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sleep Quality</Text>
        <Text style={styles.bigValue}>7.5</Text>
        <Text style={styles.label}>Hours Last Night</Text>
      </View>
    </ScrollView>
  );

  const ProfileScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>E</Text>
        </View>
        <Text style={styles.name}>Employee User</Text>
        <Text style={styles.email}>employee@healthtwin.com</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Info</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>Engineering</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Employee ID</Text>
          <Text style={styles.value}>EMP-001</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.appContainer}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'health' && <HealthScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setCurrentScreen('health')}
        >
          <Text style={styles.tabIcon}>❤️</Text>
          <Text style={[styles.tabLabel, currentScreen === 'health' && styles.tabActive]}>
            Health
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, currentScreen === 'profile' && styles.tabActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
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
  },
  card: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  label: {
    fontSize: 16,
    color: '#9ca3af',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  bigValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    marginVertical: 10,
  },
  badgeLow: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0a0e27',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1f3a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.2)',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  tabActive: {
    color: '#00d4ff',
    fontWeight: 'bold',
  },
  connectedText: {
    color: '#4ade80',
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
  },
  smallText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
  },
  syncButton: {
    backgroundColor: '#00d4ff22',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  syncButtonText: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
