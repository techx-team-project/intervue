export const CV_TEMPLATE_MESSAGES = {
  pageMetadata: {
    title: 'Simple CV Templates for Job Applications 2026 | InterVue',
    description:
      'Browse 21+ simple, ATS-ready CV templates for 2026. Build your CV online for free, customize colors easily and download high-quality PDFs.',
    ogTitle: 'Curated Simple CV Templates for 2026 - InterVue',
    ogDescription: 'Build a CV online for free with ready-made templates optimized for ATS scores in every industry.',
  },
  slugMetadata: {
    defaultStyleName: 'Simple',
    title: (styleName: string) => `Curated ${styleName} CV Templates for 2026 | InterVue`,
    description: (styleName: string) =>
      `Explore ${styleName} ATS-ready CV templates for 2026. Designed to be skimmed quickly by recruiters and compatible with automatic resume scanners.`,
    ogTitle: (styleName: string) => `${styleName} CV Templates - InterVue`,
    ogDescription: (styleName: string) =>
      `Create a ${styleName} CV for free with 21+ professionally designed templates.`,
  },
  hero: {
    homeBreadcrumb: 'Home',
    styleBreadcrumb: 'CV templates by style',
    currentBreadcrumb: 'Simple CV templates for 2026',
    badge: 'Curated ATS-Optimized CV Library',
    title: 'CV templates for job applications:',
    titleHighlight: 'Simple',
    titleSuffix: 'for 2026',
    description:
      'Curated CV templates with a simple design that put readability first and are optimized for ATS filters. Made for candidates who want to present complete, clear information and highlight impressive achievements to recruiters.',
    badges: {
      atsPass: '100% ATS-friendly',
      a4Standard: 'International A4 format',
      freeExport: 'Free PDF export',
    },
    ctaCard: {
      title: 'Create a Professional CV',
      subtitle: 'Only 3 minutes with InterVue',
      availableLabel: 'Templates available:',
      availableValue: '21+ templates',
      usersLabel: 'Candidates using it:',
      interviewRateLabel: 'Interview call rate:',
      interviewRateValue: '+42% compared with a regular CV',
    },
  },
  filterBar: {
    searchPlaceholder: 'Search by template name or industry...',
    industryLabel: 'Industry:',
    languageLabel: 'Language:',
    allLanguageLabel: 'All',
    languages: {
      all: 'All',
      vi: 'Vietnamese',
      en: 'English',
    },
  },
  view: {
    listTitle: (styleName: string, count: number) => `${styleName} CV templates (${count})`,
    defaultStyleName: 'Simple',
    freeAndAtsBadge: 'All templates are free and ATS-optimized',
    notFoundTitle: 'No matching CV template found',
    notFoundDesc: 'Try another style or industry, or clear the search keyword.',
    viewAllBtn: 'View all CV templates',
  },
  card: {
    hotBadge: 'Hot',
    atsBadge: 'ATS-ready',
    previewBtn: 'Preview',
    useTemplateBtn: 'Use template',
    usesCountSuffix: 'uses',
  },
  preview: {
    closeAria: 'Close preview',
    zoomOutTitle: 'Zoom out',
    zoomInTitle: 'Zoom in',
    zoomResetTitle: 'Reset size',
    usesCountSuffix: 'uses',
    atsScoreLabel: 'ATS compatibility',
    atsScoreText:
      'This CV uses a standard heading hierarchy and balanced white space, optimized for error-free data extraction without table or font issues.',
    bestForLabel: 'Best for:',
    useThisCta: 'Use this template to create a CV',
    downloadPdfSuccess: 'Sample PDF downloaded successfully!',
    downloadPdfBtn: 'Download the sample as PDF',
    sections: {
      careerObjective: 'MỤC TIÊU NGHỀ NGHIỆP',
      careerObjectiveFull: 'Career objective',
      workExperience: 'KINH NGHIỆM LÀM VIỆC',
      workExperienceFull: 'Work experience',
      education: 'HỌC VẤN',
      educationFull: 'Education',
      contact: 'LIÊN HỆ',
      skills: 'KỸ NĂNG',
      skillsFull: 'Professional skills',
      languages: 'Languages',
      certifications: 'Certifications',
    },
  },
  stepGuide: {
    badge: 'A Simple and Fast CV Process',
    title: 'Create a free online CV in just 3 steps',
    description: 'Build an ATS-ready CV and land the job you want with InterVue.',
  },
  benefits: {
    badge: 'Key Advantages of Simple CV Templates',
    title: "Why choose InterVue's simple CV templates?",
    description:
      'A minimalist design does not mean a plain one. It is the standard recommended by top recruiters and international HR experts.',
  },
  faq: {
    badge: 'Frequently Asked Questions',
    title: 'Frequently asked questions about simple CV templates',
  },
};

