import React from 'react';
import Link from 'next/link';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="animate-in slide-in-from-top-2 space-y-3 border-t border-slate-200 bg-white px-5 py-4 duration-150 lg:hidden">
      <Link
        href="#feature-jobs"
        onClick={onClose}
        className="block py-2 text-sm font-semibold text-slate-800 hover:text-emerald-600"
      >
        Việc làm
      </Link>
      <Link
        href="#self-growth"
        onClick={onClose}
        className="block py-2 text-sm font-semibold text-slate-800 hover:text-emerald-600"
      >
        Tạo CV
      </Link>
      <Link
        href="#superior-tool"
        onClick={onClose}
        className="block py-2 text-sm font-semibold text-slate-800 hover:text-emerald-600"
      >
        Công cụ
      </Link>
      <Link
        href="/career-orientation"
        onClick={onClose}
        className="block py-2 text-sm font-semibold text-slate-800 hover:text-emerald-600"
      >
        Cẩm nang nghề nghiệp
      </Link>
      <Link
        href="/upgrade"
        onClick={onClose}
        className="block py-2 text-sm font-semibold text-slate-800 hover:text-emerald-600"
      >
        Nâng cấp VIP
      </Link>

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
        <Link
          href="/register"
          onClick={onClose}
          className="w-full rounded-xl border border-emerald-600 py-2.5 text-center text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
        >
          Đăng ký
        </Link>
        <Link
          href="/login"
          onClick={onClose}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default MobileNavDrawer;
