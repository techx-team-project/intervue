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
    <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs sm:p-6">
      <h2 className="border-primary text-on-surface mb-3 border-l-4 pl-3 text-lg font-bold">{title}</h2>
      <ul className="text-body-md text-on-surface space-y-2 leading-relaxed">
        {lines.map((line, index) => (
          <li key={index} className="flex gap-2.5">
            <span className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
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
    <div className="container-page space-y-5 py-6">
      <nav aria-label="Breadcrumb" className="text-on-surface-variant text-xs">
        <Link href="/jobs" className="hover:underline">
          Việc làm
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-on-surface">{job.title}</span>
      </nav>

      <header className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-16 w-16" />
            <div className="min-w-0 space-y-2">
              <h1 className="text-on-surface text-xl leading-snug font-bold sm:text-2xl">{job.title}</h1>
              <Link
                href={`/companies/${job.company.id}`}
                className="text-on-surface-variant block text-sm font-medium hover:underline"
              >
                {job.company.name}
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                <span className="bg-primary-light text-primary rounded-md px-2.5 py-0.5 font-extrabold">
                  {formatSalary(job.salary)}
                </span>
                {job.location.city && (
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <MapPin className="text-outline h-4 w-4" aria-hidden />
                    {job.location.city}
                  </span>
                )}
                {job.deadline && (
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <Clock className="text-outline h-4 w-4" aria-hidden />
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
          <p className="bg-surface-container-low text-on-surface-variant mt-4 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs">
            <FileQuestion className="text-outline h-4 w-4" aria-hidden />
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
            <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs sm:p-6">
              <h2 className="border-primary text-on-surface mb-3 border-l-4 pl-3 text-lg font-bold">Kỹ năng</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-surface-container-high text-on-surface rounded-lg px-3 py-1 text-xs font-semibold"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="border-primary/30 rounded-2xl border bg-emerald-50/60 p-5 text-center">
            <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => setIsApplyOpen(true)}>
              Ứng tuyển vị trí này
            </Button>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
          <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <CompanyLogo name={job.company.name} src={job.company.logoUrl} />
              <p className="text-on-surface text-sm font-bold">{job.company.name}</p>
            </div>
            {job.company.address && (
              <p className="text-on-surface-variant mt-3 text-xs leading-relaxed">{job.company.address}</p>
            )}
            <Link
              href={`/companies/${job.company.id}`}
              className="text-primary mt-3 inline-block text-xs font-bold hover:underline"
            >
              Xem trang công ty
            </Link>
          </div>

          <div className="border-outline-variant space-y-3 rounded-2xl border bg-white p-5 shadow-2xs">
            <h3 className="text-on-surface text-sm font-bold">Thông tin chung</h3>
            <dl className="text-body-md space-y-2.5">
              {facts.map((fact) => (
                <dd key={fact} className="text-on-surface font-medium">
                  {fact}
                </dd>
              ))}
              <div className="text-on-surface-variant flex items-center gap-1.5">
                <Users className="text-outline h-4 w-4" aria-hidden />
                Số lượng tuyển: {job.openings}
              </div>
              {address && (
                <div className="text-on-surface-variant flex items-start gap-1.5">
                  <MapPin className="text-outline mt-0.5 h-4 w-4 shrink-0" aria-hidden />
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
