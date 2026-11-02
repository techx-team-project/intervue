'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  BrainCircuit,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Crown,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  PhoneCall,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/auth';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Modal } from '@/components/ui/Modal';

const TOUCHPOINTS = [
  {
    step: '01',
    title: '15.000+ việc làm IT mới cập nhật liên tục',
    desc: 'Hàng nghìn cơ hội việc làm phong phú từ các tập đoàn công nghệ lớn, MNCs, Tech Unicorns đến các Startups năng động, đáp ứng kỳ vọng đa dạng của ứng viên từ Fresher đến C-Level.',
  },
  {
    step: '02',
    title: 'Đưa việc làm đến đúng nơi ứng viên tìm kiếm qua Search & AI',
    desc: 'Sở hữu độ phủ SEO mạnh mẽ hàng đầu trên Google và tối ưu hiện diện theo thuật toán AI Share of Voice trong ngành tuyển dụng IT, giúp thương hiệu NTD luôn nổi bật.',
  },
  {
    step: '03',
    title: 'Ứng dụng & Nền tảng với hàng triệu lượt truy cập',
    desc: 'Đưa cơ hội việc làm tiếp cận ứng viên ngay trên mọi thiết bị máy tính và ứng dụng di động, rút ngắn chu kỳ phản hồi và tăng tỷ lệ nộp CV lên 3.5 lần.',
  },
  {
    step: '04',
    title: 'Gợi ý việc làm tự động bằng công nghệ AI Matcher',
    desc: 'Thuật toán AI tự động phân tích hồ sơ năng lực, tech stack và hành vi tìm kiếm để gửi thông báo gợi ý tin tuyển dụng phù hợp nhất tới đúng tệp kỹ sư tiềm năng.',
  },
];

const UNIVERSITIES = [
  { code: 'FTU', name: 'ĐH Ngoại Thương', logo: '/srp/university/ftu.png' },
  { code: 'NEU', name: 'ĐH Kinh tế Quốc dân', logo: '/srp/university/neu.png' },
  { code: 'TMU', name: 'ĐH Thương Mại', logo: '/srp/university/tmu.png' },
  { code: 'HUST', name: 'ĐH Bách Khoa Hà Nội', logo: '/srp/university/hust.png' },
  { code: 'VNU', name: 'ĐHQG Hà Nội', logo: '/srp/university/vnu.png' },
  { code: 'VNUHCM', name: 'ĐHQG TP.HCM', logo: '/srp/university/vnuhcm.png' },
  { code: 'UEH', name: 'ĐH Kinh tế TP.HCM', logo: '/srp/university/ueh.png' },
];

const UNIVERSITY_TABS = [
  {
    title: 'CỔNG VIỆC LÀM MANG THƯƠNG HIỆU NHÀ TRƯỜNG',
    subtitle: 'Nền tảng số hóa việc làm thực tập & tốt nghiệp',
    description:
      'Đồng hành cùng ban giám hiệu các trường đại học xây dựng phân hệ cổng việc làm độc quyền mang nhận diện của trường, kết nối trực tiếp sinh viên với mạng lưới 20.000+ doanh nghiệp bảo trợ, số hóa 100% quy trình thực tập.',
    badge: 'Phân hệ số hóa độc quyền',
    image: '/market-bg.jpg',
    eventTitle: 'Cổng thông tin việc làm số hóa độc quyền Đại học',
    eventDesc: 'Kết nối mạng lưới hơn 50+ trường đại học với 20.000+ doanh nghiệp công nghệ tuyển dụng.',
  },
  {
    title: 'CÁC HOẠT ĐỘNG KẾT NỐI NGHỀ NGHIỆP',
    subtitle: 'Job Fair & Ngày hội việc làm công nghệ quy mô lớn',
    description:
      'Tài trợ và phối hợp tổ chức các ngày hội Tech Job Fair thường niên tại các trường đại học công nghệ trọng điểm, quy tụ hơn 10.000+ sinh viên ưu tú tham gia phỏng vấn sơ tuyển trực tiếp tại gian hàng doanh nghiệp.',
    badge: '10.000+ Sinh viên / Sự kiện',
    image: '/banner-recruitment-1.jpg',
    eventTitle: 'Tech Job Fair & Lễ ký kết hợp tác Đại học',
    eventDesc: 'Kết nối hơn 80.000+ sinh viên IT với các doanh nghiệp công nghệ hàng đầu tại Việt Nam.',
  },
  {
    title: 'CÁC HOẠT ĐỘNG ĐÀO TẠO VÀ HỖ TRỢ SINH VIÊN',
    subtitle: 'Sửa CV 1-1 & Luyện phỏng vấn thử cùng AI',
    description:
      'Tổ chức chuỗi workshop định hướng nghề nghiệp, cung cấp công cụ AI tối ưu CV chuẩn ATS và tổ chức các buổi phỏng vấn giả định (AI Mock Interview) giúp sinh viên năm cuối tự tin ứng tuyển vị trí thực tập sinh & junior.',
    badge: 'Hỗ trợ 1-1 chuyên sâu',
    image: '/admin/banner-bot.jpg',
    eventTitle: 'Chuỗi Workshop Định hướng nghề & AI Mock Interview',
    eventDesc: 'Trang bị kỹ năng viết CV chuẩn ATS và luyện tập phỏng vấn kỹ thuật cùng AI cho sinh viên.',
  },
];

