"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    Globe,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    Save,
    CheckCircle2,
    Shield,
    Terminal,
    Map,
    Layout
} from "lucide-react";

type TabType = "seo" | "contact" | "footer";

export default function GlobalSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<TabType>("seo");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetch("/api/full-settings")
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/full-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400">Loading settings...</div>;

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-md py-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Cấu hình Hệ thống & SEO</h2>
                    <p className="text-slate-400">Quản lý thông tin liên hệ, SEO and các thiết lập toàn cục.</p>
                </div>
                <div className="flex items-center gap-3">
                    {showSuccess && (
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-green-400 text-sm font-bold flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Saved Successfully
                        </motion.span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : <><Save size={18} /> Lưu thay đổi</>}
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex bg-slate-800/30 p-1.5 rounded-2xl border border-slate-800 w-fit">
                <button
                    onClick={() => setActiveTab("seo")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "seo" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <Globe size={18} /> SEO & Website
                </button>
                <button
                    onClick={() => setActiveTab("contact")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "contact" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <Phone size={18} /> Liên hệ & Support
                </button>
                <button
                    onClick={() => setActiveTab("footer")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "footer" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <Terminal size={18} /> Footer & Scripts
                </button>
            </div>

            <main>
                <AnimatePresence mode="wait">
                    {activeTab === "seo" && (
                        <motion.div
                            key="seo"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 space-y-6">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                                    <Shield size={20} /> Optimization & Search
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Site Title</label>
                                        <input
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 text-sm outline-none focus:border-primary transition-all"
                                            value={settings.site.title}
                                            onChange={(e) => setSettings({ ...settings, site: { ...settings.site, title: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Meta Description</label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 text-sm outline-none focus:border-primary transition-all"
                                            value={settings.site.description}
                                            onChange={(e) => setSettings({ ...settings, site: { ...settings.site, description: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Keywords (SEO)</label>
                                        <input
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 text-sm outline-none focus:border-primary transition-all"
                                            value={settings.site.keywords}
                                            onChange={(e) => setSettings({ ...settings, site: { ...settings.site, keywords: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "contact" && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400">
                                        <Phone size={20} /> Contact Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-4 top-4 text-slate-500" />
                                            <input
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-sm outline-none focus:border-blue-400 transition-all"
                                                value={settings.contact.address}
                                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-4 text-slate-500" />
                                            <input
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-sm outline-none focus:border-blue-400 transition-all font-mono"
                                                value={settings.contact.phone}
                                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-4 text-slate-500" />
                                            <input
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-sm outline-none focus:border-blue-400 transition-all"
                                                value={settings.contact.email}
                                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Map size={16} className="absolute left-4 top-4 text-slate-500" />
                                            <input
                                                placeholder="Google Maps Embed URL"
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-xs outline-none focus:border-blue-400 transition-all font-mono"
                                                value={settings.contact.mapsUrl}
                                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, mapsUrl: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                                        <Globe size={20} /> Social Networks
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Facebook size={16} className="absolute left-4 top-4 text-slate-500" />
                                            <input
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-sm outline-none focus:border-indigo-400 transition-all"
                                                value={settings.contact.facebook}
                                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, facebook: e.target.value } })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Instagram size={16} className="absolute left-4 top-4 text-slate-500" />
                                            <input
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-sm outline-none focus:border-indigo-400 transition-all"
                                                value={settings.contact.instagram}
                                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, instagram: e.target.value } })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Youtube size={16} className="absolute left-4 top-4 text-slate-500" />
                                            <input
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-sm outline-none focus:border-indigo-400 transition-all"
                                                value={settings.contact.youtube}
                                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, youtube: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "footer" && (
                        <motion.div
                            key="footer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 space-y-6">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-orange-400">
                                    <Layout size={20} /> Footer Customization
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Footer "About Us" Text</label>
                                        <textarea
                                            rows={2}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 text-sm outline-none focus:border-orange-400 transition-all"
                                            value={settings.footer.aboutText}
                                            onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, aboutText: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Copyright Line</label>
                                        <input
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 text-sm outline-none focus:border-orange-400 transition-all"
                                            value={settings.footer.copyright}
                                            onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, copyright: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
