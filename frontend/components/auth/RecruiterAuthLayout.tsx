'use client';

import LeftChevronPattern from '@/components/auth/LeftChevronPattern';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { ROUTES } from '@/constants/routes';
import { Building2, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface RecruiterAuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function RecruiterAuthLayout({ title, subtitle, children }: RecruiterAuthLayoutProps) {
  return (
    <div className="text-navy relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#f4f6f8] antialiased">
      <LeftChevronPattern />
      <div className="bg-primary/5 pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-50" />

      <Header portal="recruiter" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="hidden lg:col-span-6 lg:block xl:col-span-7">
            <div className="flex flex-col justify-between rounded-3xl border border-[#e9eaec] bg-gradient-to-br from-[#f2fbf6] via-[#f8fafc] to-[#e8f7ee] p-8 shadow-sm xl:p-10">
              <div className="flex items-center justify-between">
                <Link href={ROUTES.RECRUITER_LANDING} className="flex items-center gap-2.5">
                  <Image
                    src="/intervue-logo.png"
                    alt="InterVue"
                    width={140}
                    height={40}
                    priority
                    className="h-9 w-auto object-contain"
                  />
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary">
                    <Building2 className="h-3.5 w-3.5" />
                    Cổng Doanh nghiệp
                  </span>
                </Link>
              </div>

              <div className="my-8 space-y-6">
                <div className="space-y-3">
                  <div className="text-primary inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>NỀN TẢNG TUYỂN DỤNG IT ỨNG DỤNG AI</span>
                  </div>
                  <h2 className="text-navy text-2xl font-extrabold leading-tight xl:text-3xl">
                    Tuyển dụng IT thông minh và chuẩn xác hơn cùng InterVue
                  </h2>
                  <p className="text-sm leading-relaxed text-[#4d5965]">
                    Tiếp cận hơn 150.000+ hồ sơ kỹ sư phần mềm chất lượng cao, tự động hóa quy trình sàng lọc và phỏng vấn
                    với sự hỗ trợ của công nghệ AI.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="hover:border-primary/40 flex items-start gap-3 rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-2xs transition">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-navy text-xs font-bold">AI Sàng lọc CV chuẩn STAR</h4>
                      <p className="mt-0.5 text-xs text-[#6f7882]">
                        Tự động chấm điểm độ khớp tech stack và kinh nghiệm theo tiêu chuẩn STAR.
                      </p>
                    </div>
                  </div>

                  <div className="hover:border-primary/40 flex items-start gap-3 rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-2xs transition">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-navy text-xs font-bold">Tặng 03 tin tuyển dụng miễn phí</h4>
                      <p className="mt-0.5 text-xs text-[#6f7882]">
                        Khởi tạo tài khoản nhận ngay 03 tin đăng và 30 lượt AI Screening trải nghiệm nền tảng.
                      </p>
                    </div>
                  </div>

                  <div className="hover:border-primary/40 flex items-start gap-3 rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-2xs transition">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-navy text-xs font-bold">Tư vấn tuyển dụng IT chuyên sâu 24/7</h4>
                      <p className="mt-0.5 text-xs text-[#6f7882]">
                        Hotline riêng cho NTD (0812.665.001) tư vấn tối ưu tin đăng và tìm kiếm ứng viên.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e9eaec] pt-5 text-xs font-medium text-[#6f7882]">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="text-primary h-4 w-4" />
                  <span>
                    Hotline Doanh nghiệp: <strong className="text-navy font-bold">0812.665.001</strong>
                  </span>
                </div>
                <span>recruiter-support@intervue.vn</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-5">
            <div className="relative z-10 w-full rounded-3xl border border-[#edf0f2] bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10">
              <header className="mb-6">
                <h1 className="text-navy text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
                <p className="mt-1.5 text-sm text-[#6f7882]">{subtitle}</p>
              </header>

              {children}

              <footer className="mt-6 border-t border-[#f4f5f5] pt-4 text-center text-xs text-[#6f7882]">
                Bằng việc đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
                <span className="text-navy font-semibold">Điều khoản dịch vụ Doanh nghiệp</span> của InterVue.
              </footer>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
