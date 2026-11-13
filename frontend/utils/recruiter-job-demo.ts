import { skillApi } from '@/apiRequest/recruiter-job';
import type { JobPostFormData, SkillOption } from '@/schemas/job.schema';
import { defaultDeadline } from '@/utils/recruiter-job';

const DEMO_SKILL_NAMES = ['Java', 'Spring Boot', 'MySQL', 'Docker'];

async function findSkill(name: string): Promise<SkillOption | null> {
  const matches = await skillApi.suggest(name);
  const match = matches.find((skill) => skill.name.toLowerCase() === name.toLowerCase()) ?? matches[0];
  return match ? { id: match.id, name: match.name } : null;
}

export async function buildDemoJobValues(): Promise<JobPostFormData> {
  const found = await Promise.all(DEMO_SKILL_NAMES.map(findSkill));
  const skills = found.filter((skill): skill is SkillOption => skill !== null);

  return {
    title: 'Senior Java Backend Engineer',
    level: 'SENIOR',
    jobRole: 'BACKEND',
    experienceMinYears: 4,
    experienceMaxYears: 8,
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    city: 'TP. Hồ Chí Minh',
    address: '84A Nguyen Hong, Hanh Thong',
    salaryNegotiable: false,
    salaryMin: 25,
    salaryMax: 40,
    currency: 'VND',
    salaryBasis: 'GROSS',
    skills: skills.filter((skill, index, all) => all.findIndex((other) => other.id === skill.id) === index),
    description: [
      'Join our platform team to design, build and operate the backend services behind our AI recruitment products. You will own features end to end, from API design to production monitoring.',
      'Our platform serves hundreds of thousands of candidates and recruiters every month. The backend is a modular monolith on Java and Spring Boot, backed by MySQL and Redis, and deployed with Docker on a cloud environment.',
      'What you will do:',
      '- Design and implement REST APIs for job posting, applications, interview scheduling and AI-assisted screening',
      '- Model data and write efficient SQL, review slow queries and plan safe database migrations',
      '- Improve reliability and performance: caching, rate limiting, background processing and monitoring',
      '- Review code, mentor junior engineers and help shape our engineering practices',
      '- Work closely with product, frontend and mobile teams to ship features every sprint',
      '- Take part in on-call rotation and incident reviews to keep the platform healthy',
    ].join('\n'),
    requirements: [
      '4+ years of professional Java experience',
      'Strong knowledge of Spring Boot, Spring Data JPA and REST API design',
      'Solid SQL skills, preferably MySQL: indexing, query tuning and transactions',
      'Experience with Redis or another cache, and with message queues is a plus',
      'Comfortable with Docker, Git and CI/CD pipelines',
      'Good understanding of authentication, authorization and secure coding practices',
      'Able to write clean, testable code and to document design decisions',
      'Good communication skills and a habit of sharing knowledge with the team',
      'Bachelor degree in Computer Science or a related field, or equivalent experience',
    ].join('\n'),
    benefits: [
      '13th-month salary and performance bonus reviewed twice a year',
      'Premium health insurance for you and extra coverage for your family',
      'MacBook Pro, external monitor and a yearly learning budget for courses and certifications',
      'Hybrid working: 3 office days and 2 remote days per week, flexible start time',
      '15 days of annual leave plus public holidays and birthday leave',
      'Lunch allowance, free snacks and coffee at the office',
      'Quarterly team building, company trip and tech talks every month',
      'Clear career path with salary review and promotion twice a year',
    ].join('\n'),
    benefitTags: [
      'HEALTH_INSURANCE',
      'BONUS_13TH_MONTH',
      'PERFORMANCE_BONUS',
      'LAPTOP',
      'TRAINING',
      'TEAM_BUILDING',
      'FLEXIBLE_HOURS',
      'REMOTE_DAYS',
      'ANNUAL_LEAVE',
      'MEALS',
    ],
    hiringSteps: [
      { title: 'CV screening' },
      { title: 'Online coding test' },
      { title: 'Technical interview' },
      { title: 'HR interview' },
      { title: 'Offer' },
    ],
    deadline: defaultDeadline(),
    openings: 3,
    screeningQuestions: [
      {
        type: 'CHOICE',
        prompt: 'How many years of Java experience do you have?',
        required: true,
        options: ['Less than 2 years', '2-4 years', '4-6 years', 'More than 6 years'],
      },
      {
        type: 'SHORT_TEXT',
        prompt: 'Describe a backend project you are proud of.',
        required: false,
        options: [],
      },
    ],
  };
}
