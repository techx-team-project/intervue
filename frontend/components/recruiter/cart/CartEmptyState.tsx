import { ROUTES } from '@/constants/routes';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartEmptyState() {
  return (
    <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center">
      <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
        <ShoppingCart className="h-6 w-6" />
      </div>
      <h4 className="text-on-surface mt-3 text-sm font-bold">Giỏ hàng đang trống</h4>
      <p className="text-on-surface-variant mt-1 text-xs">Chọn gói dịch vụ phù hợp để bắt đầu.</p>
      <Link
        href={ROUTES.RECRUITER_SERVICES}
        className="bg-primary mt-5 inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition hover:brightness-95"
      >
        Xem các gói dịch vụ
      </Link>
    </div>
  );
}
