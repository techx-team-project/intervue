import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { CV_STEPS } from '@/mocks/cv-template.mock';

export default function CvStepGuideSection() {
  const { title, description } = CV_TEMPLATE_MESSAGES.stepGuide;

  return (
    <section aria-labelledby="cv-steps-title" className="bg-surface border-outline-variant border-t py-20">
      <div className="container-page">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 id="cv-steps-title" className="font-display text-headline-lg text-on-surface font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-title-md text-on-surface-variant font-normal">{description}</p>
        </div>

        <ol className="grid gap-x-10 gap-y-10 md:grid-cols-3">
          {CV_STEPS.map((step) => (
            <li key={step.step} className="border-on-surface border-t-2 pt-6">
              <span aria-hidden className="font-display text-primary text-[56px] leading-[0.9] font-extrabold">
                {String(step.step).padStart(2, '0')}
              </span>
              <h3 className="font-display text-title-lg text-on-surface mt-6 font-bold">{step.title}</h3>
              <p className="text-body-lg text-on-surface-variant mt-3 max-w-sm">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
