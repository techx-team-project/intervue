export const CAREER_ORIENTATION_MESSAGES = {
  hero: {
    breadcrumbHome: 'Home',
    breadcrumbHandbook: 'Career guides',
    breadcrumbCurrent: 'Career orientation',
    badge: 'A Complete Career Guide & Roadmap',
    title: 'Career orientation',
    description:
      'Insights, market analysis and the career roadmap you need to shape your career early, choose a path that fits your strengths and break through on income.',
    searchPlaceholder: 'Search articles, industries, salaries, career skills...',
    trendingLabel: 'Trending:',
    trendingTags: [
      'Marketing',
      'Digital Marketing',
      'Sales',
      'Logistics',
      'Information technology (IT)',
      'Finance - Banking',
      'Salary',
    ],
  },
  featured: {
    title: 'Featured articles',
    subtitle: 'The latest hiring trends',
    badgeHighlight: 'Spotlight',
    viewsSuffix: 'views',
    exploreCta: 'Explore now',
    readMoreCta: 'Read more',
  },
  card: {
    detailCta: 'Details',
  },
  assessment: {
    badge: '60-second quick quiz',
    title: 'Discover the career path that suits you best',
    description:
      'Answer 2 short questions and InterVue will suggest the best industry and growth roadmap for your personality.',
    progressLabel: 'Progress:',
    backBtn: '← Back to the previous question',
    completedBadge: 'Your career orientation result',
    completedTitle: (field: string) => `Best-fit field: ${field}`,
    completedDesc:
      'Based on your income goals and preferred environment, you have the greatest potential to break through in this field. Read the detailed roadmap and salary analysis to seize the opportunity!',
    seeGuideCta: 'View the industry guide & roadmap',
    retakeCta: 'Retake the quiz',
    quizSteps: [
      {
        id: 1,
        question: '1. What are your income goal and preferred work style?',
        options: [
          {
            label: 'Breakthrough income based on ability, unlimited commission',
            sublabel: 'Enjoy communicating, negotiating and handling KPI pressure',
            recommendedField: 'Sales & Business Development',
            slug: 'nhan-vien-sales-la-gi',
          },
          {
            label: 'Free to be creative, build brands and follow digital trends',
            sublabel: 'Love content, social media and analyzing customer behavior',
            recommendedField: 'Marketing & Digital Communications',
            slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
          },
          {
            label: 'Logical thinking, solving technical and technology problems',
            sublabel: 'Love programming, algorithms, AI and system optimization',
            recommendedField: 'Information Technology (IT / AI)',
            slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
          },
          {
            label: 'Organizing processes, coordinating the supply chain and import-export',
            sublabel: 'Enjoy hands-on work and moving goods worldwide',
            recommendedField: 'Logistics & Supply Chain',
            slug: 'logistics-la-gi',
          },
        ],
      },
      {
        id: 2,
        question: '2. Which ideal work environment fully energizes you?',
        options: [
          {
            label: 'Dynamic, varied projects, constant challenges (Agency / Tech)',
            sublabel: 'Learn extremely fast and meet many large clients',
            recommendedField: 'Digital Marketing & Performance',
            slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
          },
          {
            label: 'Professional, stable pay and clear promotion (Corporation)',
            sublabel: 'Standard processes, high benefits, a large partner network',
            recommendedField: 'Brand Marketing & Business Administration',
            slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
          },
          {
            label: 'Flexible, hybrid/remote, focused on hands-on ability',
            sublabel: 'Manage your own time, judged by output',
            recommendedField: 'Software Engineering / AI Solutions',
            slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
          },
          {
            label: 'Hands-on market work, frequently expanding external relationships',
            sublabel: 'Meet business owners and expand your personal influence',
            recommendedField: 'B2B Key Account Sales & BD',
            slug: 'nhan-vien-sales-la-gi',
          },
        ],
      },
    ],
  },
  list: {
    title: 'Career orientation articles',
    articleCountSuffix: 'articles',
    prevBtn: 'Previous page',
    nextBtn: 'Trang sau',
    notFoundTitle: 'No matching articles found',
    notFoundDesc: 'Try changing the search keyword or choose another category.',
    clearFilterBtn: 'Clear filters',
  },
  sidebar: {
    topIndustriesTitle: 'Top industries hungry for talent in 2026',
    jobCountSuffix: 'jobs',
    careerToolsTitle: 'Career development toolkit',
    careerToolsDesc: 'Get ready for interviews and promotion',
    tools: {
      cvTitle: 'Create an ATS-ready CV',
      cvDesc: 'Professional CV templates that raise your score',
      mbtiTitle: 'MBTI personality test',
      mbtiDesc: 'Explore the 16 personality types and matching careers',
      salaryTitle: 'Gross to Net salary calculator',
      salaryDesc: 'Updated with the latest personal income tax and social insurance rates',
      aiTitle: 'Practice interviews with AI',
      aiDesc: '1-on-1 realistic interview simulation',
    },
    newsletterTitle: 'Get the career orientation newsletter',
    newsletterDesc: 'Subscribe to receive regular salary reports and exclusive career growth guides every week.',
    newsletterPlaceholder: 'Enter your email...',
    newsletterSubmit: 'Subscribe now',
    newsletterSuccess: 'Thank you for subscribing!',
  },
  aiInterviewCta: {
    badge: 'Exclusive InterVue AI technology',
    title: 'Win over recruiters with a mock interview with AI',
    description:
      'Simulate 100% of realistic interview scenarios for Marketing roles (Brand, Digital, Content, Performance). AI scores your answers, analyzes body language and instantly suggests how to improve them.',
    standardQuestions: 'Corporate-standard question bank',
    strengthsWeaknesses: 'Strengths & weaknesses analysis',
    practiceCta: 'Practice AI interviews now',
    createCvCta: 'Create an ATS-ready Marketing CV',
  },
  detailBreadcrumb: {
    handbookLabel: 'Career guides',
    copyLink: 'Copy link',
    copiedLink: 'Link copied',
    saveArticle: 'Save article',
    savedArticle: 'Saved',
    shareFacebook: 'Share on Facebook',
  },
  detailSidebar: {
    authorTitle: 'Article author',
    applyToolsTitle: 'Application tools',
    relatedArticlesTitle: 'Related articles',
    tools: {
      cvTemplate: 'Industry-standard CV templates',
      mbti: 'MBTI personality test',
      salaryCompare: 'Compare market salaries',
      aiInterview: 'Practice interviews with InterVue AI',
    },
  },
  detailView: {
    updatedBadge: 'Updated to 2026 standards',
    viewsCountSuffix: 'views',
    relatedTopicsTitle: 'Related topics:',
  },
  relatedJobsWidget: {
    badge: 'Direct Hiring From Leading Companies',
    title: 'Urgently hiring Marketing jobs',
    description: 'Attractive Marketing positions from top recruiters on InterVue',
    viewAllCta: 'View all 1,400+ jobs',
    deadlinePrefix: 'Deadline:',
    applyNowCta: 'Apply now',
    jobs: [
      {
        id: 101,
        title: 'Senior Brand Marketing Executive - FMCG Brands',
        companyName: 'Masan Group',
        companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/z7x9B4R0a13h.png',
        companyId: 2,
        salary: '22 - 32M VND',
        location: 'District 1, Ho Chi Minh City',
        deadline: '30/10/2026',
        tags: ['Brand Management', 'FMCG', 'Campaign Planning'],
      },
      {
        id: 102,
        title: 'Digital Performance Marketing Specialist (Google & Meta Ads)',
        companyName: 'FPT Corporation',
        companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/fpt-corporation.png',
        companyId: 1,
        salary: '18 - 25M VND',
        location: 'Cau Giay, Hanoi',
        deadline: '28/10/2026',
        tags: ['Performance Ads', 'ROAS', 'Google Ads'],
      },
      {
        id: 103,
        title: 'Content Creator & Social Media Executive (TikTok / Threads)',
        companyName: 'Shopee Vietnam',
        companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/shopee-vietnam.png',
        companyId: 4,
        salary: '12 - 18M VND',
        location: 'District 7, Ho Chi Minh City',
        deadline: '25/10/2026',
        tags: ['TikTok Creator', 'Copywriting', 'Livestream'],
      },
      {
        id: 104,
        title: 'SEO & Growth Marketing Lead - Fintech Ecosystem',
        companyName: 'VNG Corporation',
        companyLogo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/vng-corporation.png',
        companyId: 3,
        salary: '25 - 40M VND',
        location: 'District 7, Ho Chi Minh City',
        deadline: '15/11/2026',
        tags: ['SEO Leader', 'Growth Hacking', 'Ahrefs'],
      },
    ],
  },
  roadmapTimeline: {
    title: 'Career roadmap in Marketing',
    description: '5 standard stages from Intern to Chief Marketing Officer (CMO)',
    mainResponsibilitiesTitle: 'Key responsibilities',
    skillsTitle: 'Skills & competencies required',
  },
  salaryInteractive: {
    badge: '2026 Income Survey Statistics',
    title: 'Marketing salary table by level',
    description: 'Survey data from 5,000+ real job posts and InterVue salary reports.',
    expLevelTitle: 'Experience level',
    expRequiredTitle: 'Experience required:',
    avgIncomeTitle: 'Average income range',
    bonusTitle: '+ KPI bonus & revenue commission',
    coreDescTitle: 'Core responsibilities',
    popularRolesTitle: 'Typical job titles',
  },
  specializationsGrid: {
    title: 'The most promising Marketing specializations in 2026',
    description: 'Choose the specialization that fits your analytical or creative strengths',
    coreSkillsTitle: 'Core skills:',
    commonToolsTitle: 'Commonly used tools:',
  },
  tableOfContents: {
    title: 'Table of contents',
  },
};

