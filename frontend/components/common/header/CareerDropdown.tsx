import React from 'react';
import Link from 'next/link';

export function CareerDropdown() {
  return (
    <div className="animate-in fade-in absolute top-15 left-0 z-50 w-72 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl duration-150">
      <Link href="/blog" className="text-primary hover:bg-primary-light block rounded-lg p-2 text-sm font-bold">
        Tất cả cẩm nang nghề nghiệp
      </Link>
      <Link
        href="/blog/dinh-huong-nghe-nghiep"
        className="text-navy hover:bg-primary-light hover:text-primary block rounded-lg p-2 text-sm"
      >
        Định hướng nghề nghiệp
      </Link>
      <Link
        href="/blog/bi-kip-tim-viec"
        className="text-navy hover:bg-primary-light hover:text-primary block rounded-lg p-2 text-sm"
      >
        Bí quyết tìm việc
      </Link>
      <Link
        href="/blog/che-do-luong-thuong"
        className="text-navy hover:bg-primary-light hover:text-primary block rounded-lg p-2 text-sm"
      >
        Chế độ lương thưởng
      </Link>
      <Link
        href="/blog/kien-thuc-chuyen-nganh"
        className="text-navy hover:bg-primary-light hover:text-primary block rounded-lg p-2 text-sm"
      >
        Kiến thức chuyên ngành
      </Link>
    </div>
  );
}

export default CareerDropdown;
