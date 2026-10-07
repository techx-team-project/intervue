'use client';

import { Award, ExternalLink, Globe2, Languages } from 'lucide-react';
import type { CandidateLanguage, Certification } from '@/types/candidate';

interface CandidateCertificationsSectionProps {
  certifications: Certification[];
  languages: CandidateLanguage[];
  isOwner?: boolean;
  onAddCertification?: () => void;
}

export default function CandidateCertificationsSection({
  certifications,
  languages,
  isOwner = true,
  onAddCertification,
}: CandidateCertificationsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Chứng chỉ */}
      <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-navy text-lg font-bold">Chứng chỉ quốc tế</h2>
              <p className="text-[12px] text-[#6f7882]">Chứng chỉ chuyên môn đã được xác thực</p>
            </div>
          </div>

          {isOwner && onAddCertification && (
            <button
              type="button"
              onClick={onAddCertification}
              className="text-primary hover:border-primary inline-flex items-center gap-1 rounded-lg border border-[#e9eaec] bg-white px-2.5 py-1 text-[12px] font-semibold"
            >
              <span>+ Thêm</span>
            </button>
          )}
        </div>

        <div className="space-y-3.5">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-[#f1f5f9] bg-[#fbfcfd] p-4 transition-all hover:border-[#cbd5e1] hover:bg-white"
            >
              <div>
                <h3 className="text-[14px] font-bold text-[#1e293b]">{cert.name}</h3>
                <div className="text-primary text-[12.5px] font-medium">{cert.issuer}</div>
                <div className="mt-1 text-[11.5px] text-[#64748b]">Thời hạn: {cert.issueDate}</div>
                {cert.credentialId && (
                  <div className="mt-0.5 text-[11px] text-[#94a3b8]">Mã CC: {cert.credentialId}</div>
                )}
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:border-primary hover:text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] transition-colors"
                  title="Xác thực chứng chỉ"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Ngoại ngữ */}
      <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-7">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Languages className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-navy text-lg font-bold">Trình độ ngoại ngữ</h2>
            <p className="text-[12px] text-[#6f7882]">Khả năng giao tiếp & làm việc thực tế</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {languages.map((lang, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl border border-[#f1f5f9] bg-[#fbfcfd] p-4 transition-all hover:border-[#cbd5e1] hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="text-primary flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[14.5px] font-bold text-[#1e293b]">{lang.name}</h3>
                  <div className="text-[12.5px] text-[#64748b]">{lang.proficiency}</div>
                </div>
              </div>

              {lang.certificate && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-bold text-blue-700">
                  {lang.certificate}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
