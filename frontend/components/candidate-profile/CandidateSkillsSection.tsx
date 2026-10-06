'use client';

import { useState } from 'react';
import { Cpu } from 'lucide-react';
import type { CandidateSkill } from '@/types/candidate';

interface CandidateSkillsSectionProps {
  skills: CandidateSkill[];
  isOwner?: boolean;
  onEditSkills?: () => void;
}

export default function CandidateSkillsSection({ skills, isOwner = true, onEditSkills }: CandidateSkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'ai' | 'tool' | 'soft'>('all');

  const filteredSkills = activeTab === 'all' ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#263a4d] sm:text-xl">Kỹ năng chuyên môn</h2>
              <p className="text-[12.5px] text-[#64748b]">Được phân loại theo nhóm chuyên môn và số năm kinh nghiệm</p>
            </div>
          </div>

          {isOwner && onEditSkills && (
            <button
              type="button"
              onClick={onEditSkills}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e9eaec] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#00b14f] transition-all hover:border-[#00b14f] hover:bg-[#f2fbf6]"
            >
              <span>+ Chỉnh sửa kỹ năng</span>
            </button>
          )}
        </div>

        {/* Filter Tabs - Straight unbroken row */}
        <div className="mt-4 flex scrollbar-none items-center overflow-x-auto pb-1">
          <div className="inline-flex items-center gap-1 rounded-xl border border-[#e2e8f0]/80 bg-[#f8fafc] p-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-white font-bold text-[#00b14f] shadow-2xs'
                  : 'text-[#64748b] hover:text-[#263a4d]'
              }`}
            >
              Tất cả ({skills.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('core')}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                activeTab === 'core'
                  ? 'bg-white font-bold text-[#00b14f] shadow-2xs'
                  : 'text-[#64748b] hover:text-[#263a4d]'
              }`}
            >
              Kỹ thuật cốt lõi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                activeTab === 'ai'
                  ? 'bg-white font-bold text-[#00b14f] shadow-2xs'
                  : 'text-[#64748b] hover:text-[#263a4d]'
              }`}
            >
              AI & LLM
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tool')}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                activeTab === 'tool'
                  ? 'bg-white font-bold text-[#00b14f] shadow-2xs'
                  : 'text-[#64748b] hover:text-[#263a4d]'
              }`}
            >
              Công cụ / DevOps
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('soft')}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                activeTab === 'soft'
                  ? 'bg-white font-bold text-[#00b14f] shadow-2xs'
                  : 'text-[#64748b] hover:text-[#263a4d]'
              }`}
            >
              Kỹ năng mềm
            </button>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((sk, idx) => (
          <div
            key={idx}
            className="group flex min-h-19 flex-col justify-between rounded-xl border border-[#e9eaec] bg-[#fbfcfd] p-3.5 transition-all duration-150 hover:border-[#00b14f] hover:bg-white hover:shadow-2xs"
          >
            <div className="text-[13.5px] leading-snug font-semibold text-[#1e293b] transition-colors group-hover:text-[#00b14f]">
              {sk.name}
            </div>
            <div className="mt-2 text-[12px] text-[#64748b]">{sk.years} năm kinh nghiệm</div>
          </div>
        ))}
      </div>
    </div>
  );
}
