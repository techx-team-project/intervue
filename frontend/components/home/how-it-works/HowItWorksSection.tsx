import Reveal from '@/components/ui/Reveal';
import { FileText, Send, Sparkles, type LucideIcon } from 'lucide-react';
import SectionHeader from '../SectionHeader';

type Step = { id: string; icon: LucideIcon; title: string; description: string };

const STEPS: Step[] = [
  {
    id: '01',
    icon: FileText,
    title: 'Build a standout profile',
    description: 'Upload your CV or pick an ATS-ready template. Your profile stays under your control.',
  },
  {
    id: '02',
    icon: Sparkles,
    title: 'Get suggestions from AI',
    description: 'AI reviews your CV, suggests matching jobs and helps you practice interviews before you apply.',
  },
  {
    id: '03',
    icon: Send,
    title: 'Apply and follow up',
    description: 'Send your application to a verified recruiter and track its status at every step.',
  },
];

export default function HowItWorksSection() {
  return (
    <section aria-labelledby="how-title" className="bg-surface-container-low py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            id="how-title"
            eyebrow="How InterVue works"
            title="Three steps to the right job"
            description="A clear, transparent process with a human behind every decision."
            align="center"
          />
        </Reveal>

        <ol className="medium:grid-cols-3 relative grid grid-cols-1 gap-6">
          <div
            aria-hidden
            className="border-outline medium:block absolute top-16 right-[16%] left-[16%] hidden border-t-2 border-dashed"
          />
          {STEPS.map(({ id, icon: Icon, title, description }, index) => (
            <li key={id}>
              <Reveal delay={index === 0 ? 0 : index === 1 ? 1 : 2} className="h-full">
                <div className="bg-surface shadow-card relative h-full rounded-3xl p-8">
                  <span
                    aria-hidden
                    className="font-display text-primary/15 absolute top-6 right-8 text-[72px] leading-none font-extrabold"
                  >
                    {id}
                  </span>
                  <span className="bg-primary relative flex h-16 w-16 items-center justify-center rounded-2xl text-white">
                    <Icon className="h-8 w-8" aria-hidden />
                  </span>
                  <h3 className="font-display text-headline-sm text-on-surface mt-6 font-bold">{title}</h3>
                  <p className="text-body-lg text-on-surface-variant mt-3">{description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
