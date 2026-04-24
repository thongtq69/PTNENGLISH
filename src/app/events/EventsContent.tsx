"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Search, Calendar, MapPin, ArrowUpRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface EventItem {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    originalImage?: string;
    category?: string;
    eventDate?: string;
    location?: string;
    date?: string;
    featured?: boolean;
    gallery?: string[];
}

export default function EventsContent() {
    const { language } = useLanguage();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        let mounted = true;
        fetch("/api/events", { cache: "no-store" })
            .then(res => res.json())
            .then(data => {
                if (mounted) setEvents(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (mounted) setEvents([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    const labels = language === "vi"
        ? {
            title: "Sự kiện & Hoạt động",
            description: "Cập nhật các sự kiện, cuộc thi và hoạt động cộng đồng nổi bật của PTN English.",
            searchPlaceholder: "Tìm kiếm sự kiện...",
            readEvent: "Đọc tiếp",
            empty: "Chưa có sự kiện nào",
            emptyDesc: "Các sự kiện mới sẽ được cập nhật tại đây."
        }
        : {
            title: "Events & Activities",
            description: "Updates on events, competitions and community activities at PTN English.",
            searchPlaceholder: "Search events...",
            readEvent: "Read more",
            empty: "No events yet",
            emptyDesc: "New events will be published here."
        };

    const filtered = events.filter(e => {
        const s = search.toLowerCase();
        return !s || e.title?.toLowerCase().includes(s) || e.excerpt?.toLowerCase().includes(s);
    });

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Header />

            <div className="flex-grow">
                {/* Clean header */}
                <section className="pt-28 md:pt-36 pb-10 md:pb-12 bg-white border-b border-slate-100">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl md:text-5xl font-heading font-bold text-accent mb-4 leading-tight">
                                {labels.title}
                            </h1>
                            <p className="text-slate-500 text-base md:text-lg font-body leading-relaxed max-w-2xl">
                                {labels.description}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Search */}
                <section className="sticky top-16 md:top-20 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100 py-5">
                    <div className="container mx-auto px-6 max-w-7xl flex justify-end">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder={labels.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-5 py-3 rounded-full bg-slate-50 border border-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* Events list - horizontal card layout */}
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-6 max-w-7xl">
                        {loading ? (
                            <div className="py-32 text-center">
                                <div className="w-12 h-12 mx-auto mb-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-bold text-sm">Loading...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="py-32 text-center">
                                <CalendarCheck size={56} className="mx-auto text-slate-200 mb-6" />
                                <h3 className="text-2xl font-heading font-bold text-accent mb-2">{labels.empty}</h3>
                                <p className="text-slate-500">{labels.emptyDesc}</p>
                            </div>
                        ) : (
                            <div className="space-y-8 md:space-y-10">
                                {filtered.map((event, idx) => (
                                    <motion.article
                                        key={event._id || event.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link
                                            href={`/events/${event.slug || event._id}`}
                                            className="group grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 md:gap-10 items-center p-4 md:p-6 rounded-2xl hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
                                                {(event.image || event.originalImage) ? (
                                                    <img
                                                        src={event.image || event.originalImage}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100" />
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                                                    <span className="text-primary">{event.category || "Sự kiện"}</span>
                                                    {event.eventDate && (
                                                        <>
                                                            <span className="text-slate-300">·</span>
                                                            <span className="flex items-center gap-1.5 normal-case tracking-normal text-slate-500">
                                                                <Calendar size={12} />
                                                                {event.eventDate}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                <h2
                                                    className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-accent leading-snug mb-4 group-hover:text-primary transition-colors"
                                                    dangerouslySetInnerHTML={{ __html: event.title }}
                                                />

                                                <p className="text-slate-500 font-body leading-relaxed line-clamp-3 mb-6">
                                                    {event.excerpt}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
                                                    {event.location && (
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin size={12} />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center gap-1.5 text-primary font-bold group-hover:gap-2 transition-all ml-auto">
                                                        {labels.readEvent}
                                                        <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        {idx < filtered.length - 1 && <div className="mt-8 md:mt-10 border-b border-slate-100" />}
                                    </motion.article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
