'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobStickyNavProps {
  job: JobDetail;
  onApply: () => void;
}

const NAV_TABS = [
  { id: 'job-description', label: 'Mô tả công việc' },
  { id: 'job-requirements', label: 'Yêu cầu ứng viên' },
  { id: 'job-benefits', label: 'Quyền lợi ứng viên' },
  { id: 'job-location', label: 'Địa điểm & Thời gian' },
  { id: 'job-company', label: 'Thông tin công ty' },
  { id: 'job-related', label: 'Việc làm liên quan' },
];

export default function JobStickyNav({ job, onApply }: JobStickyNavProps) {
  const [activeTab, setActiveTab] = useState('job-description');
  const [showCompactBar, setShowCompactBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past hero card (around 320px)
      if (window.scrollY > 340) {
        setShowCompactBar(true);
      } else {
        setShowCompactBar(false);
      }

      // Check current section in viewport
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
      const yOffset = -140; // Offset for sticky header + nav
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-17.5 z-40 border-b border-slate-200 bg-white/95 shadow-xs backdrop-blur-md transition-all">
      <div className="container-topcv flex items-center justify-between gap-4 py-2">
        {/* Navigation Tabs */}
        <div className="flex scrollbar-none items-center gap-1 overflow-x-auto py-1">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`shrink-0 cursor-pointer rounded-lg px-3.5 py-1.5 text-[13.5px] font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-[#00b14f] shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Compact Right CTA (visible on scroll) */}
        {showCompactBar && (
          <div className="animate-in fade-in hidden shrink-0 items-center gap-3 duration-200 md:flex">
            <div className="text-right">
              <div className="line-clamp-1 max-w-50 text-xs font-bold text-slate-800 lg:max-w-70">{job.title}</div>
              <div className="text-[11.5px] font-black text-[#00873c]">{job.salary.display}</div>
            </div>

            <button
              type="button"
              onClick={onApply}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#00b14f] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#009643] active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Ứng tuyển ngay</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
