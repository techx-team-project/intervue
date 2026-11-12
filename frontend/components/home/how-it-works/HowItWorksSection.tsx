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
    <section aria-labelledby="how-title" className="bg-surface py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            id="how-title"
            index="02"
            eyebrow="How InterVue works"
            title="Three steps to the right job"
            description="A clear, transparent process with a human behind every decision."
          />
        </Reveal>

        <ol className="medium:grid-cols-3 grid grid-cols-1 gap-x-10 gap-y-12">
          {STEPS.map(({ id, icon: Icon, title, description }, index) => (
            <li key={id}>
              <Reveal delay={index === 0 ? 0 : index === 1 ? 1 : 2} className="h-full">
                <div className="border-primary-deeper h-full border-t-2 pt-6">
                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden
                      className="font-display text-primary text-[56px] leading-[0.9] font-extrabold tracking-tighter"
                    >
                      {id}
                    </span>
                    <Icon className="text-on-surface h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="font-display text-title-lg text-on-surface mt-6 font-bold">{title}</h3>
                  <p className="text-body-lg text-on-surface-variant mt-3 max-w-sm">{description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
