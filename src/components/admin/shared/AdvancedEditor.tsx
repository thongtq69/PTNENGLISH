"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { SelectionBookmark } from '@tiptap/pm/state';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
    Link as LinkIcon, Image as ImageIcon, Quote,
    Table as TableIcon, Undo, Redo,
    Minus, Layers, Loader2, HelpCircle
} from 'lucide-react';

interface AdvancedEditorProps {
    value: string;
    onChange: (content: string) => void;
    label?: string;
    placeholder?: string;
    onUploadingChange?: (uploading: boolean) => void;
}

const MenuButton = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        aria-pressed={isActive}
        className={`p-2 rounded-lg transition-all ${isActive
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
        {children}
    </button>
);

const AdvancedEditor = ({ value, onChange, label, placeholder, onUploadingChange }: AdvancedEditorProps) => {
    const [uploadProgress, setUploadProgress] = useState<{ total: number; current: number } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showImageControls, setShowImageControls] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imagePositionRef = useRef<SelectionBookmark | null>(null);

    useEffect(() => {
        onUploadingChange?.(isUploading);
        return () => onUploadingChange?.(false);
    }, [isUploading, onUploadingChange]);

    const uploadImage = async (file: string | Blob): Promise<string> => {
        let blob: Blob;
        if (typeof file === 'string') {
            const res = await fetch(file);
            blob = await res.blob();
        } else {
            blob = file;
        }
        if (!blob.type.startsWith('image/')) throw new Error('Vui lòng chọn tệp hình ảnh.');
        if (blob.size > 10 * 1024 * 1024) throw new Error('Mỗi ảnh cần nhỏ hơn 10 MB.');

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folderPath = 'ptn_english/blog/content';

        const paramsToSign = { timestamp, folder: folderPath };

        const signRes = await fetch('/api/upload/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paramsToSign }),
        });

        const { signature, cloudName, apiKey, error: signError } = await signRes.json();
        if (!signRes.ok || !signature || !cloudName || !apiKey) {
            throw new Error(signError || 'Không thể kết nối kho ảnh. Vui lòng thử lại.');
        }

        const formData = new FormData();
        formData.append('file', blob);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folderPath);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.secure_url) {
            throw new Error(uploadData.error?.message || 'Tải ảnh thất bại. Vui lòng thử lại.');
        }
        return uploadData.secure_url;
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
                link: false,
                underline: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl my-8 w-full max-w-full h-auto mx-auto block',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder: placeholder || 'Bắt đầu bài viết chuyên nghiệp của bạn...',
            }),
        ],
        immediatelyRender: false,
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-slate max-w-none focus:outline-none min-h-[400px] p-10 font-body leading-relaxed',
            },
            transformPastedHTML: (html) => {
                // Remove all style and class attributes from pasted content to avoid dark text issues from Word
                // but keep src for images and href for links. Also remove lang and other messy Word attributes.
                return html
                    .replace(/\sstyle=['"][^'"]*['"]/gi, '')
                    .replace(/\sclass=['"][^'"]*['"]/gi, '')
                    .replace(/\slang=['"][^'"]*['"]/gi, '')
                    .replace(/<span[^>]*>/gi, '')
                    .replace(/<\/span>/gi, '')
                    .replace(/<font[^>]*>/gi, '')
                    .replace(/<\/font>/gi, '');
            },
            handlePaste: (view, event) => {
                if (!event.clipboardData) return false;

                let html = event.clipboardData.getData('text/html');
                if (html) {
                    // Clean HTML before processing images
                    html = html
                        .replace(/\sstyle=['"][^'"]*['"]/gi, '')
                        .replace(/\sclass=['"][^'"]*['"]/gi, '')
                        .replace(/\slang=['"][^'"]*['"]/gi, '')
                        .replace(/<span[^>]*>/gi, '')
                        .replace(/<\/span>/gi, '')
                        .replace(/<font[^>]*>/gi, '')
                        .replace(/<\/font>/gi, '');
                }

                const dataUriRegex = /src=["']data:image\/[^;]+;base64,[^"']+["']/g;
                const matches = html ? html.match(dataUriRegex) : null;

                if (html && matches && matches.length > 0) {
                    event.preventDefault();
                    const bookmark = view.state.selection.getBookmark();
                    setIsUploading(true);
                    setUploadError(null);
                    editor?.setEditable(false, false);
                    setUploadProgress({ total: matches.length, current: 0 });

                    const processImages = async () => {
                        try {
                            let pastedHtml = html;

                            for (let i = 0; i < matches.length; i++) {
                                const match = matches[i];
                                const base64 = match.substring(5, match.length - 1);
                                const cloudUrl = await uploadImage(base64);
                                pastedHtml = pastedHtml.replace(match, `src="${cloudUrl}"`);
                                setUploadProgress(prev => prev ? { ...prev, current: i + 1 } : null);
                            }

                            if (editor && !editor.isDestroyed) {
                                const selection = bookmark.resolve(editor.state.doc);
                                editor.chain().focus().setTextSelection({ from: selection.from, to: selection.to }).insertContent(pastedHtml).run();
                            }
                        } catch (error) {
                            setUploadError(error instanceof Error ? error.message : 'Không thể tải ảnh đã dán.');
                        } finally {
                            if (editor && !editor.isDestroyed) editor.setEditable(true, false);
                            setIsUploading(false);
                            setUploadProgress(null);
                        }
                    };

                    processImages();
                    return true;
                }

                const items = Array.from(event.clipboardData.items);
                const imageItems = items.filter(item => item.type.startsWith('image/'));

                if (imageItems.length > 0) {
                    event.preventDefault();
                    const files = imageItems.map(item => item.getAsFile()).filter((file): file is File => !!file);
                    void insertFiles(files, view.state.selection.getBookmark());
                    return true;
                }

                return false;
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [value, editor]);

    const insertFiles = async (files: File[], bookmark: SelectionBookmark | null) => {
        if (!editor || editor.isDestroyed || !files.length || isUploading) return;
        setIsUploading(true);
        setUploadError(null);
        setUploadProgress({ total: files.length, current: 0 });
        editor.setEditable(false, false);
        try {
            const images = [];
            for (let i = 0; i < files.length; i++) {
                const src = await uploadImage(files[i]);
                images.push({ type: 'image', attrs: { src, alt: imageAlt || files[i].name.replace(/\.[^.]+$/, '') } });
                setUploadProgress({ total: files.length, current: i + 1 });
            }
            if (editor.isDestroyed) return;
            const selection = (bookmark || editor.state.selection.getBookmark()).resolve(editor.state.doc);
            editor.chain().focus().setTextSelection({ from: selection.from, to: selection.to })
                .insertContent([...images, { type: 'paragraph' }]).run();
            setShowImageControls(false);
            setImageAlt('');
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Không thể tải ảnh. Vui lòng thử lại.');
        } finally {
            if (!editor.isDestroyed) editor.setEditable(true, false);
            setIsUploading(false);
            setUploadProgress(null);
        }
    };

    const insertImageUrl = () => {
        if (!editor || isUploading) return;
        try {
            const url = new URL(imageUrl.trim(), window.location.origin);
            if (!imageUrl.trim() || !['https:', 'http:'].includes(url.protocol)) throw new Error('Vui lòng nhập đường dẫn ảnh hợp lệ (https://…).');
            const selection = (imagePositionRef.current || editor.state.selection.getBookmark()).resolve(editor.state.doc);
            editor.chain().focus().setTextSelection({ from: selection.from, to: selection.to })
                .insertContent([{ type: 'image', attrs: { src: url.href, alt: imageAlt } }, { type: 'paragraph' }]).run();
            setImageUrl('');
            setImageAlt('');
            setUploadError(null);
            setShowImageControls(false);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Không thể chèn ảnh.');
        }
    };

    if (!editor) return null;

    return (
        <div className="space-y-4 w-full">
            {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{label}</label>}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                aria-label="Chọn ảnh chèn vào bài viết"
                className="hidden"
                onChange={e => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = '';
                    void insertFiles(files, imagePositionRef.current);
                }}
            />
            {uploadError && <p role="alert" className="text-sm text-red-400">{uploadError}</p>}

            {isUploading && (
                <div className="bg-slate-900 border border-primary/20 rounded-2xl p-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin text-primary" size={18} />
                            <span className="text-xs font-black text-white uppercase tracking-widest">
                                Đang xử lý hình ảnh ({uploadProgress?.current}/{uploadProgress?.total})
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-primary">
                            {Math.round(((uploadProgress?.current || 0) / (uploadProgress?.total || 1)) * 100)}%
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${((uploadProgress?.current || 0) / (uploadProgress?.total || 1)) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl relative">
                <div inert={isUploading} className="p-4 border-b border-white/5 bg-white/[0.02] flex flex-wrap gap-1 items-center sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-1 pr-2 border-r border-white/5">
                        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="H1"><span className="font-black text-xs">H1</span></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="H2"><span className="font-black text-xs">H2</span></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="H3"><span className="font-black text-xs">H3</span></MenuButton>
                    </div>

                    <div className="flex items-center gap-1 px-2 border-r border-white/5">
                        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><Bold size={18} /></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><Italic size={18} /></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline"><UnderlineIcon size={18} /></MenuButton>
                    </div>

                    <div className="flex items-center gap-1 px-2 border-r border-white/5">
                        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><List size={18} /></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List"><ListOrdered size={18} /></MenuButton>
                    </div>

                    <div className="flex items-center gap-1 px-2 border-r border-white/5">
                        <MenuButton onClick={() => {
                            const url = window.prompt('Nhập link:');
                            if (url) editor.chain().focus().setLink({ href: url }).run();
                        }} isActive={editor.isActive('link')} title="Link"><LinkIcon size={18} /></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote"><Quote size={18} /></MenuButton>
                    </div>

                    <div className="flex items-center gap-1 px-2 border-r border-white/5">
                        <button
                            type="button"
                            title="Chèn ảnh tại vị trí con trỏ"
                            aria-expanded={showImageControls}
                            onClick={() => {
                                imagePositionRef.current = editor.state.selection.getBookmark();
                                setUploadError(null);
                                setShowImageControls(!showImageControls);
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 text-white hover:bg-primary/30 text-sm font-bold"
                        ><ImageIcon size={18} /> Chèn ảnh</button>
                        <MenuButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Table"><TableIcon size={18} /></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={18} /></MenuButton>
                        <MenuButton
                            onClick={() => {
                                const qNum = window.prompt('Nhập số thứ tự câu hỏi (ví dụ: 1):');
                                if (qNum) editor.chain().focus().insertContent(`[Q${qNum}]`).run();
                            }}
                            title="Insert Question Tag"
                        >
                            <HelpCircle size={18} className="text-primary" />
                        </MenuButton>
                    </div>

                    <div className="flex items-center gap-1 pl-2 ml-auto">
                        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={18} /></MenuButton>
                        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={18} /></MenuButton>
                    </div>
                </div>

                {showImageControls && (
                    <div role="group" aria-label="Chèn ảnh vào nội dung" className="p-5 border-b border-white/10 bg-slate-950 space-y-4">
                        <p className="text-sm text-slate-300">Ảnh sẽ được chèn tại vị trí con trỏ đã chọn trong bài viết.</p>
                        <label className="block text-sm text-slate-300">
                            Mô tả ảnh (không bắt buộc)
                            <input value={imageAlt} onChange={e => setImageAlt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }} disabled={isUploading} className="mt-2 w-full rounded-lg bg-slate-900 border border-white/10 p-3 text-white" />
                        </label>
                        <button type="button" disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="px-4 py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50">Tải ảnh từ thiết bị</button>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input type="url" aria-label="Đường dẫn ảnh" placeholder="Hoặc dán đường dẫn ảnh https://…" value={imageUrl} onChange={e => setImageUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); insertImageUrl(); } }} disabled={isUploading} className="min-w-0 flex-1 rounded-lg bg-slate-900 border border-white/10 p-3 text-white text-sm" />
                            <button type="button" onClick={insertImageUrl} disabled={isUploading || !imageUrl.trim()} className="px-4 py-3 rounded-lg bg-white/10 text-white font-bold disabled:opacity-40">Chèn đường dẫn ảnh</button>
                        </div>
                        <p className="text-xs text-slate-500">Có thể chọn nhiều ảnh. Mỗi ảnh tối đa 10 MB.</p>
                    </div>
                )}

                <div className="relative">
                    <EditorContent editor={editor} />
                    {!value && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-slate-700 pointer-events-none">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center opacity-20"><Layers size={32} /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Copy từ Word & Paste vào đây</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before { color: #475569; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
        .ProseMirror table { border-collapse: collapse; table-layout: fixed; width: 100%; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; }
        .ProseMirror td, .ProseMirror th { min-width: 1em; border: 1px solid rgba(255,255,255,0.1); padding: 12px 16px; vertical-align: top; position: relative; }
        .ProseMirror th { font-weight: bold; text-align: left; background-color: rgba(255,255,255,0.05); }
        .ProseMirror img { max-width: 100%; height: auto; display: block; margin: 2rem auto; border-radius: 1.5rem; }
      `}</style>
        </div>
    );
};

export default AdvancedEditor;
