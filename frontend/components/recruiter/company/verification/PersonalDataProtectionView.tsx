'use client';

import {
  STANDARD_CANDIDATE_AGREEMENT_PREVIEW,
  PLATFORM_DATA_AGREEMENT_PREVIEW,
} from '@/constants/company-verification';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { Download, ExternalLink, FileCheck, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from '../AccountSettingsLayout';

export function PersonalDataProtectionView() {
  const { profile, handleAgreeCandidate, handleAgreePlatform } = useCompanyVerification();

  // Section 1: Candidate Agreement State
  const [candidateFile, setCandidateFile] = useState<{ name: string; size: string } | null>(() => {
    if (profile.candidateAgreement.customFileName) {
      return {
        name: profile.candidateAgreement.customFileName,
        size: profile.candidateAgreement.fileSize || '1.2 MB',
      };
    }
    return null;
  });
  const [candidateCommitted, setCandidateCommitted] = useState(profile.candidateAgreement.status === 'AGREED');
  const [isSavingCandidate, setIsSavingCandidate] = useState(false);

  // Section 2: Platform Agreement State
  const [platformAccepted, setPlatformAccepted] = useState(profile.platformAgreement.isAgreed);
  const [isSavingPlatform, setIsSavingPlatform] = useState(false);
  const [showFullPlatformText, setShowFullPlatformText] = useState(false);

  const handleSimulateCandidateFile = () => {
    setCandidateFile({
      name: 'Thoa_Thuan_Xu_Ly_DLCN_Ung_Vien_TechX.docx',
      size: '1.2 MB',
    });
    toast.success('Đã chọn file mẫu văn bản thỏa thuận!');
  };

  const handleDownloadTemplate = () => {
    const element = document.createElement('a');
    const file = new Blob([STANDARD_CANDIDATE_AGREEMENT_PREVIEW], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Mau_Thoa_Thuan_Xu_Ly_DLCN_InterVue.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Đã tải xuống file văn bản mẫu Thỏa thuận xử lý DLCN!');
  };

  const handleSaveCandidate = () => {
    if (!candidateCommitted) {
      toast.error('Vui lòng tích chọn cam đoan văn bản hợp pháp trước khi lưu!');
      return;
    }

    setIsSavingCandidate(true);
    setTimeout(() => {
      setIsSavingCandidate(false);
      handleAgreeCandidate({
        type: candidateFile ? 'CUSTOM_UPLOAD' : 'STANDARD_TEMPLATE',
        customFileName: candidateFile?.name,
      });
      toast.success('Cập nhật Thỏa thuận xử lý DLCN với ứng viên thành công!');
    }, 500);
  };

  const handleSavePlatform = () => {
    if (!platformAccepted) {
      toast.error('Vui lòng tích chọn đồng ý các điều khoản trước khi xác nhận!');
      return;
    }

    setIsSavingPlatform(true);
    setTimeout(() => {
      setIsSavingPlatform(false);
      handleAgreePlatform();
      toast.success('Xác nhận Thỏa thuận xử lý DLCN với InterVue thành công!');
    }, 500);
  };

  return (
    <AccountSettingsLayout
      activeTab="agreements"
      pageTitle="Văn bản xử lý Dữ liệu cá nhân"
      nextStepOverride={{
        label: 'Đăng tin tuyển dụng đầu tiên',
        href: ROUTES.RECRUITER_JOBS_CREATE,
      }}
    >
      <div className="space-y-8">
        {/* SECTION 1: Agreement between Candidate & Recruiter */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Văn bản Thoả thuận xử lý Dữ liệu cá nhân giữa Ứng viên - Nhà tuyển dụng
                </h2>
                {profile.candidateAgreement.status === 'AGREED' ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-[#00b14f]">
                    Đã cập nhật
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-500">
                    Chưa cập nhật
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Xem mục đích sử dụng và hướng dẫn đăng tải{' '}
                <a href="#" className="inline-flex items-center gap-0.5 font-semibold text-[#00b14f] hover:underline">
                  Tại đây <ExternalLink className="inline h-3 w-3" />
                </a>
              </p>
            </div>
          </div>

          {/* 2-column upload & template section */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left Upload Form */}
            <div className="space-y-4 lg:col-span-8">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">
                  Văn bản Thỏa thuận <span className="text-red-500">*</span>
                </div>
                <p className="text-xs text-slate-600">
                  Văn bản thể hiện việc Ứng viên đồng ý cho phép Nhà tuyển dụng thu thập, lưu trữ và sử dụng dữ liệu cá
                  nhân của Ứng viên để phục vụ mục đích tuyển dụng.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={handleSimulateCandidateFile}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition hover:border-[#00b14f] hover:bg-emerald-50/20"
              >
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#00b14f] shadow-xs">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">Chọn hoặc kéo file vào đây</div>
                <div className="mt-1 text-xs text-slate-400">Dung lượng tối đa 5MB, định dạng: docx, doc, pdf</div>

                <button
                  type="button"
                  className="mt-3 flex items-center gap-1.5 rounded-xl border border-[#00b14f] bg-white px-4 py-1.5 text-xs font-bold text-[#00b14f] shadow-xs transition hover:bg-emerald-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Chọn file</span>
                </button>
              </div>

              {/* Selected File Card */}
              {candidateFile && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-[#00b14f]" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{candidateFile.name}</div>
                      <div className="text-[11px] text-slate-500">{candidateFile.size}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCandidateFile(null)}
                    className="p-1 text-slate-400 transition hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Notice Checklist */}
              <div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900">
                <ul className="list-disc space-y-1 pl-4 text-slate-700">
                  <li>
                    Trường hợp sử dụng văn bản mẫu từ hệ thống, vui lòng xóa hết nội dung như &quot;Mẫu văn bản&quot;,
                    &quot;Đây là nội dung mẫu...&quot; trong file trước khi tải lên
                  </li>
                  <li>Văn bản đăng tải cần đầy đủ các mặt và không có dấu hiệu chỉnh sửa/che/cắt thông tin</li>
                </ul>
              </div>
            </div>

            {/* Right Template Box */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 lg:col-span-4">
              <div className="text-xs font-bold text-slate-800">Văn bản mẫu chuẩn Nghị định 13</div>
              <p className="text-xs leading-relaxed text-slate-600">
                InterVue đã soạn sẵn mẫu cam kết tuân thủ Nghị định 13/2023/NĐ-CP được các chuyên gia pháp lý thẩm định.
                Bạn có thể tải về, điền tên công ty và tải lên lại.
              </p>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#00b14f] bg-white py-2.5 text-xs font-bold text-[#00b14f] shadow-xs transition hover:bg-emerald-50"
              >
                <Download className="h-4 w-4" />
                <span>Tải mẫu văn bản</span>
              </button>
            </div>
          </div>

          {/* Commitment Checkbox */}
          <div className="pt-2">
            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-700">
              <input
                type="checkbox"
                checked={candidateCommitted}
                onChange={(e) => setCandidateCommitted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
              />
              <span>
                Tôi cam đoan văn bản này là tài liệu hợp pháp của doanh nghiệp và chịu hoàn toàn trách nhiệm về tính
                chính xác, hợp lệ của nội dung. InterVue chỉ là nền tảng trung gian lưu trữ văn bản này.
              </span>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveCandidate}
              disabled={isSavingCandidate}
              className="rounded-xl bg-[#00b14f] px-8 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-600 disabled:opacity-50 sm:text-sm"
            >
              {isSavingCandidate ? 'Đang lưu...' : 'Lưu văn bản'}
            </button>
          </div>
        </div>

        {/* SECTION 2: Agreement between InterVue & Recruiter */}
        <div id="platform" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Văn bản Thoả thuận xử lý Dữ liệu cá nhân giữa InterVue - Nhà tuyển dụng
                </h2>
                {profile.platformAgreement.isAgreed ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-[#00b14f]">
                    Đã xác nhận
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-500">
                    Chưa xác nhận
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Legal Notice Description */}
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Nhằm tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, InterVue chính thức triển khai Thỏa thuận về xử
            lý dữ liệu cá nhân trên hệ thống. Thỏa thuận này làm rõ vai trò, trách nhiệm của Quý đơn vị và InterVue đối
            với các hồ sơ ứng viên được chuyển vào Không gian làm việc (Workspace) của Quý đơn vị. Vui lòng đọc kỹ và
            xác nhận đồng ý để đảm bảo tiến trình tuyển dụng diễn ra hợp pháp, minh bạch và không bị gián đoạn.
          </p>

          <button
            type="button"
            onClick={() => setShowFullPlatformText((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#00b14f] hover:underline"
          >
            <span>{showFullPlatformText ? 'Thu gọn nội dung văn bản' : 'Xem nội dung đầy đủ của văn bản'}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          {/* Expandable Full Agreement Text */}
          {showFullPlatformText && (
            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
              {PLATFORM_DATA_AGREEMENT_PREVIEW}
            </div>
          )}

          {/* Checkbox agreement */}
          <div className="pt-1">
            <label className="flex cursor-pointer items-center gap-3 text-xs font-semibold text-slate-800 sm:text-sm">
              <input
                type="checkbox"
                checked={platformAccepted}
                onChange={(e) => setPlatformAccepted(e.target.checked)}
                className="rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
              />
              <span>
                Xác nhận đồng ý với các điều khoản của{' '}
                <span className="font-bold text-[#00b14f]">Thỏa thuận về xử lý Dữ liệu cá nhân</span>
              </span>
            </label>
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePlatform}
              disabled={isSavingPlatform}
              className="rounded-xl bg-[#00b14f] px-8 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-600 disabled:opacity-50 sm:text-sm"
            >
              {isSavingPlatform ? 'Đang xác nhận...' : 'Xác nhận đồng ý'}
            </button>
          </div>
        </div>
      </div>
    </AccountSettingsLayout>
  );
}
