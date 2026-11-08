'use client';

import type { CandidateEducation } from '@/types/candidate-profile';
import { formatYearRange } from '@/utils/candidate-dates';
import { GraduationCap } from 'lucide-react';
import CandidateEducationForm from './CandidateEducationForm';
import CandidateItemText from './CandidateItemText';
import CandidateSectionManager from './CandidateSectionManager';

type CandidateEducationSectionProps = {
  items: CandidateEducation[];
};

export default function CandidateEducationSection({ items }: CandidateEducationSectionProps) {
  return (
    <CandidateSectionManager
      section="educations"
      title="Education"
      icon={GraduationCap}
      addLabel="Add education"
      emptyText="Add your schools and degrees here."
      itemNoun="education"
      items={items}
      getName={(item) => item.school}
      renderForm={(props) => <CandidateEducationForm {...props} />}
      renderItem={(item) => (
        <>
          <h3 className="text-navy text-base font-bold wrap-break-word">{item.school}</h3>
          {(item.degree || item.major) && (
            <p className="text-on-surface text-sm font-semibold wrap-break-word">
              {[item.degree, item.major].filter(Boolean).join(' - ')}
            </p>
          )}
          <p className="text-on-surface-variant text-xs">
            {formatYearRange(item.startYear, item.endYear)}
            {item.gpa ? ` | GPA ${item.gpa}` : ''}
          </p>
          <CandidateItemText label="Achievements" text={item.achievements} />
        </>
      )}
    />
  );
}
