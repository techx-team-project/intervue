'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobStickyNavProps {
  job: JobDetail;
  onApply: () => void;
}

const NAV_TABS = [
  { id: 'job-description', label: 'Job description' },
  { id: 'job-requirements', label: 'Candidate requirements' },
  { id: 'job-benefits', label: 'Candidate benefits' },
  { id: 'job-location', label: 'Location & Hours' },
  { id: 'job-company', label: 'Company information' },
  { id: 'job-related', label: 'Related jobs' },
];

export default function JobStickyNav({ job, onApply }: JobStickyNavProps) {
  const [activeTab, setActiveTab] = useState('job-description');
  const [showCompactBar, setShowCompactBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 340) {
        setShowCompactBar(true);
      } else {
        setShowCompactBar(false);
      }

      for (const tab of [...NAV_TABS].reverse()) {
        const el = document.getElementById(tab.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveTab(tab.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="border-outline-variant sticky top-17.5 z-40 border-b bg-white/95 shadow-xs transition">
      <div className="container-page flex items-center justify-between gap-4 py-2">
        <div className="flex scrollbar-none items-center gap-1 overflow-x-auto py-1">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`text-body-md shrink-0 cursor-pointer rounded-lg px-3.5 py-1.5 font-bold transition ${
                  isActive
                    ? 'text-primary bg-primary-light shadow-2xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {showCompactBar && (
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <div className="text-right">
              <div className="text-on-surface line-clamp-1 max-w-50 text-xs font-bold lg:max-w-70">{job.title}</div>
              <div className="text-label-sm text-primary font-bold">{job.salary.display}</div>
            </div>

            <button
              type="button"
              onClick={onApply}
              className="bg-primary hover:bg-primary-hover flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Apply now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
