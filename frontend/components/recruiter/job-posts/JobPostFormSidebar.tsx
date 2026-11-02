'use client';

import Button from '@/components/ui/Button';
import type { JobPostFormData } from '@/schemas/job.schema';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck,
  FileText,
  HelpCircle,
  Save,
  SendHorizontal,
  Sparkles,
  Wallet,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface JobPostFormSidebarProps {
  form: UseFormReturn<JobPostFormData>;
  mode: 'create' | 'edit';
  isSaving: boolean;
  onPreview: () => void;
  onSaveDraft: () => void;
  onSubmitForReview: () => void;
  onOpenAiAssistant?: () => void;
}

export default function JobPostFormSidebar({
  form,
  mode,
  isSaving,
  onPreview,
  onSaveDraft,
  onSubmitForReview,
  onOpenAiAssistant,
}: JobPostFormSidebarProps) {
  const { control } = form;

  // Watch form values for real-time score calculation
  const titleWatch = useWatch({ control, name: 'title' });
  const levelWatch = useWatch({ control, name: 'level' });
  const cityWatch = useWatch({ control, name: 'location.city' });
  const skillsWatch = useWatch({ control, name: 'skills' });
  const salaryNegotiableWatch = useWatch({ control, name: 'salary.negotiable' });
  const salaryMinWatch = useWatch({ control, name: 'salary.min' });
  const salaryMaxWatch = useWatch({ control, name: 'salary.max' });
  const descriptionWatch = useWatch({ control, name: 'description' });
  const requirementsWatch = useWatch({ control, name: 'requirements' });
  const screeningQuestionsWatch = useWatch({ control, name: 'screeningQuestions' });

  const { score, checks } = useMemo(() => {
    const title = titleWatch || '';
    const city = cityWatch || '';
    const level = levelWatch;
    const skills = skillsWatch || [];
    const salaryNegotiable = salaryNegotiableWatch;
    const salaryMin = salaryMinWatch;
    const salaryMax = salaryMaxWatch;
    const description = descriptionWatch || '';
    const requirements = requirementsWatch || '';
    const screeningQuestions = screeningQuestionsWatch || [];

    const titleCheck = title.trim().length >= 5;
    const locationCheck = Boolean(city && city.trim());
    const skillsCheck = skills.length >= 3;
    const skillsPartial = skills.length > 0 && skills.length < 3;
    const salaryCheck = salaryNegotiable || (Number(salaryMin) > 0 && Number(salaryMax) > 0);
    const descCheck = description.trim().length >= 80;
    const reqCheck = requirements.trim().length >= 80;
    const screeningCheck = screeningQuestions.length >= 1;

    let total = 0;
    if (titleCheck) total += 15;
    if (locationCheck) total += 10;
    if (level) total += 10;
    if (skillsCheck) total += 15;
    else if (skillsPartial) total += 8;
    if (salaryCheck) total += 15;
    if (descCheck) total += 15;
    if (reqCheck) total += 15;
    if (screeningCheck) total += 5;

    return {
      score: Math.min(100, total),
      checks: [
        { label: 'Clear job title (≥ 5 chars)', passed: titleCheck, weight: 15 },
        { label: 'Location & working level set', passed: locationCheck && Boolean(level), weight: 20 },
        { label: 'At least 3 core tech skills', passed: skillsCheck, weight: 15, hint: `${skills.length}/3 added` },
        { label: 'Specific salary range set', passed: salaryCheck, weight: 15, hint: '+30% applications' },
        { label: 'Detailed role description (≥ 80 chars)', passed: descCheck, weight: 15 },
        { label: 'Specific requirements (≥ 80 chars)', passed: reqCheck, weight: 15 },
        { label: 'Screening questions added', passed: screeningCheck, weight: 5, optional: true },
      ],
    };
  }, [
    titleWatch,
    cityWatch,
    levelWatch,
    skillsWatch,
    salaryNegotiableWatch,
    salaryMinWatch,
    salaryMaxWatch,
    descriptionWatch,
    requirementsWatch,
    screeningQuestionsWatch,
  ]);

  const scoreBadge = useMemo(() => {
    if (score >= 80)
      return { label: 'Excellent quality', color: 'text-emerald-700 bg-emerald-100', bar: 'bg-emerald-500' };
    if (score >= 50) return { label: 'Good start', color: 'text-amber-800 bg-amber-100', bar: 'bg-amber-500' };
    return { label: 'Needs more info', color: 'text-rose-700 bg-rose-100', bar: 'bg-rose-500' };
  }, [score]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="space-y-4">
      {/* 1. Completeness Score Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">JD Completeness</h3>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${scoreBadge.color}`}>
            {scoreBadge.label}
          </span>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-navy text-2xl font-black">{score}%</span>
            <span className="text-xs text-slate-400">100% target</span>
          </div>

          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scoreBadge.bar}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
          {checks.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {item.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                )}
                <span className={item.passed ? 'font-medium text-slate-700' : 'text-slate-500'}>{item.label}</span>
              </div>
              {item.hint && (
                <span className="py-0.2 rounded bg-emerald-50 px-1.5 text-[10.5px] font-semibold text-emerald-700">
                  {item.hint}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* AI Assist button */}
        {onOpenAiAssistant && (
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 py-2.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100/70"
          >
            <Sparkles className="h-4 w-4" />
            <span>Smart AI Assistant</span>
          </button>
        )}
      </div>

      {/* 2. Jump to Section Navigator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <h4 className="px-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Table of Contents</h4>
        <nav className="mt-2 space-y-1">
          <button
            type="button"
            onClick={() => scrollToSection('section-basic')}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              1. Basic information
            </span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('section-compensation')}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700"
          >
            <span className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5 text-slate-400" />
              2. Compensation
            </span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('section-description')}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700"
          >
            <span className="flex items-center gap-2">
              <FileCheck className="h-3.5 w-3.5 text-slate-400" />
              3. Description & Benefits
            </span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('section-screening')}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              4. Screening questions
            </span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </button>
        </nav>
      </div>

      {/* 3. Action Buttons Card */}
      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={onPreview}
        >
          Preview candidate view
        </Button>

        <Button
          type="button"
          variant="secondary"
          isLoading={isSaving}
          className="w-full justify-center"
          leftIcon={<Save className="h-4 w-4" />}
          onClick={onSaveDraft}
        >
          Save as draft
        </Button>

        <Button
          type="button"
          isLoading={isSaving}
          className="w-full justify-center font-bold"
          leftIcon={<SendHorizontal className="h-4 w-4" />}
          onClick={onSubmitForReview}
        >
          {mode === 'create' ? 'Submit for review' : 'Update & submit'}
        </Button>
      </div>
    </aside>
  );
}
