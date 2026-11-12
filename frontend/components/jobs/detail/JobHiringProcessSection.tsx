import JobDetailSection from './JobDetailSection';

type JobHiringProcessSectionProps = {
  steps: string[];
  index?: string;
};

export default function JobHiringProcessSection({ steps, index }: JobHiringProcessSectionProps) {
  if (steps.length === 0) return null;

  return (
    <JobDetailSection id="process" title="Hiring process" index={index}>
      <ol className="space-y-4">
        {steps.map((step, position) => (
          <li key={`${position}-${step}`} className="flex items-center gap-4">
            <span className="bg-primary-light text-primary-deep flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {position + 1}
            </span>
            <span className="text-body-lg text-on-surface font-medium">{step}</span>
          </li>
        ))}
      </ol>
    </JobDetailSection>
  );
}
