"use client";

import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Clock,
    User,
    Phone,
    Mail,
    BookOpen,
    ChevronRight,
    Trash2,
    CheckCircle,
    AlertTriangle,
    Circle,
    MoreVertical,
    Reply
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS: any = {
    'New': 'bg-blue-500',
    'In Progress': 'bg-amber-500',
    'Resolved': 'bg-emerald-500',
    'Closed': 'bg-slate-500'
};

export default function IssueManager() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/issues')
            .then(res => res.json())
            .then(data => {
                setIssues(data);
                setLoading(false);
            });
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/issues/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const newList = issues.map(i => i._id === id ? { ...i, status } : i);
            setIssues(newList);
        } catch (e) {
            alert("Failed to update status");
        }
    };

    const selectedIssue = issues.find(i => i._id === selectedId);

    if (loading) return <div>Loading Inbox...</div>;

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-8">
            {/* List Area */}
            <div className="w-1/3 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <MessageSquare size={20} className="text-primary" />
                        Inbox Inquiries
                        <span className="ml-auto px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px]">{issues.filter(i => i.status === 'New').length} New</span>
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.02]">
                    {issues.map(issue => (
                        <div
                            key={issue._id}
                            onClick={() => setSelectedId(issue._id)}
                            className={`p-6 cursor-pointer transition-all hover:bg-white/[0.03] relative group ${selectedId === issue._id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${issue.status === 'New' ? 'text-primary' : 'text-slate-500'}`}>
                                    {issue.status}
                                </p>
                                <p className="text-[10px] text-slate-600 font-medium">12:30 PM</p>
                            </div>
                            <h3 className={`font-bold text-sm mb-1 ${issue.status === 'New' ? 'text-white' : 'text-slate-400'}`}>{issue.name}</h3>
                            <p className="text-xs text-slate-500 line-clamp-1 mb-3">{issue.description || 'No description provided'}</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                                    <BookOpen size={10} /> {issue.course || 'General'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Area */}
            <div className="flex-1 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden relative shadow-2xl">
                <AnimatePresence mode="wait">
                    {selectedIssue ? (
                        <motion.div
                            key={selectedIssue._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col h-full"
                        >
                            {/* Detail Header */}
                            <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-primary font-black text-2xl shadow-xl">
                                        {selectedIssue.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{selectedIssue.name}</h2>
                                        <div className="flex gap-4 mt-2">
                                            <span className="flex items-center gap-1.5 text-xs text-slate-400"><Mail size={12} className="text-primary" /> {selectedIssue.email}</span>
                                            <span className="flex items-center gap-1.5 text-xs text-slate-400"><Phone size={12} className="text-primary" /> {selectedIssue.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Reply size={14} /> Send Reply
                                        </button>
                                        <button className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <select
                                        value={selectedIssue.status}
                                        onChange={e => updateStatus(selectedIssue._id, e.target.value)}
                                        className="bg-slate-950 border border-white/5 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-primary outline-none focus:ring-2 focus:ring-primary/30"
                                    >
                                        <option value="New">MARK AS NEW</option>
                                        <option value="In Progress">IN PROGRESS</option>
                                        <option value="Resolved">RESOLVED</option>
                                        <option value="Closed">CLOSED</option>
                                    </select>
                                </div>
                            </div>

                            {/* Detail Body */}
                            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                                <div className="max-w-2xl space-y-12">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inquiry Details</h4>
                                        <div className="bg-white/[0.03] border border-white/[0.05] p-10 rounded-[2rem] text-slate-200 leading-relaxed font-medium">
                                            {selectedIssue.description || 'The user did not provide a detailed description.'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Course of Interest</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><BookOpen size={18} /></div>
                                                <span className="font-bold text-white uppercase tracking-tight">{selectedIssue.course || 'General Consultation'}</span>
                                            </div>
                                        </div>
                                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Contact Ready</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><CheckCircle size={18} /></div>
                                                <span className="font-bold text-white">Direct Lead</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Interaction Timeline</p>
                                        <div className="relative pl-8 space-y-8">
                                            <div className="absolute left-0 top-2 bottom-2 w-px bg-white/5"></div>
                                            <div className="relative">
                                                <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-slate-900 border-2 border-white"></div>
                                                <div>
                                                    <p className="text-xs font-black text-white">Inquiry Received</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">{new Date(selectedIssue.createdAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                            {selectedIssue.status !== 'New' && (
                                                <div className="relative">
                                                    <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-900 border-2 border-white"></div>
                                                    <div>
                                                        <p className="text-xs font-black text-white">Status Updated to {selectedIssue.status}</p>
                                                        <p className="text-[10px] text-slate-500 mt-1">Pending action...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20">
                            <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-slate-700 mb-8">
                                <MessageSquare size={48} />
                            </div>
                            <h3 className="text-xl font-heading font-black text-slate-500">Select an inquiry to read</h3>
                            <p className="text-sm text-slate-600 mt-2 max-w-xs">All messages from the contact form will appear here for management.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
