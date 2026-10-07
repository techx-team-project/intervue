'use client';

import Link from 'next/link';
import { Briefcase, Building2, CheckCircle, Users } from 'lucide-react';
import type { Company } from '@/types/home';

interface CompanyCardProps {
  company: Company;
  isFollowed: boolean;
  onToggleFollow: (id: number) => void;
}

export default function CompanyCard({ company, isFollowed, onToggleFollow }: CompanyCardProps) {
  return (
    <div className="group hover:border-primary flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e9eaec] bg-white transition-all duration-300 hover:shadow-xl">
      <div>
        {/* Cover Image */}
        <Link
          href={`/companies/${company.id}`}
          className="from-navy relative block h-28 w-full overflow-hidden bg-linear-to-r to-[#1e293b]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={company.cover}
            alt={company.name}
            className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Logo Avatar & Content */}
        <div className="relative -mt-10 px-4 pb-4">
          <Link
            href={`/companies/${company.id}`}
            className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e9eaec] bg-white p-1.5 shadow-md transition-transform group-hover:scale-105"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
          </Link>

          <Link href={`/companies/${company.id}`}>
            <h3 className="text-navy group-hover:text-primary mb-1 line-clamp-2 cursor-pointer text-[14.5px] leading-tight font-bold transition-colors">
              {company.name}
            </h3>
          </Link>

          <div className="mb-3 flex items-center gap-1 text-[12.5px] text-[#7f878f]">
            <Building2 className="h-3.5 w-3.5 text-[#939ca5]" />
            <span>{company.field}</span>
          </div>

          {/* Stats: Jobs & Followers */}
          <div className="mb-3 flex items-center justify-between rounded-xl border border-[#f1f5f9] bg-[#f8fafc] p-2.5 text-[12.5px]">
            <Link
              href={`/companies/${company.id}`}
              className="text-primary flex items-center gap-1 font-bold hover:underline"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>{company.openJobs} việc làm</span>
            </Link>
            <div className="flex items-center gap-1 text-[#6f7882]">
              <Users className="h-3.5 w-3.5 text-[#939ca5]" />
              <span>{company.followers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Follow Button */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onToggleFollow(company.id)}
          className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-[13.5px] font-semibold transition-all ${
            isFollowed
              ? 'border-primary bg-primary-tag text-primary border'
              : 'text-navy hover:border-primary hover:bg-primary-light hover:text-primary border border-[#e9eaec] bg-white'
          }`}
        >
          {isFollowed ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Đang theo dõi</span>
            </>
          ) : (
            <span>+ Theo dõi</span>
          )}
        </button>
      </div>
    </div>
  );
}
