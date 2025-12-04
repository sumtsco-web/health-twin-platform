'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Activity,
    AlertTriangle,
    FileText,
    Settings,
    LogOut,
    HeartPulse
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/' },
    { icon: Users, label: 'Employees', href: '/employees' },
    { icon: Activity, label: 'Live Monitoring', href: '/monitoring' },
    { icon: AlertTriangle, label: 'Risk Alerts', href: '/alerts' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        const confirmed = confirm('Are you sure you want to sign out?');
        if (confirmed) {
            router.push('/login');
        }
    };

    return (
        <aside className="w-64 h-full glass-panel border-r border-white/10 flex flex-col z-20">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center shadow-glow-primary">
                    <HeartPulse className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight text-white">Health Twin™</h1>
                    <p className="text-xs text-gray-400">Corporate Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? 'bg-primary/20 text-white shadow-glow-primary border border-primary/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary-glow' : 'group-hover:text-white'}`} />
                            <span className="font-medium relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
