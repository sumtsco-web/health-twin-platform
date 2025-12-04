'use client';

import { useEffect, useState } from 'react';
import { Users, Activity, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RiskData {
    cardiac: {
        risk_score: number;
        risk_level: string;
        risk_factors: string[];
    };
    fatigue: {
        fatigue_score: number;
        fit_to_work: boolean;
        risk_level: string;
        contributors: string[];
    };
    trends: any[];
}

export default function Home() {
    const [data, setData] = useState<RiskData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/risk');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Failed to fetch risk data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Real-time health monitoring across all departments</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value="1,248"
                    trend="12%"
                    trendUp={true}
                    icon={Users}
                    color="primary"
                />
                <StatCard
                    title="Avg Cardiac Risk"
                    value={data.cardiac.risk_score}
                    trend="High"
                    trendUp={false}
                    icon={AlertTriangle}
                    color={data.cardiac.risk_level === 'High' ? 'danger' : 'warning'}
                />
                <StatCard
                    title="Avg Fatigue Score"
                    value={data.fatigue.fatigue_score}
                    trend="Critical"
                    trendUp={false}
                    icon={Activity}
                    color={data.fatigue.risk_level === 'High' ? 'danger' : 'warning'}
                />
                <StatCard
                    title="Fit to Work"
                    value={data.fatigue.fit_to_work ? '98%' : '85%'}
                    trend="Stable"
                    trendUp={true}
                    icon={CheckCircle}
                    color="success"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">

                {/* Chart Section */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Risk Trends</h3>
                        <select className="bg-surface border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trends}>
                                <defs>
                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#151B2B', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                                <Area type="monotone" dataKey="fatigue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorFatigue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Alerts / Heatmap List */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6">Risk Drivers</h3>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {/* Dynamic Risk Factors from API */}
                        {data.fatigue.contributors.map((factor, i) => (
                            <div key={`fatigue-${i}`} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-status-critical shadow-glow-danger animate-pulse"></span>
                                        <span className="font-medium text-white">Fatigue Risk</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">{factor}</p>
                            </div>
                        ))}

                        {data.cardiac.risk_factors.map((factor, i) => (
                            <div key={`cardiac-${i}`} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-status-warning shadow-glow-primary animate-pulse"></span>
                                        <span className="font-medium text-white">Cardiac Warning</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">{factor}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
