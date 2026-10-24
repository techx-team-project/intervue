'use client';

import Modal from '@/components/ui/Modal';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { Briefcase, MapPin, Wallet } from 'lucide-react';
import JobPostStatusBadge from './JobPostStatusBadge';

interface JobPostPreviewModalProps {
  job: RecruiterJobPost;
  onClose: () => void;
}

const LEVEL_LABEL: Record<RecruiterJobPost['level'], string> = {
  INTERN: 'Intern',
  JUNIOR: 'Junior',
  MID: 'Middle',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

const CONTRACT_LABEL: Record<RecruiterJobPost['contractType'], string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship',
};

const ARRANGEMENT_LABEL: Record<RecruiterJobPost['workingArrangement'], string> = {
  ON_SITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
  FLEXIBLE: 'Flexible',
};

function formatSalary(salary: RecruiterJobPost['salary']): string {
  if (salary.negotiable || !salary.min || !salary.max) return 'Negotiable';
  const formatter = new Intl.NumberFormat('vi-VN');
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} ${salary.currency ?? 'VND'}`;
}

export default function JobPostPreviewModal({ job, onClose }: JobPostPreviewModalProps) {
  return (
    <Modal isOpen onClose={onClose} maxWidth="2xl" title="Job post preview">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-navy text-lg font-black">{job.title}</h3>
            <p className="mt-1 text-[13px] text-[#64748b]">
              {LEVEL_LABEL[job.level]} · {CONTRACT_LABEL[job.contractType]} ·{' '}
              {ARRANGEMENT_LABEL[job.workingArrangement]}
            </p>
          </div>
          <JobPostStatusBadge status={job.status} />
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-[12.5px] text-[#475569]">
            <MapPin className="h-4 w-4 shrink-0 text-[#64748b]" />
            <span>
              {job.location.city}
              {job.location.district ? `, ${job.location.district}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-[#475569]">
            <Wallet className="h-4 w-4 shrink-0 text-[#64748b]" />
            <span>{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-[#475569]">
            <Briefcase className="h-4 w-4 shrink-0 text-[#64748b]" />
            <span>{job.recruitsCount} openings</span>
          </div>
        </div>

        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <PreviewSection title="Job description" content={job.description} />
        <PreviewSection title="Candidate requirements" content={job.requirements} />
        <PreviewSection title="Benefits" content={job.benefits} />

        {job.screeningQuestions.length > 0 && (
          <div>
            <h4 className="text-navy text-[13.5px] font-bold">Screening questions</h4>
            <ul className="mt-2 space-y-1.5">
              {job.screeningQuestions.map((question) => (
                <li key={question.id} className="text-[12.5px] text-[#475569]">
                  • {question.question} {question.required && <span className="text-rose-500">*</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}

function PreviewSection({ title, content }: { title: string; content: string }) {
  if (!content) return null;

  return (
    <div>
      <h4 className="text-navy text-[13.5px] font-bold">{title}</h4>
      <p className="mt-1.5 text-[12.5px] leading-relaxed whitespace-pre-line text-[#475569]">{content}</p>
    </div>
  );
}
