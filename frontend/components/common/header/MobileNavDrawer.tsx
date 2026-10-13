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
        className="text-navy hover:text-primary block py-2 text-sm font-semibold"
      >
        Việc làm
      </Link>
      <Link
        href="/cv-templates"
        onClick={onClose}
        className="text-navy hover:text-primary block py-2 text-sm font-semibold"
      >
        Tạo CV
      </Link>
      <Link
        href="#superior-tool"
        onClick={onClose}
        className="text-navy hover:text-primary block py-2 text-sm font-semibold"
      >
        Công cụ
      </Link>
      <Link href="/blog" onClick={onClose} className="text-navy hover:text-primary block py-2 text-sm font-semibold">
        Cẩm nang nghề nghiệp
      </Link>
      <Link href="/upgrade" onClick={onClose} className="text-navy hover:text-primary block py-2 text-sm font-semibold">
        Nâng cấp VIP
      </Link>

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
        <Link
          href="/register"
          onClick={onClose}
          className="border-primary text-primary hover:bg-primary-light w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors"
        >
          Đăng ký
        </Link>
        <Link
          href="/login"
          onClick={onClose}
          className="bg-primary hover:bg-primary-hover w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default MobileNavDrawer;