const PARTNERS = [
  { name: 'FPT Software', tag: 'Top IT Services' },
  { name: 'VNG', tag: 'Tech Unicorn' },
  { name: 'Viettel', tag: 'Telecom & Tech' },
  { name: 'VNPT', tag: 'Digital Solutions' },
  { name: 'Techcombank', tag: 'Digital Banking' },
  { name: 'MoMo', tag: 'Fintech Leader' },
  { name: 'Shopee', tag: 'E-commerce' },
];

const TESTIMONIALS = [
  {
    name: 'Nguyễn Thị Mai Lan',
    role: 'Head of Talent Acquisition',
    company: 'FPT Software',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tag: 'AI CV Matcher',
    result: 'Rút ngắn 65% thời gian',
    content:
      'Nhờ mô hình AI CV Matcher của InterVue, đội ngũ tuyển dụng chúng tôi rút ngắn 65% thời gian sàng lọc sơ bộ cho các vị trí Senior Fullstack & DevOps. Độ chính xác tech stack rất ấn tượng!',
  },
  {
    name: 'Trần Đức Huy',
    role: 'Engineering Manager',
    company: 'Techcombank',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tag: 'Phỏng vấn chuẩn STAR',
    result: 'Tuyển đúng người 94%',
    content:
      'Bộ câu hỏi phỏng vấn STAR gợi ý tự động bám rất sát kinh nghiệm thực tế của ứng viên, giúp các buổi phỏng vấn kỹ thuật diễn ra cực kỳ chuẩn xác, chuyên sâu và tiết kiệm thời gian hội đồng.',
  },
  {
    name: 'Lê Hoàng Yến',
    role: 'HR Director',
    company: 'VNG Corporation',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tag: 'Săn ứng viên chủ động',
    result: 'Tiếp cận 100+ Senior AI',
    content:
      'Tính năng tìm kiếm hồ sơ tech chủ động mang lại nguồn ứng viên chất lượng cao, đặc biệt là các vị trí chuyên gia AI/ML vốn rất khó tuyển trên thị trường. Rất đáng tin cậy!',
  },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI CV Matcher & Screener',
    desc: 'Mô hình phân tích sâu tech stack, số năm kinh nghiệm, các dự án thực tế so với JD, tự động xếp hạng độ tương thích từ cao xuống thấp.',
    tag: 'Tự động hóa',
  },
  {
    icon: FileText,
    title: 'AI JD Generator chuẩn SEO',
    desc: 'Trợ lý AI hỗ trợ gợi ý yêu cầu kỹ năng, mô tả trách nhiệm và chế độ đãi ngộ chỉ trong 30 giây. Tối ưu từ khóa tiếp cận đúng tệp ứng viên IT.',
    tag: 'Soạn thảo nhanh',
  },
  {
    icon: BarChart3,
    title: 'Quản lý ứng viên ATS Kanban',
    desc: 'Pipeline quản lý ứng viên trực quan với thao tác kéo thả qua các vòng: Mới nộp, Phù hợp, Phỏng vấn, Đề nghị và Tuyển dụng. Ghi chú đồng bộ.',
    tag: 'Quy trình chuẩn',
  },
  {
    icon: Bot,
    title: 'Gợi ý câu hỏi phỏng vấn STAR',
    desc: 'Dựa vào tech stack và các dự án trong CV, AI tự động gợi ý bộ câu hỏi đào sâu theo chuẩn STAR giúp đánh giá chính xác năng lực thực chiến.',
    tag: 'Phỏng vấn sâu',
  },
  {
    icon: Code2,
    title: 'Tìm kiếm tài năng tech chủ động',
    desc: 'Khám phá kho hồ sơ với bộ lọc chuyên sâu theo: Framework, Ngôn ngữ, Vị trí (Frontend, Backend, DevOps, AI), Mức lương và Trạng thái tìm việc.',
    tag: 'Kho ứng viên IT',
  },
  {
    icon: ShieldCheck,
    title: 'Hồ sơ eKYC xác thực',
    desc: 'Ứng viên được xác thực danh tính và kinh nghiệm thực tế, hạn chế tối đa hồ sơ ảo hoặc spam, đảm bảo chất lượng tuyển dụng tối ưu cho doanh nghiệp.',
    tag: 'Hồ sơ thật',
  },
];

