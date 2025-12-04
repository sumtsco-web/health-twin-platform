'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'alert' | 'info' | 'success';
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Critical Alert',
        message: 'Omar Abdullah - Severe fatigue detected',
        time: '2 min ago',
        read: false,
        type: 'alert'
    },
    {
        id: '2',
        title: 'Risk Alert',
        message: 'Ahmed Al-Mansoori - Cardiac risk elevated',
        time: '5 min ago',
        read: false,
        type: 'alert'
    },
    {
        id: '3',
        title: 'Report Generated',
        message: 'Weekly health summary is ready',
        time: '1 hour ago',
        read: true,
        type: 'success'
    },
];

export default function Header() {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        // Clear any stored tokens
        localStorage.removeItem('token');
        // Show confirmation
        const confirmed = confirm('Are you sure you want to sign out?');
        if (confirmed) {
            // Redirect to login
            router.push('/login');
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-20 px-8 flex items-center justify-between z-20 border-b border-white/5 bg-background/50 backdrop-blur-sm">
            {/* Search Bar */}
            <div className="relative w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-surface/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 sm:text-sm transition-all duration-200"
                    placeholder="Search employees, departments, or alerts..."
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-status-critical rounded-full border-2 border-background shadow-glow-danger"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-96 glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white">Notifications</h3>
                                    <p className="text-xs text-gray-400">{unreadCount} unread</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary-glow hover:text-primary"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-primary/5' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'alert' ? 'bg-status-danger' :
                                                    notif.type === 'success' ? 'bg-status-safe' :
                                                        'bg-primary'
                                                }`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{notif.title}</p>
                                                <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                                                <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-white/10 text-center">
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        router.push('/alerts');
                                    }}
                                    className="text-sm text-primary-glow hover:text-primary"
                                >
                                    View all alerts
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 pl-6 border-l border-white/10 hover:bg-white/5 rounded-lg transition-colors p-2"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-white">Dr. AI</p>
                            <p className="text-xs text-gray-400">Medical Director</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent-cyan p-[2px]">
                            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                                <span className="font-bold text-xs">AI</span>
                            </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                            {/* User Info */}
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent-cyan p-[2px]">
                                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                                            <span className="font-bold">AI</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Dr. AI</p>
                                        <p className="text-xs text-gray-400">Medical Director</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">dr.ai@healthtwin.com</p>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        setShowProfile(false);
                                        router.push('/settings');
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <User size={16} />
                                    <span>My Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowProfile(false);
                                        router.push('/settings');
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </button>
                            </div>

                            {/* Sign Out */}
                            <div className="p-2 border-t border-white/10">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-status-danger hover:bg-status-danger/10 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
