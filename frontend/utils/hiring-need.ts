import {
  RECRUITER_BUDGET_SOURCE_OPTIONS,
  RECRUITER_LEVEL_OPTIONS,
  RECRUITER_POSITION_OPTIONS,
} from '@/constants/recruiter-onboarding';
import type { HiringNeed } from '@/types/recruiter-hiring-need';
import { formatDate } from '@/utils/datetime';
import { formatCurrencyVND } from '@/utils/salary';

const findLabel = (options: ReadonlyArray<{ value: string; label: string }>, value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

const formatBudget = ({ budgetFrom, budgetTo }: HiringNeed) => {
  if (budgetFrom === '' && budgetTo === '') return 'Not specified';
  if (budgetTo === '') return `From ${formatCurrencyVND(Number(budgetFrom))}`;
  if (budgetFrom === '') return `Up to ${formatCurrencyVND(Number(budgetTo))}`;
  return `${formatCurrencyVND(Number(budgetFrom))} – ${formatCurrencyVND(Number(budgetTo))}`;
};

export function describeHiringNeed(need: HiringNeed) {
  return {
    role: findLabel(RECRUITER_POSITION_OPTIONS, need.position),
    level: findLabel(RECRUITER_LEVEL_OPTIONS, need.level),
    hireBy: need.continuous ? 'Continuous' : formatDate(need.hireBy),
    budget: formatBudget(need),
    budgetSource: findLabel(RECRUITER_BUDGET_SOURCE_OPTIONS, need.budgetSource),
  };
}
