'use client';

import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, Bell, Filter } from 'lucide-react';

interface Alert {
    id: string;
    type: 'critical' | 'high' | 'moderate';
    title: string;
    description: string;
    employee: string;
    employeeCode: string;
    department: string;
    timestamp: string;
    status: 'active' | 'acknowledged' | 'resolved';
    riskScore: number;
}

const mockAlerts: Alert[] = [
    {
        id: '1',
        type: 'critical',
        title: 'Severe Fatigue Detected',
        description: 'Employee showing critical fatigue levels (Score: 85). Immediate rest required. Sleep debt accumulated over 12 hours.',
        employee: 'Omar Abdullah',
        employeeCode: 'EMP-1005',
        department: 'Drilling Operations',
        timestamp: '2 minutes ago',
        status: 'active',
        riskScore: 85
    },
    {
        id: '2',
        type: 'critical',
        title: 'Cardiac Risk Elevated',
        description: 'HRV dropped 40% below baseline. Resting heart rate elevated to 95 bpm. Recommend medical consultation.',
        employee: 'Ahmed Al-Mansoori',
        employeeCode: 'EMP-1001',
        department: 'Drilling Operations',
        timestamp: '5 minutes ago',
        status: 'active',
        riskScore: 72
    },
    {
        id: '3',
        type: 'high',
        title: 'Heat Stress Warning',
        description: 'Core temperature trending upward. WBGT index exceeds safe threshold for current activity level.',
        employee: 'Mohammed Hassan',
        employeeCode: 'EMP-1003',
        department: 'Maintenance',
        timestamp: '12 minutes ago',
        status: 'acknowledged',
        riskScore: 58
    },
    {
        id: '4',
        type: 'moderate',
        title: 'Sleep Quality Declining',
        description: 'Average sleep duration below 6 hours for past 3 days. Fatigue risk increasing.',
        employee: 'Sarah Johnson',
        employeeCode: 'EMP-1002',
        department: 'Production',
        timestamp: '1 hour ago',
        status: 'acknowledged',
        riskScore: 42
    },
    {
        id: '5',
        type: 'high',
        title: 'Prolonged Shift Alert',
        description: 'Employee has been awake for 18+ hours. Accident risk significantly elevated.',
        employee: 'Emily Chen',
        employeeCode: 'EMP-1004',
        department: 'Safety & Compliance',
        timestamp: '2 hours ago',
        status: 'resolved',
        riskScore: 65
    },
];

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
    const [filterType, setFilterType] = useState<'all' | 'critical' | 'high' | 'moderate'>('all');

    const handleAcknowledge = (alertId: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
        ));
        // Show success message
        alert(`Alert acknowledged successfully!\n\nThe alert has been marked as acknowledged and moved to the acknowledged queue.`);
    };

    const handleResolve = (alertId: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
        ));
        // Show success message
        alert(`Alert resolved successfully!\n\nThe alert has been marked as resolved.`);
    };

    const handleViewEmployee = (employeeCode: string, employeeName: string) => {
        // Navigate to employees page with this employee selected
        alert(`Navigating to employee profile...\n\nEmployee: ${employeeName}\nCode: ${employeeCode}\n\nThis would open the employee detail modal.`);
        // In a real app: router.push(`/employees?id=${employeeCode}`)
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'critical': return 'bg-status-critical/20 text-status-critical border-status-critical/30';
            case 'high': return 'bg-status-danger/20 text-status-danger border-status-danger/30';
            case 'moderate': return 'bg-status-warning/20 text-status-warning border-status-warning/30';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <AlertTriangle size={20} className="text-status-critical animate-pulse" />;
            case 'acknowledged': return <Clock size={20} className="text-status-warning" />;
            case 'resolved': return <CheckCircle size={20} className="text-status-safe" />;
            default: return <Bell size={20} />;
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
        const matchesType = filterType === 'all' || alert.type === filterType;
        return matchesStatus && matchesType;
    });

    const activeCount = alerts.filter(a => a.status === 'active').length;
    const criticalCount = alerts.filter(a => a.type === 'critical' && a.status === 'active').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Risk Alerts & Notifications</h1>
                <p className="text-gray-400">Monitor and respond to health alerts across your workforce</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-status-critical/20">
                            <AlertTriangle className="text-status-critical" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Alerts</p>
                            <p className="text-3xl font-bold text-white">{activeCount}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-status-danger/20">
                            <XCircle className="text-status-danger" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Critical</p>
                            <p className="text-3xl font-bold text-white">{criticalCount}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-status-safe/20">
                            <CheckCircle className="text-status-safe" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Resolved Today</p>
                            <p className="text-3xl font-bold text-white">12</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <Filter size={20} className="text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                    >
                        <option value="all">All Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="moderate">Moderate</option>
                    </select>
                </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                    <div key={alert.id} className="glass-panel rounded-2xl p-6 card-hover">
                        <div className="flex gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                {getStatusIcon(alert.status)}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-white">{alert.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(alert.type)}`}>
                                                {alert.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{alert.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{alert.timestamp}</span>
                                </div>

                                {/* Employee Info */}
                                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Employee:</span>
                                        <span className="text-sm text-white font-medium">{alert.employee}</span>
                                        <span className="text-xs text-gray-500">({alert.employeeCode})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Department:</span>
                                        <span className="text-sm text-white font-medium">{alert.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Risk Score:</span>
                                        <span className="text-sm text-white font-bold">{alert.riskScore}/100</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-4">
                                    {alert.status === 'active' && (
                                        <>
                                            <button
                                                onClick={() => handleAcknowledge(alert.id)}
                                                className="px-4 py-2 bg-primary/20 text-primary-glow rounded-lg hover:bg-primary/30 transition-colors text-sm"
                                            >
                                                Acknowledge
                                            </button>
                                            <button
                                                onClick={() => handleViewEmployee(alert.employeeCode, alert.employee)}
                                                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors text-sm"
                                            >
                                                View Employee
                                            </button>
                                            <button
                                                onClick={() => handleResolve(alert.id)}
                                                className="px-4 py-2 bg-status-safe/20 text-status-safe rounded-lg hover:bg-status-safe/30 transition-colors text-sm"
                                            >
                                                Mark Resolved
                                            </button>
                                        </>
                                    )}
                                    {alert.status === 'acknowledged' && (
                                        <button
                                            onClick={() => handleResolve(alert.id)}
                                            className="px-4 py-2 bg-status-safe/20 text-status-safe rounded-lg hover:bg-status-safe/30 transition-colors text-sm"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    {alert.status === 'resolved' && (
                                        <span className="text-sm text-status-safe flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            Resolved
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredAlerts.length === 0 && (
                <div className="glass-panel rounded-2xl p-12 text-center">
                    <CheckCircle size={48} className="mx-auto mb-4 text-status-safe" />
                    <h3 className="text-xl font-bold text-white mb-2">No alerts found</h3>
                    <p className="text-gray-400">All clear! No alerts match your current filters.</p>
                </div>
            )}
        </div>
    );
}
