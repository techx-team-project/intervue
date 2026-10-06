import { Smartphone } from 'lucide-react';

export default function MobileAppSection() {
  return (
    <section id="mobile-app-intro" className="container-topcv">
      <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-linear-to-r from-[#212f3f] to-[#1e293b] p-8 text-white shadow-xl md:p-12 lg:flex-row">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#00b14f] px-3 py-1 text-[12px] font-bold text-white">
            <Smartphone className="h-3.5 w-3.5" />
            INTERVUE APP
          </div>
          <h2 className="mb-3 text-2xl leading-tight font-extrabold md:text-3xl">
            Kiến tạo sự nghiệp của riêng bạn với ứng dụng InterVue
          </h2>
          <div className="mb-2 text-lg font-bold text-[#00b14f]">“Tất cả trong một”</div>
          <p className="mb-6 text-[15px] leading-relaxed text-[#b3b8bd]">
            Trải nghiệm tạo CV, tìm việc làm, nộp hồ sơ trực tiếp, nhận thông báo phỏng vấn tức thì và theo dõi lộ trình
            nghề nghiệp - chỉ với một ứng dụng duy nhất.
          </p>

          {/* QR and Download buttons */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="shrink-0 rounded-xl bg-white p-2 shadow-md">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/mobile-app/qr_code_app_black.png"
                alt="QR Code InterVue App"
                className="h-24 w-24 object-contain"
              />
            </div>

            <div className="space-y-2.5">
              <div className="text-[13px] font-medium text-[#b3b8bd]">Quét mã để tải ứng dụng ngay:</div>
              <div className="flex items-center gap-3">
                <a
                  href="https://itunes.apple.com/us/app/topcv-t%E1%BA%A1o-cv-t%C3%ACm-vi%E1%BB%87c-l%C3%A0m/id1455928592?ls=1&mt=8"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-opacity hover:opacity-90"
                >
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/mobile-app/appstore_black.png"
                    alt="Tải App Store"
                    className="h-10 w-auto"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.topcv"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-opacity hover:opacity-90"
                >
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/mobile-app/googleplay_black.png"
                    alt="Tải Google Play"
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center justify-center lg:w-105">
          <img
            src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/section-header/toppy-hr-tech.png"
            alt="InterVue Mobile App Mascot"
            className="max-h-75 w-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
