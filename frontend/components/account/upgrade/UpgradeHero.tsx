import React from 'react';

export function UpgradeHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-emerald-50/50 px-4 py-12 text-center">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="mb-1.5 text-sm font-bold tracking-wider text-slate-800 uppercase sm:text-base">
          NÂNG CẤP TÀI KHOẢN
        </p>
        <h1 className="m-0 text-3xl leading-tight font-extrabold text-emerald-600 sm:text-4xl">
          Mở khóa nhiều quyền lợi hơn
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Nâng tầm hồ sơ ứng tuyển, loại bỏ mọi giới hạn tải CV và tiếp cận nhanh chóng với các Nhà tuyển dụng hàng đầu.
        </p>
      </div>
    </section>
  );
}

export default UpgradeHero;
