import { BlogCategoryMeta, BlogCategorySlug, BlogArticle } from '@/types/blog';
import { CAREER_ARTICLES } from './career-orientation.mock';

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    id: 'orientation',
    name: 'Career orientation',
    slug: 'dinh-huong-nghe-nghiep',
    shortDesc: 'Discover your potential, find your passion and a clear career development path.',
    description:
      'A complete career development guide: understand yourself with the Ikigai model, choose a career that fits 2026 hiring trends and build a sustainable promotion path.',
    iconName: 'Compass',
    badge: 'Shaping the future',
    articleCount: 6,
    subFilters: [
      'All',
      'Self-discovery (Ikigai)',
      'Choosing a career',
      'Promotion roadmap',
      'New graduates',
      'Career change (Pivot)',
    ],
    bannerGradient: 'from-emerald-600 via-teal-600 to-emerald-800',
    accentColor: '#00b14f',
  },
  {
    id: 'tips',
    name: 'Job search tips',
    slug: 'bi-kip-tim-viec',
    shortDesc: 'How to write ATS-ready CVs, ace interviews and negotiate a breakthrough salary.',
    description:
      'A hands-on A-Z guide to winning recruiters: optimize your CV to pass ATS filters in 6 seconds, scripts for 50+ tough interview questions and the art of negotiating a salary 20-30% higher.',
    iconName: 'Briefcase',
    badge: 'Winning recruiters',
    articleCount: 6,
    subFilters: [
      'All',
      'Writing ATS-ready CVs',
      'Interview skills',
      'Salary negotiation',
      'Passing the probation period',
      'Thank-you letter',
    ],
    bannerGradient: 'from-blue-600 via-indigo-600 to-blue-800',
    accentColor: '#2563eb',
  },
  {
    id: 'salary',
    name: 'Salary and benefits',
    slug: 'che-do-luong-thuong',
    shortDesc: 'Gross to Net conversion, social insurance, KPI bonuses and employee rights.',
    description:
      'Understand your financial and legal rights under the latest Labor Code: a Gross to Net salary calculator compliant with social insurance rules (SI, HI, UI), progressive personal income tax rates and how the 13th-month bonus is calculated.',
    iconName: 'Calculator',
    badge: 'Transparent benefits',
    articleCount: 6,
    subFilters: [
      'All',
      'Gross to Net conversion',
      'Social & health insurance',
      '13th-month salary & Tet bonus',
      'Personal income tax & deductions',
      'Overtime (OT) pay',
      'Severance allowance',
    ],
    bannerGradient: 'from-amber-600 via-orange-600 to-amber-800',
    accentColor: '#ea580c',
  },
  {
    id: 'skills',
    name: 'Industry knowledge',
    slug: 'kien-thuc-chuyen-nganh',
    shortDesc:
      'A library of practical professional knowledge, terminology and trends in IT, Marketing, Sales and Logistics.',
    description:
      'Deepen your hands-on expertise and keep up with 2026 labor market trends: in-depth analysis of Marketing, Information Technology / AI, Logistics, Banking & Finance and HR management.',
    iconName: 'GraduationCap',
    badge: 'Build expertise',
    articleCount: 6,
    subFilters: [
      'All',
      'Information technology / AI',
      'Marketing & Digital Communications',
      'Business & Sales',
      'Finance & Accounting',
      'Logistics & Import-Export',
      'HR (C&B, Recruitment)',
    ],
    bannerGradient: 'from-violet-600 via-purple-600 to-violet-800',
    accentColor: '#7c3aed',
  },
];

