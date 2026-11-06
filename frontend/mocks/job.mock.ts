// TEMP: replace with API
import type { ContractType, JobLevel, WorkingArrangement } from '@/types/recruiter-job';

export interface MockScreeningQuestion {
  id: string;
  question: string;
  required: boolean;
  type: 'TEXT' | 'YES_NO' | 'SINGLE_CHOICE';
  options?: string[];
}

export interface MockRecruiterJobPost {
  id: string;
  title: string;
  status: string;
  level: JobLevel;
  contractType: ContractType;
  workingArrangement: WorkingArrangement;
  location: { city: string; district?: string; specificAddress?: string };
  salary: { negotiable: boolean; min?: number; max?: number; currency?: 'VND' | 'USD'; period?: 'MONTHLY' };
  skills: string[];
  description: string;
  requirements: string;
  benefits: string;
  screeningQuestions: MockScreeningQuestion[];
  recruitsCount: number;
  applicantsCount?: number;
  newApplicantsCount?: number;
  viewsCount?: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  rejectionReason?: string;
  aiGenerated?: { description?: boolean; requirements?: boolean };
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  publishedAt?: string;
}

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const daysFromNow = (days: number) => new Date(NOW + days * DAY).toISOString();
const daysAgo = (days: number) => new Date(NOW - days * DAY).toISOString();

