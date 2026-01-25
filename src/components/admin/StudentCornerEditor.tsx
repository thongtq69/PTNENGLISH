"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Layout, BookOpen, Image as ImageIcon,
    Video, MessageCircle, Phone, Save, ArrowRight, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTitleEditor from './shared/RichTitleEditor';

const TABS = [
    { id: 'hero', name: 'Hero Header', icon: <Layout size={18} /> },
    { id: 'playground', name: 'Playground Gallery', icon: <ImageIcon size={18} /> },
    { id: 'tools', name: 'LMS & Mock Test', icon: <BookOpen size={18} /> },
    { id: 'support', name: 'Support Info', icon: <MessageCircle size={18} /> },
];

export default function StudentCornerEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    useEffect(() => {
        fetch('/api/pages/student-corner')
            .then(res => res.json())
            .then(d => {
                if (d.error) throw new Error();
                // Map sections to state
                const normalized = {
                    hero: d.sections.find((s: any) => s.type === 'student-hero')?.content || { title: '', subtitle: '', description: '' },
                    playground: d.sections.find((s: any) => s.type === 'student-playground')?.content || { title: '', headline: '', items: [] },
                    lms: d.sections.find((s: any) => s.type === 'student-lms')?.content || { title: '', description: '', items: [], buttonText: '', buttonLink: '' },
                    mocktest: d.sections.find((s: any) => s.type === 'student-mocktest')?.content || { title: '', description: '', items: [], buttonText: '', buttonLink: '' },
                    support: d.sections.find((s: any) => s.type === 'student-support')?.content || { title: '', description: '', phone: '', emailLink: '' }
                };
                setData(normalized);
                setLoading(false);
            })
            .catch(() => {
                // Initial fallback data if not in DB
                setData({
                    hero: {
                        title: "Góc <span class='text-primary font-bold'>Học Viên</span>",
                        subtitle: "Dành riêng cho học viên PTN English",
                        description: "Không gian số hội tụ đầy đủ các công cụ, tài liệu và lộ trình học tập tối ưu, giúp bạn bứt phá và làm chủ tri thức mỗi ngày."
                    },
                    playground: {
                        headline: "PTN Playground",
                        title: "Hoạt động thường nhật & <span class='text-primary'>Sân chơi</span> học viên",
                        items: [
                            { id: 1, type: 'image', size: 'large', src: "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/600349560_811824385145541_924529116167773166_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WrY3AmzobhsQ7kNvwEn4CKw&_nc_oc=Adnmgkplx_LTyk9c-hUbzVarhTwhrLUBSzCD0uiDfoAXYzTQw_bz849RWOQUl3hK3O8&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=x3LbkFcIHWTpcw3xM-kfCA&oh=00_AfprMZKVjjgaBCy1Nvm9AmHxJLbSdtEzmcB6F_9igPgNfw&oe=697937FB", label: "Featured Workshop", title: "Academic Mastery <br />& Debate Skills" },
                            { id: 2, type: 'image', size: 'medium', src: "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/512614209_670142242647090_8961518773189171975_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=cK75sFRaF_IQ7kNvwGgDA4g&_nc_oc=AdkHowDUM1ksA7R5SgNBUWuiG1MPWNh1t0fAnY6wm923yDIJcRtP1WIwS5AlEXRVzD0&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=gcezZhlCLo3osHQGtAfGfw&oh=00_AfrpDGP0UUafCpx4SFhKepmE1W2SL-Yy-ONQ5-kg3f1BPw&oe=6979550A", title: "PTN Chill Room" },
                            { id: 3, type: 'image', size: 'small', src: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/604346724_815746011420045_1980336211823099106_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qkLGV5Y5KSgQ7kNvwGJsDoK&_nc_oc=AdntDpZoz4yfKEI0j-Hv878q7mWIWTW5oGmMn9F5fPSS-SlIgkoN1lDvE0yvWJH6q0k&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=u7onphvhD4Z99P4LGaRv_A&oh=00_AfriXULs8DInaQCLKejSaQtSojNbi4ZUTHCZWT2iMQltzQ&oe=69794BE7" },
                            { id: 4, type: 'image', size: 'small', src: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/597251461_806720128989300_4899544521814172881_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2Oq8wx-fJf4Q7kNvwGJ5r1V&_nc_oc=AdlXmd5w0vZ38pDbd51romsYEKcLIWmebDEnj6yNjGJucDFJWhOoMzt-mwq8kmDkIHI&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=TL2nZsVgFS8B57vSeDOb2A&oh=00_AfqzWqpezjeU14LZv63tB7HOg2tGplHMYcwE60k48sTt9w&oe=69793FC0" }
                        ]
                    },
                    lms: {
                        title: "Kho Tài Liệu <br /> <span class='text-primary font-bold'>Độc Quyền</span>",
                        description: "Truy cập tức thì vào hệ thống học tập LMS hiện đại của PTN English.",
                        items: ["Hệ thống bài tập Online tương tác", "Thư viện giáo trình MA.TESOL biên soạn"],
                        buttonText: "Vào cổng học tập",
                        buttonLink: "https://lms.ptelc.edu.vn/"
                    },
                    mocktest: {
                        title: "Luyện Thi Thử <br /> <span class='text-primary font-bold'>Chuẩn Quốc Tế</span>",
                        description: "Trải nghiệm hệ thống thi thử trực tuyến mô phỏng 100% môi trường thi thật.",
                        items: ["Mock Test IELTS 4 kỹ năng", "Phân tích lỗi sai chi tiết"],
                        buttonText: "Bắt đầu thi thử",
                        buttonLink: "/test"
                    },
                    support: {
                        title: "Bạn gặp khó khăn <br class='md:hidden' /> <span class='text-primary'>khi truy cập?</span>",
                        description: "Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ bạn 24/7.",
                        phone: "0902 508 290",
                        emailLink: "/contact"
                    }
                });
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            const sections = [
                { id: 'student-hero', type: 'student-hero', content: data.hero, order: 1, isVisible: true },
                { id: 'student-playground', type: 'student-playground', content: data.playground, order: 2, isVisible: true },
                { id: 'student-lms', type: 'student-lms', content: data.lms, order: 3, isVisible: true },
                { id: 'student-mocktest', type: 'student-mocktest', content: data.mocktest, order: 4, isVisible: true },
                { id: 'student-support', type: 'student-support', content: data.support, order: 5, isVisible: true },
            ];

            await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: 'student-corner',
                    title: 'Góc Học Viên',
                    sections: sections
                })
            });
            alert("Saved successfully!");
        } catch (e) {
            alert("Error saving data");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Loading editor...</div>;

    return (
        <div className="space-y-8 pb-40">
            <div className="flex justify-between items-end bg-slate-900 p-8 rounded-[2rem] border border-white/5">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white">Student Corner Management</h1>
                    <p className="text-slate-500 mt-2">Manage tools, resources, and gallery for your students.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary hover:bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-primary/20"
                >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-slate-900 border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${activeTab === tab.id ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}
                    >
                        {tab.icon}
                        <span className="whitespace-nowrap">{tab.name}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <RichTitleEditor
                                        label="Main Title"
                                        value={data.hero.title}
                                        onChange={val => setData({ ...data, hero: { ...data.hero, title: val } })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Subtitle Tag</label>
                                    <input
                                        value={data.hero.subtitle}
                                        onChange={e => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Main Description</label>
                                    <textarea
                                        rows={3}
                                        value={data.hero.description}
                                        onChange={e => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-400 font-body outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PLAYGROUND TAB */}
                    {activeTab === 'playground' && (
                        <div className="space-y-8">
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Section Headline</label>
                                        <input
                                            value={data.playground.headline}
                                            onChange={e => setData({ ...data, playground: { ...data.playground, headline: e.target.value } })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-primary font-bold"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <RichTitleEditor
                                            label="Main Title"
                                            value={data.playground.title}
                                            onChange={val => setData({ ...data, playground: { ...data.playground, title: val } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {data.playground.items.map((item: any, idx: number) => (
                                    <div key={item.id || idx} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] space-y-4 group relative overflow-hidden">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {
                                                const list = data.playground.items.filter((_: any, i: number) => i !== idx);
                                                setData({ ...data, playground: { ...data.playground, items: list } });
                                            }} className="p-2 bg-red-500 text-white rounded-lg shadow-lg"><Trash2 size={14} /></button>
                                        </div>

                                        <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-white/10">
                                            {item.src ? <img src={item.src} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={40} /></div>}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <select value={item.type || 'image'} onChange={e => {
                                                    const list = [...data.playground.items];
                                                    list[idx].type = e.target.value;
                                                    setData({ ...data, playground: { ...data.playground, items: list } });
                                                }} className="bg-slate-950 border border-white/5 rounded-lg text-[10px] p-2 text-slate-400 font-black">
                                                    <option value="image">IMAGE</option>
                                                    <option value="video">VIDEO</option>
                                                </select>
                                                <select value={item.size || 'small'} onChange={e => {
                                                    const list = [...data.playground.items];
                                                    list[idx].size = e.target.value;
                                                    setData({ ...data, playground: { ...data.playground, items: list } });
                                                }} className="flex-1 bg-slate-950 border border-white/5 rounded-lg text-[10px] p-2 text-slate-400 font-black">
                                                    <option value="large">LARGE (2x2)</option>
                                                    <option value="medium">MEDIUM (2x1)</option>
                                                    <option value="small">SMALL (1x1)</option>
                                                    <option value="tiny">TINY (Gallery)</option>
                                                </select>
                                            </div>
                                            <input placeholder="Image/Cover URL" value={item.src} onChange={e => {
                                                const list = [...data.playground.items];
                                                list[idx].src = e.target.value;
                                                setData({ ...data, playground: { ...data.playground, items: list } });
                                            }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-slate-500" />
                                            {item.type === 'video' && (
                                                <input placeholder="Video Link (FB/YT)" value={item.link} onChange={e => {
                                                    const list = [...data.playground.items];
                                                    list[idx].link = e.target.value;
                                                    setData({ ...data, playground: { ...data.playground, items: list } });
                                                }} className="w-full bg-slate-950 border border-primary/20 rounded-xl px-4 py-2 text-[10px] text-primary" />
                                            )}
                                            <input placeholder="Headline/Label" value={item.label} onChange={e => {
                                                const list = [...data.playground.items];
                                                list[idx].label = e.target.value;
                                                setData({ ...data, playground: { ...data.playground, items: list } });
                                            }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-xs text-white" />
                                            <RichTitleEditor
                                                compact
                                                value={item.title}
                                                onChange={val => {
                                                    const list = [...data.playground.items];
                                                    list[idx].title = val;
                                                    setData({ ...data, playground: { ...data.playground, items: list } });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setData({ ...data, playground: { ...data.playground, items: [...data.playground.items, { id: Date.now(), type: 'image', size: 'small', src: '', title: '' }] } })}
                                    className="border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-10 hover:border-primary/50 hover:bg-white/[0.02] transition-all text-slate-600"
                                >
                                    <Plus size={32} className="mb-2" />
                                    <span className="font-black text-[10px] uppercase tracking-widest">Add Gallery Item</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TOOLS TAB */}
                    {activeTab === 'tools' && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* LMS Block */}
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                                <div className="flex items-center gap-4 text-primary">
                                    <BookOpen size={24} />
                                    <h2 className="text-xl font-black text-white">LMS Portal Portal Config</h2>
                                </div>
                                <div className="space-y-4">
                                    <RichTitleEditor
                                        label="Card Title"
                                        value={data.lms.title}
                                        onChange={val => setData({ ...data, lms: { ...data.lms, title: val } })}
                                    />

                                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Description</label>
                                    <textarea value={data.lms.description} onChange={e => setData({ ...data, lms: { ...data.lms, description: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-400 text-sm" rows={3} />

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Button Text</label>
                                            <input value={data.lms.buttonText} onChange={e => setData({ ...data, lms: { ...data.lms, buttonText: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-xs" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Button Link</label>
                                            <input value={data.lms.buttonLink} onChange={e => setData({ ...data, lms: { ...data.lms, buttonLink: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-primary text-xs font-mono" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Bullet Points</label>
                                        {(data.lms.items || []).map((p: string, i: number) => (
                                            <div key={i} className="flex gap-2">
                                                <input value={p} onChange={e => {
                                                    const list = [...data.lms.items];
                                                    list[i] = e.target.value;
                                                    setData({ ...data, lms: { ...data.lms, items: list } });
                                                }} className="flex-1 bg-slate-950 border border-white/5 rounded-lg px-4 py-2 text-slate-400 text-xs" />
                                                <button onClick={() => setData({ ...data, lms: { ...data.lms, items: data.lms.items.filter((_: any, j: number) => i !== j) } })} className="text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setData({ ...data, lms: { ...data.lms, items: [...(data.lms.items || []), ''] } })} className="text-primary text-[10px] font-bold">+ Add Line</button>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Test Block */}
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                                <div className="flex items-center gap-4 text-white">
                                    <ClipboardList size={24} className="text-primary" />
                                    <h2 className="text-xl font-black text-white">Mock Test Config</h2>
                                </div>
                                <div className="space-y-4">
                                    <RichTitleEditor
                                        label="Card Title"
                                        value={data.mocktest.title}
                                        onChange={val => setData({ ...data, mocktest: { ...data.mocktest, title: val } })}
                                    />

                                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Description</label>
                                    <textarea value={data.mocktest.description} onChange={e => setData({ ...data, mocktest: { ...data.mocktest, description: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-300 text-sm opacity-80" rows={3} />

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Button Text</label>
                                            <input value={data.mocktest.buttonText} onChange={e => setData({ ...data, mocktest: { ...data.mocktest, buttonText: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-xs" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Button Link</label>
                                            <input value={data.mocktest.buttonLink} onChange={e => setData({ ...data, mocktest: { ...data.mocktest, buttonLink: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-primary text-xs font-mono" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Bullet Points</label>
                                        {(data.mocktest.items || []).map((p: string, i: number) => (
                                            <div key={i} className="flex gap-2">
                                                <input value={p} onChange={e => {
                                                    const list = [...data.mocktest.items];
                                                    list[i] = e.target.value;
                                                    setData({ ...data, mocktest: { ...data.mocktest, items: list } });
                                                }} className="flex-1 bg-slate-950 border border-white/5 rounded-lg px-4 py-2 text-slate-300 text-xs" />
                                                <button onClick={() => setData({ ...data, mocktest: { ...data.mocktest, items: data.mocktest.items.filter((_: any, j: number) => i !== j) } })} className="text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setData({ ...data, mocktest: { ...data.mocktest, items: [...(data.mocktest.items || []), ''] } })} className="text-primary text-[10px] font-bold">+ Add Line</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUPPORT TAB */}
                    {activeTab === 'support' && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <RichTitleEditor
                                        label="Section Heading"
                                        value={data.support.title}
                                        onChange={val => setData({ ...data, support: { ...data.support, title: val } })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Sub Info Text</label>
                                    <input value={data.support.description} onChange={e => setData({ ...data, support: { ...data.support, description: e.target.value } })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-400" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Hotline Phone</label>
                                    <input value={data.support.phone} onChange={e => setData({ ...data, support: { ...data.support, phone: e.target.value } })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-primary font-black text-xl" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Support Page Link</label>
                                    <input value={data.support.emailLink} onChange={e => setData({ ...data, support: { ...data.support, emailLink: e.target.value } })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Re-using icon mapping from AboutEditor for consistency if needed, but here we use simple text-based UI.
