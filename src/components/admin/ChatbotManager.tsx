"use client";

import React, { useState, useEffect } from 'react';
import {
    MessageCircle, Users, Calendar, Phone, User,
    Trash2, ExternalLink, CheckCircle2, AlertCircle,
    Search, Filter, Download, Settings, Save, Plus,
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './shared/FileUpload';

export default function ChatbotManager() {
    const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
    const [leads, setLeads] = useState<any[]>([]);
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [leadsRes, configRes] = await Promise.all([
                fetch('/api/chatbot-leads'),
                fetch('/api/chatbot-config')
            ]);
            const leadsData = await leadsRes.json();
            const configData = await configRes.json();
            setLeads(Array.isArray(leadsData) ? leadsData : []);
            setConfig(configData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/chatbot-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) alert("Settings saved successfully!");
        } catch (err) {
            alert("Error saving settings");
        } finally {
            setSaving(false);
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

    const updateConfigField = (field: string, value: any) => {
        setConfig({ ...config, [field]: value });
    };

    const updateOption = (idx: number, lang: 'vi' | 'en', value: string) => {
        const newOptions = [...config.options];
        newOptions[idx] = { ...newOptions[idx], [lang]: value };
        setConfig({ ...config, options: newOptions });
    };

    const addOption = () => {
        const newOptions = [...config.options, { vi: 'Lựa chọn mới', en: 'New Option' }];
        setConfig({ ...config, options: newOptions });
    };

    const removeOption = (idx: number) => {
        const newOptions = config.options.filter((_: any, i: number) => i !== idx);
        setConfig({ ...config, options: newOptions });
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
            <p className="text-xs font-black uppercase tracking-widest">Loading data...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">AI Chatbot Management</h1>
                    <p className="text-slate-400 mt-2">Manage lead inquiries and chatbox content.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'leads' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Users size={16} /> Leads
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Settings size={16} /> Settings
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'leads' ? (
                    <motion.div
                        key="leads"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Stats Header */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Leads', value: leads.length, icon: <Users />, color: 'text-primary' },
                                { label: 'New Today', value: leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, icon: <Calendar />, color: 'text-blue-400' },
                                { label: 'Pending', value: leads.filter(l => l.status === 'new').length, icon: <AlertCircle />, color: 'text-yellow-400' },
                                { label: 'Successful', value: leads.filter(l => l.status === 'interested' || l.status === 'closed').length, icon: <CheckCircle2 />, color: 'text-green-400' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`${stat.color} p-2 bg-white/5 rounded-xl`}>{stat.icon}</div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                    <p className="text-3xl font-heading font-black text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 bg-slate-900 border border-white/10 p-4 rounded-3xl">
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

                        {/* Table */}
                        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Information</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Interest</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
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
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
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
                    </motion.div>
                ) : (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-end sticky top-0 z-10 py-4 bg-slate-950/80 backdrop-blur-md">
                            <button
                                onClick={handleSaveConfig}
                                disabled={saving}
                                className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black bg-primary text-white hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {saving ? <><AlertCircle className="animate-spin" size={20} /> Saving...</> : <><Save size={20} /> Save Chatbot Content</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Agent Info */}
                            <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] space-y-8">
                                <h2 className="text-xl font-heading font-black text-white flex items-center gap-3">
                                    <User className="text-primary" /> Consultant Info
                                </h2>

                                <FileUpload
                                    label="Agent Avatar"
                                    value={config?.agentImage}
                                    onChange={(url) => updateConfigField('agentImage', url)}
                                    folder="chatbot"
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Name</label>
                                        <input
                                            value={config?.agentName}
                                            onChange={e => updateConfigField('agentName', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp/Zalo Number</label>
                                        <input
                                            value={config?.whatsappNumber}
                                            onChange={e => updateConfigField('whatsappNumber', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status (VI)</label>
                                        <input
                                            value={config?.statusVi}
                                            onChange={e => updateConfigField('statusVi', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status (EN)</label>
                                        <input
                                            value={config?.statusEn}
                                            onChange={e => updateConfigField('statusEn', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Options/Pathways */}
                            <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-heading font-black text-white flex items-center gap-3">
                                        <Filter className="text-primary" /> Chat Options / Targets
                                    </h2>
                                    <button onClick={addOption} className="p-2 rounded-xl bg-white/5 text-primary hover:bg-primary hover:text-white transition-all">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    {config?.options?.map((opt: any, idx: number) => (
                                        <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4 relative group">
                                            <div className="flex gap-4">
                                                <input
                                                    placeholder="Tiếng Việt"
                                                    value={opt.vi}
                                                    onChange={e => updateOption(idx, 'vi', e.target.value)}
                                                    className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-sm text-white"
                                                />
                                                <input
                                                    placeholder="English"
                                                    value={opt.en}
                                                    onChange={e => updateOption(idx, 'en', e.target.value)}
                                                    className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-sm text-primary font-bold"
                                                />
                                                <button onClick={() => removeOption(idx)} className="text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Messages Configuration */}
                        <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] space-y-10">
                            <h2 className="text-2xl font-heading font-black text-white flex items-center gap-3">
                                <MessageCircle className="text-primary" size={28} /> Conversation Content
                            </h2>

                            {[
                                { label: 'Welcome Message', vi: 'welcomeMsgVi', en: 'welcomeMsgEn' },
                                { label: 'Initial Question', vi: 'questionVi', en: 'questionEn' },
                                { label: 'Leads Form Prompt (use {interest} as placeholder)', vi: 'leadsPromptVi', en: 'leadsPromptEn' },
                                { label: 'Success Message (use {name} as placeholder)', vi: 'thanksMsgVi', en: 'thanksMsgEn' },
                                { label: 'Floating Prompt (when closed)', vi: 'floatingPromptVi', en: 'floatingPromptEn' }
                            ].map((msg, i) => (
                                <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{msg.label} (VI)</label>
                                        <textarea
                                            rows={3}
                                            value={config?.[msg.vi]}
                                            onChange={e => updateConfigField(msg.vi, e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm leading-relaxed focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-primary/50 uppercase tracking-[0.2em]">{msg.label} (EN)</label>
                                        <textarea
                                            rows={3}
                                            value={config?.[msg.en]}
                                            onChange={e => updateConfigField(msg.en, e.target.value)}
                                            className="w-full bg-slate-950 border border-primary/10 rounded-2xl px-6 py-4 text-white text-sm leading-relaxed focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
