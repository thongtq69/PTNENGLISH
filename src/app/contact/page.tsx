"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            type: "Consultation",
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            course: formData.get("course"),
        };

        try {
            const response = await fetch('/api/issues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 5000);
            }
        } catch (error) {
            console.error("Failed to submit:", error);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-24 bg-white border-b border-slate-100 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-accent/5 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8">
                            {t.contact.badge}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-heading font-semibold text-accent mb-6 md:mb-10 leading-tight" style={{ fontSize: 'var(--fs-contact-heroTitle)' }}>
                            {t.contact.title} <br />
                            {t.contact.subtitle}
                        </h1>
                        <p className="text-slate-500 text-base md:text-xl font-body leading-relaxed mb-8 md:mb-12 mx-auto max-w-2xl" style={{ fontSize: 'var(--fs-contact-heroSubtitle)' }}>
                            {t.contact.desc} <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span> {t.contact.descHighlight}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Details Grid */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 text-center mb-12 md:mb-24">
                        {[
                            { icon: <Phone className="text-primary" />, title: t.contact.info.hotline, content: "0902 508 290" },
                            { icon: <Mail className="text-accent" />, title: t.contact.info.email, content: "info@ptelc.edu.vn" },
                            { icon: <MapPin className="text-accent" />, title: t.contact.info.address, content: "146Bis – Đ. Nguyễn Văn Thủ – P. Tân Định – TP. HCM" },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center group p-5 md:p-8 rounded-[2rem] bg-white border border-slate-50 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h4 className="font-heading font-bold text-slate-400 text-xs md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-3" style={{ fontSize: 'var(--fs-contact-infoTitle)' }}>{item.title}</h4>
                                <p className="text-slate-900 font-heading font-bold text-base md:text-lg leading-snug" style={{ fontSize: 'var(--fs-contact-infoText)' }}>{item.content}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Centered Form */}
                    <motion.div
                        id="registration-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 md:p-20 rounded-[4rem] shadow-2xl border border-slate-50 relative max-w-4xl mx-auto"
                    >
                        {submitted ? (
                            <div className="py-20 text-center space-y-8">
                                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={48} className="text-secondary animate-bounce" />
                                </div>
                                <h3 className="text-4xl font-heading font-bold text-slate-900" style={{ fontSize: 'var(--fs-contact-heroTitle)' }}>{t.contact.form.success.title}</h3>
                                <p className="text-slate-500 font-body text-lg">{t.contact.form.success.desc}</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-16">
                                    <h2 className="text-3xl font-heading font-bold text-accent mb-4" style={{ fontSize: 'var(--fs-contact-heroTitle)' }}>{t.contact.form.title}</h2>
                                    <div className="w-24 h-1 bg-primary mx-auto"></div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8 font-body">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-400 uppercase ml-4 tracking-widest" style={{ fontSize: 'var(--fs-contact-formLabel)' }}>{t.contact.form.name}</label>
                                            <input required name="name" type="text" placeholder={t.contact.form.name} className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-accent/10 outline-none transition-all text-slate-700" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-400 uppercase ml-4 tracking-widest" style={{ fontSize: 'var(--fs-contact-formLabel)' }}>{t.contact.form.phone}</label>
                                            <input required name="phone" type="tel" placeholder={t.contact.form.phone} className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-accent/10 outline-none transition-all text-slate-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-4 tracking-widest" style={{ fontSize: 'var(--fs-contact-formLabel)' }}>{t.contact.form.email}</label>
                                        <input required name="email" type="email" placeholder={t.contact.form.email} className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-accent/10 outline-none transition-all text-slate-700" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-4 tracking-widest" style={{ fontSize: 'var(--fs-contact-formLabel)' }}>{t.contact.form.course}</label>
                                        <select name="course" className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-accent/10 outline-none transition-all appearance-none text-slate-700">
                                            <option>{t.contact.form.options.eft}</option>
                                            <option>{t.contact.form.options.ielts}</option>
                                            <option>{t.contact.form.options.general}</option>
                                            <option>{t.contact.form.options.undecided}</option>
                                        </select>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-red-500/30 hover:bg-red-700 transition-all flex items-center justify-center mt-12"
                                    >
                                        {t.contact.form.submit} <Send size={20} className="ml-4" />
                                    </motion.button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
