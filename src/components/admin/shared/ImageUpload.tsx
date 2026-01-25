"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    folder?: string;
    compact?: boolean;
}

export default function ImageUpload({ value, onChange, label, folder = 'uploads', compact = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn tệp hình ảnh.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Kích thước ảnh không được vượt quá 5MB.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            } else {
                alert(data.error || 'Lỗi khi tải ảnh lên.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Lỗi kết nối máy chủ.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (compact) {
        return (
            <div className="w-full flex flex-col items-center gap-2">
                <div className="relative group">
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`w-16 h-16 rounded-xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center text-slate-700 shadow-inner group-hover:border-primary/30 transition-all cursor-pointer ${uploading ? 'animate-pulse' : ''}`}
                    >
                        {value ? (
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            uploading ? <Loader2 size={24} className="animate-spin text-primary" /> : <Upload size={24} />
                        )}
                    </div>
                    {value && !uploading && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onChange(''); }}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <X size={10} />
                        </button>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="URL..."
                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-2 py-1 text-[8px] text-slate-500 text-center outline-none focus:border-primary/50 transition-all"
                />
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full text-left">
            {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{label}</label>}

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Preview Area */}
                <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center text-slate-700 shadow-inner group-hover:border-primary/30 transition-all">
                        {value ? (
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={32} />
                        )}
                    </div>
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-3 w-full">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50"
                        >
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            {uploading ? 'Đang tải lên...' : 'Tải từ thiết bị'}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Hoặc dán URL ảnh tại đây..."
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-slate-400 text-[10px] outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
