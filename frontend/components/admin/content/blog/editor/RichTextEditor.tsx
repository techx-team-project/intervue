'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Minus,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Eye,
  FileCode,
  Edit3,
} from 'lucide-react';
import MarkdownArticleContent from '@/components/blog/detail/MarkdownArticleContent';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

// Convert legacy markdown into HTML for TipTap if needed
export function markdownToHtml(md: string): string {
  if (!md) return '';
  if (md.includes('<p>') || md.includes('<h2>') || md.includes('<div>') || md.includes('<ul>')) {
    return md; // Already HTML
  }

  const lines = md.split('\n');
  const htmlParts: string[] = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      continue;
    }

    if (line.startsWith('## ')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push(`<h2>${line.replace(/^##\s+/, '')}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push(`<h3>${line.replace(/^###\s+/, '')}</h3>`);
    } else if (line.startsWith('> 💡') || line.startsWith('>')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      const quoteText = line.replace(/^>\s*(💡\s*)?/, '').trim();
      htmlParts.push(`<blockquote><p>${quoteText}</p></blockquote>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        htmlParts.push('<ul>');
        inList = true;
      }
      htmlParts.push(`<li>${line.replace(/^[-*]\s+/, '')}</li>`);
    } else {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      // Inline formatting
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
      htmlParts.push(`<p>${formatted}</p>`);
    }
  }

  if (inList) {
    htmlParts.push('</ul>');
  }

  return htmlParts.join('\n');
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Draft your article content here with rich formatting...',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [sourceCode, setSourceCode] = useState('');

  const initialHtml = React.useMemo(() => markdownToHtml(value), [value]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 underline font-semibold hover:text-emerald-800',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[360px] p-5 text-on-surface text-sm leading-relaxed ' +
          '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-on-surface [&_h2]:border-b [&_h2]:border-outline-variant [&_h2]:pb-2 [&_h2]:mt-6 [&_h2]:mb-3 ' +
          '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-on-surface [&_h3]:mt-4 [&_h3]:mb-2 ' +
          '[&_p]:mb-3.5 [&_p]:text-on-surface ' +
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3.5 [&_ul]:space-y-1 ' +
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3.5 [&_ol]:space-y-1 ' +
          '[&_li]:text-on-surface ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-50/50 [&_blockquote]:p-3.5 [&_blockquote]:rounded-r-xl [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-emerald-950 ' +
          '[&_code]:bg-surface-container-high [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs [&_code]:text-emerald-700 ' +
          '[&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:my-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Sync external value when loaded from server/props initially
  useEffect(() => {
    if (editor && value && !editor.isFocused && activeTab !== 'code') {
      const converted = markdownToHtml(value);
      if (converted !== editor.getHTML()) {
        editor.commands.setContent(converted, { emitUpdate: false });
      }
    }
  }, [value, editor, activeTab]);

  const handleTabSwitch = (tab: 'visual' | 'code' | 'preview') => {
    if (tab === 'code' && editor) {
      setSourceCode(editor.getHTML());
    }
    setActiveTab(tab);
  };

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g., https://example.com):', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleSourceCodeChange = (newCode: string) => {
    setSourceCode(newCode);
    onChange(newCode);
    if (editor) {
      editor.commands.setContent(newCode, { emitUpdate: false });
    }
  };

  if (!editor) {
    return (
      <div className="border-outline-variant bg-surface-container-low text-outline flex min-h-[380px] items-center justify-center rounded-2xl border text-xs">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border-outline-variant/80 overflow-hidden rounded-2xl border bg-white shadow-2xs">
      {/* Editor Main Header & Mode Tabs */}
      <div className="border-outline-variant/80 bg-surface-container-low/80 flex flex-wrap items-center justify-between border-b px-3.5 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleTabSwitch('visual')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'visual'
                ? 'bg-white text-emerald-700 shadow-2xs ring-1 ring-slate-200/60'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Visual Editor (WYSIWYG)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('code')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'code'
                ? 'bg-white text-emerald-700 shadow-2xs ring-1 ring-slate-200/60'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>HTML Code</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('preview')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'preview'
                ? 'bg-white text-emerald-700 shadow-2xs ring-1 ring-slate-200/60'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {activeTab === 'visual' && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
              className="text-on-surface-variant hover:bg-surface-container-high/60 rounded-md p-1.5 disabled:opacity-30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
              className="text-on-surface-variant hover:bg-surface-container-high/60 rounded-md p-1.5 disabled:opacity-30"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Formatting Toolbar (Only visible in Visual mode) */}
      {activeTab === 'visual' && (
        <div className="border-outline-variant text-on-surface-variant flex flex-wrap items-center gap-0.5 border-b bg-white px-3 py-1.5">
          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`rounded-md p-1.5 text-xs font-bold transition ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Heading 2 (H2)"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`rounded-md p-1.5 text-xs font-bold transition ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Heading 3 (H3)"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="bg-surface-container-high mx-1 h-4 w-px" />

          {/* Inline marks */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('bold')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('italic')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('underline')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('strike')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <div className="bg-surface-container-high mx-1 h-4 w-px" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('bulletList')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Bulleted List"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('orderedList')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <div className="bg-surface-container-high mx-1 h-4 w-px" />

          {/* Blockquote & Code */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('blockquote')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Key Point / Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('codeBlock')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>

          <div className="bg-surface-container-high mx-1 h-4 w-px" />

          {/* Links & Dividers */}
          <button
            type="button"
            onClick={handleSetLink}
            className={`rounded-md p-1.5 transition ${
              editor.isActive('link')
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/40'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="rounded-md p-1.5 text-rose-500 transition hover:bg-rose-50"
              title="Remove Link"
            >
              <Unlink className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="text-on-surface-variant hover:bg-surface-container-high rounded-md p-1.5 transition"
            title="Horizontal Divider"
          >
            <Minus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="text-outline hover:bg-surface-container-high hover:text-on-surface rounded-md p-1.5 transition"
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Editor Canvas Area */}
      <div className="min-h-[380px] bg-white">
        {activeTab === 'visual' && <EditorContent editor={editor} />}

        {activeTab === 'code' && (
          <div className="p-4">
            <textarea
              rows={18}
              value={sourceCode}
              onChange={(e) => handleSourceCodeChange(e.target.value)}
              placeholder="Paste or write HTML markup here..."
              className="border-outline-variant w-full rounded-xl border bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="p-6">
            {editor.getHTML().trim() ? (
              <MarkdownArticleContent content={editor.getHTML()} />
            ) : (
              <p className="text-outline py-12 text-center text-xs">No article content to preview.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
