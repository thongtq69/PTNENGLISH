"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

import HallOfFame from "@/components/HallOfFame";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeContent({ pageData, siteSettings }: { pageData: any; siteSettings: any }) {
  const { t, language } = useLanguage();
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Posts data is not an array:", data);
          return;
        }
        // Sort by createdAt descending to get the most recent posts
        const sorted = [...data].sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || a.date || 0).getTime();
          const dateB = new Date(b.createdAt || b.date || 0).getTime();
          return dateB - dateA;
        });
        setLatestPosts(sorted.slice(0, 3).filter(p => !!p));
      })
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  // Use data from DB if available, otherwise fallback to hardcoded (for safety)
  const homeHero = siteSettings?.hero || pageData?.sections?.find((s: any) => s.type === 'hero')?.content;
  const programs = siteSettings?.programs || [];
  const partners = siteSettings?.partners || [];
  const philosophy = siteSettings?.philosophy || siteSettings?.homeContent?.philosophyText || t.home.philosophy.text;
  const philosophyTitle = siteSettings?.philosophyTitle || t.home.philosophy.title;
  const intro = siteSettings?.intro || t.home.intro;
  const campus = siteSettings?.campus || t.home.campus;
  const faculty = siteSettings?.faculty || t.home.faculty;
  const homeBlog = siteSettings?.homeBlog || t.home.blog;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero initialData={homeHero} />

      {/* Philosophy Section - Compact & Dark */}
      <section className="py-2 md:py-12 bg-slate-900 border-y border-white/5">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-4 flex flex-col items-center"
          >
            <p className="text-[10px] md:text-xl font-serif text-slate-300 leading-relaxed not-italic font-medium text-center md:text-left md:border-l-2 md:border-primary/50 md:pl-6 py-0.5">
              {philosophy}
            </p>
            <div className="w-12 h-px bg-primary/40 mt-4 md:hidden"></div>
            <div className="mt-3 md:mt-4 flex justify-center items-center gap-3">
              <div className="h-px w-4 md:w-8 bg-primary/30"></div>
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-[7px] md:text-[9px]">{philosophyTitle}</span>
              <div className="h-px w-4 md:w-8 bg-primary/30"></div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-primary font-heading text-xs md:text-xl font-bold tracking-[0.3em] mb-1">
              {intro.badge}
            </h2>
            <h3 className="text-2xl md:text-5xl font-heading font-semibold mb-3 text-accent leading-tight text-center">
              {intro.title}
            </h3>
            <p className="text-sm md:text-xl text-slate-600 font-body leading-relaxed mb-6 md:mb-10 mx-auto max-w-4xl px-4 text-center">
              {intro.description || intro.desc}
            </p>
          </motion.div>


          <div className="flex flex-wrap justify-evenly gap-y-3 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-8">
            {programs.map((prog: any, idx: number) => {
              // Auto-detect correct hash if link is just /courses
              let finalLink = prog.link || "/courses";
              if (finalLink === '/courses' || finalLink === 'https://ptelc.edu.vn/courses') {
                const text = (prog.nameEn || prog.name || '').toLowerCase();
                if (text.includes('ielts')) finalLink = '/courses#ie';
                else if (text.includes('teens')) finalLink = '/courses#eft';
                else if (text.includes('general') || text.includes('giao tiếp')) finalLink = '/courses#ge';
              }

              return (
                <Link key={idx} href={finalLink} className="w-[28%] md:w-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer h-full"
                  >
                    <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-6 shadow-xl md:shadow-2xl transition-all group-hover:-translate-y-2 border border-slate-100">
                      <img src={prog.image} alt={prog.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {(prog.name === "PTE Academic" || prog.nameEn === "PTE Academic") && (
                        <div className="absolute top-1.5 right-1.5 md:top-4 md:right-4 bg-primary text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest z-20">New</div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-2 md:p-5 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-transparent flex items-end justify-center min-h-[50%]">
                        <p className="text-white font-heading font-black text-[9px] md:text-[15px] leading-tight uppercase tracking-tight text-center w-full pb-1 md:pb-2">{language === "en" && prog.nameEn ? prog.nameEn : prog.name}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="flex justify-center mt-6 md:mt-10">
            <Link href="/about-us" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all border-b-2 border-primary/20 pb-1">
              {intro.aboutBtn} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Hall Of Fame - Student Success - Moved higher as requested */}
      <HallOfFame config={siteSettings?.hallOfFame} />



      {/* Compact Study & Mock Test Section */}
      <section className="py-6 md:py-12 bg-accent relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-32 h-32 md:w-96 md:h-96 bg-primary rounded-full blur-[80px] md:blur-[150px]"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 md:w-96 md:h-96 bg-blue-600 rounded-full blur-[80px] md:blur-[150px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[3rem] p-4 md:p-10 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

              {/* Left Side: Consolidated Info */}
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest leading-none">
                    {campus.badge}
                  </div>
                  <div className="h-px w-12 bg-white/20"></div>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{campus.system}</span>
                </div>

                <h3 className="text-lg md:text-4xl font-heading font-semibold mb-2 md:mb-4 leading-tight text-white line-clamp-2">
                  {campus.title?.split(' ')[0]} <span className="text-primary font-bold">{campus.title?.split(' ').slice(1).join(' ')}</span>
                </h3>

                <p className="text-slate-400 text-[10px] md:text-base font-body leading-relaxed max-w-[280px] md:max-w-none">
                  {campus.description || campus.desc}
                </p>
              </div>


              {/* Right Side: Refined Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 w-full lg:w-auto shrink-0">
                <motion.a
                  href="https://lms.ptelc.edu.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 lg:min-w-[280px] group relative bg-primary px-6 py-4 md:px-8 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 text-white shadow-xl shadow-primary/20 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <BookOpen size={20} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5 leading-none">LMS Portal</p>
                    <p className="font-heading font-bold text-sm md:text-[17px] leading-tight uppercase">{campus.lmsBtn}</p>
                  </div>
                </motion.a>

                <motion.a
                  href="/test"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 lg:min-w-[280px] group relative bg-white/5 border border-white/10 px-6 py-4 md:px-8 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 text-white backdrop-blur-md hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <ExternalLink size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5 leading-none">Practice Test</p>
                    <p className="font-heading font-bold text-sm md:text-[17px] leading-tight uppercase">{campus.testBtn}</p>
                  </div>
                </motion.a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Faculty Highlight */}
      <section className="py-8 md:py-20 bg-slate-900 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/20 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <h2 className="text-primary font-heading font-bold text-[10px] md:text-lg uppercase tracking-widest mb-1 md:mb-4">{faculty.badge}</h2>
          <h3 className="text-base md:text-3xl lg:text-5xl font-heading font-semibold mb-2 md:mb-6 leading-tight text-white">
            {faculty.title}
          </h3>
          <p className="text-slate-200 text-[10px] md:text-lg mb-4 md:mb-8 leading-relaxed font-body px-4">
            {faculty.description || faculty.desc}
          </p>
          <Link href="/about-us" className="bg-primary hover:bg-black text-white px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-base transition-all transform hover:scale-105 inline-block uppercase">
            {faculty.btn}
          </Link>
        </div>
      </section>


      {/* Testimonials */}
      <Testimonials />

      {/* Latest News & Insights - Editorial Bento Grid */}
      <section className="py-4 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-4 md:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-primary font-heading font-black text-[8px] md:text-sm uppercase tracking-[0.4em] mb-1 md:mb-4">{homeBlog.badge}</h2>
              <h3 className="text-xl md:text-6xl font-heading font-black text-accent leading-none uppercase tracking-tighter">
                {homeBlog.title?.split('&')[0]} & <span className="text-primary">{homeBlog.title?.split('&')[1]}</span>
              </h3>
            </div>
            <Link href="/blog" className="group flex items-center gap-2 text-accent font-black uppercase tracking-widest text-[9px] md:text-xs border-b-2 border-primary pb-1 md:pb-2 hover:text-primary transition-colors">
              {homeBlog.viewAll}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform md:w-4 md:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6">
            {latestPosts.length > 0 ? (
              <>
                {/* Featured Article - Large Left Column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="md:col-span-7 md:row-span-2 group cursor-pointer relative"
                >
                  <Link href={`/blog/${latestPosts[0].slug || latestPosts[0]._id}`} className="absolute inset-0 z-20" />
                  <div className="relative aspect-[16/10] md:h-full bg-slate-100 overflow-hidden border-2 md:border-4 border-accent">
                    <img
                      src={latestPosts[0].image || "/news/workshop.png"}
                      alt={latestPosts[0].title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[0.3] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full">
                      <div className="inline-block px-2 py-0.5 bg-primary text-white text-[7px] md:text-[10px] font-black uppercase tracking-widest mb-2 md:mb-6">
                        {latestPosts[0].category}
                      </div>
                      <h4
                        className="text-lg md:text-5xl font-heading font-black text-white leading-tight uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{ __html: latestPosts[0].title }}
                      />
                      <p className="text-slate-300 text-[9px] md:text-base font-body max-w-xl line-clamp-2 md:line-clamp-none opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 pb-2">
                        {latestPosts[0].excerpt}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Side Articles */}
                {latestPosts.slice(1, 3).map((post, idx) => (
                  <motion.div
                    key={post._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx + 1) * 0.1 }}
                    viewport={{ once: true }}
                    className="md:col-span-5 group cursor-pointer relative"
                  >
                    <Link href={`/blog/${post.slug || post._id}`} className="absolute inset-0 z-20" />
                    <div className="flex flex-col md:flex-row h-full border-2 border-slate-100 hover:border-accent transition-all p-6 md:p-8 bg-white gap-6">
                      <div className="md:w-1/3 aspect-square shrink-0 overflow-hidden bg-slate-100">
                        <img
                          src={post.image || "/news/achievement.png"}
                          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
                          alt={post.title}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-primary text-[9px] font-black uppercase tracking-widest mb-2">{post.category}</div>
                        <h4
                          className="text-xl font-heading font-black text-accent uppercase leading-tight tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                        <p className="text-xs text-slate-400 font-bold font-mono">{post.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="md:col-span-12 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                {t.common.loading}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 font-bold uppercase text-[7px] md:text-[10px] tracking-[0.3em] mb-4 md:mb-8">
            {siteSettings?.partnersSection?.badge || t.home?.partners?.badge || "Đối tác chiến lược & Khảo thí"}
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-wrap md:justify-center items-center gap-4 md:gap-16">
            {partners.map((p: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center group"
              >
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <img src={p.logo} alt={p.name} className="h-6 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100" />
                  </a>
                ) : (
                  <img src={p.logo} alt={p.name} className="h-6 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </main>
  );
}
