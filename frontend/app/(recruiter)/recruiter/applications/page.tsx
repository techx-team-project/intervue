import BoardVariantPreview from '@/components/recruiter/applications/BoardVariantPreview';
import PageHeader from '@/components/recruiter/PageHeader';
import { APPLICATIONS_BOARD_VARIANTS } from '@/constants/application-board';
import { ROUTES } from '@/constants/routes';
import { ArrowRight, Bookmark, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const SHARED_CAPABILITIES = [
  'Sáu cột theo đúng luồng trạng thái hồ sơ, cột cuối gộp các trạng thái đã kết thúc',
  'Kéo thả hồ sơ giữa các cột, kèm menu "Chuyển trạng thái" cho người không dùng chuột',
  'Tìm kiếm, lọc theo tin tuyển dụng, điểm phù hợp AI, nguồn hồ sơ và sắp xếp',
  'Chọn nhiều hồ sơ để chuyển trạng thái, lưu ứng viên hoặc kết thúc hàng loạt',
  'Chi tiết hồ sơ với 6 tab: tổng quan, CV, câu hỏi sàng lọc, đánh giá AI, ghi chú nội bộ, lịch sử',
  'Bắt buộc nhập lý do khi kết thúc hồ sơ, xác nhận khi tuyển, đặt lịch khi chuyển sang phỏng vấn',
];

export default function RecruiterApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Hồ sơ ứng tuyển"
        description="Chọn một phong cách board để xem thử trên dữ liệu thật. Cả bốn phong cách dùng chung dữ liệu và chức năng, chỉ khác cách trình bày."
        actions={
          <Link
            href={ROUTES.RECRUITER_CANDIDATES_SAVED}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Bookmark className="h-4 w-4" />
            Ứng viên đã lưu
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {APPLICATIONS_BOARD_VARIANTS.map((variant) => (
          <Link
            key={variant.id}
            href={variant.href}
            className="hover:border-primary group flex flex-col rounded-2xl border border-[#e5e9ef] bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <BoardVariantPreview variant={variant.id} />

            <div className="mt-3.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-primary text-[11px] font-bold tracking-wide uppercase">{variant.tagline}</p>
                <h2 className="text-navy mt-0.5 text-[15.5px] font-black">{variant.label}</h2>
              </div>
              <span className="text-primary group-hover:bg-primary mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 transition-colors group-hover:text-white">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#64748b]">{variant.description}</p>

            <ul className="mt-3 space-y-1.5 border-t border-[#f1f5f9] pt-3">
              {variant.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-[12px] leading-relaxed text-[#475569]">
                  <CheckCircle2 className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <section className="mt-4 rounded-2xl border border-[#e5e9ef] bg-white p-4 shadow-xs sm:p-5">
        <h2 className="text-navy text-[14px] font-bold">Chức năng giống nhau ở cả bốn phong cách</h2>
        <p className="mt-0.5 text-[12px] text-[#64748b]">
          Phần dữ liệu, bộ lọc, luồng xử lý và các cửa sổ xác nhận được viết một lần và dùng chung, nên bạn chỉ cần so
          sánh cách trình bày.
        </p>

        <ul className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {SHARED_CAPABILITIES.map((capability) => (
            <li key={capability} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-[#475569]">
              <CheckCircle2 className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{capability}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
