'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useCandidateCvs } from '@/hooks/useCandidateCvs';
import { useCandidateCvProfile } from '@/hooks/useCandidateCvProfile';
import type { CvParseProfileResponse } from '@/types/candidate-cv-profile';
import {
  Sparkles,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Edit3,
  Briefcase,
  GraduationCap,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface AiCvProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManualEdit?: () => void;
  initialResumeId?: number | null;
}

export default function AiCvProfileModal({
  isOpen,
  onClose,
  onOpenManualEdit,
  initialResumeId,
}: AiCvProfileModalProps) {
  const { data: resumes } = useCandidateCvs(isOpen);
  const { parseCv, applyCvParsed } = useCandidateCvProfile();

  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(initialResumeId ?? null);
  const [prevInitialResumeId, setPrevInitialResumeId] = useState(initialResumeId);
  if (initialResumeId !== prevInitialResumeId) {
    setPrevInitialResumeId(initialResumeId);
    setSelectedResumeId(initialResumeId ?? null);
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CvParseProfileResponse | null>(null);

  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    headline: true,
    desiredRole: true,
    bio: true,
    totalYoe: true,
    skills: true,
    experiences: true,
    educations: true,
    certifications: true,
    languages: true,
  });

  const handleStartParse = async () => {
    if (!selectedFile && !selectedResumeId) {
      toast.error('Vui lòng chọn hoặc tải lên một tệp CV PDF.');
      return;
    }

    try {
      const res = await parseCv.mutateAsync({
        file: selectedFile ?? undefined,
        resumeId: selectedResumeId ?? undefined,
      });
      setParseResult(res);
    } catch {
      toast.error('Có lỗi xảy ra khi phân tích CV bằng AI. Vui lòng thử lại.');
    }
  };

  const handleApplyAll = async () => {
    if (!parseResult?.parsedData) return;
    try {
      await applyCvParsed.mutateAsync({
        applyHeadline: true,
        applyDesiredRole: true,
        applyBio: true,
        applyTotalYoe: true,
        applySkills: true,
        applyExperiences: true,
        applyEducations: true,
        applyCertifications: true,
        applyLanguages: true,
        parsedData: parseResult.parsedData,
      });
      onClose();
      resetState();
    } catch {
      toast.error('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    }
  };

  const handleApplySelected = async () => {
    if (!parseResult?.parsedData) return;
    try {
      await applyCvParsed.mutateAsync({
        applyHeadline: Boolean(selectedFields.headline),
        applyDesiredRole: Boolean(selectedFields.desiredRole),
        applyBio: Boolean(selectedFields.bio),
        applyTotalYoe: Boolean(selectedFields.totalYoe),
        applySkills: Boolean(selectedFields.skills),
        applyExperiences: Boolean(selectedFields.experiences),
        applyEducations: Boolean(selectedFields.educations),
        applyCertifications: Boolean(selectedFields.certifications),
        applyLanguages: Boolean(selectedFields.languages),
        parsedData: parseResult.parsedData,
      });
      onClose();
      resetState();
    } catch {
      toast.error('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setSelectedResumeId(null);
    setParseResult(null);
  };

  const toggleField = (key: string) => {
    setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = (val: boolean) => {
    setSelectedFields({
      headline: val,
      desiredRole: val,
      bio: val,
      totalYoe: val,
      skills: val,
      experiences: val,
      educations: val,
      certifications: val,
      languages: val,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetState();
      }}
      title={
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-navy font-bold">AI Cập nhật hồ sơ từ CV</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Step 1: Loading/Parsing */}
        {parseCv.isPending && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-primary/10 text-primary relative flex h-16 w-16 items-center justify-center rounded-2xl">
              <Sparkles className="text-primary h-8 w-8 animate-pulse" />
            </div>
            <h3 className="text-navy mt-4 text-base font-bold">AI đang phân tích và trích xuất dữ liệu từ CV</h3>
            <p className="text-on-surface-variant mt-1 max-w-md text-xs">
              Đang đọc văn bản, phân loại kỹ năng, kinh nghiệm và học vấn... Vui lòng đợi trong giây lát.
            </p>
          </div>
        )}

        {/* Step 2: Unreadable CV State */}
        {!parseCv.isPending && parseResult && !parseResult.readable && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-rose-900">Không thể đọc nội dung tệp CV</h4>
                  <p className="text-sm font-medium text-rose-700">
                    {parseResult.reasonMessage || 'Tệp tin PDF bị hỏng hoặc không chứa lớp văn bản có thể trích xuất.'}
                  </p>
                  <p className="pt-1 text-xs text-rose-600">
                    Mã lỗi:{' '}
                    <code className="font-mono font-semibold">{parseResult.unreadableReason || 'UNREADABLE'}</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="text-navy font-semibold">Bạn có thể thực hiện một trong các cách sau:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
                <li>Nếu file có mật khẩu, hãy gỡ mật khẩu trước khi tải lên lại.</li>
                <li>Nếu là file scan dạng ảnh, hãy dùng bản xuất trực tiếp từ Word hoặc Google Docs dạng text PDF.</li>
                <li>
                  Hoặc chọn nút <strong>Nhập hồ sơ thủ công</strong> để tự điền các thông tin của bạn.
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setParseResult(null)}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Thử lại với tệp khác
              </Button>
              {onOpenManualEdit && (
                <Button
                  onClick={() => {
                    onClose();
                    resetState();
                    onOpenManualEdit();
                  }}
                  leftIcon={<Edit3 className="h-4 w-4" />}
                >
                  Nhập hồ sơ thủ công
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Empty Profile Confirmation (Fill everything) */}
        {!parseCv.isPending && parseResult?.readable && parseResult.profileEmpty && parseResult.parsedData && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Hồ sơ của bạn đang trống</h4>
                  <p className="text-xs text-emerald-700">
                    AI đã tự động trích xuất toàn bộ dữ liệu từ CV. Bạn hãy xem lại trước khi lưu vào hồ sơ:
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              {/* Basic info */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
                <span className="text-primary text-xs font-bold tracking-wider uppercase">Thông tin chung</span>
                {parseResult.parsedData.headline && (
                  <div>
                    <span className="text-xs text-slate-400">Tiêu đề:</span>
                    <p className="text-navy text-sm font-semibold">{parseResult.parsedData.headline}</p>
                  </div>
                )}
                {parseResult.parsedData.desiredRole && (
                  <div>
                    <span className="text-xs text-slate-400">Vị trí mong muốn:</span>
                    <p className="text-navy text-sm font-semibold">{parseResult.parsedData.desiredRole}</p>
                  </div>
                )}
                {parseResult.parsedData.bio && (
                  <div>
                    <span className="text-xs text-slate-400">Giới thiệu:</span>
                    <p className="line-clamp-3 text-xs text-slate-600">{parseResult.parsedData.bio}</p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {parseResult.parsedData.skills && parseResult.parsedData.skills.length > 0 && (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-primary flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Kỹ năng trích xuất ({parseResult.parsedData.skills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {parseResult.parsedData.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="border-primary/20 bg-primary-light text-primary rounded-lg border px-2.5 py-1 text-xs font-semibold"
                      >
                        {s.name} ({s.years} năm)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences */}
              {parseResult.parsedData.experiences && parseResult.parsedData.experiences.length > 0 && (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-primary flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Kinh nghiệm làm việc ({parseResult.parsedData.experiences.length})</span>
                  </div>
                  <div className="space-y-2">
                    {parseResult.parsedData.experiences.map((exp, idx) => (
                      <div key={idx} className="border-primary/40 space-y-0.5 border-l-2 pl-3 text-xs">
                        <p className="text-navy font-bold">
                          {exp.title} tại {exp.companyName}
                        </p>
                        <p className="text-slate-400">
                          {exp.startDate} - {exp.current ? 'Hiện tại' : exp.endDate}
                        </p>
                        {exp.description && <p className="line-clamp-2 text-slate-600">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {parseResult.parsedData.educations && parseResult.parsedData.educations.length > 0 && (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-primary flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Học vấn ({parseResult.parsedData.educations.length})</span>
                  </div>
                  <div className="space-y-2">
                    {parseResult.parsedData.educations.map((edu, idx) => (
                      <div key={idx} className="border-primary/40 space-y-0.5 border-l-2 pl-3 text-xs">
                        <p className="text-navy font-bold">{edu.school}</p>
                        <p className="text-slate-500">
                          {edu.degree} - {edu.major} ({edu.startYear} - {edu.endYear ?? 'Nay'})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
              <Button variant="outline" onClick={() => setParseResult(null)}>
                Chọn lại CV
              </Button>
              <Button
                isLoading={applyCvParsed.isPending}
                onClick={handleApplyAll}
                leftIcon={<Check className="h-4 w-4" />}
              >
                Xác nhận & Điền toàn bộ vào hồ sơ
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Existing Profile Diff Selection (Old -> New per field) */}
        {!parseCv.isPending && parseResult?.readable && !parseResult.profileEmpty && parseResult.parsedData && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-blue-950">So sánh dữ liệu đề xuất (Cũ ➔ Mới)</h4>
                  <p className="text-xs text-blue-800">
                    Hồ sơ của bạn đã có dữ liệu. Vui lòng tick chọn các trường bạn muốn cập nhật từ CV:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectAll(true)}
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    Chọn tất cả
                  </button>
                  <span className="text-xs text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => selectAll(false)}
                    className="text-xs font-bold text-slate-500 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
              {/* Headline */}
              {parseResult.parsedData.headline && (
                <label className="hover:border-primary/50 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedFields.headline)}
                    onChange={() => toggleField('headline')}
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-navy text-xs font-bold">Tiêu đề hồ sơ (Headline)</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase">Hiện tại:</span>
                        <span className="line-clamp-2">
                          {(parseResult.diffs.find((d) => d.field === 'headline')?.oldValue as string) || '(Chưa có)'}
                        </span>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-2 text-emerald-800">
                        <span className="block text-[10px] font-semibold text-emerald-600 uppercase">Mới từ CV:</span>
                        <span className="line-clamp-2 font-medium">{parseResult.parsedData.headline}</span>
                      </div>
                    </div>
                  </div>
                </label>
              )}

              {/* Desired Role */}
              {parseResult.parsedData.desiredRole && (
                <label className="hover:border-primary/50 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedFields.desiredRole)}
                    onChange={() => toggleField('desiredRole')}
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-navy text-xs font-bold">Vị trí mong muốn (Desired Role)</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase">Hiện tại:</span>
                        <span className="line-clamp-2">
                          {(parseResult.diffs.find((d) => d.field === 'desiredRole')?.oldValue as string) ||
                            '(Chưa có)'}
                        </span>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-2 text-emerald-800">
                        <span className="block text-[10px] font-semibold text-emerald-600 uppercase">Mới từ CV:</span>
                        <span className="line-clamp-2 font-medium">{parseResult.parsedData.desiredRole}</span>
                      </div>
                    </div>
                  </div>
                </label>
              )}

              {/* Bio */}
              {parseResult.parsedData.bio && (
                <label className="hover:border-primary/50 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedFields.bio)}
                    onChange={() => toggleField('bio')}
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-navy text-xs font-bold">Giới thiệu bản thân (Bio)</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase">Hiện tại:</span>
                        <p className="line-clamp-3">
                          {(parseResult.diffs.find((d) => d.field === 'bio')?.oldValue as string) || '(Chưa có)'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-2 text-emerald-800">
                        <span className="block text-[10px] font-semibold text-emerald-600 uppercase">Mới từ CV:</span>
                        <p className="line-clamp-3 font-medium">{parseResult.parsedData.bio}</p>
                      </div>
                    </div>
                  </div>
                </label>
              )}

              {/* Skills */}
              {parseResult.parsedData.skills && parseResult.parsedData.skills.length > 0 && (
                <label className="hover:border-primary/50 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedFields.skills)}
                    onChange={() => toggleField('skills')}
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="text-primary h-3.5 w-3.5" />
                      <p className="text-navy text-xs font-bold">
                        Kỹ năng chuyên môn (+{parseResult.parsedData.skills.length} kỹ năng từ CV)
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {parseResult.parsedData.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="border-primary/30 bg-primary-light text-primary rounded-md border px-2 py-0.5 text-[11px] font-semibold"
                        >
                          +{s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              )}

              {/* Experiences */}
              {parseResult.parsedData.experiences && parseResult.parsedData.experiences.length > 0 && (
                <label className="hover:border-primary/50 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedFields.experiences)}
                    onChange={() => toggleField('experiences')}
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="text-primary h-3.5 w-3.5" />
                      <p className="text-navy text-xs font-bold">
                        Kinh nghiệm làm việc (+{parseResult.parsedData.experiences.length} mục từ CV)
                      </p>
                    </div>
                    <div className="space-y-1 pt-1">
                      {parseResult.parsedData.experiences.map((exp, idx) => (
                        <div key={idx} className="text-xs text-slate-600">
                          • <span className="text-navy font-semibold">{exp.title}</span> tại {exp.companyName} (
                          {exp.startDate} - {exp.current ? 'Hiện tại' : exp.endDate})
                        </div>
                      ))}
                    </div>
                  </div>
                </label>
              )}

              {/* Educations */}
              {parseResult.parsedData.educations && parseResult.parsedData.educations.length > 0 && (
                <label className="hover:border-primary/50 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedFields.educations)}
                    onChange={() => toggleField('educations')}
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="text-primary h-3.5 w-3.5" />
                      <p className="text-navy text-xs font-bold">
                        Học vấn (+{parseResult.parsedData.educations.length} trường từ CV)
                      </p>
                    </div>
                    <div className="space-y-1 pt-1">
                      {parseResult.parsedData.educations.map((edu, idx) => (
                        <div key={idx} className="text-xs text-slate-600">
                          • <span className="text-navy font-semibold">{edu.school}</span> ({edu.major})
                        </div>
                      ))}
                    </div>
                  </div>
                </label>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
              <Button variant="outline" onClick={() => setParseResult(null)}>
                Chọn lại CV
              </Button>
              <Button
                isLoading={applyCvParsed.isPending}
                onClick={handleApplySelected}
                leftIcon={<Check className="h-4 w-4" />}
              >
                Cập nhật các mục đã chọn
              </Button>
            </div>
          </div>
        )}

        {/* Step 0: Initial Source Selection */}
        {!parseCv.isPending && !parseResult && (
          <div className="space-y-4">
            <p className="text-on-surface-variant text-xs">
              Chọn một CV đã tải lên trong tài khoản hoặc upload tệp PDF mới để AI trích xuất thông tin:
            </p>

            {/* List existing CVs */}
            {resumes && resumes.length > 0 && (
              <div className="space-y-2">
                <span className="text-navy text-xs font-bold">CV đã lưu trong tài khoản:</span>
                <div className="grid grid-cols-1 gap-2">
                  {resumes.map((cv) => (
                    <button
                      key={cv.id}
                      type="button"
                      onClick={() => {
                        setSelectedResumeId(cv.id);
                        setSelectedFile(null);
                      }}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        selectedResumeId === cv.id
                          ? 'border-primary bg-primary-light/50 ring-primary ring-1'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText
                          className={`h-5 w-5 shrink-0 ${selectedResumeId === cv.id ? 'text-primary' : 'text-slate-400'}`}
                        />
                        <div className="min-w-0">
                          <p className="text-navy truncate text-xs font-bold">{cv.fileName}</p>
                          <p className="text-[11px] text-slate-400">
                            {cv.isDefault ? 'CV Mặc định • ' : ''}Tải lên gần đây
                          </p>
                        </div>
                      </div>
                      {selectedResumeId === cv.id && <CheckCircle2 className="text-primary h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new file */}
            <div className="space-y-2 pt-1">
              <span className="text-navy text-xs font-bold">Hoặc tải lên tệp CV mới:</span>
              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                  selectedFile
                    ? 'border-primary bg-primary-light/30'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Upload className={`h-8 w-8 ${selectedFile ? 'text-primary' : 'text-slate-400'}`} />
                <p className="text-navy mt-2 text-xs font-bold">
                  {selectedFile ? selectedFile.name : 'Bấm để chọn hoặc kéo thả tệp PDF tại đây'}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">Tối đa 5 MB, định dạng PDF chuẩn</p>
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setSelectedResumeId(null);
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
              <Button variant="outline" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button
                disabled={!selectedFile && !selectedResumeId}
                onClick={handleStartParse}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Bắt đầu trích xuất bằng AI
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
