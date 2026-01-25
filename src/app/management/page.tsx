export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Users,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Clock
} from "lucide-react";
interface Issue {
    _id: string;
    name: string;
    email: string;
    type: string;
    status: 'New' | 'In Progress' | 'Resolved';
    createdAt: string;
}

export default function ManagementPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/issues")
            .then(res => res.json())
            .then(data => {
                setIssues(data);
                setLoading(false);
            });
    }, []);

    const stats = [
        { label: "Total Issues", value: issues.length, icon: <MessageSquare size={24} />, color: "bg-blue-500/10 text-blue-500" },
        { label: "Urgent", value: issues.filter(i => i.status === 'New').length, icon: <AlertCircle size={24} />, color: "bg-red-500/10 text-red-500" },
        { label: "In Progress", value: issues.filter(i => i.status === 'In Progress').length, icon: <Clock size={24} />, color: "bg-orange-500/10 text-orange-500" },
        { label: "Resolved", value: issues.filter(i => i.status === 'Resolved').length, icon: <CheckCircle2 size={24} />, color: "bg-green-500/10 text-green-500" },
    ];

    if (loading) return <div className="text-slate-400">Loading dashboard...</div>;

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl bg-[#1E293B]/50 border border-slate-800 backdrop-blur-sm"
                    >
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-slate-400 font-medium mb-1">{stat.label}</h3>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Issues */}
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-[#1E293B]/30 border border-slate-800 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <TrendingUp className="text-primary" /> Recent Inquiries
                        </h2>
                        <button className="text-sm text-slate-400 hover:text-white transition-all uppercase tracking-widest font-bold">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {issues.slice(-5).reverse().map((issue, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-800/20 border border-slate-800/50 hover:bg-slate-800/40 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-10 rounded-full ${issue.status === 'New' ? 'bg-red-500' :
                                        issue.status === 'In Progress' ? 'bg-orange-500' : 'bg-green-500'
                                        }`} />
                                    <div>
                                        <h4 className="font-bold">{issue.name}</h4>
                                        <p className="text-xs text-slate-500">{issue.type} • {new Date(issue.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${issue.status === 'New' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        issue.status === 'In Progress' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                            'bg-green-500/10 text-green-500 border border-green-500/20'
                                        }`}>
                                        {issue.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links / Actions */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-accent/10 border border-accent/20 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/20 blur-[80px] group-hover:blur-[60px] transition-all"></div>
                        <h2 className="text-xl font-bold mb-4 relative z-10 text-accent">Site Status</h2>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Load Time</span>
                                <span className="text-green-400 font-mono">0.8s</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Server Status</span>
                                <span className="text-green-400">Operational</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">DB Connections</span>
                                <span className="text-blue-400">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-[#1E293B]/30 border border-slate-800 backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-center transition-all border border-slate-700">
                                <MessageSquare size={20} className="mx-auto mb-2 text-primary" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Broadcast</span>
                            </button>
                            <button className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-center transition-all border border-slate-700">
                                <Users size={20} className="mx-auto mb-2 text-indigo-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Admins</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
