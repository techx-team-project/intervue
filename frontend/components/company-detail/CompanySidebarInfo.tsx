'use client';

import { Briefcase, Globe, Mail, Phone, Users } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';

interface CompanySidebarInfoProps {
  company: CompanyDetail;
}

export default function CompanySidebarInfo({ company }: CompanySidebarInfoProps) {
  const infoItems = [
    {
      icon: Users,
      label: 'Company size',
      value: company.size || 'Updating',
    },
    {
      icon: Briefcase,
      label: 'Industry',
      value: company.industry || 'Updating',
    },
    {
      icon: Phone,
      label: 'Recruitment hotline',
      value: company.phone || 'Updating',
    },
    {
      icon: Mail,
      label: 'Application email',
      value: company.email || 'Updating',
    },
    {
      icon: Globe,
      label: 'Official website',
      value: company.website ? company.website.replace(/^https?:\/\//, '') : 'Updating',
      link: company.website,
    },
  ];

  return (
    <div className="border-outline-variant bg-surface rounded-2xl border p-6">
      <h3 className="font-display text-title-md text-on-surface font-bold">General information</h3>

      <div className="mt-5 space-y-4">
        {infoItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="bg-primary-light text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <IconComp className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-label-md text-on-surface-variant">{item.label}</div>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-body-md mt-0.5 block truncate font-semibold hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="text-body-md text-on-surface mt-0.5 leading-snug font-semibold">{item.value}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
