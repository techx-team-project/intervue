import { ArrowRight, Trophy } from 'lucide-react';

import { COMPANY_AWARDS } from '@/constants/home/awards';

export default function AwardsSection() {
  return (
    <section id="achievement-award" className="container-topcv">
      <div className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7] px-3 py-1 text-[12.5px] font-bold text-[#d97706]">
          <Trophy className="h-3.5 w-3.5" />
          UY TÍN & DANH HIỆU
        </div>
        <h2 className="text-2xl font-bold text-[#263a4d] md:text-3xl">Giải thưởng, thành tựu</h2>
        <p className="mt-1 text-[14.5px] text-[#6f7882]">
          Sự công nhận từ các tổ chức uy tín trong nước và quốc tế cho giải pháp công nghệ nhân sự InterVue
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {COMPANY_AWARDS.map((award, idx) => (
          <a
            key={idx}
            href={award.link}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col items-center justify-between rounded-2xl border border-[#e9eaec] bg-white p-5 text-center transition-all hover:border-[#00b14f] hover:shadow-md"
          >
            <div className="mb-4 flex h-24 w-24 items-center justify-center p-2 transition-transform group-hover:scale-105">
              <img src={award.img} alt={award.title} className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <h3 className="mb-2 line-clamp-2 text-[13.5px] leading-snug font-semibold text-[#263a4d] transition-colors group-hover:text-[#00b14f]">
                {award.title}
              </h3>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#00b14f]">
                Đọc thêm <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
