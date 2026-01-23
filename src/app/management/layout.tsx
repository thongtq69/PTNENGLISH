"use client";

import Link from "next/link";
import { LayoutDashboard, MessageSquare, AlertCircle, Settings, LogOut, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0F172A] text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-[#1E293B]/50 backdrop-blur-xl p-6 flex flex-col fixed h-full">
                <div className="mb-12 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
                        A
                    </div>
                    <span className="text-xl font-heading font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Admin Panel
                    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link
                        href="/management"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                        href="/management/issues"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
                    >
                        <MessageSquare size={20} />
                        <span className="font-medium">Issues & Messages</span>
                    </Link>
                    <Link
                        href="/management/system"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
                    >
                        <AlertCircle size={20} />
                        <span className="font-medium">System Health</span>
                    </Link>
                    <Link
                        href="/management/settings"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
                    >
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-800">
                    <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 transition-all text-slate-400 hover:text-red-400">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">Welcome back, Admin</h1>
                        <p className="text-slate-400">Here's what's happening on your site today.</p>
                    </div>
                    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-all">
                        <ChevronLeft size={16} />
                        <span>Back to Site</span>
                    </Link>
                </header>
                {children}
            </main>
        </div>
    );
}
