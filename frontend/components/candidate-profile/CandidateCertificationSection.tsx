'use client';

import type { CandidateCertification } from '@/types/candidate-profile';
import { formatMonth } from '@/utils/candidate-dates';
import { Award } from 'lucide-react';
import CandidateCertificationForm from './CandidateCertificationForm';
import CandidateCertificationImage from './CandidateCertificationImage';
import CandidateSectionManager from './CandidateSectionManager';

type CandidateCertificationSectionProps = {
  items: CandidateCertification[];
};

export default function CandidateCertificationSection({ items }: CandidateCertificationSectionProps) {
  return (
    <CandidateSectionManager
      section="certifications"
      title="Certifications"
      icon={Award}
      addLabel="Add certification"
      emptyText="List your certificates and credentials here."
      itemNoun="certification"
      items={items}
      getName={(item) => item.name}
      renderForm={(props) => <CandidateCertificationForm {...props} />}
      renderItem={(item) => (
        <>
          <h3 className="text-navy text-base font-bold wrap-break-word">{item.name}</h3>
          <p className="text-sm font-semibold wrap-break-word text-slate-700">{item.issuer}</p>
          <p className="text-xs text-slate-500">
            {[formatMonth(item.issueDate), item.credentialId && `ID ${item.credentialId}`].filter(Boolean).join(' | ')}
          </p>
          {item.credentialUrl && (
            <a
              href={item.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mt-1 inline-block text-xs font-semibold hover:underline"
            >
              View credential
            </a>
          )}
          <CandidateCertificationImage id={item.id} name={item.name} imageUrl={item.imageUrl} />
        </>
      )}
    />
  );
}
