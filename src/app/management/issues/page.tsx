"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    MoreVertical,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    ExternalLink,
    ChevronDown,
    X
} from "lucide-react";
interface Issue {
    id: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    type: string;
    status: 'New' | 'In Progress' | 'Resolved';
    createdAt: string;
    course?: string;
    description?: string;
}

export default function IssuesListPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const fetchIssues = () => {
        fetch("/api/issues")
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((i: any) => ({ ...i, id: i._id }));
                setIssues(mapped);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/issues/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchIssues();
                if (selectedIssue && selectedIssue.id === id) {
                    setSelectedIssue({ ...selectedIssue, status: newStatus as any });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch =
            issue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "All" || issue.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="text-slate-400">Loading issues...</div>;

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative">
                        <select
                            className="appearance-none bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-3 pr-12 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                    <button className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-all">
                        <Filter size={18} />
                        <span className="font-medium">Filters</span>
                    </button>
                </div>
            </div>

            {/* Issues Table */}
            <div className="bg-[#1E293B]/30 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                <table className="w-full text-left">
                    <thead className="bg-[#1E293B]/50 border-b border-slate-800">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Issue / User</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Type</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 sr-only">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredIssues.reverse().map((issue) => (
                            <motion.tr
                                key={issue.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setSelectedIssue(issue)}
                                className="hover:bg-slate-800/30 transition-all cursor-pointer group"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary font-bold">
                                            {issue.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold group-hover:text-primary transition-colors">{issue.name}</h4>
                                            <p className="text-xs text-slate-500">{issue.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-medium">{issue.type}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${issue.status === 'New' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        issue.status === 'In Progress' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                            'bg-green-500/10 text-green-500 border border-green-500/20'
                                        }`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-sm text-slate-400">
                                    {new Date(issue.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-all text-slate-500 hover:text-white">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredIssues.length === 0 && (
                    <div className="py-20 text-center text-slate-500">
                        No issues found matching your criteria.
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedIssue && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedIssue(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-full"
                        >
                            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold font-heading">{selectedIssue.type} Details</h2>
                                    <p className="text-slate-400 text-sm">Case #{selectedIssue.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedIssue(null)}
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Customer</label>
                                        <p className="font-bold text-lg">{selectedIssue.name}</p>
                                        <p className="text-slate-400">{selectedIssue.email}</p>
                                        <p className="text-slate-400">{selectedIssue.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Submitted At</label>
                                        <p className="font-bold">{new Date(selectedIssue.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {selectedIssue.course && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Interested Course</label>
                                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-primary font-bold">
                                            {selectedIssue.course}
                                        </div>
                                    </div>
                                )}

                                {selectedIssue.description && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Description / Messages</label>
                                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-slate-300 leading-relaxed">
                                            {selectedIssue.description}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Update Status</label>
                                    <div className="flex gap-3">
                                        {['New', 'In Progress', 'Resolved'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(selectedIssue.id, status)}
                                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${selectedIssue.status === status
                                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-slate-800 flex gap-4">
                                <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                                    Internal Note
                                </button>
                                <button className="flex-1 bg-primary hover:bg-primary/90 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                                    Reply to Customer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
