'use client';

import { ArrowRight, Briefcase, Calculator, Compass, GraduationCap, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface CategoryCardItem {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  icon: LucideIcon;
  tags: string[];
  articleCount: number;
}

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: 'orientation',
    name: 'Định hướng nghề nghiệp',
    slug: 'dinh-huong-nghe-nghiep',
    shortDesc: 'Khám phá tiềm năng, xác định đam mê Ikigai và lộ trình thăng tiến sự nghiệp bền vững.',
    icon: Compass,
    tags: ['Ikigai Model', 'Career Path', 'Growth Roadmaps', 'Graduate Playbook'],
    articleCount: 6,
  },
  {
    id: 'tips',
    name: 'Bí quyết tìm việc',
    slug: 'bi-kip-tim-viec',
    shortDesc: 'Viết CV chuẩn ATS, kịch bản trả lời 50+ câu hỏi phỏng vấn hóc búa và đàm phán offer.',
    icon: Briefcase,
    tags: ['ATS Resume', 'STAR Interviews', 'Salary Negotiation', 'Probation Success'],
    articleCount: 6,
  },
  {
    id: 'salary',
    name: 'Chế độ hưởng lương',
    slug: 'che-do-luong-thuong',
    shortDesc: 'Công cụ tính Lương Gross sang Net 2026, chế độ bảo hiểm xã hội (BHXH) và quyền lợi lao động.',
    icon: Calculator,
    tags: ['Gross ➔ Net', 'Social Insurance', '13th Month Bonus', '7-Tier PIT Tax'],
    articleCount: 6,
  },
  {
    id: 'skills',
    name: 'Kiến thức chuyên ngành',
    slug: 'kien-thuc-chuyen-nganh',
    shortDesc: 'Kho tri thức thực chiến sâu rộng: Công nghệ thông tin / AI, Marketing số, Sales và Logistics.',
    icon: GraduationCap,
    tags: ['Software Engineering', 'Generative AI', 'Product Management', 'DevOps & Cloud'],
    articleCount: 6,
  },
];

export default function BlogCategoryShowcase() {
  return (
    <section className="py-8">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-headline-lg text-primary font-bold">Chuyên mục cẩm nang</h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Kiến thức ngành, chính sách lao động và xu hướng tuyển dụng 2026
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-4">
        {CATEGORY_CARDS.map(({ id, name, slug, shortDesc, icon: Icon, tags, articleCount }) => (
          <Link
            key={id}
            href={`/blog/${slug}`}
            className="group bg-surface ease-standard hover:shadow-elevation-1 hover:border-primary flex flex-col justify-between rounded-xl border border-transparent p-6 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-primary-container text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="bg-surface-container-low text-label-md text-on-surface-variant rounded-full px-3 py-1">
                  {articleCount} bài viết
                </span>
              </div>

              <h3 className="text-title-lg text-on-surface group-hover:text-primary mt-5 font-bold transition-colors">
                {name}
              </h3>
              <p className="text-body-md text-on-surface-variant mt-2 line-clamp-3">{shortDesc}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="bg-surface-container-low text-label-md text-on-surface-variant rounded-full px-2.5 py-1"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <span className="text-label-lg text-primary mt-6 flex items-center gap-1 font-semibold">
              Xem chuyên mục
              <ArrowRight
                className="ease-standard h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
