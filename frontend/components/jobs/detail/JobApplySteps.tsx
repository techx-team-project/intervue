import type { PublicJobResource } from '@/types/public-job';
import JobDetailSection from './JobDetailSection';

export default function JobApplySteps({ job }: { job: PublicJobResource }) {
  const { questionCount, estimatedMinutes } = job.screening;
  const steps = [
    { title: 'Choose your CV', description: 'Pick one of your uploaded CVs or upload a new one.' },
    {
      title: questionCount > 0 ? 'Answer screening questions' : 'Add a cover letter',
      description:
        questionCount > 0
          ? `${questionCount} ${questionCount === 1 ? 'question' : 'questions'}, about ${estimatedMinutes} minutes.`
          : 'Optional. AI can help you draft one.',
    },
    { title: 'Submit and track', description: 'Follow the status of your application from your account.' },
  ];

  return (
    <JobDetailSection id="how-to-apply" title="How to apply" index="07">
      <ol className="grid gap-5 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="bg-primary text-on-primary font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {index + 1}
            </span>
            <div>
              <p className="text-body-md text-on-surface font-semibold">{step.title}</p>
              <p className="text-body-md text-on-surface-variant mt-0.5">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-body-sm text-on-surface-variant mt-6">
        InterVue never asks candidates to pay a fee to apply. Report any suspicious job to our support team.
      </p>
    </JobDetailSection>
  );
}
