'use client';

import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { COMPANY_FIELDS } from '@/constants/home/companies';
import { TOP_COMPANIES } from '@/mocks/home/companies.mock';

import CompanyCard from './CompanyCard';

export default function TopCompaniesSection() {
  const [selectedField, setSelectedField] = useState(0);
  const [followedCompanies, setFollowedCompanies] = useState<number[]>([]);

  const toggleFollow = (id: number) => {
    setFollowedCompanies((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const filteredCompanies =
    selectedField === 0 ? TOP_COMPANIES : TOP_COMPANIES.filter((c) => c.fieldId === selectedField);

  return (
    <section id="top-companies" className="container-topcv my-12">
      <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs md:p-8">
        {/* Header Title */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-navy flex items-center gap-2.5 text-xl font-bold md:text-2xl">
              <span>Thương hiệu lớn tiêu biểu</span>
              <span className="rounded bg-linear-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[12px] font-bold text-white shadow-xs">
                PRO COMPANY
              </span>
            </h2>
            <p className="mt-1 text-[14px] text-[#6f7882]">
              Hàng trăm thương hiệu lớn tiêu biểu đang tuyển dụng trên InterVue Pro
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-navy hover:bg-primary-tag hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-[#f4f5f5] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="text-navy hover:bg-primary-tag hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-[#f4f5f5] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Industry Filter Tabs */}
        <div className="mb-6 flex scrollbar-none items-center gap-2 overflow-x-auto pb-3">
          {COMPANY_FIELDS.map((field) => (
            <button
              key={field.id}
              type="button"
              onClick={() => setSelectedField(field.id)}
              className={`shrink-0 cursor-pointer rounded-xl px-4 py-2 text-[13.5px] font-semibold transition-all ${
                selectedField === field.id
                  ? 'bg-navy text-white shadow-xs'
                  : 'hover:bg-primary-light hover:text-primary border border-[#e9eaec] bg-[#f8fafc] text-[#6f7882]'
              }`}
            >
              {field.name}
            </button>
          ))}
        </div>

        {/* Company Cards Grid (4 Columns) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              isFollowed={followedCompanies.includes(company.id)}
              onToggleFollow={toggleFollow}
            />
          ))}
        </div>

        {/* Bottom Banner Pro CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#f4f5f5] pt-6">
          <div className="flex items-center gap-3">
            <span className="text-[14.5px] text-[#6f7882]">
              Tìm hiểu thêm về các doanh nghiệp hàng đầu trên InterVue Pro?
            </span>
          </div>

          <a
            href="https://www.topcv.vn/pro"
            target="_blank"
            rel="noreferrer"
            className="bg-dark hover:bg-navy inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white shadow-xs transition-colors"
          >
            <span>Khám phá InterVue Pro</span>
            <span className="rounded bg-linear-to-r from-amber-500 to-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              PRO
            </span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
