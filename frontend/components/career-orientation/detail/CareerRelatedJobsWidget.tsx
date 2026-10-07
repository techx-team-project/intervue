'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface MarketingJobPreview {
  id: string | number;
  title: string;
  companyName: string;
  companyLogo: string;
  companyId: string | number;
  salary: string;
  location: string;
  deadline: string;
  tags: string[];
}

const MARKETING_JOBS: MarketingJobPreview[] = [
  {
    id: 101,
    title: 'Senior Brand Marketing Executive - FMCG Brands',
    companyName: 'Tập Đoàn Masan (Masan Group)',
    companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/z7x9B4R0a13h.png',
    companyId: 2,
    salary: '22 - 32 triệu',
    location: 'Quận 1, TP. Hồ Chí Minh',
    deadline: '30/10/2026',
    tags: ['Brand Management', 'FMCG', 'Campaign Planning'],
  },
  {
    id: 102,
    title: 'Digital Performance Marketing Specialist (Google & Meta Ads)',
    companyName: 'Công Ty Cổ Phần FPT',
    companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/fpt-corporation.png',
    companyId: 1,
    salary: '18 - 25 triệu',
    location: 'Cầu Giấy, Hà Nội',
    deadline: '28/10/2026',
    tags: ['Performance Ads', 'ROAS', 'Google Ads'],
  },
  {
    id: 103,
    title: 'Content Creator & Social Media Executive (TikTok / Threads)',
    companyName: 'Shopee Vietnam',
    companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/shopee-vietnam.png',
    companyId: 4,
    salary: '12 - 18 triệu',
    location: 'Quận 7, TP. Hồ Chí Minh',
    deadline: '25/10/2026',
    tags: ['TikTok Creator', 'Copywriting', 'Livestream'],
  },
  {
    id: 104,
    title: 'SEO & Growth Marketing Lead - Fintech Ecosystem',
    companyName: 'VNG Corporation',
    companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/vng-corporation.png',
    companyId: 3,
    salary: '25 - 40 triệu',
    location: 'Quận 7, TP. Hồ Chí Minh',
    deadline: '15/11/2026',
    tags: ['SEO Leader', 'Growth Hacking', 'Ahrefs'],
  },
];

export default function CareerRelatedJobsWidget() {
  return (
    <div className="from-primary-light my-10 rounded-3xl border border-emerald-200 bg-linear-to-b via-white to-white p-6 shadow-xs sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="text-primary mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tuyển Dụng Trực Tiếp Từ Doanh Nghiệp Hàng Đầu</span>
          </div>
          <h3 className="text-xl font-bold text-[#171717] sm:text-2xl">Việc làm ngành Marketing đang tuyển gấp</h3>
          <p className="mt-1 text-xs text-[#526475] sm:text-sm">
            Các vị trí Marketing thu nhập hấp dẫn từ các nhà tuyển dụng hàng đầu trên InterVue
          </p>
        </div>

        <Link
          href="/jobs"
          className="border-primary text-primary hover:bg-primary inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition hover:text-white"
        >
          <span>Xem tất cả 1.400+ việc làm</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MARKETING_JOBS.map((job) => (
          <div
            key={job.id}
            className="group hover:border-primary/60 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition duration-200 hover:shadow-md sm:p-5"
          >
            <div>
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="h-12 w-12 shrink-0 rounded-xl border border-gray-100 bg-white object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/jobs/${job.id}`}>
                    <h4 className="group-hover:text-primary line-clamp-1 text-sm font-bold text-[#171717] transition-colors">
                      {job.title}
                    </h4>
                  </Link>
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="hover:text-primary mt-0.5 line-clamp-1 text-xs text-[#526475]"
                  >
                    {job.companyName}
                  </Link>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-primary rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold">
                  {job.salary}
                </span>
                <span className="flex items-center gap-1 text-[#7f878f]">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {job.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-[#526475]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
              <span className="flex items-center gap-1 text-[11px] text-[#7f878f]">
                <Clock className="h-3 w-3" />
                Hạn nộp: {job.deadline}
              </span>

              <Link
                href={`/jobs/${job.id}`}
                className="bg-primary rounded-lg px-3.5 py-1.5 font-bold text-white shadow-xs transition hover:bg-[#009b44]"
              >
                Ứng tuyển ngay
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
