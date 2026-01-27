"use client";

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
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
}

const MenuButton = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-all ${isActive
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
        {children}
    </button>
);

const AdvancedEditor = ({ value, onChange, label, placeholder }: AdvancedEditorProps) => {
    const [uploadProgress, setUploadProgress] = useState<{ total: number; current: number } | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: string | Blob): Promise<string | null> => {
        try {
            const formData = new FormData();
            if (typeof file === 'string') {
                const res = await fetch(file);
                const blob = await res.blob();
                formData.append('file', blob, 'word_image.png');
            } else {
                formData.append('file', file);
            }
            formData.append('folder', 'blog/content');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            return data.url || null;
        } catch (e) {
            console.error('Image upload failed:', e);
            return null;
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
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
                    class: 'rounded-3xl shadow-xl my-8 max-w-full h-auto mx-auto border-4 border-white/5 block',
                },
            }),
            TextStyle,
            Color,
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
            handlePaste: (view, event) => {
                if (!event.clipboardData) return false;

                const html = event.clipboardData.getData('text/html');
                const dataUriRegex = /src="data:image\/[^;]+;base64,[^"]+"/g;
                const matches = html.match(dataUriRegex);

                if (matches && matches.length > 0) {
                    setIsUploading(true);
                    setUploadProgress({ total: matches.length, current: 0 });

                    const processImages = async () => {
                        let currentContent = editor?.getHTML() || "";
                        let pastedHtml = html;

                        for (let i = 0; i < matches.length; i++) {
                            const match = matches[i];
                            const base64 = match.substring(5, match.length - 1);
                            const cloudUrl = await uploadImage(base64);
                            if (cloudUrl) {
                                pastedHtml = pastedHtml.replace(match, `src="${cloudUrl}"`);
                            }
                            setUploadProgress(prev => prev ? { ...prev, current: i + 1 } : null);
                        }

                        editor?.commands.setContent(currentContent + pastedHtml);
                        setIsUploading(false);
                        setUploadProgress(null);
                    };

                    processImages();
                    return true;
                }

                const items = Array.from(event.clipboardData.items);
                const imageItems = items.filter(item => item.type.startsWith('image/'));

                if (imageItems.length > 0) {
                    setIsUploading(true);
                    setUploadProgress({ total: imageItems.length, current: 0 });

                    const processFiles = async () => {
                        for (let i = 0; i < imageItems.length; i++) {
                            const file = imageItems[i].getAsFile();
                            if (file) {
                                const url = await uploadImage(file);
                                if (url) {
                                    editor?.chain().focus().setImage({ src: url }).run();
                                }
                            }
                            setUploadProgress(prev => prev ? { ...prev, current: i + 1 } : null);
                        }
                        setIsUploading(false);
                        setUploadProgress(null);
                    };

                    processFiles();
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

    if (!editor) return null;

    return (
        <div className="space-y-4 w-full">
            {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{label}</label>}

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
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex flex-wrap gap-1 items-center sticky top-0 z-10 backdrop-blur-md">
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
