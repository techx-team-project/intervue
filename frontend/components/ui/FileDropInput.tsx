'use client';

import { FileText, UploadCloud } from 'lucide-react';
import { useId, useRef } from 'react';

export interface FileDropInputProps {
  label?: string;
  accept?: string;
  helperText?: string;
  onFileSelected: (file: File) => void;
  selectedFileName?: string;
}

export function FileDropInput({
  label,
  accept = '.pdf,.doc,.docx',
  helperText,
  onFileSelected,
  selectedFileName,
}: FileDropInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-on-surface block text-sm font-semibold">
          {label}
        </label>
      )}

      <input ref={inputRef} id={inputId} type="file" accept={accept} onChange={handleChange} className="sr-only" />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border-outline bg-surface-container-low flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/50"
      >
        {selectedFileName ? (
          <>
            <FileText className="text-primary h-6 w-6" />
            <span className="text-on-surface text-sm font-semibold">{selectedFileName}</span>
            <span className="text-on-surface-variant text-xs">Click to choose another file</span>
          </>
        ) : (
          <>
            <UploadCloud className="text-outline h-6 w-6" />
            <span className="text-on-surface text-sm font-semibold">Choose a JD file to upload</span>
            <span className="text-on-surface-variant text-xs">Supports PDF, DOC, DOCX</span>
          </>
        )}
      </button>

      {helperText && <p className="text-on-surface-variant text-xs">{helperText}</p>}
    </div>
  );
}

export default FileDropInput;
