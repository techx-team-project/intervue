// TEMP: replace with API
import type { HiringNeed } from '@/types/recruiter-hiring-need';

const DAY_MS = 86_400_000;
const isoDateInDays = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString().slice(0, 10);

export const MOCK_RECRUITER_HIRING_NEEDS: HiringNeed[] = [
  {
    id: 'need-001',
    position: 'BACKEND',
    level: 'MID',
    hireBy: isoDateInDays(42),
    continuous: false,
    headcount: 2,
    budgetFrom: '25000000',
    budgetTo: '40000000',
    budgetSource: 'COMPANY',
  },
  {
    id: 'need-002',
    position: 'FRONTEND',
    level: 'JUNIOR',
    hireBy: '',
    continuous: true,
    headcount: 3,
    budgetFrom: '15000000',
    budgetTo: '22000000',
    budgetSource: 'COMPANY',
  },
  {
    id: 'need-003',
    position: 'AI_ML',
    level: 'SENIOR',
    hireBy: isoDateInDays(89),
    continuous: false,
    headcount: 1,
    budgetFrom: '',
    budgetTo: '',
    budgetSource: 'PERSONAL',
  },
];
