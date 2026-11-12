import type { JobDetail, RelatedJob } from '@/types/job';

export const TOPCV_JOB_2320413: JobDetail = {
  id: 2320413,
  slug: 'ke-toan-tong-hop-luong-den-20-trieu',
  title: 'General Accountant - Salary Up To 20 Million',
  company: {
    id: 237340,
    name: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ TỰ ĐỘNG HÓA ADI',
    logo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/68d4fafca98ba1758788348.png',
    size: '25 - 99 employees',
    industry: 'Automation & Industrial Equipment',
    address: 'Số nhà 20B7 Đầm Trấu, Phường Bạch Đằng (gần Hồng Hà), Quận Hai Bà Trưng, Hà Nội',
    website: 'https://adivietnam.com',
    isVerified: true,
    followers: '1.2k',
    description:
      'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ TỰ ĐỘNG HÓA ADI is a leading provider of industrial automation solutions, equipment and high-tech trading in the Vietnamese market.',
  },
  salary: {
    display: 'Up to 20 million',
    min: 15,
    max: 20,
    currency: 'VND',
    negotiable: true,
  },
  location: {
    city: 'Hà Nội',
    district: 'Hai Bà Trưng',
    specificAddress: 'Số nhà 20B7 Đầm Trấu, Phường Bạch Đằng, Quận Hai Bà Trưng, TP. Hà Nội',
    allLocations: ['Ba Đình', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Tây Hồ'],
  },
  experience: '5 years',
  deadline: '28/02/2026',
  daysRemaining: 15,
  level: 'Staff / Senior Specialist',
  recruitsCount: '2 people',
  workingType: 'On-site / Onsite',
  employmentType: 'Full-time',
  gender: 'Not required',
  isPro: true,
  isUrgent: true,
  highlightBadge: '🔥 Urgent hiring',
  tags: ['General accounting', 'Financial reporting', 'Tax accounting', 'Excel', 'Data control', 'Misa / Fast'],
  skills: [
    'Advanced Excel',
    'Office software',
    'Data analysis',
    'Accounting Practice',
    'Bookkeeping',
    'Financial Reporting',
    'Proficient In Accounting Software',
    'Risk Control',
  ],
  jobDescription: [
    'Record general entries, expenses, revenue and incurred allocations in the accounting software.',
    'Closely track receivables and payment progress for each contract, project and equipment business line.',
    'Review consolidated figures before periodic closing. Prepare internal management reports and project profit and loss analyses for each site for the Board of Directors.',
    'Promptly report potential risks in the assigned scope of work and in the document circulation process.',
    'Prepare monthly comparison reports on the gap between revenue and costs in management and finance to propose suitable, timely solutions.',
    "Verify the validity and legality of input and output invoices and accounting documents in accordance with the State's regulations.",
    'Prepare and review the issuance of electronic invoices to customers in line with current regulations.',
    'Reconcile project receivables and payables with customers, partners and suppliers.',
    "Receive, review and process payment, advance and advance-settlement requests from the company's departments.",
    'Perform monthly/quarterly/annual closing and prepare business performance reports.',
    'Declare and prepare periodic tax reports: VAT, personal income tax, corporate income tax and other tax obligations; prepare annual financial statements and explanatory reports as requested by superiors.',
    'Work directly with tax authorities, banks and other authorities when related matters arise.',
    'Fully prepare records, documents, books and vouchers for inspections, audits or tax finalization.',
  ],
  requirements: [
    'Graduated with a College or University degree in Accounting, Auditing, Corporate Finance or related economics fields.',
    'At least 5 years of experience as a General Accountant, Tax Accountant or equivalent positions.',
    'Strong command of accounting and tax practice, especially construction/trading cost accounting, data control, invoices and vouchers, and financial reporting.',
    'Deep understanding of, and regularly up to date on, the Accounting Law, the latest Circulars, Decrees and tax policies.',
    'Proficient in popular accounting software (MISA, FAST, Bravo...) and advanced Excel, with excellent office computing skills.',
    'Strong analytical and reconciliation skills, logical thinking, careful and meticulous, and proactive in proposing solutions to problems.',
    'Honest, highly responsible, able to work under pressure and committed to a long-term career with the company.',
  ],
  benefits: [
    'Competitive salary: 15 - 20 million VND/month (negotiable according to actual capability and experience).',
    'Performance bonus, project revenue bonus, quarterly bonus and 13th-month salary bonus.',
    "Bonuses for holidays, Tet and birthdays, plus family event gifts according to the Company's policies.",
    'Full social, health and unemployment insurance in accordance with the Labor Law right after the probation period.',
    'Dynamic, stable and friendly working environment with supportive colleagues and a manager who respects and listens to contributions.',
    'Fully equipped with tools, well-configured computers and modern equipment for work.',
    'Attractive benefits: annual trips 1-2 times a year, team building, monthly parties, lunch and fuel allowances.',
    'Clear career path up to Chief Accountant / Head of Finance & Accounting.',
  ],
  perks: [
    {
      icon: 'ShieldCheck',
      title: 'Full insurance',
      desc: 'Social, health and unemployment insurance by law',
    },
    {
      icon: 'Gift',
      title: '13th-month & Tet bonus',
      desc: 'Rich, attractive bonus policy',
    },
    {
      icon: 'Plane',
      title: 'Annual trips',
      desc: 'Team building and company retreats',
    },
    {
      icon: 'TrendingUp',
      title: 'Career growth',
      desc: 'Path to Chief Accountant',
    },
    {
      icon: 'Laptop',
      title: 'Modern equipment',
      desc: 'Computer and licensed software provided',
    },
    {
      icon: 'Coffee',
      title: 'Friendly environment',
      desc: 'Tea and snacks, lunch allowance, young culture',
    },
  ],
  workSchedule: {
    time: '08:00 - 17:30 (Lunch break 12:00 - 13:30)',
    days: 'Monday - Friday (full day) & Saturday (morning 08:00 - 12:00)',
  },
  categories: [
    { name: 'Accounting / Auditing / Tax jobs' },
    { name: 'General accounting' },
    { name: 'Jobs in Hà Nội' },
  ],
  atsMatchScore: 88,
  verifiedBadges: [
    'Company domain email verified',
    'Contact phone number verified',
    'Valid business license approved',
    'Recruiter account active for over 1 year, highly trusted',
  ],
};

import { getCompanyDetailById } from '@/mocks/company-detail.mock';

export const MOCK_RELATED_JOBS: RelatedJob[] = [
  {
    id: 9101,
    title: 'Chief Accountant for Construction & Real Estate Projects - Income 25-35 Million',
    company: 'Tập Đoàn Đầu Tư & Xây Dựng Nam Long',
    salary: '25 - 35 million',
    location: 'Hà Nội',
    deadline: '10 days left',
    tags: ['Chief accountant', 'Tax reporting', 'Construction'],
    isPro: true,
  },
  {
    id: 9102,
    title: 'Tax Accounting & Internal Control Specialist (MISA Preferred)',
    company: 'Công Ty CP Công Nghệ & Thương Mại Sen Vàng',
    salary: '14 - 18 million',
    location: 'Hà Nội',
    deadline: '8 days left',
    tags: ['Tax accounting', 'MISA', 'Internal control'],
  },
  {
    id: 9103,
    title: 'Warehouse Accountant & Receivables Manager for Retail Chain',
    company: 'Công Ty TNHH Bán Lẻ Hiện Đại SmartLife',
    salary: '10 - 13 million',
    location: 'Hà Nội',
    deadline: '12 days left',
    tags: ['Warehouse accounting', 'Receivables', 'Retail'],
  },
  {
    id: 9104,
    title: 'Senior Financial Analyst & Corporate Accounting Specialist',
    company: 'Techcombank Financial Solutions',
    salary: '22 - 30 million',
    location: 'Hà Nội',
    deadline: '18 days left',
    tags: ['Finance', 'Data analysis', 'Reporting'],
    isPro: true,
  },
];

function buildJobFromCompany(
  jobId: number,
  companyId: number,
  overrides: {
    title: string;
    salary: string;
    location: string;
    experience: string;
    deadline?: string;
    tags: string[];
    category: string;
    jobDescription: string[];
    requirements: string[];
    benefits?: string[];
    skills?: string[];
    isHot?: boolean;
    isUrgent?: boolean;
  },
): JobDetail {
  const company = getCompanyDetailById(companyId);

  return {
    id: jobId,
    title: overrides.title,
    company: {
      id: Number(company.id),
      name: company.name,
      logo: company.logo,
      cover: company.cover,
      size: company.size,
      industry: company.industry,
      address: company.address,
      website: company.website,
      isVerified: company.isVerified,
      followers: company.followers,
      description: company.description[0],
    },
    salary: {
      display: overrides.salary,
      negotiable: true,
    },
    location: {
      city: overrides.location.includes('Hồ Chí Minh') ? 'Hồ Chí Minh' : 'Hà Nội',
      specificAddress: company.address,
      allLocations: company.branches.map((b) => b.name),
    },
    experience: overrides.experience,
    deadline: overrides.deadline || '28/02/2026',
    daysRemaining: 15,
    level: 'Specialist / Staff',
    recruitsCount: '2 - 5 people',
    workingType: 'On-site / Onsite',
    employmentType: 'Full-time',
    gender: 'Not required',
    isPro: true,
    isUrgent: overrides.isUrgent ?? false,
    highlightBadge: overrides.isHot ? '🔥 Urgent hiring' : undefined,
    tags: overrides.tags,
    skills: overrides.skills || overrides.tags,
    jobDescription: overrides.jobDescription,
    requirements: overrides.requirements,
    benefits: overrides.benefits || company.benefits,
    perks: TOPCV_JOB_2320413.perks,
    workSchedule: {
      time: '08:00 - 17:30 (Lunch break 12:00 - 13:30)',
      days: 'Monday - Friday & Saturday morning',
    },
    categories: [{ name: overrides.category }, { name: 'Featured jobs' }],
    atsMatchScore: 92,
    verifiedBadges: [
      'Business license verified',
      'Professional working environment',
      'Transparent compensation policy',
    ],
  };
}

const JOBS_REGISTRY: Record<number, JobDetail> = {
  2320413: TOPCV_JOB_2320413,
  2320414: buildJobFromCompany(2320414, 237340, {
    title: 'PLC / SCADA Automation System Design Engineer - Income Up To 28 Million',
    salary: '18 - 28 million',
    location: 'Hà Nội (Hai Bà Trưng)',
    experience: '2 - 3 years',
    tags: ['Automation engineer', 'PLC', 'SCADA', 'Siemens'],
    category: 'Electromechanical Engineering / Automation',
    jobDescription: [
      'Survey and design automation control systems using Siemens, Schneider and Mitsubishi PLCs.',
      'Program and configure SCADA and HMI monitoring interfaces for industrial plants.',
      'Build and wire control cabinets, then commission and accept systems on site.',
    ],
    requirements: [
      'Graduated with a University degree in Automation, Mechatronics, or Electrical - Electronic Engineering.',
      'Proficient in PLC programming (Siemens TIA Portal, Step 7, WinCC or Mitsubishi GX Works).',
      'Good at reading industrial electrical drawings and ready to travel for projects.',
    ],
    isHot: true,
  }),
  2320415: buildJobFromCompany(2320415, 237340, {
    title: 'Industrial Automation Equipment Sales Specialist (B2B)',
    salary: '15 - 25 million',
    location: 'Hà Nội (Hai Bà Trưng)',
    experience: '1 year',
    tags: ['Sales B2B', 'Electrical equipment', 'Engineering'],
    category: 'Sales / Technical Sales',
    jobDescription: [
      'Find and develop business customers among manufacturers, factories and industrial enterprises.',
      'Provide technical consulting and quotations for Siemens, Schneider and Omron automation equipment.',
      'Follow up contracts, coordinate with the technical team on equipment handover and provide after-sales customer care.',
    ],
    requirements: [
      'Graduated with a College/University degree in Economics, Engineering, Electrical or Automation.',
      'Good negotiation and persuasion skills with B2B customers.',
    ],
  }),

  201: buildJobFromCompany(201, 224996, {
    title: 'Mat & Reformer Pilates Instructor (Full-time / Part-time) - Income 15 - 30 Million',
    salary: '15 - 30 million',
    location: 'Hà Nội (Ba Đình)',
    experience: '1 - 2 years',
    tags: ['Instructor', 'Pilates', 'Fitness', '1:1 coaching'],
    category: 'Sports / Health / Instructor',
    isHot: true,
    isUrgent: true,
    jobDescription: [
      'Directly guide and train students in Pilates on the mat and on specialized equipment (Reformer, Cadillac, Wunda Chair).',
      "Design personalized training plans for each student's body condition, body-shaping goals and spine recovery needs.",
      'Closely monitor student progress, answer questions and inspire a positive, healthy lifestyle.',
      'Maintain and clean Pilates equipment before and after each class to keep 5-star studio standards.',
    ],
    requirements: [
      'Hold a Pilates Instructor certificate (Mat / Reformer) or have at least 1 year of Fitness/Yoga teaching experience.',
      'Pleasant appearance, confident communication, elegant manner and dedication to students.',
      'Eager to learn and ready to join advanced professional training courses sponsored by the Studio.',
    ],
  }),
  202: buildJobFromCompany(202, 224996, {
    title: 'Studio Manager, Pilates Studio Đào Tấn - Salary 18 - 25 Million',
    salary: '18 - 25 million',
    location: 'Hà Nội (Ba Đình)',
    experience: '2 - 3 years',
    tags: ['Facility management', 'Studio operations', 'Member care'],
    category: 'Operations Management / Customer Service',
    isHot: true,
    jobDescription: [
      'Fully manage the daily operations of Studio Mẹ Gấu Pilates Đào Tấn.',
      'Coordinate instructor schedules, allocate training rooms and ensure 5-star service quality.',
      'Manage the reception and customer care team and oversee the facility revenue and costs.',
    ],
    requirements: [
      'At least 2 years of operations management experience in Fitness, Spa, Hotel or premium F&B.',
      'Strong people management skills, tactful problem handling and excellent customer service mindset.',
    ],
  }),
  203: buildJobFromCompany(203, 224996, {
    title: 'Pilates Course Consultant & Member Care Specialist - Income 12 - 20 Million',
    salary: '12 - 20 million',
    location: 'Hà Nội (Ba Đình)',
    experience: 'Not required',
    tags: ['Consulting', 'Wellness sales', 'Customer care'],
    category: 'Consulting / Service Sales',
    isUrgent: true,
    jobDescription: [
      'Welcome customers and advise on 1:1 and group Pilates packages that fit their needs.',
      'Take care of current members, answer questions and support package renewals.',
    ],
    requirements: [
      'Fluent communication, pleasant voice, energetic and passionate about health and beauty.',
      'Sales experience in Fitness, aesthetics or education is preferred.',
    ],
  }),
  204: buildJobFromCompany(204, 224996, {
    title: 'Studio Receptionist & Member Service Staff (Flexible Shifts) - Salary 7 - 10 Million',
    salary: '7 - 10 million',
    location: 'Hà Nội (Ba Đình)',
    experience: 'Not required',
    tags: ['Receptionist', 'Customer service', 'Flexible shifts'],
    category: 'Reception / Administration / Customer Care',
    jobDescription: [
      'Welcome members to the studio, check them in and prepare drinking water and training towels.',
      'Handle phone duty, record class bookings and keep the studio fragrant and tidy.',
    ],
    requirements: [
      'Pleasant appearance, friendly, careful and responsible.',
      'Able to work flexible shifts (morning/afternoon/evening).',
    ],
  }),
  205: buildJobFromCompany(205, 224996, {
    title: 'Content Creation & Social Media Specialist (Pilates & Lifestyle) - Salary Up To 16M',
    salary: '10 - 16 million',
    location: 'Hà Nội (Ba Đình)',
    experience: '1 year',
    tags: ['Content Creator', 'TikTok / Reels', 'Marketing'],
    category: 'Marketing / Communications',
    isHot: true,
    jobDescription: [
      'Write scripts and produce short videos for TikTok, Facebook Reels and Shorts about Pilates exercises and a healthy lifestyle.',
      'Photograph the studio space and students, and write communication content for social media channels.',
    ],
    requirements: [
      'Good aesthetic sense and basic video shooting and editing skills with CapCut/Premiere.',
      'Quickly catch trending content on TikTok/Instagram.',
    ],
  }),

  101: buildJobFromCompany(101, 1, {
    title: 'Senior Cloud & DevOps Infrastructure Architect (Viettel Cloud)',
    salary: '35 - 55 million',
    location: 'Hà Nội (Cầu Giấy)',
    experience: '3 - 5 years',
    tags: ['Cloud', 'Kubernetes', 'DevOps', 'AWS/Azure'],
    category: 'Information Technology / Cloud Computing',
    isHot: true,
    jobDescription: [
      'Design large-scale Cloud infrastructure architecture serving millions of users on the Viettel Cloud Platform.',
      'Build automated CI/CD systems and operate multi-cluster Kubernetes environments.',
    ],
    requirements: ['At least 3 years of in-depth experience in Linux, Kubernetes, Terraform and Cloud infrastructure.'],
  }),
  102: buildJobFromCompany(102, 1, {
    title: 'SOC Cyber Security Monitoring & Analysis Specialist',
    salary: '25 - 45 million',
    location: 'Hà Nội (Cầu Giấy)',
    experience: '2 years',
    tags: ['Cyber security', 'SOC', 'SIEM', 'Threat Intelligence'],
    category: 'Information Security / Cyber Security',
    isHot: true,
    isUrgent: true,
    jobDescription: [
      'Monitor, detect and respond to cyber attacks targeting critical customer systems.',
      'Analyze malware and security vulnerabilities and investigate digital incidents.',
    ],
    requirements: ['International security certificates (CEH, OSCP, CompTIA Security+) are a big plus.'],
  }),

  103: buildJobFromCompany(103, 1, {
    title: 'Senior Backend Engineer (Node.js / TypeScript / Microservices)',
    salary: '25 - 45 million',
    location: 'Hà Nội (Cầu Giấy)',
    experience: '3+ years',
    tags: ['Node.js', 'TypeScript', 'NestJS', 'PostgreSQL', 'Redis'],
    category: 'IT - Software / Backend Development',
    isHot: true,
    isUrgent: true,
    jobDescription: [
      'Design and develop backend services for the payment and digital solutions ecosystem with Node.js, TypeScript and NestJS.',
      'Optimize PostgreSQL performance, implement Redis caching and high-load Microservices architecture.',
      'Collaborate with the Frontend and DevOps teams to deliver CI/CD solutions and 24/7 system monitoring.',
    ],
    requirements: [
      'At least 3 years of backend development experience with Node.js / TypeScript (proficiency in NestJS/Express preferred).',
      'Solid knowledge of RESTful API, Microservices, Event-driven architecture and relational/NoSQL databases.',
      'Experience writing Unit Tests and Integration Tests and optimizing database queries.',
    ],
  }),

  4: buildJobFromCompany(4, 2, {
    title: 'Corporate Customer Relationship Manager (SME)',
    salary: '20 - 35 million',
    location: 'Hà Nội (Cầu Giấy)',
    experience: '1 - 3 years',
    tags: ['Finance - Banking', 'Customer relations', 'SME'],
    category: 'Banking / Corporate Credit',
    isHot: true,
    jobDescription: [
      'Find and develop small and medium enterprise (SME) customers using credit, guarantee and trade finance services.',
      'Appraise financial capability records, propose credit limits and manage the customer portfolio.',
    ],
    requirements: [
      'Graduated with a University degree in Economics, Finance, Banking or Foreign Trade.',
      'At least 1 year of corporate customer relationship experience at commercial banks.',
    ],
  }),
  2102: buildJobFromCompany(2102, 2, {
    title: 'Retail Customer Credit Appraisal Specialist (Priority Credit)',
    salary: '18 - 28 million',
    location: 'Hà Nội (Cầu Giấy)',
    experience: '2 years',
    tags: ['Appraisal', 'Credit', 'Banking'],
    category: 'Banking / Credit Appraisal',
    jobDescription: [
      'Appraise loan applications and asset collateral of premium individual customers.',
      'Assess financial risks and comply with credit risk control regulations of the State Bank.',
    ],
    requirements: ['At least 2 years of personal credit appraisal experience.'],
  }),

  5: buildJobFromCompany(5, 3, {
    title: 'Senior Frontend Engineer (React.js / Next.js / TypeScript)',
    salary: '30 - 50 million',
    location: 'Hà Nội & TP. HCM',
    experience: '3 - 5 years',
    tags: ['Frontend', 'ReactJS', 'Next.js', 'TypeScript'],
    category: 'IT - Software / Web Development',
    isHot: true,
    isUrgent: true,
    jobDescription: [
      'Develop large-scale Web applications for international projects (US, Japan and Europe markets).',
      'Build high-performance UI components and optimize page load speed and user experience.',
      'Take part in designing modern Frontend architecture with React, Next.js, TailwindCSS and Micro-frontends.',
    ],
    requirements: [
      'At least 3 years of experience with React.js, TypeScript and the Modern Web ecosystem.',
      'Proficient in web performance optimization, State Management (Zustand/Redux) and REST/GraphQL APIs.',
    ],
  }),
  301: buildJobFromCompany(301, 3, {
    title: 'Technical Architect Java / Microservices / Cloud AWS',
    salary: '45 - 75 million',
    location: 'Hà Nội (Hòa Lạc)',
    experience: '5+ years',
    tags: ['Java', 'Microservices', 'AWS', 'Architecture'],
    category: 'IT - Software / System Architecture',
    isHot: true,
    jobDescription: [
      'Responsible for the overall technical architecture design of Enterprise-scale software solutions.',
      'Set technology direction and solve High Concurrency and system scalability challenges.',
    ],
    requirements: ['More than 5 years of Java / Spring Boot backend and Cloud Microservices architecture experience.'],
  }),

  302: buildJobFromCompany(302, 3, {
    title: 'Fullstack Developer (Node.js / React.js / Next.js)',
    salary: '20 - 35 million',
    location: 'Hà Nội & TP. HCM',
    experience: '2+ years',
    tags: ['Node.js', 'ReactJS', 'Next.js', 'TypeScript', 'REST API'],
    category: 'IT - Software / Fullstack Development',
    isHot: true,
    jobDescription: [
      'Develop Fullstack features from the React/Next.js user interface to the Node.js backend API system.',
      'Optimize the user interface and integrate third-party services through RESTful APIs.',
    ],
    requirements: [
      'At least 2 years of experience with the JavaScript/TypeScript ecosystem (Node.js and React/Next.js).',
      'Understanding of SQL/NoSQL databases and the Agile/Scrum development process.',
    ],
  }),

  401: buildJobFromCompany(401, 4, {
    title: 'Data Engineer & Big Data Platform Specialist',
    salary: '30 - 50 million',
    location: 'Hà Nội (Hoàn Kiếm)',
    experience: '2 - 4 years',
    tags: ['Data Engineer', 'Big Data', 'Spark', 'SQL'],
    category: 'Information Technology / Big Data',
    isHot: true,
    jobDescription: [
      'Build and maintain Data Pipelines that process real-time big data for the Techcombank digital banking platform.',
      'Work with Spark, Kafka, Airflow, Hadoop and Data Lakehouse.',
    ],
    requirements: ['Proficient in Python/Scala and SQL query optimization, with experience in the Big Data Stack.'],
  }),

  501: buildJobFromCompany(501, 5, {
    title: 'Game Server Developer (C++ / Go / Distributed Systems)',
    salary: '25 - 45 million',
    location: 'TP. Hồ Chí Minh (Quận 7)',
    experience: '2 years',
    tags: ['Game Dev', 'Golang', 'C++', 'Backend'],
    category: 'IT - Software / Game Development',
    isHot: true,
    jobDescription: [
      'Develop real-time Multiplayer Game Server systems serving hundreds of thousands of concurrent players.',
      'Optimize network latency, data synchronization and anti-cheat security in games.',
    ],
    requirements: ['Proficient in C++ or Go, with deep knowledge of Sockets, TCP/UDP and distributed algorithms.'],
  }),

  601: buildJobFromCompany(601, 6, {
    title: 'Business Development & Category Management Lead',
    salary: '22 - 38 million',
    location: 'TP. Hồ Chí Minh (Quận 1)',
    experience: '2 - 4 years',
    tags: ['E-commerce', 'Category Manager', 'Business Development'],
    category: 'E-commerce / Business Development',
    isHot: true,
    jobDescription: [
      'Manage and develop target categories on the Shopee platform, driving GMV and the number of quality sellers.',
      'Analyze consumer shopping behavior and optimize Mega Sale campaigns and exclusive deals.',
    ],
    requirements: ['2-4 years of experience in E-commerce, Retail or Brand Management.'],
  }),

  701: buildJobFromCompany(701, 7, {
    title: 'Brand Manager - Condiments & Beverages Category, Masan Consumer',
    salary: '25 - 40 million',
    location: 'TP. Hồ Chí Minh (Quận 1)',
    experience: '3 years',
    tags: ['Brand Manager', 'FMCG', 'Marketing'],
    category: 'Marketing / Brand Management',
    isHot: true,
    jobDescription: [
      'Build brand strategy, new product launch plans and run multi-channel communication campaigns.',
      'Work with Trade Marketing and Sales to achieve market coverage and category market share goals.',
    ],
    requirements: ['At least 3 years of Brand Manager experience in FMCG or fast-moving consumer goods.'],
  }),

  801: buildJobFromCompany(801, 8, {
    title: 'Senior Personal Finance Consultant (Priority RM)',
    salary: '18 - 35 million',
    location: 'Hà Nội & TP. HCM',
    experience: '1 - 2 years',
    tags: ['Priority RM', 'Finance', 'Banking'],
    category: 'Banking / Financial Investment Consulting',
    isHot: true,
    jobDescription: [
      'Advise on comprehensive financial solutions: Savings, Bonds, Fund Certificates and exclusive VIP Credit Cards.',
      'Care for and grow the net worth of the priority customer segment (VPBank Diamond).',
    ],
    requirements: ['Courteous manner, with excellent financial advisory and relationship-building skills.'],
  }),
};

export function getJobDetailById(id: string | number): JobDetail {
  const numericId = Number(id);

  if (JOBS_REGISTRY[numericId]) {
    return JOBS_REGISTRY[numericId];
  }

  return {
    ...TOPCV_JOB_2320413,
    id: numericId || 2320413,
    title:
      numericId === 1
        ? 'Sales & E-commerce Operations Staff - Income Up To 18M'
        : numericId === 2
          ? 'International Bank Appointment Reminder Staff - High Income Up To 28 Million'
          : numericId === 3
            ? 'Import-Export Customs Declaration Staff in Hà Nội'
            : numericId === 6
              ? 'Digital Marketing & Brand Performance Team Lead'
              : numericId === 7
                ? 'Supermarket Goods Delivery Staff by Motorbike'
                : numericId === 8
                  ? 'Cashier & Counter Sales Staff, Flexible Shifts'
                  : numericId === 9
                    ? 'Home Appliance Installation & Maintenance Technician'
                    : TOPCV_JOB_2320413.title,
    company: {
      ...TOPCV_JOB_2320413.company,
      name:
        numericId === 1
          ? 'Công ty TNHH ZETACOM'
          : numericId === 2
            ? 'Công ty TNHH Vietnam Concentrix Services'
            : numericId === 3
              ? 'Bee Logistics Corporation'
              : numericId === 6
                ? 'Tập Đoàn Vingroup'
                : numericId === 7
                  ? 'Chuỗi Siêu Thị WinMart (Masan Group)'
                  : numericId === 8
                    ? 'Hệ Thống Bán Lẻ Con Cưng'
                    : numericId === 9
                      ? 'Tập Đoàn Điện Máy Xanh'
                      : TOPCV_JOB_2320413.company.name,
      id: numericId === 7 ? 7 : TOPCV_JOB_2320413.company.id,
    },
    salary: {
      ...TOPCV_JOB_2320413.salary,
      display:
        numericId === 1
          ? 'Negotiable'
          : numericId === 2
            ? 'Up to 28 million'
            : numericId === 3
              ? '11 - 14 million'
              : numericId === 6
                ? '25 - 40 million'
                : numericId === 7
                  ? '10 - 15 million'
                  : numericId === 8
                    ? '7 - 10 million'
                    : numericId === 9
                      ? '12 - 18 million'
                      : TOPCV_JOB_2320413.salary.display,
    },
  };
}
