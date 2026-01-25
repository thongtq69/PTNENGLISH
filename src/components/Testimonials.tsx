"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetch("/api/testimonials")
            .then(res => res.json())
            .then(data => setTestimonials(data));
    }, []);

    if (testimonials.length === 0) return null;

    const next = () => setIndex((i) => (i + 1) % testimonials.length);
    const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-16 bg-slate-50 relative overflow-hidden">
            {/* Decorative quotes background */}
            <div className="absolute top-0 left-0 p-10 opacity-[0.03] pointer-events-none">
                <Quote size={300} fill="currentColor" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-heading font-bold text-lg uppercase tracking-[0.3em] mb-4"
                    >
                        Testimonials
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-heading font-semibold text-accent"
                    >
                        Cảm nghĩ của phụ huynh & học viên
                    </motion.h3>
                </div>

                <div className="max-w-6xl mx-auto relative group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/60 border border-slate-100"
                        >
                            <div className="lg:col-span-2 relative">
                                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl transform lg:-rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src={testimonials[index].image}
                                        alt={testimonials[index].name}
                                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                                    />
                                </div>
                                {/* Decorative Elements */}
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10"></div>
                            </div>

                            <div className="lg:col-span-3 flex flex-col h-full justify-center">
                                <Quote className="text-primary mb-8 opacity-20" size={48} />
                                <div className="relative">
                                    <p className="text-slate-600 font-serif text-lg md:text-xl leading-relaxed not-italic mb-10 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar border-l-4 border-primary pl-8 py-2">
                                        "{testimonials[index].text}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 mt-auto">
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                    <div className="text-right">
                                        <h4 className="font-heading font-bold text-2xl text-accent">{testimonials[index].name}</h4>
                                        <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{testimonials[index].sub}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex justify-center mt-12 gap-4">
                        <button
                            onClick={prev}
                            className="p-4 rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:scale-110 transition-all active:scale-95"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex items-center gap-3 px-6">
                            {testimonials.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-12 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="p-4 rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:scale-110 transition-all active:scale-95"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
