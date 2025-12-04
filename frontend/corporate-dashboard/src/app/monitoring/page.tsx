'use client';

import { useState, useEffect } from 'react';
import { Activity, Heart, Droplet, Thermometer, Moon, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface VitalSign {
    timestamp: string;
    value: number;
}

interface EmployeeVitals {
    id: string;
    name: string;
    heartRate: number;
    hrv: number;
    spo2: number;
    temperature: number;
    sleepScore: number;
    status: 'normal' | 'warning' | 'critical';
    trend: 'up' | 'down' | 'stable';
    heartRateHistory: VitalSign[];
}

// Mock real-time data
const generateMockData = (): EmployeeVitals[] => [
    {
        id: '1',
        name: 'Ahmed Al-Mansoori',
        heartRate: 78 + Math.floor(Math.random() * 10),
        hrv: 45 + Math.floor(Math.random() * 15),
        spo2: 97 + Math.floor(Math.random() * 3),
        temperature: 36.5 + Math.random() * 0.5,
        sleepScore: 72,
        status: Math.random() > 0.7 ? 'warning' : 'normal',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        heartRateHistory: Array.from({ length: 20 }, (_, i) => ({
            timestamp: `${i}s`,
            value: 75 + Math.floor(Math.random() * 15)
        }))
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        heartRate: 72 + Math.floor(Math.random() * 8),
        hrv: 55 + Math.floor(Math.random() * 10),
        spo2: 98 + Math.floor(Math.random() * 2),
        temperature: 36.6 + Math.random() * 0.3,
        sleepScore: 85,
        status: 'normal',
        trend: 'stable',
        heartRateHistory: Array.from({ length: 20 }, (_, i) => ({
            timestamp: `${i}s`,
            value: 70 + Math.floor(Math.random() * 10)
        }))
    },
    {
        id: '3',
        name: 'Omar Abdullah',
        heartRate: 95 + Math.floor(Math.random() * 10),
        hrv: 32 + Math.floor(Math.random() * 8),
        spo2: 94 + Math.floor(Math.random() * 3),
        temperature: 37.2 + Math.random() * 0.4,
        sleepScore: 45,
        status: 'critical',
        trend: 'up',
        heartRateHistory: Array.from({ length: 20 }, (_, i) => ({
            timestamp: `${i}s`,
            value: 90 + Math.floor(Math.random() * 15)
        }))
    },
];

export default function MonitoringPage() {
    const [employees, setEmployees] = useState<EmployeeVitals[]>(generateMockData());
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setEmployees(generateMockData());
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'normal': return 'bg-status-safe/20 text-status-safe border-status-safe/30';
            case 'warning': return 'bg-status-warning/20 text-status-warning border-status-warning/30';
            case 'critical': return 'bg-status-critical/20 text-status-critical border-status-critical/30';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'up') return <TrendingUp size={16} className="text-status-danger" />;
        if (trend === 'down') return <TrendingDown size={16} className="text-status-safe" />;
        return <Activity size={16} className="text-gray-400" />;
    };

    const selected = employees.find(e => e.id === selectedEmployee);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Live Health Monitoring</h1>
                    <p className="text-gray-400">Real-time vital signs from connected wearables</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-status-safe animate-pulse"></div>
                    <span className="text-sm text-gray-400">Live</span>
                </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        onClick={() => setSelectedEmployee(employee.id)}
                        className={`glass-panel rounded-2xl p-6 card-hover cursor-pointer ${selectedEmployee === employee.id ? 'ring-2 ring-primary' : ''
                            }`}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-white mb-1">{employee.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                                    {employee.status.toUpperCase()}
                                </span>
                            </div>
                            {getTrendIcon(employee.trend)}
                        </div>

                        {/* Vitals Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Heart size={16} className="text-status-danger" />
                                    <span className="text-xs text-gray-400">Heart Rate</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{employee.heartRate}</p>
                                <p className="text-xs text-gray-500">bpm</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={16} className="text-primary" />
                                    <span className="text-xs text-gray-400">HRV</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{employee.hrv}</p>
                                <p className="text-xs text-gray-500">ms</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplet size={16} className="text-accent-cyan" />
                                    <span className="text-xs text-gray-400">SpO2</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{employee.spo2}</p>
                                <p className="text-xs text-gray-500">%</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Thermometer size={16} className="text-status-warning" />
                                    <span className="text-xs text-gray-400">Temp</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{employee.temperature.toFixed(1)}</p>
                                <p className="text-xs text-gray-500">°C</p>
                            </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="mt-4 h-16">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={employee.heartRateHistory}>
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed View */}
            {selected && (
                <div className="glass-panel rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Detailed Monitoring - {selected.name}</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Heart Rate Chart */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Heart Rate (Last 60s)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selected.heartRateHistory}>
                                        <XAxis dataKey="timestamp" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#151B2B', borderColor: '#334155' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#EF4444"
                                            strokeWidth={3}
                                            dot={{ fill: '#EF4444', r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Additional Metrics */}
                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <Moon size={24} className="text-primary" />
                                    <span className="text-white font-medium">Sleep Quality</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-white/10 rounded-full h-3">
                                        <div
                                            className="bg-primary h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${selected.sleepScore}%` }}
                                        />
                                    </div>
                                    <span className="text-white font-bold">{selected.sleepScore}%</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="text-white font-medium mb-3">Recent Alerts</h4>
                                <div className="space-y-2">
                                    {selected.status === 'critical' && (
                                        <div className="flex items-center gap-2 text-status-critical text-sm">
                                            <div className="w-2 h-2 rounded-full bg-status-critical animate-pulse"></div>
                                            <span>Elevated heart rate detected</span>
                                        </div>
                                    )}
                                    {selected.status === 'warning' && (
                                        <div className="flex items-center gap-2 text-status-warning text-sm">
                                            <div className="w-2 h-2 rounded-full bg-status-warning"></div>
                                            <span>HRV below baseline</span>
                                        </div>
                                    )}
                                    {selected.status === 'normal' && (
                                        <div className="flex items-center gap-2 text-status-safe text-sm">
                                            <div className="w-2 h-2 rounded-full bg-status-safe"></div>
                                            <span>All vitals normal</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
