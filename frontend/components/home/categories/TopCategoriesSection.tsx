import Reveal from '@/components/ui/Reveal';
import { HOME_CATEGORIES } from '@/constants/home/categories';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../SectionHeader';

export default function TopCategoriesSection() {
  return (
    <section aria-labelledby="categories-title" className="bg-surface py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            id="categories-title"
            eyebrow="Explore by field"
            title="Which technology path do you want to follow?"
            description="Pick a category to see matching open positions right away."
            align="center"
          />
        </Reveal>

        <Reveal delay={1}>
          <ul className="expanded:grid-cols-4 medium:grid-cols-3 grid grid-cols-2 gap-4">
            {HOME_CATEGORIES.map(({ id, label, keyword, icon: Icon }) => (
              <li key={id}>
                <Link
                  href={`/jobs?q=${encodeURIComponent(keyword)}`}
                  className="group bg-surface-container-low ease-standard hover:bg-primary-deeper flex h-full flex-col justify-between gap-8 rounded-3xl p-6 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <span className="bg-surface text-primary ease-standard group-hover:bg-primary flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 group-hover:text-white">
                      <Icon className="h-7 w-7" aria-hidden />
                    </span>
                    <ArrowUpRight
                      className="text-outline ease-standard group-hover:text-primary-bright h-5 w-5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </div>
                  <span className="font-display text-title-lg text-on-surface font-bold transition-colors duration-300 group-hover:text-white">
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
