import { Briefcase, Building2, CheckCircle, Users } from 'lucide-react';

import type { Company } from '@/types/home';

interface CompanyCardProps {
  company: Company;
  isFollowed: boolean;
  onToggleFollow: (id: number) => void;
}

export default function CompanyCard({ company, isFollowed, onToggleFollow }: CompanyCardProps) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e9eaec] bg-white transition-all duration-300 hover:border-[#00b14f] hover:shadow-xl">
      <div>
        {/* Cover Image */}
        <div className="relative h-28 w-full overflow-hidden bg-linear-to-r from-[#263a4d] to-[#1e293b]">
          <img
            src={company.cover}
            alt={company.name}
            className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Logo Avatar & Content */}
        <div className="relative -mt-10 px-4 pb-4">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e9eaec] bg-white p-1.5 shadow-md">
            <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
          </div>

          <h3 className="mb-1 line-clamp-2 cursor-pointer text-[14.5px] leading-tight font-bold text-[#263a4d] transition-colors group-hover:text-[#00b14f]">
            {company.name}
          </h3>

          <div className="mb-3 flex items-center gap-1 text-[12.5px] text-[#7f878f]">
            <Building2 className="h-3.5 w-3.5 text-[#939ca5]" />
            <span>{company.field}</span>
          </div>

          {/* Stats: Jobs & Followers */}
          <div className="mb-3 flex items-center justify-between rounded-xl border border-[#f1f5f9] bg-[#f8fafc] p-2.5 text-[12.5px]">
            <div className="flex items-center gap-1 font-bold text-[#00b14f]">
              <Briefcase className="h-3.5 w-3.5" />
              <span>{company.openJobs} việc làm</span>
            </div>
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
              ? 'border border-[#00b14f] bg-[#e6f7ee] text-[#00b14f]'
              : 'border border-[#e9eaec] bg-white text-[#263a4d] hover:border-[#00b14f] hover:bg-[#f2fbf6] hover:text-[#00b14f]'
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
