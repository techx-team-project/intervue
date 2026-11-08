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
    <div className="border-outline-variant shadow-elevation-2 overflow-hidden rounded-3xl border bg-white">
      <div className="bg-primary-deeper p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-blue-400/30">
                Interactive Checklist
              </span>
              <span className="text-primary text-xs">
                {completedCount}/{totalCount} completed
              </span>
            </div>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Interview Success Preparation Checklist
            </h3>
            <p className="text-primary/80 mt-1 text-xs">
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
          <div className="text-primary flex justify-between text-xs font-medium">
            <span>Readiness Score</span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="bg-primary/40 mt-2 h-2.5 w-full overflow-hidden rounded-full">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
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
                    ? 'border-primary/30 bg-emerald-50/50 shadow-xs'
                    : 'hover:border-outline-variant hover:bg-primary-light/20 border-gray-200 bg-white'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle className="text-primary h-5 w-5" />
                  ) : (
                    <Square className="group-hover:text-primary h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold transition ${
                      isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-on-surface'
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

        <div className="border-outline-variant bg-primary-light/40 mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:p-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-on-primary-container text-sm font-bold">Need an ATS-standard resume?</h5>
              <p className="text-on-primary-container text-xs">
                Explore our curated collection of professional tech templates favored by top recruiters.
              </p>
            </div>
          </div>

          <Link
            href="/cv-templates"
            className="bg-primary shadow-elevation-1 hover:bg-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition"
          >
            Create Resume Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
