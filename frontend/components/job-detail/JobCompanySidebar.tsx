'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Building2, Users, MapPin, ExternalLink, Plus, Check, CheckCircle2, Briefcase } from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobCompanySidebarProps {
  company: JobDetail['company'];
  isPreviewMode?: boolean;
}

export default function JobCompanySidebar({ company, isPreviewMode = false }: JobCompanySidebarProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      if (isPreviewMode) {
        toast.info(
          next
            ? 'Chế độ xem trước: Đã theo dõi công ty (mô phỏng thao tác của ứng viên).'
            : 'Chế độ xem trước: Đã hủy theo dõi công ty (mô phỏng thao tác của ứng viên).',
        );
      }
      return next;
    });
  };

  return (
    <div
      id="job-company"
      className="border-outline-variant/90 overflow-hidden rounded-2xl border bg-white p-5 shadow-2xs transition"
    >
      <div className="flex items-start gap-3.5">
        <div className="border-outline-variant flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1.5 shadow-2xs">
          {company.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              loading="lazy"
              decoding="async"
              src={company.logo}
              alt={company.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <Building2 className="text-outline h-8 w-8" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link href={`/companies/${company.id || 224996}`}>
            <h3 className="hover:text-primary text-on-surface line-clamp-2 text-sm font-bold transition-colors">
              {company.name}
            </h3>
          </Link>
          <div className="text-on-surface-variant mt-1 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="text-primary h-3.5 w-3.5" />
            <span>Doanh nghiệp xác thực</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleToggleFollow}
          className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition ${
            isFollowing
              ? 'text-primary border-primary/30 bg-primary-light'
              : 'hover:text-primary border-outline-variant bg-surface-container-low/70 text-on-surface hover:border-primary/40 hover:bg-emerald-50/40'
          }`}
        >
          {isFollowing ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Đang theo dõi ({company.followers || '1.2k'})</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Theo dõi công ty ({company.followers || '1.2k'})</span>
            </>
          )}
        </button>
      </div>

      <div className="border-outline-variant my-4 border-t" />

      <div className="text-on-surface-variant space-y-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Users className="text-outline mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-outline font-medium">Quy mô công ty:</div>
            <div className="text-on-surface mt-0.5 font-semibold">{company.size}</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Briefcase className="text-outline mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-outline font-medium">Lĩnh vực hoạt động:</div>
            <div className="text-on-surface mt-0.5 font-semibold">{company.industry}</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="text-outline mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-outline font-medium">Địa chỉ:</div>
            <div className="text-on-surface mt-0.5 leading-relaxed font-medium">{company.address}</div>
          </div>
        </div>
      </div>

      <div className="border-outline-variant mt-4 border-t pt-3">
        <Link
          href={`/companies/${company.id || 224996}`}
          className="text-primary flex items-center justify-center gap-1.5 text-xs font-bold hover:underline"
        >
          <span>Xem trang công ty</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
