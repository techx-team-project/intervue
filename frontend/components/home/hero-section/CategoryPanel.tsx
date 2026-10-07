import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryPanelProps {
  categories: string[];
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function CategoryPanel({ categories, page, totalPages, onPrevPage, onNextPage }: CategoryPanelProps) {
  return (
    <div className="flex h-72 flex-col justify-between rounded-2xl border border-[#e9eaec] bg-white p-3.5 shadow-md md:col-span-3">
      <div className="space-y-0.5">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="group hover:bg-primary-light flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 transition-colors"
          >
            <span className="text-navy group-hover:text-primary truncate text-[13.5px] font-medium">{cat}</span>
            <ChevronRight className="group-hover:text-primary h-4 w-4 shrink-0 text-[#94a3b8]" />
          </div>
        ))}
      </div>

      {/* Pagination Bottom (1 / 5 with < >) */}
      <div className="flex items-center justify-between border-t border-[#f4f5f5] px-2 pt-2">
        <span className="text-[13px] font-medium text-[#7f878f]">
          {page} / {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevPage}
            className="text-navy hover:border-primary hover:text-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#e9eaec] bg-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onNextPage}
            className="text-navy hover:border-primary hover:text-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#e9eaec] bg-white transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
