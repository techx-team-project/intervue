'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface CompanyBreadcrumbProps {
  companyName: string;
}

export default function CompanyBreadcrumb({ companyName }: CompanyBreadcrumbProps) {
  const items = [
    {
      label: 'Danh sách công ty',
      href: '/#top-companies',
      icon: <Building2 className="h-3.5 w-3.5 text-slate-400" />,
    },
    { label: companyName },
  ];

  return (
    <div className="mb-4">
      <Breadcrumb items={items} showHome className="text-xs" />
    </div>
  );
}
