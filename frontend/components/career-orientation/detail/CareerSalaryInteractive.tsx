'use client';

import React, { useState } from 'react';
import { CareerSalaryTier } from '@/types/career';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';
import { Banknote, Award, Briefcase } from 'lucide-react';

interface CareerSalaryInteractiveProps {
  salaryTiers: CareerSalaryTier[];
}

export default function CareerSalaryInteractive({ salaryTiers }: CareerSalaryInteractiveProps) {
  const [activeTierIndex, setActiveTierIndex] = useState(1);

  if (!salaryTiers || salaryTiers.length === 0) return null;

  const {
    badge,
    title,
    description,
    expLevelTitle,
    expRequiredTitle,
    avgIncomeTitle,
    bonusTitle,
    coreDescTitle,
    popularRolesTitle,
  } = CAREER_ORIENTATION_MESSAGES.salaryInteractive;

  const currentTier = salaryTiers[activeTierIndex];

  return (
    <div className="border-primary/30 bg-primary-light my-8 rounded-3xl border p-6 shadow-xs sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="text-primary bg-primary-container mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <Banknote className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
          <h3 className="text-on-surface text-xl font-bold sm:text-2xl">{title}</h3>
          <p className="text-on-surface-variant mt-1 text-xs sm:text-sm">{description}</p>
        </div>
      </div>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
        {salaryTiers.map((tier, idx) => {
          const isSelected = activeTierIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTierIndex(idx)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                isSelected
                  ? 'bg-primary shadow-primary/25 shadow-elevation-1 scale-102 text-white'
                  : 'hover:border-primary hover:text-primary text-on-surface-variant border border-gray-200 bg-white'
              }`}
            >
              {tier.level.split('(')[0].trim()}
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center">
          <div>
            <span className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
              {expLevelTitle}
            </span>
            <h4 className="text-on-surface mt-0.5 text-lg font-bold sm:text-xl">{currentTier.level}</h4>
            <div className="text-on-surface-variant mt-2 inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium">
              <Briefcase className="text-primary h-3.5 w-3.5" />
              <span>
                {expRequiredTitle} <strong>{currentTier.experience}</strong>
              </span>
            </div>
          </div>

          <div className="bg-primary-light rounded-2xl border border-emerald-200/80 p-4 text-center md:min-w-64">
            <span className="text-on-surface-variant text-xs font-medium">{avgIncomeTitle}</span>
            <div className="text-primary mt-1 text-xl font-bold sm:text-2xl">{currentTier.range}</div>
            <span className="text-label-sm text-on-surface-variant mt-0.5 block">{bonusTitle}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <h5 className="text-navy mb-2 text-xs font-bold tracking-wider uppercase">{coreDescTitle}</h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">{currentTier.description}</p>
          </div>

          <div>
            <h5 className="text-navy mb-2 text-xs font-bold tracking-wider uppercase">{popularRolesTitle}</h5>
            <div className="flex flex-wrap gap-2">
              {currentTier.popularRoles.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="text-primary bg-primary-light inline-flex items-center gap-1 rounded-lg border border-emerald-200/60 px-2.5 py-1 text-xs font-medium"
                >
                  <Award className="h-3 w-3" />
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
