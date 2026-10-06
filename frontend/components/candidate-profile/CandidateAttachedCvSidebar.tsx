'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Download, Eye, FileCheck2, FileText, Sparkles, UploadCloud } from 'lucide-react';
import type { AttachedCv } from '@/types/candidate';

interface CandidateAttachedCvSidebarProps {
  resumes: AttachedCv[];
  isOwner?: boolean;
}

export default function CandidateAttachedCvSidebar({
  resumes: initialResumes,
  isOwner = true,
}: CandidateAttachedCvSidebarProps) {
  const [resumes, setResumes] = useState<AttachedCv[]>(initialResumes);

  const setDefault = (id: string) => {
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        isDefault: r.id === id,
      })),
    );
  };

  return (
    <div id="resumes-section" className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
            <FileText className="h-4 w-4" />
          </div>
          <h2 className="text-[15.5px] font-bold text-[#263a4d]">
            {isOwner ? 'Quản lý CV đã tải' : 'Hồ sơ đính kèm (CV)'}
          </h2>
        </div>
        <span className="text-[12px] font-semibold text-[#64748b]">{resumes.length} bản</span>
      </div>

      <div className="space-y-3">
        {resumes.map((cv) => (
          <div
            key={cv.id}
            className={`rounded-2xl border p-3.5 transition-all ${
              cv.isDefault
                ? 'border-[#00b14f] bg-emerald-50/30 ring-1 ring-[#00b14f]/30'
                : 'border-[#f1f5f9] bg-[#fbfcfd] hover:border-[#cbd5e1]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2.5">
                <FileCheck2
                  className={`mt-0.5 h-4 w-4 shrink-0 ${cv.isDefault ? 'text-[#00b14f]' : 'text-[#64748b]'}`}
                />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold text-[#1e293b]">{cv.fileName}</div>
                  <div className="text-[11.5px] text-[#64748b]">
                    {cv.fileSize} • Cập nhật: {cv.uploadedAt}
                  </div>
                </div>
              </div>

              {cv.isDefault ? (
                <span className="shrink-0 rounded-full bg-[#00b14f] px-2 py-0.5 text-[10.5px] font-bold text-white">
                  {isOwner ? 'Mặc định' : 'Bản chính thức'}
                </span>
              ) : (
                isOwner && (
                  <button
                    type="button"
                    onClick={() => setDefault(cv.id)}
                    className="shrink-0 text-[11px] font-medium text-[#64748b] hover:text-[#00b14f]"
                  >
                    Đặt mặc định
                  </button>
                )
              )}
            </div>

            {/* ATS Score & Action Buttons */}
            <div className="mt-3 flex items-center justify-between border-t border-[#f1f5f9] pt-2 text-[12px]">
              <div className="flex items-center gap-1 font-semibold text-[#00873c]">
                <Sparkles className="h-3 w-3 text-[#00b14f]" />
                <span>ATS: {cv.atsScore}%</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Đang xem trước ${cv.fileName}...`)}
                  className="inline-flex items-center gap-1 text-[#475569] hover:text-[#00b14f]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Xem</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Đang tải xuống ${cv.fileName}...`)}
                  className="inline-flex items-center gap-1 text-[#475569] hover:text-[#00b14f]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Tải</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload New CV Box (Only for Owner) */}
      {isOwner && (
        <button
          type="button"
          onClick={() => alert('Vui lòng chọn file PDF CV từ máy tính của bạn')}
          className="mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] p-4 text-center transition-all hover:border-[#00b14f] hover:bg-[#f2fbf6]"
        >
          <UploadCloud className="h-6 w-6 text-[#00b14f]" />
          <span className="mt-1 text-[12.5px] font-bold text-[#263a4d]">Tải lên CV mới</span>
          <span className="text-[11px] text-[#64748b]">Hỗ trợ định dạng PDF, DOCX (tối đa 5MB)</span>
        </button>
      )}
    </div>
  );
}
