import Reveal from '@/components/ui/Reveal';
import { HOME_CATEGORIES } from '@/constants/home/categories';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../SectionHeader';

export default function TopCategoriesSection() {
  return (
    <section aria-labelledby="categories-title" className="bg-surface-container-low py-24">
      <div className="container-page grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            id="categories-title"
            index="01"
            eyebrow="Explore by field"
            title="Which technology path do you want to follow?"
            description="Pick a category to see matching open positions right away."
          />
        </Reveal>

        <Reveal delay={1}>
          <ul className="border-outline-variant border-t">
            {HOME_CATEGORIES.map(({ id, label, keyword, icon: Icon }, index) => (
              <li key={id} className="border-outline-variant border-b">
                <Link
                  href={`/jobs?q=${encodeURIComponent(keyword)}`}
                  className="group ease-standard hover:bg-primary-deeper -mx-4 flex items-center gap-5 rounded-2xl px-4 py-4 transition-colors duration-300"
                >
                  <span className="font-display text-body-md text-on-surface-variant group-hover:text-primary-bright w-7 font-bold tabular-nums transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-title-lg text-on-surface flex-1 font-bold transition-colors duration-300 group-hover:text-white">
                    {label}
                  </span>
                  <Icon
                    className="text-outline group-hover:text-primary-bright h-5 w-5 transition-colors duration-300"
                    aria-hidden
                  />
                  <ArrowUpRight
                    className="text-outline ease-standard group-hover:text-primary-bright h-5 w-5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
