'use client';

import { useState, useEffect } from 'react';
import { Save, Bell, Shield, Users, Activity, Mail, Smartphone, Globe } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        // Alert Thresholds
        cardiacRiskThreshold: 60,
        fatigueThreshold: 70,
        hrvThreshold: 50,
        heartRateThreshold: 90,

        // Notifications
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        alertFrequency: 'immediate',

        // System
        dataRetention: 90,
        autoReports: true,
        reportFrequency: 'weekly',
        timezone: 'Asia/Dubai',
    });
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Load settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setSaveStatus('saving');

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setSaveStatus('success');
                alert('✅ Settings saved successfully!\n\nYour preferences have been updated and will take effect immediately.');
            } else {
                setSaveStatus('error');
                alert('❌ Failed to save settings. Please try again.');
            }
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus('error');
            alert('❌ Failed to save settings. Please try again.');
        } finally {
            setLoading(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Configure system preferences and alert thresholds</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors shadow-glow-primary ${loading ? 'bg-primary/50 cursor-not-allowed' :
                            saveStatus === 'success' ? 'bg-status-safe' :
                                'bg-primary hover:bg-primary/80'
                        }`}
                >
                    <Save size={20} />
                    <span>
                        {loading ? 'Saving...' :
                            saveStatus === 'success' ? 'Saved!' :
                                'Save Changes'}
                    </span>
                </button>
            </div>

            {/* Alert Thresholds */}
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-status-danger/20">
                        <Activity size={24} className="text-status-danger" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Alert Thresholds</h2>
                        <p className="text-sm text-gray-400">Set risk score thresholds for triggering alerts</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cardiac Risk Threshold
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.cardiacRiskThreshold}
                                onChange={(e) => setSettings({ ...settings, cardiacRiskThreshold: parseInt(e.target.value) })}
                                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-white font-bold w-12 text-right">{settings.cardiacRiskThreshold}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Alert when cardiac risk exceeds this value</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Fatigue Threshold
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.fatigueThreshold}
                                onChange={(e) => setSettings({ ...settings, fatigueThreshold: parseInt(e.target.value) })}
                                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-white font-bold w-12 text-right">{settings.fatigueThreshold}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Alert when fatigue score exceeds this value</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            HRV Minimum (ms)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="20"
                                max="120"
                                value={settings.hrvThreshold}
                                onChange={(e) => setSettings({ ...settings, hrvThreshold: parseInt(e.target.value) })}
                                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-white font-bold w-12 text-right">{settings.hrvThreshold}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Alert when HRV drops below this value</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Heart Rate Maximum (bpm)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="60"
                                max="120"
                                value={settings.heartRateThreshold}
                                onChange={(e) => setSettings({ ...settings, heartRateThreshold: parseInt(e.target.value) })}
                                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-white font-bold w-12 text-right">{settings.heartRateThreshold}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Alert when resting HR exceeds this value</p>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/20">
                        <Bell size={24} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                        <p className="text-sm text-gray-400">Configure how you receive alerts</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-gray-400" />
                            <div>
                                <p className="font-medium text-white">Email Notifications</p>
                                <p className="text-sm text-gray-400">Receive alerts via email</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Smartphone size={20} className="text-gray-400" />
                            <div>
                                <p className="font-medium text-white">SMS Notifications</p>
                                <p className="text-sm text-gray-400">Receive alerts via SMS</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.smsNotifications}
                                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className="text-gray-400" />
                            <div>
                                <p className="font-medium text-white">Push Notifications</p>
                                <p className="text-sm text-gray-400">Receive browser push notifications</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.pushNotifications}
                                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Alert Frequency
                        </label>
                        <select
                            value={settings.alertFrequency}
                            onChange={(e) => setSettings({ ...settings, alertFrequency: e.target.value })}
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                        >
                            <option value="immediate">Immediate</option>
                            <option value="hourly">Hourly Digest</option>
                            <option value="daily">Daily Summary</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* System Settings */}
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-accent-cyan/20">
                        <Shield size={24} className="text-accent-cyan" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">System Settings</h2>
                        <p className="text-sm text-gray-400">General system configuration</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Data Retention (days)
                        </label>
                        <input
                            type="number"
                            value={settings.dataRetention}
                            onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                        />
                        <p className="text-xs text-gray-500 mt-1">How long to keep historical data</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Timezone
                        </label>
                        <select
                            value={settings.timezone}
                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                        >
                            <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                            <option value="America/New_York">America/New York (UTC-5)</option>
                            <option value="Europe/London">Europe/London (UTC+0)</option>
                            <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <p className="font-medium text-white">Auto-Generate Reports</p>
                            <p className="text-sm text-gray-400">Automatically create weekly reports</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.autoReports}
                                onChange={(e) => setSettings({ ...settings, autoReports: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Report Frequency
                        </label>
                        <select
                            value={settings.reportFrequency}
                            onChange={(e) => setSettings({ ...settings, reportFrequency: e.target.value })}
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
