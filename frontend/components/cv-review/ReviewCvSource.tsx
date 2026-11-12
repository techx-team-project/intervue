'use client';

import { BYTES_PER_KB, CV_SOURCE_OPTIONS, type CvSource } from '@/constants/cv-review';
import { cn } from '@/lib/utils';
import type { CandidateResume } from '@/types/candidate-application';
import { Check, FileText, UploadCloud } from 'lucide-react';
import { useRef, type ChangeEvent, type DragEvent } from 'react';

type ReviewCvSourceProps = {
  source: CvSource;
  onSourceChange: (source: CvSource) => void;
  resumes: CandidateResume[];
  selectedResumeId: number | null;
  onResumeSelect: (id: number) => void;
  file: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (event: DragEvent<HTMLDivElement>) => void;
  text: string;
  onTextChange: (text: string) => void;
};

export default function ReviewCvSource({
  source,
  onSourceChange,
  resumes,
  selectedResumeId,
  onResumeSelect,
  file,
  onFileChange,
  onFileDrop,
  text,
  onTextChange,
}: ReviewCvSourceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const options = CV_SOURCE_OPTIONS.filter((option) => option.value !== 'resume' || resumes.length > 0);

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="CV source" className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={source === option.value}
            onClick={() => onSourceChange(option.value)}
            className={cn(
              'text-label-lg ease-standard h-9 cursor-pointer rounded-full border px-4 font-semibold transition-colors duration-150',
              source === option.value
                ? 'border-primary bg-primary text-on-primary'
                : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary',
            )}
          >
            {option.label}
            {option.value === 'resume' && ` (${resumes.length})`}
          </button>
        ))}
      </div>

      {source === 'resume' && (
        <ul className="space-y-2">
          {resumes.map((resume) => {
            const isSelected = selectedResumeId === resume.id;
            return (
              <li key={resume.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onResumeSelect(resume.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                    isSelected ? 'border-primary bg-primary-light' : 'border-outline-variant hover:border-primary/60',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <FileText className="text-primary h-5 w-5 shrink-0" aria-hidden />
                    <span className="min-w-0">
                      <span className="text-body-md text-on-surface block truncate font-semibold">
                        {resume.fileName}
                      </span>
                      <span className="text-label-md text-on-surface-variant block">
                        {resume.fileSizeBytes ? `${Math.round(resume.fileSizeBytes / BYTES_PER_KB)} KB` : ''}
                        {resume.isDefault && ' · Default CV'}
                      </span>
                    </span>
                  </span>
                  {isSelected && <Check className="text-primary h-4 w-4 shrink-0" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {source === 'upload' && (
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={onFileDrop}
          className={cn(
            'rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
            file ? 'border-primary bg-primary-light' : 'border-outline hover:border-primary',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            className="sr-only"
            aria-label="Upload a PDF CV"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mx-auto flex cursor-pointer flex-col items-center gap-2"
          >
            <span className="bg-surface-container-low text-on-surface-variant flex h-12 w-12 items-center justify-center rounded-full">
              {file ? <FileText className="text-primary h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
            </span>
            <span className="text-body-lg text-on-surface font-semibold">
              {file ? file.name : 'Drop your CV here or click to browse'}
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {file
                ? `${Math.round(file.size / BYTES_PER_KB)} KB · click to choose another file`
                : 'PDF only, up to 10 MB'}
            </span>
          </button>
        </div>
      )}

      {source === 'text' && (
        <textarea
          rows={9}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          aria-label="CV text"
          placeholder="Paste the full text of your CV: experience, skills, education, projects…"
          className="text-body-md text-on-surface placeholder:text-on-surface-variant border-outline hover:border-on-surface-variant/60 focus:border-primary w-full rounded-2xl border bg-white p-4 leading-relaxed transition-colors outline-none focus:ring-2 focus:ring-emerald-600/15"
        />
      )}
    </div>
  );
}
