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
    title: 'IT jobs updated every day',
    desc: 'A wide range of opportunities from large technology groups, multinationals and tech unicorns to fast-growing startups, matching candidates from fresher to C-level.',
  },
  {
    step: '02',
    title: 'Put your jobs where candidates search, on Google and in AI answers',
    desc: 'Strong SEO presence on Google and optimized visibility in AI answers for IT recruitment, so your employer brand stands out.',
  },
  {
    step: '03',
    title: 'Web and mobile app access',
    desc: 'Bring job opportunities to candidates on every desktop and mobile device, shortening response time and making it easier to apply.',
  },
  {
    step: '04',
    title: 'Automatic job suggestions with AI matching',
    desc: 'AI analyzes candidate profiles, tech stacks and search behavior to send the most relevant job suggestions to the right engineers.',
  },
];

const UNIVERSITIES = [
  { code: 'FTU', name: 'Foreign Trade University', logo: '/srp/university/ftu.png' },
  { code: 'NEU', name: 'National Economics University', logo: '/srp/university/neu.png' },
  { code: 'TMU', name: 'Thuongmai University', logo: '/srp/university/tmu.png' },
  { code: 'HUST', name: 'Hanoi University of Science and Technology', logo: '/srp/university/hust.png' },
  { code: 'VNU', name: 'Vietnam National University, Hanoi', logo: '/srp/university/vnu.png' },
  { code: 'VNUHCM', name: 'Vietnam National University, Ho Chi Minh City', logo: '/srp/university/vnuhcm.png' },
  { code: 'UEH', name: 'University of Economics Ho Chi Minh City', logo: '/srp/university/ueh.png' },
];

const UNIVERSITY_TABS = [
  {
    title: 'UNIVERSITY-BRANDED JOB PORTAL',
    subtitle: 'Digital platform for internships and graduate jobs',
    description:
      'Work with university leadership to build an exclusive job portal carrying the university brand, connecting students directly with sponsoring companies and digitizing the internship process.',
    badge: 'Exclusive digital module',
    image: '/market-bg.jpg',
    eventTitle: 'Exclusive digital university job portal',
    eventDesc: 'Connecting partner universities with technology companies that are hiring.',
  },
  {
    title: 'CAREER CONNECTION ACTIVITIES',
    subtitle: 'Job fairs and large-scale tech career days',
    description:
      'Sponsor and co-organize annual Tech Job Fairs at leading technology universities, where outstanding students join on-site preliminary interviews at company booths.',
    badge: 'Large-scale student events',
    image: '/banner-recruitment-1.jpg',
    eventTitle: 'Tech Job Fair & university partnership signing',
    eventDesc: 'Connecting IT students with leading technology companies in Vietnam.',
  },
  {
    title: 'STUDENT TRAINING AND SUPPORT',
    subtitle: '1-on-1 resume review & AI mock interviews',
    description:
      'Run career-orientation workshops, provide AI tools to optimize ATS-friendly resumes and host AI Mock Interview sessions so final-year students apply for internship and junior roles with confidence.',
    badge: 'In-depth 1-on-1 support',
    image: '/landing/banner-bot.jpg',
    eventTitle: 'Career orientation workshops & AI Mock Interview',
    eventDesc: 'Equipping students with ATS-friendly resume writing and technical interview practice with AI.',
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
    result: 'Faster screening',
    content:
      'With the AI CV Matcher from InterVue, our recruiting team significantly shortened initial screening for Senior Fullstack and DevOps roles. The tech stack accuracy is impressive!',
  },
  {
    name: 'Trần Đức Huy',
    role: 'Engineering Manager',
    company: 'Techcombank',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tag: 'Structured interviews',
    result: 'Better-fit hires',
    content:
      'The automatically suggested structured interview questions follow the real experience of each candidate closely, making technical interviews precise, in-depth and time-saving for the panel.',
  },
  {
    name: 'Lê Hoàng Yến',
    role: 'HR Director',
    company: 'VNG Corporation',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tag: 'Proactive sourcing',
    result: 'Reached senior AI talent',
    content:
      'The proactive tech profile search brings a high-quality candidate pool, especially for AI/ML experts, who are very hard to hire on the market. Very reliable!',
  },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI CV Matcher & Screener',
    desc: 'Analyzes tech stack, years of experience and real projects against the job description, then ranks compatibility from highest to lowest automatically.',
    tag: 'Automation',
  },
  {
    icon: FileText,
    title: 'SEO-friendly AI JD Generator',
    desc: 'An AI assistant suggests required skills, responsibilities and benefits in seconds. Keyword optimization helps reach the right IT candidates.',
    tag: 'Fast drafting',
  },
  {
    icon: BarChart3,
    title: 'ATS Kanban candidate management',
    desc: 'A visual candidate pipeline with drag-and-drop across stages: New, Matched, Interview, Offer and Hired. Notes stay in sync.',
    tag: 'Standard workflow',
  },
  {
    icon: Bot,
    title: 'AI-suggested structured interview questions',
    desc: 'Based on the tech stack and projects in each resume, AI suggests in-depth structured questions to assess real-world skills accurately.',
    tag: 'In-depth interviews',
  },
  {
    icon: Code2,
    title: 'Proactive tech talent search',
    desc: 'Browse the profile pool with advanced filters: framework, language, position (Frontend, Backend, DevOps, AI), salary and job-seeking status.',
    tag: 'IT candidate pool',
  },
  {
    icon: ShieldCheck,
    title: 'Verified eKYC profiles',
    desc: 'Candidates are identity-verified, which limits fake or spam profiles and keeps hiring quality high for companies.',
    tag: 'Real profiles',
  },
];

