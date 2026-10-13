'use client';

import {
  Briefcase,
  CheckCircle,
  Clock,
  MapPin,
  Gift,
  ShieldCheck,
  Send,
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
  Award,
  Plane,
  TrendingUp,
  Laptop,
  Coffee,
} from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobDescriptionSectionProps {
  job: JobDetail;
  onApply: () => void;
}

const PERK_ICONS: Record<string, React.ElementType> = {
  ShieldCheck,
  Gift,
  Plane,
  TrendingUp,
  Laptop,
  Coffee,
};

export default function JobDescriptionSection({ job, onApply }: JobDescriptionSectionProps) {
  return (
    <div className="space-y-6">
      {/* 1. MÔ TẢ CÔNG VIỆC */}
      <section id="job-description" className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Mô tả công việc</h2>
        </div>

        <div className="mt-5 space-y-3">
          {job.jobDescription.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="text-primary mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100/70">
                <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              </div>
              <p className="text-[14.5px] leading-relaxed text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. YÊU CẦU ỨNG VIÊN */}
      <section id="job-requirements" className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Yêu cầu ứng viên</h2>
        </div>

        {/* Skill tags */}
        <div className="mt-5">
          <div className="mb-2.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
            Kỹ năng & Chuyên môn ưu tiên
          </div>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements list */}
        <div className="mt-5 space-y-3">
          {job.requirements.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-0.5 h-4.5 w-4.5 shrink-0" />
              <p className="text-[14.5px] leading-relaxed text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. QUYỀN LỢI ỨNG VIÊN */}
      <section id="job-benefits" className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Gift className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Quyền lợi ứng viên</h2>
        </div>

        {/* Highlight Perks Grid */}
        {job.perks && job.perks.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {job.perks.map((perk, index) => {
              const IconComp = PERK_ICONS[perk.icon] || Award;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/60 bg-white shadow-2xs">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div className="mt-2 text-[13px] font-bold text-slate-800">{perk.title}</div>
                  <div className="mt-0.5 text-[11.5px] leading-snug text-slate-500">{perk.desc}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Benefits list */}
        <div className="mt-5 space-y-3">
          {job.benefits.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="text-primary mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              </div>
              <p className="text-[14.5px] leading-relaxed text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ĐỊA ĐIỂM VÀ THỜI GIAN LÀM VIỆC */}
      <section id="job-location" className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <MapPin className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Địa điểm & Thời gian làm việc</h2>
        </div>

        <div className="mt-5 space-y-4">
          {/* Địa điểm */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="text-[14.5px] font-bold text-slate-800">Địa điểm làm việc:</div>
                <div className="mt-1 text-[14px] text-slate-600">{job.location.specificAddress}</div>
                {job.location.allLocations && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="mr-1 text-xs text-slate-500">Khu vực liên quan:</span>
                    {job.location.allLocations.map((loc, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thời gian làm việc */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <div className="text-[14.5px] font-bold text-slate-800">Thời gian làm việc:</div>
                <div className="mt-1 text-[14px] font-medium text-slate-700">{job.workSchedule.days}</div>
                <div className="mt-0.5 text-[13px] text-slate-500">Giờ làm việc: {job.workSchedule.time}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CÁCH THỨC ỨNG TUYỂN & HẠN NỘP */}
      <section className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50/60 via-white to-teal-50/30 p-5 shadow-xs sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-[#00873c]">
              <Calendar className="h-3.5 w-3.5" />
              <span>Hạn nộp hồ sơ: {job.deadline}</span>
              {job.daysRemaining && (
                <span className="ml-1 font-bold text-amber-700">(Còn {job.daysRemaining} ngày)</span>
              )}
            </div>

            <h3 className="mt-2.5 text-lg font-bold text-slate-900 sm:text-xl">
              Sẵn sàng gia nhập đội ngũ {job.company.name}?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Nhà tuyển dụng phản hồi hồ sơ trong vòng 24 - 48 giờ làm việc.
            </p>
          </div>

          <button
            type="button"
            onClick={onApply}
            className="from-primary to-primary-hover shadow-primary/30 hover:shadow-primary/40 flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r px-7 py-3.5 text-[15px] font-black text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            <Send className="h-4 w-4" />
            <span>Ứng tuyển ngay</span>
            <Sparkles className="h-4 w-4 text-emerald-200" />
          </button>
        </div>

        {/* Safety & Anti-Fraud Notice (TopCV feature) */}
        <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="leading-relaxed">
              <span className="font-bold">Cảnh báo an toàn từ InterVue:</span> NTD chân chính không bao giờ yêu cầu ứng
              viên đóng tiền phí tuyển dụng, tiền cọc đồng phục hay tham gia các hoạt động nạp tiền online. Nếu gặp dấu
              hiệu khả nghi, vui lòng nhấn nút{' '}
              <span className="cursor-pointer font-semibold underline">Báo cáo tin xấu</span> để được hỗ trợ bảo vệ
              quyền lợi.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
