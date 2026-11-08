'use client';

import { SKILL_CATEGORY_OPTIONS, SKILL_LEVEL_OPTIONS, optionLabel } from '@/constants/candidate-profile';
import type { CandidateSkill } from '@/types/candidate-profile';
import { Wrench } from 'lucide-react';
import CandidateSectionManager from './CandidateSectionManager';
import CandidateSkillForm from './CandidateSkillForm';

type CandidateSkillSectionProps = {
  items: CandidateSkill[];
};

function formatYears(years: number): string {
  if (years === 0) return 'Less than a year';
  return years === 1 ? '1 year' : `${years} years`;
}

export default function CandidateSkillSection({ items }: CandidateSkillSectionProps) {
  return (
    <CandidateSectionManager
      section="skills"
      title="Skills"
      icon={Wrench}
      addLabel="Add skill"
      emptyText="Showcase your skills here."
      itemNoun="skill"
      items={items}
      getName={(item) => item.name}
      renderForm={(props) => <CandidateSkillForm {...props} />}
      renderItem={(item) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-navy text-base font-bold wrap-break-word">{item.name}</h3>
          <span className="bg-surface-container-high text-on-surface-variant rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {optionLabel(SKILL_CATEGORY_OPTIONS, item.category)}
          </span>
          <span className="text-on-surface-variant text-xs">
            {optionLabel(SKILL_LEVEL_OPTIONS, item.level)} | {formatYears(item.years)}
          </span>
        </div>
      )}
    />
  );
}
