import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function StatCard({ title, value, trend, trendUp, icon: Icon, color = 'primary' }: StatCardProps) {
    const colorMap = {
        primary: 'text-primary-glow bg-primary/10 border-primary/20',
        success: 'text-status-safe bg-status-safe/10 border-status-safe/20',
        warning: 'text-status-warning bg-status-warning/10 border-status-warning/20',
        danger: 'text-status-critical bg-status-critical/10 border-status-critical/20',
    };

    return (
        <div className="glass-panel p-6 rounded-2xl card-hover relative overflow-hidden group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorMap[color]} transition-colors`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-status-safe/20 text-status-safe' : 'bg-status-critical/20 text-status-critical'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                </div>
            )}

            {/* Background decoration */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl ${color === 'primary' ? 'bg-primary' :
                    color === 'danger' ? 'bg-status-critical' :
                        color === 'warning' ? 'bg-status-warning' : 'bg-status-safe'
                }`} />
        </div>
    );
}
