'use client';

import { useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useStartMockInterview } from '@/hooks/useAiMockInterview';
import type { MockInterviewDetailResource, MockInterviewFocusArea } from '@/types/ai-mock-interview';
import { isApiError } from '@/lib/api-error';
import { Sparkles, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface MockInterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionStarted: (session: MockInterviewDetailResource) => void;
}

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

const SENIORITY_OPTIONS = ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead'];

const FOCUS_AREAS: { value: MockInterviewFocusArea; label: string; desc: string }[] = [
  {
    value: 'TECHNICAL',
    label: 'Technical Deep-Dive',
    desc: 'In-depth algorithms, language syntax, frameworks & optimization',
  },
  {
    value: 'SYSTEM_DESIGN',
    label: 'System Design & Architecture',
    desc: 'Microservices, distributed database schemas & scalability',
  },
  {
    value: 'BEHAVIORAL',
    label: 'Behavioral & Situational',
    desc: 'Conflict resolution, leadership, project management & teamwork',
  },
  {
    value: 'MIXED',
    label: 'Comprehensive (Mixed)',
    desc: 'Balanced blend of coding, architecture, and real-world behavioral scenarios',
  },
];

export default function MockInterviewSetupModal({ isOpen, onClose, onSessionStarted }: MockInterviewSetupModalProps) {
  const startMutation = useStartMockInterview();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Senior Java Backend Engineer');
  const [seniorityLevel, setSeniorityLevel] = useState('Senior');
  const [focusArea, setFocusArea] = useState<MockInterviewFocusArea>('MIXED');
  const [questionCount, setQuestionCount] = useState(5);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.');
      return;
    }
    if (file.size > MAX_CV_SIZE_BYTES) {
      toast.error('The CV must be 5 MB or smaller.');
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      toast.error('Please enter your target job role');
      return;
    }

    try {
      const session = await startMutation.mutateAsync({
        payload: { targetRole: targetRole.trim(), seniorityLevel, focusArea, questionCount },
        cvFile,
      });
      toast.success('Mock interview started successfully!');
      onClose();
      onSessionStarted(session);
    } catch (error) {
      toast.error(
        isApiError(error) && error.code === 'CV_TEXT_NOT_READABLE'
          ? 'We could not read text from this CV. Please upload a text-based PDF, not a scanned image.'
          : 'Failed to start mock interview. Please try again.',
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-navy font-bold">Configure AI Mock Interview</span>
        </div>
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* CV Upload */}
        <div>
          <label className="text-navy mb-1.5 block text-xs font-bold">1. Upload Your CV (Optional):</label>
          <p className="mb-2 text-[11px] text-slate-500">
            AI reads this CV only for this interview to ask realistic questions. It is not added to your profile.
          </p>

          <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleCvChange} />

          {cvFile ? (
            <div className="border-primary bg-primary/5 flex items-center justify-between rounded-xl border p-2.5 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="text-primary h-4 w-4 shrink-0" />
                <span className="text-navy truncate font-medium">{cvFile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setCvFile(null)}
                aria-label="Remove CV"
                className="shrink-0 rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-3 text-xs font-medium text-slate-600 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Choose a PDF file (max 5 MB)
              </button>
              <p className="mt-1 text-[11px] text-slate-400 italic">
                Without a CV, questions are based on your target role only.
              </p>
            </>
          )}
        </div>

        {/* Target Role & Level */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-8">
            <label className="text-navy mb-1.5 block text-xs font-bold">2. Target Job Role:</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Java Backend Developer"
              className="text-navy focus:border-primary w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-navy mb-1.5 block text-xs font-bold">Seniority Level:</label>
            <select
              value={seniorityLevel}
              onChange={(e) => setSeniorityLevel(e.target.value)}
              className="text-navy focus:border-primary w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
            >
              {SENIORITY_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Focus Area */}
        <div>
          <label className="text-navy mb-1.5 block text-xs font-bold">3. Interview Focus Area:</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FOCUS_AREAS.map((fa) => (
              <button
                key={fa.value}
                type="button"
                onClick={() => setFocusArea(fa.value)}
                className={`flex flex-col rounded-xl border p-2.5 text-left transition-all ${
                  focusArea === fa.value
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-navy text-xs font-bold">{fa.label}</span>
                <span className="mt-0.5 text-[11px] text-slate-500">{fa.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count (5 - 10) */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-navy text-xs font-bold">4. Number of Questions (5 - 10):</label>
            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-bold">
              {questionCount} questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all ${
                  questionCount === num
                    ? 'border-primary bg-primary text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            * Each question may have up to 1 follow-up question if clarification is needed.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={startMutation.isPending}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            Start Interview Now
          </Button>
        </div>
      </form>
    </Modal>
  );
}
