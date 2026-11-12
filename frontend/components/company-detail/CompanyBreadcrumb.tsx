import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CompanyBreadcrumbProps {
  companyName: string;
}

export default function CompanyBreadcrumb({ companyName }: CompanyBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-primary-deeper">
      <div className="container-page text-body-sm flex items-center gap-1.5 py-3.5 text-white/60">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <Link href="/#top-companies" className="hover:text-white">
          Companies
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="truncate text-white/90">{companyName}</span>
      </div>
    </nav>
  );
}
