'use client';

import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import type { BusinessDocumentType } from '@/types/recruiter-company';
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, FileCheck, FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from '../AccountSettingsLayout';

export function BusinessLicenseView() {
  const { profile, handleSubmitLicense } = useCompanyVerification();

  const [documentType, setDocumentType] = useState<BusinessDocumentType>(
    profile.license.documentType || 'BUSINESS_LICENSE',
  );

  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(() => {
    if (profile.license.fileName) {
      return {
        name: profile.license.fileName,
        size: profile.license.fileSize || '2.4 MB',
      };
    }
    return null;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateFileSelect = () => {
    setSelectedFile({
      name: 'Giay_Phep_Dang_Ky_Doanh_Nghiep_TechX_2026.pdf',
      size: '2.4 MB',
    });
    toast.success('Đã tải lên tệp: Giay_Phep_Dang_Ky_Doanh_Nghiep_TechX_2026.pdf');
  };

  const handleSave = () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn hoặc kéo thả file tài liệu trước khi lưu!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleSubmitLicense({
        documentType,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });
      toast.success('Đã đăng tải Giấy đăng ký doanh nghiệp! Đang chờ kiểm duyệt trong 24h làm việc.');
    }, 600);
  };

  return (
    <AccountSettingsLayout
      activeTab="license"
      pageTitle="Giấy đăng ký doanh nghiệp"
      nextStepOverride={{
        label: 'Cập nhật Thỏa thuận xử lý DLCN với ứng viên',
        href: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
      }}
    >
      <div className="space-y-6">
        {/* Title & subtitle */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Thông tin Giấy đăng ký doanh nghiệp</h2>
          <p className="text-xs text-slate-500">
            Vui lòng lựa chọn phương thức đăng tải, xem hướng dẫn đăng tải{' '}
            <a href="#" className="inline-flex items-center gap-0.5 font-semibold text-[#00b14f] hover:underline">
              Tại đây <ExternalLink className="inline h-3 w-3" />
            </a>
          </p>
        </div>

        {/* Current status banner if already submitted */}
        {profile.license.status === 'APPROVED' && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950">Giấy đăng ký doanh nghiệp đã được phê duyệt!</div>
              <div className="text-xs text-emerald-700">
                Tài khoản của bạn đã đạt Cấp 3 - Doanh nghiệp đã xác thực với huy hiệu uy tín.
              </div>
            </div>
          </div>
        )}

        {profile.license.status === 'PENDING_REVIEW' && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-950">Tài liệu đang trong tiến trình kiểm duyệt</div>
              <div className="text-xs text-amber-700">
                Đội ngũ Kiểm soát Tuân thủ InterVue sẽ rà soát và phản hồi trong vòng 24 giờ làm việc.
              </div>
            </div>
          </div>
        )}

        {/* Method 1: Business License (Radio Option) */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="docMethod"
              checked={documentType === 'BUSINESS_LICENSE'}
              onChange={() => setDocumentType('BUSINESS_LICENSE')}
              className="h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
            />
            <span className="text-sm font-bold text-slate-800">
              Giấy đăng ký doanh nghiệp hoặc Giấy tờ tương đương khác
            </span>
          </label>

          {documentType === 'BUSINESS_LICENSE' && (
            <div className="space-y-6 pt-2 pl-7">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Left Upload & Warning Notes */}
                <div className="space-y-4 lg:col-span-7">
                  <div className="text-xs font-bold text-slate-700">
                    Giấy tờ <span className="text-red-500">*</span>
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={handleSimulateFileSelect}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition hover:border-[#00b14f] hover:bg-emerald-50/20"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#00b14f] shadow-sm">
                      <Upload className="h-6 w-6" />
                    </div>

                    <div className="text-sm font-bold text-slate-800">Chọn hoặc kéo file vào đây</div>
                    <div className="mt-1 text-xs text-slate-400">
                      Dung lượng tối đa 5MB, định dạng: jpeg, jpg, png, pdf
                    </div>

                    <button
                      type="button"
                      className="mt-4 flex items-center gap-1.5 rounded-xl border border-[#00b14f] bg-white px-4 py-2 text-xs font-bold text-[#00b14f] shadow-xs transition hover:bg-emerald-50"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Chọn file</span>
                    </button>
                  </div>

                  {/* Selected File Card */}
                  {selectedFile && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                      <div className="flex items-center gap-3">
                        <FileCheck className="h-5 w-5 text-[#00b14f]" />
                        <div>
                          <div className="line-clamp-1 text-xs font-bold text-slate-800">{selectedFile.name}</div>
                          <div className="text-[11px] text-slate-500">{selectedFile.size}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="p-1 text-slate-400 transition hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Warning Checklist Box */}
                  <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                      <span>Lưu ý khi tải tài liệu xác thực:</span>
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-slate-700">
                      <li>
                        Các văn bản đăng tải cần đầy đủ các mặt và không có dấu hiệu chỉnh sửa/ che/ cắt thông tin
                      </li>
                      <li>
                        Vui lòng đăng tải Giấy đăng ký doanh nghiệp có thông tin trùng khớp với dữ liệu của doanh nghiệp
                        theo Trang thông tin điện tử của Cục Thuế
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Illustration Preview */}
                <div className="space-y-2 lg:col-span-5">
                  <div className="text-xs font-bold text-slate-700">Minh họa</div>
                  <div className="relative rounded-2xl border border-slate-200 bg-amber-50/30 p-4 text-center shadow-sm">
                    {/* Stylized realistic certificate preview */}
                    <div className="space-y-3 rounded-xl border border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/70 p-4 shadow-xs">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-amber-400 bg-amber-500/20 text-amber-700">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="text-xs font-bold tracking-wider text-amber-950 uppercase">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                      </div>
                      <div className="text-[10px] text-amber-800">Độc lập - Tự do - Hạnh phúc</div>
                      <div className="mx-auto h-px w-24 bg-amber-400" />
                      <div className="pt-1 text-xs font-black text-amber-950 uppercase">
                        GIẤY CHỨNG NHẬN ĐĂNG KÝ DOANH NGHIỆP
                      </div>
                      <div className="space-y-1 border-t border-amber-200/60 pt-2 text-left text-[10px] text-slate-700">
                        <div>Mã số doanh nghiệp: 0101778163</div>
                        <div>Tên công ty: CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX</div>
                        <div>Địa chỉ: Tầng 12, Keangnam Landmark 72, Hà Nội</div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500 text-[8px] font-bold text-red-600">
                          DẤU ĐỎ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Method 2: Authorization Letter (Radio Option) */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="docMethod"
              checked={documentType === 'LETTER_OF_AUTHORIZATION'}
              onChange={() => setDocumentType('LETTER_OF_AUTHORIZATION')}
              className="h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
            />
            <span className="text-sm font-bold text-slate-800">Giấy ủy quyền và Giấy tờ định danh</span>
          </label>

          {documentType === 'LETTER_OF_AUTHORIZATION' && (
            <div className="space-y-4 pt-2 pl-7">
              <p className="text-xs text-slate-600">
                Áp dụng đối với nhà tuyển dụng được người đại diện pháp luật của doanh nghiệp ủy quyền thực hiện các
                hoạt động đăng tuyển nhân sự trên nền tảng.
              </p>

              <div
                onClick={handleSimulateFileSelect}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition hover:border-[#00b14f]"
              >
                <Upload className="mb-2 h-8 w-8 text-[#00b14f]" />
                <div className="text-sm font-bold text-slate-800">Tải lên Giấy ủy quyền có ký đóng dấu</div>
                <div className="mt-1 text-xs text-slate-400">Định dạng: PDF hoặc JPEG/PNG (tối đa 5MB)</div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="rounded-xl bg-[#00b14f] px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Đang lưu tài liệu...' : 'Lưu tài liệu'}
          </button>
        </div>
      </div>
    </AccountSettingsLayout>
  );
}
