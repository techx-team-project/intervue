'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface GrowthToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  ctaText: string;
  icon: string;
  isExternal?: boolean;
}

const LEFT_TOOLS: GrowthToolItem[] = [
  {
    id: 'cv-builder',
    title: 'Tạo CV Chuyên Nghiệp',
    desc: 'Hàng trăm mẫu CV chuẩn quốc tế, gợi ý AI thông minh giúp tăng 80% cơ hội lọt mắt nhà tuyển dụng.',
    href: '/cv/builder',
    ctaText: 'Tạo CV ngay',
    icon: '/cv-builder-desktop.png',
  },
  {
    id: 'cv-score',
    title: 'AI Quét & Chấm Điểm CV',
    desc: 'Tải CV lên để AI phân tích độ tương thích so với JD tuyển dụng, nhận báo cáo giải thích và tối ưu từ khóa.',
    href: '/cv/score',
    ctaText: 'Chấm điểm CV',
    icon: '/cv-score-desktop.png',
  },
  {
    id: 'mbti',
    title: 'Trắc nghiệm tính cách MBTI',
    desc: 'Khám phá 16 nhóm tính cách đặc trưng để hiểu rõ điểm mạnh, định hướng văn hóa làm việc phù hợp.',
    href: 'https://www.topcv.vn/trac-nghiem-tinh-cach-mbti',
    ctaText: 'Khám phá ngay',
    icon: '/mbti-desktop.png',
    isExternal: true,
  },
];

const RIGHT_TOOLS: GrowthToolItem[] = [
  {
    id: 'ai-interview',
    title: 'Luyện Phỏng Vấn Cùng AI',
    desc: 'Luyện tập phỏng vấn 1:1 qua giọng nói & video theo đúng JD, chấm điểm năng lực và sửa lỗi tức thì.',
    href: '/interview/mock',
    ctaText: 'Luyện tập ngay',
    icon: '/ai-interview-desktop.png',
  },
  {
    id: 'job-search',
    title: 'Tìm Việc Làm Thông Minh',
    desc: 'Thuật toán AI tự động đối chiếu năng lực bài test và kinh nghiệm để đề xuất các cơ hội việc làm chuẩn xác.',
    href: '#feature-jobs',
    ctaText: 'Khám phá việc làm',
    icon: '/job-search-desktop.png',
  },
  {
    id: 'mi',
    title: 'Trắc nghiệm trí thông minh MI',
    desc: 'Phát hiện tiềm năng vượt trội về logic, ngôn ngữ hay không gian để lựa chọn hướng phát triển lý tưởng.',
    href: 'https://www.topcv.vn/trac-nghiem-da-tri-thong-minh-multiple-intelligences-test',
    ctaText: 'Khám phá ngay',
    icon: '/mi-desktop.png',
    isExternal: true,
  },
];

