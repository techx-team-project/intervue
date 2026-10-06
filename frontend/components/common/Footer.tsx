import Link from 'next/link';
import { ArrowRight, FileCheck, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

const SEO_KEYWORDS = [
  { name: 'Việc làm', link: 'https://www.topcv.vn/viec-lam' },
  { name: 'Việc làm Hà Nội', link: 'https://www.topcv.vn/tim-viec-lam-moi-nhat-tai-ha-noi-l1' },
  { name: 'Việc làm TP. HCM', link: 'https://www.topcv.vn/tim-viec-lam-moi-nhat-tai-ho-chi-minh-l2' },
  { name: 'Việc làm Đà Nẵng', link: 'https://www.topcv.vn/tim-viec-lam-moi-nhat-tai-da-nang-l8' },
  { name: 'Việc làm Cần Thơ', link: 'https://www.topcv.vn/tim-viec-lam-moi-nhat-tai-can-tho-l20' },
  { name: 'Việc làm Hải Phòng', link: 'https://www.topcv.vn/tim-viec-lam-moi-nhat-tai-hai-phong-l9' },
  { name: 'Việc làm Bình Dương', link: 'https://www.topcv.vn/tim-viec-lam-moi-nhat-tai-binh-duong-l3' },
  { name: 'Việc làm Đồng Nai', link: 'https://www.topcv.vn/tim-viec-lam-moi-nhat-tai-dong-nai-l5' },
  { name: 'Việc làm Nhân viên kinh doanh', link: 'https://www.topcv.vn/tim-viec-lam-nhan-vien-kinh-doanh' },
  { name: 'Việc làm Marketing', link: 'https://www.topcv.vn/tim-viec-lam-marketing' },
  { name: 'Việc làm Kế toán', link: 'https://www.topcv.vn/tim-viec-lam-ke-toan' },
  { name: 'Việc làm IT / Lập trình viên', link: 'https://www.topcv.vn/viec-lam-it' },
  { name: 'Việc làm Chăm sóc khách hàng', link: 'https://www.topcv.vn/tim-viec-lam-cham-soc-khach-hang' },
  { name: 'Việc làm Hành chính nhân sự', link: 'https://www.topcv.vn/tim-viec-lam-hanh-chinh-nhan-su' },
  { name: 'Tính lương Gross - Net', link: 'https://www.topcv.vn/tinh-luong-gross-net' },
  { name: 'Tính thuế thu nhập cá nhân', link: 'https://www.topcv.vn/tinh-thue-thu-nhap-ca-nhan' },
  { name: 'Trắc nghiệm tính cách MBTI', link: 'https://www.topcv.vn/trac-nghiem-tinh-cach-mbti' },
  { name: 'Mẫu CV xin việc tiếng Việt', link: 'https://www.topcv.vn/mau-cv' },
  { name: 'Mẫu CV tiếng Anh chuẩn', link: 'https://www.topcv.vn/mau-cv-tieng-anh' },
  { name: 'Cách viết CV xin việc chuẩn', link: 'https://www.topcv.vn/viet-cv-the-nao-cho-chuan' },
];

export default function Footer() {
  return (
    <footer id="footer-desktop" className="border-t border-[#e9eaec] bg-white pt-10">
      {/* 1. SEO Keyword Cloud */}
      <div className="container-topcv border-b border-[#f4f5f5] pb-8">
        <div className="flex flex-wrap gap-2 text-[12.5px] text-[#6f7882]">
          {SEO_KEYWORDS.map((kw, i) => (
            <a
              key={i}
              href={kw.link}
              target="_blank"
              rel="noreferrer"
              className="transition-colors after:ml-2 after:text-[#e9eaec] after:content-['•'] last:after:content-none hover:text-[#00b14f]"
            >
              {kw.name}
            </a>
          ))}
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="container-topcv py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1 & 2: TopCV Info, Contact & Apps */}
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="inline-block">
              <img src="/intervue-logo.png" alt="InterVue Vietnam" className="h-10 w-auto object-contain" />
            </Link>

            {/* Badges */}
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/google_for_startup.png"
                alt="Google for Startups"
                className="h-8 w-auto object-contain"
              />
              <img
                src="https://images.dmca.com/Badges/DMCA_badge_grn_60w.png?ID=8be40718-7da1-4b43-875a-3efb819100c9"
                alt="DMCA Protected"
                className="h-7 w-auto object-contain"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-[13.5px] text-[#4d5965]">
              <div className="text-[14.5px] font-bold text-[#263a4d]">Liên hệ hỗ trợ:</div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#00b14f]" />
                <span>Hotline:</span>
                <a href="tel:1900068889" className="font-semibold text-[#263a4d] hover:text-[#00b14f]">
                  1900 068 889 (Nhánh 2)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#00b14f]" />
                <span>Email:</span>
                <a href="mailto:hotro@intervue.vn" className="text-[#263a4d] hover:text-[#00b14f]">
                  hotro@intervue.vn
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0068ff] text-[10px] font-bold text-white">
                  Z
                </span>
                <span>Zalo hỗ trợ ứng viên:</span>
                <a
                  href="https://zalo.me/946504486043251830"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#00b14f] hover:underline"
                >
                  Kết nối ngay <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* App Downloads & Social */}
            <div>
              <div className="mb-2.5 text-[13px] font-bold text-[#263a4d]">Ứng dụng tải xuống:</div>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://itunes.apple.com/us/app/topcv-t%E1%BA%A1o-cv-t%C3%ACm-vi%E1%BB%87c-l%C3%A0m/id1455928592?ls=1&mt=8"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/download/app_store.png"
                    alt="App Store"
                    className="h-9 w-auto"
                  />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.topcv" target="_blank" rel="noreferrer">
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/download/chplay.png"
                    alt="Google Play"
                    className="h-9 w-auto"
                  />
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <div className="mb-2 text-[13px] font-bold text-[#263a4d]">Cộng đồng InterVue:</div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/topcv.vn/"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 overflow-hidden rounded-full transition-opacity hover:opacity-80"
                >
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/facebook.png"
                    alt="Facebook"
                    className="h-full w-full object-cover"
                  />
                </a>
                <a
                  href="https://www.youtube.com/c/TopCVpro"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 overflow-hidden rounded-full transition-opacity hover:opacity-80"
                >
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/youtube.png"
                    alt="YouTube"
                    className="h-full w-full object-cover"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/topcv-vietnam"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 overflow-hidden rounded-full transition-opacity hover:opacity-80"
                >
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/linkedin.png"
                    alt="LinkedIn"
                    className="h-full w-full object-cover"
                  />
                </a>
                <a
                  href="https://www.tiktok.com/@topcv"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 overflow-hidden rounded-full transition-opacity hover:opacity-80"
                >
                  <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/tiktok.png"
                    alt="TikTok"
                    className="h-full w-full object-cover"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Về InterVue */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-[#263a4d]">Về InterVue</h3>
            <ul className="space-y-2 text-[13.5px] text-[#6f7882]">
              <li>
                <a href="https://topcv.com.vn/" target="_blank" rel="noreferrer" className="hover:text-[#00b14f]">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/gioi-thieu#bao-chi"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Góc báo chí
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/cong-ty/cong-ty-co-phan-topcv-viet-nam/105.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/gioi-thieu#lien-he"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="https://www.topcv.vn/faqs" target="_blank" rel="noreferrer" className="hover:text-[#00b14f]">
                  Hỏi đáp
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/dieu-khoan-bao-mat"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Chính sách quyền riêng tư
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/terms-of-service"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Điều khoản dịch vụ
                </a>
              </li>
            </ul>

            <h3 className="pt-3 text-[15px] font-bold text-[#263a4d]">Đối tác</h3>
            <ul className="space-y-2 text-[13.5px] text-[#6f7882]">
              <li>
                <a href="https://www.testcenter.vn/" target="_blank" rel="noreferrer" className="hover:text-[#00b14f]">
                  TestCenter.vn
                </a>
              </li>
              <li>
                <a href="https://happytime.vn/" target="_blank" rel="noreferrer" className="hover:text-[#00b14f]">
                  HappyTime.vn
                </a>
              </li>
              <li>
                <a href="https://tophr.vn" target="_blank" rel="noreferrer" className="hover:text-[#00b14f]">
                  TopHR
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hồ sơ & Khám phá */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-[#263a4d]">Hồ sơ và CV</h3>
            <ul className="space-y-2 text-[13.5px] text-[#6f7882]">
              <li>
                <a
                  href="https://www.topcv.vn/quan-ly-cv"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Quản lý CV của bạn
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/viet-cv-the-nao-cho-chuan"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Hướng dẫn viết CV
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/mau-cv-theo-vi-tri-cong-viec"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Thư viện CV theo ngành nghề
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/mau-cover-letter-thu-xin-viec"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Mẫu Cover Letter chuẩn
                </a>
              </li>
            </ul>

            <h3 className="pt-3 text-[15px] font-bold text-[#263a4d]">Khám phá công cụ</h3>
            <ul className="space-y-2 text-[13.5px] text-[#6f7882]">
              <li>
                <a
                  href="https://www.topcv.vn/tinh-luong-gross-net"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Tính lương Gross - Net
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/tinh-lai-kep"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Tính lãi suất kép
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/lap-ke-hoach-tiet-kiem"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Lập kế hoạch tiết kiệm
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/cong-cu-tinh-muc-huong-bao-hiem-that-nghiep"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Tính bảo hiểm thất nghiệp
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/trac-nghiem-tinh-cach-mbti"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Trắc nghiệm MBTI
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Xây dựng sự nghiệp */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-[#263a4d]">Xây dựng sự nghiệp</h3>
            <ul className="space-y-2 text-[13.5px] text-[#6f7882]">
              <li>
                <a
                  href="https://www.topcv.vn/viec-lam-tot-nhat"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Việc làm nổi bật
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/viec-lam-luong-cao"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Việc làm lương cao
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/viec-lam-quan-ly"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Việc làm quản lý
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/viec-lam-it"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Việc làm IT
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/viec-lam-senior"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Việc làm Senior
                </a>
              </li>
              <li>
                <a
                  href="https://www.topcv.vn/tim-viec-lam-ban-thoi-gian-t3"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00b14f]"
                >
                  Việc làm bán thời gian
                </a>
              </li>
            </ul>

            <div className="pt-4">
              <div className="rounded-xl border border-[#e9eaec] bg-[#f8fafc] p-3.5">
                <div className="mb-1 text-[12.5px] font-bold text-[#263a4d]">Nhà tuyển dụng?</div>
                <div className="mb-2.5 text-[12px] text-[#6f7882]">
                  Đăng tin tuyển dụng và tìm hồ sơ ứng viên nhanh chóng.
                </div>
                <a
                  href="https://www.topcv.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg bg-[#00b14f] py-1.5 text-center text-[12.5px] font-semibold text-white transition-colors hover:bg-[#009643]"
                >
                  Đăng tin ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#e9eaec] bg-[#f8fafc] py-8 text-[12.5px] text-[#7f878f]">
        <div className="container-topcv space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
                <span>
                  Giấy phép hoạt động dịch vụ việc làm số:{' '}
                  <strong className="text-[#263a4d]">44/2024/SLĐTBXH-GP</strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
                <span>
                  Trụ sở HN:{' '}
                  <strong className="text-[#263a4d]">
                    Tòa FS - GoldSeason số 47 Nguyễn Tuân, Phường Thanh Xuân, TP. Hà Nội
                  </strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
                <span>
                  Chi nhánh HCM:{' '}
                  <strong className="text-[#263a4d]">
                    Tòa nhà Dali, 24C Phan Đăng Lưu, Phường Gia Định, TP. Hồ Chí Minh
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between md:items-end">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#00b14f]" />
                <span>Bản quyền thuộc Công ty Cổ phần InterVue Việt Nam</span>
              </div>
              <p className="mt-2 font-medium text-[#4d5965] md:mt-0">
                © 2024 - 2026 InterVue Vietnam JSC. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
