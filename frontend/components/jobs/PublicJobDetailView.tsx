'use client';

import { JobSkillTags } from '@/components/jobs/listing/JobCardParts';
import { Button } from '@/components/ui/Button';
import { useRelatedJobs } from '@/hooks/useRelatedJobs';
import type { PublicJobResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import { textLines } from '@/utils/public-job';
import { ChevronRight, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CandidateApplyModal from './apply/CandidateApplyModal';
import JobApplySteps from './detail/JobApplySteps';
import JobCompensationSection from './detail/JobCompensationSection';
import JobDetailHeader from './detail/JobDetailHeader';
import JobDetailNav, { type JobDetailNavItem } from './detail/JobDetailNav';
import JobBenefitTags from './detail/JobBenefitTags';
import JobDetailSection from './detail/JobDetailSection';
import JobHiringProcessSection from './detail/JobHiringProcessSection';
import JobDetailSidebar from './detail/JobDetailSidebar';
import JobLocationSection from './detail/JobLocationSection';
import JobOverviewSection from './detail/JobOverviewSection';
import RelatedJobsSection from './detail/RelatedJobsSection';

const MAX_SKILLS = 30;

interface PublicJobDetailViewProps {
  job: PublicJobResource;
}

export default function PublicJobDetailView({ job }: PublicJobDetailViewProps) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const openApply = () => setIsApplyOpen(true);
  const related = useRelatedJobs(job);

  const description = textLines(job.description);
  const requirements = textLines(job.requirements);
  const benefits = textLines(job.benefits);
  const hasRelated = related.isLoading || related.similarShown.length > 0 || related.sameCompany.length > 0;

  const navItems: JobDetailNavItem[] = [
    { id: 'overview', label: 'Overview' },
    description.length > 0 && { id: 'description', label: 'Description' },
    (requirements.length > 0 || job.skills.length > 0) && { id: 'requirements', label: 'Requirements' },
    { id: 'compensation', label: 'Compensation' },
    (benefits.length > 0 || job.benefitTags.length > 0) && { id: 'benefits', label: 'Benefits' },
    job.hiringSteps.length > 0 && { id: 'process', label: 'Hiring process' },
    { id: 'location', label: 'Location & schedule' },
    hasRelated && { id: 'related', label: 'Related jobs' },
  ].filter((item): item is JobDetailNavItem => Boolean(item));

  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-primary-deeper">
        <div className="container-page text-body-sm flex items-center gap-1.5 py-3.5 text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <Link href="/jobs" className="hover:text-white">
            Jobs
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <span className="truncate text-white/90">{job.title}</span>
        </div>
      </nav>

      <div className="container-page grid items-start gap-6 py-8 pb-28 lg:grid-cols-[minmax(0,1fr)_22rem] lg:pb-12">
        <div className="min-w-0 space-y-4">
          <JobDetailHeader job={job} />
          <JobDetailNav items={navItems} />
          <JobOverviewSection job={job} index="01" />
          <JobDetailSection id="description" title="Job description" index="02" lines={description} />
          <JobDetailSection id="requirements" title="Candidate requirements" index="03" lines={requirements}>
            {job.skills.length > 0 && (
              <div className={requirements.length > 0 ? 'border-outline-variant mt-6 border-t pt-5' : ''}>
                <p className="text-label-lg text-on-surface-variant mb-3 font-semibold">Skills</p>
                <JobSkillTags skills={job.skills} max={MAX_SKILLS} />
              </div>
            )}
          </JobDetailSection>
          <JobCompensationSection job={job} similar={related.similar} index="04" />
          <JobDetailSection id="benefits" title="Benefits" index="05" lines={benefits}>
            <JobBenefitTags tags={job.benefitTags} hasLines={benefits.length > 0} />
          </JobDetailSection>
          <JobHiringProcessSection steps={job.hiringSteps} index="06" />
          <JobLocationSection job={job} index="07" />
          <JobApplySteps job={job} />
          <RelatedJobsSection
            job={job}
            similar={related.similarShown}
            sameCompany={related.sameCompany}
            isLoading={related.isLoading}
          />
        </div>

        <JobDetailSidebar job={job} onApply={openApply} />
      </div>

      <div className="bg-surface border-outline-variant fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t px-4 py-3 lg:hidden">
        <p className="font-display text-title-md text-primary min-w-0 truncate font-bold">{formatSalary(job.salary)}</p>
        <Button size="lg" leftIcon={<Send className="h-4 w-4" aria-hidden />} onClick={openApply}>
          Apply now
        </Button>
      </div>

      <CandidateApplyModal
        job={{
          id: job.id,
          title: job.title,
          companyName: job.company.name,
          requirements,
          description: job.description,
        }}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />
    </>
  );
}
