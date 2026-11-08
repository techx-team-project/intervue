import { buttonClassName } from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ROUTES } from '@/constants/routes';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CallToActionSection() {
  return (
    <section aria-labelledby="cta-title" className="bg-surface py-24">
      <div className="container-page">
        <h2 id="cta-title" className="sr-only">
          Bắt đầu với InterVue
        </h2>
        <div className="medium:grid-cols-2 grid grid-cols-1 gap-6">
          <Reveal className="h-full">
            <div className="bg-primary-light flex h-full flex-col items-start justify-between gap-10 rounded-[2rem] p-10">
              <div className="space-y-4">
                <p className="text-label-lg text-primary font-bold tracking-widest uppercase">Dành cho ứng viên</p>
                <p className="font-display text-display-sm text-on-surface font-extrabold">
                  Sẵn sàng cho công việc tiếp theo?
                </p>
                <p className="text-title-md text-on-surface-variant font-normal">
                  Tạo tài khoản miễn phí, hoàn thiện CV và ứng tuyển chỉ trong vài phút.
                </p>
              </div>
              <Link href={ROUTES.REGISTER} className={buttonClassName({ size: '2xl' })}>
                Tạo tài khoản miễn phí
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={1} className="h-full">
            <div className="bg-primary-deeper flex h-full flex-col items-start justify-between gap-10 rounded-[2rem] p-10">
              <div className="space-y-4">
                <p className="text-label-lg text-primary-bright font-bold tracking-widest uppercase">
                  Dành cho nhà tuyển dụng
                </p>
                <p className="font-display text-display-sm font-extrabold text-white">
                  Tìm đúng ứng viên IT cho đội ngũ của bạn
                </p>
                <p className="text-title-md font-normal text-white/70">
                  Đăng tin tuyển dụng, nhận hồ sơ và để AI hỗ trợ sàng lọc, quyết định cuối cùng vẫn là của bạn.
                </p>
              </div>
              <Link
                href={ROUTES.RECRUITER_LANDING}
                className="bg-surface text-primary-deeper text-title-md ease-standard inline-flex h-14 items-center gap-2 rounded-full px-8 font-semibold transition-transform duration-150 hover:scale-[1.02]"
              >
                Đăng tuyển ngay
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