const INITIAL_CONSULT_FORM = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  needs: 'Tư vấn đăng tin tuyển dụng IT & Gói AI Matching',
};

export default function RecruiterLandingView() {
  const { user, hasRole } = useAuth();
  const [activeUnivTab, setActiveUnivTab] = useState(0);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [consultForm, setConsultForm] = useState(INITIAL_CONSULT_FORM);

  const resetConsultForm = () => {
    setConsultForm(INITIAL_CONSULT_FORM);
    setConsultSubmitted(false);
    setSubmittedPhone('');
  };

  const handleCloseConsultModal = () => {
    setConsultModalOpen(false);
    resetConsultForm();
  };

  const isRecruiter = user && hasRole(ROLES.RECRUITER);
  const currentUnivTab = UNIVERSITY_TABS[activeUnivTab] ?? UNIVERSITY_TABS[0];

  const postJobUrl = isRecruiter
    ? ROUTES.RECRUITER_JOBS_CREATE
    : `${ROUTES.RECRUITER_LOGIN}?redirect=${encodeURIComponent(ROUTES.RECRUITER_JOBS_CREATE)}`;

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPhone(consultForm.phone);
    setConsultSubmitted(true);
    setConsultForm(INITIAL_CONSULT_FORM);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5] text-[#263a4d] antialiased">
      <Header portal="recruiter" />

      <main className="flex-1">
        <section
          id="introduction-hero"
          className="relative h-[530px] overflow-hidden bg-white bg-contain md:bg-cover bg-bottom bg-no-repeat lg:h-[665px] lg:bg-[#F5FBF9]"
          style={{
            backgroundImage: "url('/ai-hero-scene-desktop.png')",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-0 z-1 h-[266px] w-[492px] max-w-none -translate-x-1/2 bg-[#F4FBF9] blur-[35px] lg:hidden" />

          <div className="pointer-events-none absolute left-[5px] top-[128px] z-3 hidden sm:block lg:top-[220px] lg:left-[20px]">
            <Image
              src="/hero-left-pattern.png"
              alt=""
              width={114}
              height={310}
              className="h-[160px] w-[59px] -translate-x-[18px] lg:h-[310px] lg:w-[114px]"
            />
          </div>

          <div className="relative z-4 mx-auto flex w-full max-w-[1075px] flex-col items-center px-4 pt-10 text-center lg:pt-24 xl:pt-28">
            <div className="relative flex w-full flex-col items-center gap-2.5 lg:gap-4">
              <h1 className="m-0 w-full text-3xl font-bold leading-tight text-[#263A4D] sm:text-4xl lg:text-[42px] lg:leading-[50px]">
                Tuyển dụng Ứng viên phù hợp{' '}
                <span className="relative text-[#0B933E]">
                  cùng AI
                  <span className="ml-1 inline-block text-xl lg:text-2xl">✨</span>
                </span>
              </h1>
              <p className="m-0 w-full text-base font-semibold leading-normal text-[#0B933E] sm:text-xl lg:text-[28px] lg:leading-[36px]">
                Tiếp cận hàng triệu ứng viên đang tìm việc
              </p>
            </div>

            <div className="mt-6 flex w-full max-w-[340px] flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row lg:mt-7 lg:gap-6">
              <button
                type="button"
                onClick={() => setConsultModalOpen(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#263A4D] px-7 py-3 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1a2936] hover:shadow-lg sm:w-auto sm:text-base"
              >
                <Headphones className="h-4 w-4" />
                <span>Tư vấn tuyển dụng</span>
              </button>

              <Link
                href={postJobUrl}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#009D46] px-8 py-3 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00b14f] hover:shadow-lg sm:w-auto sm:text-base"
              >
                <span>Đăng tin ngay</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="analytics-stats" className="border-b border-[#e9eaec] bg-[#F8FAF9] py-8 lg:py-10">
          <div className="container-topcv">
            <div className="flex flex-col items-center justify-center gap-6 divide-y divide-[#D6E5DC] text-center sm:flex-row sm:justify-between sm:divide-y-0 sm:divide-x">
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">11M+</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">Ứng viên tiềm năng</p>
              </div>
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">9M+</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">Lượt truy cập ứng viên hàng tháng</p>
              </div>
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">700K+</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">Doanh nghiệp tin dùng</p>
              </div>
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">60K+</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">Tin đăng hiển thị hàng tháng</p>
              </div>
            </div>
          </div>
        </section>

        <section id="ecosystem" className="scroll-mt-20 border-b border-[#e9eaec] bg-white py-16 sm:py-20">
          <div className="container-topcv">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-primary inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3.5 py-1 text-xs font-bold">
                <Globe className="h-3.5 w-3.5" />
                <span>HỆ SINH THÁI ĐA KÊNH TIẾP CẬN</span>
              </div>
              <h2 className="text-navy mt-3 text-2xl font-black tracking-tight sm:text-4xl">
                InterVue thu hút ứng viên như thế nào?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6f7882] sm:text-base">
                Hơn 500.000+ ứng viên lựa chọn InterVue để tìm việc, phát triển nghề nghiệp và khám phá cơ hội mới mỗi
                ngày.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="relative mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-[#e9eaec] bg-gradient-to-b from-[#f8fafc] to-[#eef9f2] p-8 text-center shadow-xs">
                  <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
                    <Image
                      src="/srp/analytics/globe-grid.svg"
                      alt=""
                      fill
                      className="object-contain opacity-70"
                    />

                    <div className="absolute inset-0 m-auto flex h-36 w-36 flex-col items-center justify-center rounded-full border border-emerald-300 bg-white/95 p-4 shadow-xl backdrop-blur-xs">
                      <div className="text-3xl font-extrabold text-[#009D46] sm:text-4xl">11M+</div>
                      <div className="mt-1 text-center text-xs font-semibold text-[#263a4d]">Ứng viên đang tìm việc</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span>Dữ liệu hồ sơ cập nhật thời gian thực</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-7">
                <div className="relative pl-6 before:absolute before:top-4 before:bottom-4 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-400 before:to-emerald-200">
                  {TOUCHPOINTS.map((tp) => (
                    <div key={tp.step} className="group relative mb-6 last:mb-0">
                      <div className="group-hover:bg-primary absolute -left-6 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-xs font-black text-white shadow-sm transition-colors">
                        {tp.step}
                      </div>

                      <div className="rounded-2xl border border-[#e9eaec] bg-white p-5 shadow-xs transition duration-200 group-hover:border-emerald-300 group-hover:shadow-md">
                        <h3 className="text-navy group-hover:text-primary text-base font-bold transition-colors">
                          {tp.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-[#6f7882] sm:text-sm">{tp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 py-6 sm:py-8">
          <div className="container-topcv flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-navy text-base font-bold sm:text-lg">
                Hệ sinh thái ứng viên rộng giúp tin tuyển dụng của doanh nghiệp tiếp cận đúng người, đúng thời điểm.
              </p>
              <p className="text-xs text-slate-600">
                Tối ưu chi phí và tăng tốc độ tìm kiếm nhân sự công nghệ chất lượng cao.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setConsultModalOpen(true)}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 sm:text-sm"
              >
                Tư vấn tuyển dụng
              </button>

              <Link
                href={ROUTES.RECRUITER_REGISTER}
                className="bg-primary hover:bg-primary-hover shadow-primary/20 flex items-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-sm transition sm:text-sm"
              >
                <span>Đăng ký tài khoản</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <section id="university" className="scroll-mt-20 bg-[#f4f5f5] py-16 sm:py-20">
          <div className="container-topcv">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-primary inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3.5 py-1 text-xs font-bold">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>INTERVUE UNIVERSITY • MẠNG LƯỚI ĐẠI HỌC ĐỐI TÁC</span>
              </div>
              <h2 className="text-navy mt-3 text-2xl font-black tracking-tight sm:text-4xl">
                InterVue University - Mạng lưới trường đại học đối tác
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6f7882] sm:text-base">
                InterVue là đơn vị tiên phong tổ chức hàng nghìn sự kiện, hội thảo lớn tại hơn 50+ trường Đại học, Cao
                đẳng toàn quốc. Tiếp lợi thế phát triển nghề nghiệp cho sinh viên, kỹ sư trẻ, lực lượng lao động công
                nghệ chủ chốt trong tương lai.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {UNIVERSITIES.map((univ) => (
                <div key={univ.code} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white p-2 shadow-xs transition-transform duration-200 hover:scale-105 hover:shadow-md sm:h-16 sm:w-16">
                    <Image
                      src={univ.logo}
                      alt={univ.name}
                      width={48}
                      height={48}
                      className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 sm:text-xs">{univ.code}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border-2 border-emerald-300 bg-white p-6 shadow-sm sm:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div role="tablist" aria-label="Phân hệ hợp tác đại học" className="space-y-4 lg:col-span-7">
                  {UNIVERSITY_TABS.map((tab, idx) => {
                    const isActive = activeUnivTab === idx;
                    return (
                      <button
                        key={tab.title}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveUnivTab(idx)}
                        className={`w-full cursor-pointer rounded-2xl border p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                          isActive
                            ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/30'
                            : 'border-[#e9eaec] bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span
                            className={`text-xs font-extrabold uppercase tracking-wide ${
                              isActive ? 'text-primary' : 'text-slate-600'
                            }`}
                          >
                            {tab.title}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tab.badge}
                          </span>
                        </span>

                        <span className="text-navy mt-1.5 block text-sm font-bold sm:text-base">{tab.subtitle}</span>
                        <span className="mt-1.5 block text-xs leading-relaxed text-[#6f7882] sm:text-sm">{tab.description}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-slate-900 shadow-md">
                    <div className="relative h-72 w-full sm:h-80">
                      <Image
                        src={currentUnivTab.image}
                        alt={currentUnivTab.eventTitle}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover opacity-90 transition duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                      <div className="absolute right-4 bottom-4 left-4 text-white">
                        <span className="inline-block rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                          {currentUnivTab.badge}
                        </span>
                        <h3 className="mt-2 text-sm font-bold text-white sm:text-base">
                          {currentUnivTab.eventTitle}
                        </h3>
                        <p className="mt-1 text-xs text-slate-200">
                          {currentUnivTab.eventDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pro" className="scroll-mt-20 border-t border-[#e9eaec] bg-[#fbfcfc] py-16 sm:py-20">
          <div className="container-topcv">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800">
                <Crown className="h-3.5 w-3.5 text-amber-600" />
                <span>INTERVUE PRO • KHÔNG GIAN TUYỂN DỤNG CAO CẤP</span>
              </div>
              <h2 className="text-navy mt-3 text-2xl font-black tracking-tight sm:text-4xl">
                InterVue Pro - Tiếp cận ứng viên nhiều kinh nghiệm
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6f7882] sm:text-base">
                Không gian tuyển dụng chuyên biệt dành cho Doanh nghiệp hàng đầu và Ứng viên chất (Senior, Tech Lead,
                System Architect).
              </p>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#0f1722] via-[#162330] to-[#0a1017] p-8 text-white shadow-2xl sm:p-12">
              <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-extrabold text-amber-300">
                    <Award className="h-3.5 w-3.5" />
                    <span>INTERVUE PRO TALENT SUITE</span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs transition hover:border-amber-400/50">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wide">
                      <ShieldCheck className="h-4 w-4" />
                      <span>NỀN TẢNG DÀNH RIÊNG CHO ỨNG VIÊN NHIỀU NĂM KINH NGHIỆM</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Hồ sơ kỹ sư cấp cao được thẩm định qua hệ thống bài test kiến trúc hệ thống (System Design), đánh
                      giá kỹ năng quản lý và cam kết bảo mật danh tính tuyệt đối hai chiều, giúp ứng viên an tâm tiếp cận
                      cơ hội mới.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs transition hover:border-amber-400/50">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wide">
                      <Zap className="h-4 w-4" />
                      <span>CHIẾN DỊCH TRUYỀN THÔNG ĐẶC THÙ & ĐỘC QUYỀN</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Tiếp cận nguồn ứng viên qua các sự kiện Tech Summit, hội thảo chuyên đề kiến trúc và kênh truyền
                      thông thang máy tòa nhà văn phòng hạng A (Elevator Pitch) tại Hà Nội và TP.HCM.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setConsultModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-300 hover:to-amber-400 sm:text-sm"
                    >
                      <span>Tư vấn giải pháp InterVue Pro</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-[#1e293b] p-2 shadow-2xl">
                    <div className="relative h-72 w-full overflow-hidden rounded-xl sm:h-80">
                      <Image
                        src="/admin/banner-company.jpg"
                        alt="InterVue Pro Executive Talent"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c141d] via-transparent to-transparent" />

                      <div className="absolute right-4 bottom-4 left-4 rounded-xl border border-amber-400/30 bg-slate-950/85 p-3.5 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-300">Senior Tech Lead • 8+ YOE</span>
                          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300">
                            Verified
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white">Chuyên gia Kiến trúc Hệ thống Phân tán & AI</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                          <span>Đã vượt qua thẩm định năng lực InterVue Pro</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f5f5] py-16 sm:py-20">
          <div className="container-topcv">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Trụ cột dịch vụ</span>
              <h2 className="text-navy mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Hai phương thức tuyển dụng chủ lực tại InterVue
              </h2>
              <p className="mt-3 text-base text-[#6f7882]">
                Linh hoạt lựa chọn giữa đăng tin thu hút ứng viên nộp hồ sơ hoặc chủ động săn đón nhân tài công nghệ theo
                tech stack mong muốn.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div
                id="job-posting"
                className="scroll-mt-24 rounded-3xl border border-[#e9eaec] bg-white p-8 shadow-xs transition hover:shadow-md sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-primary text-xs font-bold uppercase">Giải pháp 01</span>
                    <h3 className="text-navy text-2xl font-bold">Đăng tin tuyển dụng thông minh</h3>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[#4d5965]">
                  Tiếp cận hơn 150.000+ lập trình viên đang chủ động tìm việc. Hệ thống phân bổ tin đăng tự động đến các
                  ứng viên có kỹ năng phù hợp nhất dựa trên thuật toán AI Matching.
                </p>

                <ul className="mt-6 space-y-3.5 text-sm text-[#263a4d]">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">AI JD Generator:</strong> Soạn thảo bản mô tả công việc IT chuẩn SEO
                      chỉ trong 30 giây.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Đẩy tin ưu tiên:</strong> Hiển thị vị trí nổi bật tại trang chủ và
                      danh mục ngành công nghệ.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Tự động xếp hạng CV:</strong> Phân loại ứng viên theo % tương thích
                      ngay khi nhận hồ sơ.
                    </span>
                  </li>
                </ul>

                <div className="mt-8 border-t border-[#f4f5f5] pt-6">
                  <Link
                    href={postJobUrl}
                    className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition"
                  >
                    <span>Tạo tin tuyển dụng ngay</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div
                id="candidate-sourcing"
                className="scroll-mt-24 rounded-3xl border border-[#e9eaec] bg-white p-8 shadow-xs transition hover:shadow-md sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-primary text-xs font-bold uppercase">Giải pháp 02</span>
                    <h3 className="text-navy text-2xl font-bold">Tìm kiếm hồ sơ ứng viên chủ động</h3>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[#4d5965]">
                  Chủ động săn đón nhân tài công nghệ mà không cần chờ nộp đơn. Khám phá kho tài năng Tech với bộ lọc
                  chuyên sâu và chỉ số AI Scoring tương thích.
                </p>

                <ul className="mt-6 space-y-3.5 text-sm text-[#263a4d]">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Bộ lọc Tech Stack:</strong> Lọc chi tiết theo Framework, Ngôn ngữ,
                      Vị trí và Mức lương.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">AI Match Scoring:</strong> Chấm điểm mức độ tương thích của ứng viên
                      đối với yêu cầu dự án.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Kết nối trực tiếp:</strong> Mở thông tin liên hệ và gửi lời mời
                      phỏng vấn chỉ với một cú nhấp chuột.
                    </span>
                  </li>
                </ul>

                <div className="mt-8 border-t border-[#f4f5f5] pt-6">
                  <Link
                    href={
                      isRecruiter
                        ? ROUTES.RECRUITER_CANDIDATES
                        : `${ROUTES.RECRUITER_LOGIN}?redirect=${encodeURIComponent(ROUTES.RECRUITER_CANDIDATES)}`
                    }
                    className="border-primary text-primary hover:bg-primary-light inline-flex items-center gap-2 rounded-xl border-2 bg-white px-6 py-3 text-sm font-bold shadow-sm transition"
                  >
                    <span>Khám phá kho hồ sơ</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 border-t border-[#e9eaec] bg-white py-16 sm:py-20">
          <div className="container-topcv">
            <div className="mb-12 text-center">
              <div className="text-primary mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3.5 py-1 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>HỆ SINH THÁI TUYỂN DỤNG TOÀN DIỆN</span>
              </div>
              <h2 className="text-navy text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
                Bộ công cụ thông minh <span className="text-primary">dành cho Tech HR</span>
              </h2>
              <p className="mt-2 text-sm text-[#6f7882] sm:text-base">
                InterVue kết hợp sức mạnh của AI và mô hình đánh giá kỹ thuật chuẩn STAR, giúp các Tech Recruiter và
                Hiring Manager tìm thấy ứng viên hoàn hảo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="hover:border-primary group flex flex-col justify-between rounded-2xl border border-[#e9eaec] bg-[#fbfcfc] p-6 transition duration-300 hover:bg-white hover:shadow-[0_12px_32px_rgba(0,177,79,0.12)]"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary-light text-primary">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="rounded-full border border-primary/20 bg-primary-light px-2.5 py-0.5 text-[11px] font-bold text-primary">
                          {feat.tag}
                        </span>
                      </div>

                      <h3 className="text-navy group-hover:text-primary text-[17px] font-bold transition-colors">
                        {feat.title}
                      </h3>

                      <p className="mt-2 text-[13.5px] leading-relaxed text-[#6f7882]">{feat.desc}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#f4f5f5] pt-3.5">
                      <Link
                        href={ROUTES.RECRUITER_LOGIN}
                        className="text-primary inline-flex items-center gap-1.5 text-[13px] font-bold transition group-hover:translate-x-1"
                      >
                        <span>Trải nghiệm ngay</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <span className="group-hover:bg-primary flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f5f5] text-[#6f7882] transition-colors group-hover:text-white">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-t border-[#e9eaec] bg-[#f4f5f5] py-16 sm:py-20">
          <div className="container-topcv">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Bảng giá dịch vụ</span>
              <h2 className="text-navy mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Linh hoạt cho mọi quy mô doanh nghiệp
              </h2>
              <p className="mt-4 text-base text-[#6f7882]">
                Khởi đầu hoàn toàn miễn phí với 03 tin đăng đầu tiên, nâng cấp gói khi doanh nghiệp có nhu cầu mở rộng quy
                mô tuyển dụng.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col justify-between rounded-3xl border-2 border-primary/40 bg-white p-8 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-tag px-3 py-1 text-xs font-bold text-primary">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Ưu đãi NTD mới</span>
                  </div>
                  <h3 className="text-navy mt-3 text-xl font-bold">Khởi đầu (0đ)</h3>
                  <p className="mt-1 text-xs text-[#6f7882]">Dành cho startup hoặc team nhỏ trải nghiệm nền tảng</p>
                  <div className="mt-5">
                    <span className="text-navy text-3xl font-extrabold">0đ</span>
                    <span className="text-xs text-[#6f7882]"> / vĩnh viễn</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-[#4d5965]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">Tặng ngay 03 tin tuyển dụng miễn phí</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">30 lượt AI Screening tự động</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Quản lý ứng viên qua bảng Kanban</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Duyệt tin nhanh trong 15 phút</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href={ROUTES.RECRUITER_REGISTER}
                  className="border-primary text-primary hover:bg-primary-light mt-8 block w-full rounded-xl border-2 py-3 text-center text-sm font-bold transition"
                >
                  Bắt đầu miễn phí
                </Link>
              </div>

              <div className="relative flex flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-xl">
                <span className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-xs font-bold text-white uppercase shadow-sm">
                  Phổ biến nhất
                </span>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Doanh nghiệp tăng trưởng</span>
                  </div>
                  <h3 className="text-navy mt-3 text-xl font-bold">Tech Pro</h3>
                  <p className="mt-1 text-xs text-[#6f7882]">Dành cho công ty có nhu cầu tuyển dụng tech liên tục</p>
                  <div className="mt-5">
                    <span className="text-primary text-3xl font-extrabold">1.490.000đ</span>
                    <span className="text-xs text-[#6f7882]"> / tháng</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-[#4d5965]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">Đăng tin tuyển dụng không giới hạn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">AI Sàng lọc CV không giới hạn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Tự động gợi ý câu hỏi STAR phỏng vấn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Huy hiệu Doanh nghiệp uy tín (Top Company)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Ưu tiên xuất hiện trên thanh tìm kiếm việc làm</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href={ROUTES.RECRUITER_LOGIN}
                  className="bg-primary hover:bg-primary-hover shadow-primary/20 mt-8 block w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-md transition"
                >
                  Đăng ký gói Pro
                </Link>
              </div>

              <div className="flex flex-col justify-between rounded-3xl border border-[#e9eaec] bg-white p-8 shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5f5] px-2.5 py-1 text-xs font-semibold text-[#4d5965]">
                    <Users className="h-3.5 w-3.5" />
                    <span>Quy mô lớn</span>
                  </div>
                  <h3 className="text-navy mt-3 text-xl font-bold">Enterprise</h3>
                  <p className="mt-1 text-xs text-[#6f7882]">Dành cho tập đoàn công nghệ hoặc công ty outsourcing</p>
                  <div className="mt-5">
                    <span className="text-navy text-3xl font-extrabold">Liên hệ</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-[#4d5965]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Tích hợp ATS nội bộ qua hệ thống API</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Mô hình AI huấn luyện riêng theo tiêu chuẩn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Chuyên viên tuyển dụng tư vấn và hỗ trợ 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Hợp đồng dịch vụ & hóa đơn VAT điện tử</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setConsultModalOpen(true)}
                  className="text-navy mt-8 block w-full rounded-xl border border-[#e9eaec] py-3 text-center text-sm font-bold transition hover:bg-[#f4f5f5]"
                >
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="scroll-mt-20 border-t border-[#e9eaec] bg-white py-16 sm:py-20">
          <div className="container-topcv">
            <div className="relative mb-12 text-center">
              <div className="text-primary mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-light px-3.5 py-1 text-[12px] font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ĐÁNH GIÁ TỪ DOANH NGHIỆP</span>
              </div>
              <h2 className="text-navy text-2xl font-black tracking-tight md:text-3xl">
                Khách hàng <span className="text-primary">nói gì về InterVue?</span>
              </h2>
              <p className="mt-1 text-[14px] text-[#6f7882] sm:text-[15px]">
                Hơn 20.000 doanh nghiệp công nghệ đã bứt phá hiệu suất tuyển dụng cùng InterVue.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <div
                  key={item.name}
                  className="hover:border-primary group flex h-full flex-col justify-between rounded-2xl border border-[#e9eaec] bg-white p-6 shadow-xs transition duration-300"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="group-hover:text-primary h-7 w-7 text-emerald-200 transition-colors" />
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-primary/20 bg-primary-light px-2.5 py-0.5 text-[11px] font-bold text-primary">
                        {item.tag}
                      </span>
                      <span className="text-primary inline-flex items-center gap-1 rounded-full bg-primary-tag px-2 py-0.5 text-[11px] font-bold">
                        <Sparkles className="h-3 w-3" />
                        {item.result}
                      </span>
                    </div>

                    <p className="text-navy line-clamp-4 text-[13.5px] leading-relaxed text-[#4d5965]">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#f4f5f5] pt-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={44}
                        height={44}
                        unoptimized
                        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-navy truncate text-[14.5px] font-bold">{item.name}</h3>
                          <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                        </div>
                        <p className="truncate text-[12px] font-medium text-[#6f7882]">
                          {item.role} • <span className="text-primary font-bold">{item.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-[#f4f5f5] pt-10">
              <p className="text-center text-xs font-bold tracking-wider text-[#6f7882] uppercase">
                Đối tác tuyển dụng tin cậy của các doanh nghiệp công nghệ hàng đầu
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                {PARTNERS.map((partner) => (
                  <div
                    key={partner.name}
                    className="hover:border-primary/50 flex items-center gap-2 rounded-xl border border-[#e9eaec] bg-white px-5 py-3 shadow-2xs transition hover:shadow-sm"
                  >
                    <span className="text-navy font-extrabold">{partner.name}</span>
                    <span className="rounded-md bg-[#f4f5f5] px-2 py-0.5 text-[11px] font-medium text-[#6f7882]">
                      {partner.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#00b14f] to-[#009643] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="container-topcv text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-bold text-white backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ưu đãi thành viên mới: Nhận ngay 03 tin tuyển dụng miễn phí</span>
            </div>
            <h2 className="mt-4 text-2xl font-black sm:text-4xl">
              Sẵn sàng xây dựng đội ngũ IT bứt phá cùng InterVue?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              Hơn 20.000 doanh nghiệp công nghệ đã tìm thấy nhân sự phù hợp. Đăng ký ngay hôm nay để nhận 03 tin tuyển
              dụng miễn phí và trải nghiệm AI sàng lọc CV.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={ROUTES.RECRUITER_LOGIN}
                className="text-navy flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold shadow-lg transition hover:bg-slate-50"
              >
                <span>Đăng nhập Cổng tuyển dụng</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.RECRUITER_REGISTER}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <span>Tạo tài khoản Doanh nghiệp mới</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Modal
        isOpen={consultModalOpen}
        onClose={handleCloseConsultModal}
        title="Đăng ký Tư vấn Tuyển dụng IT Chuyên sâu"
        description="Đội ngũ chuyên viên tư vấn InterVue sẽ liên hệ hỗ trợ trong vòng 15 phút làm việc."
        maxWidth="md"
      >
        {consultSubmitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-navy mt-4 text-lg font-bold">Gửi yêu cầu tư vấn thành công!</h3>
            <p className="mt-2 text-xs text-slate-600">
              Cảm ơn quý doanh nghiệp đã tin tưởng InterVue. Chuyên viên tư vấn tuyển dụng sẽ liên hệ qua số điện thoại{' '}
              <strong className="text-slate-800">{submittedPhone || consultForm.phone}</strong> sớm nhất.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="tel:0812665001"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                <span>Hotline: 0812.665.001</span>
              </a>
              <button
                type="button"
                onClick={handleCloseConsultModal}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConsultSubmit} className="space-y-4 pt-2">
            <div>
              <label htmlFor="fullName" className="text-navy block text-xs font-bold">
                Họ và tên người liên hệ *
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={consultForm.fullName}
                onChange={(e) => setConsultForm({ ...consultForm, fullName: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn A (HR Manager)"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="text-navy block text-xs font-bold">
                  Số điện thoại *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={consultForm.phone}
                  onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                  placeholder="0987654321"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-navy block text-xs font-bold">
                  Email doanh nghiệp *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={consultForm.email}
                  onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                  placeholder="hr@congty.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="text-navy block text-xs font-bold">
                Tên công ty / Doanh nghiệp *
              </label>
              <input
                id="company"
                type="text"
                required
                value={consultForm.company}
                onChange={(e) => setConsultForm({ ...consultForm, company: e.target.value })}
                placeholder="Tên doanh nghiệp của bạn"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="needs" className="text-navy block text-xs font-bold">
                Nhu cầu tuyển dụng
              </label>
              <select
                id="needs"
                value={consultForm.needs}
                onChange={(e) => setConsultForm({ ...consultForm, needs: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="Tư vấn đăng tin tuyển dụng IT & Gói AI Matching">
                  Tư vấn đăng tin tuyển dụng IT & Gói AI Matching
                </option>
                <option value="Tư vấn gói InterVue Pro (Senior / Tech Lead)">
                  Tư vấn gói InterVue Pro (Senior / Tech Lead)
                </option>
                <option value="Hợp tác InterVue University kết nối sinh viên IT">
                  Hợp tác InterVue University kết nối sinh viên IT
                </option>
                <option value="Tư vấn tích hợp API & Gói Enterprise">Tư vấn tích hợp API & Gói Enterprise</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={handleCloseConsultModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover shadow-primary/20 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gửi đăng ký tư vấn</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
