'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CvTemplateItem } from '@/types/cv-template';
import CvPaperPreview from './CvPaperPreview';
import { X, ShieldCheck, Star, Check, Download, ArrowRight, ZoomIn, ZoomOut, Maximize2, FileCheck } from 'lucide-react';

interface CvPreviewModalProps {
  template: CvTemplateItem | null;
  initialColorHex: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CvPreviewModal({ template, initialColorHex, isOpen, onClose }: CvPreviewModalProps) {
  const [activeColor, setActiveColor] = useState<string>(initialColorHex);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  if (!isOpen || !template) return null;

  const handleDownloadMock = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm duration-200 sm:p-6">
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl lg:flex-row">
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: A4 Canvas View with Zoom Controls */}
        <div className="flex flex-1 flex-col overflow-hidden border-b border-gray-200 bg-[#f0f2f5] lg:border-r lg:border-b-0">
          {/* Zoom controls bar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-3 text-xs text-[#526475]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#171717]">{template.title}</span>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#00b14f]">
                {template.style}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
                title="Thu nhỏ"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="font-mono text-xs">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
                title="Phóng to"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
                title="Kích thước chuẩn"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Paper Container */}
          <div className="flex flex-1 items-start justify-center overflow-y-auto p-6 sm:p-8">
            <div
              className="origin-top shadow-2xl transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <CvPaperPreview sampleData={template.sampleData} primaryColor={activeColor} isMini={false} />
            </div>
          </div>
        </div>

        {/* Right Side: Options, ATS Analysis & Action Panel */}
        <div className="flex w-full flex-col justify-between overflow-y-auto bg-white p-6 sm:p-8 lg:w-96">
          <div className="space-y-6">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs text-[#7f878f]">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {template.rating}
                </span>
                <span>•</span>
                <span>{template.usesCount} lượt sử dụng</span>
              </div>
              <h3 className="text-xl font-bold text-[#171717]">{template.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#526475]">{template.description}</p>
            </div>

            {/* Color Palette Switcher */}
            <div>
              <label className="mb-2.5 block text-xs font-bold tracking-wider text-[#263a4d] uppercase">
                Chọn gam màu chủ đạo:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {template.availableColors.map((col) => {
                  const isCurrent = activeColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setActiveColor(col.hex)}
                      title={col.name}
                      className={`flex h-8 w-8 items-center justify-center rounded-full shadow-xs transition-all ${
                        isCurrent
                          ? 'scale-110 ring-3 ring-[#00b14f] ring-offset-2'
                          : 'opacity-85 hover:scale-105 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {isCurrent && <Check className="h-4 w-4 stroke-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ATS Score Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#00b14f]" />
                  <span className="text-xs font-bold text-[#171717]">Đánh giá chuẩn ATS</span>
                </div>
                <span className="text-sm font-black text-[#00b14f]">98 / 100</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#065f46]">
                Mẫu CV này được định dạng phân cấp tiêu đề chuẩn, tỷ lệ khoảng trắng cân đối, tối ưu trích xuất dữ liệu
                không lỗi bảng/font.
              </p>
            </div>

            {/* Recommended for */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-[#263a4d] uppercase">
                Phù hợp nhất với:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {template.recommendedFor.map((rec, idx) => (
                  <span key={idx} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-[#263a4d]">
                    {rec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
            <Link
              href="/candidate/profile"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00b14f] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#00b14f]/25 transition hover:bg-[#009b44]"
            >
              <span>Dùng mẫu này để tạo CV</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={handleDownloadMock}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-xs font-bold text-[#263a4d] transition hover:bg-gray-50"
            >
              {isDownloaded ? (
                <>
                  <FileCheck className="h-4 w-4 text-[#00b14f]" />
                  <span className="text-[#00b14f]">Đã tải file PDF mẫu thành công!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-[#7f878f]" />
                  <span>Tải bản mẫu định dạng PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