export const ADDITIONAL_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'art-cv-ats-2026',
    slug: 'bi-quyet-viet-cv-chuan-ats-chinh-phuc-nha-tuyen-dung-2026',
    title: 'The complete guide to writing a professional ATS-ready CV that wins recruiters in 2026',
    category: 'Job search tips',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'Over 75% of CVs are rejected before reaching HR by applicant tracking systems (ATS). Learn how to structure a standard CV, insert industry keywords and present achievements with the impressive STAR model.',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    publishedAt: '03/10/2026',
    readTime: '9 min read',
    viewsCount: '41.8K',
    isFeatured: true,
    isTrending: true,
    tags: ['Writing a CV', 'ATS-ready', 'Job search tips', 'STAR model', 'Job application'],
    author: {
      name: 'Nguyen Thanh Tung',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Head of Talent Acquisition @ InterVue',
      bio: '12+ years of interviewing and evaluating more than 20,000 senior candidate profiles at technology corporations.',
    },
    tableOfContents: [
      { id: 'he-thong-ats-la-gi', title: '1. What is an ATS and how does it work?', level: 1 },
      { id: '5-sai-lam-khien-cv-bi-loai', title: '2. 5 common mistakes that get a CV rejected immediately', level: 1 },
      {
        id: 'cong-thuc-star-viet-kinh-nghiem',
        title: '3. The STAR formula for impressive experience sections',
        level: 1,
      },
      { id: 'tu-khoa-ats-theo-nganh', title: '4. How to find and insert the right ATS keywords', level: 1 },
      { id: 'checklist-ho-so-truoc-khi-nop', title: '5. A 7-step checklist before submitting your CV', level: 1 },
    ],
    sections: [
      {
        id: 'he-thong-ats-la-gi',
        title: '1. What is an ATS and how does it work?',
        leadText:
          'An ATS (Applicant Tracking System) is software that automatically scans and ranks candidate profiles based on keywords, text format and hiring criteria before an HR specialist reads them directly.',
        paragraphs: [
          'At medium and large companies, each open position can receive 100 to 500 CVs within a week. The ATS acts as a gatekeeper, parsing text to extract information about education, core skills and relevant experience.',
          'If the file format is complex (nested tables, images containing text or unusual icons), the ATS may not read the data, giving your CV a low match score even when your real ability is excellent.',
        ],
        highlights: [
          'Best formats: standard PDF or Word (.docx), with a clear font such as Arial, Inter or Calibri at 10 - 12pt.',
          'Use a professional file name: [Position]_[Full name]_[CV].pdf.',
        ],
      },
      {
        id: '5-sai-lam-khien-cv-bi-loai',
        title: '2. 5 common mistakes that get a CV rejected immediately',
        paragraphs: [
          'The first mistake is using percentage skill bars (for example Photoshop 80%, Communication 90%). An ATS cannot interpret these graphics and recruiters see them as subjective ratings with no basis.',
          'The second mistake is listing generic duties instead of results. Instead of "Managed the fanpage", write "Grew organic engagement by 45% and brought in 120 leads per month".',
        ],
      },
      {
        id: 'cong-thuc-star-viet-kinh-nghiem',
        title: '3. The STAR formula for impressive experience sections',
        paragraphs: [
          'The STAR model consists of: Situation (context) - Task (your assignment) - Action (what you did) - Result (a result with specific measurable numbers).',
          'A real example: "With ad costs up 30% (S), I was assigned to optimize the website conversion rate (T). I redesigned the checkout flow and A/B tested 12 landing page templates (A), raising the close rate from 2.1% to 4.3% and saving 80 million VND in monthly ad spend (R)".',
        ],
      },
      {
        id: 'tu-khoa-ats-theo-nganh',
        title: '4. How to find and insert the right ATS keywords',
        paragraphs: [
          'Read 3 - 5 job descriptions (JD) for your target role carefully. Underline the noun phrases for skills, software tools and certifications that appear often (for example Google Analytics, SQL, Agile/Scrum, Figma).',
          'Insert these keywords naturally into your Career summary, Skills and project descriptions.',
        ],
      },
      {
        id: 'checklist-ho-so-truoc-khi-nop',
        title: '5. A 7-step checklist before submitting your CV',
        paragraphs: [
          '1. Check spelling and grammar so there are absolutely no errors.',
          '2. Your phone number and personal email work, and the email looks professional.',
          '3. Your LinkedIn or Portfolio link works with no 404 errors.',
          '4. Keep the CV to 1 or 2 pages.',
        ],
      },
    ],
  },
  {
    id: 'art-interview-questions-2026',
    slug: 'top-15-cau-hoi-phong-van-thuong-gap-nhat-va-cach-tra-loi',
    title: 'Top 15 most common interview questions and smart answer scripts that score highly',
    category: 'Job search tips',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'A roundup of 15 classic interview questions from "Tell me about yourself" and "What is your biggest weakness?" to "Why should we hire you?", with an analysis of the recruiter\'s mindset and sample answers.',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    publishedAt: '28/09/2026',
    readTime: '11 min read',
    viewsCount: '58.2K',
    isFeatured: true,
    tags: ['Interview skills', 'Interview questions', 'Communication & etiquette', 'Recruiters', 'Job search tips'],
    author: {
      name: 'Tran Bich Phuong',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      role: 'Career Coach & HR Consultant',
    },
    tableOfContents: [
      {
        id: 'gioi-thieu-ban-than-2-phut',
        title: '1. How to introduce yourself in 2 minutes (Past-Present-Future model)',
        level: 1,
      },
      {
        id: 'cach-tra-loi-diem-yeu',
        title: '2. How to answer "What is your biggest weakness?" tactfully',
        level: 1,
      },
      {
        id: 'tai-sao-nghi-viec-cong-ty-cu',
        title: '3. How to explain why you left your last company without complaining',
        level: 1,
      },
      {
        id: '5-cau-hoi-thong-minh-hoi-lai-hr',
        title: '4. 5 smart questions candidates should ask the recruiter at the end',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'gioi-thieu-ban-than-2-phut',
        title: '1. How to introduce yourself in 2 minutes (Past-Present-Future model)',
        leadText:
          'Do not recite your whole CV! Recruiters want a short story of where you are now, your most notable past achievements and why you want to join the company in the future.',
        paragraphs: [
          'Present: summarize your current professional position, years of experience and strengths.',
          'Past: 1 to 2 of your most notable achievements that prove real ability.',
          'Future: why your next development goal fits the direction of the company you are applying to.',
        ],
      },
      {
        id: 'cach-tra-loi-diem-yeu',
        title: '2. How to answer "What is your biggest weakness?" tactfully',
        paragraphs: [
          'Avoid clichéd answers such as: "My weakness is being a perfectionist" or "I am a workaholic".',
          'The right way: choose a secondary skill that does not directly affect the core ability for the role, admit it sincerely and state the specific steps you are taking to improve it.',
        ],
      },
      {
        id: 'tai-sao-nghi-viec-cong-ty-cu',
        title: '3. How to explain why you left your last company without complaining',
        paragraphs: [
          'Golden rule: never speak badly about your former boss, colleagues or company culture.',
          'Focus on your need for new challenges, your wish to take on bigger projects and an environment that fits your long-term promotion goals.',
        ],
      },
      {
        id: '5-cau-hoi-thong-minh-hoi-lai-hr',
        title: '4. 5 smart questions candidates should ask the recruiter at the end',
        paragraphs: [
          '1. "What does a typical day in this role look like?"',
          '2. "What is the most important goal leadership expects the person in this role to achieve in the first 3 months?"',
          '3. "What do you see as the biggest challenge the current team is facing?"',
          '4. "How is the performance review process (KPI/OKR) carried out at the company?"',
        ],
      },
    ],
  },
  {
    id: 'art-salary-negotiation-offer',
    slug: 'nghe-thuat-dam-phan-luong-khi-nhan-offer-tang-20-30-phan-tram',
    title: 'The art of salary negotiation when you receive an offer: how to get 20-30% more without upsetting anyone',
    category: 'Job search tips',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'Salary negotiation is not haggling, it is a discussion based on the value you bring to the company. Discover 6 principles for negotiating a total package (base salary, bonus, benefits) from HR experts.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    publishedAt: '22/09/2026',
    readTime: '10 min read',
    viewsCount: '34.7K',
    tags: ['Salary negotiation', 'Job Offer', 'Market salary', 'Job search tips', 'Income'],
    author: {
      name: 'Vu Minh Duc',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      role: 'Senior Executive Recruiter',
    },
    tableOfContents: [
      { id: 'thoi-diem-vang-dam-phan-luong', title: '1. The golden moment to start negotiating salary', level: 1 },
      {
        id: 'nghien-cuu-dai-luong-thi-truong',
        title: '2. How to research the market salary range accurately',
        level: 1,
      },
      { id: 'nguyen-tac-dam-phan-tong-the', title: '3. Negotiating the total compensation package', level: 1 },
      {
        id: 'kich-ban-email-phan-hoi-offer',
        title: '4. A professional email template for responding to an offer',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'thoi-diem-vang-dam-phan-luong',
        title: '1. The golden moment to start negotiating salary',
        paragraphs: [
          'Your negotiating leverage is highest when the recruiter has officially sent the job offer. By then they have chosen you as the number 1 candidate and have spent time and money finding you.',
          'If asked for your expected salary in the first round, give a flexible range based on market data instead of a rigid figure.',
        ],
      },
      {
        id: 'nghien-cuu-dai-luong-thi-truong',
        title: '2. How to research the market salary range accurately',
        paragraphs: [
          'Use the InterVue recruitment market report, Navigos and expert networks to learn the median (P50) and competitive (P75) salary ranges for the position you are applying for.',
        ],
      },
      {
        id: 'nguyen-tac-dam-phan-tong-the',
        title: '3. Negotiating the total compensation package',
        paragraphs: [
          'If the company is limited on base salary by its pay grades, propose negotiating other benefits: performance bonus (KPI/Bonus), a personal computer allowance, annual leave days, or a pay review after 6 months instead of 1 year.',
        ],
      },
      {
        id: 'kich-ban-email-phan-hoi-offer',
        title: '4. A professional email template for responding to an offer',
        paragraphs: [
          'Express gratitude for the offer, reaffirm your excitement about the role, then politely present your proposed adjustment based on your contribution value and the market salary range.',
        ],
      },
    ],
  },
  {
    id: 'art-probation-success-guide',
    slug: 'cam-nang-60-ngay-thu-viec-hoa-nhap-nhanh-chinh-thuc',
    title: 'The 60-day probation guide: how to settle in fast and sign a permanent contract with an excellent review',
    category: 'Job search tips',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'The probation period is a test of real ability and cultural fit. Explore a 30-60 day plan that helps you score highly with your manager and colleagues.',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    publishedAt: '15/09/2026',
    readTime: '8 min read',
    viewsCount: '21.5K',
    tags: ['Probation', 'Signing a contract', 'Office culture', 'Career development'],
    author: {
      name: 'Tran Bich Phuong',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      role: 'Career Coach & HR Consultant',
    },
    tableOfContents: [
      { id: '30-ngay-dau-tien', title: '1. The first 30 days: listen, learn and understand the processes', level: 1 },
      {
        id: '30-ngay-tiep-theo',
        title: '2. The next 30 days: proactively propose solutions and create a Quick Win',
        level: 1,
      },
      {
        id: 'chuan-bi-buoi-review-thu-viec',
        title: '3. Preparing for the probation review',
        level: 1,
      },
    ],
    sections: [
      {
        id: '30-ngay-dau-tien',
        title: '1. The first 30 days: listen, learn and understand the processes',
        paragraphs: [
          'The biggest goal in the first month is to master the workflow, understand the roles of related teams and proactively ask questions when you are stuck.',
        ],
      },
      {
        id: '30-ngay-tiep-theo',
        title: '2. The next 30 days: proactively propose solutions and create a Quick Win',
        paragraphs: [
          'Find a small problem you can solve quickly (a Quick win) to show responsibility and initiative at work.',
        ],
      },
      {
        id: 'chuan-bi-buoi-review-thu-viec',
        title: '3. Preparing for the probation review',
        paragraphs: [
          'Prepare a short report on the results achieved against the original goals, lessons learned and your contribution plan for the next 6 months.',
        ],
      },
    ],
  },

  {
    id: 'art-gross-net-guide-2026',
    slug: 'cach-tinh-luong-gross-sang-net-chuan-quy-dinh-moi-2026',
    title: 'How to calculate and convert Gross to Net salary under 2026 insurance rules and personal income tax rates',
    category: 'Salary and benefits',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'A clear distinction between Gross and Net salary. A detailed guide to the deduction formulas for social insurance 8%, health insurance 1.5%, unemployment insurance 1%, the 11 million VND personal deduction and the latest progressive tax bracket table.',
    coverImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
    publishedAt: '04/10/2026',
    readTime: '13 min read',
    viewsCount: '65.9K',
    isFeatured: true,
    isTrending: true,
    tags: ['Gross Net salary', 'Salary calculation', 'BHXH', 'Personal income tax', 'Salary and benefits', 'Labor law'],
    author: {
      name: 'Le Hoang Hai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'C&B Expert & Labor Law Consultant',
      bio: '15+ years in charge of payroll systems and HR benefit policy at multinational corporations.',
    },
    tableOfContents: [
      { id: 'luong-gross-la-gi-luong-net-la-gi', title: '1. What is Gross salary? What is Net salary?', level: 1 },
      { id: 'ty-le-dong-bao-hiem-2026', title: '2. Mandatory social insurance contribution rates in 2026', level: 1 },
      {
        id: 'giam-tru-gia-canh-thue-tncn',
        title: '3. Personal deductions and how to calculate personal income tax',
        level: 1,
      },
      {
        id: 'bieu-thue-luy-tien-7-bac',
        title: '4. The detailed 7-bracket progressive personal income tax table',
        level: 1,
      },
      {
        id: 'vi-du-tinh-luong-thuc-te',
        title: '5. A real example: converting a 25 million VND Gross salary to Net',
        level: 1,
      },
      { id: 'nen-deal-gross-hay-net', title: '6. Should employees negotiate Gross or Net salary?', level: 1 },
    ],
    sections: [
      {
        id: 'luong-gross-la-gi-luong-net-la-gi',
        title: '1. What is Gross salary? What is Net salary?',
        leadText:
          'Gross salary is your total income before mandatory insurance and personal income tax are deducted. Net salary is the amount actually deposited in your bank account each pay period.',
        paragraphs: [
          'Basic formula: Net salary = Gross salary - (SI + HI + UI) - Personal income tax (if any).',
          'Many candidates wonder during interviews whether to agree on Gross or Net salary. Knowing how to convert them helps you protect your rights when paying insurance and receiving benefits later.',
        ],
        highlights: [
          'Gross salary is more transparent because it shows the actual insurance salary base and the basis for maternity, unemployment and sickness benefits.',
          'Net salary gives peace of mind about your monthly spending cash flow but you need to check carefully what salary base the company pays insurance on.',
        ],
      },
      {
        id: 'ty-le-dong-bao-hiem-2026',
        title: '2. Mandatory social insurance contribution rates in 2026',
        paragraphs: [
          'Employees contribute a total of 10.5% of their monthly Gross salary:',
          '- Social insurance (SI): 8%',
          '- Health insurance (HI): 1.5%',
          '- Unemployment insurance (UI): 1%',
          'The employer (company) also pays an additional 21.5% - 22% on your payroll (17.5% SI, 3% HI, 1% UI, 0.5% occupational accident insurance).',
        ],
      },
      {
        id: 'giam-tru-gia-canh-thue-tncn',
        title: '3. Personal deductions and how to calculate personal income tax',
        paragraphs: [
          'Under current regulations:',
          '- Personal deduction for the taxpayer: 11,000,000 VND/month (132 million VND/year).',
          '- Deduction per dependent: 4,400,000 VND/person/month.',
          'Taxable income = Pre-tax income - Insurance contributions - Personal deduction - Dependent deductions.',
        ],
      },
      {
        id: 'bieu-thue-luy-tien-7-bac',
        title: '4. The detailed 7-bracket progressive personal income tax table',
        paragraphs: [
          'Bracket 1: Up to 5 million VND -> Tax rate 5%',
          'Bracket 2: Over 5 million to 10 million VND -> Tax rate 10%',
          'Bracket 3: Over 10 million to 18 million VND -> Tax rate 15%',
          'Bracket 4: Over 18 million to 32 million VND -> Tax rate 20%',
          'Bracket 5: Over 32 million to 52 million VND -> Tax rate 25%',
          'Bracket 6: Over 52 million to 80 million VND -> Tax rate 30%',
          'Bracket 7: Over 80 million VND -> Tax rate 35%',
        ],
      },
      {
        id: 'vi-du-tinh-luong-thuc-te',
        title: '5. A real example: converting a 25 million VND Gross salary to Net',
        paragraphs: [
          'Suppose your Gross salary is 25,000,000 VND/month with 1 dependent:',
          '1. Total insurance contribution (10.5%): 25,000,000 x 10.5% = 2,625,000 VND.',
          '2. Pre-tax income: 25,000,000 - 2,625,000 = 22,375,000 VND.',
          '3. Total personal deductions: 11,000,000 (yourself) + 4,400,000 (1 dependent) = 15,400,000 VND.',
          '4. Taxable income: 22,375,000 - 15,400,000 = 6,975,000 VND.',
          '5. Personal income tax: Bracket 1 (5 million x 5% = 250,000) + Bracket 2 (1,975,000 x 10% = 197,500) = 447,500 VND.',
          '6. Actual Net salary: 25,000,000 - 2,625,000 - 447,500 = 21,927,500 VND.',
        ],
      },
      {
        id: 'nen-deal-gross-hay-net',
        title: '6. Should employees negotiate Gross or Net salary?',
        paragraphs: [
          'Expert recommendation: negotiate Gross salary. When you agree on Gross, you know the real insurance salary base. If tax law or deduction policy changes, you keep the full benefit instead of the company keeping the difference.',
        ],
      },
    ],
  },
  {
    id: 'art-bhxh-guide-2026',
    slug: 'quy-dinh-bao-hiem-xa-hoi-bhxh-nguoi-lao-dong-can-biet-2026',
    title: 'A complete guide to Social Insurance (SI) in 2026 that every employee must know',
    category: 'Salary and benefits',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'Detailed rules on the 5 mandatory SI benefits: sickness, maternity, occupational accidents, retirement and survivorship. How to check your contribution history on the VssID app and the conditions for withdrawing SI in one lump sum.',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    publishedAt: '27/09/2026',
    readTime: '12 min read',
    viewsCount: '48.3K',
    tags: ['Social insurance', 'BHXH', 'Maternity benefits', 'VssID app', 'Employee rights'],
    author: {
      name: 'Le Hoang Hai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'C&B Expert & Labor Law Consultant',
    },
    tableOfContents: [
      { id: 'cac-che-do-bhxh-chinh', title: '1. The 5 core SI benefits that protect employees', level: 1 },
      { id: 'che-do-thai-san-chi-tiet', title: '2. Maternity benefits for female and male employees', level: 1 },
      { id: 'tra-cuu-vssid', title: '3. How to install and check your SI contribution history on VssID', level: 1 },
      {
        id: 'dieu-kien-rut-bhxh-1-lan',
        title: '4. Conditions for one-time SI withdrawal and advice to consider',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'cac-che-do-bhxh-chinh',
        title: '1. The 5 core SI benefits that protect employees',
        paragraphs: [
          'Social insurance includes sickness benefits (75% of the insurance salary when on doctor-approved sick leave), maternity, occupational accident and disease, retirement and survivorship benefits.',
        ],
      },
      {
        id: 'che-do-thai-san-chi-tiet',
        title: '2. Maternity benefits for female and male employees',
        paragraphs: [
          'Female employees who give birth get 6 months of maternity leave and an allowance equal to 100% of the average monthly SI salary of the 6 months before leave, plus a one-time allowance equal to 2 months of base salary for each child.',
          'Male employees whose wives give birth are also entitled to 5 to 14 working days of leave with full insurance pay.',
        ],
      },
      {
        id: 'tra-cuu-vssid',
        title: '3. How to install and check your SI contribution history on VssID',
        paragraphs: [
          'The VssID app lets you check every month whether the company paid the right insurance amount on time, avoiding insurance arrears.',
        ],
      },
      {
        id: 'dieu-kien-rut-bhxh-1-lan',
        title: '4. Conditions for one-time SI withdrawal and advice to consider',
        paragraphs: [
          'Withdrawing SI in one lump sum should be a last resort in real financial hardship, because maintaining your contribution time secures your pension and free health insurance card in old age.',
        ],
      },
    ],
  },
  {
    id: 'art-13th-salary-tet-bonus',
    slug: 'luong-thang-13-va-thuong-tet-quy-dinh-phap-luat-va-thuc-te',
    title: '13th-month salary and Tet bonus: is the company required to pay under the Labor Code?',
    category: 'Salary and benefits',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'Is the 13th-month salary a mandatory benefit? The difference between the 13th-month salary and the Tet bonus under the Labor Code. Eligibility, calculation by seniority and personal income tax obligations.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    publishedAt: '18/09/2026',
    readTime: '9 min read',
    viewsCount: '37.4K',
    tags: ['13th-month salary', 'Tet bonus', 'Labor Code', 'Compensation'],
    author: {
      name: 'Le Hoang Hai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'C&B Expert & Labor Law Consultant',
    },
    tableOfContents: [
      { id: 'luong-thang-13-la-gi', title: '1. The concept of 13th-month salary under labor law', level: 1 },
      {
        id: 'doanh-nghiep-co-bat-buoc-tra',
        title: '2. Are companies required to pay the 13th-month salary?',
        level: 1,
      },
      {
        id: 'cach-tinh-theo-tham-nien',
        title: '3. How to calculate the 13th-month salary for staff with under 1 year of service',
        level: 1,
      },
      {
        id: 'thue-tncn-tien-thuong-tet',
        title: '4. Are the Tet bonus and 13th-month salary subject to personal income tax?',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'luong-thang-13-la-gi',
        title: '1. The concept of 13th-month salary under labor law',
        paragraphs: [
          'In the current Labor Code, the term "13th-month salary" is not defined separately but falls under "Bonus" in Article 104.',
        ],
      },
      {
        id: 'doanh-nghiep-co-bat-buoc-tra',
        title: '2. Are companies required to pay the 13th-month salary?',
        paragraphs: [
          "Payment depends on the company's internal bonus policy and the terms in the Labor Contract or Collective Labor Agreement. If the contract promises a 13th-month salary, the company must pay it.",
        ],
      },
      {
        id: 'cach-tinh-theo-tham-nien',
        title: '3. How to calculate the 13th-month salary for staff with under 1 year of service',
        paragraphs: ['Common formula: (Actual months worked / 12) x Average monthly salary.'],
      },
      {
        id: 'thue-tncn-tien-thuong-tet',
        title: '4. Are the Tet bonus and 13th-month salary subject to personal income tax?',
        paragraphs: [
          'The Tet bonus and 13th-month salary are income from wages, so they are still subject to personal income tax on the progressive scale in the month they are received.',
        ],
      },
    ],
  },
  {
    id: 'art-overtime-ot-calculation',
    slug: 'cach-tinh-tien-lam-them-gio-overtime-ot-chuan-luat',
    title: 'How to calculate overtime (OT) pay on weekdays, weekends and public holidays',
    category: 'Salary and benefits',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'Detailed rules on overtime pay: 150% on weekdays, 200% on weekly rest days and 300% on public holidays. How to calculate night overtime allowances and the maximum overtime hour limits.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    publishedAt: '12/09/2026',
    readTime: '8 min read',
    viewsCount: '19.8K',
    tags: ['Overtime', 'Calculating OT pay', 'Employee rights', 'Labor law'],
    author: {
      name: 'Le Hoang Hai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'C&B Expert & Labor Law Consultant',
    },
    tableOfContents: [
      { id: 'ty-le-tra-luong-ot', title: '1. Standard overtime pay percentages', level: 1 },
      { id: 'lam-them-ban-dem', title: '2. How to calculate night overtime (22:00 - 06:00)', level: 1 },
      { id: 'gioi-han-so-gio-ot', title: '3. Maximum overtime hours allowed by law', level: 1 },
    ],
    sections: [
      {
        id: 'ty-le-tra-luong-ot',
        title: '1. Standard overtime pay percentages',
        paragraphs: [
          '- Normal working days: at least 150% of the normal hourly wage.',
          '- Weekly rest days (Saturday, Sunday): at least 200%.',
          '- Public holidays, Tet and paid leave days: at least 300% (not counting the regular pay for that holiday).',
        ],
      },
      {
        id: 'lam-them-ban-dem',
        title: '2. How to calculate night overtime (22:00 - 06:00)',
        paragraphs: [
          'Night work is paid at least 30% more. For night overtime, employees also receive an additional 20% of the daytime wage rate.',
        ],
      },
      {
        id: 'gioi-han-so-gio-ot',
        title: '3. Maximum overtime hours allowed by law',
        paragraphs: [
          'No more than 50% of normal working hours in a day, no more than 40 hours in a month and no more than 200 hours in a year (up to 300 hours in some special industries).',
        ],
      },
    ],
  },

  {
    id: 'art-it-landscape-2026',
    slug: 'nganh-cong-nghe-thong-tin-it-la-gi-lo-trinh-developer',
    title: 'The big picture of IT & AI in 2026: from Developer to AI Engineer & Solution Architect',
    category: 'Industry knowledge',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'An in-depth analysis of the HOT specializations in tech: Frontend, Backend, DevOps, Data Science and AI/ML Engineering. Salary tables by years of experience and the technical promotion roadmap.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    publishedAt: '02/10/2026',
    readTime: '14 min read',
    viewsCount: '62.1K',
    isFeatured: true,
    isTrending: true,
    tags: ['Information technology', 'IT', 'Developers', 'AI Engineer', 'Solution Architect', 'IT salary'],
    author: {
      name: 'Nguyen Thanh Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      role: 'Principal Software Architect & Tech Mentor',
    },
    tableOfContents: [
      { id: 'cac-chuyen-nganh-it-hot-nhat', title: '1. The most in-demand IT specializations in 2026', level: 1 },
      {
        id: 'ky-nguyen-ai-developer-can-gi',
        title: '2. The Generative AI era: how should developers adapt?',
        level: 1,
      },
      { id: 'bang-luong-lap-trinh-vien', title: '3. Developer salary ranges by years of experience', level: 1 },
      {
        id: 'lo-trinh-tech-lead-architect',
        title: '4. The path from Junior to Tech Lead and Architect',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'cac-chuyen-nganh-it-hot-nhat',
        title: '1. The most in-demand IT specializations in 2026',
        leadText: 'IT is no longer just writing code. It has split into highly specialized fields.',
        paragraphs: [
          '1. AI/ML Engineering & Data Engineering: design machine learning models, fine-tune LLMs and process large data streams.',
          '2. Cloud & Platform Engineering (DevOps/SRE): manage cloud infrastructure (AWS, GCP, Azure), Kubernetes and CI/CD pipelines.',
          '3. Full-Stack / Backend Engineering: build high-load distributed systems, microservices and information security.',
        ],
      },
      {
        id: 'ky-nguyen-ai-developer-can-gi',
        title: '2. The Generative AI era: how should developers adapt?',
        paragraphs: [
          'AI will not replace developers, but developers who use AI to boost productivity will replace those who refuse to change. Systems thinking, analyzing complex business problems and data security matter more than just writing syntax.',
        ],
      },
      {
        id: 'bang-luong-lap-trinh-vien',
        title: '3. Developer salary ranges by years of experience',
        paragraphs: [
          '- Fresher / Under 1 year: 10 - 16 million VND/month',
          '- Junior (1 - 3 years): 16 - 28 million VND/month',
          '- Senior (3 - 5 years): 30 - 55 million VND/month',
          '- Tech Lead / Architect (5+ years): 55 - 95 million VND/month or higher at foreign companies.',
        ],
      },
      {
        id: 'lo-trinh-tech-lead-architect',
        title: '4. The path from Junior to Tech Lead and Architect',
        paragraphs: [
          'Two major paths: Technical Specialist (Solution Architect / Staff Engineer) for those who love deep technical work, and Engineering Management (Tech Lead, Engineering Manager) for those who are good at leading teams.',
        ],
      },
    ],
  },
  {
    id: 'art-cb-hr-specialist-guide',
    slug: 'chuyen-mon-cb-compensation-and-benefits-trong-nganh-hr',
    title: 'C&B (Compensation & Benefits) expertise: from payroll management to talent compensation planning',
    category: 'Industry knowledge',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'C&B is the heart of the HR department, ensuring fairness and competitiveness. Learn the core skills: designing a 3P pay system, building a KPI bonus framework and optimizing personnel costs.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    publishedAt: '20/09/2026',
    readTime: '11 min read',
    viewsCount: '27.6K',
    tags: ['C&B', 'Human resources', '3P pay', 'Compensation', 'Industry knowledge'],
    author: {
      name: 'Le Hoang Hai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'C&B Expert & Labor Law Consultant',
    },
    tableOfContents: [
      { id: 'vai-tro-cb-trong-doanh-nghiep', title: '1. The strategic role of a C&B specialist', level: 1 },
      { id: 'mo-hinh-luong-3p', title: '2. The 3P pay model: Position - Person - Performance', level: 1 },
      { id: 'cac-ky-nang-can-co-cb', title: '3. The toolkit and quantitative skills of a C&B professional', level: 1 },
    ],
    sections: [
      {
        id: 'vai-tro-cb-trong-doanh-nghiep',
        title: '1. The strategic role of a C&B specialist',
        paragraphs: [
          'C&B is not just timesheets and bank transfers. A professional C&B advises leadership on the HR budget structure, talent retention policy and labor law compliance.',
        ],
      },
      {
        id: 'mo-hinh-luong-3p',
        title: '2. The 3P pay model: Position - Person - Performance',
        paragraphs: [
          '- P1 (Position): pay by the value of the job position (Job Grading).',
          '- P2 (Person): pay by personal competency and level of contribution (Competency).',
          '- P3 (Performance): pay bonuses by work results and KPIs achieved.',
        ],
      },
      {
        id: 'cac-ky-nang-can-co-cb',
        title: '3. The toolkit and quantitative skills of a C&B professional',
        paragraphs: [
          'Master advanced Excel (VBA, Power Query), understand labor law deeply and know the Mercer and Willis Towers Watson salary survey reports.',
        ],
      },
    ],
  },
  {
    id: 'art-logistics-supply-chain-guide',
    slug: 'logistics-va-supply-chain-la-gi-kien-thuc-thuc-chien',
    title: 'Practical Logistics & Supply Chain knowledge: Incoterms 2020, import-export and supply chain management',
    category: 'Industry knowledge',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'A complete guide for import-export staff: the 11 Incoterms 2020 rules, the customs clearance process, the Bill of Lading and applying technology to optimize warehousing and transport.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '16/09/2026',
    readTime: '13 min read',
    viewsCount: '31.2K',
    tags: ['Logistics', 'Supply Chain', 'Incoterms 2020', 'Import & export', 'Warehousing'],
    author: {
      name: 'Dang Quoc Huy',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      role: 'Supply Chain Operations Director',
    },
    tableOfContents: [
      {
        id: 'phan-biet-logistics-va-supply-chain',
        title: '1. Logistics versus Supply Chain Management',
        level: 1,
      },
      {
        id: 'incoterms-2020-cot-loi',
        title: '2. A summary of the 4 core Incoterms 2020 groups (E, F, C, D)',
        level: 1,
      },
      {
        id: 'quy-trinh-xuat-nhap-khau',
        title: '3. The 6-step process for importing or exporting a sea freight shipment',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'phan-biet-logistics-va-supply-chain',
        title: '1. Logistics versus Supply Chain Management',
        paragraphs: [
          'Logistics focuses on transport, storage and distribution of the flow of goods. Supply Chain is the broader concept from sourcing raw materials and production to inventory control and the final customer experience.',
        ],
      },
      {
        id: 'incoterms-2020-cot-loi',
        title: '2. A summary of the 4 core Incoterms 2020 groups (E, F, C, D)',
        paragraphs: [
          'Incoterms define where risk transfers and who bears transport and insurance costs between seller and buyer (FOB, CIF, EXW and DDP are the most common terms in Vietnam).',
        ],
      },
      {
        id: 'quy-trinh-xuat-nhap-khau',
        title: '3. The 6-step process for importing or exporting a sea freight shipment',
        paragraphs: [
          'Negotiate the trade contract, open an L/C or arrange international payment, book the vessel, handle customs procedures, inspect goods and release them at the port.',
        ],
      },
    ],
  },

  {
    id: 'art-sales-career-roadmap',
    slug: 'dinh-huong-nghe-nghiep-nganh-kinh-doanh-sales',
    title: 'Career orientation in Business & Sales: the roadmap from Sales Executive to Chief Commercial Officer (CCO)',
    category: 'Career orientation',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Sales is not just selling but the art of solving problems and building strategic relationships. Explore the differences between B2B Sales and B2C Sales, unlimited commission income and the promotion path.',
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    publishedAt: '01/10/2026',
    readTime: '10 min read',
    viewsCount: '36.8K',
    tags: ['Kinh doanh', 'Sales', 'B2B Sales', 'Career roadmap', 'Career orientation'],
    author: {
      name: 'Vu Minh Duc',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      role: 'Senior Executive Recruiter',
    },
    tableOfContents: [
      { id: 'tong-quan-nghe-sales', title: '1. Sales in the digital era: not just "pitching"', level: 1 },
      { id: 'b2b-vs-b2c-sales', title: '2. B2B Sales vs B2C Sales: which path suits you?', level: 1 },
      { id: 'lo-trinh-thang-tien-sales', title: '3. The 5-step promotion path from Sales Exec to CCO', level: 1 },
      {
        id: 'thu-nhap-nganh-sales',
        title: '4. Sales income structure: base salary + breakthrough commission',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'tong-quan-nghe-sales',
        title: '1. Sales in the digital era: not just "pitching"',
        paragraphs: [
          'Modern sales is shifting strongly to "Consultative Selling". Customers do not buy products, they buy business results and solutions to their problems.',
        ],
      },
      {
        id: 'b2b-vs-b2c-sales',
        title: '2. B2B Sales vs B2C Sales: which path suits you?',
        paragraphs: [
          'B2C Sales has a short sales cycle, emotion-based decisions and reaches large numbers of consumers.',
          'B2B Sales has a long sales cycle (from several months to a year), contracts worth hundreds of millions or billions of VND, and requires negotiating with many stakeholders at the partner company.',
        ],
      },
      {
        id: 'lo-trinh-thang-tien-sales',
        title: '3. The 5-step promotion path from Sales Exec to CCO',
        paragraphs: [
          'Sales Development Rep (SDR) -> Account Executive (AE) -> Key Account Manager (KAM) -> Sales Manager -> Chief Commercial Officer (CCO).',
        ],
      },
      {
        id: 'thu-nhap-nganh-sales',
        title: '4. Sales income structure: base salary + breakthrough commission',
        paragraphs: [
          'Base salary usually ranges from 10 - 25 million VND, but unlimited commission can push total income to 40 - 100+ million VND/month for outstanding staff.',
        ],
      },
    ],
  },
  {
    id: 'art-career-pivot-at-30',
    slug: 'chuyen-nganh-o-tuoi-30-co-muon-khong-chien-luoc-pivot-thanh-cong',
    title: 'Changing careers at 30: is it too late? A safe and breakthrough career "Pivot" strategy',
    category: 'Career orientation',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'The career crisis at 30 and the question: should you start over from zero? How to use Transferable skills, prepare financially and create a stepping stone for a smooth career change.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    publishedAt: '24/09/2026',
    readTime: '10 min read',
    viewsCount: '28.9K',
    tags: ['Career change', 'Crisis at 30', 'Career orientation', 'Soft skills'],
    author: {
      name: 'Nguyen Thanh Tung',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Head of Talent Acquisition @ InterVue',
    },
    tableOfContents: [
      { id: 'tuoi-30-chuyen-nganh', title: '1. Changing careers at 30: advantage or risk?', level: 1 },
      { id: 'ky-nang-chuyen-doi', title: '2. Unlocking your Transferable Skills', level: 1 },
      {
        id: 'chien-luoc-chuyen-nganh-3-buoc',
        title: '3. A 3-step strategy to change careers without financial shock',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'tuoi-30-chuyen-nganh',
        title: '1. Changing careers at 30: advantage or risk?',
        paragraphs: [
          'You are not starting from zero. You start from life experience, communication skills, conflict resolution and a mature attitude to work.',
        ],
      },
      {
        id: 'ky-nang-chuyen-doi',
        title: '2. Unlocking your Transferable Skills',
        paragraphs: [
          'Project management, data analysis, logical thinking and negotiation are abilities that apply successfully in any career.',
        ],
      },
      {
        id: 'chien-luoc-chuyen-nganh-3-buoc',
        title: '3. A 3-step strategy to change careers without financial shock',
        paragraphs: [
          'Step 1: an emergency fund of at least 6 months of living expenses. Step 2: take professional certificates or do Freelance/Side-projects before leaving your main job. Step 3: apply for roles that sit between your old and new fields.',
        ],
      },
    ],
  },
];

export const ALL_BLOG_ARTICLES: BlogArticle[] = [...CAREER_ARTICLES, ...ADDITIONAL_BLOG_ARTICLES];

export function getAllBlogArticles(): BlogArticle[] {
  return ALL_BLOG_ARTICLES;
}

export function getBlogArticlesByCategory(categorySlug: BlogCategorySlug): BlogArticle[] {
  return ALL_BLOG_ARTICLES.filter((art) => art.categorySlug === categorySlug);
}

export function getFeaturedBlogArticles(): BlogArticle[] {
  return ALL_BLOG_ARTICLES.filter((art) => art.isFeatured);
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return ALL_BLOG_ARTICLES.find((art) => art.slug === slug);
}

export function getBlogCategoryBySlug(slug: string): BlogCategoryMeta | undefined {
  return BLOG_CATEGORIES.find((cat) => cat.slug === slug);
}

export function getRelatedBlogArticles(currentArticle: BlogArticle, limit: number = 3): BlogArticle[] {
  return ALL_BLOG_ARTICLES.filter(
    (art) => art.slug !== currentArticle.slug && art.categorySlug === currentArticle.categorySlug,
  ).slice(0, limit);
}
