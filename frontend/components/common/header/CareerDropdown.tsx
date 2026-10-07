import React from 'react';
import Link from 'next/link';

export function CareerDropdown() {
  return (
    <div className="animate-in fade-in absolute top-15 left-0 z-50 w-72 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl duration-150">
      <Link
        href="/career-orientation"
        className="block rounded-lg p-2 text-sm text-slate-800 hover:bg-emerald-50/50 hover:text-emerald-600"
      >
        Định hướng nghề nghiệp
      </Link>
      <Link
        href="#self-growth"
        className="block rounded-lg p-2 text-sm text-slate-800 hover:bg-emerald-50/50 hover:text-emerald-600"
      >
        Bí quyết tìm việc
      </Link>
      <Link
        href="#self-growth"
        className="block rounded-lg p-2 text-sm text-slate-800 hover:bg-emerald-50/50 hover:text-emerald-600"
      >
        Thị trường tuyển dụng & Xu hướng
      </Link>
    </div>
  );
}

export default CareerDropdown;
