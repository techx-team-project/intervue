'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Briefcase, Calculator, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

interface CategoryCardItem {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  icon: React.ReactNode;
  tags: string[];
  articleCount: number;
  gradientBg: string;
  badge: string;
  accentBorder: string;
}

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: 'orientation',
    name: 'Định hướng nghề nghiệp',
    slug: 'dinh-huong-nghe-nghiep',
    shortDesc: 'Khám phá tiềm năng, xác định đam mê Ikigai và lộ trình thăng tiến sự nghiệp bền vững.',
    icon: <Compass className="h-6 w-6 text-emerald-600" />,
    tags: ['Mô hình Ikigai', 'Chọn ngành chọn nghề', 'Lộ trình thăng tiến', 'Sinh viên ra trường'],
    articleCount: 6,
    gradientBg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    badge: 'Định hướng',
    accentBorder: 'hover:border-emerald-500/60',
  },
  {
    id: 'tips',
    name: 'Bí quyết tìm việc',
    slug: 'bi-kip-tim-viec',
    shortDesc: 'Viết CV chuẩn ATS, kịch bản trả lời 50+ câu hỏi phỏng vấn hóc búa và đàm phán offer.',
    icon: <Briefcase className="h-6 w-6 text-blue-600" />,
    tags: ['CV chuẩn ATS', 'Kỹ năng phỏng vấn', 'Đàm phán lương', 'Vượt qua thử việc'],
    articleCount: 6,
    gradientBg: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    badge: 'Chinh phục HR',
    accentBorder: 'hover:border-blue-500/60',
  },
  {
    id: 'salary',
    name: 'Chế độ hưởng lương',
    slug: 'che-do-luong-thuong',
    shortDesc: 'Công cụ tính Lương Gross sang Net 2026, chế độ bảo hiểm xã hội (BHXH) và quyền lợi lao động.',
    icon: <Calculator className="h-6 w-6 text-amber-600" />,
    tags: ['Lương Gross ➔ Net', 'Bảo hiểm xã hội', 'Thưởng tháng 13', 'Thuế TNCN 7 bậc'],
    articleCount: 6,
    gradientBg: 'from-amber-500/10 via-orange-500/5 to-transparent',
    badge: 'Minh bạch quyền lợi',
    accentBorder: 'hover:border-amber-500/60',
  },
  {
    id: 'skills',
    name: 'Kiến thức chuyên ngành',
    slug: 'kien-thuc-chuyen-nganh',
    shortDesc: 'Kho tri thức thực chiến sâu rộng: Công nghệ thông tin / AI, Marketing số, Sales và Logistics.',
    icon: <GraduationCap className="h-6 w-6 text-violet-600" />,
    tags: ['IT & Trí tuệ nhân tạo', 'Digital Marketing', 'B2B Sales', 'Xuất nhập khẩu C&B'],
    articleCount: 6,
    gradientBg: 'from-violet-500/10 via-purple-500/5 to-transparent',
    badge: 'Chuyên môn sâu',
    accentBorder: 'hover:border-violet-500/60',
  },
];

export default function BlogCategoryShowcase() {
  return (
    <section className="py-8">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold tracking-wider text-[#00b14f] uppercase">4 Trụ Cột Tri Thức</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
            Chuyên mục Cẩm nang Nghề nghiệp
          </h2>
        </div>
        <p className="text-xs text-gray-500 sm:text-right">
          Cập nhật thông tin thực chiến, chính sách pháp luật và xu hướng mới nhất 2026
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CATEGORY_CARDS.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog/${cat.slug}`}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cat.accentBorder}`}
          >
            {/* Background subtle gradient */}
            <div
              className={`pointer-events-none absolute inset-0 bg-linear-to-b ${cat.gradientBg} opacity-60 transition duration-300 group-hover:opacity-100`}
            />

            <div className="relative">
              {/* Header Icon & Count Badge */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110">
                  {cat.icon}
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 transition group-hover:bg-[#00b14f] group-hover:text-white">
                  {cat.articleCount} bài viết
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-5 text-lg font-bold text-[#0f172a] transition group-hover:text-[#00b14f]">
                {cat.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600">{cat.shortDesc}</p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {cat.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-gray-200/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="relative mt-6 flex items-center gap-1 text-xs font-bold text-[#00b14f] transition-all duration-200 group-hover:translate-x-1">
              <span>Khám phá chuyên mục</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
