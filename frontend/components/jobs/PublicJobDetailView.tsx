'use client';

import { Button } from '@/components/ui/Button';
import type { PublicJobResource } from '@/types/public-job';
import { formatDate } from '@/utils/datetime';
import { formatSalary } from '@/utils/public-company';
import { deadlineLabel, jobFacts, textLines } from '@/utils/public-job';
import { Clock, FileQuestion, MapPin, Send, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CandidateApplyModal from './apply/CandidateApplyModal';
import CompanyLogo from './CompanyLogo';

interface PublicJobDetailViewProps {
  job: PublicJobResource;
}

function Section({ title, text }: { title: string; text?: string }) {
  const lines = textLines(text);
  if (lines.length === 0) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
      <h2 className="mb-3 border-l-4 border-emerald-600 pl-3 text-lg font-bold text-slate-900">{title}</h2>
      <ul className="space-y-2 text-[14.5px] leading-relaxed text-slate-700">
        {lines.map((line, index) => (
          <li key={index} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PublicJobDetailView({ job }: PublicJobDetailViewProps) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const facts = jobFacts({
    city: job.location.city,
    level: job.level,
    workingArrangement: job.workingArrangement,
    contractType: job.contractType,
  });
  const address = [job.location.address, job.location.city].filter(Boolean).join(', ');
  const hasQuestions = job.screening.questionCount > 0;

  return (
    <div className="container-topcv space-y-5 py-6">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <Link href="/jobs" className="hover:underline">
          Việc làm
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-700">{job.title}</span>
      </nav>

      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-16 w-16" />
            <div className="min-w-0 space-y-2">
              <h1 className="text-xl leading-snug font-black text-slate-900 sm:text-2xl">{job.title}</h1>
              <Link
                href={`/companies/${job.company.id}`}
                className="block text-sm font-medium text-slate-600 hover:underline"
              >
                {job.company.name}
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 font-extrabold text-[#00873c]">
                  {formatSalary(job.salary)}
                </span>
                {job.location.city && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
                    {job.location.city}
                  </span>
                )}
                {job.deadline && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400" aria-hidden />
                    {deadlineLabel(job.deadline)} · {formatDate(job.deadline)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button size="lg" leftIcon={<Send className="h-4 w-4" />} onClick={() => setIsApplyOpen(true)}>
            Ứng tuyển ngay
          </Button>
        </div>

        {hasQuestions && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
            <FileQuestion className="h-4 w-4 text-slate-400" aria-hidden />
            Nhà tuyển dụng có {job.screening.questionCount} câu hỏi sàng lọc
            {job.screening.requiredCount > 0 && ` (${job.screening.requiredCount} bắt buộc)`}, mất khoảng{' '}
            {job.screening.estimatedMinutes} phút.
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <Section title="Mô tả công việc" text={job.description} />
          <Section title="Yêu cầu ứng viên" text={job.requirements} />
          <Section title="Quyền lợi" text={job.benefits} />

          {job.skills.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
              <h2 className="mb-3 border-l-4 border-emerald-600 pl-3 text-lg font-bold text-slate-900">Kỹ năng</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 text-center">
            <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => setIsApplyOpen(true)}>
              Ứng tuyển vị trí này
            </Button>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <CompanyLogo name={job.company.name} src={job.company.logoUrl} />
              <p className="text-sm font-bold text-slate-900">{job.company.name}</p>
            </div>
            {job.company.address && (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">{job.company.address}</p>
            )}
            <Link
              href={`/companies/${job.company.id}`}
              className="text-primary mt-3 inline-block text-xs font-bold hover:underline"
            >
              Xem trang công ty
            </Link>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">Thông tin chung</h3>
            <dl className="space-y-2.5 text-[13px]">
              {facts.map((fact) => (
                <dd key={fact} className="font-medium text-slate-700">
                  {fact}
                </dd>
              ))}
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users className="h-4 w-4 text-slate-400" aria-hidden />
                Số lượng tuyển: {job.openings}
              </div>
              {address && (
                <div className="flex items-start gap-1.5 text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  {address}
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>

      <CandidateApplyModal
        job={{
          id: job.id,
          title: job.title,
          companyName: job.company.name,
          requirements: textLines(job.requirements),
          description: job.description,
        }}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />
    </div>
  );
}
