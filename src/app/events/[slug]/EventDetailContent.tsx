"use client";

import { Calendar, MapPin, User, ChevronRight, ChevronLeft, X, Facebook, Link as LinkIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventData {
    title: string;
    category?: string;
    date?: string;
    eventDate?: string;
    location?: string;
    author: string;
    image?: string;
    originalImage?: string;
    content?: string;
    excerpt?: string;
    gallery?: string[];
    tags?: string[];
    sourceUrl?: string;
}

interface RelatedEvent {
    _id?: string;
    slug: string;
    title: string;
    image?: string;
    originalImage?: string;
    category?: string;
    eventDate?: string;
    excerpt?: string;
    readTime?: string;
}

export default function EventDetailContent({ event, related }: { event: EventData; related: RelatedEvent[] }) {
    const { t } = useLanguage();
    const [lightbox, setLightbox] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    const labels = t.events.labels;

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* noop */ }
    };

    const galleryImages = event.gallery && event.gallery.length > 0
        ? event.gallery
        : (event.image ? [event.image] : []);

    const hasMany = galleryImages.length > 1;
    const currentImage = galleryImages[activeIdx] || event.originalImage || event.image;
    const goPrev = () => setActiveIdx(i => (i - 1 + galleryImages.length) % galleryImages.length);
    const goNext = () => setActiveIdx(i => (i + 1) % galleryImages.length);

    return (
        <>
            {/* Breadcrumb */}
            <section className="pt-28 md:pt-32 pb-4 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-primary transition-colors">{labels.home}</Link>
                        <ChevronRight size={14} className="text-slate-300" />
                        <Link href="/events" className="hover:text-primary transition-colors uppercase tracking-wider font-bold text-xs">
                            {labels.events}
                        </Link>
                    </nav>
                </div>
            </section>

            {/* Two-column layout */}
            <section className="pb-10 md:pb-14 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-14">
                        {/* Left: Main media with prev/next navigation */}
                        <div>
                            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] group">
                                {currentImage ? (
                                    <button
                                        onClick={() => setLightbox(activeIdx)}
                                        className="absolute inset-0 cursor-zoom-in"
                                    >
                                        <img
                                            src={currentImage}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ) : null}

                                {hasMany && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            aria-label="Previous"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white text-accent flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            aria-label="Next"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white text-accent flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/60 text-white text-[11px] font-medium">
                                            {activeIdx + 1} / {galleryImages.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div>
                            <h1
                                className="text-2xl md:text-3xl lg:text-[2.25rem] font-heading font-bold text-accent leading-tight mb-5"
                                dangerouslySetInnerHTML={{ __html: event.title }}
                            />

                            {event.excerpt && (
                                <p className="text-slate-600 font-body text-base leading-relaxed mb-8">
                                    {event.excerpt}
                                </p>
                            )}

                            <div className="space-y-3 pt-5 border-t border-slate-100 text-sm">
                                {event.eventDate && (
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Calendar size={15} className="text-primary shrink-0" />
                                        <span>{event.eventDate}</span>
                                    </div>
                                )}
                                {event.location && (
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <MapPin size={15} className="text-primary shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-slate-500">
                                    <User size={15} className="text-primary shrink-0" />
                                    <span>{event.author}</span>
                                </div>
                            </div>

                            <div className="mt-7 pt-5 border-t border-slate-100">
                                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
                                    {event.category}
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                                    {event.date}
                                </p>
                            </div>

                            {/* Share */}
                            <div className="mt-7 flex items-center gap-3">
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-primary hover:text-white transition-colors"
                                >
                                    <Facebook size={15} />
                                </a>
                                <a
                                    href={`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(shareUrl)}`}
                                    aria-label="Email"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-primary hover:text-white transition-colors"
                                >
                                    <Mail size={15} />
                                </a>
                                <button
                                    onClick={handleCopy}
                                    aria-label="Copy link"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-primary hover:text-white transition-colors relative"
                                >
                                    <LinkIcon size={15} />
                                    {copied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
                                            {labels.copied}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full content */}
            {event.content && (
                <article className="pb-12 md:pb-16 bg-white">
                    <div className="container mx-auto px-6 max-w-3xl w-full">
                        <div
                            className="prose prose-slate max-w-none w-full break-words
                            prose-headings:font-heading prose-headings:font-bold prose-headings:text-accent
                            prose-p:font-body prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:my-4
                            prose-li:font-body prose-li:text-slate-600
                            prose-strong:text-accent prose-strong:font-bold
                            prose-img:rounded-xl
                            prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:p-5 prose-blockquote:rounded-r-xl prose-blockquote:italic
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: event.content }}
                        />

                        {event.tags && event.tags.length > 0 && (
                            <div className="mt-10 pt-6 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                                    {labels.tags}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                                            #{tag.replace(/^#/, "")}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </article>
            )}

            {/* Related events - compact 4-col grid */}
            {related && related.length > 0 && (
                <section className="pt-10 pb-16 md:pt-14 md:pb-24 bg-white border-t border-slate-100">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {related.map((r) => (
                                <Link
                                    key={r._id || r.slug}
                                    href={`/events/${r.slug || r._id}`}
                                    className="group block"
                                >
                                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100 mb-4">
                                        {(r.image || r.originalImage) && (
                                            <img
                                                src={r.image || r.originalImage}
                                                alt={r.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    <h3
                                        className="text-sm md:text-base font-heading font-bold text-accent group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-3"
                                        dangerouslySetInnerHTML={{ __html: r.title }}
                                    />
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                        {r.eventDate && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} />
                                                {r.eventDate}
                                            </span>
                                        )}
                                        {r.eventDate && r.category && <span className="text-slate-300">|</span>}
                                        {r.category && <span className="uppercase tracking-wider font-bold">{r.category}</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-10 md:mt-14 text-center">
                            <Link
                                href="/events"
                                className="inline-flex items-center gap-2 bg-accent hover:bg-primary text-white px-8 py-3 rounded-full font-bold text-sm transition-colors"
                            >
                                {labels.viewMore}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox !== null && galleryImages[lightbox] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                    >
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute top-5 right-5 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X size={22} />
                        </button>
                        <motion.img
                            key={lightbox}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            src={galleryImages[lightbox]}
                            alt="Event"
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
