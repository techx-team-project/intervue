'use client';

import React, { useState } from 'react';
import { Check, Copy, Globe, QrCode, Share2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface CandidateShareModalProps {
  fullName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateShareModal({ fullName, isOpen, onClose }: CandidateShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://intervue.vn/profile';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Chia sẻ hồ sơ</h2>
            <p className="text-xs text-slate-500">Gửi liên kết hồ sơ của {fullName}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Nhà tuyển dụng có liên kết này có thể xem đầy đủ hồ sơ năng lực, kết quả phỏng vấn AI và CV của bạn.
        </p>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <Globe className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-sm text-slate-800 outline-none"
          />
          <Button
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          >
            {copied ? 'Đã chép' : 'Sao chép'}
          </Button>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <QrCode className="h-4 w-4" />
            <span>Quét mã QR để mở trên điện thoại</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Tiện lợi khi phỏng vấn trực tiếp hoặc tham gia sự kiện Tech Career Fair
          </p>
        </div>
      </div>
    </Modal>
  );
}