import {
  CvTemplateItem,
  CvTemplateStyle,
  CvTemplateIndustry,
  CvTemplateColor,
  CvStepGuide,
  CvBenefitItem,
  CvFaqItem,
} from '@/types/cv-template';

export const CV_COLORS: CvTemplateColor[] = [
  { id: 'emerald', name: 'InterVue emerald', hex: '#00b14f' },
  { id: 'navy', name: 'Classic navy', hex: '#1e3a8a' },
  { id: 'purple', name: 'Modern purple', hex: '#7c3aed' },
  { id: 'orange', name: 'Energetic orange', hex: '#ea580c' },
  { id: 'red', name: 'Wine red', hex: '#be123c' },
  { id: 'slate', name: 'Elegant charcoal', hex: '#334155' },
  { id: 'teal', name: 'Teal', hex: '#0d9488' },
];

export const CV_STYLES: CvTemplateStyle[] = [
  { id: 'all', name: 'All', slug: 'all', count: 21 },
  {
    id: 'don-gian',
    name: 'Simple',
    slug: 'mau-don-gian',
    count: 8,
    description: 'A minimalist design focused on content and maximum readability.',
  },
  {
    id: 'chuyen-nghiep',
    name: 'Professional',
    slug: 'mau-chuyen-nghiep',
    count: 5,
    description: 'A standard layout suited to specialists and managers.',
  },
  {
    id: 'hien-dai',
    name: 'Modern',
    slug: 'mau-hien-dai',
    count: 4,
    description: 'Clean lines and refined colors for dynamic workplaces.',
  },
  {
    id: 'ats',
    name: 'ATS-ready',
    slug: 'mau-ats',
    count: 6,
    description: '100% optimized for the automatic resume scanners used by large corporations.',
  },
  {
    id: 'harvard',
    name: 'Harvard',
    slug: 'mau-harvard',
    count: 3,
    description: 'A renowned academic standard: no photo, no decoration, maximum information.',
  },
  {
    id: 'an-tuong',
    name: 'Impressive',
    slug: 'mau-an-tuong',
    count: 3,
    description: 'A strong visual accent, suited to Creative and Marketing roles.',
  },
];

export const CV_INDUSTRIES: CvTemplateIndustry[] = [
  { id: 'all', name: 'All industries', slug: 'all', count: 21 },
  { id: 'it', name: 'Information technology / IT', slug: 'it', count: 7 },
  { id: 'marketing', name: 'Marketing & Communications', slug: 'marketing', count: 6 },
  { id: 'sales', name: 'Business & Sales', slug: 'sales', count: 5 },
  { id: 'finance', name: 'Finance - Accounting', slug: 'finance', count: 4 },
  { id: 'hr', name: 'Administration - HR', slug: 'hr', count: 3 },
  { id: 'general', name: 'Fresher / New graduate', slug: 'fresher', count: 6 },
];

