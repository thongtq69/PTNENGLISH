"use client";

import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ZoomIn, ZoomOut, Loader2, AlertTriangle, FileText } from 'lucide-react';

// Use a reliable CDN worker for pdf.js - unpkg is usually more reliable for specific versions
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ModernPDFViewerProps {
    url: string;
}

export default function ModernPDFViewer({ url }: ModernPDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [scale, setScale] = useState(1.2);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // For Cloudinary PDF URLs, use our server-side proxy which handles
    // signed URLs and resource_type detection. This bypasses ACL/401 issues.
    const resolvedUrl = (() => {
        if (!url) return url;
        // If it's a Cloudinary PDF, route through our proxy
        if (url.match(/cloudinary\.com\/.*\.pdf$/i)) {
            return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
        }
        return url;
    })();

    // We'll use this to group and render pages
    const containerRef = useRef<HTMLDivElement>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
        setErrorMsg(null);
    }

    function onDocumentLoadError(error: Error) {
        console.error("PDF Load Error:", error);
        setLoading(false);
        setErrorMsg(error.message);
    }

    return (
        <div className="flex flex-col h-full bg-accent overflow-hidden">
            {/* PDF Toolbar */}
            <div className="bg-accent/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between z-20 shadow-xl">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                        <FileText size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                            {numPages ? `${numPages} Pages` : 'Loading...'}
                        </span>
                    </div>

                    <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                        <button
                            onClick={() => setScale(s => Math.max(0.4, s - 0.2))}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white"
                            title="Zoom Out"
                        >
                            <ZoomOut size={18} />
                        </button>
                        <div className="px-4 flex items-center text-[10px] font-black text-white uppercase tracking-widest min-w-[70px] justify-center">
                            {Math.round(scale * 100)}%
                        </div>
                        <button
                            onClick={() => setScale(s => Math.min(3, s + 0.2))}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white"
                            title="Zoom In"
                        >
                            <ZoomIn size={18} />
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    Continuous Scroll View
                </div>
            </div>

            {/* PDF Render Area - Scrollable */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto bg-accent scroll-smooth custom-scrollbar"
            >
                <div className="flex flex-col items-center py-12 gap-8 min-h-full">
                    {url.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                        <div className="relative group max-w-full px-4">
                            <img
                                src={url}
                                alt="Test Material"
                                className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm border border-white/5 max-w-full h-auto"
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                            />
                        </div>
                    ) : url.match(/\.(doc|docx)/i) ? (
                        <div className="w-full max-w-5xl h-[80vh] px-4">
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(url.startsWith('http') ? url : `${window.location.origin}${url}`)}&embedded=true`}
                                className="w-full h-full rounded-2xl shadow-2xl border border-white/10"
                                title="Word Document Viewer"
                            />
                        </div>
                    ) : (
                        <Document
                            file={resolvedUrl.startsWith('http') || resolvedUrl.startsWith('/') ? resolvedUrl : `${window.location.origin}${resolvedUrl}`}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={
                                <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
                                    <Loader2 className="animate-spin text-primary" size={40} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Initializing Engine...</span>
                                </div>
                            }
                            error={
                                <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-4 bg-accent rounded-[3rem] border border-white/5 max-w-md mx-auto my-20">
                                    <AlertTriangle className="text-primary" size={48} />
                                    <p className="text-sm font-bold uppercase tracking-widest text-center">PDF not found</p>
                                    <p className="text-xs text-slate-500 text-center leading-relaxed max-w-sm">
                                        The PDF file could not be loaded. It may have been deleted from the server.
                                        Please go to <strong>Admin → Mock Tests → Writing</strong> tab and re-upload the PDF.
                                    </p>
                                    {errorMsg && (
                                        <p className="text-[10px] font-mono text-red-500/80 bg-red-950/20 p-4 rounded-2xl break-all text-center border border-red-900/30">
                                            Error: {errorMsg}
                                        </p>
                                    )}
                                    <p className="text-[9px] font-medium normal-case opacity-40 text-center select-all">Resource: {url}</p>
                                    <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase shadow-2xl shadow-primary/30 active:scale-95 transition-all">Retry Connection</button>
                                </div>
                            }
                        >
                            {/* Rendering all pages mapping */}
                            {Array.from({ length: numPages || 0 }, (_, i) => (
                                <div key={`page_${i + 1}`} className="relative group">
                                    <div className="absolute -left-12 top-4 text-[10px] font-black text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                        P{i + 1}
                                    </div>
                                    <Page
                                        pageNumber={i + 1}
                                        scale={scale}
                                        loading={
                                            <div
                                                style={{ width: 600 * scale, height: 840 * scale }}
                                                className="bg-accent/40 animate-pulse rounded-sm flex items-center justify-center"
                                            >
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Loading P{i + 1}...</span>
                                            </div>
                                        }
                                        renderAnnotationLayer={true}
                                        renderTextLayer={true}
                                        className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden border border-white/5"
                                    />
                                </div>
                            ))}
                        </Document>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .react-pdf__Page__textContent {
                    z-index: 10;
                }
                .react-pdf__Page__textContent span {
                    color: transparent !important;
                    user-select: text !important;
                    -webkit-user-select: text !important;
                }
                .react-pdf__Page__textContent span::selection {
                    background-color: rgba(255, 235, 59, 0.6); 
                }
                
                ::selection {
                    background: rgba(255, 59, 59, 0.3) !important;
                    color: inherit !important;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    border: 2px solid #0f172a;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}
