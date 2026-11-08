import { Building2, Check, Eye, Sparkles, TriangleAlert } from 'lucide-react';

const RING_RADIUS = 34;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const MATCH_SCORE = 92;

const CV_REVIEW_ITEMS = [
  { label: 'Kỹ năng khớp yêu cầu', ok: true },
  { label: 'Có dự án thực tế', ok: true },
  { label: 'Nên bổ sung chứng chỉ', ok: false },
];

export default function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto hidden h-[540px] w-full max-w-[560px] lg:block">
      <div className="shadow-float absolute top-14 left-6 w-[390px] rounded-3xl bg-white p-6">
        <div className="flex items-start gap-4">
          <span className="bg-primary-container text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
            <Building2 className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <p className="text-title-lg text-on-surface font-bold">Senior Backend Developer</p>
            <p className="text-body-md text-on-surface-variant mt-0.5">Công ty công nghệ · Hà Nội</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {['Java', 'Spring Boot', 'MySQL'].map((tag) => (
            <span key={tag} className="bg-surface-container-low text-label-lg text-on-surface rounded-full px-3 py-1.5">
              {tag}
            </span>
          ))}
        </div>

        <div className="border-outline-variant mt-5 flex items-end justify-between border-t pt-5">
          <div>
            <p className="text-label-md text-on-surface-variant">Mức lương</p>
            <p className="font-display text-headline-sm text-primary font-bold">25 - 40 triệu</p>
          </div>
          <span className="bg-primary text-label-lg rounded-full px-5 py-2.5 text-white">Ứng tuyển ngay</span>
        </div>
      </div>

      <div className="animate-float shadow-float absolute top-0 right-0 flex w-[210px] items-center gap-4 rounded-2xl bg-white p-4">
        <svg viewBox="0 0 80 80" className="h-[76px] w-[76px] shrink-0 -rotate-90">
          <circle cx="40" cy="40" r={RING_RADIUS} fill="none" strokeWidth="8" className="stroke-primary-container" />
          <circle
            cx="40"
            cy="40"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - MATCH_SCORE / 100)}
            className="stroke-primary"
          />
        </svg>
        <div>
          <p className="font-display text-headline-sm text-on-surface font-bold">{MATCH_SCORE}%</p>
          <p className="text-label-md text-on-surface-variant">Phù hợp với hồ sơ của bạn</p>
        </div>
      </div>

      <div className="animate-float shadow-float absolute bottom-10 left-0 w-[270px] rounded-2xl bg-white p-5 [animation-delay:-3s]">
        <p className="text-title-sm text-on-surface flex items-center gap-2 font-bold">
          <Sparkles className="text-primary h-4 w-4" />
          AI nhận xét CV
        </p>
        <ul className="mt-3 space-y-2.5">
          {CV_REVIEW_ITEMS.map(({ label, ok }) => (
            <li key={label} className="text-body-md text-on-surface flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  ok ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {ok ? <Check className="h-3 w-3" /> : <TriangleAlert className="h-3 w-3" />}
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="animate-float shadow-float text-label-lg text-on-surface absolute right-4 bottom-0 flex items-center gap-2.5 rounded-full bg-white py-3 pr-5 pl-4 [animation-delay:-5s]">
        <span className="bg-primary-container text-primary flex h-8 w-8 items-center justify-center rounded-full">
          <Eye className="h-4 w-4" />
        </span>
        Nhà tuyển dụng đã xem hồ sơ
      </div>

      <p className="text-label-sm absolute right-0 -bottom-6 text-white/45">Hình minh họa giao diện</p>
    </div>
  );
}
