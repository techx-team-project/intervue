import { QrCode } from 'lucide-react';

export default function QrLoginPanel() {
  return (
    <div className="relative flex h-72 flex-col justify-between overflow-hidden rounded-2xl border border-[#e9eaec] bg-white text-center shadow-md md:col-span-3">
      {/* Header: QUÉT MÃ ĐỂ ĐĂNG NHẬP */}
      <div className="flex items-center justify-between px-4 pt-3.5">
        <div className="flex-1 text-left text-[12.5px] font-bold tracking-wide text-[#00b14f] uppercase">
          QUÉT MÃ ĐỂ ĐĂNG NHẬP
        </div>
        <QrCode className="h-4 w-4 shrink-0 text-[#00b14f]" />
      </div>

      {/* QR Code in Center */}
      <div className="my-auto flex items-center justify-center py-1">
        <div className="rounded-xl border border-[#e9eaec] bg-white p-2 shadow-xs transition-colors hover:border-[#00b14f]">
          <img
            src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/mobile-app/qr_code_app_black.png"
            alt="QR Code InterVue"
            className="h-36 w-36 object-contain"
          />
        </div>
      </div>

      {/* Bottom Green Container */}
      <div className="bg-[#00b14f] px-3 py-2.5 text-[11.5px] leading-tight font-medium text-white">
        <div>Sử dụng app InterVue để quét mã</div>
        <a
          href="https://www.topcv.vn/app"
          target="_blank"
          rel="noreferrer"
          className="mt-0.5 inline-block text-[11px] text-white/90 underline hover:text-white"
        >
          Hướng dẫn quét QR
        </a>
      </div>
    </div>
  );
}
