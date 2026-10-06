import { ArrowRight, Award, ChevronLeft, ChevronRight, Clock, ShieldCheck } from 'lucide-react';

interface RecruitmentBannerProps {
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export default function RecruitmentBanner({ current, onPrev, onNext, onSelect }: RecruitmentBannerProps) {
  return (
    <div className="group relative flex h-72 flex-col justify-between overflow-hidden rounded-2xl border border-[#e9eaec] bg-white shadow-md md:col-span-6">
      {/* Banner Carousel Container */}
      <div className="relative h-full w-full overflow-hidden">
        {/* SLIDE 1: Tuyển dụng Nhân tài Công nghệ & AI InterVue */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === 0 ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
          }`}
        >
          <img
            src="/banner-recruitment-1.jpg"
            alt="InterVue - Hires Smarter. Faster."
            className="h-full w-full object-cover object-center"
          />
          {/* Clean elegant CTA button bottom right */}
          <div className="absolute right-3 bottom-3 z-20">
            <a
              href="#feature-jobs"
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#00b14f] px-4 py-2 text-[12.5px] font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#009643]"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* SLIDE 2: Kiếm thêm thu nhập & Cơ hội nghề nghiệp */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === 1 ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
          }`}
        >
          <div className="relative flex h-full w-full items-center justify-between overflow-hidden bg-linear-to-r from-[#eef8ff] via-[#f4fbf7] to-[#e8f7ee] p-5">
            <div className="relative flex h-full w-[42%] shrink-0 items-end justify-center">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/section-header/toppy-hr-tech.png"
                alt="Candidates"
                className="max-h-62.5 w-auto object-contain drop-shadow-md"
              />
            </div>
            <div className="flex w-[58%] flex-col justify-center pl-3">
              <div className="mb-1 font-serif text-[14px] font-medium text-[#1e40af] italic">Cơ hội được đề xuất</div>
              <h2 className="mb-2.5 text-[18px] leading-tight font-extrabold text-[#263a4d] sm:text-[20px]">
                Kiếm thêm <span className="text-[#00b14f]">thu nhập</span> khi đang tìm việc
              </h2>
              <div className="mb-3.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#4d5965]">
                <span className="flex items-center gap-1 rounded-md border border-[#e2e8f0] bg-white/80 px-2 py-0.5">
                  <Clock className="h-3 w-3 text-[#00b14f]" />
                  Thời gian linh hoạt
                </span>
                <span className="flex items-center gap-1 rounded-md border border-[#e2e8f0] bg-white/80 px-2 py-0.5">
                  <Award className="h-3 w-3 text-[#00b14f]" />
                  Nhà tuyển dụng uy tín
                </span>
                <span className="flex items-center gap-1 rounded-md border border-[#e2e8f0] bg-white/80 px-2 py-0.5">
                  <ShieldCheck className="h-3 w-3 text-[#00b14f]" />
                  Ứng tuyển minh bạch
                </span>
              </div>
              <div>
                <a
                  href="#feature-jobs"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#00b14f] px-5 py-2 text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#009643]"
                >
                  <span>Khám phá ngay</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Navigation Arrows */}
      <button
        type="button"
        onClick={onPrev}
        className="absolute top-1/2 left-2.5 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e9eaec] bg-white/90 text-[#263a4d] shadow-md transition-all hover:bg-white"
        title="Banner trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute top-1/2 right-2.5 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e9eaec] bg-white/90 text-[#263a4d] shadow-md transition-all hover:bg-white"
        title="Banner tiếp theo"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Indicator Dots (2 dots) */}
      <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
        {[0, 1].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(idx)}
            className={`cursor-pointer transition-all ${
              current === idx
                ? 'h-1.5 w-5 rounded-full bg-[#00b14f]'
                : 'h-1.5 w-1.5 rounded-full border border-black/10 bg-white/80 hover:bg-white'
            }`}
            title={`Xem banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
