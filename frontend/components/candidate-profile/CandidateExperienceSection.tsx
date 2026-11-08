'use client';

import type { CandidateExperience } from '@/types/candidate-profile';
import { formatDateRange } from '@/utils/candidate-dates';
import { Briefcase } from 'lucide-react';
import CandidateChipList from './CandidateChipList';
import CandidateExperienceForm from './CandidateExperienceForm';
import CandidateItemText from './CandidateItemText';
import CandidateSectionManager from './CandidateSectionManager';

type CandidateExperienceSectionProps = {
  items: CandidateExperience[];
};

export default function CandidateExperienceSection({ items }: CandidateExperienceSectionProps) {
  return (
    <CandidateSectionManager
      section="experiences"
      title="Work experience"
      icon={Briefcase}
      addLabel="Add experience"
      emptyText="Add your work history to show recruiters what you have done."
      itemNoun="work experience"
      items={items}
      getName={(item) => item.title}
      renderForm={(props) => <CandidateExperienceForm {...props} />}
      renderItem={(item) => (
        <>
          <h3 className="text-navy text-base font-bold wrap-break-word">{item.title}</h3>
          <p className="text-on-surface text-sm font-semibold wrap-break-word">
            {item.companyName}
            {item.location ? ` - ${item.location}` : ''}
          </p>
          <p className="text-on-surface-variant text-xs">
            {formatDateRange(item.startDate, item.endDate, item.current, 'Present')}
          </p>
          <CandidateItemText label="Description" text={item.description} />
          <CandidateItemText label="Achievements" text={item.achievements} />
          <CandidateChipList items={item.skills} />
        </>
      )}
    />
  );
}
