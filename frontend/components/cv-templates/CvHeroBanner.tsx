import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CvHeroBanner() {
  const { homeBreadcrumb, styleBreadcrumb, title, titleHighlight, titleSuffix, description, badges } =
    CV_TEMPLATE_MESSAGES.hero;
  const highlights = [badges.atsPass, badges.a4Standard, badges.freeExport];

  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-primary-deeper">
        <div className="container-page text-body-sm flex items-center gap-1.5 py-3.5 text-white/60">
          <Link href="/" className="hover:text-white">
            {homeBreadcrumb}
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <span className="text-white/90">{styleBreadcrumb}</span>
        </div>
      </nav>

      <section aria-labelledby="cv-hero-title" className="container-page py-8">
        <h1 id="cv-hero-title" className="font-display text-headline-md sm:text-headline-lg text-on-surface font-bold">
          {title} <span className="text-primary">{titleHighlight}</span> {titleSuffix}
        </h1>
        <p className="text-body-lg text-on-surface-variant mt-3 max-w-3xl">{description}</p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          {highlights.map((label) => (
            <li key={label} className="text-body-md text-on-surface flex items-center gap-2 font-medium">
              <Check className="text-primary h-4 w-4" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
