'use client';

import { Award, Briefcase, Users, Building, Clock, User, Tag, MapPin, ShieldCheck } from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobGeneralInfoSidebarProps {
  job: JobDetail;
}

export default function JobGeneralInfoSidebar({ job }: JobGeneralInfoSidebarProps) {
  const specs = [
    {
      icon: Award,
      label: 'Cấp bậc',
      value: job.level,
    },
    {
      icon: Briefcase,
      label: 'Kinh nghiệm',
      value: job.experience,
    },
    {
      icon: Users,
      label: 'Số lượng tuyển',
      value: job.recruitsCount,
    },
    {
      icon: Building,
      label: 'Hình thức làm việc',
      value: job.workingType,
    },
    {
      icon: Clock,
      label: 'Loại hình hợp đồng',
      value: job.employmentType,
    },
    {
      icon: User,
      label: 'Giới tính',
      value: job.gender,
    },
  ];

  return (
    <div className="space-y-5">
      {/* 1. THÔNG TIN CHUNG BOX */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">Thông tin chung</h3>

        <div className="mt-4 space-y-3.5">
          {specs.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-600">
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11.5px] font-medium text-slate-400">{item.label}</div>
                  <div className="mt-0.5 truncate text-[13px] font-bold text-slate-800">{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. NGÀNH NGHỀ & TỪ KHÓA LIÊN QUAN */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <h3 className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
          <Tag className="text-primary h-4 w-4" />
          <span>Ngành nghề & Lĩnh vực</span>
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag, idx) => (
            <span
              key={idx}
              className="hover:text-primary cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {job.location.allLocations && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Khu vực tìm kiếm liên quan</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.location.allLocations.map((loc, idx) => (
                <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {loc} - Hà Nội
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. CAM KẾT TUYỂN DỤNG MINH BẠCH */}
      <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/70 to-teal-50/30 p-4 text-xs text-slate-700">
        <div className="mb-1 flex items-center gap-2 font-bold text-emerald-900">
          <ShieldCheck className="text-primary h-4 w-4" />
          <span>Cam kết minh bạch InterVue</span>
        </div>
        <p className="text-[11.5px] leading-relaxed text-slate-600">
          Mọi tin tuyển dụng đều được hệ thống kiểm duyệt giấy phép kinh doanh và xác minh danh tính doanh nghiệp trước
          khi phát hành.
        </p>
      </div>
    </div>
  );
}
