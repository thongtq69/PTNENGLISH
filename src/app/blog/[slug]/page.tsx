import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import { Calendar, User, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    await dbConnect();
    const post = await Post.findOne({ slug: params.slug });

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Post Header */}
            <section className="pt-40 pb-20 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors group">
                        <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Quay lại Blog
                    </Link>

                    <div className="inline-block px-4 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-primary/20">
                        {post.category}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-heading font-black text-accent mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-primary" />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                            <Clock size={14} className="text-primary" />
                            {post.readTime || '5 phút'} đọc
                        </div>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                            <User size={14} className="text-primary" />
                            {post.author}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <div className="container mx-auto px-6 max-w-4xl -mt-10">
                <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Post Content */}
            <article className="py-20">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div
                        className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-heading prose-headings:font-black prose-headings:text-accent
                        prose-p:font-body prose-p:text-slate-600 prose-p:leading-relaxed
                        prose-li:font-body prose-li:text-slate-600
                        prose-strong:text-accent prose-strong:font-black
                        prose-img:rounded-3xl prose-img:shadow-xl
                        prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic"
                        dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
                    />
                </div>
            </article>

            {/* Newsletter Side (Simple) */}
            <section className="py-20 bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <h3 className="text-2xl md:text-4xl font-heading font-black text-white mb-6">Bạn thấy bài viết này hữu ích?</h3>
                    <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Đăng ký để nhận những kiến thức học thuật và lộ trình IELTS độc quyền từ PTN English.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <input type="email" placeholder="Email của bạn..." className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-80" />
                        <button className="px-8 py-4 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20">ĐĂNG KÝ NGAY</button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