export default function CareerGrowthSection() {
  return (
    <section
      id="self-growth"
      className="relative my-14 w-full overflow-hidden border-y border-[#00ff87]/20 bg-[#01180d] py-16 font-sans shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:py-20"
    >
      {/* 1. NỀN XANH ĐẬM NEON & HIỆU ỨNG ÁNH SÁNG AMBIENT */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Glow neon trung tâm */}
        <div className="absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ff87]/15 blur-[130px]" />
        {/* Glow neon góc trên trái */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#00e676]/15 blur-[100px]" />
        {/* Glow neon góc dưới phải */}
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-[#00f2fe]/10 blur-[100px]" />

        {/* Lớp lưới công nghệ neon chấm tròn mờ ảo */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#00ff87 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 80%)',
          }}
        />
      </div>

      <div className="container-topcv relative z-10">
        {/* 2. TIÊU ĐỀ NỔI BẬT CĂN GIỮA */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#00ff87]/40 bg-[#00ff87]/10 px-4 py-1 text-[12px] font-bold text-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.25)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#00ff87]" />
            <span>HỆ SINH THÁI CÔNG CỤ THÔNG MINH INTERVUE</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-[42px]">
            Cùng{' '}
            <span className="bg-linear-to-r from-[#00ff87] via-[#22c55e] to-[#4ade80] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,135,0.45)]">
              InterVue
            </span>{' '}
            xây dựng thương hiệu cá nhân
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[14.5px] font-medium text-emerald-100/75 sm:text-[16px]">
            Hệ sinh thái công cụ nghề nghiệp ứng dụng AI toàn diện giúp bạn nâng tầm hồ sơ, tự tin phỏng vấn và bứt phá
            sự nghiệp
          </p>
        </div>

        {/* 3. BỐ CỤC 3 CỘT: 3 CARD TRÁI - ẢNH NHÂN VẬT & AI TRUNG TÂM - 3 CARD PHẢI */}
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
          {/* CỘT TRÁI: 3 thẻ tính năng (Card giữa lệch ra ngoài tạo layout thụt lùi) */}
          <div className="flex flex-col gap-4.5 lg:col-span-4">
            {LEFT_TOOLS.map((tool, idx) => (
              <a
                key={tool.id}
                href={tool.href}
                target={tool.isExternal ? '_blank' : undefined}
                rel={tool.isExternal ? 'noreferrer' : undefined}
                className={`group relative flex items-center gap-4 rounded-2xl border border-emerald-500/25 bg-[#032616]/80 p-4.5 shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-[#00ff87] hover:bg-[#053720]/95 hover:shadow-[0_0_25px_rgba(0,255,135,0.3)] ${
                  idx === 1
                    ? 'lg:-translate-x-8 hover:lg:-translate-x-9 xl:-translate-x-10'
                    : 'lg:translate-x-2 hover:lg:translate-x-1'
                } hover:-translate-y-1`}
              >
                {/* 3D Icon Box */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:border-[#00ff87]/50">
                  <img src={tool.icon} alt={tool.title} className="h-full w-full object-contain drop-shadow-sm" />
                </div>

                {/* Nội dung chi tiết */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15.5px] font-bold text-white transition-colors group-hover:text-[#00ff87] sm:text-[16.5px]">
                    {tool.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-emerald-100/70">{tool.desc}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#00ff87] transition-all group-hover:translate-x-1">
                    <span>{tool.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* CỘT GIỮA: ẢNH MINH HỌA ỨNG VIÊN & TRỢ LÝ AI TRUNG TÂM */}
          <div className="relative flex items-center justify-center py-4 lg:col-span-4">
            {/* Vòng hào quang Neon phía sau nhân vật */}
            <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-[#00ff87]/25 blur-3xl sm:h-88 sm:w-88" />
            <div className="pointer-events-none absolute -bottom-4 h-12 w-52 rounded-[100%] bg-[#00ff87]/40 blur-xl" />

            <img
              src="/personal-brand-center.png"
              alt="InterVue Personal Branding"
              className="relative z-10 max-h-95 w-auto object-contain drop-shadow-[0_15px_35px_rgba(0,255,135,0.3)] transition-transform duration-500 hover:scale-105 sm:max-h-110"
            />
          </div>

          {/* CỘT PHẢI: 3 thẻ tính năng (Card giữa lệch ra ngoài tạo layout thụt lùi) */}
          <div className="flex flex-col gap-4.5 lg:col-span-4">
            {RIGHT_TOOLS.map((tool, idx) => (
              <a
                key={tool.id}
                href={tool.href}
                target={tool.isExternal ? '_blank' : undefined}
                rel={tool.isExternal ? 'noreferrer' : undefined}
                className={`group relative flex items-center gap-4 rounded-2xl border border-emerald-500/25 bg-[#032616]/80 p-4.5 shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-[#00ff87] hover:bg-[#053720]/95 hover:shadow-[0_0_25px_rgba(0,255,135,0.3)] ${
                  idx === 1
                    ? 'lg:translate-x-8 hover:lg:translate-x-9 xl:translate-x-10'
                    : 'lg:-translate-x-2 hover:lg:-translate-x-1'
                } hover:-translate-y-1`}
              >
                {/* 3D Icon Box */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:border-[#00ff87]/50">
                  <img src={tool.icon} alt={tool.title} className="h-full w-full object-contain drop-shadow-sm" />
                </div>

                {/* Nội dung chi tiết */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15.5px] font-bold text-white transition-colors group-hover:text-[#00ff87] sm:text-[16.5px]">
                    {tool.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-emerald-100/70">{tool.desc}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#00ff87] transition-all group-hover:translate-x-1">
                    <span>{tool.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
