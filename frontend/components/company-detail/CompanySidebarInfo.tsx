'use client';

import { Users, Briefcase, Calendar, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';

interface CompanySidebarInfoProps {
  company: CompanyDetail;
}

export default function CompanySidebarInfo({ company }: CompanySidebarInfoProps) {
  const infoItems = [
    {
      icon: Users,
      label: 'Quy mô công ty',
      value: company.size,
    },
    {
      icon: Briefcase,
      label: 'Lĩnh vực hoạt động',
      value: company.industry,
    },
    {
      icon: Calendar,
      label: 'Năm thành lập',
      value: company.foundedYear || 'Đang cập nhật',
    },
    {
      icon: Phone,
      label: 'Hotline tuyển dụng',
      value: company.phone || 'Đang cập nhật',
    },
    {
      icon: Mail,
      label: 'Email nhận hồ sơ',
      value: company.email || 'Đang cập nhật',
    },
    {
      icon: Globe,
      label: 'Website chính thức',
      value: company.website ? company.website.replace('https://', '') : 'Đang cập nhật',
      link: company.website,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">Thông tin chung</h3>

      <div className="mt-4 space-y-3.5">
        {infoItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-600">
                <IconComp className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-medium text-slate-400">{item.label}</div>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block truncate text-[13px] font-bold text-[#00b14f] hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="mt-0.5 text-[13px] leading-snug font-bold text-slate-800">{item.value}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification note */}
      <div className="mt-5 rounded-xl border border-emerald-100 bg-linear-to-br from-emerald-50/70 to-teal-50/30 p-3.5 text-xs text-slate-700">
        <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-900">
          <ShieldCheck className="h-4 w-4 text-[#00b14f]" />
          <span>Hồ sơ doanh nghiệp minh bạch</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          Đã được InterVue xác thực giấy phép hoạt động kinh doanh và thông tin pháp nhân hợp lệ.
        </p>
      </div>
    </div>
  );
}
