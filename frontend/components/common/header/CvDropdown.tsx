import React from 'react';
import Link from 'next/link';
import { Compass, FilePlus, FileText, Mail, Sparkles } from 'lucide-react';

export function CvDropdown() {
  return (
    <div className="absolute top-15 left-0 z-50 w-105 space-y-1 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xl">
      <Link
        href="/cv-review"
        className="text-navy flex items-center gap-3 rounded-lg border border-emerald-100/60 bg-emerald-50/30 p-2 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            AI Chấm điểm & Đánh giá CV
            <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white">AI</span>
          </div>
          <div className="text-xs text-slate-500">Tối ưu chuẩn ATS & mô hình STAR</div>
        </div>
      </Link>
      <Link
        href="/cv-templates"
        className="text-navy hover:bg-primary-light hover:text-primary flex items-center gap-3 rounded-lg p-2 transition-colors"
      >
        <FilePlus className="text-primary h-4 w-4" />
        <div>
          <div className="text-sm font-semibold">Tạo CV mới (Builder 2.0)</div>
          <div className="text-xs text-slate-400">Mẫu CV chuyên nghiệp chuẩn ATS</div>
        </div>
      </Link>
      <Link
        href="/profile"
        className="text-navy hover:bg-primary-light hover:text-primary flex items-center gap-3 rounded-lg p-2 transition-colors"
      >
        <FileText className="text-primary h-4 w-4" />
        <div>
          <div className="text-sm font-semibold">Quản lý CV & Hồ sơ</div>
          <div className="text-xs text-slate-400">Xem và chỉnh sửa hồ sơ ứng viên</div>
        </div>
      </Link>
      <Link
        href="/cv-templates"
        className="text-navy hover:bg-primary-light hover:text-primary flex items-center gap-3 rounded-lg p-2 transition-colors"
      >
        <Compass className="text-primary h-4 w-4" />
        <div>
          <div className="text-sm font-semibold">Mẫu CV theo ngành nghề</div>
          <div className="text-xs text-slate-400">IT, Marketing, Kế toán, Kinh doanh</div>
        </div>
      </Link>
      <Link
        href="#self-growth"
        className="text-navy hover:bg-primary-light hover:text-primary flex items-center gap-3 rounded-lg p-2 transition-colors"
      >
        <Mail className="text-primary h-4 w-4" />
        <div>
          <div className="text-sm font-semibold">Mẫu Cover Letter</div>
          <div className="text-xs text-slate-400">Thư xin việc ấn tượng</div>
        </div>
      </Link>
    </div>
  );
}

export default CvDropdown;
