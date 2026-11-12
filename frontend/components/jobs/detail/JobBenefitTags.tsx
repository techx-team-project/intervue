import { JOB_BENEFIT_TAG_LABELS } from '@/constants/recruiter-job';
import { cn } from '@/lib/utils';
import type { JobBenefitTag } from '@/types/recruiter-job';

type JobBenefitTagsProps = {
  tags: JobBenefitTag[];
  hasLines: boolean;
};

export default function JobBenefitTags({ tags, hasLines }: JobBenefitTagsProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-2', hasLines && 'border-outline-variant mt-6 border-t pt-5')}>
      {tags.map((tag) => (
        <li key={tag} className="bg-primary-light text-primary-deep text-body-sm rounded-lg px-3 py-1.5 font-medium">
          {JOB_BENEFIT_TAG_LABELS[tag]}
        </li>
      ))}
    </ul>
  );
}
