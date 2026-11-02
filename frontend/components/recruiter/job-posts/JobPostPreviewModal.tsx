'use client';

import Modal from '@/components/ui/Modal';
import { JOB_ARRANGEMENT_LABELS, JOB_CONTRACT_LABELS, JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { Briefcase, MapPin, Wallet } from 'lucide-react';
import React from 'react';
import JobPostStatusBadge from './JobPostStatusBadge';

interface JobPostPreviewModalProps {
  job: RecruiterJobPost;
  onClose: () => void;
}

function formatSalary(salary: RecruiterJobPost['salary']): string {
  if (salary.negotiable || (!salary.min && !salary.max)) return 'Negotiable';
  const formatter = new Intl.NumberFormat('en-US');
  const minStr = salary.min ? formatter.format(salary.min) : '';
  const maxStr = salary.max ? formatter.format(salary.max) : '';
  const curr = salary.currency ?? 'VND';

  if (minStr && maxStr) return `${minStr} – ${maxStr} ${curr} / month`;
  if (minStr) return `From ${minStr} ${curr} / month`;
  return `Up to ${maxStr} ${curr} / month`;
}

function parseFormattedInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] font-semibold text-emerald-800"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed text-slate-700">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h5 key={idx} className="pt-2 font-bold text-slate-900">
              {trimmed.substring(4)}
            </h5>
          );
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <div className="flex-1">{parseFormattedInline(trimmed.substring(2))}</div>
            </div>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="shrink-0 font-bold text-emerald-700">{numberedMatch[1]}.</span>
              <div className="flex-1">{parseFormattedInline(numberedMatch[2])}</div>
            </div>
          );
        }

        return <p key={idx}>{parseFormattedInline(line)}</p>;
      })}
    </div>
  );
}

export default function JobPostPreviewModal({ job, onClose }: JobPostPreviewModalProps) {
  return (
    <Modal isOpen onClose={onClose} maxWidth="2xl" title="Candidate View Preview">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-navy text-xl font-black">{job.title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {JOB_LEVEL_LABELS[job.level]} · {JOB_CONTRACT_LABELS[job.contractType]} ·{' '}
              {JOB_ARRANGEMENT_LABELS[job.workingArrangement]}
            </p>
          </div>
          <JobPostStatusBadge status={job.status} />
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">
              {job.location.city}
              {job.location.district ? `, ${job.location.district}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <Wallet className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="font-semibold text-emerald-800">{formatSalary(job.salary)}</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
            <span>
              {job.recruitsCount || 1} opening{(job.recruitsCount || 1) > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Required Skills */}
        {job.skills.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">Required Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {job.description && (
          <div>
            <h4 className="text-navy mb-3 border-b border-slate-100 pb-2 text-sm font-bold">Role & Responsibilities</h4>
            <FormattedContent content={job.description} />
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div>
            <h4 className="text-navy mb-3 border-b border-slate-100 pb-2 text-sm font-bold">Candidate Requirements</h4>
            <FormattedContent content={job.requirements} />
          </div>
        )}

        {/* Benefits */}
        {job.benefits && (
          <div>
            <h4 className="text-navy mb-3 border-b border-slate-100 pb-2 text-sm font-bold">Perks & Benefits</h4>
            <FormattedContent content={job.benefits} />
          </div>
        )}

        {/* Screening questions */}
        {job.screeningQuestions.length > 0 && (
          <div>
            <h4 className="text-navy mb-3 border-b border-slate-100 pb-2 text-sm font-bold">
              Screening Questions ({job.screeningQuestions.length})
            </h4>
            <ul className="space-y-2">
              {job.screeningQuestions.map((q, idx) => (
                <li
                  key={q.id}
                  className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-700"
                >
                  <span className="font-bold text-emerald-700">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">
                      {q.question} {q.required && <span className="font-bold text-rose-500">*</span>}
                    </p>
                    <span className="text-[10.5px] tracking-wide text-slate-400 uppercase">Type: {q.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
