import React from 'react';
import Link from 'next/link';
import { Award, Bookmark, Building2, Search, Send, Sparkles } from 'lucide-react';

export function JobsDropdown() {
  return (
    <div className="animate-in fade-in absolute top-15 left-0 z-50 grid w-125 grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl duration-150">
      <div>
        <div className="mb-2 px-2 text-xs font-bold tracking-wider text-slate-400 uppercase">Tìm việc làm</div>
        <div className="space-y-1">
          <Link
            href="#feature-jobs"
            className="flex items-center gap-2.5 rounded-lg p-2 text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
          >
            <Search className="h-4 w-4 text-emerald-600" />
            <span className="text-sm">Tìm việc làm mới nhất</span>
          </Link>
          <Link
            href="#feature-jobs"
            className="flex items-center gap-2.5 rounded-lg p-2 text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
          >
            <Bookmark className="h-4 w-4 text-emerald-600" />
            <span className="text-sm">Việc làm đã lưu</span>
          </Link>
          <Link
            href="#feature-jobs"
            className="flex items-center gap-2.5 rounded-lg p-2 text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
          >
            <Send className="h-4 w-4 text-emerald-600" />
            <span className="text-sm">Việc làm đã ứng tuyển</span>
          </Link>
          <Link
            href="#feature-jobs"
            className="flex items-center gap-2.5 rounded-lg p-2 text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-sm">Việc làm phù hợp</span>
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-2 px-2 text-xs font-bold tracking-wider text-slate-400 uppercase">Công ty</div>
        <div className="space-y-1">
          <Link
            href="#top-companies"
            className="flex items-center gap-2.5 rounded-lg p-2 text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
          >
            <Building2 className="h-4 w-4 text-slate-700" />
            <span className="text-sm">Danh sách công ty</span>
          </Link>
          <Link
            href="#top-companies"
            className="flex items-center gap-2.5 rounded-lg p-2 text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
          >
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-sm">Top công ty hàng đầu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobsDropdown;
