"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

    useEffect(() => {
        fetch("/api/testimonials")
            .then(res => res.json())
            .then(data => setTestimonials(data));
    }, []);

    if (testimonials.length === 0) return null;

    const next = () => setIndex((i) => (i + 1) % testimonials.length);
    const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-heading font-bold text-sm uppercase tracking-[0.4em] mb-4"
                    >
                        Success Stories
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-5xl font-heading font-semibold text-accent"
                    >
                        Cảm nghĩ của phụ huynh & học viên
                    </motion.h3>
                </div>

                <div className="max-w-6xl mx-auto relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-16 cursor-pointer hover:shadow-2xl transition-all duration-500"
                            onClick={() => setSelectedTestimonial(testimonials[index])}
                        >
                            <div className="shrink-0 relative">
                                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-8 border-slate-50 shadow-inner">
                                    <img
                                        src={testimonials[index].image}
                                        alt={testimonials[index].name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <Quote className="absolute -top-2 -right-2 text-primary bg-white rounded-full p-2 shadow-lg" size={32} />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="mb-6">
                                    <h4 className="font-heading font-bold text-2xl md:text-3xl text-accent mb-1">
                                        {testimonials[index].name}
                                    </h4>
                                    <p className="text-primary font-bold text-xs uppercase tracking-widest">
                                        {testimonials[index].sub}
                                    </p>
                                </div>

                                <div className="relative">
                                    <p className="text-slate-600 font-serif text-base md:text-lg leading-relaxed italic line-clamp-3 md:line-clamp-2">
                                        "{testimonials[index].text}"
                                    </p>
                                    <button className="mt-4 text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0">
                                        Xem chi tiết cảm nghĩ <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white shadow-xl text-slate-400 hover:text-primary transition-all active:scale-95 z-20"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white shadow-xl text-slate-400 hover:text-primary transition-all active:scale-95 z-20"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="flex justify-center mt-10 gap-2">
                        {testimonials.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`h-1 rounded-full transition-all duration-300 ${i === index ? "w-12 bg-primary" : "w-3 bg-slate-200 hover:bg-slate-300"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonial Popup Modal */}
            <AnimatePresence>
                {selectedTestimonial && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                            onClick={() => setSelectedTestimonial(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
                        >
                            <button
                                onClick={() => setSelectedTestimonial(null)}
                                className="absolute top-8 right-8 text-slate-400 hover:text-primary transition-colors p-2"
                            >
                                <ChevronRight className="rotate-90 md:rotate-0" size={32} />
                            </button>

                            <div className="flex flex-col items-center text-center mb-12">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-lg mb-6">
                                    <img
                                        src={selectedTestimonial.image}
                                        alt={selectedTestimonial.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h4 className="text-3xl font-heading font-black text-accent mb-2">{selectedTestimonial.name}</h4>
                                <p className="text-primary font-bold text-sm uppercase tracking-widest">{selectedTestimonial.sub}</p>
                            </div>

                            <div className="relative">
                                <Quote className="text-primary/10 absolute -top-10 -left-6" size={80} />
                                <p className="text-slate-600 font-serif text-xl leading-relaxed italic relative z-10 text-center">
                                    "{selectedTestimonial.text}"
                                </p>
                            </div>

                            <div className="mt-14 pt-8 border-t border-slate-50 text-center">
                                <button
                                    onClick={() => setSelectedTestimonial(null)}
                                    className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-primary transition-all"
                                >
                                    Đóng cửa sổ
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
