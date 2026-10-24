'use client';

import { ROUTES } from '@/constants/routes';
import type { RecruiterVerificationProfile } from '@/types/recruiter-company';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface VerificationChecklistProps {
  profile: RecruiterVerificationProfile;
}

export function VerificationChecklist({ profile }: VerificationChecklistProps) {
  // Determine completion of individual steps
  const isPhoneDone = profile.phone.isVerified;
  const isCompanyDone = profile.company.isCompleted;
  const isLicenseDone = profile.license.status === 'APPROVED' || profile.license.status === 'PENDING_REVIEW';
  const isCandidateDone = profile.candidateAgreement.status === 'AGREED';
  const isPlatformDone = profile.platformAgreement.isAgreed;

  const checklistItems = [
    {
      id: 'phone',
      title: 'Xác thực số điện thoại',
      isCompleted: isPhoneDone,
      href: ROUTES.RECRUITER_COMPANY_PHONE_VERIFY,
    },
    {
      id: 'company',
      title: 'Cập nhật thông tin công ty',
      isCompleted: isCompanyDone,
      href: ROUTES.RECRUITER_COMPANY,
    },
    {
      id: 'license',
      title: 'Cập nhật Giấy đăng ký doanh nghiệp',
      isCompleted: isLicenseDone,
      href: ROUTES.RECRUITER_COMPANY_LICENSE,
      statusNote: profile.license.status === 'PENDING_REVIEW' ? 'Đang chờ duyệt' : undefined,
    },
    {
      id: 'candidate_agreement',
      title: 'Cập nhật Thỏa thuận xử lý DLCN với ứng viên',
      isCompleted: isCandidateDone,
      href: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
    },
    {
      id: 'platform_agreement',
      title: 'Đồng ý Thỏa thuận xử lý DLCN với InterVue',
      isCompleted: isPlatformDone,
      href: `${ROUTES.RECRUITER_COMPANY_AGREEMENTS}#platform`,
    },
    {
      id: 'post_job',
      title: 'Đăng tin tuyển dụng đầu tiên',
      isCompleted: false,
      href: ROUTES.RECRUITER_JOBS_CREATE,
      badge: (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#00b14f] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
          +2 InterPoint
          <span className="text-[10px]">✦</span>
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between bg-white p-6 select-none sm:p-8 lg:p-10">
      <div className="space-y-6">
        {/* Welcome greeting */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Xin chào, <span className="font-extrabold text-[#00b14f]">{profile.recruiterName}</span>
          </h1>
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Hãy thực hiện các bước sau để gia tăng tính bảo mật cho tài khoản của bạn và nhận ngay{' '}
            <span className="font-bold text-[#00b14f]">+2 InterPoint</span> để{' '}
            <Link
              href={ROUTES.RECRUITER_COMPANY_NEEDS || '#'}
              className="font-semibold text-[#00b14f] underline hover:text-emerald-700"
            >
              Đổi quà
            </Link>{' '}
            khi đăng tin tuyển dụng đầu tiên trong:
          </p>
        </div>

        {/* Countdown Timer Badges matching TopCV */}
        <div className="flex items-center gap-2 pt-0.5 pb-1">
          <div className="flex min-w-[46px] flex-col items-center justify-center rounded-lg bg-[#00b14f] px-3 py-1.5 text-white shadow-sm">
            <span className="text-base leading-none font-extrabold">11</span>
            <span className="mt-0.5 text-[10px] leading-tight font-medium opacity-90">Ngày</span>
          </div>
          <span className="text-lg font-black text-[#00b14f]">:</span>
          <div className="flex min-w-[46px] flex-col items-center justify-center rounded-lg bg-[#00b14f] px-3 py-1.5 text-white shadow-sm">
            <span className="text-base leading-none font-extrabold">5</span>
            <span className="mt-0.5 text-[10px] leading-tight font-medium opacity-90">Giờ</span>
          </div>
          <span className="text-lg font-black text-[#00b14f]">:</span>
          <div className="flex min-w-[46px] flex-col items-center justify-center rounded-lg bg-[#00b14f] px-3 py-1.5 text-white shadow-sm">
            <span className="text-base leading-none font-extrabold">10</span>
            <span className="mt-0.5 text-[10px] leading-tight font-medium opacity-90">Phút</span>
          </div>
        </div>

        {/* Section title & progress info */}
        <div className="flex items-center justify-between border-b border-slate-100 pt-2 pb-3">
          <span className="text-sm font-bold text-slate-800 sm:text-base">Xác thực thông tin</span>
          <span className="text-xs font-semibold text-slate-500 sm:text-sm">
            Hoàn thành {profile.completionPercent}%
          </span>
        </div>

        {/* Checklist rows matching TopCV */}
        <div className="space-y-1 sm:space-y-2">
          {checklistItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group flex items-center justify-between rounded-xl p-3 transition-colors duration-150 hover:bg-slate-50/80"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  {/* Circular check status */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                      item.isCompleted
                        ? 'bg-[#00b14f] text-white'
                        : 'border-2 border-slate-300 bg-white group-hover:border-emerald-400'
                    }`}
                  >
                    {item.isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                  </div>

                  {/* Title & optional badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-medium sm:text-sm ${
                        item.isCompleted ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.statusNote && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        {item.statusNote}
                      </span>
                    )}
                    {item.badge}
                  </div>
                </div>

                {/* Right Arrow button */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-[#00b14f] group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Center Action: "Tôi sẽ xác thực sau" */}
        <div className="pt-4 text-center">
          <Link
            href={ROUTES.RECRUITER_DASHBOARD}
            className="text-xs font-medium text-slate-500 underline transition-colors hover:text-slate-800 hover:no-underline sm:text-sm"
          >
            Tôi sẽ xác thực sau
          </Link>
        </div>
      </div>

      {/* Signature: "Powered by InterVue" matching TopCV */}
      <div className="flex items-center justify-end pt-8">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <span>Powered by</span>
          <Image
            src="/intervue-logo.png"
            alt="InterVue"
            width={78}
            height={22}
            className="inline-block h-4 w-auto object-contain sm:h-5"
          />
        </div>
      </div>
    </div>
  );
}