export const MOCK_RECRUITER_JOB_POSTS: MockRecruiterJobPost[] = [
  {
    id: 'job-001',
    title: 'Backend Engineer (Java/Spring Boot)',
    status: 'PUBLISHED',
    level: 'MID',
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    location: { city: 'Hanoi', district: 'Cau Giay', specificAddress: 'Duy Tan, Dich Vong Hau' },
    salary: { negotiable: false, min: 20000000, max: 35000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    description:
      'We are looking for a Backend Engineer experienced with Java and Spring Boot to help build the InterVue hiring platform. You will work directly with the engineering team to design and ship APIs serving thousands of users.',
    requirements:
      'At least 2 years of experience with Java/Spring Boot. Solid understanding of relational database design. Experience with Redis and caching systems is a plus.',
    benefits: '13th-month salary, premium health insurance, 15 annual leave days, flexible hybrid work.',
    screeningQuestions: [
      {
        id: 'sq-1',
        question: 'How many years of experience do you have with Spring Boot?',
        required: true,
        type: 'TEXT',
      },
      { id: 'sq-2', question: 'Are you able to work hybrid in Hanoi?', required: true, type: 'YES_NO' },
    ],
    recruitsCount: 2,
    applicantsCount: 28,
    newApplicantsCount: 6,
    viewsCount: 540,
    isFeatured: true,
    aiGenerated: { description: true },
    createdAt: daysAgo(25),
    updatedAt: daysAgo(2),
    publishedAt: daysAgo(24),
    expiresAt: daysFromNow(5), // Expiring in 5 days!
  },
  {
    id: 'job-002',
    title: 'Senior Frontend Engineer (React/Next.js)',
    status: 'PUBLISHED',
    level: 'SENIOR',
    contractType: 'FULL_TIME',
    workingArrangement: 'REMOTE',
    location: { city: 'Ho Chi Minh City', district: 'District 1' },
    salary: { negotiable: false, min: 35000000, max: 55000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    description:
      'Build the user interface of the InterVue hiring platform with Next.js and TypeScript, working closely with the design team to deliver a smooth experience for both candidates and recruiters.',
    requirements:
      'Strong React & Next.js App Router skills. Deep knowledge of TypeScript, performance optimization and state management.',
    benefits: 'Fully remote, latest M3 MacBook Pro provided, salary review twice a year, annual company retreat.',
    screeningQuestions: [],
    recruitsCount: 2,
    applicantsCount: 19,
    newApplicantsCount: 4,
    viewsCount: 680,
    isUrgent: true,
    createdAt: daysAgo(18),
    updatedAt: daysAgo(1),
    publishedAt: daysAgo(17),
    expiresAt: daysFromNow(22),
  },
  {
    id: 'job-003',
    title: 'DevOps & Cloud Engineer (AWS/K8s)',
    status: 'PAUSED',
    level: 'SENIOR',
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    location: { city: 'Hanoi', district: 'Nam Tu Liem' },
    salary: { negotiable: true },
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
    description:
      'Own the deployment infrastructure, CI/CD pipelines and system monitoring across the whole InterVue platform.',
    requirements:
      'At least 4 years of DevOps experience, strong Docker/Kubernetes skills, hands-on experience with AWS and Terraform.',
    benefits: 'Quarterly performance bonus, health insurance for your family, annual training budget.',
    screeningQuestions: [
      {
        id: 'sq-3',
        question: 'Have you operated Kubernetes at production scale?',
        required: true,
        type: 'YES_NO',
      },
    ],
    recruitsCount: 1,
    applicantsCount: 11,
    newApplicantsCount: 0,
    viewsCount: 290,
    createdAt: daysAgo(40),
    updatedAt: daysAgo(5),
    publishedAt: daysAgo(39),
    expiresAt: daysFromNow(12),
  },
  {
    id: 'job-004',
    title: 'QA Automation Engineer (Cypress/Playwright)',
    status: 'DRAFT',
    level: 'MID',
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    location: { city: 'Hanoi' },
    salary: { negotiable: false, min: 18000000, max: 28000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['Selenium', 'Cypress', 'Playwright', 'Test Automation'],
    description: 'Build automated end-to-end and integration test suites for core recruitment workflows.',
    requirements: 'Solid experience with Cypress or Playwright, CI integration, and test scenario design.',
    benefits: 'Supportive team, 14 days annual leave, hybrid work policy.',
    screeningQuestions: [],
    recruitsCount: 1,
    applicantsCount: 0,
    newApplicantsCount: 0,
    viewsCount: 0,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: 'job-005',
    title: 'Mobile Engineer (Flutter/Dart)',
    status: 'PENDING_REVIEW',
    level: 'MID',
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    location: { city: 'Da Nang', district: 'Hai Chau' },
    salary: { negotiable: false, min: 20000000, max: 32000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['Flutter', 'Dart', 'REST API', 'Bloc'],
    description:
      'Develop the InterVue mobile app with Flutter, keeping data in sync with the web platform for both candidates and recruiters.',
    requirements: 'At least 2 years of Flutter experience and solid knowledge of state management (Bloc/Riverpod).',
    benefits: 'Project bonus, MacBook laptop, in-house technical training.',
    screeningQuestions: [
      {
        id: 'sq-4',
        question: 'Have you published an app to the App Store or Google Play?',
        required: false,
        type: 'TEXT',
      },
    ],
    recruitsCount: 1,
    applicantsCount: 0,
    newApplicantsCount: 0,
    viewsCount: 0,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: 'job-006',
    title: 'Data Analyst (SQL/BI/Python)',
    status: 'CLOSED',
    level: 'JUNIOR',
    contractType: 'FULL_TIME',
    workingArrangement: 'ON_SITE',
    location: { city: 'Hanoi', district: 'Ba Dinh' },
    salary: { negotiable: false, min: 14000000, max: 20000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['SQL', 'Power BI', 'Python', 'Data Warehousing'],
    description: 'Analyse hiring data and build reports that support decision-making for the business team.',
    requirements: 'Strong SQL skills and experience with a BI tool (Power BI/Tableau). Analytical mindset.',
    benefits: 'Young, dynamic environment with a clear promotion path.',
    screeningQuestions: [],
    recruitsCount: 1,
    applicantsCount: 45,
    newApplicantsCount: 0,
    viewsCount: 920,
    createdAt: daysAgo(70),
    updatedAt: daysAgo(10),
    publishedAt: daysAgo(69),
    expiresAt: daysAgo(10),
  },
  {
    id: 'job-007',
    title: 'Product Designer (UI/UX - Design System)',
    status: 'EXPIRED',
    level: 'MID',
    contractType: 'FULL_TIME',
    workingArrangement: 'REMOTE',
    location: { city: 'Ho Chi Minh City' },
    salary: { negotiable: false, min: 22000000, max: 35000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['Figma', 'Design System', 'User Research', 'Prototyping'],
    description: 'Design the user experience across InterVue products, building and maintaining the design system.',
    requirements: 'At least 3 years of product design experience and strong Figma skills. Strong portfolio required.',
    benefits: 'Remote work with a flexible schedule, creative autonomy.',
    screeningQuestions: [],
    recruitsCount: 1,
    applicantsCount: 32,
    newApplicantsCount: 0,
    viewsCount: 750,
    createdAt: daysAgo(65),
    updatedAt: daysAgo(8),
    publishedAt: daysAgo(64),
    expiresAt: daysAgo(4), // Expired 4 days ago
  },
  {
    id: 'job-008',
    title: 'Technical Lead (Fullstack Node.js/React)',
    status: 'REJECTED',
    level: 'LEAD',
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    location: { city: 'Hanoi', district: 'Cau Giay' },
    salary: { negotiable: true },
    skills: ['Node.js', 'React', 'System Design', 'PostgreSQL'],
    description: 'Lead the engineering team building the core modules of the InterVue platform.',
    requirements: 'At least 6 years of experience, including leading an engineering team in agile sprints.',
    benefits: 'ESOP shares and a team performance bonus, executive coaching.',
    screeningQuestions: [],
    recruitsCount: 1,
    applicantsCount: 0,
    newApplicantsCount: 0,
    viewsCount: 0,
    rejectionReason:
      'The compensation details are missing specifics. Please declare an estimated salary range before resubmitting for review.',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(9),
  },
  {
    id: 'job-009',
    title: 'AI/ML Engineer (LLMs & RAG Systems)',
    status: 'PUBLISHED',
    level: 'SENIOR',
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    location: { city: 'Hanoi', district: 'Cau Giay' },
    salary: { negotiable: false, min: 40000000, max: 65000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Vector DB'],
    description:
      'Design, develop and optimize LLM pipelines, RAG frameworks and interview scoring models for our recruitment intelligence platform.',
    requirements:
      'At least 3 years in AI/ML with practical experience building LLM applications, embedding fine-tuning, and semantic search.',
    benefits: 'Top-tier market salary, cloud compute credits, conference attendance sponsorship.',
    screeningQuestions: [
      {
        id: 'sq-5',
        question: 'Describe your hands-on experience with Vector Databases (Milvus, Qdrant, Pinecone)?',
        required: true,
        type: 'TEXT',
      },
    ],
    recruitsCount: 2,
    applicantsCount: 14,
    newApplicantsCount: 5,
    viewsCount: 840,
    isFeatured: true,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(1),
    publishedAt: daysAgo(13),
    expiresAt: daysFromNow(17),
  },
  {
    id: 'job-010',
    title: 'Golang Backend Developer (High Concurrency)',
    status: 'PUBLISHED',
    level: 'MID',
    contractType: 'FULL_TIME',
    workingArrangement: 'ON_SITE',
    location: { city: 'Ho Chi Minh City', district: 'District 7' },
    salary: { negotiable: false, min: 25000000, max: 38000000, currency: 'VND', period: 'MONTHLY' },
    skills: ['Golang', 'gRPC', 'PostgreSQL', 'Kafka'],
    description: 'Scale our distributed message bus, webhook handlers and realtime candidate notification pipelines.',
    requirements: 'Solid background in Golang concurrency patterns (goroutines, channels), gRPC, and Kafka streaming.',
    benefits: 'Annual performance bonus, modern ergonomic workspace, continuous learning allowances.',
    screeningQuestions: [],
    recruitsCount: 1,
    applicantsCount: 8,
    newApplicantsCount: 2,
    viewsCount: 310,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(2),
    publishedAt: daysAgo(7),
    expiresAt: daysFromNow(23),
  },
];
