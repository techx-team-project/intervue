'use client';

import { DEFAULT_CURRENCY, FILTER_CURRENCIES, POSTED_OPTIONS, SALARY_PRESETS } from '@/constants/job-filters';
import { JOB_ARRANGEMENT_LABELS, JOB_CONTRACT_LABELS, JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import type { PublicJobFilters } from '@/types/job-filters';
import { formatSalaryFloor, parseSkillFilters, serializeSkillFilters } from '@/utils/job-filters';
import { ROUTES } from '@/constants/routes';
import { MapPinned } from 'lucide-react';
import Link from 'next/link';
import FilterChipGroup from './FilterChipGroup';
import JobAlertButton from './JobAlertButton';
import JobFilterSection from './JobFilterSection';
import JobSkillFilter from './JobSkillFilter';

type JobFiltersPanelProps = {
  filters: PublicJobFilters;
  onChange: (patch: Partial<PublicJobFilters>) => void;
};

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const LEVEL_OPTIONS = toOptions(JOB_LEVEL_LABELS);
const ARRANGEMENT_OPTIONS = toOptions(JOB_ARRANGEMENT_LABELS);
const CONTRACT_OPTIONS = toOptions(JOB_CONTRACT_LABELS);

export default function JobFiltersPanel({ filters, onChange }: JobFiltersPanelProps) {
  const currency = filters.currency || DEFAULT_CURRENCY;
  const skills = parseSkillFilters(filters.skills);
  const salaryOptions = SALARY_PRESETS[currency].map((amount) => ({
    value: String(amount),
    label: `${formatSalaryFloor(String(amount), currency)}+`,
  }));

  return (
    <div>
      <JobFilterSection title="Level" activeCount={filters.level ? 1 : 0}>
        <FilterChipGroup
          ariaLabel="Level"
          options={LEVEL_OPTIONS}
          value={filters.level}
          onChange={(level) => onChange({ level })}
        />
      </JobFilterSection>

      <JobFilterSection title="Work mode" activeCount={filters.workingArrangement ? 1 : 0}>
        <FilterChipGroup
          ariaLabel="Work mode"
          options={ARRANGEMENT_OPTIONS}
          value={filters.workingArrangement}
          onChange={(workingArrangement) => onChange({ workingArrangement })}
        />
      </JobFilterSection>

      <JobFilterSection title="Contract type" activeCount={filters.contractType ? 1 : 0}>
        <FilterChipGroup
          ariaLabel="Contract type"
          options={CONTRACT_OPTIONS}
          value={filters.contractType}
          onChange={(contractType) => onChange({ contractType })}
        />
      </JobFilterSection>

      <JobFilterSection title="Date posted" activeCount={filters.posted ? 1 : 0}>
        <FilterChipGroup
          ariaLabel="Date posted"
          options={POSTED_OPTIONS}
          value={filters.posted}
          onChange={(posted) => onChange({ posted })}
        />
      </JobFilterSection>

      <JobFilterSection title="Salary" activeCount={filters.salaryFrom ? 1 : 0}>
        <div className="space-y-3">
          <FilterChipGroup
            ariaLabel="Salary currency"
            allowClear={false}
            options={FILTER_CURRENCIES}
            value={currency}
            onChange={(next) => onChange({ currency: next === DEFAULT_CURRENCY ? '' : next, salaryFrom: '' })}
          />
          <FilterChipGroup
            ariaLabel="Minimum salary"
            options={salaryOptions}
            value={filters.salaryFrom}
            onChange={(salaryFrom) => onChange({ salaryFrom })}
          />
          <p className="text-label-md text-on-surface-variant">
            Jobs with a negotiable salary are hidden while this is on.
          </p>
        </div>
      </JobFilterSection>

      <JobFilterSection title="Skills" activeCount={skills.length}>
        <JobSkillFilter selected={skills} onChange={(next) => onChange({ skills: serializeSkillFilters(next) })} />
      </JobFilterSection>

      <div className="border-outline-variant mt-5 space-y-1 border-t pt-4">
        <Link
          href={ROUTES.JOBS_NEAR_ME}
          className="text-body-md text-on-surface hover:bg-surface-container-low hover:text-primary flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium transition-colors"
        >
          <MapPinned className="h-4 w-4 shrink-0" aria-hidden />
          Jobs near me
        </Link>
        <JobAlertButton filters={filters} />
      </div>
    </div>
  );
}
