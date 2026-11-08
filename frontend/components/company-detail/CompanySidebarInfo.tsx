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
    <div className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs">
      <h3 className="border-outline-variant text-on-surface border-b pb-3 text-sm font-bold">General information</h3>

      <div className="mt-4 space-y-3.5">
        {infoItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="border-outline-variant/80 bg-surface-container-low text-on-surface-variant flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                <IconComp className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-label-sm text-outline font-medium">{item.label}</div>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-body-md mt-0.5 block truncate font-bold hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="text-body-md text-on-surface mt-0.5 leading-snug font-bold">{item.value}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
