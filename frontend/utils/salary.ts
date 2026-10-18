import { GrossNetCalculationResult } from '@/types/blog';

export const SALARY_CONSTANTS = {
  SOCIAL_INSURANCE_RATE: 0.08,
  HEALTH_INSURANCE_RATE: 0.015,
  UNEMPLOYMENT_INSURANCE_RATE: 0.01,
  TOTAL_INSURANCE_RATE: 0.105,

  EMPLOYER_SOCIAL_RATE: 0.175,
  EMPLOYER_HEALTH_RATE: 0.03,
  EMPLOYER_UNEMPLOYMENT_RATE: 0.01,
  EMPLOYER_OCCUPATIONAL_ACCIDENT_RATE: 0.005,
  EMPLOYER_TOTAL_RATE: 0.22,

  PERSONAL_DEDUCTION: 11_000_000,
  DEPENDENT_DEDUCTION: 4_400_000,

  MAX_SOCIAL_BASE: 46_800_000,
  MAX_UNEMPLOYMENT_BASE_REGION_1: 99_200_000,
};

const TAX_BRACKETS = [
  { limit: 5_000_000, rate: 0.05, subtraction: 0 },
  { limit: 10_000_000, rate: 0.1, subtraction: 250_000 },
  { limit: 18_000_000, rate: 0.15, subtraction: 750_000 },
  { limit: 32_000_000, rate: 0.2, subtraction: 1_650_000 },
  { limit: 52_000_000, rate: 0.25, subtraction: 3_250_000 },
  { limit: 80_000_000, rate: 0.3, subtraction: 5_850_000 },
  { limit: Infinity, rate: 0.35, subtraction: 9_850_000 },
];

export function calculateGrossToNet(gross: number, dependentsCount: number = 0): GrossNetCalculationResult {
  const validGross = Math.max(0, gross);

  const socialHealthBase = Math.min(validGross, SALARY_CONSTANTS.MAX_SOCIAL_BASE);
  const unemploymentBase = Math.min(validGross, SALARY_CONSTANTS.MAX_UNEMPLOYMENT_BASE_REGION_1);

  const socialInsurance = Math.round(socialHealthBase * SALARY_CONSTANTS.SOCIAL_INSURANCE_RATE);
  const healthInsurance = Math.round(socialHealthBase * SALARY_CONSTANTS.HEALTH_INSURANCE_RATE);
  const unemploymentInsurance = Math.round(unemploymentBase * SALARY_CONSTANTS.UNEMPLOYMENT_INSURANCE_RATE);
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  const incomeBeforeTax = validGross - totalInsurance;

  const personalDeduction = SALARY_CONSTANTS.PERSONAL_DEDUCTION;
  const dependentDeduction = Math.max(0, dependentsCount) * SALARY_CONSTANTS.DEPENDENT_DEDUCTION;
  const totalDeductions = personalDeduction + dependentDeduction;

  const taxableIncome = Math.max(0, incomeBeforeTax - totalDeductions);

  let personalIncomeTax = 0;
  const taxTiers: { tier: number; rate: number; amount: number }[] = [];

  if (taxableIncome > 0) {
    let remainingIncome = taxableIncome;
    let prevLimit = 0;

    for (let i = 0; i < TAX_BRACKETS.length; i++) {
      const bracket = TAX_BRACKETS[i];
      const bracketSpan = bracket.limit - prevLimit;

      if (remainingIncome > 0) {
        const taxableAmountInBracket = Math.min(remainingIncome, bracketSpan);
        const taxInBracket = Math.round(taxableAmountInBracket * bracket.rate);
        taxTiers.push({
          tier: i + 1,
          rate: bracket.rate * 100,
          amount: taxInBracket,
        });
        personalIncomeTax += taxInBracket;
        remainingIncome -= taxableAmountInBracket;
      }
      prevLimit = bracket.limit;
      if (remainingIncome <= 0) break;
    }
  }

  const netSalary = validGross - totalInsurance - personalIncomeTax;

  const employerSocial = Math.round(socialHealthBase * SALARY_CONSTANTS.EMPLOYER_SOCIAL_RATE);
  const employerHealth = Math.round(socialHealthBase * SALARY_CONSTANTS.EMPLOYER_HEALTH_RATE);
  const employerUnemployment = Math.round(unemploymentBase * SALARY_CONSTANTS.EMPLOYER_UNEMPLOYMENT_RATE);
  const employerAccident = Math.round(socialHealthBase * SALARY_CONSTANTS.EMPLOYER_OCCUPATIONAL_ACCIDENT_RATE);
  const employerTotalInsurance = employerSocial + employerHealth + employerUnemployment + employerAccident;
  const totalEmployerCost = validGross + employerTotalInsurance;

  return {
    grossSalary: validGross,
    netSalary,
    insurance: {
      social: socialInsurance,
      health: healthInsurance,
      unemployment: unemploymentInsurance,
      total: totalInsurance,
    },
    employerCost: {
      social: employerSocial,
      health: employerHealth,
      unemployment: employerUnemployment,
      occupationalAccident: employerAccident,
      total: employerTotalInsurance,
      totalEmployerCost,
    },
    deductions: {
      personal: personalDeduction,
      dependents: dependentDeduction,
      total: totalDeductions,
    },
    taxableIncome,
    personalIncomeTax,
    taxTiers,
  };
}

export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
