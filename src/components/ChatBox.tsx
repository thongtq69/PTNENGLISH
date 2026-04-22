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
    sender: "bot" | "user" | "admin";
    timestamp: Date | string;
    type?: "text" | "options";
    options?: string[];
};

export default function ChatBox() {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasPrompted, setHasPrompted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [leads, setLeads] = useState({ name: "", phone: "" });
    const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [config, setConfig] = useState<any>(null);
    const [inputText, setInputText] = useState("");
    const pathname = usePathname();

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial load: config and session ID
    useEffect(() => {
        fetch("/api/chatbot-config")
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error("Chatbot config error:", err));

        let sId = localStorage.getItem("ptn_chat_session");
        if (!sId) {
            sId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem("ptn_chat_session", sId);
        }
        setSessionId(sId);

        const savedLeads = localStorage.getItem("ptn_chat_leads");
        if (savedLeads) {
            setLeads(JSON.parse(savedLeads));
            setIsLeadSubmitted(true);
        }
    }, []);

    // Fetch messages from DB
    const fetchMessages = async () => {
        if (!sessionId) return;
        try {
            const res = await fetch(`/api/chat-sessions?sessionId=${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.messages && data.messages.length > 0) {
                    setMessages(data.messages.map((m: any) => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    })));
                } else if (config && messages.length === 0) {
                    // Start local sequence if db is empty
                    startLocalSequence();
                }
            }
        } catch (e) { console.error(e); }
    };

    // Polling every 3s when chat is open
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && sessionId) {
            fetchMessages(); // Initial fetch
            interval = setInterval(fetchMessages, 3000);
        }
        return () => clearInterval(interval);
    }, [isOpen, sessionId, config]);

    // Initial UI popup delay — auto-opens exactly once per session.
    useEffect(() => {
        const alreadyPrompted = typeof sessionStorage !== "undefined" && sessionStorage.getItem("ptn_chat_prompted") === "1";
        if (alreadyPrompted) {
            setHasPrompted(true);
            setIsVisible(true);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
            const openTimer = setTimeout(() => {
                if (hasPrompted || !config) return;
                if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("ptn_chat_prompted") === "1") return;
                const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
                // On mobile, never auto-open — it covers the hero. User must tap the floating button.
                if (isMobile) {
                    sessionStorage.setItem("ptn_chat_prompted", "1");
                    setHasPrompted(true);
                    return;
                }
                // On desktop, still wait if the AdModal is currently open so popups don't stack.
                const adState = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("ptn_ad_view_state") : null;
                if (adState === "open") return;
                setIsOpen(true);
                setHasPrompted(true);
                sessionStorage.setItem("ptn_chat_prompted", "1");
            }, 3000);
            return () => clearTimeout(openTimer);
        }, 5000);
        return () => clearTimeout(timer);
    }, [hasPrompted, config]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const startLocalSequence = () => {
        if (messages.length > 0) return;
        setMessages([
            { id: "1", text: language === 'vi' ? config.welcomeMsgVi : config.welcomeMsgEn, sender: "bot", timestamp: new Date() },
            { id: "2", text: language === 'vi' ? config.questionVi : config.questionEn, sender: "bot", timestamp: new Date(), type: "options", options: config.options.map((o: any) => language === 'vi' ? o.vi : o.en) }
        ]);
    };

    const sendMessage = async (text: string, isOption = false) => {
        if (!text.trim()) return;

        // Optimistic UI update
        const tempMsg: Message = { id: Date.now().toString(), text, sender: "user", timestamp: new Date() };

        // Remove options from previous bot msg if option was clicked
        if (isOption) {
            setMessages(prev => {
                const newArr = [...prev];
                const lastIdx = newArr.length - 1;
                if (newArr[lastIdx]?.type === "options") {
                    newArr[lastIdx] = { ...newArr[lastIdx], type: "text", options: [] };
                }
                return [...newArr, tempMsg];
            });
        } else {
            setMessages(prev => [...prev, tempMsg]);
        }
        setInputText("");

        // If local sequence hasn't requested leads yet, maybe ask.
        // But for true realtime, we just send to DB so admin can see.
        try {
            await fetch("/api/chat-sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    interest: isOption ? text : undefined,
                    message: { id: Date.now().toString(), text, sender: "user", timestamp: new Date() }
                })
            });
            fetchMessages();
        } catch (e) { console.error("Error sending message", e); }
    };

    const handleLeadsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leads.name || !leads.phone) return;
        localStorage.setItem("ptn_chat_leads", JSON.stringify(leads));
        setIsLeadSubmitted(true); // Hide the form right away

        const successText = language === 'vi' ? "Cảm ơn bạn! Chúng tôi đã ghi nhận thông tin và sẽ liên hệ sớm nhất." : "Thank you! We have received your information and will contact you soon.";
        const botMsg: Message = { id: Date.now().toString(), text: successText, sender: "bot", timestamp: new Date() };

        // Optimistic UI update
        setMessages(prev => [...prev, botMsg]);

        try {
            await fetch("/api/chat-sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    name: leads.name,
                    phone: leads.phone,
                    message: botMsg
                })
            });
        } catch (e) { }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setHasPrompted(true);
    };

    const isHiddenPath = pathname.startsWith("/admin") || pathname.startsWith("/test");
    if (isHiddenPath) return null;

    // Do we need to ask for leads?
    // If they have typed at least 1 user message, and we haven't successfully submitted the lead form yet.
    const needsLeads = messages.some(m => m.sender === "user") && !isLeadSubmitted;

    return (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[9999] font-sans text-sm flex justify-end">
            <AnimatePresence>
                {isOpen && config && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        className="w-full max-w-[360px] sm:w-[350px] md:w-[380px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-2xl shadow-indigo-200/50 backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-secondary to-indigo-900 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/30 bg-white/10 p-0.5">
                                        <div className="relative h-full w-full overflow-hidden rounded-full">
                                            <Image src={config.agentImage || "/images/consultant.png"} alt={config.agentName} fill className="object-cover" />
                                        </div>
                                        <div className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-indigo-900 bg-green-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold leading-tight">{config.agentName}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
                                            <p className="text-[11px] font-medium opacity-90">{language === 'vi' ? config.statusVi : config.statusEn}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={toggleChat} className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-all"><X size={20} /></button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="h-[350px] overflow-y-auto bg-slate-50/90 p-5 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={msg.id + idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] space-y-1`}>
                                        <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${msg.sender === "user"
                                            ? "bg-primary text-white rounded-tr-none shadow-primary/20"
                                            : "bg-white text-secondary rounded-tl-none border border-slate-100 shadow-indigo-100/30"
                                            }`}>
                                            <p className="whitespace-pre-line break-words">{msg.text}</p>
                                            {msg.type === "options" && msg.options?.length && (
                                                <div className="mt-4 grid gap-2">
                                                    {msg.options.map((opt) => (
                                                        <button key={opt} onClick={() => sendMessage(opt, true)}
                                                            className="group flex w-full items-center justify-between rounded-xl border border-primary/10 bg-slate-50 py-3 px-4 text-left text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                                                        >
                                                            {opt} <Send size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-[10px] text-slate-400 px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Lead Form Step if needed */}
                            {needsLeads && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} key="leads-form" animate={{ opacity: 1, scale: 1 }} className="rounded-2xl bg-white p-5 border border-primary/10 shadow-xl shadow-primary/5">
                                    <div className="mb-4 text-center"><p className="text-xs font-bold text-secondary">{language === 'vi' ? "Để lại SĐT để chúng tôi tiện tư vấn nhé:" : "Please leave your number so we can consult:"}</p></div>
                                    <form onSubmit={handleLeadsSubmit} className="space-y-3">
                                        <div className="relative">
                                            <User size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                                            <input required type="text" placeholder={language === 'vi' ? "Họ và tên của bạn" : "Your full name"} className="w-full rounded-xl border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:ring-primary/20" value={leads.name} onChange={(e) => setLeads({ ...leads, name: e.target.value })} />
                                        </div>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                                            <input required type="tel" placeholder={language === 'vi' ? "Số điện thoại / Zalo" : "Phone number / Zalo"} className="w-full rounded-xl border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:ring-primary/20" value={leads.phone} onChange={(e) => setLeads({ ...leads, phone: e.target.value })} />
                                        </div>
                                        <button type="submit" className="w-full rounded-xl bg-primary py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98]">
                                            {language === 'vi' ? "Gửi thông tin" : "Send Information"}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </div>

                        {/* Realtime Input Footer */}
                        <div className="border-t border-slate-100 bg-white p-3">
                            <form
                                onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}
                                className="flex gap-2 items-center"
                            >
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={language === 'vi' ? "Nhập tin nhắn..." : "Type a message..."}
                                    className="flex-1 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="bg-primary text-white p-2.5 rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <AnimatePresence>
                {isVisible && !isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        onClick={toggleChat} className="group relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-105 active:scale-90 bg-primary text-white"
                    >
                        <MessageCircle size={32} />
                        {!hasPrompted && <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[11px] font-black text-white ring-4 ring-white">1</span>}
                        {config && (
                            <>
                                <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40 opacity-75"></span>
                                <span className="absolute right-full mr-5 hidden whitespace-nowrap rounded-2xl bg-secondary px-5 py-3 text-sm font-black text-white shadow-2xl transition-all group-hover:block fade-in slide-in-from-right-4">
                                    {language === 'vi' ? config.floatingPromptVi : config.floatingPromptEn}
                                </span>
                            </>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
