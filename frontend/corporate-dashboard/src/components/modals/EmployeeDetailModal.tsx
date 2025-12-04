'use client';

import { X, Mail, Phone, Briefcase, Calendar, Activity, Heart, Moon, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmployeeDetailModalProps {
    employee: {
        id: string;
        name: string;
        employeeCode: string;
        department: string;
        role: string;
        riskScore: number;
        riskLevel: string;
        fatigueScore: number;
        fitToWork: boolean;
        lastSync: string;
    } | null;
    onClose: () => void;
}

export default function EmployeeDetailModal({ employee, onClose }: EmployeeDetailModalProps) {
    if (!employee) return null;

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'green': return 'text-status-safe';
            case 'yellow': return 'text-status-warning';
            case 'orange': return 'text-status-warning';
            case 'red': return 'text-status-danger';
            case 'critical': return 'text-status-critical';
            default: return 'text-gray-500';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl glass-panel rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-400" />
                    </button>

                    {/* Header */}
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-2xl font-bold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-2">{employee.name}</h2>
                            <p className="text-gray-400 mb-3">{employee.employeeCode}</p>
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${employee.riskLevel === 'green' ? 'bg-status-safe/20 text-status-safe border-status-safe/30' :
                                        employee.riskLevel === 'yellow' ? 'bg-status-warning/20 text-status-warning border-status-warning/30' :
                                            employee.riskLevel === 'red' ? 'bg-status-danger/20 text-status-danger border-status-danger/30' :
                                                'bg-status-critical/20 text-status-critical border-status-critical/30'
                                    }`}>
                                    {employee.riskLevel.toUpperCase()} RISK
                                </span>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${employee.fitToWork ? 'bg-status-safe/20 text-status-safe' : 'bg-status-critical/20 text-status-critical'
                                    }`}>
                                    {employee.fitToWork ? '✓ FIT TO WORK' : '✗ NOT FIT'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Role Info */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Briefcase size={20} className="text-primary" />
                                <h3 className="font-bold text-white">Role Information</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Department:</span>
                                    <span className="text-white font-medium">{employee.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Position:</span>
                                    <span className="text-white font-medium">{employee.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Employee ID:</span>
                                    <span className="text-white font-medium">{employee.employeeCode}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Mail size={20} className="text-accent-cyan" />
                                <h3 className="font-bold text-white">Contact Information</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-500" />
                                    <span className="text-white">{employee.name.toLowerCase().replace(' ', '.')}@company.com</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-500" />
                                    <span className="text-white">+971 50 123 4567</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-500" />
                                    <span className="text-white">Last sync: {employee.lastSync}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Health Metrics */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-4">Health Metrics</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Heart size={20} className="text-status-danger" />
                                    <span className="text-sm text-gray-400">Cardiac Risk</span>
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{employee.riskScore}</p>
                                <p className="text-xs text-gray-500">out of 100</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Moon size={20} className="text-primary" />
                                    <span className="text-sm text-gray-400">Fatigue Score</span>
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{employee.fatigueScore}</p>
                                <p className="text-xs text-gray-500">out of 100</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={20} className="text-accent-cyan" />
                                    <span className="text-sm text-gray-400">Overall Health</span>
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{100 - employee.riskScore}</p>
                                <p className="text-xs text-gray-500">Health Score</p>
                            </div>
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-4">Active Risk Factors</h3>
                        <div className="space-y-2">
                            {employee.riskScore > 60 && (
                                <div className="flex items-center gap-3 p-3 bg-status-danger/10 border border-status-danger/30 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-status-danger animate-pulse"></div>
                                    <span className="text-white">Elevated cardiac risk detected</span>
                                </div>
                            )}
                            {employee.fatigueScore > 70 && (
                                <div className="flex items-center gap-3 p-3 bg-status-warning/10 border border-status-warning/30 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-status-warning animate-pulse"></div>
                                    <span className="text-white">High fatigue levels</span>
                                </div>
                            )}
                            {!employee.fitToWork && (
                                <div className="flex items-center gap-3 p-3 bg-status-critical/10 border border-status-critical/30 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-status-critical animate-pulse"></div>
                                    <span className="text-white">Not cleared for work - immediate rest required</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button className="flex-1 py-3 bg-primary hover:bg-primary/80 rounded-xl text-white font-medium transition-colors">
                            View Full Health History
                        </button>
                        <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors">
                            Generate Report
                        </button>
                        <button className="px-6 py-3 bg-status-danger/20 hover:bg-status-danger/30 rounded-xl text-status-danger font-medium transition-colors">
                            Send Alert
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
