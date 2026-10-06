'use client';

import { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';

interface RecentJob {
  id: number;
  title: string;
  company: string;
  location: string;
  logoBg: string;
  logoText: string;
  logoColor: string;
}

const RECENT_JOBS: RecentJob[] = [
  {
    id: 1,
    title: 'Quản Lý Trung Tâm Cơ Sở Mỹ Đình - Hệ Thống Giáo Dục...',
    company: 'Công ty Cổ phần Giáo dục HMT...',
    location: 'Hà Nội',
    logoBg: '#fff2ea',
    logoText: 'HMT',
    logoColor: '#ff6600',
  },
  {
    id: 2,
    title: 'Nhân Viên Kinh Doanh Khu Vực Miền Nam - Thu Nhập...',
    company: 'CÔNG TY CỔ PHẦN EUROWINDOW',
    location: 'Hồ Chí Minh (mới) & 8 nơi khác',
    logoBg: '#e6f0fa',
    logoText: 'EW',
    logoColor: '#005baa',
  },
  {
    id: 3,
    title: 'Nhân Viên Tư Vấn - Thu Nhập Từ 15 Triệu/ Tháng -...',
    company: 'CÔNG TY TNHH MỘT THÀNH VIÊN DAI-ICHI LIFE...',
    location: 'Hồ Chí Minh (mới)',
    logoBg: '#faeaea',
    logoText: 'DL',
    logoColor: '#d6001c',
  },
];

const CATEGORY_BARS = [
  {
    name: 'Kinh doanh / Bán hàng',
    short: 'Kinh doanh / Bán ...',
    color: '#00e668',
    heightPercent: 92,
    count: '11.280',
  },
  {
    name: 'Hành chính / Văn phòng',
    short: 'Hành chính / Văn ...',
    color: '#0084ff',
    heightPercent: 62,
    count: '7.440',
  },
  { name: 'Dịch vụ khách hàng', short: 'Dịch vụ khách hà...', color: '#ff8c00', heightPercent: 58, count: '6.960' },
  {
    name: 'Marketing / Truyền thông',
    short: 'Marketing / Truyề...',
    color: '#00bcd4',
    heightPercent: 55,
    count: '6.600',
  },
  { name: 'Tư vấn', short: 'Tư vấn', color: '#ffd600', heightPercent: 43, count: '5.160' },
];

export default function MarketDashboardSection() {
  const [selectedDropdown, setSelectedDropdown] = useState('Ngành nghề');
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <section
      id="market-dashboard"
      className="relative my-10 w-full overflow-hidden border-y border-emerald-500/20 bg-[#002414] py-10 shadow-2xl sm:py-12"
    >
      {/* ẢNH NỀN THỰC TẾ CAO CẤP (Realistic Deep Emerald Mesh Texture) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/market-bg.jpg"
          alt="Market Dashboard Background"
          className="h-full w-full object-cover object-center opacity-65"
        />
        {/* Lớp phủ chuyển sắc nhẹ giữ độ tương phản cao cho chữ & biểu đồ */}
        <div className="absolute inset-0 bg-linear-to-r from-[#00381f]/85 via-[#004225]/70 to-[#002f1a]/85" />
      </div>

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[#00e668]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-[#00e668]/15 blur-3xl" />

      {/* Nội dung bên trong căn giữa theo container chuẩn */}
      <div className="container-topcv relative z-10">
        {/* 1. Header Bar: Tiêu đề + Ngày tháng + Icon 3D góc phải */}
        <div className="relative z-10 mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[20px] font-bold text-white sm:text-[25px]">Thị trường việc làm hôm nay</h2>
            <span className="text-[20px] font-bold text-[#00e668] sm:text-[25px]">23/09/2026</span>
          </div>

          {/* Biểu tượng 3D Analytics góc trên phải như mẫu */}
          <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-sm backdrop-blur-xs sm:flex">
            <div className="relative flex h-5 w-5 items-end justify-center gap-0.5">
              <span className="h-2 w-1 rounded-xs bg-[#00e668]" />
              <span className="h-4 w-1 rounded-xs bg-teal-300" />
              <span className="h-5 w-1 rounded-xs bg-[#00e668]" />
            </div>
          </div>
        </div>

        {/* 2. Hàng trên: Mascot bên trái + 3 Cột số liệu lớn */}
        <div className="relative z-10 mb-6 grid grid-cols-1 items-center gap-4 sm:grid-cols-12">
          {/* Mascot Robot đứng trên bục */}
          <div className="flex items-center justify-center sm:col-span-4 sm:justify-start lg:col-span-3">
            <div className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
              <div className="absolute inset-0 scale-95 rounded-full bg-[#00e668]/20 blur-xl" />
              <img
                src="/intervue-bot.png"
                alt="InterVue Mascot"
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* 3 Cột số liệu thống kê chuẩn xác */}
          <div className="grid grid-cols-1 gap-4 sm:col-span-8 sm:grid-cols-3 lg:col-span-9">
            {/* Stat 1 */}
            <div>
              <div className="text-[30px] leading-tight font-extrabold tracking-tight text-white sm:text-[34px] lg:text-[38px]">
                3.994
              </div>
              <div className="mt-0.5 text-[13px] font-medium text-emerald-100/80">Việc làm mới 24h gần nhất</div>
            </div>

            {/* Stat 2 */}
            <div>
              <div className="text-[30px] leading-tight font-extrabold tracking-tight text-white sm:text-[34px] lg:text-[38px]">
                45.351
              </div>
              <div className="mt-0.5 text-[13px] font-medium text-emerald-100/80">Việc làm đang tuyển</div>
            </div>

            {/* Stat 3 */}
            <div>
              <div className="text-[30px] leading-tight font-extrabold tracking-tight text-white sm:text-[34px] lg:text-[38px]">
                16.435
              </div>
              <div className="mt-0.5 text-[13px] font-medium text-emerald-100/80">Công ty đang tuyển</div>
            </div>
          </div>
        </div>

        {/* 3. Hàng dưới: 3 Khối nội dung song song (Việc làm mới nhất + Biểu đồ đường + Biểu đồ cột) */}
        <div className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* CỘT 1: VIỆC LÀM MỚI NHẤT */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-3.5 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-white">Việc làm mới nhất</h3>
                <a
                  href="#feature-jobs"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00a850] text-white shadow-xs transition-colors hover:bg-[#008f44]"
                  title="Xem thêm việc làm"
                >
                  <span className="text-[12px] font-black">↑</span>
                </a>
              </div>

              <div className="space-y-3">
                {RECENT_JOBS.map((job) => (
                  <div
                    key={job.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
                  >
                    {/* Logo công ty dạng ô vuông trắng có thương hiệu */}
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs"
                      style={{ border: `1.5px solid ${job.logoColor}20` }}
                    >
                      <span className="text-[12px] font-black tracking-tight" style={{ color: job.logoColor }}>
                        {job.logoText}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4
                        className="line-clamp-1 text-[13px] font-bold text-white transition-colors hover:text-[#00e668]"
                        title={job.title}
                      >
                        {job.title}
                      </h4>
                      <p className="mt-0.5 truncate text-[11.5px] text-white/70">{job.company}</p>
                      <p className="mt-0.5 text-[11px] text-white/50">{job.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT 2: TĂNG TRƯỞNG CƠ HỘI VIỆC LÀM (Line Chart với trục Y, lưới và Tooltip ghim) */}
          <div className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#003820] p-4">
            <div>
              {/* Header Box */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00e668] text-[#003820]">
                  <TrendingUp className="h-3 w-3 stroke-3" />
                </div>
                <span className="text-[13.5px] font-bold text-white">Tăng trưởng cơ hội việc làm</span>
              </div>

              {/* Chart Container */}
              <div className="relative mt-2 flex">
                {/* Trục Y số liệu chuẩn: 50.000 -> 42.000 */}
                <div className="flex h-36 flex-col justify-between pr-2 text-[10px] font-semibold text-white/50 select-none">
                  <span>50.000</span>
                  <span>49.000</span>
                  <span>48.000</span>
                  <span>47.000</span>
                  <span>46.000</span>
                  <span>45.000</span>
                  <span>44.000</span>
                  <span>43.000</span>
                  <span>42.000</span>
                </div>

                {/* SVG Area with dashed horizontal grid lines */}
                <div className="relative h-36 flex-1">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 200 130" preserveAspectRatio="none">
                    {/* Horizontal dashed lines */}
                    {[0, 16.25, 32.5, 48.75, 65, 81.25, 97.5, 113.75, 130].map((y, idx) => (
                      <line
                        key={idx}
                        x1="0"
                        y1={y}
                        x2="200"
                        y2={y}
                        stroke="#ffffff"
                        strokeOpacity="0.08"
                        strokeDasharray="2 2"
                      />
                    ))}

                    {/* Green Line Chart matching exact reference zig-zag wave */}
                    <polyline
                      fill="none"
                      stroke="#00e668"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="
                        5,85
                        25,35
                        45,55
                        70,120
                        90,65
                        110,60
                        130,105
                        150,70
                        170,110
                        195,80
                      "
                    />
                  </svg>

                  {/* Tooltip ghim chính xác như mẫu hình 2 */}
                  <div className="pointer-events-none absolute top-8 left-10 -translate-x-1/2 rounded-md border border-white/10 bg-[#1c2434] px-2.5 py-1 text-center shadow-lg">
                    <div className="text-[9.5px] font-medium text-white/70">29/08/2026</div>
                    <div className="text-[11px] font-black text-white">47.143 việc làm</div>
                  </div>
                </div>
              </div>

              {/* Trục X ngày tháng xoay chéo 45 độ như ảnh thực tế */}
              <div className="mt-3.5 ml-8 flex justify-between pr-2 text-[10px] font-medium text-white/60">
                <span className="origin-top-left -rotate-45 transform">24/08</span>
                <span className="origin-top-left -rotate-45 transform">30/08</span>
                <span className="origin-top-left -rotate-45 transform">05/09</span>
                <span className="origin-top-left -rotate-45 transform">11/09</span>
                <span className="origin-top-left -rotate-45 transform">17/09</span>
                <span className="origin-top-left -rotate-45 transform">23/09</span>
              </div>
            </div>
          </div>

          {/* CỘT 3: NHU CẦU TUYỂN DỤNG THEO (Bar Chart phân loại ngành nghề) */}
          <div className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#003820] p-4">
            <div>
              {/* Header Box + Dropdown Ngành nghề */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00e668] text-[#003820]">
                    <TrendingUp className="h-3 w-3 stroke-3" />
                  </div>
                  <span className="text-[13.5px] font-bold text-white">Nhu cầu tuyển dụng theo</span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-white/20 bg-white/5 px-2 py-0.5 text-[11.5px] font-medium text-white/90 transition-colors hover:border-[#00e668]"
                  >
                    <span>{selectedDropdown}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border border-white/15 bg-[#002d1a] py-1 shadow-lg backdrop-blur-md">
                      {['Ngành nghề', 'Tỉnh thành', 'Mức lương'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedDropdown(opt);
                            setShowDropdown(false);
                          }}
                          className="w-full px-3 py-1 text-left text-[11px] font-medium text-white hover:bg-[#004e2c]"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="relative mt-2 flex">
                {/* Trục Y: 12.000 -> 0 */}
                <div className="flex h-36 flex-col justify-between pr-2 text-[10px] font-semibold text-white/50 select-none">
                  <span>12.000</span>
                  <span>10.800</span>
                  <span>9.600</span>
                  <span>8.400</span>
                  <span>7.200</span>
                  <span>6.000</span>
                  <span>4.800</span>
                  <span>3.600</span>
                  <span>2.400</span>
                  <span>1.200</span>
                  <span>0</span>
                </div>

                {/* 5 Cột Bar Chart với đường lưới nét đứt ngang */}
                <div className="relative flex h-36 flex-1 items-end justify-between px-3">
                  {/* Grid Lines */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="w-full border-b border-dashed border-white/10" />
                    ))}
                  </div>

                  {/* 5 Bars với màu sắc chuẩn theo mẫu */}
                  {CATEGORY_BARS.map((bar, idx) => (
                    <div key={idx} className="group relative z-10 flex h-full w-6 flex-col items-center justify-end">
                      {/* Tooltip khi hover vào từng cột */}
                      <div className="pointer-events-none absolute -top-7 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap text-white opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                        {bar.count}
                      </div>

                      {/* Thanh cột */}
                      <div
                        className="w-full rounded-t-xs transition-all duration-300"
                        style={{
                          height: `${bar.heightPercent}%`,
                          backgroundColor: bar.color,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Chú thích màu sắc (Legend) bên dưới y như mẫu */}
              <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-white/80">
                {CATEGORY_BARS.map((bar, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="h-1 w-3.5 shrink-0 rounded-xs" style={{ backgroundColor: bar.color }} />
                    <span className="truncate">{bar.short}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
