"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Award } from "lucide-react";

const ACHIEVEMENTS = [
    {
        url: "https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/580986768_783291137998866_9106454110011808722_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=3K5M3x7bMOkQ7kNvwHxf8Ud&_nc_oc=AdkPrE7E4Mrtv3aTTqjU6U3U9ikrwTV8kOCrnJEYpOA9nm0hnlHzp88a-xMpcxQ-ctQ&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=Q5fyXLe_ExTTPvluxXMtCg&oh=00_AfrUFjAhXgdvoua-kKeuP4jdZSVCTnhwdzANsAmCiVE1SQ&oe=6978FFA0",
        title: "IELTS High Achiever",
        student: "Lê Thành Hưng",
        score: "8.0"
    },
    {
        url: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/579201297_783291197998860_5690025541620241344_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=QmvvGP1mVtEQ7kNvwELPlc3&_nc_oc=AdkY9gItS3dYV-s4tOMCcSpXb9_kRh6fZYjtipa6yGUscenQjkoM6POk4VejKJGYTFI&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=fm2k50SIPw7nCKPvLpFlAw&oh=00_Afox3Eo06yyksRYi5-YS6-x4bTJfthiWq51YgjHq1m4b6g&oe=6979106A",
        title: "IELTS High Achiever",
        student: "Lê Hà Minh Khuê",
        score: "7.5"
    },
    {
        url: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/592745042_799037516424228_6253108457529192276_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=50PiYgARapMQ7kNvwF5W4Zh&_nc_oc=Adn3haz01pikr41I3A5gvDNMWRJdJfI5pM1xCz3NJkpAVVEC8GkPDaQMJC-AStA_lhc&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=L3w50YFCSOKrC8QxSvXGEQ&oh=00_AfogeyOlNFlraNyuCcUr60DWmqkJVqMgGTA6knmPzRAThA&oe=6979254C",
        title: "IELTS High Achiever",
        student: "Trần Thị Phương Anh",
        score: "6.5"
    }
];

export default function HallOfFame() {
    return (
        <section className="py-20 bg-slate-900 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 center-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center items-center gap-3 mb-6"
                    >
                        <Trophy className="text-primary" size={24} />
                        <h2 className="text-primary font-heading font-black text-sm uppercase tracking-[0.4em]">Achievements</h2>
                        <Star className="text-primary" size={24} />
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-black text-white mb-6 uppercase tracking-tight"
                    >
                        Gương mặt mới <span className="text-primary">đạt thành tích</span> ấn tượng
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg font-body"
                    >
                        Chúc mừng các chiến binh <strong className="text-white">PTN English</strong> đã xuất sắc chinh phục mục tiêu IELTS với điểm số ấn tượng.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {ACHIEVEMENTS.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary transition-all duration-500 shadow-2xl">
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-contain bg-slate-800 transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award size={16} className="text-primary" />
                                        <span className="text-primary font-black uppercase tracking-widest text-[10px]">{item.title}</span>
                                    </div>
                                    <p className="text-white font-heading font-black text-2xl mb-1">Score: {item.score}</p>
                                    <p className="text-slate-300 text-xs font-medium">{item.student}</p>
                                </div>
                            </div>

                            {/* Decorative badge */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500 border-4 border-slate-900 flex-col">
                                <span className="text-[10px] font-black leading-none uppercase">PTN</span>
                                <Star size={12} fill="white" />
                                <span className="text-[8px] font-bold leading-none uppercase">PRO</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
