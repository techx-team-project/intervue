import { HOME_CATEGORIES } from '@/constants/home/categories';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import HomeSection from '../HomeSection';
import SectionHeader from '../SectionHeader';

export default function TopCategoriesSection() {
  return (
    <HomeSection titleId="categories-title">
      <SectionHeader
        id="categories-title"
        title="Việc làm theo nhóm ngành IT"
        description="Bạn muốn tìm việc ở lĩnh vực nào? Chọn nhóm công nghệ bạn quan tâm."
      />
      <ul className="expanded:grid-cols-4 medium:grid-cols-3 grid grid-cols-2 gap-4">
        {HOME_CATEGORIES.map(({ id, label, keyword, icon: Icon }) => (
          <li key={id}>
            <Link
              href={`/jobs?q=${encodeURIComponent(keyword)}`}
              className="group border-outline-variant hover:border-primary rounded-shape-lg ease-standard flex h-20 items-center gap-3 border px-4 transition-colors duration-150"
            >
              <span className="bg-primary-container text-primary rounded-shape-md flex h-12 w-12 shrink-0 items-center justify-center">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-title-sm text-on-surface group-hover:text-primary flex-1 transition-colors">
                {label}
              </span>
              <ChevronRight className="text-on-surface-variant group-hover:text-primary h-4 w-4" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
