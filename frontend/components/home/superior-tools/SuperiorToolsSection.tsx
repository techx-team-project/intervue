'use client';
import { useState } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';

interface ToolItem {
  id: string;
  category: 'salary' | 'insurance' | 'finance';
  categoryLabel: string;
  badgeClass: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
  isPopular?: boolean;
}

const TOOLS_DATA: ToolItem[] = [
  {
    id: 'gross-net',
    category: 'salary',
    categoryLabel: 'Lương & Thuế',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Tính lương GROSS - NET',
    desc: 'Quy đổi chính xác và tức thì mức lương Gross sang Net & ngược lại theo quy định pháp luật mới nhất.',
    icon: '/tools/gross-net.png',
    link: 'https://www.topcv.vn/tinh-luong-gross-net',
    isPopular: true,
  },
  {
    id: 'tax',
    category: 'salary',
    categoryLabel: 'Lương & Thuế',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Tính thuế thu nhập cá nhân',
    desc: 'Công cụ tính thuế TNCN chuẩn theo biểu lũy tiến từng phần kèm các khoản giảm trừ gia cảnh hiện hành.',
    icon: '/tools/thu-nhap-ca-nhan.png',
    link: 'https://www.topcv.vn/tinh-thue-thu-nhap-ca-nhan',
    isPopular: true,
  },
  {
    id: 'compound-interest',
    category: 'finance',
    categoryLabel: 'Tài chính cá nhân',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Tính lãi suất kép',
    desc: 'Kỳ quan thứ 8 của nhân loại - Khám phá sức mạnh sinh lời của lãi kép và thiết lập lộ trình tự do tài chính.',
    icon: '/tools/lai-suat-kep.png',
    link: 'https://www.topcv.vn/tinh-lai-kep',
  },
  {
    id: 'unemployment',
    category: 'insurance',
    categoryLabel: 'Bảo hiểm xã hội',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Tính Bảo hiểm thất nghiệp',
    desc: 'Tra cứu mức hưởng trợ cấp thất nghiệp, số tháng được nhận và thủ tục hồ sơ bảo hiểm nhanh chóng.',
    icon: '/tools/bao-hiem-that-nghiep.png',
    link: 'https://www.topcv.vn/cong-cu-tinh-muc-huong-bao-hiem-that-nghiep',
  },
  {
    id: 'savings',
    category: 'finance',
    categoryLabel: 'Tài chính cá nhân',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Lập kế hoạch tiết kiệm',
    desc: 'Thiết lập mục tiêu mua nhà, mua xe, tài chính cá nhân với bảng tính dòng tiền tiết kiệm chi tiết từng tháng.',
    icon: '/tools/ke-hoach-tiet-kiem.png',
    link: 'https://www.topcv.vn/lap-ke-hoach-tiet-kiem',
  },
  {
    id: 'social-insurance',
    category: 'insurance',
    categoryLabel: 'Bảo hiểm xã hội',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Tính BHXH một lần',
    desc: 'Dự toán chính xác số tiền BHXH 1 lần bạn có thể rút dựa trên thời gian tham gia đóng bảo hiểm thực tế.',
    icon: '/tools/bao-hiem-xa-hoi-mot-lan.png',
    link: 'https://www.topcv.vn/tinh-bao-hiem-xa-hoi-mot-lan',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả tiện ích (6)' },
  { id: 'salary', label: 'Lương & Thuế' },
  { id: 'insurance', label: 'Bảo hiểm xã hội' },
  { id: 'finance', label: 'Tài chính cá nhân' },
];

export default function SuperiorToolsSection() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTools = activeTab === 'all' ? TOOLS_DATA : TOOLS_DATA.filter((tool) => tool.category === activeTab);

  return (
    <section id="superior-tool" className="container-topcv my-14 font-sans">
      <div className="rounded-4xl border border-slate-200/90 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-10 lg:p-12">
        {/* 1. Header Bar: Tiêu đề + Tabs lọc danh mục */}
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1 text-[12px] font-bold text-[#00b14f]">
              <Calculator className="h-3.5 w-3.5" />
              <span>BỘ TIỆN ÍCH DÀNH CHO NGƯỜI ĐI LÀM</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[#1e293b] sm:text-3xl md:text-4xl">
              Công cụ <span className="text-[#00b14f]">vượt trội!</span>
            </h2>

            <p className="mt-2 text-[14px] text-[#64748b] sm:text-[15.5px]">
              Các tiện ích tính toán lương, thuế và kế hoạch tài chính cá nhân hữu ích cập nhật mới nhất
            </p>
          </div>

          {/* Tab Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#00b14f] text-white shadow-sm shadow-[#00b14f]/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Grid 6 thẻ công cụ cao cấp (3 cột đối xứng, phong cách Fintech Hub) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.link}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-[#fbfcfc] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00b14f] hover:bg-white hover:shadow-[0_12px_32px_rgba(0,177,79,0.12)]"
            >
              <div>
                {/* Header card: Icon + Category Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white p-2.5 shadow-2xs transition-transform duration-300 group-hover:scale-105">
                    <img src={tool.icon} alt={tool.title} className="h-full w-full object-contain" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tool.isPopular && (
                      <span className="rounded-full border border-rose-200/80 bg-rose-50 px-2 py-0.5 text-[10.5px] font-extrabold text-rose-600">
                        Phổ biến
                      </span>
                    )}
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${tool.badgeClass}`}>
                      {tool.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Tiêu đề & mô tả */}
                <h3 className="text-[17px] font-bold text-[#1e293b] transition-colors group-hover:text-[#00b14f] sm:text-[18px]">
                  {tool.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[#64748b]">{tool.desc}</p>
              </div>

              {/* Action footer */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3.5">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#00b14f] transition-all group-hover:translate-x-1">
                  <span>Trải nghiệm ngay</span>
                  <ArrowRight className="h-4 w-4" />
                </span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:bg-[#00b14f] group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
