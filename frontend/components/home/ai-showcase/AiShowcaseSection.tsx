import { buttonClassName } from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ROUTES } from '@/constants/routes';
import { Check, FileSearch, Mic, ShieldCheck, Target, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../SectionHeader';

type Capability = { id: string; icon: LucideIcon; title: string; description: string };

const CAPABILITIES: Capability[] = [
  {
    id: 'cv',
    icon: FileSearch,
    title: 'Nhận xét CV chi tiết',
    description: 'Điểm số, điểm mạnh và những chỗ cần cải thiện theo vị trí bạn nhắm tới.',
  },
  {
    id: 'interview',
    icon: Mic,
    title: 'Luyện phỏng vấn cùng AI',
    description: 'Thực hành trả lời câu hỏi thật và xem lại phản hồi để tự tin hơn.',
  },
  {
    id: 'match',
    icon: Target,
    title: 'Gợi ý việc làm phù hợp',
    description: 'Xếp hạng việc làm theo kỹ năng và kinh nghiệm trong hồ sơ của bạn.',
  },
];

const SCORE = 86;
const RING_RADIUS = 42;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const STRENGTHS = ['Kỹ năng phù hợp vị trí Backend', 'Kinh nghiệm được mô tả bằng kết quả'];

export default function AiShowcaseSection() {
  return (
    <section aria-labelledby="ai-title" className="bg-forest-950 relative overflow-hidden py-24">
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 opacity-60" />

      <div className="container-page relative grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <SectionHeader
            id="ai-title"
            eyebrow="Công cụ AI"
            title="AI ở bên bạn trong mỗi bước ứng tuyển"
            description="Chuẩn bị kỹ hơn, ứng tuyển tự tin hơn, và luôn biết dữ liệu của mình được xử lý ra sao."
            tone="dark"
          />

          <ul className="space-y-6">
            {CAPABILITIES.map(({ id, icon: Icon, title, description }) => (
              <li key={id} className="flex gap-4">
                <span className="bg-primary/15 text-primary-bright flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="text-title-lg font-bold text-white">{title}</h3>
                  <p className="text-body-lg mt-1 text-white/65">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-body-md mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/75">
            <ShieldCheck className="text-primary-bright mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            AI chỉ hỗ trợ. InterVue không tự động nhận hay từ chối hồ sơ, nhà tuyển dụng là người quyết định cuối cùng.
          </p>

          <Link href={ROUTES.CANDIDATE_CVS} className={buttonClassName({ size: '2xl', className: 'mt-8' })}>
            Thử với CV của bạn
          </Link>
        </Reveal>

        <Reveal delay={2}>
          <div aria-hidden className="relative mx-auto w-full max-w-[520px] space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0 -rotate-90">
                  <circle cx="50" cy="50" r={RING_RADIUS} fill="none" strokeWidth="9" className="stroke-white/10" />
                  <circle
                    cx="50"
                    cy="50"
                    r={RING_RADIUS}
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={RING_LENGTH * (1 - SCORE / 100)}
                    className="stroke-primary-bright"
                  />
                </svg>
                <div>
                  <p className="text-label-md text-white/60">Điểm CV</p>
                  <p className="font-display text-display-sm font-extrabold text-white">
                    {SCORE}
                    <span className="text-title-lg text-white/50">/100</span>
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5">
                {STRENGTHS.map((item) => (
                  <li key={item} className="text-body-md flex items-center gap-2.5 text-white/85">
                    <span className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <p className="text-label-md text-white/60">Phỏng vấn thử</p>
              <p className="text-body-md max-w-[85%] rounded-2xl rounded-tl-md bg-white/10 px-4 py-3 text-white">
                Hãy mô tả một lần bạn tối ưu hiệu năng cho hệ thống đang chạy.
              </p>
              <p className="text-body-md bg-primary ml-auto max-w-[85%] rounded-2xl rounded-tr-md px-4 py-3 text-white">
                Mình đã thêm index và cache, giảm thời gian phản hồi xuống còn một nửa.
              </p>
              <p className="text-label-lg text-primary-bright">Gợi ý: nêu rõ số liệu trước và sau khi tối ưu.</p>
            </div>

            <p className="text-label-sm text-right text-white/40">Hình minh họa giao diện</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
