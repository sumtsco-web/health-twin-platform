'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, TrendingUp, Users, Activity, Filter, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Report {
    id: string;
    title: string;
    type: 'health' | 'compliance' | 'incident' | 'trend';
    period: string;
    generatedDate: string;
    status: 'ready' | 'generating' | 'scheduled';
    size: string;
}

const mockReports: Report[] = [
    {
        id: '1',
        title: 'Weekly Health Summary',
        type: 'health',
        period: 'Nov 27 - Dec 3, 2025',
        generatedDate: '2025-12-03',
        status: 'ready',
        size: '2.4 MB'
    },
    {
        id: '2',
        title: 'Monthly Compliance Report',
        type: 'compliance',
        period: 'November 2025',
        generatedDate: '2025-12-01',
        status: 'ready',
        size: '5.1 MB'
    },
    {
        id: '3',
        title: 'Incident Analysis Q4',
        type: 'incident',
        period: 'Oct - Dec 2025',
        generatedDate: '2025-12-02',
        status: 'ready',
        size: '3.8 MB'
    },
    {
        id: '4',
        title: 'Risk Trend Analysis',
        type: 'trend',
        period: 'Last 30 Days',
        generatedDate: '2025-12-03',
        status: 'ready',
        size: '1.9 MB'
    },
];

// Mock data for charts
const departmentData = [
    { name: 'Drilling', employees: 450, highRisk: 45, avgRisk: 32 },
    { name: 'Production', employees: 320, highRisk: 28, avgRisk: 25 },
    { name: 'Maintenance', employees: 280, highRisk: 22, avgRisk: 28 },
    { name: 'Safety', employees: 120, highRisk: 8, avgRisk: 18 },
    { name: 'Admin', employees: 78, highRisk: 3, avgRisk: 15 },
];

const riskDistribution = [
    { name: 'Low Risk', value: 875, color: '#10B981' },
    { name: 'Moderate', value: 245, color: '#F59E0B' },
    { name: 'High Risk', value: 98, color: '#EF4444' },
    { name: 'Critical', value: 30, color: '#F43F5E' },
];

export default function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [selectedType, setSelectedType] = useState('all');

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'health': return 'bg-primary/20 text-primary-glow border-primary/30';
            case 'compliance': return 'bg-status-safe/20 text-status-safe border-status-safe/30';
            case 'incident': return 'bg-status-danger/20 text-status-danger border-status-danger/30';
            case 'trend': return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    const filteredReports = mockReports.filter(report =>
        selectedType === 'all' || report.type === selectedType
    );

    const handleGeneratePDF = async () => {
        try {
            const response = await fetch('http://localhost:8006/api/v1/pdf/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Weekly Health Summary Report',
                    period: 'Dec 4 - Dec 10, 2025',
                    generatedBy: 'Dr. AI',
                    stats: {
                        totalEmployees: 1248,
                        highRisk: 106,
                        avgRiskScore: 28,
                        fitToWork: 92
                    },
                    departments: departmentData,
                    alerts: [
                        { type: 'Cardiac Risk', severity: 'critical', count: 12 },
                        { type: 'Fatigue', severity: 'high', count: 28 },
                        { type: 'Heat Stress', severity: 'moderate', count: 15 }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Download the PDF
                window.open(`http://localhost:8006${data.filepath}`, '_blank');
                alert('PDF generated successfully!');
            } else {
                alert('PDF generation failed. Service may not be running.');
            }
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('PDF service unavailable. Please start the PDF service on port 8006.');
        }
    };

    const handleDownloadPDF = (reportId: string) => {
        // In a real app, this would download the actual PDF
        alert(`Downloading report ${reportId}...`);
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
                    <p className="text-gray-400">Generate and download comprehensive health reports</p>
                </div>
                <button
                    onClick={handleGeneratePDF}
                    className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl hover:bg-primary/80 transition-colors shadow-glow-primary"
                >
                    <FileText size={20} />
                    <span>Generate New Report</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/20">
                            <FileText className="text-primary" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Reports</p>
                            <p className="text-2xl font-bold text-white">127</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-status-safe/20">
                            <Users className="text-status-safe" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Employees Monitored</p>
                            <p className="text-2xl font-bold text-white">1,248</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-status-warning/20">
                            <Activity className="text-status-warning" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Avg Risk Score</p>
                            <p className="text-2xl font-bold text-white">28</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent-cyan/20">
                            <TrendingUp className="text-accent-cyan" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Improvement</p>
                            <p className="text-2xl font-bold text-white">+12%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Risk Chart */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Risk by Department</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#151B2B', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="highRisk" fill="#EF4444" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="avgRisk" fill="#6366F1" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-status-danger"></div>
                            <span className="text-sm text-gray-400">High Risk Count</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-sm text-gray-400">Avg Risk Score</span>
                        </div>
                    </div>
                </div>

                {/* Risk Distribution Pie Chart */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Overall Risk Distribution</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#151B2B', borderColor: '#334155', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <Filter size={20} className="text-gray-400" />

                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
                    >
                        <option value="all">All Types</option>
                        <option value="health">Health Reports</option>
                        <option value="compliance">Compliance</option>
                        <option value="incident">Incident Analysis</option>
                        <option value="trend">Trend Reports</option>
                    </select>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Available Reports</h3>

                {filteredReports.map((report) => (
                    <div key={report.id} className="glass-panel rounded-2xl p-6 card-hover">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white/5">
                                    <FileText size={24} className="text-primary" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-lg font-bold text-white">{report.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(report.type)}`}>
                                            {report.type.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{report.period}</span>
                                        </div>
                                        <span>•</span>
                                        <span>Generated: {report.generatedDate}</span>
                                        <span>•</span>
                                        <span>{report.size}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => alert(`Preview for ${report.title}\n\nThis would open a preview modal showing:\n- Report summary\n- Key metrics\n- Charts and visualizations`)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors flex items-center gap-2"
                                >
                                    <Eye size={16} />
                                    <span>Preview</span>
                                </button>
                                <button
                                    onClick={() => handleDownloadPDF(report.id)}
                                    className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary-glow transition-colors flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    <span>Download PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Report Templates */}
            <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Report Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                                <Activity size={20} className="text-primary" />
                            </div>
                            <h4 className="font-bold text-white">Health Summary</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Comprehensive health metrics and risk analysis</p>
                        <button
                            onClick={handleGeneratePDF}
                            className="w-full py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary-glow text-sm transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-status-safe/20">
                                <FileText size={20} className="text-status-safe" />
                            </div>
                            <h4 className="font-bold text-white">Compliance Report</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Regulatory compliance and audit documentation</p>
                        <button
                            onClick={handleGeneratePDF}
                            className="w-full py-2 bg-status-safe/20 hover:bg-status-safe/30 rounded-lg text-status-safe text-sm transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-accent-cyan/20">
                                <TrendingUp size={20} className="text-accent-cyan" />
                            </div>
                            <h4 className="font-bold text-white">Trend Analysis</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Historical trends and predictive insights</p>
                        <button
                            onClick={handleGeneratePDF}
                            className="w-full py-2 bg-accent-cyan/20 hover:bg-accent-cyan/30 rounded-lg text-accent-cyan text-sm transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
