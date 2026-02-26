"use client";

import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Youtube, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SiteSettingsManager() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch('/api/full-settings', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        setError(null);
        try {
            const res = await fetch('/api/full-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                throw new Error("Failed to save settings");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const updateNested = (category: string, field: string, value: string) => {
        setSettings({
            ...settings,
            [category]: { ...(settings[category] || {}), [field]: value }
        });
    };

    if (loading) return <div>Loading Settings...</div>;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Global Configurations</h1>
                    <p className="text-slate-400 mt-2">Manage SEO meta data, contact information, and social links.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary text-white hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    {saving ? "Saving..." : "Apply Settings"}
                </button>
            </div>

            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <p className="font-bold text-sm tracking-wide">Brand settings updated!</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SEO / Base */}
                <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <Globe size={20} className="text-primary" />
                        Site SEO & Brand
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Browser Title</label>
                            <input value={settings.site.title} onChange={e => updateNested('site', 'title', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Meta Description</label>
                            <textarea rows={3} value={settings.site.description} onChange={e => updateNested('site', 'description', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-400 text-sm" />
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <Mail size={20} className="text-primary" />
                        Contact & Location
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Phone</label>
                                <div className="flex items-center gap-3 bg-slate-950 border border-white/5 rounded-xl px-4 py-3">
                                    <Phone size={14} className="text-slate-600" />
                                    <input value={settings.contact.phone} onChange={e => updateNested('contact', 'phone', e.target.value)} className="bg-transparent border-none outline-none text-white text-sm w-full" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Email</label>
                                <div className="flex items-center gap-3 bg-slate-950 border border-white/5 rounded-xl px-4 py-3">
                                    <Mail size={14} className="text-slate-600" />
                                    <input value={settings.contact.email} onChange={e => updateNested('contact', 'email', e.target.value)} className="bg-transparent border-none outline-none text-white text-sm w-full" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Address</label>
                            <div className="flex items-center gap-3 bg-slate-950 border border-white/5 rounded-xl px-4 py-3">
                                <MapPin size={14} className="text-slate-600" />
                                <input value={settings.contact.address} onChange={e => updateNested('contact', 'address', e.target.value)} className="bg-transparent border-none outline-none text-white text-sm w-full" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Google Maps Embed URL</label>
                            <div className="flex items-center gap-3 bg-slate-950 border border-white/5 rounded-xl px-4 py-3">
                                <Globe size={14} className="text-slate-600" />
                                <input value={settings.contact.mapsUrl || ''} onChange={e => updateNested('contact', 'mapsUrl', e.target.value)} className="bg-transparent border-none outline-none text-white text-sm w-full" placeholder="https://www.google.com/maps/embed?pb=..." />
                            </div>
                            <p className="text-[9px] text-slate-500 mt-2 italic">Copy link từ phần "Nhúng bản đồ" trên Google Maps.</p>
                        </div>
                    </div>
                </section>

                {/* Socials */}
                <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 lg:col-span-2">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"><Facebook size={16} /></div>
                        Social Media & Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/[0.02] p-6 rounded-2xl space-y-3">
                            <span className="text-[10px] font-black flex items-center gap-2 text-blue-400"><Facebook size={12} /> Facebook URL</span>
                            <input value={settings.contact.facebook} onChange={e => updateNested('contact', 'facebook', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2 text-xs text-slate-400" />
                        </div>
                        <div className="bg-white/[0.02] p-6 rounded-2xl space-y-3">
                            <span className="text-[10px] font-black flex items-center gap-2 text-pink-400"><Instagram size={12} /> Instagram URL</span>
                            <input value={settings.contact.instagram} onChange={e => updateNested('contact', 'instagram', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2 text-xs text-slate-400" />
                        </div>
                        <div className="bg-white/[0.02] p-6 rounded-2xl space-y-3">
                            <span className="text-[10px] font-black flex items-center gap-2 text-red-500"><Youtube size={12} /> YouTube URL</span>
                            <input value={settings.contact.youtube} onChange={e => updateNested('contact', 'youtube', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2 text-xs text-slate-400" />
                        </div>
                        <div className="bg-white/[0.02] p-6 rounded-2xl space-y-3">
                            <span className="text-[10px] font-black flex items-center gap-2 text-slate-200">
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.01c1.306-.022 2.527.194 3.7.6a8.12 8.12 0 0 1-1.037 3.063c-1.126.311-2.28.324-3.418.331.008 3.582.022 7.164.032 10.745l.004.416c1.115 1.488.583 3.616-.837 4.757-1.42 1.141-3.66.936-4.787-.417-1.428-1.714-1.116-4.473.847-5.594 1.258-.718 2.373-.417 3.254.195.034-4.852.022-9.704.02-14.556 1.15-.013 2.298.423 3.298 1.157 1.15.845 1.574 2.115 1.63 3.447.01.21.007.41-.01.623 1.1-.17 2.2-.14 3.3.09a7.35 7.35 0 0 0-1.85-4.43c-1.44-1.58-3.48-2.31-5.6-.01V.01z" /></svg>
                                TikTok URL
                            </span>
                            <input value={settings.contact.tiktok} onChange={e => updateNested('contact', 'tiktok', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2 text-xs text-slate-400" />
                        </div>
                    </div>
                </section>

                {/* Footer Legal */}
                <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 lg:col-span-2">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <Save size={20} className="text-primary" />
                        Footer Legal & Company Info
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2 lg:col-span-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Copyright Text</label>
                            <input value={settings.footer.copyright} onChange={e => updateNested('footer', 'copyright', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" placeholder="@ Copyright 2026 PTNelc. All rights reserved." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Company Full Name</label>
                            <input value={settings.footer.companyName} onChange={e => updateNested('footer', 'companyName', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" placeholder="Công ty TNHH Giáo Dục PTNelc" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Business License / Tax Code</label>
                            <input value={settings.footer.taxCode} onChange={e => updateNested('footer', 'taxCode', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" placeholder="0318773989" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">License Date</label>
                            <input value={settings.footer.licenseDate} onChange={e => updateNested('footer', 'licenseDate', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" placeholder="06/12/2024" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">License Issuing Place</label>
                            <input value={settings.footer.licensePlace} onChange={e => updateNested('footer', 'licensePlace', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" placeholder="SKHĐT TPHCM" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Center Name</label>
                            <input value={settings.footer.centerName} onChange={e => updateNested('footer', 'centerName', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" placeholder="Trung tâm Ngoại Ngữ Phú Tài Năng - PTN English" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Establishment Decision</label>
                            <input value={settings.footer.centerDecision} onChange={e => updateNested('footer', 'centerDecision', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" placeholder="1700/QĐ-SGDĐT ngày 19/6/2025" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
