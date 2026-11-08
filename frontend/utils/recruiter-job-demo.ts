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
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    city: 'Hà Nội',
    address: 'Keangnam Landmark 72, Nam Tu Liem',
    salaryNegotiable: false,
    salaryMin: 25,
    salaryMax: 40,
    currency: 'VND',
    skills: skills.filter((skill, index, all) => all.findIndex((other) => other.id === skill.id) === index),
    description:
      'Join our platform team to design, build and operate the backend services behind our AI recruitment products. You will own features end to end, from API design to production monitoring.',
    requirements:
      '4+ years of professional Java experience\nStrong knowledge of Spring Boot and REST API design\nSolid SQL skills, preferably MySQL\nComfortable with Docker and CI/CD pipelines',
    benefits:
      '13th-month salary and performance bonus\nPremium health insurance\nMacBook Pro and annual learning budget\nFlexible hybrid working',
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
