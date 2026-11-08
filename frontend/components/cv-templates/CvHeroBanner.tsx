'use client';

import PageHero from '@/components/common/PageHero';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { DownloadCloud, FileCheck, ShieldCheck } from 'lucide-react';

export default function CvHeroBanner() {
  const {
    homeBreadcrumb,
    styleBreadcrumb,
    currentBreadcrumb,
    badge,
    title,
    titleHighlight,
    titleSuffix,
    description,
    badges,
  } = CV_TEMPLATE_MESSAGES.hero;

  const highlights = [
    { label: badges.atsPass, icon: ShieldCheck },
    { label: badges.a4Standard, icon: FileCheck },
    { label: badges.freeExport, icon: DownloadCloud },
  ];

  return (
    <PageHero
      id="cv-hero-title"
      eyebrow={badge}
      title={
        <>
          {title} <span className="text-primary-bright">{titleHighlight}</span> {titleSuffix}
        </>
      }
      description={description}
      crumbs={[
        { label: homeBreadcrumb, href: '/' },
        { label: styleBreadcrumb, href: '/cv-templates' },
        { label: currentBreadcrumb },
      ]}
    >
      <ul className="flex flex-wrap gap-3">
        {highlights.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className="text-label-lg flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white"
          >
            <Icon className="text-primary-bright h-4 w-4" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </PageHero>
  );
}