import { CareerArticle, CareerCategory, CareerTrendingIndustry } from '@/types/career';

export const CAREER_CATEGORIES: CareerCategory[] = [
  {
    id: 'all',
    name: 'All',
    slug: 'tat-ca',
    count: 24,
  },
  {
    id: 'orientation',
    name: 'Career orientation',
    slug: 'dinh-huong-nghe-nghiep',
    count: 12,
  },
  {
    id: 'skills',
    name: 'Industry knowledge',
    slug: 'kien-thuc-chuyen-nganh',
    count: 8,
  },
  {
    id: 'salary',
    name: 'Salary and benefits',
    slug: 'che-do-luong-thuong',
    count: 6,
  },
  {
    id: 'tips',
    name: 'Job search tips',
    slug: 'bi-kip-tim-viec',
    count: 9,
  },
  {
    id: 'trends',
    name: '2026 hiring trends',
    slug: 'xu-huong-tuyen-dung',
    count: 5,
  },
];

export const TRENDING_INDUSTRIES: CareerTrendingIndustry[] = [
  {
    id: 'mkt',
    name: 'Marketing & Communications',
    demandRate: '+34%',
    avgSalary: '12 - 35M VND',
    jobCount: 1420,
    badge: 'Hot',
    slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
  },
  {
    id: 'it',
    name: 'Information technology / AI',
    demandRate: '+48%',
    avgSalary: '18 - 55M VND',
    jobCount: 2850,
    badge: 'Top 1',
    slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
  },
  {
    id: 'sales',
    name: 'Sales & Business Development',
    demandRate: '+29%',
    avgSalary: '15 - 45M VND',
    jobCount: 3100,
    badge: 'High income',
    slug: 'nhan-vien-sales-la-gi',
  },
  {
    id: 'logistics',
    name: 'Logistics & Supply chain',
    demandRate: '+25%',
    avgSalary: '12 - 30M VND',
    jobCount: 980,
    badge: 'Growing',
    slug: 'logistics-la-gi',
  },
  {
    id: 'finance',
    name: 'Finance - Banking',
    demandRate: '+20%',
    avgSalary: '14 - 38M VND',
    jobCount: 1150,
    badge: 'Stable',
    slug: 'nganh-tai-chinh-ngan-hang-la-gi',
  },
];

