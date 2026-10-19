import { APPLICATION_SOURCE_LABEL } from '@/constants/application-status';
import type { RecruiterApplication } from '@/types/recruiter-application';
import { formatDate, formatInterviewMoment } from '@/utils/datetime';
import { Briefcase, CalendarClock, FileText, Mail, MapPin, Phone, Sparkles, XCircle } from 'lucide-react';

interface ApplicationOverviewTabProps {
  application: RecruiterApplication;
}

export default function ApplicationOverviewTab({ application }: ApplicationOverviewTabProps) {
  const { candidate, interview, rejection } = application;

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
          <p className="mb-2 text-[11px] font-bold text-[#94a3b8] uppercase">Thông tin liên hệ</p>
          <ul className="space-y-1.5 text-[12.5px] text-slate-700">
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
              <span className="truncate">{candidate.email}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
              <span>{candidate.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
              <span className="truncate">{candidate.location}</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
          <p className="mb-2 text-[11px] font-bold text-[#94a3b8] uppercase">Hồ sơ ứng tuyển</p>
          <ul className="space-y-1.5 text-[12.5px] text-slate-700">
            <li className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
              <span className="truncate">{application.jobTitle}</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
              <span>Nộp ngày {formatDate(application.appliedAt)}</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
              <span>{APPLICATION_SOURCE_LABEL[application.source]}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
        <p className="mb-2 text-[11px] font-bold text-[#94a3b8] uppercase">
          Kỹ năng nổi bật • {candidate.experienceYears} năm kinh nghiệm
        </p>
        <div className="flex flex-wrap gap-1.5">
          {candidate.topSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-[#eef2f7] bg-[#f8fafc] px-2 py-1 text-[11.5px] font-semibold text-[#475569]"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {interview && (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-3.5">
          <p className="mb-1.5 flex items-center gap-2 text-[12.5px] font-bold text-violet-700">
            <CalendarClock className="h-4 w-4" />
            Lịch phỏng vấn
          </p>
          <p className="text-[12.5px] font-semibold text-violet-900">{formatInterviewMoment(interview.scheduledAt)}</p>
          <p className="mt-0.5 text-[12px] text-violet-800">
            {interview.mode === 'ONLINE' ? `Online • ${interview.meetingUrl}` : `Tại công ty • ${interview.location}`}
          </p>
          {interview.note && <p className="mt-1.5 text-[11.5px] text-violet-700">{interview.note}</p>}
        </section>
      )}

      {rejection && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5">
          <p className="mb-1.5 flex items-center gap-2 text-[12.5px] font-bold text-rose-700">
            <XCircle className="h-4 w-4" />
            Lý do kết thúc hồ sơ
          </p>
          <p className="text-[12.5px] font-semibold text-rose-900">{rejection.reason}</p>
          {rejection.detail && <p className="mt-1 text-[12px] leading-relaxed text-rose-800">{rejection.detail}</p>}
          <p className="mt-1.5 text-[11px] text-rose-600">Ghi nhận ngày {formatDate(rejection.rejectedAt)}</p>
        </section>
      )}

      {application.coverLetter && (
        <section className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
          <p className="mb-2 text-[11px] font-bold text-[#94a3b8] uppercase">Thư giới thiệu</p>
          <p className="text-[12.5px] leading-relaxed text-slate-700">{application.coverLetter}</p>
        </section>
      )}
    </div>
  );
}
