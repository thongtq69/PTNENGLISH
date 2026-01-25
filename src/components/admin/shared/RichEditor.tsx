"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 bg-slate-900 border border-white/5 animate-pulse rounded-2xl flex items-center justify-center">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Editor...</p>
        </div>
    ),
});

interface RichEditorProps {
    value: string;
    onChange: (content: string) => void;
    label?: string;
    placeholder?: string;
}

const RichEditor = ({ value, onChange, label, placeholder }: RichEditorProps) => {
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'blockquote', 'code-block'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false, // Prevents extra line breaks when pasting from Word/Web
        }
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'link', 'blockquote', 'code-block',
    ];

    return (
        <div className="space-y-3 w-full group">
            {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{label}</label>}

            <div className="rich-editor-container rounded-[1.5rem] overflow-hidden border border-white/5 bg-slate-950 transition-all focus-within:border-primary/50 shadow-inner">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder || 'Bắt đầu viết nội dung tại đây...'}
                />
            </div>

            <style jsx global>{`
        .rich-editor-container .ql-toolbar {
          background: rgba(15, 23, 42, 0.8) !important;
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 12px 20px !important;
        }
        .rich-editor-container .ql-container {
          border: none !important;
          font-family: inherit !important;
          font-size: 0.875rem !important;
          color: #cbd5e1 !important;
          min-h: 300px !important;
        }
        .rich-editor-container .ql-editor {
          padding: 24px !important;
          line-height: 1.8 !important;
          min-height: 300px;
        }
        .rich-editor-container .ql-editor.ql-blank::before {
          color: #475569 !important;
          font-style: italic !important;
          left: 24px !important;
        }
        .rich-editor-container .ql-stroke {
          stroke: #94a3b8 !important;
        }
        .rich-editor-container .ql-fill {
          fill: #94a3b8 !important;
        }
        .rich-editor-container .ql-picker {
          color: #94a3b8 !important;
        }
        .rich-editor-container .ql-active .ql-stroke {
          stroke: #ff3b3b !important;
        }
        .rich-editor-container .ql-active .ql-fill {
          fill: #ff3b3b !important;
        }
        .rich-editor-container .ql-active {
          color: #ff3b3b !important;
        }
        .rich-editor-container .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-editor-container .ql-snow.ql-toolbar button:hover .ql-fill {
          stroke: #ff3b3b !important;
          fill: none !important;
        }
        .rich-editor-container .ql-snow.ql-toolbar button:hover .ql-fill {
           fill: #ff3b3b !important;
           stroke: none !important;
        }
      `}</style>
        </div>
    );
};

export default RichEditor;
