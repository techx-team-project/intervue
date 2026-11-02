'use client';

import { cn } from '@/lib/utils';
import { Bold, Code, Italic, List, ListOrdered } from 'lucide-react';
import React, { useRef } from 'react';

interface FormattedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const FormattedTextarea = React.forwardRef<HTMLTextAreaElement, FormattedTextareaProps>(
  ({ className, label, error, helperText, id, value = '', onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const applyFormatting = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
      const textarea = ref && 'current' in ref && ref.current ? ref.current : internalRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = textarea.value || '';
      const selected = currentVal.substring(start, end);

      const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${defaultText}${suffix}`;
      const updatedVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

      // Trigger synthetic change event for React Hook Form
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (nativeSetter) {
        nativeSetter.call(textarea, updatedVal);
      } else {
        textarea.value = updatedVal;
      }

      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);

      // Restore focus & cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
      }, 0);
    };

    const handleInsertBullet = () => {
      const textarea = ref && 'current' in ref && ref.current ? ref.current : internalRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const currentVal = textarea.value || '';
      const isStartOfLine = start === 0 || currentVal.charAt(start - 1) === '\n';
      const insertPrefix = isStartOfLine ? '• ' : '\n• ';

      applyFormatting(insertPrefix, '', 'Key point');
    };

    const handleInsertNumbered = () => {
      const textarea = ref && 'current' in ref && ref.current ? ref.current : internalRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const currentVal = textarea.value || '';
      const isStartOfLine = start === 0 || currentVal.charAt(start - 1) === '\n';
      const insertPrefix = isStartOfLine ? '1. ' : '\n1. ';

      applyFormatting(insertPrefix, '', 'Step or requirement');
    };

    // Calculate stats
    const textValue = typeof value === 'string' ? value : '';
    const charCount = textValue.length;
    const wordCount = textValue.trim() ? textValue.trim().split(/\s+/).length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={textareaId} className="block text-sm font-semibold text-slate-800">
              {label}
            </label>
          )}

          <span className="text-[11px] font-medium text-slate-400">
            {wordCount} words · {charCount} chars
          </span>
        </div>

        <div
          className={cn(
            'overflow-hidden rounded-xl border bg-white transition-colors focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15',
            error ? 'border-rose-400' : 'border-slate-300',
          )}
        >
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/70 px-2.5 py-1.5 text-slate-600">
            <button
              type="button"
              onClick={() => applyFormatting('**', '**', 'bold text')}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-slate-200/70 hover:text-slate-900"
              title="Bold (**text**)"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => applyFormatting('*', '*', 'italic text')}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-slate-200/70 hover:text-slate-900"
              title="Italic (*text*)"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>

            <div className="mx-0.5 h-4 w-px bg-slate-200" />

            <button
              type="button"
              onClick={handleInsertBullet}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-slate-200/70 hover:text-slate-900"
              title="Bullet list (• item)"
            >
              <List className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleInsertNumbered}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-slate-200/70 hover:text-slate-900"
              title="Numbered list (1. item)"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>

            <div className="mx-0.5 h-4 w-px bg-slate-200" />

            <button
              type="button"
              onClick={() => applyFormatting('`', '`', 'code')}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-slate-200/70 hover:text-slate-900"
              title="Code / Tech tag (`name`)"
            >
              <Code className="h-3.5 w-3.5" />
            </button>

            <span className="ml-auto hidden text-[10.5px] font-medium text-slate-400 sm:inline">
              Markdown supported
            </span>
          </div>

          {/* Native Textarea */}
          <textarea
            ref={(node) => {
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
              internalRef.current = node;
            }}
            id={textareaId}
            value={value}
            onChange={onChange}
            className={cn(
              'min-h-[120px] w-full resize-y border-none bg-transparent px-3.5 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none',
              className,
            )}
            {...props}
          />
        </div>

        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  },
);

FormattedTextarea.displayName = 'FormattedTextarea';
export default FormattedTextarea;