const INITIAL_CONSULT_FORM = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  needs: 'IT job posting & AI matching packages',
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
    <div className="bg-surface-container-low flex min-h-screen flex-col text-[#263a4d] antialiased">
      <Header portal="recruiter" />

      <main className="flex-1">
        <section
          id="introduction-hero"
          className="relative h-[530px] overflow-hidden bg-white bg-contain bg-bottom bg-no-repeat md:bg-cover lg:h-[665px] lg:bg-[#F5FBF9]"
          style={{
            backgroundImage: "url('/ai-hero-scene-desktop.png')",
          }}
        >
          <div className="pointer-events-none absolute top-[128px] left-[5px] z-3 hidden sm:block lg:top-[220px] lg:left-[20px]">
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
              <h1 className="m-0 w-full text-3xl leading-tight font-bold text-[#263A4D] sm:text-4xl lg:text-[42px] lg:leading-[50px]">
                Hire the right candidates{' '}
                <span className="relative text-[#0B933E]">
                  with AI
                  <span className="ml-1 inline-block text-xl lg:text-2xl">✨</span>
                </span>
              </h1>
              <p className="m-0 w-full text-base leading-normal font-semibold text-[#0B933E] sm:text-xl lg:text-[28px] lg:leading-[36px]">
                Reach IT candidates who are actively looking for jobs
              </p>
            </div>

            <div className="mt-6 flex w-full max-w-[340px] flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row lg:mt-7 lg:gap-6">
              <button
                type="button"
                onClick={() => setConsultModalOpen(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#263A4D] px-7 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1a2936] sm:w-auto sm:text-base"
              >
                <Headphones className="h-4 w-4" />
                <span>Talk to our team</span>
              </button>

              <Link
                href={postJobUrl}
                className="hover:bg-primary flex w-full items-center justify-center gap-2 rounded-full bg-[#009D46] px-8 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 sm:w-auto sm:text-base"
              >
                <span>Post a job</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="analytics-stats"
          className="border-outline-variant bg-surface-container-low border-b py-8 lg:py-10"
        >
          <div className="container-page">
            <div className="flex flex-col items-center justify-center gap-6 divide-y divide-[#D6E5DC] text-center sm:flex-row sm:justify-between sm:divide-x sm:divide-y-0">
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">AI</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">
                  Resume matching against your job requirements
                </p>
              </div>
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">eKYC</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">Identity-verified candidates</p>
              </div>
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">Verified</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">Companies verified before posting</p>
              </div>
              <div className="flex w-full flex-col items-center gap-1.5 px-4 sm:w-1/4">
                <p className="text-3xl font-extrabold tracking-tight text-[#009D46] lg:text-4xl">Web + App</p>
                <p className="text-xs font-semibold text-[#303235] lg:text-sm">Job search on web and mobile</p>
              </div>
            </div>
          </div>
        </section>

        <section id="ecosystem" className="border-outline-variant scroll-mt-20 border-b bg-white py-16 sm:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-primary border-primary/20 bg-primary-light inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold">
                <Globe className="h-3.5 w-3.5" />
                <span>MULTI-CHANNEL REACH ECOSYSTEM</span>
              </div>
              <h2 className="text-navy mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
                How does InterVue attract candidates?
              </h2>
              <p className="text-on-surface-variant mt-3 text-sm leading-relaxed sm:text-base">
                IT candidates use InterVue to find jobs, grow their careers and discover new opportunities every day.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="border-outline-variant bg-primary-light relative mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border p-8 text-center">
                  <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
                    <Image src="/srp/analytics/globe-grid.svg" alt="" fill className="object-contain opacity-70" />

                    <div className="shadow-elevation-2 border-primary/30 absolute inset-0 m-auto flex h-36 w-36 flex-col items-center justify-center rounded-full border bg-white/95 p-4 backdrop-blur-xs">
                      <div className="text-3xl font-extrabold text-[#009D46] sm:text-4xl">IT</div>
                      <div className="mt-1 text-center text-xs font-semibold text-[#263a4d]">
                        Candidates focused on IT roles
                      </div>
                    </div>
                  </div>

                  <div className="text-on-surface mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                      <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
                    </span>
                    <span>Profile data updated in real time</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-7">
                <div className="before:bg-primary/30 relative pl-6 before:absolute before:top-4 before:bottom-4 before:left-3.5 before:w-0.5">
                  {TOUCHPOINTS.map((tp) => (
                    <div key={tp.step} className="group relative mb-6 last:mb-0">
                      <div className="group-hover:bg-primary bg-primary absolute -left-6 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white transition-colors">
                        {tp.step}
                      </div>

                      <div className="border-outline-variant group-hover:shadow-elevation-1 group-hover:border-primary rounded-xl border bg-white p-5 transition duration-200">
                        <h3 className="text-navy group-hover:text-primary text-base font-bold transition-colors">
                          {tp.title}
                        </h3>
                        <p className="text-on-surface-variant mt-2 text-xs leading-relaxed sm:text-sm">{tp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-primary/20 bg-primary-light border-y py-6 sm:py-8">
          <div className="container-page flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-navy text-base font-bold sm:text-lg">
                A broad candidate ecosystem helps your job posts reach the right people at the right time.
              </p>
              <p className="text-on-surface-variant text-xs">
                Reduce costs and speed up hiring of high-quality tech talent.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setConsultModalOpen(true)}
                className="border-outline text-on-surface hover:bg-surface-container-low rounded-full border bg-white px-5 py-2.5 text-xs font-bold transition sm:text-sm"
              >
                Talk to our team
              </button>

              <Link
                href={ROUTES.RECRUITER_REGISTER}
                className="bg-primary hover:bg-primary-hover flex items-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-bold text-white transition sm:text-sm"
              >
                <span>Sign up</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <section id="university" className="bg-surface-container-low scroll-mt-20 py-16 sm:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-primary border-primary/20 bg-primary-light inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>INTERVUE UNIVERSITY • PARTNER UNIVERSITY NETWORK</span>
              </div>
              <h2 className="text-navy mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
                InterVue University – Partner university network
              </h2>
              <p className="text-on-surface-variant mt-3 text-sm leading-relaxed sm:text-base">
                InterVue works with universities and colleges across Vietnam to help students, young engineers and the
                next generation of tech talent start their careers.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {UNIVERSITIES.map((univ) => (
                <div key={univ.code} className="flex flex-col items-center gap-1.5">
                  <div className="border-outline-variant hover:shadow-elevation-1 flex h-14 w-14 items-center justify-center rounded-full border bg-white p-2 transition-transform duration-200 hover:scale-105 sm:h-16 sm:w-16">
                    <Image
                      src={univ.logo}
                      alt={univ.name}
                      width={48}
                      height={48}
                      className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                    />
                  </div>
                  <span className="text-label-sm text-on-surface-variant font-bold sm:text-xs">{univ.code}</span>
                </div>
              ))}
            </div>

            <div className="border-primary/30 mt-10 rounded-2xl border-2 bg-white p-6 sm:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div role="tablist" aria-label="University partnership modules" className="space-y-4 lg:col-span-7">
                  {UNIVERSITY_TABS.map((tab, idx) => {
                    const isActive = activeUnivTab === idx;
                    return (
                      <button
                        key={tab.title}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveUnivTab(idx)}
                        className={`focus-visible:ring-primary w-full cursor-pointer rounded-xl border p-5 text-left transition-all focus:outline-none focus-visible:ring-2 ${
                          isActive
                            ? 'border-primary bg-primary-light ring-primary/30 ring-1'
                            : 'border-outline-variant hover:border-outline bg-white'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span
                            className={`text-xs font-extrabold tracking-wide uppercase ${
                              isActive ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                          >
                            {tab.title}
                          </span>
                          <span
                            className={`text-label-sm rounded-full px-2.5 py-0.5 font-bold ${
                              isActive ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {tab.badge}
                          </span>
                        </span>

                        <span className="text-navy mt-1.5 block text-sm font-bold sm:text-base">{tab.subtitle}</span>
                        <span className="text-on-surface-variant mt-1.5 block text-xs leading-relaxed sm:text-sm">
                          {tab.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-5">
                  <div className="shadow-elevation-1 border-primary/30 relative overflow-hidden rounded-xl border bg-slate-900">
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
                        <span className="text-label-sm bg-primary inline-block rounded-md px-2.5 py-1 font-bold text-white">
                          {currentUnivTab.badge}
                        </span>
                        <h3 className="mt-2 text-sm font-bold text-white sm:text-base">{currentUnivTab.eventTitle}</h3>
                        <p className="mt-1 text-xs text-slate-200">{currentUnivTab.eventDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pro" className="border-outline-variant scroll-mt-20 border-t bg-[#fbfcfc] py-16 sm:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800">
                <Crown className="h-3.5 w-3.5 text-amber-600" />
                <span>INTERVUE PRO • PREMIUM RECRUITMENT SPACE</span>
              </div>
              <h2 className="text-navy mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
                InterVue Pro – Reach experienced candidates
              </h2>
              <p className="text-on-surface-variant mt-3 text-sm leading-relaxed sm:text-base">
                A dedicated hiring space for leading companies and high-quality candidates (Senior, Tech Lead, System
                Architect).
              </p>
            </div>

            <div className="shadow-elevation-2 relative mt-10 overflow-hidden rounded-2xl border border-amber-500/40 bg-[#0f1722] p-8 text-white sm:p-12">
              <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-extrabold text-amber-300">
                    <Award className="h-3.5 w-3.5" />
                    <span>INTERVUE PRO TALENT SUITE</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs transition hover:border-amber-400/50">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-amber-300 uppercase">
                      <ShieldCheck className="h-4 w-4" />
                      <span>PLATFORM FOR HIGHLY EXPERIENCED CANDIDATES</span>
                    </div>
                    <p className="text-outline mt-2 text-xs leading-relaxed sm:text-sm">
                      Senior engineer profiles are assessed through system design tests and management skill evaluation,
                      with strict two-way identity confidentiality so candidates can explore new opportunities with
                      peace of mind.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs transition hover:border-amber-400/50">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-amber-300 uppercase">
                      <Zap className="h-4 w-4" />
                      <span>EXCLUSIVE TARGETED CAMPAIGNS</span>
                    </div>
                    <p className="text-outline mt-2 text-xs leading-relaxed sm:text-sm">
                      Reach candidates through Tech Summit events, architecture seminars and elevator media in Grade A
                      office buildings (Elevator Pitch) in Hanoi and Ho Chi Minh City.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setConsultModalOpen(true)}
                      className="text-on-surface shadow-elevation-2 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-xs font-extrabold transition hover:bg-amber-300 sm:text-sm"
                    >
                      <span>Talk to us about InterVue Pro</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-primary-deeper shadow-elevation-2 relative overflow-hidden rounded-xl border border-amber-500/30 p-2">
                    <div className="relative h-72 w-full overflow-hidden rounded-xl sm:h-80">
                      <Image
                        src="/landing/banner-company.jpg"
                        alt="InterVue Pro Executive Talent"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c141d] via-transparent to-transparent" />

                      <div className="absolute right-4 bottom-4 left-4 rounded-xl border border-amber-400/30 bg-slate-950/85 p-3.5 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <span className="text-label-sm font-bold text-amber-300">Senior Tech Lead</span>
                          <span className="text-label-sm rounded-full bg-amber-400/20 px-2 py-0.5 font-extrabold text-amber-300">
                            Verified
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white">Distributed systems & AI architect</p>
                        <div className="text-label-sm mt-2 flex items-center gap-1.5 text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                          <span>Passed the InterVue Pro skills assessment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-16 sm:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Service pillars</span>
              <h2 className="text-navy mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Two core hiring methods at InterVue
              </h2>
              <p className="text-on-surface-variant mt-3 text-base">
                Choose between posting jobs to attract applications or proactively sourcing tech talent by the tech
                stack you need.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div
                id="job-posting"
                className="border-outline-variant hover:shadow-elevation-1 scroll-mt-24 rounded-2xl border bg-white p-8 transition sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-light text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-primary text-xs font-bold uppercase">Solution 01</span>
                    <h3 className="text-navy text-2xl font-bold">Smart job posting</h3>
                  </div>
                </div>

                <p className="text-on-surface-variant mt-5 text-sm leading-relaxed">
                  Reach developers who are actively looking for jobs. InterVue matches your post with candidates whose
                  skills fit best.
                </p>

                <ul className="mt-6 space-y-3.5 text-sm text-[#263a4d]">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">AI JD Generator:</strong> Draft SEO-friendly IT job descriptions in
                      seconds.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Priority posting:</strong> Get featured placement on the home page
                      and in technology categories.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Automatic CV ranking:</strong> Rank candidates by match score as
                      soon as applications arrive.
                    </span>
                  </li>
                </ul>

                <div className="border-outline-variant mt-8 border-t pt-6">
                  <Link
                    href={postJobUrl}
                    className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition"
                  >
                    <span>Create a job post now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div
                id="candidate-sourcing"
                className="border-outline-variant hover:shadow-elevation-1 scroll-mt-24 rounded-2xl border bg-white p-8 transition sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-light text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-primary text-xs font-bold uppercase">Solution 02</span>
                    <h3 className="text-navy text-2xl font-bold">Proactive candidate search</h3>
                  </div>
                </div>

                <p className="text-on-surface-variant mt-5 text-sm leading-relaxed">
                  Proactively find tech talent without waiting for applications. Explore the tech talent pool with
                  advanced filters and AI match scoring.
                </p>

                <ul className="mt-6 space-y-3.5 text-sm text-[#263a4d]">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Tech stack filters:</strong> Filter by framework, language, position
                      and salary.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">AI Match Scoring:</strong> Score how well each candidate fits the
                      project requirements.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong className="text-navy">Direct contact:</strong> View contact details and send interview
                      invitations with one click.
                    </span>
                  </li>
                </ul>

                <div className="border-outline-variant mt-8 border-t pt-6">
                  <Link
                    href={
                      isRecruiter
                        ? ROUTES.RECRUITER_CANDIDATES
                        : `${ROUTES.RECRUITER_LOGIN}?redirect=${encodeURIComponent(ROUTES.RECRUITER_CANDIDATES)}`
                    }
                    className="border-primary text-primary hover:bg-primary-light inline-flex items-center gap-2 rounded-xl border-2 bg-white px-6 py-3 text-sm font-bold transition"
                  >
                    <span>Explore candidate profiles</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-outline-variant scroll-mt-20 border-t bg-white py-16 sm:py-20">
          <div className="container-page">
            <div className="mb-12 text-center">
              <div className="text-primary border-primary/20 bg-primary-light mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>A COMPLETE RECRUITMENT ECOSYSTEM</span>
              </div>
              <h2 className="text-navy text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Smart tools <span className="text-primary">for tech HR</span>
              </h2>
              <p className="text-on-surface-variant mt-2 text-sm sm:text-base">
                InterVue combines AI with structured technical assessment to help tech recruiters and hiring managers
                find the right candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="hover:border-primary group border-outline-variant flex flex-col justify-between rounded-xl border bg-[#fbfcfc] p-6 transition duration-300 hover:bg-white hover:shadow-[0_12px_32px_rgba(0,177,79,0.12)]"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="border-primary/20 bg-primary-light text-primary flex h-12 w-12 items-center justify-center rounded-xl border">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="border-primary/20 bg-primary-light text-primary text-label-sm rounded-full border px-2.5 py-0.5 font-bold">
                          {feat.tag}
                        </span>
                      </div>

                      <h3 className="text-navy group-hover:text-primary text-[17px] font-bold transition-colors">
                        {feat.title}
                      </h3>

                      <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">{feat.desc}</p>
                    </div>

                    <div className="border-outline-variant mt-6 flex items-center justify-between border-t pt-3.5">
                      <Link
                        href={ROUTES.RECRUITER_LOGIN}
                        className="text-primary text-body-md inline-flex items-center gap-1.5 font-bold transition group-hover:translate-x-1"
                      >
                        <span>Try it now</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <span className="group-hover:bg-primary bg-surface-container-low text-on-surface-variant flex h-7 w-7 items-center justify-center rounded-full transition-colors group-hover:text-white">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="border-outline-variant bg-surface-container-low scroll-mt-20 border-t py-16 sm:py-20"
        >
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Pricing</span>
              <h2 className="text-navy mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Flexible for companies of every size
              </h2>
              <p className="text-on-surface-variant mt-4 text-base">
                Start completely free with your first 3 job posts, then upgrade as your hiring grows.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border-primary/40 flex flex-col justify-between rounded-2xl border-2 bg-white p-8">
                <div>
                  <div className="border-primary/20 bg-primary-tag text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
                    <Zap className="h-3.5 w-3.5" />
                    <span>New employer offer</span>
                  </div>
                  <h3 className="text-navy mt-3 text-xl font-bold">Starter (Free)</h3>
                  <p className="text-on-surface-variant mt-1 text-xs">
                    For startups or small teams trying the platform
                  </p>
                  <div className="mt-5">
                    <span className="text-navy text-3xl font-extrabold">Free</span>
                    <span className="text-on-surface-variant text-xs"> / forever</span>
                  </div>
                  <ul className="text-on-surface-variant mt-6 space-y-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">3 free job posts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">30 automated AI screenings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Manage candidates with a Kanban board</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Fast job post review</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href={ROUTES.RECRUITER_REGISTER}
                  className="border-primary text-primary hover:bg-primary-light mt-8 block w-full rounded-xl border-2 py-3 text-center text-sm font-bold transition"
                >
                  Get started for free
                </Link>
              </div>

              <div className="border-primary shadow-elevation-2 relative flex flex-col justify-between rounded-2xl border-2 bg-white p-8">
                <span className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-xs font-bold text-white uppercase">
                  Most popular
                </span>
                <div>
                  <div className="bg-primary-light text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Growing companies</span>
                  </div>
                  <h3 className="text-navy mt-3 text-xl font-bold">Growth</h3>
                  <p className="text-on-surface-variant mt-1 text-xs">For companies with continuous tech hiring</p>
                  <div className="mt-5">
                    <span className="text-primary text-3xl font-extrabold">1,490,000 VND</span>
                    <span className="text-on-surface-variant text-xs"> / month</span>
                  </div>
                  <ul className="text-on-surface-variant mt-6 space-y-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">Unlimited job posts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span className="text-navy font-semibold">Unlimited AI resume screening</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>AI-suggested structured interview questions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Trusted company badge (Top Company)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Priority placement in job search</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href={ROUTES.RECRUITER_LOGIN}
                  className="bg-primary hover:bg-primary-hover shadow-elevation-1 mt-8 block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition"
                >
                  Sign up for Growth
                </Link>
              </div>

              <div className="border-outline-variant flex flex-col justify-between rounded-2xl border bg-white p-8">
                <div>
                  <div className="bg-surface-container-low text-on-surface-variant inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                    <Users className="h-3.5 w-3.5" />
                    <span>Large scale</span>
                  </div>
                  <h3 className="text-navy mt-3 text-xl font-bold">Enterprise</h3>
                  <p className="text-on-surface-variant mt-1 text-xs">For technology groups or outsourcing companies</p>
                  <div className="mt-5">
                    <span className="text-navy text-3xl font-extrabold">Contact us</span>
                  </div>
                  <ul className="text-on-surface-variant mt-6 space-y-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Internal ATS integration through API</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>AI models trained to your own standards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Dedicated recruitment consultant and 24/7 support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                      <span>Service contract & electronic VAT invoice</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setConsultModalOpen(true)}
                  className="text-navy border-outline-variant hover:bg-surface-container-low mt-8 block w-full rounded-xl border py-3 text-center text-sm font-bold transition"
                >
                  Talk to our team
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="border-outline-variant scroll-mt-20 border-t bg-white py-16 sm:py-20">
          <div className="container-page">
            <div className="relative mb-12 text-center">
              <div className="text-primary border-primary/20 bg-primary-light text-body-sm mb-2.5 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>REVIEWS FROM COMPANIES</span>
              </div>
              <h2 className="text-navy text-2xl font-bold tracking-tight md:text-3xl">
                What customers <span className="text-primary">say about InterVue</span>
              </h2>
              <p className="text-body-md text-on-surface-variant sm:text-body-lg mt-1">
                Hear how technology companies hire with InterVue.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <div
                  key={item.name}
                  className="hover:border-primary group border-outline-variant flex h-full flex-col justify-between rounded-xl border bg-white p-6 transition duration-300"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="group-hover:text-primary text-primary/30 h-7 w-7 transition-colors" />
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="border-primary/20 bg-primary-light text-primary text-label-sm rounded-full border px-2.5 py-0.5 font-bold">
                        {item.tag}
                      </span>
                      <span className="text-primary bg-primary-tag text-label-sm inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold">
                        <Sparkles className="h-3 w-3" />
                        {item.result}
                      </span>
                    </div>

                    <p className="text-navy text-body-md text-on-surface-variant line-clamp-4 leading-relaxed">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </div>

                  <div className="border-outline-variant mt-5 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={44}
                        height={44}
                        unoptimized
                        className="ring-primary/20 h-11 w-11 shrink-0 rounded-full object-cover ring-2"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-navy text-body-md truncate font-bold">{item.name}</h3>
                          <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                        </div>
                        <p className="text-body-sm text-on-surface-variant truncate font-medium">
                          {item.role} • <span className="text-primary font-bold">{item.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-outline-variant mt-14 border-t pt-10">
              <p className="text-on-surface-variant text-center text-xs font-bold tracking-wider uppercase">
                Trusted recruitment partner of leading technology companies
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                {PARTNERS.map((partner) => (
                  <div
                    key={partner.name}
                    className="hover:border-primary/50 border-outline-variant flex items-center gap-2 rounded-xl border bg-white px-5 py-3 transition hover:shadow-sm"
                  >
                    <span className="text-navy font-extrabold">{partner.name}</span>
                    <span className="bg-surface-container-low text-label-sm text-on-surface-variant rounded-md px-2 py-0.5 font-medium">
                      {partner.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="container-page text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-bold text-white backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>New employer offer: get 3 free job posts</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold sm:text-4xl">Ready to build your IT team with InterVue?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              Sign up today to get 3 free job posts and try AI resume screening.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={ROUTES.RECRUITER_LOGIN}
                className="text-navy shadow-elevation-2 hover:bg-surface-container-low flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold transition"
              >
                <span>Sign in to the employer portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.RECRUITER_REGISTER}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <span>Create a new employer account</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Modal
        isOpen={consultModalOpen}
        onClose={handleCloseConsultModal}
        title="Request IT recruitment consultation"
        description="Our recruitment consultants will contact you shortly."
        maxWidth="md"
      >
        {consultSubmitted ? (
          <div className="py-6 text-center">
            <div className="bg-primary-tag text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-navy mt-4 text-lg font-bold">Request sent!</h3>
            <p className="text-on-surface-variant mt-2 text-xs">
              Thank you for choosing InterVue. A recruitment consultant will call you at{' '}
              <strong className="text-on-surface">{submittedPhone}</strong> soon.
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
                className="border-outline text-on-surface hover:bg-surface-container-high rounded-xl border px-5 py-2.5 text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConsultSubmit} className="space-y-4 pt-2">
            <div>
              <label htmlFor="fullName" className="text-navy block text-xs font-bold">
                Contact name *
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={consultForm.fullName}
                onChange={(e) => setConsultForm({ ...consultForm, fullName: e.target.value })}
                placeholder="e.g. Nguyen Van A (HR Manager)"
                className="focus:border-primary focus:ring-primary/20 border-outline-variant text-on-surface mt-1 w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="text-navy block text-xs font-bold">
                  Phone number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={consultForm.phone}
                  onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                  placeholder="0987654321"
                  className="focus:border-primary focus:ring-primary/20 border-outline-variant text-on-surface mt-1 w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-navy block text-xs font-bold">
                  Work email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={consultForm.email}
                  onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                  placeholder="hr@company.com"
                  className="focus:border-primary focus:ring-primary/20 border-outline-variant text-on-surface mt-1 w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="text-navy block text-xs font-bold">
                Company name *
              </label>
              <input
                id="company"
                type="text"
                required
                value={consultForm.company}
                onChange={(e) => setConsultForm({ ...consultForm, company: e.target.value })}
                placeholder="Your company name"
                className="focus:border-primary focus:ring-primary/20 border-outline-variant text-on-surface mt-1 w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="needs" className="text-navy block text-xs font-bold">
                Hiring need
              </label>
              <select
                id="needs"
                value={consultForm.needs}
                onChange={(e) => setConsultForm({ ...consultForm, needs: e.target.value })}
                className="focus:border-primary focus:ring-primary/20 border-outline-variant text-on-surface mt-1 w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition focus:ring-2 focus:outline-none"
              >
                <option value="IT job posting & AI matching packages">IT job posting & AI matching packages</option>
                <option value="InterVue Pro (Senior / Tech Lead hiring)">
                  InterVue Pro (Senior / Tech Lead hiring)
                </option>
                <option value="InterVue University partnership">InterVue University partnership</option>
                <option value="API integration & Enterprise package">API integration & Enterprise package</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={handleCloseConsultModal}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-xl border px-4 py-2.5 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send request</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
