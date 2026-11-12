import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { CV_BENEFITS } from '@/mocks/cv-template.mock';
import { Eye, FileCheck2, ShieldCheck, Sliders, type LucideIcon } from 'lucide-react';

const BENEFIT_ICONS: Record<string, LucideIcon> = { ShieldCheck, Eye, Sliders, FileCheck2 };

export default function CvBenefitsSection() {
  const { title, description } = CV_TEMPLATE_MESSAGES.benefits;

  return (
    <section aria-labelledby="cv-benefits-title" className="bg-surface-container-low py-20">
      <div className="container-page">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 id="cv-benefits-title" className="font-display text-headline-lg text-on-surface font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-title-md text-on-surface-variant font-normal">{description}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CV_BENEFITS.map((benefit) => {
            const Icon = BENEFIT_ICONS[benefit.icon] ?? ShieldCheck;
            return (
              <li key={benefit.title} className="bg-surface border-outline-variant rounded-2xl border p-6">
                <span className="bg-primary-light text-primary flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display text-title-md text-on-surface mt-5 font-bold">{benefit.title}</h3>
                <p className="text-body-md text-on-surface-variant mt-2">{benefit.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
