import CompanyLogo from '@/components/jobs/CompanyLogo';
import type { FollowedCompany } from '@/types/candidate-saved';
import Link from 'next/link';
import FollowCompanyButton from './FollowCompanyButton';

export default function FollowedCompanyCard({ followed }: { followed: FollowedCompany }) {
  const { company } = followed;

  return (
    <article className="bg-surface flex items-center gap-4 rounded-xl p-4 shadow-2xs">
      <Link href={`/companies/${company.id}`} aria-label={company.name} className="shrink-0">
        <CompanyLogo name={company.name} src={company.logoUrl} className="h-16 w-16 rounded-lg" />
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="text-on-surface truncate text-sm font-bold">
          <Link href={`/companies/${company.id}`} className="hover:text-primary">
            {company.tradingName ?? company.name}
          </Link>
        </h3>
        {company.industry && <p className="text-on-surface-variant truncate text-xs">{company.industry}</p>}
        {company.address && <p className="text-on-surface-variant truncate text-xs">{company.address}</p>}
      </div>
      <FollowCompanyButton companyId={company.id} />
    </article>
  );
}
