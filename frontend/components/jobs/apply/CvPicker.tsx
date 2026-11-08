'use client';

import { Button } from '@/components/ui/Button';
import { MAX_RESUMES } from '@/constants/candidate-application';
import { useCandidateCvMutations } from '@/hooks/useCandidateCvs';
import { cn } from '@/lib/utils';
import type { CandidateResume } from '@/types/candidate-application';
import { getErrorMessage } from '@/utils/error';
import { FileText, Upload } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

interface CvPickerProps {
  resumes: CandidateResume[];
  value?: number;
  onChange: (resumeId: number) => void;
}

export default function CvPicker({ resumes, value, onChange }: CvPickerProps) {
  const { upload } = useCandidateCvMutations();
  const inputRef = useRef<HTMLInputElement>(null);
  const canUpload = resumes.length < MAX_RESUMES;

  const handleFile = (file?: File) => {
    if (!file) return;
    upload.mutate(file, {
      onSuccess: (created) => {
        onChange(created.id);
        toast.success('CV uploaded.');
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">CV for this application</span>
        {canUpload && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={upload.isPending}
            leftIcon={<Upload className="h-3.5 w-3.5" />}
            onClick={() => inputRef.current?.click()}
          >
            Upload a new CV
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          aria-label="Choose a PDF CV file"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>

      {resumes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-center text-xs text-slate-500">
          You do not have a CV yet. Upload a PDF file (max 5 MB) to apply.
        </p>
      ) : (
        <ul role="radiogroup" aria-label="Choose a CV" className="space-y-2">
          {resumes.map((resume) => (
            <li key={resume.id}>
              <button
                type="button"
                role="radio"
                aria-checked={value === resume.id}
                onClick={() => onChange(resume.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors',
                  value === resume.id
                    ? 'border-emerald-600 bg-emerald-50/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50',
                )}
              >
                <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{resume.fileName}</span>
                {resume.isDefault && (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Default
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
