import { buttonClassName } from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ROUTES } from '@/constants/routes';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CallToActionSection() {
  return (
    <section aria-labelledby="cta-title" className="bg-surface py-24">
      <div className="container-page">
        <h2 id="cta-title" className="sr-only">
          Get started with InterVue
        </h2>
        <div className="medium:grid-cols-2 grid grid-cols-1 gap-5">
          <Reveal className="h-full">
            <div className="bg-surface-container-low border-outline-variant flex h-full flex-col items-start justify-between gap-12 rounded-[28px] border p-8 lg:p-10">
              <div className="space-y-5">
                <p className="text-label-lg text-primary font-bold tracking-widest uppercase">For candidates</p>
                <p className="font-display text-headline-md text-on-surface font-bold tracking-tight">
                  Ready for your next job?
                </p>
                <p className="text-title-md text-on-surface-variant max-w-sm font-normal">
                  Create a free account, polish your CV and apply in minutes.
                </p>
              </div>
              <Link href={ROUTES.REGISTER} className={buttonClassName({ size: '2xl' })}>
                Create a free account
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={1} className="h-full">
            <div className="bg-primary-deeper relative flex h-full flex-col items-start justify-between gap-12 overflow-hidden rounded-[28px] p-8 lg:p-10">
              <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 opacity-60" />
              <div className="relative space-y-5">
                <p className="text-label-lg text-primary-bright font-bold tracking-widest uppercase">For recruiters</p>
                <p className="font-display text-headline-md font-bold tracking-tight text-white">
                  Find the right IT candidates for your team
                </p>
                <p className="text-title-md max-w-sm font-normal text-white/65">
                  Post jobs, receive applications and let AI assist with screening. The final decision is still yours.
                </p>
              </div>
              <Link
                href={ROUTES.RECRUITER_LANDING}
                className="bg-surface text-primary-deeper text-title-md ease-standard relative inline-flex h-14 items-center gap-2 rounded-full px-8 font-semibold transition-transform duration-150 hover:scale-[1.02]"
              >
                Post a job now
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
