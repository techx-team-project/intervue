import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EcosystemSection() {
  return (
    <section id="intervue-ecosystem" className="container-topcv">
      <div className="mb-8 text-center">
        <h2 className="text-navy text-2xl font-bold md:text-3xl">Hệ sinh thái công nghệ nhân sự của InterVue</h2>
        <p className="mt-1 text-[14.5px] text-[#6f7882]">
          Giải pháp toàn diện từ tuyển dụng, đánh giá năng lực đến quản trị và trải nghiệm nhân viên
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* InterVue */}
        <Link
          href="/"
          className="group hover:border-primary flex flex-col justify-between rounded-2xl border border-[#e9eaec] bg-white p-6 transition-all hover:shadow-lg"
        >
          <div>
            <div className="mb-4 flex h-10 items-center">
              <img src="/intervue-logo.png" alt="InterVue.vn" className="h-8 w-auto object-contain" />
            </div>
            <h3 className="text-navy group-hover:text-primary mb-2 text-base font-bold transition-colors">
              InterVue.vn
            </h3>
            <p className="text-[13px] leading-relaxed text-[#6f7882]">
              Nền tảng công nghệ tuyển dụng thông minh hàng đầu Việt Nam, kết nối ứng viên và nhà tuyển dụng hiệu quả.
            </p>
          </div>
          <div className="text-primary mt-4 flex items-center gap-1 border-t border-[#f4f5f5] pt-3 text-[13px] font-semibold">
            Khám phá <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* HappyTime */}
        <a
          href="https://happytime.vn/"
          target="_blank"
          rel="noreferrer"
          className="group hover:border-primary flex flex-col justify-between rounded-2xl border border-[#e9eaec] bg-white p-6 transition-all hover:shadow-lg"
        >
          <div>
            <div className="mb-4 flex h-10 items-center">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/happy_time.png"
                alt="HappyTime.vn"
                className="h-8 w-auto object-contain"
              />
            </div>
            <h3 className="text-navy group-hover:text-primary mb-2 text-base font-bold transition-colors">
              HappyTime.vn
            </h3>
            <p className="text-[13px] leading-relaxed text-[#6f7882]">
              Nền tảng quản lý chấm công online & gia tăng trải nghiệm nhân viên, giải thưởng Sao Khuê 2022.
            </p>
          </div>
          <div className="text-primary mt-4 flex items-center gap-1 border-t border-[#f4f5f5] pt-3 text-[13px] font-semibold">
            Khám phá <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </a>

        {/* TestCenter */}
        <a
          href="https://www.testcenter.vn/"
          target="_blank"
          rel="noreferrer"
          className="group hover:border-primary flex flex-col justify-between rounded-2xl border border-[#e9eaec] bg-white p-6 transition-all hover:shadow-lg"
        >
          <div>
            <div className="mb-4 flex h-10 items-center">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/testcenter.png"
                alt="TestCenter.vn"
                className="h-8 w-auto object-contain"
              />
            </div>
            <h3 className="text-navy group-hover:text-primary mb-2 text-base font-bold transition-colors">
              TestCenter.vn
            </h3>
            <p className="text-[13px] leading-relaxed text-[#6f7882]">
              Nền tảng thiết lập đề thi và đánh giá năng lực nhân sự toàn diện hàng đầu cho doanh nghiệp.
            </p>
          </div>
          <div className="text-primary mt-4 flex items-center gap-1 border-t border-[#f4f5f5] pt-3 text-[13px] font-semibold">
            Khám phá <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </a>

        {/* SHiring */}
        <a
          href="https://www.shiring.ai/"
          target="_blank"
          rel="noreferrer"
          className="group hover:border-primary flex flex-col justify-between rounded-2xl border border-[#e9eaec] bg-white p-6 transition-all hover:shadow-lg"
        >
          <div>
            <div className="mb-4 flex h-10 items-center">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/footer/SHiring.png"
                alt="SHiring.ai"
                className="h-8 w-auto object-contain"
              />
            </div>
            <h3 className="text-navy group-hover:text-primary mb-2 text-base font-bold transition-colors">
              SHiring.ai
            </h3>
            <p className="text-[13px] leading-relaxed text-[#6f7882]">
              Hệ thống quản trị tuyển dụng tinh gọn (ATS) ứng dụng AI hàng đầu giúp tối ưu 50% thời gian tuyển dụng.
            </p>
          </div>
          <div className="text-primary mt-4 flex items-center gap-1 border-t border-[#f4f5f5] pt-3 text-[13px] font-semibold">
            Khám phá <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </a>
      </div>
    </section>
  );
}
