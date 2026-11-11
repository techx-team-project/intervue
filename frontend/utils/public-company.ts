import type { CompanyDetail, CompanyJobItem, PublicCompanyResource } from '@/types/company';
import type { PublicJobSummaryResource } from '@/types/public-job';
import type { JobSalary } from '@/types/recruiter-job';
import { formatDate } from '@/utils/datetime';

const VND_UNIT = 1_000_000;

export function formatSalary(salary: JobSalary): string {
  if (salary.negotiable) return 'Negotiable';
  if (salary.min == null || salary.max == null) return 'Negotiable';
  const isUsd = salary.currency === 'USD';
  const divisor = isUsd ? 1 : VND_UNIT;
  return `${salary.min / divisor} - ${salary.max / divisor} ${isUsd ? 'USD' : 'M VND'}`;
}

function splitLines(text?: string): string[] {
  return (text ?? '')
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

function toJobItem(job: PublicJobSummaryResource): CompanyJobItem {
  return {
    id: job.id,
    title: job.title,
    salary: formatSalary(job.salary),
    location: job.city ?? '',
    deadline: job.deadline ? `Deadline ${formatDate(job.deadline)}` : '',
    tags: job.skills.map((skill) => skill.name),
  };
}

export function toCompanyDetail(company: PublicCompanyResource, jobs: PublicJobSummaryResource[]): CompanyDetail {
  return {
    id: company.id,
    name: company.tradingName || company.name,
    featured: company.featured,
    brandPageActive: company.brandPageActive,
    logo: company.logoUrl,
    size: company.size,
    industry: company.industry,
    website: company.website,
    email: company.email,
    phone: company.phone,
    address: company.address ?? '',
    description: splitLines(company.description),
    benefits: splitLines(company.benefits),
    photos: company.photoUrls,
    openJobsCount: jobs.length,
    jobs: jobs.map(toJobItem),
  };
}
