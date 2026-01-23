"use client";

import { motion } from "framer-motion";
import {
    Activity,
    ShieldCheck,
    Zap,
    Database,
    Globe,
    Server
} from "lucide-react";

export default function SystemHealthPage() {
    const metrics = [
        { label: "Server Response", value: "84ms", status: "Optimal", icon: <Server /> },
        { label: "Uptime", value: "99.98%", status: "Stable", icon: <Activity /> },
        { label: "Security Scans", value: "Clean", status: "Passed", icon: <ShieldCheck /> },
        { label: "Cache Hit Rate", value: "92%", status: "Good", icon: <Zap /> },
    ];

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="p-8 rounded-[2rem] bg-[#1E293B]/30 border border-slate-800 backdrop-blur-xl">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                            {metric.icon}
                        </div>
                        <h3 className="text-slate-400 font-medium mb-1 uppercase tracking-widest text-[10px]">{metric.label}</h3>
                        <p className="text-3xl font-bold mb-4">{metric.value}</p>
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-tighter border border-green-500/20">
                            {metric.status}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-10 rounded-[3rem] bg-[#1E293B]/20 border border-slate-800 backdrop-blur-3xl">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"><Database className="text-primary" /> Database Infrastructure</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-800/20 border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono">DB</div>
                            <div>
                                <h4 className="font-bold">Primary Cluster (ap-southeast-1)</h4>
                                <p className="text-xs text-slate-500">PostgreSQL 15.4 • 2 Nodes Active</p>
                            </div>
                        </div>
                        <span className="text-green-400 font-bold">OPERATIONAL</span>
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-800/20 border border-slate-800 opacity-60">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-500/20 flex items-center justify-center text-slate-400 font-bold font-mono">BK</div>
                            <div>
                                <h4 className="font-bold">Backup Node (us-east-1)</h4>
                                <p className="text-xs text-slate-500">Automated synchronization every 6 hours</p>
                            </div>
                        </div>
                        <span className="text-slate-500 font-bold">STANDBY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
