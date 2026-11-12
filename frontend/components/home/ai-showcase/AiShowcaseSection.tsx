import { buttonClassName } from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ROUTES } from '@/constants/routes';
import { Check, FileSearch, Mic, ShieldCheck, Target, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../SectionHeader';

type Capability = { id: string; icon: LucideIcon; title: string; description: string };

const CAPABILITIES: Capability[] = [
  {
    id: 'cv',
    icon: FileSearch,
    title: 'Detailed CV feedback',
    description: 'A score, your strengths and what to improve for the role you are targeting.',
  },
  {
    id: 'interview',
    icon: Mic,
    title: 'Practice interviews with AI',
    description: 'Answer realistic questions and review feedback to build confidence.',
  },
  {
    id: 'match',
    icon: Target,
    title: 'Job suggestions that fit',
    description: 'Jobs ranked by the skills and experience in your profile.',
  },
];

const SCORE = 86;
const RING_RADIUS = 42;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const STRENGTHS = ['Skills match the Backend role', 'Experience is described with results'];

export default function AiShowcaseSection() {
  return (
    <section aria-labelledby="ai-title" className="bg-primary-deeper relative overflow-hidden py-24">
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 opacity-60" />

      <div className="container-page relative grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <SectionHeader
            id="ai-title"
            index="03"
            eyebrow="AI tools"
            title="AI by your side at every step of applying"
            description="Prepare better, apply with confidence, and always know how your data is used."
            tone="dark"
          />

          <ul className="border-t border-white/10">
            {CAPABILITIES.map(({ id, icon: Icon, title, description }) => (
              <li key={id} className="flex gap-5 border-b border-white/10 py-6">
                <Icon className="text-primary-bright mt-1 h-6 w-6 shrink-0" aria-hidden />
                <div>
                  <h3 className="font-display text-title-lg font-bold text-white">{title}</h3>
                  <p className="text-body-lg mt-1 text-white/60">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-body-md mt-8 flex items-start gap-3 text-white/70">
            <ShieldCheck className="text-primary-bright mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            AI only assists. InterVue never automatically accepts or rejects an application. Recruiters make the final
            decision.
          </p>

          <Link href={ROUTES.CANDIDATE_CVS} className={buttonClassName({ size: '2xl', className: 'mt-8' })}>
            Try it with your CV
          </Link>
        </Reveal>

        <Reveal delay={2}>
          <div aria-hidden className="relative mx-auto w-full max-w-[520px] space-y-5">
            <div className="bg-forest-900 rounded-[28px] border border-white/10 p-6">
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0 -rotate-90">
                  <circle cx="50" cy="50" r={RING_RADIUS} fill="none" strokeWidth="9" className="stroke-white/10" />
                  <circle
                    cx="50"
                    cy="50"
                    r={RING_RADIUS}
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={RING_LENGTH * (1 - SCORE / 100)}
                    className="stroke-primary-bright"
                  />
                </svg>
                <div>
                  <p className="text-label-md text-white/60">CV score</p>
                  <p className="font-display text-display-sm font-extrabold text-white">
                    {SCORE}
                    <span className="text-title-lg text-white/50">/100</span>
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5">
                {STRENGTHS.map((item) => (
                  <li key={item} className="text-body-md flex items-center gap-2.5 text-white/85">
                    <span className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-forest-900 space-y-3 rounded-[28px] border border-white/10 p-6">
              <p className="text-label-md text-white/60">Mock interview</p>
              <p className="text-body-md max-w-[85%] rounded-2xl rounded-tl-md bg-white/10 px-4 py-3 text-white">
                Describe a time you improved the performance of a live system.
              </p>
              <p className="text-body-md bg-primary ml-auto max-w-[85%] rounded-2xl rounded-tr-md px-4 py-3 text-white">
                I added an index and a cache and cut the response time in half.
              </p>
              <p className="text-label-lg text-primary-bright">
                Tip: state the numbers before and after the optimization.
              </p>
            </div>

            <p className="text-label-sm text-right text-white/40">Illustrative interface</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
