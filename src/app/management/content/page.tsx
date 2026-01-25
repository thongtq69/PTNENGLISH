"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    BookOpen,
    Heart,
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    ChevronRight,
    CheckCircle2,
    Star,
    MessageSquare
} from "lucide-react";

type TabType = "teachers" | "philosophy" | "values" | "differences" | "achievements" | "testimonials";

export default function ContentManagementPage() {
    const [aboutData, setAboutData] = useState<any>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);

    const [activeTab, setActiveTab] = useState<TabType>("teachers");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch("/api/about-us").then(res => res.json()),
            fetch("/api/achievements").then(res => res.json()),
            fetch("/api/testimonials").then(res => res.json())
        ]).then(([about, ach, test]) => {
            setAboutData(about);
            setAchievements(ach);
            setTestimonials(test);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const results = await Promise.all([
                fetch("/api/about-us", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(aboutData) }),
                fetch("/api/achievements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(achievements) }),
                fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(testimonials) })
            ]);

            if (results.every(r => r.ok)) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400">Loading content...</div>;

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: "teachers", label: "Giảng viên", icon: <Users size={18} /> },
        { id: "philosophy", label: "Triết lý", icon: <BookOpen size={18} /> },
        { id: "values", label: "Giá trị", icon: <CheckCircle2 size={18} /> },
        { id: "differences", label: "Sự khác biệt", icon: <Heart size={18} /> },
        { id: "achievements", label: "Vinh danh", icon: <Star size={18} /> },
        { id: "testimonials", label: "Cảm nghĩ", icon: <MessageSquare size={18} /> },
    ];

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-md py-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Quản lý nội dung website</h2>
                    <p className="text-slate-400">Cập nhật thông tin đội ngũ, vinh danh and cảm nghĩ khách hàng.</p>
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
            <div className="flex overflow-x-auto bg-slate-800/30 p-1.5 rounded-2xl border border-slate-800 w-fit gap-1 hide-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shrink-0 ${activeTab === tab.id ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <main className="grid grid-cols-1 gap-8">
                <AnimatePresence mode="wait">
                    {activeTab === "teachers" && (
                        <motion.div
                            key="teachers"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {aboutData.teachers.map((t: any, idx: number) => (
                                    <div key={idx} className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-6 group">
                                        <div className="flex gap-6">
                                            <div className="w-24 h-24 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700 relative group-hover:border-primary/50 transition-colors">
                                                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <input
                                                        className="bg-transparent border-none text-xl font-bold p-0 w-full outline-none focus:text-primary transition-colors"
                                                        value={t.name}
                                                        onChange={(e) => {
                                                            const newData = { ...aboutData };
                                                            newData.teachers[idx].name = e.target.value;
                                                            setAboutData(newData);
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newData = { ...aboutData };
                                                            newData.teachers.splice(idx, 1);
                                                            setAboutData(newData);
                                                        }}
                                                        className="text-slate-600 hover:text-red-400 p-2"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <textarea
                                                    className="bg-slate-800/30 border border-slate-800 rounded-xl p-3 w-full text-sm text-slate-400 outline-none focus:border-slate-600 focus:bg-slate-800/50 min-h-[60px]"
                                                    value={t.certs}
                                                    onChange={(e) => {
                                                        const newData = { ...aboutData };
                                                        newData.teachers[idx].certs = e.target.value;
                                                        setAboutData(newData);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Kinh nghiệm</label>
                                                <input
                                                    className="bg-slate-800/30 border border-slate-800 rounded-xl p-3 w-full text-sm outline-none focus:border-slate-600"
                                                    value={t.exp}
                                                    onChange={(e) => {
                                                        const newData = { ...aboutData };
                                                        newData.teachers[idx].exp = e.target.value;
                                                        setAboutData(newData);
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Mô tả tóm tắt</label>
                                                <textarea
                                                    className="bg-slate-800/30 border border-slate-800 rounded-xl p-3 w-full text-sm outline-none focus:border-slate-600 min-h-[80px]"
                                                    value={t.desc}
                                                    onChange={(e) => {
                                                        const newData = { ...aboutData };
                                                        newData.teachers[idx].desc = e.target.value;
                                                        setAboutData(newData);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newData = { ...aboutData };
                                        newData.teachers.push({ name: "Mới", certs: "", exp: "", desc: "", image: "" });
                                        setAboutData(newData);
                                    }}
                                    className="border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-600 hover:text-primary hover:border-primary/30 transition-all gap-4"
                                >
                                    <Plus size={40} />
                                    <span className="font-bold uppercase tracking-widest text-sm">Thêm giảng viên</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "achievements" && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {achievements.map((item, idx) => (
                                <div key={idx} className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-20 h-20 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                                            <img src={item.url} className="w-full h-full object-cover" />
                                        </div>
                                        <button onClick={() => {
                                            const na = [...achievements];
                                            na.splice(idx, 1);
                                            setAchievements(na);
                                        }} className="text-slate-600 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                                    </div>
                                    <div className="space-y-3">
                                        <input
                                            className="bg-slate-800/30 border border-slate-800 rounded-xl px-4 py-2 w-full text-sm outline-none focus:border-primary"
                                            placeholder="Student Name"
                                            value={item.student}
                                            onChange={(e) => {
                                                const na = [...achievements];
                                                na[idx].student = e.target.value;
                                                setAchievements(na);
                                            }}
                                        />
                                        <div className="flex gap-3">
                                            <input
                                                className="bg-slate-800/30 border border-slate-800 rounded-xl px-4 py-2 w-1/2 text-sm outline-none focus:border-primary"
                                                placeholder="Score"
                                                value={item.score}
                                                onChange={(e) => {
                                                    const na = [...achievements];
                                                    na[idx].score = e.target.value;
                                                    setAchievements(na);
                                                }}
                                            />
                                            <input
                                                className="bg-slate-800/30 border border-slate-800 rounded-xl px-4 py-2 w-1/2 text-[10px] outline-none focus:border-primary"
                                                placeholder="Image URL"
                                                value={item.url}
                                                onChange={(e) => {
                                                    const na = [...achievements];
                                                    na[idx].url = e.target.value;
                                                    setAchievements(na);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setAchievements([...achievements, { student: "", score: "", url: "", title: "IELTS High Achiever" }])}
                                className="border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-all gap-4"
                            >
                                <Plus size={32} />
                                <span className="font-bold uppercase tracking-widest text-[10px]">Add Achievement</span>
                            </button>
                        </motion.div>
                    )}

                    {activeTab === "testimonials" && (
                        <motion.div
                            key="testimonials"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {testimonials.map((item, idx) => (
                                <div key={idx} className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 flex gap-8">
                                    <div className="w-24 h-24 bg-slate-800 rounded-2xl overflow-hidden shrink-0 border border-slate-700">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4 flex-1">
                                                <input
                                                    className="bg-transparent border-none text-xl font-bold p-0 w-1/3 outline-none focus:text-primary transition-colors font-heading"
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const nt = [...testimonials];
                                                        nt[idx].name = e.target.value;
                                                        setTestimonials(nt);
                                                    }}
                                                />
                                                <input
                                                    className="bg-transparent border-none text-sm text-slate-500 p-0 w-2/3 outline-none focus:text-white transition-colors"
                                                    value={item.sub}
                                                    onChange={(e) => {
                                                        const nt = [...testimonials];
                                                        nt[idx].sub = e.target.value;
                                                        setTestimonials(nt);
                                                    }}
                                                />
                                            </div>
                                            <button onClick={() => {
                                                const nt = [...testimonials];
                                                nt.splice(idx, 1);
                                                setTestimonials(nt);
                                            }} className="text-slate-600 hover:text-red-400"><Trash2 size={18} /></button>
                                        </div>
                                        <textarea
                                            className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 w-full text-sm text-slate-400 outline-none focus:border-primary min-h-[100px]"
                                            value={item.text}
                                            onChange={(e) => {
                                                const nt = [...testimonials];
                                                nt[idx].text = e.target.value;
                                                setTestimonials(nt);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setTestimonials([...testimonials, { name: "", sub: "", text: "", image: "" }])}
                                className="w-full border-2 border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-600 hover:text-primary transition-all gap-4"
                            >
                                <Plus size={32} />
                                <span className="font-bold uppercase tracking-widest text-[10px]">Add Testimonial</span>
                            </button>
                        </motion.div>
                    )}

                    {activeTab === "differences" && (
                        <motion.div
                            key="differences"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-[#1E293B]/30 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-800/30 border-b border-slate-800">
                                        <tr>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">ID</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Tiêu đề ngắn</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Tiêu đề đầy đủ</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {aboutData.differences.map((d: any, idx: number) => (
                                            <tr key={d.id} className="hover:bg-slate-800/10 transition-colors">
                                                <td className="px-8 py-4 font-mono text-slate-500 text-sm">{d.id}</td>
                                                <td className="px-8 py-4">
                                                    <input
                                                        className="bg-transparent border-none font-bold p-0 w-full outline-none focus:text-primary"
                                                        value={d.title}
                                                        onChange={(e) => {
                                                            const newData = { ...aboutData };
                                                            newData.differences[idx].title = e.target.value;
                                                            setAboutData(newData);
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-8 py-4">
                                                    <input
                                                        className="bg-transparent border-none p-0 w-full outline-none text-slate-400 focus:text-white"
                                                        value={d.fullTitle}
                                                        onChange={(e) => {
                                                            const newData = { ...aboutData };
                                                            newData.differences[idx].fullTitle = e.target.value;
                                                            setAboutData(newData);
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button className="text-slate-600 hover:text-white p-2"><ChevronRight size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
