"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minus, ExternalLink, User, Phone, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";


type Message = {
    id: string;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
    type?: "text" | "options";
    options?: string[];
};

const ChatBox = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasPrompted, setHasPrompted] = useState(false);
    const [step, setStep] = useState<"intro" | "leads" | "done">("intro");
    const [messages, setMessages] = useState<Message[]>([]);
    const [leads, setLeads] = useState({ name: "", phone: "" });
    const [interest, setInterest] = useState("");
    const pathname = usePathname();

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fallback helper
    const fb = (vi: string, en: string) => (language === "vi" ? vi : en);

    // Hidden logic for Admin and Test pages
    const isHiddenPath = pathname.startsWith("/admin") || pathname.startsWith("/test");

    // Persistence: Check if user already provided info
    useEffect(() => {
        const savedLeads = localStorage.getItem("ptn_chat_leads");
        if (savedLeads) {
            const parsed = JSON.parse(savedLeads);
            setLeads(parsed);
            // We don't auto-set step to "done" immediately to allow fresh conversations if needed
        }
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, step]);

    // Initial Sequence
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            const openTimer = setTimeout(() => {
                if (!hasPrompted) {
                    setIsOpen(true);
                    setHasPrompted(true);
                    startConversation();
                }
            }, 3000);
            return () => clearTimeout(openTimer);
        }, 5000);

        return () => clearTimeout(timer);
    }, [hasPrompted]);

    // Update conversation when language changes if it's the beginning
    useEffect(() => {
        if (messages.length > 0 && messages.length <= 2 && step === "intro") {
            const initialMsgs: Message[] = [
                {
                    id: "1",
                    text: t.chatbot?.welcome || fb("Chào bạn! Mình là Lan từ PTN English. 👋", "Hello! I'm Lan from PTN English. 👋"),
                    sender: "bot",
                    timestamp: messages[0].timestamp,
                },
                {
                    id: "2",
                    text: t.chatbot?.question || fb("Bạn đang quan tâm đến lộ trình học nào để Lan hỗ trợ tư vấn chi tiết nhất nhé?", "Which learning pathway are you interested in so I can provide the most detailed advice?"),
                    sender: "bot",
                    timestamp: messages[1]?.timestamp || new Date(),
                    type: "options",
                    options: t.chatbot?.options || ["Luyện thi IELTS", "Luyện thi PTE Phản xạ", "Tiếng Anh giao tiếp"],
                }
            ];
            setMessages(initialMsgs);
        }
    }, [language]);

    const startConversation = () => {
        if (messages.length > 0) return;
        const initialMsgs: Message[] = [
            {
                id: "1",
                text: t.chatbot?.welcome || fb("Chào bạn! Mình là Lan từ PTN English. 👋", "Hello! I'm Lan from PTN English. 👋"),
                sender: "bot",
                timestamp: new Date(),
            },
            {
                id: "2",
                text: t.chatbot?.question || fb("Bạn đang quan tâm đến lộ trình học nào để Lan hỗ trợ tư vấn chi tiết nhất nhé?", "Which learning pathway are you interested in so I can provide the most detailed advice?"),
                sender: "bot",
                timestamp: new Date(),
                type: "options",
                options: t.chatbot?.options || ["Luyện thi IELTS", "Luyện thi PTE Phản xạ", "Tiếng Anh giao tiếp"],
            }
        ];
        setMessages(initialMsgs);
    };

    const handleOptionClick = (opt: string) => {
        setInterest(opt);
        const userMsg: Message = {
            id: Date.now().toString(),
            text: opt,
            sender: "user",
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        setTimeout(() => {
            const rawPrompt = t.chatbot?.leadsPrompt || fb(
                "Dạ tuyệt vời ạ! Để Lan gửi chi tiết lộ trình {interest} và bộ tài liệu độc quyền qua Zalo cho mình, bạn cho Lan xin thông tin nhé:",
                "That's wonderful! To send you the details for the {interest} pathway and exclusive materials via Zalo, please provide your information:"
            );
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: rawPrompt.replace("{interest}", opt),
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
            setStep("leads");
        }, 800);
    };

    const handleLeadsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leads.name || !leads.phone) return;

        localStorage.setItem("ptn_chat_leads", JSON.stringify(leads));

        setTimeout(() => {
            setStep("done");
            const rawThanks = t.chatbot?.thanksMsg || fb(
                "Cảm ơn {name}! Lan đã nhận được thông tin. Bạn nhấn nút bên dưới để chat trực tiếp với Lan qua Zalo ngay nhé!",
                "Thank you {name}! Lan has received your information. Click the button below to chat directly with me via Zalo now!"
            );
            const botMsg: Message = {
                id: (Date.now() + 2).toString(),
                text: rawThanks.replace("{name}", leads.name),
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    const formatWhatsAppLink = () => {
        const tmpl = t.chatbot?.whatsappTemplate || {
            name: "Họ tên",
            phone: "SĐT",
            interest: "Quan tâm",
            source: "(Từ Website PTN English)"
        };
        const text = `${tmpl.name}: ${leads.name}\n${tmpl.phone}: ${leads.phone}\n${tmpl.interest}: ${interest || "Tư vấn lộ trình"}\n${tmpl.source}`;
        return `https://wa.me/84902508290?text=${encodeURIComponent(text)}`;
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setHasPrompted(true);
        if (!isOpen && messages.length === 0) {
            setTimeout(startConversation, 300);
        }
    };

    if (isHiddenPath) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        className="mb-4 w-[350px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-2xl shadow-indigo-200/50 backdrop-blur-2xl md:w-[380px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-secondary to-indigo-900 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/30 bg-white/10 p-0.5">
                                        <div className="relative h-full w-full overflow-hidden rounded-full">
                                            <Image src="/images/consultant.png" alt="Ms. Lan" fill className="object-cover" />
                                        </div>
                                        <div className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-indigo-900 bg-green-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold leading-tight">Ms. Lan</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
                                            <p className="text-[11px] font-medium opacity-90">
                                                {t.chatbot?.status || fb("Sẵn sàng tư vấn", "Online")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={toggleChat} className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-all">
                                    <Minus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div
                            ref={scrollRef}
                            className="h-[400px] overflow-y-auto bg-slate-50/50 p-5 space-y-5 custom-scrollbar"
                        >
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] space-y-1`}>
                                        <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${msg.sender === "user"
                                            ? "bg-primary text-white rounded-tr-none shadow-primary/20"
                                            : "bg-white text-secondary rounded-tl-none border border-slate-100 shadow-indigo-100/30"
                                            }`}>
                                            <p className="whitespace-pre-line">{msg.text}</p>

                                            {msg.type === "options" && step === "intro" && (
                                                <div className="mt-4 grid gap-2">
                                                    {msg.options?.map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => handleOptionClick(opt)}
                                                            className="group flex w-full items-center justify-between rounded-xl border border-primary/10 bg-slate-50 py-3 px-4 text-left text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                                                        >
                                                            {opt}
                                                            <Send size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-[10px] text-slate-400 px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Lead Form Step */}
                            {step === "leads" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-2xl bg-white p-5 border border-primary/10 shadow-xl shadow-primary/5"
                                >
                                    <div className="mb-4 text-center">
                                        <p className="text-xs font-bold text-secondary">
                                            {t.chatbot?.leadsFormTitle || fb("Vui lòng điền thông nhanh:", "Please fill in quickly:")}
                                        </p>
                                    </div>
                                    <form onSubmit={handleLeadsSubmit} className="space-y-3">
                                        <div className="relative">
                                            <User size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                                            <input
                                                required
                                                type="text"
                                                placeholder={t.chatbot?.namePlaceholder || fb("Họ và tên của bạn", "Your full name")}
                                                className="w-full rounded-xl border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:ring-primary/20 transition-all"
                                                value={leads.name}
                                                onChange={(e) => setLeads({ ...leads, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                                            <input
                                                required
                                                type="tel"
                                                placeholder={t.chatbot?.phonePlaceholder || fb("Số điện thoại / Zalo", "Phone number / Zalo")}
                                                className="w-full rounded-xl border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:ring-primary/20 transition-all"
                                                value={leads.phone}
                                                onChange={(e) => setLeads({ ...leads, phone: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full rounded-xl bg-primary py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/30 transition-all hover:brightness-110 active:scale-[0.98]"
                                        >
                                            {t.chatbot?.submitBtn || fb("Nhận Lộ Trình & Quà Tặng 🎁", "Get Pathway & Gifts 🎁")}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* WhatsApp Escalation Step */}
                            {step === "done" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <a
                                        href={formatWhatsAppLink()}
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 rounded-xl bg-[#25D366] py-4 text-sm font-black text-white shadow-xl shadow-green-500/30 transition-all hover:scale-[1.03] active:scale-95"
                                    >
                                        {t.chatbot?.whatsappBtn || fb("CHAT ZALO NGAY", "CHAT ZALO NOW")} <ExternalLink size={18} />
                                    </a>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("ptn_chat_leads");
                                                setStep("intro");
                                                setMessages([]);
                                                setTimeout(startConversation, 300);
                                            }}
                                            className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            <Minus size={12} /> {t.chatbot?.resetBtn || fb("Bắt đầu lại", "Start over")}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 bg-white/80 p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle2 size={12} className="text-green-500" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    PTN English Academy
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={toggleChat}
                        className={`group relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-105 active:scale-90 ${isOpen ? "bg-white text-secondary" : "bg-primary text-white"
                            }`}
                    >
                        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}

                        {!isOpen && !hasPrompted && (
                            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[11px] font-black text-white ring-4 ring-white">
                                1
                            </span>
                        )}

                        {!isOpen && (
                            <>
                                <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40 opacity-75"></span>
                                <span className="absolute right-full mr-5 hidden whitespace-nowrap rounded-2xl bg-secondary px-5 py-3 text-sm font-black text-white shadow-2xl transition-all group-hover:block animate-in fade-in slide-in-from-right-4">
                                    {t.chatbot?.floatingPrompt || fb("Cần Lan giúp gì không ạ? 👋", "Need any help? 👋")}
                                </span>
                            </>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};


export default ChatBox;
