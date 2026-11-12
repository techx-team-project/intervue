import { JOB_ROLE_LABELS } from '@/constants/recruiter-job';
import type { PublicJobResource } from '@/types/public-job';
import { textLines } from '@/utils/public-job';

const EMPLOYMENT_TYPES = { FULL_TIME: 'FULL_TIME', PART_TIME: 'PART_TIME', INTERNSHIP: 'INTERN' } as const;
const MONTHS_PER_YEAR = 12;
const COUNTRY = 'VN';
const END_OF_DEADLINE = 'T23:59:59+07:00';

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => HTML_ESCAPES[char]);
}

function section(title: string, text?: string): string {
  const lines = textLines(text);
  if (lines.length === 0) return '';
  return `<h3>${title}</h3><ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
}

export function buildJobPostingJsonLd(job: PublicJobResource) {
  const { salary, experience, location } = job;
  const hasSalary = !salary.negotiable && salary.min != null && salary.max != null;
  const minYears = experience?.minYears ?? 0;
  const isRemote = job.workingArrangement === 'REMOTE';

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: [
      section('Job description', job.description),
      section('Requirements', job.requirements),
      section('Benefits', job.benefits),
    ].join(''),
    datePosted: job.publishedAt,
    validThrough: job.deadline ? `${job.deadline}${END_OF_DEADLINE}` : undefined,
    employmentType: job.contractType ? EMPLOYMENT_TYPES[job.contractType] : undefined,
    directApply: true,
    identifier: { '@type': 'PropertyValue', name: job.company.name, value: String(job.id) },
    hiringOrganization: { '@type': 'Organization', name: job.company.name, logo: job.company.logoUrl },
    jobLocation: location.city
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            streetAddress: location.address,
            addressLocality: location.city,
            addressCountry: COUNTRY,
          },
          geo:
            location.latitude != null && location.longitude != null
              ? { '@type': 'GeoCoordinates', latitude: location.latitude, longitude: location.longitude }
              : undefined,
        }
      : undefined,
    jobLocationType: isRemote ? 'TELECOMMUTE' : undefined,
    applicantLocationRequirements: isRemote ? { '@type': 'Country', name: COUNTRY } : undefined,
    baseSalary: hasSalary
      ? {
          '@type': 'MonetaryAmount',
          currency: salary.currency ?? 'VND',
          value: { '@type': 'QuantitativeValue', minValue: salary.min, maxValue: salary.max, unitText: 'MONTH' },
        }
      : undefined,
    experienceRequirements:
      minYears > 0
        ? { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: minYears * MONTHS_PER_YEAR }
        : undefined,
    skills: job.skills.length > 0 ? job.skills.map((skill) => skill.name).join(', ') : undefined,
    occupationalCategory: job.jobRole ? JOB_ROLE_LABELS[job.jobRole] : undefined,
  };
}

// "<" is escaped so recruiter text can never close the script tag
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
