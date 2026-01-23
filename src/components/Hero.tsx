export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover scale-105"
            >
                <source src="/1b643daa-5b00-4a7f-bce5-2ba575688d1e.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-white text-4xl md:text-6xl font-heading font-normal tracking-tight leading-[1.05] mb-8 animate-fade-in-up max-w-2xl mx-auto">
                        Kiến tạo hành trình <br className="hidden md:block" /> tri thức
                    </h1>
                    <p className="text-white text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90 animate-fade-in-up delay-100 font-body">
                        Partner to navigate your learning journey
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-200">
                        <button className="bg-primary hover:bg-red-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-red-500/30">
                            Đăng ký học thử ngay
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-10 py-5 rounded-full font-bold text-lg transition-all">
                            Tìm hiểu phương pháp
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
