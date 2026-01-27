"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    Users,
    MessageSquare,
    Settings,
    Image as ImageIcon,
    GraduationCap,
    Calendar,
    LogOut,
    ChevronRight,
    Search,
    Bell,
    CheckCircle2,
    Trophy,
    Heart,
    Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
    {
        group: 'Dashboard', items: [
            { name: 'Overview', icon: <LayoutDashboard size={20} />, href: '/admin' },
            { name: 'Inbox / Issues', icon: <MessageSquare size={20} />, href: '/admin/issues', badge: 0 },
        ]
    },
    {
        group: 'Site Content', items: [
            { name: 'Home Page', icon: <ImageIcon size={20} />, href: '/admin/home' },
            { name: 'About Us', icon: <Users size={20} />, href: '/admin/about-us' },
            { name: 'Courses', icon: <BookOpen size={20} />, href: '/admin/courses' },
            { name: 'Student Corner', icon: <GraduationCap size={20} />, href: '/admin/student-corner' },
            { name: 'Mock Tests', icon: <GraduationCap size={20} />, href: '/admin/mock-tests' },
            { name: 'Schedules', icon: <Calendar size={20} />, href: '/admin/schedules' },
            { name: 'Campaign Ads', icon: <Megaphone size={20} />, href: '/admin/ads' },
            { name: 'Blog Posts', icon: <FileText size={20} />, href: '/admin/blog' },
            { name: 'Testimonials', icon: <Heart size={20} />, href: '/admin/testimonials' },
            { name: 'Hall of Fame', icon: <Trophy size={20} />, href: '/admin/achievements' },
        ]
    },
    {
        group: 'Settings', items: [
            { name: 'Global Settings', icon: <Settings size={20} />, href: '/admin/settings' },
        ]
    }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary/30">
            {/* Sidebar */}
            <aside
                className={`bg-slate-900 border-r border-white/5 transition-all duration-300 flex flex-col sticky top-0 h-screen z-50 ${collapsed ? 'w-20' : 'w-72'}`}
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-4 border-b border-white/5 h-24">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xl shrink-0 shadow-lg shadow-primary/20">
                        A
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-heading font-black text-xl tracking-tight text-white"
                        >
                            PTN <span className="text-primary">Admin</span>
                        </motion.div>
                    )}
                </div>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pt-8">
                    {MENU_ITEMS.map((group, idx) => (
                        <div key={idx} className="space-y-2">
                            {!collapsed && (
                                <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-4">
                                    {group.group}
                                </h3>
                            )}
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <div className={`${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>
                                            {item.icon}
                                        </div>
                                        {!collapsed && (
                                            <span className="font-bold text-sm truncate flex-1">{item.name}</span>
                                        )}
                                        {item.badge !== undefined && !collapsed && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Footer info/Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => alert('Logout clicked')}
                        className="w-full flex items-center gap-4 px-4 py-4 text-slate-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/5 group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {!collapsed && <span className="font-bold text-sm">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-950/50">
                {/* Header */}
                <header className="h-24 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronRight className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} size={20} />
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-white/5 border border-white/5 rounded-full pl-12 pr-6 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none w-80 transition-all focus:w-96 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                            <CheckCircle2 size={12} />
                            Database Online
                        </div>
                        <button className="relative p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-slate-950"></span>
                        </button>
                        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-white leading-none">Admin PTN</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Super User</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 p-0.5 shadow-xl shadow-primary/10">
                                <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center font-black text-white tracking-widest">
                                    SU
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="p-8 pb-32">
                    {children}
                </div>
            </main>
        </div>
    );
}
