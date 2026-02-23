"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, GraduationCap, ClipboardList, ArrowRight, Phone, MessageCircle, Quote } from "lucide-react";
import HallOfFame from "@/components/HallOfFame";
import Link from "next/link";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function StudentCornerContent({ pageData }: { pageData: any }) {
    const { t, language } = useLanguage();
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Helper for language-aware fallbacks (works with both string and string[])
    const fb = <T extends string | string[]>(vi: T, en: T): T => language === 'en' ? en : vi;

    // Extract sections with fallbacks
    const sections = pageData?.sections || [];

    const heroData = sections.find((s: any) => s.type === 'student-hero')?.content;
    const hero = {
        title: t.studentCorner?.hero?.title || heroData?.title || fb("Góc Học Viên", "Student Corner"),
        subtitle: t.studentCorner?.hero?.subtitle || heroData?.subtitle || fb("Dành riêng cho học viên PTN English", "Exclusively for PTN English Students"),
        description: t.studentCorner?.hero?.desc || heroData?.description || fb(
            "Không gian số hội tụ đầy đủ các công cụ, tài liệu và lộ trình học tập tối ưu, giúp bạn bứt phá và làm chủ tri thức mỗi ngày.",
            "A digital space fully equipped with tools, materials, and optimized learning pathways to help you break through and master knowledge every day."
        )
    };

    const playgroundData = sections.find((s: any) => s.type === 'student-playground')?.content;
    const playground = {
        title: t.studentCorner?.playground?.title || playgroundData?.title || fb("Hoạt động thường nhật & Sân chơi học viên", "Daily Activities & Student Playground"),
        headline: t.studentCorner?.playground?.headline || playgroundData?.headline || "PTN Playground",
        items: (playgroundData?.items || [
            { id: 1, type: 'image', size: 'large', src: "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/600349560_811824385145541_924529116167773166_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WrY3AmzobhsQ7kNvwEn4CKw&_nc_oc=Adnmgkplx_LTyk9c-hUbzVarhTwhrLUBSzCD0uiDfoAXYzTQw_bz849RWOQUl3hK3O8&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=x3LbkFcIHWTpcw3xM-kfCA&oh=00_AfprMZKVjjgaBCy1Nvm9AmHxJLbSdtEzmcB6F_9igPgNfw&oe=697937FB", label: fb("Hoạt động nổi bật", "Featured Workshop"), title: fb("Làm chủ Học thuật <br />& Kỹ năng Tranh biện", "Academic Mastery <br />& Debate Skills") },
            { id: 2, type: 'image', size: 'medium', src: "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/512614209_670142242647090_8961518773189171975_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=cK75sFRaF_IQ7kNvwGgDA4g&_nc_oc=AdkHowDUM1ksA7R5SgNBUWuiG1MPWNh1t0fAnY6wm923yDIJcRtP1WIwS5AlEXRVzD0&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=gcezZhlCLo3osHQGtAfGfw&oh=00_AfrpDGP0UUafCpx4SFhKepmE1W2SL-Yy-ONQ5-kg3f1BPw&oe=6979550A", title: fb("Phòng thư giãn PTN", "PTN Chill Room") },
            { id: 3, type: 'image', size: 'small', src: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/604346724_815746011420045_1980336211823099106_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qkLGV5Y5KSgQ7kNvwGJsDoK&_nc_oc=AdntDpZoz4yfKEI0j-Hv878q7mWIWTW5oGmMn9F5fPSS-SlIgkoN1lDvE0yvWJH6q0k&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=u7onphvhD4Z99P4LGaRv_A&oh=00_AfriXULs8DInaQCLKejSaQtSojNbi4ZUTHCZWT2iMQltzQ&oe=69794BE7" },
            { id: 4, type: 'image', size: 'small', src: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/597251461_806720128989300_4899544521814172881_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2Oq8wx-fJf4Q7kNvwGJ5r1V&_nc_oc=AdlXmd5w0vZ38pDbd51romsYEKcLIWmebDEnj6yNjGJucDFJWhOoMzt-mwq8kmDkIHI&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=TL2nZsVgFS8B57vSeDOb2A&oh=00_AfqzWqpezjeU14LZv63tB7HOg2tGplHMYcwE60k48sTt9w&oe=69793FC0" },
            { id: 5, type: 'image', size: 'tiny', src: "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/605711185_815745994753380_1350455286566131952_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=bbbY55kwlk0Q7kNvwHRa7RP&_nc_oc=Admy6SDvlmTH1Tr72HAjNa_G7eGPNHMK5CIgrYqEbKRjh5Uj_cF6eoZ6aLdvE4K0SDA&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=xoPy26A-wxyUkCQVcUWUkQ&oh=00_AfpKY0mVKSDuTmkccf8YXyg-FWzGwwhpRTVo2XCmpz9O7w&oe=69793079" },
            { id: 6, type: 'image', size: 'tiny', src: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/542167879_726034340391213_5658940871196288765_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=St8AHxsrVR0Q7kNvwFwOmLn&_nc_oc=Adl4Lp49qB-RMMmxbPGKygiUPbK8J1w-4Hf5eStBm49VtwgCm4qhQQNbOZiMwoz3N2Y&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=4g6YCtrOndWcVU0oKj0sfg&oh=00_AfprlDPBuc_MyGOygUib5r29YCf4W16wniEBLf1aVvsM8w&oe=69791B83" },
            { id: 7, type: 'image', size: 'tiny', src: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/525214975_697220113272636_4528856525560068367_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=3vVyVZowSvMQ7kNvwFRwTUp&_nc_oc=AdnRBw0O3ICn3o11Kj3zLnOOG2-emM1DfG1cgc8mnw7C_Ru9NI0suh4t-EGZLWhiaMw&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=jjHX8Hxw9nv6VMh6HDCS8g&oh=00_Afqr46-YmMLLOuFiGyfotdQCfenqJ6hs8HjaxMMCjANu-g&oe=69793F31" },
            { id: 8, type: 'video', size: 'tiny', src: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/503126116_651142867880361_4587213466788932149_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=JwCQsjroqCIQ7kNvwEe3I67&_nc_oc=Adl9pgY9ZbbM8XDTi2IRRtQVpS-EnI2AiGApOF0adVTLk8y0l8DnORpMwmG_XdG1XTE&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=S-dStxBKkC4PjgNayZw-BQ&oh=00_Afq66Dxbl0GpuLOKUMSasJQLaQV7xiefRXktJjMQ3ZhXBA&oe=69795068", link: "https://www.facebook.com/100089539590679/videos/pcb.683230831338231/1234526698354766" }
        ]).map((item: any) => ({
            ...item,
            label: item.label ? (typeof item.label === 'string' ? item.label : item.label[language]) : undefined,
            title: item.title ? (typeof item.title === 'string' ? item.title : item.title[language]) : undefined
        }))
    };


    const lmsData = sections.find((s: any) => s.type === 'student-lms')?.content;
    const lms = {
        title: t.studentCorner?.lms?.title || lmsData?.title || fb("Kho Tài Liệu <br /> <span className='text-primary font-bold'>Độc Quyền</span>", "Exclusive <br /> <span className='text-primary font-bold'>Resource Library</span>"),
        description: t.studentCorner?.lms?.desc || lmsData?.description || fb(
            "Truy cập tức thì vào hệ thống học tập LMS hiện đại của PTN English. Nơi lưu trữ hàng ngàn slide bài giảng, bài tập bổ trợ, và giáo trình chuyên sâu được biên soạn riêng cho từng khóa học.",
            "Instant access to PTN English's modern LMS learning system. A repository of thousands of lecture slides, supplementary exercises, and in-depth curriculum materials specially compiled for each course."
        ),
        items: t.studentCorner?.lms?.items || lmsData?.items || fb(
            ["Hệ thống bài tập Online tương tác", "Thư viện giáo trình MA.TESOL biên soạn", "Theo dõi lộ trình & kết quả học tập", "Kho video bài giảng xem lại 24/7"],
            ["Interactive Online exercise system", "MA.TESOL compiled curriculum library", "Track progress & learning results", "24/7 lecture video archive"]
        ),
        buttonText: t.studentCorner?.lms?.button || lmsData?.buttonText || fb("Vào cổng học tập", "Enter Learning Portal"),
        buttonLink: lmsData?.buttonLink || "https://lms.ptelc.edu.vn/"
    };

    const mocktestData = sections.find((s: any) => s.type === 'student-mocktest')?.content;
    const mocktest = {
        title: t.studentCorner?.mocktest?.title || mocktestData?.title || fb("Luyện Thi Thử <br /> <span className='text-primary font-bold'>Chuẩn Quốc Tế</span>", "International Standard <br /> <span className='text-primary font-bold'>Mock Tests</span>"),
        description: t.studentCorner?.mocktest?.desc || mocktestData?.description || fb(
            "Trải nghiệm hệ thống thi thử trực tuyến mô phỏng 100% môi trường thi thật. Giúp học viên quen với áp lực phòng thi, nắm vững cấu trúc đề và nhận phân tích chi tiết kỹ năng ngay lập tức.",
            "Experience an online mock testing system that simulates 100% of the real exam environment. Helps students get used to exam pressure, master test structures, and receive detailed skill analysis immediately."
        ),
        items: t.studentCorner?.mocktest?.items || mocktestData?.items || fb(
            ["Mock Test IELTS 4 kỹ năng chuẩn IDP/BC", "Kho đề thi cập nhật mới nhất hàng quý", "Chấm điểm & Phân tích lỗi sai chi tiết", "Giao diện chuẩn phòng thi thực tế"],
            ["IDP/BC standard IELTS 4-skill Mock Test", "Quarterly updated question bank", "Detailed scoring & error analysis", "Authentic exam room interface"]
        ),
        buttonText: t.studentCorner?.mocktest?.button || mocktestData?.buttonText || fb("Bắt đầu thi thử", "Start Mock Test"),
        buttonLink: mocktestData?.buttonLink || "/test"
    };


    const supportData = sections.find((s: any) => s.type === 'student-support')?.content;
    const support = {
        title: t.studentCorner?.support?.title || supportData?.title || fb(
            "Bạn gặp khó khăn <br className='md:hidden' /> <span className='text-primary'>khi truy cập?</span>",
            "Having trouble <br className='md:hidden' /> <span className='text-primary'>accessing?</span>"
        ),
        description: t.studentCorner?.support?.desc || supportData?.description || fb(
            "Đội ngũ kỹ thuật và bộ phận Academic luôn sẵn sàng hỗ trợ bạn 24/7. Hãy chọn phương thức liên hệ thuận tiện nhất.",
            "Our technical team and Academic department are always ready to support you 24/7. Choose the most convenient contact method for you."
        ),
        phone: t.studentCorner?.support?.phone || supportData?.phone || "Hotline",
        emailLink: supportData?.emailLink || "/contact#registration-form"
    };


    // Student Messages Section - Image Gallery Style
    const studentMessagesData = sections.find((s: any) => s.type === 'student-messages')?.content;
    const studentMessages = {
        title: t.studentCorner?.messages?.title || studentMessagesData?.title || fb("Lời Nhắn Từ Học Viên", "Messages From Students"),
        subtitle: t.studentCorner?.messages?.subtitle || studentMessagesData?.subtitle || "Student's Messages",
        description: t.studentCorner?.messages?.desc || studentMessagesData?.description || fb(
            "Những dòng chữ chân thành từ các học viên PTN English được lưu giữ qua từng khoảnh khắc",
            "Sincere words from PTN English students preserved through every moment"
        ),
        notes: studentMessagesData?.notes || [

            {
                id: 1,
                image: "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/526743323_122171120402241571_3498967980315481358_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=f6H8y1r6WVsQ7kNvwFfAAnH&_nc_oc=Adkb6oE-Cj-XvUpc2c31i20I90hY-uS_x93o9g5j1k9-h6Y9C1Z9-h6Y9C1Z9-h6Y9&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=A6_h7-y1P-7Q1-7Q1-7Q1&oh=00_AfB-P1-Q1-7Q1-7Q1&oe=697937FB",
                pinColor: "#ef4444",
                rotation: -3
            },
            {
                id: 2,
                image: "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/526743323_122171120402241571_3498967980315481358_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=f6H8y1r6WVsQ7kNvwFfAAnH&_nc_oc=Adkb6oE-Cj-XvUpc2c31i20I90hY-uS_x93o9g5j1k9-h6Y9C1Z9-h6Y9C1Z9-h6Y9&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=A6_h7-y1P-7Q1-7Q1-7Q1&oh=00_AfB-P1-Q1-7Q1-7Q1&oe=697937FB",
                pinColor: "#22c55e",
                rotation: 2
            },
            {
                id: 3,
                image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/526743323_122171120402241571_3498967980315481358_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=f6H8y1r6WVsQ7kNvwFfAAnH&_nc_oc=Adkb6oE-Cj-XvUpc2c31i20I90hY-uS_x93o9g5j1k9-h6Y9C1Z9-h6Y9C1Z9-h6Y9&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=A6_h7-y1P-7Q1-7Q1-7Q1&oh=00_AfB-P1-Q1-7Q1-7Q1&oe=697937FB",
                pinColor: "#f59e0b",
                rotation: -1
            },
            {
                id: 4,
                image: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/526743323_122171120402241571_3498967980315481358_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=f6H8y1r6WVsQ7kNvwFfAAnH&_nc_oc=Adkb6oE-Cj-XvUpc2c31i20I90hY-uS_x93o9g5j1k9-h6Y9C1Z9-h6Y9C1Z9-h6Y9&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=A6_h7-y1P-7Q1-7Q1-7Q1&oh=00_AfB-P1-Q1-7Q1-7Q1&oe=697937FB",
                pinColor: "#3b82f6",
                rotation: 4
            }
        ]
    };

    // Slider & Lightbox State
    const [startIndex, setStartIndex] = useState(0);
    const [selectedNote, setSelectedNote] = useState<any>(null);

    const itemsPerPage = isMobile ? 2 : 4;
    const totalNotes = studentMessages.notes?.length || 0;

    const nextSlide = () => {
        if (totalNotes <= itemsPerPage) return;
        setStartIndex((prev) => (prev + 1) % totalNotes);
    };

    const prevSlide = () => {
        if (totalNotes <= itemsPerPage) return;
        setStartIndex((prev) => (prev - 1 + totalNotes) % totalNotes);
    };

    // Circular visible items: get 4 items starting from startIndex
    const getVisibleNotes = () => {
        if (totalNotes === 0) return [];
        if (totalNotes <= itemsPerPage) return studentMessages.notes;

        const items = [];
        for (let i = 0; i < itemsPerPage; i++) {
            items.push(studentMessages.notes[(startIndex + i) % totalNotes]);
        }
        return items;
    };

    const visibleNotes = getVisibleNotes();

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Merged Hero & Student's Messages Section */}
            <section className="pt-28 pb-16 md:pb-20 bg-accent relative overflow-hidden">
                {/* Hero Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2"></div>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                <div className="container mx-auto px-6 relative z-10">
                    {/* Cork Board Area - Moved to Top */}
                    <div className="relative max-w-6xl mx-auto group/board mb-20 md:mb-28">
                        {/* Navigation Buttons */}
                        {totalNotes > itemsPerPage && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-slate-900/90 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 transition-all hover:bg-primary hover:scale-110 active:scale-95 group/btn"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-slate-900/90 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 transition-all hover:bg-primary hover:scale-110 active:scale-95 group/btn"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Cork Board Container */}
                        <div
                            className="relative rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-visible border-[8px] md:border-[10px] border-[#3D2B1F]"
                            style={{
                                background: "linear-gradient(145deg, #A67C52 0%, #8B6B43 50%, #6F5234 100%)",
                            }}
                        >
                            {/* Cork Board Texture Overlay */}
                            <div
                                className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] opacity-40 pointer-events-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />

                            {/* Inner Shadow for Depth */}
                            <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)] pointer-events-none" />

                            {/* Notes Grid - Use items-start for masonry-like feel */}
                            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10 items-start min-h-[250px] md:min-h-[400px]">
                                <AnimatePresence mode="popLayout">
                                    {visibleNotes.map((note: any, idx: number) => (
                                        <motion.div
                                            key={note.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0, rotate: note.rotation }}
                                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 0,
                                                zIndex: 20,
                                                transition: { type: "spring", stiffness: 400, damping: 20 }
                                            }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="relative cursor-pointer group"
                                            onClick={() => setSelectedNote(note)}
                                        >
                                            {/* Pushpin (3D Look) */}
                                            <div
                                                className="absolute -top-3 md:-top-5 left-1/2 -translate-x-1/2 z-30 w-5 h-5 md:w-8 md:h-8 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.6)] group-hover:scale-125 transition-transform"
                                                style={{
                                                    backgroundColor: note.pinColor,
                                                    background: `radial-gradient(circle at 30% 30%, ${note.pinColor}CC, ${note.pinColor})`,
                                                    boxShadow: `0 5px 10px rgba(0,0,0,0.4), inset -1px -1px 4px rgba(0,0,0,0.5), inset 1px 1px 4px rgba(255,255,255,0.4)`
                                                }}
                                            >
                                                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/60 blur-[1px]" />
                                            </div>

                                            {/* Polaroid Container */}
                                            <div
                                                className="relative bg-white p-1.5 md:p-3.5 pb-8 md:pb-16 shadow-[10px_10px_25px_rgba(0,0,0,0.4)] md:shadow-[15px_15px_35px_rgba(0,0,0,0.4)] border border-slate-200 transition-shadow group-hover:shadow-[20px_20px_50px_rgba(0,0,0,0.5)]"
                                                style={{
                                                    boxShadow: idx % 2 === 0 ? "10px 15px 30px rgba(0,0,0,0.4)" : "-10px 15px 30px rgba(0,0,0,0.4)"
                                                }}
                                            >
                                                {/* The Image (Up by Admin) - Removed aspect-square to show full image */}
                                                <div className="w-full h-auto overflow-hidden bg-slate-100 relative border border-slate-100">
                                                    <img
                                                        src={note.image}
                                                        alt={`Student Message ${note.id}`}
                                                        className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    {/* Image Gloss Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                    {/* Click to Expand Indicator */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                        <Maximize2 className="text-white" size={32} />
                                                    </div>
                                                </div>

                                                {/* Polaroid Bottom Text Area (Empty or small stamp) */}
                                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                                    <div className="h-1.5 w-16 bg-slate-100 mx-auto rounded-full opacity-50" />
                                                </div>

                                                {/* Paper Texture Overlay */}
                                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Unified Section Header - Moved below the board */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                            <GraduationCap size={14} className="text-primary" />
                            {hero.subtitle}
                        </div>
                        <h1 className="text-white text-3xl md:text-7xl font-heading font-semibold mb-6 leading-tight" style={{ fontSize: 'var(--fs-studentCorner-heroTitle)' }}>
                            {(() => {
                                const title = t.studentCorner?.hero?.mainTitle || hero.title;
                                if (title.includes('<br />') || title.includes('<br/>')) {
                                    return <span dangerouslySetInnerHTML={{ __html: title }} />;
                                }
                                if (title.includes('|')) {
                                    const parts = title.split('|');
                                    return (
                                        <>
                                            {parts[0].trim()} <span className="text-primary font-black">{parts[1].trim()}</span>
                                        </>
                                    );
                                }
                                const words = title.split(' ');
                                return (
                                    <>
                                        {words[0]} <span className="text-primary font-black">{words.slice(1).join(' ')}</span>
                                    </>
                                );
                            })()}
                        </h1>
                        <p className="text-slate-300 text-sm md:text-xl font-body leading-relaxed max-w-2xl mx-auto opacity-90" style={{ fontSize: 'var(--fs-studentCorner-heroDesc)' }}>
                            {hero.description}
                        </p>

                        <div className="mt-8 flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em]">
                            <Quote size={12} />
                            {studentMessages.subtitle}
                        </div>
                    </motion.div>
                </div>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedNote && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 md:p-10"
                        >
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setSelectedNote(null)}
                                className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-primary transition-colors p-3 bg-white/10 rounded-full border border-white/20"
                            >
                                <X size={32} />
                            </motion.button>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="relative max-w-5xl w-full max-h-[85vh] bg-white p-3 md:p-4 rounded-lg shadow-2xl"
                            >
                                <img
                                    src={selectedNote.image}
                                    alt="Student Message Large View"
                                    className="w-full h-full object-contain max-h-[80vh] rounded-sm"
                                />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400 font-bold tracking-widest text-[10px] uppercase">
                                    {t.studentCorner?.messages?.fullView || 'PTN Student Message · Full View'}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Student Playground - Uniform Grid */}
            <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                        <h2 className="text-primary font-heading text-xs md:text-lg font-bold uppercase tracking-[0.3em] mb-3 md:mb-4" style={{ fontSize: 'var(--fs-studentCorner-playgroundHeadline)' }}>
                            {playground.headline}
                        </h2>
                        <h3 className="text-2xl md:text-5xl font-heading font-black text-accent leading-tight" style={{ fontSize: 'var(--fs-studentCorner-playgroundTitle)' }} dangerouslySetInnerHTML={{ __html: playground.title }} />
                    </div>

                    {/* All items in a uniform grid — 2 cols mobile, 3 cols tablet, 4 cols desktop */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                        {playground.items.map((item: any, idx: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.04 }}
                                className={`relative group rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px] ${item.size === 'large' ? 'col-span-2 row-span-2 h-[326px] sm:h-[406px] md:h-[486px] lg:h-[566px]' : ''}`}
                            >
                                {item.type === 'video' ? (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative bg-accent">
                                        <img src={item.src} className="w-full h-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-40" alt="Video cover" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 md:w-7 md:h-7 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                            <span className="mt-2 text-white font-heading font-bold text-[10px] md:text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{t.studentCorner?.video?.watch || fb('Xem Video', 'Watch Video')}</span>
                                        </div>
                                    </a>
                                ) : (
                                    <>
                                        <img src={item.src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.title || "PTN Playground"} />
                                        {(item.label || item.title) && item.size !== 'small' && item.size !== 'tiny' && (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                                                <div className="absolute bottom-2 left-2 md:bottom-5 md:left-5 text-white pr-2">
                                                    {item.label && <span className="bg-primary px-1.5 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1 inline-block">{item.label}</span>}
                                                    {item.title && <h4 className="text-xs md:text-base lg:text-lg font-heading font-black leading-tight" dangerouslySetInnerHTML={{ __html: item.title }} />}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hall Of Fame Section */}
            <HallOfFame />

            {/* Main Tools Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-12">

                        {/* Learning Materials Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-slate-50 rounded-2xl md:rounded-[3rem] p-4 md:p-14 overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform duration-700"></div>

                            <div className="w-8 h-8 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 md:mb-10 transition-transform group-hover:scale-110 duration-500">
                                <BookOpen size={16} className="text-primary md:w-8 md:h-8" />
                            </div>

                            <h2 className="text-sm md:text-3xl font-heading font-black text-accent mb-2 md:mb-6" style={{ fontSize: 'var(--fs-studentCorner-lmsTitle)' }} dangerouslySetInnerHTML={{ __html: lms.title }} />

                            <div className="space-y-6 mb-12">
                                <p className="text-slate-600 font-body leading-relaxed text-xs md:text-lg" style={{ fontSize: 'var(--fs-studentCorner-lmsDesc)' }} dangerouslySetInnerHTML={{ __html: lms.description }} />
                                <ul className="space-y-2 md:space-y-4">
                                    {lms.items.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2 md:gap-3 text-slate-500 font-medium text-[10px] md:text-base">
                                            <div className="w-1 h-1 rounded-full bg-primary/50"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <motion.a
                                href={lms.buttonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 md:px-8 md:py-5 rounded-full font-bold text-xs md:text-lg shadow-lg shadow-primary/20 transition-all uppercase"
                                style={{ fontSize: 'var(--fs-studentCorner-lmsBtn)' }}
                            >
                                {lms.buttonText}
                                <ArrowRight size={10} className="md:w-5 md:h-5" />
                            </motion.a>
                        </motion.div>

                        {/* Mock Test Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-accent rounded-2xl md:rounded-[3rem] p-4 md:p-14 overflow-hidden shadow-2xl shadow-accent/20 hover:shadow-primary/10 transition-all duration-500"
                        >
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-tr-full -translate-x-10 translate-y-10 group-hover:-translate-x-5 group-hover:translate-y-5 transition-transform duration-700"></div>

                            <div className="w-8 h-8 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-white/10 flex items-center justify-center mb-4 md:mb-10 border border-white/20 transition-transform group-hover:scale-110 duration-500">
                                <ClipboardList size={16} className="text-white md:w-8 md:h-8" />
                            </div>

                            <h2 className="text-sm md:text-3xl font-heading font-black text-white mb-2 md:mb-6" style={{ fontSize: 'var(--fs-studentCorner-mocktestTitle)' }} dangerouslySetInnerHTML={{ __html: mocktest.title }} />

                            <div className="space-y-6 mb-12">
                                <p className="text-slate-300 font-body leading-relaxed text-xs md:text-lg" style={{ fontSize: 'var(--fs-studentCorner-mocktestDesc)' }} dangerouslySetInnerHTML={{ __html: mocktest.description }} />
                                <ul className="space-y-2 md:space-y-4">
                                    {mocktest.items.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2 md:gap-3 text-slate-400 font-medium text-[10px] md:text-base">
                                            <div className="w-1 h-1 rounded-full bg-primary/50"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={mocktest.buttonLink}
                                className="inline-flex items-center gap-2 bg-white text-accent hover:bg-primary hover:text-white px-4 py-2.5 md:px-8 md:py-5 rounded-full font-bold text-xs md:text-lg transition-all uppercase"
                                style={{ fontSize: 'var(--fs-studentCorner-mocktestBtn)' }}
                            >
                                {mocktest.buttonText}
                                <ArrowRight size={10} className="md:w-5 md:h-5" />
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Support Section - Enhanced UI */}
            <section className="pb-32 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center max-w-5xl mx-auto relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 p-6 md:p-16">
                            <h3 className="text-xl md:text-5xl font-heading font-black text-white mb-4" style={{ fontSize: 'var(--fs-studentCorner-supportTitle)' }} dangerouslySetInnerHTML={{ __html: support.title }} />
                            <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-sm md:text-lg" style={{ fontSize: 'var(--fs-studentCorner-supportDesc)' }}>
                                {support.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                <Link
                                    href={support.emailLink}
                                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">{t.studentCorner?.support?.supportCenter || fb('Trung tâm hỗ trợ', 'Support Center')}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{t.studentCorner?.support?.sendRequest || fb('Gửi yêu cầu', 'Send Request')}</p>
                                    </div>
                                </Link>

                                <a
                                    href={`tel:${support.phone.replace(/\s/g, '')}`}
                                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Phone size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">{support.phone}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{t.studentCorner?.support?.hotlineLabel || fb('Hotline hỗ trợ', 'Support Hotline')}</p>
                                    </div>
                                </a>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/5">
                                <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">
                                    {t.studentCorner?.footer?.brand || 'Partner To Navigate · PTN English'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