export const CV_TEMPLATES: CvTemplateItem[] = [
  {
    id: 'cv-don-gian-ats-standard',
    title: 'Simple ATS-Ready CV Template',
    slug: 'mau-cv-don-gian-chuan-ats',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/simple-ats.png',
    style: 'Simple',
    styleSlug: 'mau-don-gian',
    languages: ['Vietnamese', 'English'],
    industries: ['Information technology / IT', 'Finance - Accounting', 'Administration - HR'],
    availableColors: CV_COLORS,
    defaultColorHex: '#00b14f',
    usesCount: '182.4K',
    rating: 4.9,
    isHot: true,
    isAtsOptimized: true,
    recommendedFor: ['Any industry', 'Applying to corporations', 'Applying to foreign companies'],
    description:
      'A standard international one-column design optimized for ATS text parsing, highlighting achievements with impressive numbers.',
    sampleData: {
      name: 'NGUYỄN VĂN AN',
      title: 'Senior Software Engineer / Fullstack Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      email: 'nguyenvanan.dev@intervue.vn',
      phone: '0912 345 678',
      address: 'Cau Giay, Hanoi',
      summary:
        'Software engineer with 4+ years of experience building large-scale web systems with Next.js, Node.js and Go. Strong in database performance tuning and designing Microservices architecture that handles 50,000 CCU.',
      experience: [
        {
          role: 'Senior Fullstack Engineer',
          company: 'FPT Software & Cloud Solutions',
          period: '03/2023 - Present',
          highlights: [
            'Led the redesign and restructuring of the e-payment system, cutting transaction processing time from 1.2s to 350ms.',
            'Built an automated CI/CD pipeline, increasing deployment frequency to 4 times per week with 99.98% uptime.',
            'Mentored and directly trained 5 Fresher engineers to join the project within 2 months.',
          ],
        },
        {
          role: 'Fullstack Developer',
          company: 'TechCorp Digital Agency',
          period: '08/2021 - 02/2023',
          highlights: [
            'Developed 12+ multi-channel e-commerce projects using React, Next.js and Tailwind CSS.',
            'Improved Google Core Web Vitals scores from 62 to 96/100, directly increasing the conversion rate by 34%.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Computer Science (Honors)',
          school: 'Hanoi University of Science and Technology',
          period: '2017 - 2021',
          gpa: 'GPA: 3.65 / 4.0',
        },
      ],
      skills: [
        'JavaScript / TypeScript',
        'React & Next.js',
        'Node.js & Go',
        'PostgreSQL & MongoDB',
        'Docker & Kubernetes',
        'Problem solving',
      ],
      languages: ['Vietnamese (Native)', 'English (IELTS 7.5)'],
      certifications: ['AWS Certified Solutions Architect (Associate)', 'Scrum Master Professional (PSM I)'],
    },
  },
  {
    id: 'cv-don-gian-minimalist',
    title: 'Minimalist Clean CV Template',
    slug: 'mau-cv-minimalist-clean',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/clean-minimal.png',
    style: 'Simple',
    styleSlug: 'mau-don-gian',
    languages: ['Vietnamese', 'English'],
    industries: ['Marketing & Communications', 'Business & Sales', 'Fresher / New graduate'],
    availableColors: CV_COLORS,
    defaultColorHex: '#1e3a8a',
    usesCount: '135.8K',
    rating: 4.85,
    isHot: true,
    isAtsOptimized: true,
    recommendedFor: ['Marketing', 'Communications', 'Recent graduates'],
    description:
      'A light layout with generous margins that lets recruiters grasp your information within the first 6 seconds.',
    sampleData: {
      name: 'TRẦN THU TRANG',
      title: 'Digital Marketing & Content Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      email: 'thutrang.mkt@intervue.vn',
      phone: '0988 765 432',
      address: 'District 1, Ho Chi Minh City',
      summary:
        'Marketing specialist with 3 years of experience in Digital & Social Media. Directly managed an ad budget of over 500 million VND per month and grew fanpage followers by 250% in 6 months.',
      experience: [
        {
          role: 'Digital Marketing Specialist',
          company: 'Shopee Vietnam',
          period: '01/2023 - Present',
          highlights: [
            'Planned content and ran Social Media Mega Sale 9.9 and 11.11 campaigns with over 15 million impressions.',
            'Reduced ad CPA by 22% through continuous A/B testing of creative messaging.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Marketing Management',
          school: 'University of Economics Ho Chi Minh City (UEH)',
          period: '2019 - 2023',
          gpa: 'GPA: 3.5 / 4.0',
        },
      ],
      skills: [
        'Social Media Marketing',
        'Copywriting & Scripts',
        'Google Analytics 4',
        'Meta & TikTok Ads',
        'Canva & CapCut',
      ],
      languages: ['Vietnamese (Native)', 'English (TOEIC 850)'],
    },
  },
  {
    id: 'cv-don-gian-harvard',
    title: 'Harvard Classic CV Template',
    slug: 'mau-cv-harvard-classic',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/harvard-style.png',
    style: 'Simple',
    styleSlug: 'mau-don-gian',
    languages: ['English', 'Vietnamese'],
    industries: ['Finance - Accounting', 'Administration - HR', 'Information technology / IT'],
    availableColors: CV_COLORS,
    defaultColorHex: '#334155',
    usesCount: '112.1K',
    rating: 4.92,
    isAtsOptimized: true,
    recommendedFor: ['Finance professionals', 'Investment banking', 'Big4 audit', 'Academics / Researchers'],
    description:
      'A classic academic format from Harvard. No photo, no extra icons, fully focused on achievements and quantified results.',
    sampleData: {
      name: 'LÊ HOÀNG NAM',
      title: 'Senior Financial Analyst / CFA Level II Candidate',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      email: 'nam.lehoang@intervue.vn',
      phone: '0903 112 233',
      address: 'Hoan Kiem, Hanoi',
      summary:
        'Corporate financial analyst with 5 years of experience in M&A due diligence and financial modeling for leading banks.',
      experience: [
        {
          role: 'Senior Financial Analyst',
          company: 'Techcom Securities (TCBS)',
          period: '05/2022 - Present',
          highlights: [
            'Built DCF models and valued assets for 8 corporate bond issuances totaling 4,200 billion VND.',
            'Prepared quarterly cash flow forecasts with over 95% accuracy against actual audit results.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Finance - Banking (Valedictorian)',
          school: 'Foreign Trade University Hanoi (FTU)',
          period: '2016 - 2020',
          gpa: 'GPA: 3.82 / 4.0',
        },
      ],
      skills: [
        'Financial Modeling (DCF/LBO)',
        'Risk assessment',
        'Financial statement analysis',
        'Excel VBA & Python',
        'Power BI',
      ],
      certifications: ['CFA Level II Candidate', 'FMVA Financial Modeling Certification'],
    },
  },
  {
    id: 'cv-don-gian-cot-doi',
    title: 'Modern Two-Column CV Template',
    slug: 'mau-cv-tinh-te-cot-doi',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/two-column.png',
    style: 'Simple',
    styleSlug: 'mau-don-gian',
    languages: ['Vietnamese', 'English'],
    industries: ['Business & Sales', 'Marketing & Communications', 'Administration - HR'],
    availableColors: CV_COLORS,
    defaultColorHex: '#7c3aed',
    usesCount: '98.5K',
    rating: 4.88,
    isAtsOptimized: true,
    recommendedFor: ['Sales staff', 'Recruiters', 'Office administration'],
    description:
      'A two-column layout that neatly separates personal information and skills from work experience, fitting the whole CV on one page.',
    sampleData: {
      name: 'VŨ THỊ HƯƠNG',
      title: 'Human Resources & Talent Acquisition Specialist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      email: 'huong.vu@intervue.vn',
      phone: '0977 889 900',
      address: 'Dong Da, Hanoi',
      summary:
        'HR & Recruitment specialist with 3 years of experience in the technology industry (Tech HR). Successfully hired 150+ IT staff from Fresher to Tech Lead.',
      experience: [
        {
          role: 'Talent Acquisition Specialist',
          company: 'VNG Corporation',
          period: '02/2023 - Present',
          highlights: [
            'Reduced the average time-to-hire for a position from 35 days to 21 days.',
            'Built a Talent Pool of over 3,000 high-quality technology candidates.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Human Resource Management',
          school: 'National Economics University (NEU)',
          period: '2019 - 2023',
        },
      ],
      skills: [
        'Headhunting & Sourcing',
        'Behavioral interviews (STAR)',
        'Onboarding process',
        'Vietnamese labor law',
        'ATS systems',
      ],
    },
  },
  {
    id: 'cv-don-gian-fresher',
    title: 'Starter CV Template for Freshers',
    slug: 'mau-cv-khoi-dau-fresher',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/fresher-start.png',
    style: 'Simple',
    styleSlug: 'mau-don-gian',
    languages: ['Vietnamese', 'English'],
    industries: ['Fresher / New graduate', 'Business & Sales', 'Marketing & Communications'],
    availableColors: CV_COLORS,
    defaultColorHex: '#ea580c',
    usesCount: '124.9K',
    rating: 4.87,
    isHot: true,
    isAtsOptimized: true,
    recommendedFor: ['Final-year students', 'Interns', 'Career changers'],
    description:
      'A smart design that highlights extracurricular activities, soft skills, personal projects and eagerness to learn for candidates with limited experience.',
    sampleData: {
      name: 'PHẠM MINH DƯƠNG',
      title: 'Business Development & B2B Sales Associate (Fresher)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      email: 'duong.pham@intervue.vn',
      phone: '0919 223 344',
      address: 'Binh Thanh, Ho Chi Minh City',
      summary:
        'Energetic International Trade graduate passionate about B2B business development. Excelled in corporate case competitions and has sales internship experience.',
      experience: [
        {
          role: 'Business Development Intern',
          company: 'TopCV Vietnam',
          period: '06/2023 - 12/2023',
          highlights: [
            'Helped connect with 80+ SME business customers, contributing to 110% of the team KPI target.',
            'Surveyed and collected customer feedback to improve the renewal rate of recruitment service contracts.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of International Business',
          school: 'Foreign Trade University Campus 2 (FTU2)',
          period: '2020 - 2024',
          gpa: 'GPA: 3.42 / 4.0',
        },
      ],
      skills: [
        'Communication & Negotiation',
        'Cold calling skills',
        'Public speaking',
        'Using HubSpot CRM',
        'Fluent English',
      ],
    },
  },
  {
    id: 'cv-don-gian-line-accent',
    title: 'Minimalist Line-Accent CV Template',
    slug: 'mau-cv-toi-gian-line-accent',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/line-accent.png',
    style: 'Simple',
    styleSlug: 'mau-don-gian',
    languages: ['Vietnamese', 'English'],
    industries: ['Information technology / IT', 'Engineering'],
    availableColors: CV_COLORS,
    defaultColorHex: '#0d9488',
    usesCount: '78.2K',
    rating: 4.82,
    isAtsOptimized: true,
    recommendedFor: ['Engineers', 'Data Analyst', 'Product Manager'],
    description:
      'Thin line accents separate sections cleanly, leaving room for detailed technical projects and a list of mastered technologies.',
    sampleData: {
      name: 'HOÀNG VĂN KHÁNH',
      title: 'Data Analyst & Business Intelligence Specialist',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
      email: 'khanh.data@intervue.vn',
      phone: '0966 333 444',
      address: 'Nam Tu Liem, Hanoi',
      summary:
        'Data analyst with 3 years of experience in Retail and Fintech. Skilled at building automated Power BI dashboards and extracting data with SQL.',
      experience: [
        {
          role: 'Data Analyst',
          company: 'Masan Group Retail Division',
          period: '04/2022 - Present',
          highlights: [
            'Built a system of 15 dashboards monitoring WinMart chain revenue in real time.',
            'Analyzed shopping basket behavior and proposed a cross-sell strategy that raised order value by 14%.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Management Information Systems',
          school: 'National Economics University (NEU)',
          period: '2018 - 2022',
        },
      ],
      skills: ['SQL (Postgres, MySQL)', 'Power BI & Tableau', 'Python (Pandas, Numpy)', 'ETL Pipeline', 'A/B Testing'],
    },
  },
  {
    id: 'cv-chuyen-nghiep-corporate',
    title: 'Corporate Professional CV Template',
    slug: 'mau-cv-corporate-professional',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/corporate-pro.png',
    style: 'Professional',
    styleSlug: 'mau-chuyen-nghiep',
    languages: ['Vietnamese', 'English'],
    industries: ['Finance - Accounting', 'Business & Sales'],
    availableColors: CV_COLORS,
    defaultColorHex: '#1e3a8a',
    usesCount: '142.0K',
    rating: 4.9,
    recommendedFor: ['Department heads', 'Branch directors', 'Senior specialists'],
    description:
      'A confident, dignified look for candidates applying for management roles or multinational corporations.',
    sampleData: {
      name: 'DANG THI MAI',
      title: 'Accounting Manager / Chief Accountant',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      email: 'mai.dang@intervue.vn',
      phone: '0909 555 666',
      address: 'District 3, Ho Chi Minh City',
      summary:
        'Chief accountant with 7+ years of experience managing accounting books, tax finalization and IFRS financial reporting.',
      experience: [
        {
          role: 'Chief Accountant',
          company: 'An Phong Construction Corp',
          period: '2020 - Present',
          highlights: [
            'Managed a 12-person accounting department, optimizing operating costs and legally recovering over 2.4 billion VND in tax refunds.',
          ],
        },
      ],
      education: [
        {
          degree: 'Master of Accounting - Auditing',
          school: 'University of Economics Ho Chi Minh City',
          period: '2016 - 2018',
        },
      ],
      skills: ['MISA / SAP software', 'Tax finalization', 'VAS & IFRS accounting standards', 'Cash flow management'],
    },
  },
  {
    id: 'cv-hien-dai-creative',
    title: 'Bold Modern CV Template',
    slug: 'mau-cv-hien-dai-creative',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/creative-modern.png',
    style: 'Modern',
    styleSlug: 'mau-hien-dai',
    languages: ['Vietnamese', 'English'],
    industries: ['Marketing & Communications', 'Design & Graphics'],
    availableColors: CV_COLORS,
    defaultColorHex: '#be123c',
    usesCount: '89.6K',
    rating: 4.86,
    recommendedFor: ['UI/UX Designer', 'Content Creator', 'Art Director'],
    description:
      'A distinctive layout with modern shape composition that makes you stand out among hundreds of candidates.',
    sampleData: {
      name: 'NGUYỄN MINH TRIẾT',
      title: 'Senior UI/UX & Product Designer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      email: 'triet.design@intervue.vn',
      phone: '0944 666 777',
      address: 'Phu Nhuan, Ho Chi Minh City',
      summary:
        'Digital product designer with 5 years of experience. Passionate about building Design Systems and creating minimalist user experiences.',
      experience: [
        {
          role: 'Lead Product Designer',
          company: 'MoMo Fintech App',
          period: '2021 - Present',
          highlights: [
            'Redesigned the user money-transfer flow, cutting transaction completion time by 28% and raising NPS to 74 points.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Graphic Design',
          school: 'Ho Chi Minh City University of Architecture',
          period: '2016 - 2020',
        },
      ],
      skills: [
        'Figma Master',
        'Design System Architecture',
        'User Research & Wireframing',
        'Prototyping',
        'Design Sprint',
      ],
    },
  },
];

export const CV_BENEFITS: CvBenefitItem[] = [
  {
    icon: 'ShieldCheck',
    title: '100% optimized for ATS filters',
    description:
      'The text structure and heading hierarchy follow international standards so automatic recruiting software (ATS) can scan and extract information with 100% accuracy.',
  },
  {
    icon: 'Eye',
    title: 'Score points in the first 6 seconds',
    description:
      'A simple design removes every distraction and highlights experience and measurable achievements so recruiters grasp the key points at a glance.',
  },
  {
    icon: 'Sliders',
    title: 'Easy to customize and right for every level',
    description: 'Switch colors, fonts and layout with a single click. Suitable from new graduates to senior managers.',
  },
  {
    icon: 'FileCheck2',
    title: 'Print-quality, sharp PDF export',
    description:
      'Download high-resolution vector PDFs so text stays clear on every device and never blurs when printed.',
  },
];

export const CV_STEPS: CvStepGuide[] = [
  {
    step: 1,
    title: 'Choose the right CV template',
    description: 'Browse the template library by Simple, ATS-ready or Professional style to match your industry.',
  },
  {
    step: 2,
    title: 'Fill in details with AI suggestions',
    description:
      'Enter your experience and skills with InterVue AI suggesting industry keywords that match job requirements.',
  },
  {
    step: 3,
    title: 'Download the PDF and apply right away',
    description:
      'Preview in full screen, download a high-quality PDF or use it directly to apply to large corporations.',
  },
];

export const CV_FAQS: CvFaqItem[] = [
  {
    question: 'Why choose a simple CV template instead of an elaborate decorative one?',
    answer:
      'Real hiring studies show recruiters spend only 6 to 10 seconds skimming a CV. A simple CV with a clear hierarchy lets the eye scan skill keywords and achievement numbers quickly without being distracted by decoration. Simple templates are also the most compatible with automatic applicant tracking systems (ATS).',
  },
  {
    question: 'Is a simple CV template suitable for people with many years of experience?',
    answer:
      'Absolutely! Even senior roles such as Manager, Director, Chief Engineer or financial experts at large corporations (like the Harvard template) prefer a minimalist design so the page is devoted to major projects, budgets and growth metrics.',
  },
  {
    question: 'Can I change the language of a CV template?',
    answer:
      "Yes. You can freely switch the display language (Vietnamese, English) on the template page or in the editor to meet each employer's requirements.",
  },
  {
    question: 'Is it free to download a CV on InterVue?',
    answer:
      'All CV templates on the InterVue ecosystem are 100% free. You can create, edit and download PDF files an unlimited number of times.',
  },
];
