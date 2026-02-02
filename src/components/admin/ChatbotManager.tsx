"use client";

import React, { useState, useEffect } from 'react';
import {
    MessageCircle, Users, Calendar, Phone, User,
    Trash2, ExternalLink, CheckCircle2, AlertCircle,
    Search, Filter, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatbotManager() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/chatbot-leads');
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteLead = async (id: string) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            const res = await fetch(`/api/chatbot-leads?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(leads.filter(l => l._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone.includes(search);
        const matchesFilter = filterStatus === "all" || lead.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'contacted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'interested': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'closed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-xs font-black uppercase tracking-widest">Loading leads...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Chatbot Lead Management</h1>
                    <p className="text-slate-400 mt-2">Track and manage potential students from the AI Chatbot.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Leads', value: leads.length, icon: <Users />, color: 'text-primary' },
                    { label: 'New Today', value: leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, icon: <Calendar />, color: 'text-blue-400' },
                    { label: 'Pending', value: leads.filter(l => l.status === 'new').length, icon: <AlertCircle />, color: 'text-yellow-400' },
                    { label: 'Successful', value: leads.filter(l => l.status === 'interested' || l.status === 'closed').length, icon: <CheckCircle2 />, color: 'text-green-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`${stat.color} p-2 bg-white/5 rounded-xl`}>{stat.icon}</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                        <p className="text-3xl font-heading font-black text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900 border border-white/5 p-4 rounded-3xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary/20 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'new', 'contacted', 'interested'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-primary text-white shadow-lg' : 'bg-slate-950 text-slate-500 border border-white/5 hover:bg-slate-900'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Information</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Interest / Campaign</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Received Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map((lead) => (
                            <tr key={lead._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{lead.name}</p>
                                            <p className="text-slate-500 text-xs flex items-center gap-1"><Phone size={10} /> {lead.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <p className="text-white text-sm font-medium">{lead.interest || "General Inquiry"}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lead.source}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-slate-400 text-sm">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                    <p className="text-[10px] text-slate-600 font-bold">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`tel:${lead.phone}`}
                                            className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                                        >
                                            <Phone size={16} />
                                        </a>
                                        <button
                                            onClick={() => deleteLead(lead._id)}
                                            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredLeads.length === 0 && (
                    <div className="py-20 text-center">
                        <MessageCircle size={48} className="mx-auto text-slate-800 mb-4" />
                        <p className="text-slate-500 font-medium">No chatbot leads found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