export const CAREER_ARTICLES: CareerArticle[] = [
  {
    id: 'art-marketing',
    slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
    title: 'What is Marketing? Marketing roles and the 2026 career roadmap',
    category: 'Industry knowledge',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'A complete overview of Marketing: definitions, HOT specializations (Digital, Brand, MarCom), admission information, salary by level and the career roadmap from Intern to Chief Marketing Officer (CMO).',
    coverImage:
      'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-marketing-la-gi-topcv.jpg69ce32b0a12d4.jpg',
    publishedAt: '21/08/2026',
    updatedAt: '04/10/2026',
    readTime: '12 min read',
    viewsCount: '52.4K',
    isFeatured: true,
    isTrending: true,
    tags: ['Marketing', 'Digital Marketing', 'Career roadmap', 'Salary', 'Brand Management', 'SEO & Ads'],
    author: {
      name: 'InterVue Editorial Team & Recruitment Experts',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Career Orientation Expert & Recruitment Consultant',
      bio: '10+ years researching the labor market and advising more than 100,000 young candidates in Vietnam on their careers.',
    },
    tableOfContents: [
      { id: 'nganh-marketing-la-gi', title: '1. What is Marketing?', level: 1 },
      { id: 'nganh-marketing-co-de-xin-viec-khong', title: '2. Is it easy to find a Marketing job?', level: 1 },
      {
        id: 'nganh-marketing-gom-nhung-chuyen-nganh-nao',
        title: '3. What specializations does Marketing include?',
        level: 1,
      },
      { id: 'thong-tin-tuyen-sinh-nganh-marketing', title: '4. Admission information for Marketing', level: 1 },
      {
        id: 'nganh-marketing-ra-truong-lam-gi',
        title: '5. What can you do after studying Marketing? (9 HOT roles)',
        level: 1,
      },
      { id: 'muc-luong-nganh-marketing', title: '6. How much do Marketing jobs pay?', level: 1 },
      { id: 'lo-trinh-thang-tien-nganh-marketing', title: '7. Career roadmap in Marketing', level: 1 },
      { id: 'nhung-to-chat-ky-nang-can-co', title: '8. Qualities and skills required', level: 1 },
      { id: 'xu-huong-nganh-marketing-2026', title: '9. Marketing trends in 2026', level: 1 },
      { id: 'tim-viec-lam-nganh-marketing-o-dau', title: '10. Where to find Marketing jobs?', level: 1 },
    ],
    salaryTiers: [
      {
        level: 'Intern / Trainee',
        range: '3,000,000 - 6,000,000 VND/month',
        experience: '0 - 6 months',
        description:
          'Support content planning, seeding and competitor research, and get familiar with advertising and basic analytics tools.',
        popularRoles: ['Marketing Intern', 'Content Intern', 'Social Media Trainee'],
        color: '#00b14f',
      },
      {
        level: 'New graduate / Fresher',
        range: '8,000,000 - 12,000,000 VND/month',
        experience: 'Under 1 year',
        description: 'Directly handle content creation, manage social media channels or set up small ad campaigns.',
        popularRoles: ['Marketing Executive', 'Content Writer', 'SEO Executive', 'Junior Media Planner'],
        color: '#0284c7',
      },
      {
        level: 'Specialist (Junior - Middle)',
        range: '12,000,000 - 20,000,000 VND/month',
        experience: '1 - 3 years',
        description:
          'Independently run multi-channel communication campaigns, optimize conversions and measure campaign ROI.',
        popularRoles: ['Digital Marketing Specialist', 'Performance Marketer', 'Brand Executive', 'PR Specialist'],
        color: '#7c3aed',
      },
      {
        level: 'Senior Specialist',
        range: '20,000,000 - 35,000,000 VND/month',
        experience: '3 - 5 years',
        description: 'Build content distribution strategy and large marketing budgets, and mentor new members.',
        popularRoles: ['Senior Brand Specialist', 'Growth Marketing Lead', 'Senior Digital Strategist'],
        color: '#ea580c',
      },
      {
        level: 'Team Lead / Manager',
        range: '25,000,000 - 50,000,000 VND/month',
        experience: '5 - 8 years',
        description:
          'Manage the team, coordinate budgets worth billions of VND, and own sales and brand awareness KPIs.',
        popularRoles: ['Marketing Manager', 'Brand Manager', 'Head of Digital', 'MarCom Manager'],
        color: '#e11d48',
      },
      {
        level: 'Chief Marketing Officer (CMO / Marketing Director)',
        range: '50,000,000 - 100,000,000+ VND/month',
        experience: 'Over 8 years',
        description: 'Shape the company-wide brand strategy and help plan the core business growth model.',
        popularRoles: ['Chief Marketing Officer (CMO)', 'VP of Marketing', 'Marketing Director'],
        color: '#059669',
      },
    ],
    careerRoadmap: [
      {
        step: 1,
        title: 'Stage 1: Getting started (Intern / Trainee)',
        duration: '0 - 6 months',
        salaryEstimate: '3 - 6M VND/month',
        skills: ['Basic content writing skills', 'Using Canva/CapCut', 'Market research', 'Excel & reporting'],
        keyResponsibilities: [
          'Help write fanpage posts and SEO-ready blogs',
          'Track engagement and basic customer feedback',
          'Prepare weekly reports from existing templates',
        ],
      },
      {
        step: 2,
        title: 'Stage 2: Learning & independence (Junior Specialist)',
        duration: '6 months - 2 years',
        salaryEstimate: '8 - 14M VND/month',
        skills: [
          'Running Meta/Google/TikTok Ads',
          'Analyzing data with Google Analytics 4',
          'A/B testing mindset',
          'Persuasive copywriting',
        ],
        keyResponsibilities: [
          'Independently produce multi-platform content campaigns',
          'Operate and optimize the daily ad budget',
          'Work with Design & Sales to increase conversions',
        ],
      },
      {
        step: 3,
        title: 'Stage 3: Deep expertise & breakthroughs (Senior Specialist)',
        duration: '2 - 5 years',
        salaryEstimate: '18 - 30M VND/month',
        skills: ['Growth Marketing', 'Brand strategy', 'Marketing Automation', 'Agile/Scrum project management'],
        keyResponsibilities: [
          'Plan the overall marketing for new products',
          'Optimize the customer journey (Customer Journey Map)',
          'Measure CAC (Customer Acquisition Cost) & LTV (Lifetime Value)',
        ],
      },
      {
        step: 4,
        title: 'Stage 4: Management & leadership (Marketing Manager)',
        duration: '5 - 8 years',
        salaryEstimate: '30 - 55M VND/month',
        skills: [
          'People management & leadership',
          'Financial budget planning',
          'Negotiating with Agencies/KOLs',
          'Business acumen',
        ],
        keyResponsibilities: [
          'Build and grow a marketing team of 5 - 20 people',
          'Allocate the quarterly/annual marketing budget effectively',
          'Directly own the revenue KPI contributed by Marketing',
        ],
      },
      {
        step: 5,
        title: 'Stage 5: Executive (CMO / VP of Marketing)',
        duration: '8+ years',
        salaryEstimate: '60 - 120+M VND/month',
        skills: [
          'Long-term corporate strategy',
          'Macro-level brand positioning',
          'M&A & international market expansion',
          'Crisis communications management',
        ],
        keyResponsibilities: [
          'Set the brand vision and competitive position in the market',
          'Join the Board in directing company growth',
          'Lead large-scale marketing digital transformation campaigns',
        ],
      },
    ],
    specializations: [
      {
        title: 'Digital Marketing',
        description:
          'Focuses on every online marketing channel, including SEO, SEM, Paid Social, Email Automation and digital conversion analytics.',
        avgSalary: '12 - 28M VND',
        keySkills: ['Meta Ads', 'Google Ads', 'SEO On-page & Off-page', 'GA4 & Looker Studio'],
        tools: ['Google Ads', 'Meta Business Suite', 'Ahrefs', 'Mailchimp', 'Klaviyo'],
        growthRate: '+38% demand in 2026',
      },
      {
        title: 'Brand Management',
        description:
          "Shape the image, emotional value and position of a product in consumers' minds through long-term communication campaigns.",
        avgSalary: '15 - 35M VND',
        keySkills: ['Consumer Insight', 'Brand Architecture', 'Storytelling', 'Campaign Planning'],
        tools: ['Mintel', 'Euromonitor', 'NielsenIQ', 'Canva Pro'],
        growthRate: '+24% demand in 2026',
      },
      {
        title: 'Content Marketing & Creative',
        description:
          'Create and nurture a loyal audience through valuable content (blogs, short videos, podcasts, ebooks, viral scripts).',
        avgSalary: '10 - 22M VND',
        keySkills: ['Copywriting', 'Content Strategy', 'Video Scriptwriting', 'Visual thinking'],
        tools: ['Notion', 'ChatGPT/Claude', 'CapCut', 'Figma'],
        growthRate: '+30% demand in 2026',
      },
      {
        title: 'Performance & Growth Marketing',
        description:
          'Digital specialists focused on optimizing conversion rate, CPA, ROI and rapid growth experiments (Growth Hacking).',
        avgSalary: '18 - 40M VND',
        keySkills: ['Funnel Optimization', 'Data Analysis', 'A/B Testing', 'Retention Marketing'],
        tools: ['Mixpanel', 'Amplitude', 'AppsFlyer', 'Tableau'],
        growthRate: '+45% demand in 2026',
      },
      {
        title: 'PR & Corporate Communications',
        description:
          'Maintain press relations, handle communication crises and promote corporate social responsibility (CSR).',
        avgSalary: '14 - 30M VND',
        keySkills: ['Media Relations', 'Crisis Management', 'Event Planning', 'Press Release'],
        tools: ['Cision', 'Social Listening Tools', 'Buzzmetrics'],
        growthRate: '+18% demand in 2026',
      },
      {
        title: 'Trade Marketing',
        description:
          'Wholesale strategy, point-of-sale optimization (POSM) and promotions for distributors and retailers to win shelf share.',
        avgSalary: '14 - 32M VND',
        keySkills: ['Shopper Insight', 'Channel Strategy', 'POSM Management', 'Sales Alignment'],
        tools: ['DMS', 'SAP ERP', 'Retail Audit Data'],
        growthRate: '+22% demand in 2026',
      },
    ],
    sections: [
      {
        id: 'nganh-marketing-la-gi',
        title: '1. What is Marketing?',
        leadText:
          'Marketing is not simply advertising or selling. It is an entire ecosystem of research, creativity and delivering value to target customers.',
        paragraphs: [
          'According to the American Marketing Association (AMA), Marketing is the activity, set of institutions and processes for creating, communicating, delivering and exchanging offerings that have value for customers, clients, partners and society at large.',
          "Put simply, Marketing is the bridge between a business and the market. The core job of a marketer is to understand consumers' unspoken needs (customer insight), then develop the right product, price it accurately, choose the best distribution channels and promote the product in a way that touches customers' emotions.",
          'The classic Marketing model includes the 4Ps (Product, Price, Place, Promotion) and extends to 7Ps for services (People, Process, Physical Evidence).',
        ],
        highlights: [
          'Marketing = The right product for the need + the right price + the right channel + the right message at the right time.',
          'Marketing vs Sales: Marketing creates demand and draws customers in, while Sales closes deals directly and turns demand into revenue.',
        ],
      },
      {
        id: 'nganh-marketing-co-de-xin-viec-khong',
        title: '2. Is it easy to find a Marketing job?',
        leadText:
          'In the era of digital and booming e-commerce, every business from small startups to multinationals sees Marketing as the lifeblood of growth.',
        paragraphs: [
          'According to the InterVue & TopCV recruitment market report, demand for Marketing & Communications staff is always in the TOP 3 industries with the most job posts in Vietnam.',
          'Although many Marketing students graduate every year, the market is still "hungry" for high-quality talent: people with strategic thinking, strong digital tools skills (Digital Marketing) and the ability to read data (Data-driven Marketer).',
          'In particular, the boom of TikTok, Shopee/Lazada e-commerce and the wave of generative AI (GenAI) open thousands of new roles such as KOC/KOL Specialist, Live Commerce Specialist, AI Content Marketer and Performance Data Analyst.',
        ],
        highlights: [
          'The employment rate of Marketing graduates exceeds 92% within the first 6 months.',
          'Companies are ready to pay outstanding income to candidates who can measure real conversion performance (ROAS, CPL, LTV).',
        ],
      },
      {
        id: 'nganh-marketing-gom-nhung-chuyen-nganh-nao',
        title: '3. What specializations does Marketing include?',
        leadText:
          'At universities and in real companies, Marketing is split into specialized branches that suit different personal strengths.',
        paragraphs: [
          'Depending on your aptitude (leaning toward artistic creativity or toward logical data thinking), you can choose one of the following main specializations:',
        ],
        subsections: [
          {
            title: 'Digital Marketing',
            content: [
              'The most popular specialization today, studying how to use digital technology, the Internet, social media, email and search engines to reach customers.',
              'Typical subjects: Search Engine Optimization (SEO), Digital Advertising (SEM & Social Ads), Content Marketing, Web Analytics.',
            ],
          },
          {
            title: 'Marketing Communications (MarCom)',
            content: [
              'Focuses on how to deliver brand messages through integrated channels (IMC - Integrated Marketing Communications).',
              'Typical subjects: Creative advertising, Marketing event organization, Public relations, Crisis communications management.',
            ],
          },
          {
            title: 'Brand Management',
            content: [
              'Studies how to build and position strong Brand Equity in the market.',
              'Suited to people with strategic vision who understand consumer behavioral psychology and product line management.',
            ],
          },
          {
            title: 'Trade Marketing & Retail',
            content: [
              'The bridge between Brand Marketing and the field Sales team, optimizing product presence at points of sale (supermarkets, convenience stores, distributors).',
            ],
          },
        ],
      },
      {
        id: 'thong-tin-tuyen-sinh-nganh-marketing',
        title: '4. Admission information for Marketing',
        leadText:
          'To pursue Marketing properly, choosing a reputable school and knowing the admission subject combinations is a solid start.',
        paragraphs: [
          'The most common admission subject combinations for Marketing today include: A00 (Math, Physics, Chemistry), A01 (Math, Physics, English), D01 (Math, Literature, English) and D07 (Math, Chemistry, English).',
          'In Hanoi, the leading universities teaching Marketing include: National Economics University (NEU), Foreign Trade University (FTU), Posts and Telecommunications Institute of Technology (PTIT), Banking Academy (BA) and Thuongmai University (TMU).',
          'In Ho Chi Minh City, reputable institutions include: University of Economics Ho Chi Minh City (UEH), Foreign Trade University Campus 2 (FTU2), University of Economics and Law (UEL), University of Finance - Marketing (UFM) and RMIT University Vietnam.',
          'Marketing admission scores are always among the highest entry scores at economics universities (typically 26.0 - 28.5 points for the national high school exam).',
        ],
      },
      {
        id: 'nganh-marketing-ra-truong-lam-gi',
        title: '5. What can you do after studying Marketing? (9 HOT roles)',
        leadText:
          'Marketing graduates have a very wide range of career options, from dynamic creative Agency environments to multinational Client corporations.',
        paragraphs: ['Here are the 9 roles with the most active hiring demand today:'],
        subsections: [
          {
            title: '1. General Marketer',
            content: [
              'Multitask across marketing planning, event coordination, fanpage care and working with the Sales team to boost revenue.',
            ],
          },
          {
            title: '2. Brand Executive / Brand Specialist',
            content: [
              'Care for the company\'s "brainchild": research the market, track brand health and work with Agencies to produce TVCs, billboards and major communication campaigns.',
            ],
          },
          {
            title: '3. Content Creator / Copywriter',
            content: [
              'Breathe life into a product through words, images and viral video scripts. Write SEO-ready blog posts, press PR articles, TikTok/Reels scripts and catchy ad messages.',
            ],
          },
          {
            title: '4. Performance Ads Specialist',
            content: [
              'Directly manage ad budgets on Meta Ads, Google Ads and TikTok Ads. Measure CPA, ROAS and conversions and decide when to scale campaigns.',
            ],
          },
          {
            title: '5. SEO Specialist',
            content: [
              'Analyze keywords, build website structure and optimize on-page/off-page to bring the website to the first page of Google organic results without paying for ads.',
            ],
          },
          {
            title: '6. Social Media Specialist',
            content: [
              'Operate and build communities on Facebook, Instagram, TikTok, Threads and LinkedIn, increasing engagement and brand awareness.',
            ],
          },
          {
            title: '7. PR Specialist',
            content: [
              'Build good relationships with press agencies, journalists and influencers (KOLs/KOCs), write press releases and help handle communication crises.',
            ],
          },
          {
            title: '8. Market Research Specialist',
            content: [
              'Collect and analyze market data, run focus groups and decode user insights to advise leadership on developing new products.',
            ],
          },
          {
            title: '9. Marketing Automation Specialist',
            content: [
              'Build automated customer care flows through Email, SMS and Zalo ZNS based on user behavior, improving retention and repurchase rates.',
            ],
          },
        ],
      },
      {
        id: 'muc-luong-nganh-marketing',
        title: '6. How much do Marketing jobs pay?',
        leadText:
          'Income in Marketing depends closely on hands-on ability, management experience and the size of the company you work for.',
        paragraphs: [
          'A 2026 survey of 5,000+ Marketing jobs on InterVue shows attractive average income at each experience level:',
          'Besides a fixed base salary, many roles such as Performance Marketer or Growth Marketer also receive commission/bonus based on the revenue they bring to the company.',
        ],
      },
      {
        id: 'lo-trinh-thang-tien-nganh-marketing',
        title: '7. Career roadmap in Marketing',
        leadText: 'A clear career roadmap helps you proactively build skills and prepare for each step of your career.',
        paragraphs: [
          'From a new intern just stepping into the field to Chief Marketing Officer (CMO) is a journey that demands persistence, constant trend updates and stronger management thinking.',
          'In Vietnam, the promotion path usually goes through 5 standard steps: Intern (0-6 months) -> Fresher/Junior (6 months - 2 years) -> Senior Specialist (2-5 years) -> Marketing Manager (5-8 years) -> CMO / Marketing Director (8+ years).',
        ],
      },
      {
        id: 'nhung-to-chat-ky-nang-can-co',
        title: '8. Qualities and skills needed to grow in Marketing',
        leadText: 'Marketing is the perfect intersection of Data Science and Creative Art.',
        paragraphs: [
          'To become an excellent marketer and not be left behind by technology, you need to build the following skill groups:',
        ],
        subsections: [
          {
            title: '1. Critical thinking & Customer Empathy',
            content: [
              "The ability to put yourself in the consumer's position to understand their pain points, hidden desires and the barriers that keep them from buying.",
            ],
          },
          {
            title: '2. Data-driven Mindset',
            content: [
              'Do not decide by feeling. Know how to read CTR, CPC, CPA, ROAS, Bounce Rate and LTV to accurately assess the return on every dollar spent.',
            ],
          },
          {
            title: '3. Mastering AI tools & Automation',
            content: [
              'The ability to use AI tools (ChatGPT, Claude, Midjourney, Canva AI, Descript) to cut research and content production time by 50%.',
            ],
          },
          {
            title: '4. Communication & Persuasive Presentation',
            content: [
              'Present creative ideas clearly to your boss or partners, defend your strategy and inspire the team that executes it.',
            ],
          },
        ],
      },
      {
        id: 'xu-huong-nganh-marketing-2026',
        title: '9. Marketing trends in 2026',
        leadText:
          '2026 marks a major turning point in applied technology and in the consumer behavior of Gen Z and Gen Alpha.',
        paragraphs: ['Here are the 4 dominant marketing trends every marketer should master:'],
        subsections: [
          {
            title: 'AI Hyper-Personalization',
            content: [
              'Use machine learning algorithms to automatically recommend products, write emails and adjust ad messages individually for each person in real time.',
            ],
          },
          {
            title: 'Short video boom & Live Commerce marketing',
            content: [
              'TikTok Shop, Shopee Live and Reels remain the most important direct-sales channels. Entertainment combined with shopping (Shoppertainment) holds the lead.',
            ],
          },
          {
            title: 'Shift to First-party Data',
            content: [
              'As third-party cookies are restricted, businesses focus on building loyal customer data sets (CDP, CRM) and nurturing through Zalo OA and Email Marketing.',
            ],
          },
          {
            title: 'Micro & Nano Influencers rise',
            content: [
              'Instead of paying hundreds of millions to A-list celebrities, businesses prefer to work with small content creators who have loyal, highly trusted audiences.',
            ],
          },
        ],
      },
      {
        id: 'tim-viec-lam-nganh-marketing-o-dau',
        title: '10. Where to find Marketing jobs?',
        leadText:
          'InterVue is a leading smart recruitment platform that connects you with thousands of Marketing job opportunities at the most reputable companies in Vietnam.',
        paragraphs: [
          'On InterVue you can easily search Marketing jobs by specialization (Digital, Content, Brand, SEO, Ads), and filter by desired salary and work city.',
          'In addition, InterVue AI Interview lets you practice 1-on-1 mock interviews with a virtual assistant that simulates realistic scenario questions from top recruiters.',
        ],
      },
    ],
    relatedArticles: [
      {
        id: 'art-sales',
        slug: 'nhan-vien-sales-la-gi',
        title: 'What is a Sales Representative? A to Z of a Sales career & tips to boost your income',
        coverImage:
          'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/sales-la-gi (3).png6a673b584620f.png',
        category: 'Career orientation',
        readTime: '10 min read',
        publishedAt: '08/09/2026',
      },
      {
        id: 'art-media',
        slug: 'nganh-truyen-thong-la-gi',
        title: 'What is Communications? Career prospects and detailed 2026 salaries',
        coverImage:
          'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-truyen-thong-la-gi-topcv-0.png67be7685174b7.png',
        category: 'Industry knowledge',
        readTime: '9 min read',
        publishedAt: '15/09/2026',
      },
      {
        id: 'art-logistics',
        slug: 'logistics-la-gi',
        title: 'What is Logistics? Everything you need to know about Logistics & Supply Chain Management',
        coverImage:
          'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/logistics-la-gi (1).png69c62be842c61.png',
        category: 'Career orientation',
        readTime: '11 min read',
        publishedAt: '28/08/2026',
      },
    ],
  },
  {
    id: 'art-sales',
    slug: 'nhan-vien-sales-la-gi',
    title: 'What is a Sales Representative? A to Z of a Sales career & tips to boost your income',
    category: 'Career orientation',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'A Sales career is a financial launchpad and builds outstanding resilience. Explore B2B and B2C Sales models, top deal-closing negotiation skills and the roadmap to Chief Commercial Officer (CCO).',
    coverImage: 'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/sales-la-gi (3).png6a673b584620f.png',
    publishedAt: '08/09/2026',
    readTime: '10 min read',
    viewsCount: '48.1K',
    isFeatured: true,
    tags: ['Sales', 'Kinh doanh', 'Negotiation', 'Soft skills', 'Commission income'],
    author: {
      name: 'Vu Minh Tuan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'B2B Sales Coach & Senior Recruiter',
    },
    tableOfContents: [
      { id: 'sales-la-gi', title: '1. What is a Sales Representative?', level: 1 },
      { id: 'cac-loai-hinh-sales', title: '2. Common types of Sales (B2B, B2C, Telesales)', level: 1 },
      { id: 'muc-luong-nghe-sales', title: '3. Sales income structure: base salary + commission', level: 1 },
      { id: 'lo-trinh-thang-tien-sales', title: '4. Career roadmap to CCO', level: 1 },
    ],
    sections: [
      {
        id: 'sales-la-gi',
        title: '1. What is a Sales Representative?',
        paragraphs: [
          'A Sales Representative directly connects with potential customers, introduces products/services, answers questions and drives purchase behavior to bring revenue to the company.',
          'A Sales career does not require demanding degrees, but it requires strong discipline, flexible thinking and the ability to handle sales pressure (KPI).',
        ],
      },
    ],
  },
  {
    id: 'art-logistics',
    slug: 'logistics-la-gi',
    title: 'What is Logistics? Everything you need to know about Logistics & Supply Chain',
    category: 'Career orientation',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Learn in detail about the lifeblood of the global economy: warehouse management, international Freight Forwarding, customs procedures and 2026 Logistics salaries.',
    coverImage:
      'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/logistics-la-gi (1).png69c62be842c61.png',
    publishedAt: '28/08/2026',
    readTime: '11 min read',
    viewsCount: '39.8K',
    isFeatured: true,
    tags: ['Logistics', 'Supply Chain', 'Import & export', 'Warehousing'],
    author: {
      name: 'Nguyen Thi Hai Yen',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      role: 'Logistics Expert & Supply Chain Consultant',
    },
    tableOfContents: [
      { id: 'logistics-la-gi', title: '1. What is Logistics?', level: 1 },
      { id: 'cac-vi-tri-trong-logistics', title: '2. Typical job positions', level: 1 },
      { id: 'muc-luong-nganh-logistics', title: '3. Detailed Logistics salary table', level: 1 },
    ],
    sections: [
      {
        id: 'logistics-la-gi',
        title: '1. What is Logistics?',
        paragraphs: [
          'Logistics is the chain of activities that plan, execute and control the movement of goods, information and finance from the point of origin to the final consumer.',
        ],
      },
    ],
  },
  {
    id: 'art-media',
    slug: 'nganh-truyen-thong-la-gi',
    title: 'What is Communications? Career prospects and detailed 2026 salaries',
    category: 'Industry knowledge',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'Multimedia communications, press PR, event organization and video creation: a field for young people who love creativity, connecting communities and building influence.',
    coverImage:
      'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-truyen-thong-la-gi-topcv-0.png67be7685174b7.png',
    publishedAt: '15/09/2026',
    readTime: '9 min read',
    viewsCount: '35.2K',
    tags: ['Communications', 'Press', 'PR', 'Events', 'Creative'],
    author: {
      name: 'Tran Bao Anh',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      role: 'Senior Communications Lead',
    },
    tableOfContents: [
      { id: 'truyen-thong-la-gi', title: '1. What is Communications?', level: 1 },
      { id: 'co-hoi-viec-lam', title: '2. Job opportunities in Communications', level: 1 },
    ],
    sections: [
      {
        id: 'truyen-thong-la-gi',
        title: '1. What is Communications?',
        paragraphs: [
          'Communications covers activities that convey messages, knowledge and values through language, images, sound and mass channels.',
        ],
      },
    ],
  },
  {
    id: 'art-it',
    slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
    title: 'Information Technology (IT): The roadmap from Fresher to Tech Lead & AI Engineer',
    category: 'Career orientation',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Explore the world of programming: Software Engineer, AI/Data Engineer, DevOps and Cybersecurity, with learning paths and the most attractive developer salaries on the market.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    publishedAt: '02/10/2026',
    readTime: '14 min read',
    viewsCount: '64.9K',
    tags: ['Information technology', 'Programming', 'AI Engineer', 'Fullstack', 'IT salary'],
    author: {
      name: 'Le Hoang Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      role: 'Principal Software Architect & Tech Mentor',
    },
    tableOfContents: [
      { id: 'it-la-gi', title: '1. What is Information Technology?', level: 1 },
      { id: 'cac-huong-di-it', title: '2. Typical career directions', level: 1 },
    ],
    sections: [
      {
        id: 'it-la-gi',
        title: '1. What is Information Technology?',
        paragraphs: [
          'Information Technology (IT) is the use of computers, software and telecommunications networks to store, secure, process and transmit digital information.',
        ],
      },
    ],
  },
  {
    id: 'art-finance',
    slug: 'nganh-tai-chinh-ngan-hang-la-gi',
    title: 'Finance - Banking: Highest-paying roles & 2026 Fintech trends',
    category: 'Industry knowledge',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'An overview of career opportunities in Finance: investment analyst, corporate Relationship Manager (RM), risk management and Fintech digital banking.',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    publishedAt: '25/09/2026',
    readTime: '11 min read',
    viewsCount: '29.3K',
    tags: ['Finance', 'Banking', 'Fintech', 'Investment', 'Financial analysis'],
    author: {
      name: 'Do Thuy Trang',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      role: 'CFA Charterholder & Financial Advisor',
    },
    tableOfContents: [
      { id: 'tai-chinh-la-gi', title: '1. What is Finance - Banking?', level: 1 },
      { id: 'cac-vi-tri-tai-chinh', title: '2. Notable career positions', level: 1 },
    ],
    sections: [
      {
        id: 'tai-chinh-la-gi',
        title: '1. What is Finance - Banking?',
        paragraphs: [
          'Finance - Banking studies cash flow, capital mobilization, profitable investment and financial risk management for individuals, businesses and financial institutions.',
        ],
      },
    ],
  },
];
