'use client';

import type { RecruiterVerificationProfile, VerificationLevelNumber } from '@/types/recruiter-company';
import { ShieldCheck, Tag } from 'lucide-react';

interface CompanyVerificationHeroProps {
  profile: RecruiterVerificationProfile;
  onPresetLevelChange?: (level: VerificationLevelNumber) => void;
}

export function CompanyVerificationHero({ profile, onPresetLevelChange }: CompanyVerificationHeroProps) {
  return (
    <div className="relative flex h-full flex-col justify-between bg-[#009647] p-3.5 select-none sm:p-4 lg:p-5">
      {/* Inner curved forest-emerald container matching TopCV */}
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#005c38] via-[#004e30] to-[#003722] p-5 text-white shadow-inner sm:p-6">
        {/* Decorative Cityscape / Tech Towers Silhouette at the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-48 items-end justify-center overflow-hidden opacity-25">
          <svg
            className="h-full w-full text-emerald-300"
            viewBox="0 0 500 200"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            {/* Background buildings */}
            <rect x="20" y="70" width="45" height="130" opacity="0.3" rx="2" />
            <rect x="75" y="40" width="55" height="160" opacity="0.4" rx="2" />
            <rect x="140" y="90" width="40" height="110" opacity="0.3" rx="2" />
            <rect x="190" y="25" width="60" height="175" opacity="0.5" rx="3" />
            <rect x="260" y="55" width="50" height="145" opacity="0.4" rx="2" />
            <rect x="320" y="80" width="45" height="120" opacity="0.3" rx="2" />
            <rect x="375" y="35" width="55" height="165" opacity="0.45" rx="3" />
            <rect x="440" y="65" width="45" height="135" opacity="0.35" rx="2" />

            {/* Glowing office windows */}
            <circle cx="90" cy="60" r="3" fill="#ffffff" opacity="0.6" />
            <circle cx="105" cy="60" r="3" fill="#ffffff" opacity="0.6" />
            <circle cx="90" cy="80" r="3" fill="#34d399" opacity="0.8" />
            <circle cx="105" cy="80" r="3" fill="#ffffff" opacity="0.6" />
            <circle cx="210" cy="50" r="3" fill="#ffffff" opacity="0.7" />
            <circle cx="230" cy="50" r="3" fill="#34d399" opacity="0.9" />
            <circle cx="210" cy="70" r="3" fill="#ffffff" opacity="0.6" />
            <circle cx="230" cy="70" r="3" fill="#ffffff" opacity="0.6" />
            <circle cx="210" cy="90" r="3" fill="#34d399" opacity="0.7" />
            <circle cx="395" cy="55" r="3" fill="#ffffff" opacity="0.6" />
            <circle cx="410" cy="55" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="395" cy="75" r="3" fill="#34d399" opacity="0.7" />
          </svg>
        </div>

        {/* Ambient radial lighting */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-16 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative z-10 space-y-5">
          {/* Top category highlight box matching TopCV */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/10 p-3.5 shadow-sm backdrop-blur-md">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00b14f] text-white shadow-md shadow-emerald-950/30">
              <Tag className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs font-normal text-emerald-100/90">Bạn đang tuyển dụng vị trí thuộc nhóm nghề:</div>
              <div className="text-base font-bold tracking-wide text-white">Công nghệ thông tin / Phần mềm</div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1 pt-1">
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Đăng tin trên InterVue ngay
            </h2>
            <p className="text-sm font-semibold text-emerald-200">Hiệu quả vượt trội - Đáp ứng nhanh chóng</p>
          </div>

          {/* Feature Card 1: 3D Stacked Application documents */}
          <div className="group flex items-center gap-4 rounded-2xl bg-white p-4 text-slate-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
              {/* Rich 3D Isometric Document Stack SVG */}
              <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                {/* Bottom page shadow */}
                <path d="M12 14L34 8L40 32L18 38L12 14Z" fill="#A7F3D0" />
                {/* Middle page */}
                <path d="M9 16L31 10L37 34L15 40L9 16Z" fill="#34D399" />
                {/* Top main CV document */}
                <rect x="6" y="14" width="28" height="26" rx="4" fill="#00b14f" />
                <rect x="8" y="16" width="24" height="22" rx="3" fill="#E6F9F0" />
                {/* Green header banner on document */}
                <rect x="11" y="19" width="18" height="4" rx="1.5" fill="#00b14f" />
                {/* Lines of text on document */}
                <rect x="11" y="26" width="14" height="2" rx="1" fill="#10B981" />
                <rect x="11" y="30" width="18" height="2" rx="1" fill="#6EE7B7" />
                <rect x="11" y="34" width="10" height="2" rx="1" fill="#A7F3D0" />
                {/* Floating 3D Check Badge */}
                <circle cx="34" cy="36" r="6" fill="#00b14f" />
                <path
                  d="M31.5 36L33.5 38L37 34"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-xs leading-relaxed text-slate-700 sm:text-sm">
              <span className="font-extrabold text-[#00b14f]">143.135+</span> lượt ứng tuyển vị trí thuộc nhóm nghề{' '}
              <span className="font-bold text-[#00b14f]">Công nghệ thông tin</span> mỗi tháng
            </div>
          </div>

          {/* Feature Card 2: 3D Magnifying Glass & Candidate profiles */}
          <div className="group flex items-center gap-4 rounded-2xl bg-white p-4 text-slate-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
              {/* Rich 3D Magnifying Glass SVG */}
              <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                {/* Floating gold candidate coins/chips */}
                <ellipse cx="32" cy="16" rx="6" ry="3.5" fill="#FBBF24" />
                <ellipse cx="32" cy="14" rx="6" ry="3.5" fill="#FDE68A" />
                <ellipse cx="34" cy="24" rx="7" ry="4" fill="#F59E0B" />
                <ellipse cx="34" cy="22" rx="7" ry="4" fill="#FBBF24" />
                <ellipse cx="34" cy="20" rx="7" ry="4" fill="#FEF08A" />

                {/* 3D Magnifying Glass Rim & Lens */}
                <circle cx="20" cy="22" r="13" fill="#D1FAE5" fillOpacity="0.8" />
                <circle cx="20" cy="22" r="13" stroke="#00b14f" strokeWidth="3" />
                {/* Glass reflection streak */}
                <path
                  d="M13 18C15 14 20 13 24 15"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {/* Handle */}
                <path d="M29 31L39 41" stroke="#008b3e" strokeWidth="5" strokeLinecap="round" />
                <path d="M31 33L38 40" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-xs leading-relaxed text-slate-700 sm:text-sm">
              Tiếp cận ứng viên tiềm năng trong <span className="font-extrabold text-[#00b14f]">347.849+</span> hồ sơ
              nhóm nghề <span className="font-bold text-[#00b14f]">Công nghệ thông tin</span>
            </div>
          </div>

          {/* Feature Card 3: 3D Trophy Star & Leading Tech Recruiters */}
          <div className="group rounded-2xl bg-white p-4 text-slate-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-3 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                {/* Rich 3D Golden Star on Podium SVG */}
                <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                  {/* Podium Base */}
                  <ellipse cx="24" cy="39" rx="14" ry="4" fill="#34D399" />
                  <ellipse cx="24" cy="37" rx="12" ry="3" fill="#E6F9F0" />
                  {/* Glowing 3D Star */}
                  <path d="M24 7L28 17L38 18L30 25L32 35L24 29L16 35L18 25L10 18L20 17L24 7Z" fill="url(#goldGrad)" />
                  {/* Star Highlight facet */}
                  <path d="M24 7L28 17L38 18L30 25L24 29L24 7Z" fill="#FDE047" opacity="0.5" />
                  <defs>
                    <linearGradient id="goldGrad" x1="10" y1="7" x2="38" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FBBF24" />
                      <stop offset="0.5" stopColor="#F59E0B" />
                      <stop offset="1" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                Các <span className="font-bold text-[#00b14f]">nhà tuyển dụng tiêu biểu</span> lựa chọn đăng tin cho vị
                trí thuộc nhóm nghề <span className="font-bold text-[#00b14f]">Công nghệ thông tin</span> trên InterVue:
                FPT, Viettel, Misa, ...
              </div>
            </div>

            {/* Enterprise Client Badges matching TopCV */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-black tracking-wider text-orange-600 shadow-xs">
                FPT
              </div>
              <div className="flex h-9 items-center justify-center rounded-lg border border-red-600 bg-red-600 px-2 text-xs font-bold tracking-wider text-white shadow-xs">
                viettel
              </div>
              <div className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold tracking-wider text-sky-600 shadow-xs">
                MISA
              </div>
              <div className="flex h-9 items-center justify-center rounded-lg border border-emerald-600 bg-emerald-600 px-2 text-xs font-bold tracking-wider text-white shadow-xs">
                VNG
              </div>
            </div>
          </div>
        </div>

        {/* Demo level switcher */}
        {onPresetLevelChange && (
          <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-emerald-200/90">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Mã NTD: {profile.recruiterCode}</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="mr-1 text-[10px] text-emerald-200/80">Demo Cấp:</span>
              <button
                type="button"
                onClick={() => onPresetLevelChange(1)}
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold transition ${
                  profile.level === 1 ? 'bg-white text-[#008b3e]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => onPresetLevelChange(2)}
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold transition ${
                  profile.level === 2 ? 'bg-white text-[#008b3e]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => onPresetLevelChange(3)}
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold transition ${
                  profile.level === 3 ? 'bg-white text-[#008b3e]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                3
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
