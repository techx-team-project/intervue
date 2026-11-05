'use client';

import { LANGUAGE_PROFICIENCY_OPTIONS, optionLabel } from '@/constants/candidate-profile';
import type { CandidateLanguage } from '@/types/candidate-profile';
import { Languages } from 'lucide-react';
import CandidateLanguageForm from './CandidateLanguageForm';
import CandidateSectionManager from './CandidateSectionManager';

type CandidateLanguageSectionProps = {
  items: CandidateLanguage[];
};

export default function CandidateLanguageSection({ items }: CandidateLanguageSectionProps) {
  return (
    <CandidateSectionManager
      section="languages"
      title="Languages"
      icon={Languages}
      addLabel="Add language"
      emptyText="List the languages you speak."
      itemNoun="language"
      items={items}
      getName={(item) => item.language}
      renderForm={(props) => <CandidateLanguageForm {...props} />}
      renderItem={(item) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-navy text-base font-bold wrap-break-word">{item.language}</h3>
          <span className="text-xs text-slate-500">
            {optionLabel(LANGUAGE_PROFICIENCY_OPTIONS, item.proficiency)}
            {item.certificate ? ` | ${item.certificate}` : ''}
          </span>
        </div>
      )}
    />
  );
}
