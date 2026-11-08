'use client';

import type { CandidateProject } from '@/types/candidate-profile';
import { formatDateRange } from '@/utils/candidate-dates';
import { FolderGit2 } from 'lucide-react';
import CandidateChipList from './CandidateChipList';
import CandidateItemText from './CandidateItemText';
import CandidateProjectForm from './CandidateProjectForm';
import CandidateSectionManager from './CandidateSectionManager';

type CandidateProjectSectionProps = {
  items: CandidateProject[];
};

const LINK_CLASS = 'text-primary text-xs font-semibold hover:underline';

export default function CandidateProjectSection({ items }: CandidateProjectSectionProps) {
  return (
    <CandidateSectionManager
      section="projects"
      title="Projects"
      icon={FolderGit2}
      addLabel="Add project"
      emptyText="Highlight your best projects here."
      itemNoun="project"
      items={items}
      getName={(item) => item.name}
      renderForm={(props) => <CandidateProjectForm {...props} />}
      renderItem={(item) => (
        <>
          <h3 className="text-navy text-base font-bold wrap-break-word">{item.name}</h3>
          {item.role && <p className="text-on-surface text-sm font-semibold wrap-break-word">{item.role}</p>}
          <p className="text-on-surface-variant text-xs">
            {formatDateRange(item.startDate, item.endDate, item.current, 'Ongoing')}
          </p>
          <CandidateItemText label="Description" text={item.description} />
          <CandidateItemText label="Highlights" text={item.highlights} />
          <CandidateChipList items={item.technologies} />
          {(item.githubUrl || item.demoUrl) && (
            <div className="mt-2 flex flex-wrap gap-4">
              {item.githubUrl && (
                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                  GitHub
                </a>
              )}
              {item.demoUrl && (
                <a href={item.demoUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                  Live demo
                </a>
              )}
            </div>
          )}
        </>
      )}
    />
  );
}
