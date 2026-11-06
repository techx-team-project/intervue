'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Square, RotateCcw, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface ChecklistItem {
  id: string;
  stage: 'before' | 'day_of' | 'during' | 'after';
  label: string;
  desc: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'res-company',
    stage: 'before',
    label: 'Research Company Culture & Tech Stack',
    desc: 'Review website, recent press releases, GitHub repositories, and team engineering blogs.',
  },
  {
    id: 'res-star',
    stage: 'before',
    label: 'Prepare 3 STAR Technique Stories',
    desc: 'Craft quantifiable case studies: Situation, Task, Action, Result highlighting business impact.',
  },
  {
    id: 'res-cv-print',
    stage: 'before',
    label: 'Prepare Updated Resumes & Portfolio Links',
    desc: 'Keep hard copies or quick links ready for panel interviewers and hiring managers.',
  },
  {
    id: 'res-questions',
    stage: 'before',
    label: 'Prepare 3-5 Insightful Questions',
    desc: 'Ask about 90-day deliverables, technical architecture hurdles, and engineering team autonomy.',
  },
  {
    id: 'day-clothes',
    stage: 'day_of',
    label: 'Professional Attire & Audio-Video Setup',
    desc: 'Dress for the occasion, verify microphone, camera lighting, and silent workspace background.',
  },
  {
    id: 'day-early',
    stage: 'day_of',
    label: 'Join or Arrive 10-15 Minutes Early',
    desc: 'Test your connection or settle into the waiting lobby with calm breathing and quick notes review.',
  },
  {
    id: 'dur-eye',
    stage: 'during',
    label: 'Maintain Eye Contact & Confident Tone',
    desc: 'Actively listen to interviewer prompts, pause thoughtfully before delivering structured answers.',
  },
  {
    id: 'dur-truth',
    stage: 'during',
    label: 'Honest & Positive Responses',
    desc: 'Own your experience boundaries authentically; never disparage past employers or team members.',
  },
  {
    id: 'aft-thanks',
    stage: 'after',
    label: 'Send Thoughtful Thank-You Note Within 24h',
    desc: 'Express gratitude for the interview time and reaffirm enthusiasm with reference to a discussed topic.',
  },
];

const DEFAULT_CHECKED = ['res-company', 'res-star'];

export default function InterviewPrepChecklist() {
  const user = useAuthStore((state) => state.candidate.user || state.user);
  const storageKey = user?.id ? `intervue_interview_checklist_user_${user.id}` : 'intervue_interview_checklist_guest';

  const [checkedIds, setCheckedIds] = useState<string[]>(DEFAULT_CHECKED);

  // Load persisted checklist state asynchronously on client mount to preserve SSR hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCheckedIds(parsed);
          }
        }
      } catch {
        // Fallback to default state if localStorage is unavailable
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [storageKey]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Ignore localStorage quota errors
      }
      return next;
    });
  };

  const handleReset = () => {
    setCheckedIds([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  };

  const completedCount = checkedIds.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-xl">
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-200 ring-1 ring-blue-400/30">
                Interactive Checklist
              </span>
              <span className="text-xs text-blue-200">
                {completedCount}/{totalCount} completed
              </span>
            </div>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Interview Success Preparation Checklist
            </h3>
            <p className="mt-1 text-xs text-blue-100/80">
              Check off milestones to ensure you are 100% prepared and confident before meeting employers.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 self-start rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:self-center"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset checklist
          </button>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs font-medium text-blue-100">
            <span>Readiness Score</span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-blue-950/40">
            <div
              className="to-primary h-full bg-linear-to-r from-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition duration-200 ${
                  isChecked
                    ? 'border-emerald-200 bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/20'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle className="text-primary h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-300 group-hover:text-blue-500" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold transition ${
                      isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-[#0f172a]'
                    }`}
                  >
                    {item.label}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:flex-row sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-blue-950">Need an ATS-standard resume?</h5>
              <p className="text-xs text-blue-800">
                Explore our curated collection of professional tech templates favored by top recruiters.
              </p>
            </div>
          </div>

          <Link
            href="/cv-templates"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700"
          >
            Create Resume Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
