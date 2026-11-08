'use client';

import React from 'react';
import { CareerSpecialization } from '@/types/career';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';
import { Layers, TrendingUp, Check } from 'lucide-react';

interface CareerSpecializationsGridProps {
  specializations: CareerSpecialization[];
}

export default function CareerSpecializationsGrid({ specializations }: CareerSpecializationsGridProps) {
  if (!specializations || specializations.length === 0) return null;

  const { title, description, coreSkillsTitle, commonToolsTitle } = CAREER_ORIENTATION_MESSAGES.specializationsGrid;

  return (
    <div className="my-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="text-primary bg-primary-container flex h-8 w-8 items-center justify-center rounded-lg">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-on-surface text-xl font-bold sm:text-2xl">{title}</h3>
          <p className="text-on-surface-variant mt-0.5 text-xs sm:text-sm">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {specializations.map((spec, idx) => (
          <div
            key={idx}
            className="hover:border-primary/50 hover:shadow-elevation-1 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition duration-200 sm:p-6"
          >
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-on-surface text-base font-bold">{spec.title}</h4>
                <span className="text-primary bg-primary-light text-label-sm rounded-md px-2 py-0.5 font-bold">
                  {spec.avgSalary}
                </span>
              </div>

              <p className="text-on-surface-variant mb-4 text-xs leading-relaxed sm:text-sm">{spec.description}</p>

              <div className="mb-3">
                <span className="text-navy text-label-sm mb-1.5 block font-bold tracking-wider uppercase">
                  {coreSkillsTitle}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {spec.keySkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-navy inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      <Check className="text-primary h-3 w-3" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-navy text-label-sm mb-1.5 block font-bold tracking-wider uppercase">
                  {commonToolsTitle}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {spec.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-primary text-label-sm rounded-md border border-emerald-200/50 bg-emerald-50/60 px-2 py-0.5 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
              <span className="text-primary flex items-center gap-1 font-semibold">
                <TrendingUp className="h-3.5 w-3.5" />
                {spec.growthRate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
