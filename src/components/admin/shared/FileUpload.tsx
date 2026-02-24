"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, FileText, Video, Headphones, Crop } from 'lucide-react';
import ImageCropper from './ImageCropper';

interface FileUploadProps {
    value: string;
    originalValue?: string;
    onChange: (url: string, meta?: { isCropped: boolean }) => void;
    onPositionChange?: (pos: { x: number, y: number }) => void;
    onUploading?: (loading: boolean) => void;
    label?: string;
    folder?: string;
    compact?: boolean;
    accept?: string;
    mode?: 'image' | 'pdf' | 'video' | 'audio' | 'word' | 'all';
    aspect?: number;
    noCrop?: boolean;
}

export default function FileUpload({
    value,
    originalValue,
    onChange,
    onPositionChange,
    onUploading,
    label,
    folder = 'uploads',
    compact = false,
    accept = "image/*",
    mode = 'image',
    aspect,
    noCrop = false
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [tempFileUrl, setTempFileUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getIcon = () => {
        if (mode === 'pdf') return <FileText size={compact ? 20 : 32} />;
        if (mode === 'video') return <Video size={compact ? 20 : 32} />;
        if (mode === 'audio') return <Headphones size={compact ? 20 : 32} />;
        if (mode === 'word' || (value && value.match(/\.(doc|docx)/i))) return <FileText size={compact ? 20 : 32} className="text-blue-500" />;
        return <ImageIcon size={compact ? 20 : 32} />;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (mode === 'image' && !file.type.startsWith('image/')) {
            alert('Vui lòng chọn tệp hình ảnh.');
            return;
        }

        if (mode === 'audio' && !file.type.startsWith('audio/')) {
            alert('Vui lòng chọn tệp audio (mp3, wav, ogg...).');
            return;
        }

        // Check file size (25MB limit for Cloudinary)
        const maxSizeMB = 25;
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            alert(`Tệp quá lớn (${fileSizeMB.toFixed(1)}MB). Giới hạn tối đa ${maxSizeMB}MB.`);
            return;
        }

        console.log(`[FileUpload] Uploading file: ${file.name}, type: ${file.type}, size: ${fileSizeMB.toFixed(2)}MB, mode: ${mode}`);

        // Upload the file
        uploadToServer(file);
    };

    const uploadToServer = async (file: File | Blob, isCroppedImage: boolean = false) => {
        setUploading(true);
        if (onUploading) onUploading(true);

        try {
            // Determine resource_type for Cloudinary
            // Audio and video must use 'video' resource_type in Cloudinary
            // PDF and Word files must use 'raw' to be directly accessible
            const isAudioOrVideo = mode === 'audio' || mode === 'video';
            const isPdfOrDoc = (file instanceof File && /\.(pdf|doc|docx)$/i.test(file.name))
                || (file instanceof File && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
                || mode === 'pdf' || mode === 'word';
            const resourceType = isAudioOrVideo ? 'video' : isPdfOrDoc ? 'raw' : 'auto';

            // 1. Get signature from our API
            const timestamp = Math.round(new Date().getTime() / 1000);
            const folderPath = `ptn_english/${folder}`;

            const paramsToSign: Record<string, any> = {
                timestamp,
                folder: folderPath,
            };

            const signRes = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign }),
            });

            const { signature, error: signError } = await signRes.json();
            if (signError) throw new Error(signError);

            // 2. Upload directly to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', '798193785297581');
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', folderPath);

            const cloudName = 'dtzegtrxb';
            // Use the correct resource_type endpoint
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            console.log(`[FileUpload] Uploading to Cloudinary: ${uploadUrl}`);

            const uploadRes = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();
            console.log('[FileUpload] Cloudinary response:', uploadData);

            if (uploadData.secure_url) {
                onChange(uploadData.secure_url, { isCropped: isCroppedImage });

                if (mode === 'image' && !isCroppedImage && !noCrop) {
                    setTempFileUrl(uploadData.secure_url);
                    setIsCropping(true);
                }
            } else {
                console.error('[FileUpload] Cloudinary error details:', JSON.stringify(uploadData));
                throw new Error(uploadData.error?.message || 'Lỗi khi tải tệp lên Cloudinary.');
            }
        } catch (error: any) {
            console.error('[FileUpload] Upload error:', error);
            alert(error.message || 'Lỗi kết nối máy chủ.');
        } finally {
            setUploading(false);
            if (onUploading) onUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCropComplete = async (croppedImageUrl: string, position: { x: number; y: number }) => {
        setIsCropping(false);
        setTempFileUrl(null);

        // Upload the cropped image to server
        try {
            // Convert data URL to blob
            const response = await fetch(croppedImageUrl);
            const blob = await response.blob();

            // Upload the cropped image (pass true to indicate this is a cropped image)
            await uploadToServer(blob, true);

            // Also pass the position for reference
            if (onPositionChange) {
                onPositionChange(position);
            }
        } catch (error) {
            console.error('Error uploading cropped image:', error);
            alert('Lỗi khi tải ảnh đã cắt lên server.');
        }
    };

    const renderPreview = () => {
        if (!value) return getIcon();

        if (mode === 'image' || value.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
            return <img src={value} alt="Preview" className="w-full h-full object-cover" />;
        }

        return (
            <div className="flex flex-col items-center justify-center gap-1 p-2">
                {getIcon()}
                {!compact && <span className="text-[8px] font-black uppercase text-primary truncate max-w-full px-2">Uploaded</span>}
            </div>
        );
    };

    if (compact) {
        return (
            <div className="w-full flex flex-col items-center gap-2">
                <div className="relative group">
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`w-16 h-16 rounded-xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center text-slate-700 shadow-inner group-hover:border-primary/30 transition-all cursor-pointer ${uploading ? 'animate-pulse' : ''}`}
                    >
                        {uploading ? <Loader2 size={24} className="animate-spin text-primary" /> : renderPreview()}
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
                    accept={mode === 'pdf' ? '.pdf' : mode === 'video' ? 'video/*' : mode === 'audio' ? 'audio/*' : mode === 'word' ? '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : (mode === 'all' ? 'image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : accept)}
                />

                {isCropping && tempFileUrl && (
                    <ImageCropper
                        image={tempFileUrl}
                        aspect={aspect}
                        onCropComplete={handleCropComplete}
                        onCancel={() => { setIsCropping(false); setTempFileUrl(null); }}
                    />
                )}
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
                        {renderPreview()}
                    </div>
                    {value && (
                        <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <X size={12} />
                            </button>
                            {mode === 'image' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTempFileUrl(originalValue || value);
                                        setIsCropping(true);
                                    }}
                                    className="bg-primary text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                                    title="Chỉnh sửa ảnh"
                                >
                                    <Crop size={12} />
                                </button>
                            )}
                        </div>
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
                            {uploading ? 'Đang tải lên...' : `Tải ${mode === 'pdf' ? 'PDF' : mode === 'video' ? 'Video' : mode === 'all' ? 'Tệp (PDF/Word/Ảnh)' : 'từ thiết bị'}`}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept={mode === 'pdf' ? '.pdf' : mode === 'video' ? 'video/*' : mode === 'audio' ? 'audio/*' : mode === 'word' ? '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : (mode === 'all' ? 'image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : accept)}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={`Hoặc dán URL ${mode} tại đây...`}
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-slate-400 text-[10px] outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            {isCropping && tempFileUrl && (
                <ImageCropper
                    image={tempFileUrl}
                    aspect={aspect}
                    onCropComplete={handleCropComplete}
                    onCancel={() => { setIsCropping(false); if (!value) setTempFileUrl(null); }}
                />
            )}
        </div>
    );
}

