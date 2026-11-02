'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Check, Copy, FileCheck2, HelpCircle, ListCheck, Sparkles, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface JobAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<JobPostFormData>;
  onApplied: () => void;
}

type AiMode = 'full' | 'description' | 'requirements' | 'benefits' | 'screening';

interface AiPresetContent {
  description?: string;
  requirements?: string;
  benefits?: string;
  screeningQuestions?: JobPostFormData['screeningQuestions'];
}

export default function JobAiAssistantModal({ isOpen, onClose, form, onApplied }: JobAiAssistantModalProps) {
  const [selectedMode, setSelectedMode] = useState<AiMode>('full');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedData, setGeneratedData] = useState<AiPresetContent | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const title = form.getValues('title') || 'Software Engineer';
  const level = form.getValues('level') || 'MID';
  const skills = form.getValues('skills') || [];

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedText('');
    setGeneratedData(null);

    const skillsStr = skills.length > 0 ? skills.join(', ') : 'modern tech stack';

    const contentData: AiPresetContent = {};
    let fullPreview = '';

    if (selectedMode === 'full' || selectedMode === 'description') {
      contentData.description = `We are looking for a skilled ${level} ${title} to join our growing product team. In this role, you will play a key part in designing, building, and deploying scalable software services.\n\n• Collaborate with cross-functional teams (Product, Design, QA) to define and ship new features\n• Write clean, maintainable, and high-performance code adhering to best practices\n• Participate in code reviews, architectural discussions, and technical mentoring\n• Troubleshoot, benchmark, and optimize performance across our backend and frontend systems.`;
    }

    if (selectedMode === 'full' || selectedMode === 'requirements') {
      contentData.requirements = `• Demonstrated experience in ${skillsStr} with a strong foundation in software engineering principles\n• Solid understanding of system architecture, RESTful/gRPC APIs, and database design\n• Familiarity with modern CI/CD workflows, automated testing, and agile methodologies\n• Proactive problem-solver with strong communication and collaborative teamwork abilities\n• Experience in high-traffic or cloud environments is a strong plus.`;
    }

    if (selectedMode === 'full' || selectedMode === 'benefits') {
      contentData.benefits = `• Competitive salary package with 13th-month bonus and annual performance reviews\n• Premium healthcare insurance (Bao Viet / PTI) for employee and family\n• Modern work equipment (MacBook Pro M3 / Dell XPS + dual 4K monitors)\n• Flexible hybrid working model with generous annual leave policy (15+ days)\n• Annual company trip, quarterly team-building budgets, and continuous tech learning stipends.`;
    }

    if (selectedMode === 'full' || selectedMode === 'screening') {
      contentData.screeningQuestions = [
        {
          id: `sq-${Date.now()}-1`,
          question: `How many years of professional experience do you have with ${skills[0] || 'core technologies'}?`,
          required: true,
          type: 'TEXT',
          options: [],
        },
        {
          id: `sq-${Date.now()}-2`,
          question: 'Are you available to join within 30 days?',
          required: false,
          type: 'YES_NO',
          options: [],
        },
      ];
    }

    // Combine preview text
    if (selectedMode === 'full') {
      fullPreview = `### Job Description\n${contentData.description}\n\n### Candidate Requirements\n${contentData.requirements}\n\n### Benefits & Perks\n${contentData.benefits}\n\n### Screening Questions (${contentData.screeningQuestions?.length} items)`;
    } else if (selectedMode === 'description') {
      fullPreview = contentData.description || '';
    } else if (selectedMode === 'requirements') {
      fullPreview = contentData.requirements || '';
    } else if (selectedMode === 'benefits') {
      fullPreview = contentData.benefits || '';
    } else if (selectedMode === 'screening') {
      fullPreview =
        contentData.screeningQuestions?.map((q, i) => `${i + 1}. ${q.question} (${q.type})`).join('\n') || '';
    }

    // Simulate progressive streaming
    let currentIdx = 0;
    const step = 6;
    timerRef.current = setInterval(() => {
      currentIdx += step;
      if (currentIdx >= fullPreview.length) {
        setGeneratedText(fullPreview);
        setGeneratedData(contentData);
        setIsGenerating(false);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setGeneratedText(fullPreview.substring(0, currentIdx));
      }
    }, 20);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleApplyToForm = () => {
    if (!generatedData) return;

    if (generatedData.description) {
      form.setValue('description', generatedData.description, { shouldValidate: true, shouldDirty: true });
    }
    if (generatedData.requirements) {
      form.setValue('requirements', generatedData.requirements, { shouldValidate: true, shouldDirty: true });
    }
    if (generatedData.benefits) {
      form.setValue('benefits', generatedData.benefits, { shouldValidate: true, shouldDirty: true });
    }
    if (generatedData.screeningQuestions && generatedData.screeningQuestions.length > 0) {
      const existing = form.getValues('screeningQuestions') || [];
      form.setValue('screeningQuestions', [...existing, ...generatedData.screeningQuestions], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    toast.success('AI content applied to your job post!');
    onApplied();
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setHasCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" title="InterVue AI Assistant">
      <div className="space-y-4">
        {/* Context bar */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <div>
              <span className="font-bold text-emerald-950">Target role: </span>
              <span className="font-semibold text-emerald-800">{title}</span>
              <span className="text-emerald-700"> ({level})</span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-emerald-700">{skills.length} skills tracked</span>
        </div>

        {/* Generation Presets */}
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">Select task</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setSelectedMode('full')}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                selectedMode === 'full'
                  ? 'border-emerald-600 bg-emerald-50/50 font-bold text-emerald-800 ring-1 ring-emerald-500'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-xs">Full JD Package</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('description')}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                selectedMode === 'description'
                  ? 'border-emerald-600 bg-emerald-50/50 font-bold text-emerald-800 ring-1 ring-emerald-500'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <FileCheck2 className="h-4 w-4 text-blue-600" />
              <span className="text-xs">Description only</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('requirements')}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                selectedMode === 'requirements'
                  ? 'border-emerald-600 bg-emerald-50/50 font-bold text-emerald-800 ring-1 ring-emerald-500'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <ListCheck className="h-4 w-4 text-purple-600" />
              <span className="text-xs">Requirements</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('screening')}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                selectedMode === 'screening'
                  ? 'border-emerald-600 bg-emerald-50/50 font-bold text-emerald-800 ring-1 ring-emerald-500'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <HelpCircle className="h-4 w-4 text-amber-600" />
              <span className="text-xs">Screening Qs</span>
            </button>
          </div>
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Additional instructions (Optional)</label>
          <input
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Focus on fintech security, 3+ years in microservices..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            isLoading={isGenerating}
            leftIcon={<Sparkles className="h-3.5 w-3.5" />}
          >
            {generatedText ? 'Regenerate draft' : 'Generate with AI'}
          </Button>
        </div>

        {/* Result Area */}
        {generatedText && (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide text-slate-700 uppercase">Generated Draft</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{hasCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 font-sans text-xs leading-relaxed whitespace-pre-wrap text-slate-800">
              {generatedText}
              {isGenerating && <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-emerald-600" />}
            </pre>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isGenerating || !generatedData}
                onClick={handleApplyToForm}
                leftIcon={<Check className="h-3.5 w-3.5" />}
              >
                Insert into form
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
