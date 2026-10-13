import { ArrowRight, ChevronRight } from 'lucide-react';

import { JOB_CATEGORIES } from '@/mocks/home/job-categories.mock';

export default function TopCategoriesSection() {
  return (
    <section className="container-topcv my-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-navy text-xl font-bold md:text-2xl">Top ngành nghề nổi bật</h2>
          <p className="mt-1 text-[14px] text-[#6f7882]">
            Bạn muốn tìm việc làm ở lĩnh vực nào? Khám phá ngay cơ hội phù hợp
          </p>
        </div>

        <a
          href="https://www.topcv.vn/viec-lam"
          target="_blank"
          rel="noreferrer"
          className="text-primary hidden items-center gap-1 text-[14px] font-semibold hover:underline sm:inline-flex"
        >
          Xem tất cả ngành nghề
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {JOB_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className={`rounded-2xl border border-[#e9eaec] bg-white p-4.5 ${cat.border} group flex cursor-pointer items-center gap-4 transition-all duration-200 hover:shadow-md`}
            >
              <div
                className={`h-12 w-12 rounded-xl ${cat.bg} ${cat.color} flex shrink-0 items-center justify-center transition-transform group-hover:scale-110`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-navy group-hover:text-primary truncate text-[14.5px] font-bold transition-colors">
                  {cat.name}
                </h3>
                <div className="text-primary mt-0.5 text-[13px] font-semibold">{cat.count} việc làm</div>
              </div>

              <ChevronRight className="group-hover:text-primary h-4 w-4 shrink-0 text-[#939ca5] transition-all group-hover:translate-x-0.5" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
