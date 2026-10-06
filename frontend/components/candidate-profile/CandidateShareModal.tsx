'use client';

import { useState } from 'react';
import { Check, Copy, Globe, QrCode, Share2, X } from 'lucide-react';

interface CandidateShareModalProps {
  fullName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateShareModal({ fullName, isOpen, onClose }: CandidateShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://intervue.vn/profile';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#263a4d]">Chia sẻ hồ sơ</h2>
              <p className="text-[12px] text-[#6f7882]">Gửi liên kết hồ sơ của {fullName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6f7882] hover:bg-[#f1f5f9] hover:text-[#263a4d]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-[13px] text-[#475569]">
            Nhà tuyển dụng có liên kết này có thể xem đầy đủ hồ sơ năng lực, kết quả phỏng vấn AI và CV của bạn.
          </p>

          <div className="flex items-center gap-2 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-2">
            <Globe className="ml-2 h-4 w-4 shrink-0 text-[#64748b]" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-[13px] text-[#1e293b] outline-hidden"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#00b14f] px-3.5 py-2 text-[12.5px] font-semibold text-white shadow-xs hover:bg-[#009643]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-center">
            <div className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#00873c]">
              <QrCode className="h-4 w-4" />
              <span>Quét mã QR để mở trên điện thoại</span>
            </div>
            <p className="mt-1 text-[11.5px] text-[#64748b]">
              Tiện lợi khi phỏng vấn trực tiếp hoặc tham gia sự kiện Tech Career Fair
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
