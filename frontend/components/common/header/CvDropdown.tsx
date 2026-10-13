import React from 'react';
import Link from 'next/link';
import { Compass, FilePlus, FileText, Mail } from 'lucide-react';

export function CvDropdown() {
  return (
    <div className="animate-in fade-in absolute top-15 left-0 z-50 w-105 space-y-1 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xl duration-150">
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
