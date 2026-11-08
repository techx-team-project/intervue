'use client';

import React, { useState, useMemo } from 'react';
import { calculateGrossToNet, formatCurrencyVND } from '@/utils/salary';
import {
  Calculator,
  ArrowRightLeft,
  ShieldCheck,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  Percent,
  Coins,
} from 'lucide-react';

export default function GrossNetCalculatorWidget() {
  const [calculationMode, setCalculationMode] = useState<'grossToNet' | 'netToGross'>('grossToNet');
  const [salaryInput, setSalaryInput] = useState<string>('25000000');
  const [dependents, setDependents] = useState<number>(0);
  const [region, setRegion] = useState<number>(1);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  const numericSalary = useMemo(() => {
    const val = parseInt(salaryInput.replace(/\D/g, ''), 10);
    return isNaN(val) ? 0 : val;
  }, [salaryInput]);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setSalaryInput(rawVal);
  };

  const handleQuickSalary = (amount: number) => {
    setSalaryInput(amount.toString());
  };

  const result = useMemo(() => {
    if (calculationMode === 'grossToNet') {
      return calculateGrossToNet(numericSalary, dependents);
    } else {
      let low = numericSalary;
      let high = numericSalary * 2.5;
      let estimatedGross = numericSalary;

      for (let i = 0; i < 40; i++) {
        const mid = (low + high) / 2;
        const res = calculateGrossToNet(mid, dependents);
        if (Math.abs(res.netSalary - numericSalary) < 1000) {
          estimatedGross = mid;
          break;
        }
        if (res.netSalary < numericSalary) {
          low = mid;
        } else {
          high = mid;
        }
        estimatedGross = mid;
      }
      return calculateGrossToNet(Math.round(estimatedGross), dependents);
    }
  }, [numericSalary, dependents, calculationMode]);

  return (
    <div className="border-outline-variant shadow-elevation-2 overflow-hidden rounded-3xl border bg-white">
      <div className="bg-primary-deeper p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/40">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-primary-bright rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold ring-1 ring-emerald-500/30">
                  2026 Labor Code Standard
                </span>
                <span className="text-xs text-gray-400">Insurance 10.5% • Deduction 11M</span>
              </div>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Gross ➔ Net Salary Calculator
              </h3>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-slate-800/80 p-1 ring-1 ring-white/10">
            <button
              type="button"
              onClick={() => setCalculationMode('grossToNet')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                calculationMode === 'grossToNet'
                  ? 'bg-primary shadow-elevation-1 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Gross ➔ Net
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('netToGross')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                calculationMode === 'netToGross'
                  ? 'bg-primary shadow-elevation-1 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Net ➔ Gross
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <label className="text-on-surface-variant mb-2 block text-xs font-bold tracking-wider uppercase">
              {calculationMode === 'grossToNet'
                ? 'Monthly Gross Salary (VND / month)'
                : 'Target Monthly Net Salary (VND / month)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={numericSalary ? new Intl.NumberFormat('vi-VN').format(numericSalary) : ''}
                onChange={handleSalaryChange}
                placeholder="e.g., 25,000,000"
                className="focus:border-primary text-on-surface w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 pr-14 text-lg font-bold transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-gray-400">VND</span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
              <span className="self-center text-gray-500">Quick select:</span>
              {[15000000, 20000000, 25000000, 35000000, 50000000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickSalary(amount)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition ${
                    numericSalary === amount
                      ? 'text-primary bg-primary-container font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {amount / 1000000}M
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="text-on-surface-variant mb-2 block text-xs font-bold tracking-wider uppercase">
              Dependents
            </label>
            <div className="relative">
              <select
                value={dependents}
                onChange={(e) => setDependents(parseInt(e.target.value, 10))}
                className="focus:border-primary text-on-surface w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-base font-semibold transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              >
                <option value={0}>0 dependents (0 VND)</option>
                <option value={1}>1 dependent (4.4M VND)</option>
                <option value={2}>2 dependents (8.8M VND)</option>
                <option value={3}>3 dependents (13.2M VND)</option>
                <option value={4}>4 dependents (17.6M VND)</option>
                <option value={5}>5 dependents (22.0M VND)</option>
              </select>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">Deduction: 4,400,000 VND / dependent / month</p>
          </div>

          <div className="md:col-span-3">
            <label className="text-on-surface-variant mb-2 block text-xs font-bold tracking-wider uppercase">
              Work Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(parseInt(e.target.value, 10))}
              className="focus:border-primary text-on-surface w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-base font-semibold transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
            >
              <option value={1}>Region I (Hanoi, HCMC, Da Nang...)</option>
              <option value={2}>Region II (Tier 2 cities)</option>
              <option value={3}>Region III (Tier 3 cities)</option>
              <option value={4}>Region IV (Other rural areas)</option>
            </select>
            <p className="mt-1.5 text-xs text-gray-500">Determines unemployment insurance contribution cap</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-on-primary-container text-xs font-bold tracking-wider uppercase">
                Net Take-Home Salary
              </span>
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-xl text-white">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <div className="text-primary mt-2 text-2xl font-bold sm:text-3xl">
              {formatCurrencyVND(result.netSalary)}
            </div>
            <p className="text-primary mt-1 text-xs">Estimated bank account deposit</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Gross Salary</span>
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-on-surface mt-2 text-xl font-bold sm:text-2xl">
              {formatCurrencyVND(result.grossSalary)}
            </div>
            <p className="mt-1 text-xs text-gray-400">Total contractual compensation</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Insurance (10.5%)</span>
              <ShieldCheck className="text-primary h-4 w-4" />
            </div>
            <div className="text-error mt-2 text-xl font-bold sm:text-2xl">
              -{formatCurrencyVND(result.insurance.total)}
            </div>
            <p className="mt-1 text-xs text-gray-400">Social (8%), Health (1.5%), Unemp (1%)</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Income Tax (PIT)</span>
              <Percent className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-error mt-2 text-xl font-bold sm:text-2xl">
              -{formatCurrencyVND(result.personalIncomeTax)}
            </div>
            <p className="mt-1 text-xs text-gray-400">Progressive 7-bracket deduction</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-on-surface text-sm font-bold">Detailed Deductions & Obligations</h4>
            <button
              type="button"
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="text-primary hover:text-primary inline-flex items-center gap-1 text-xs font-semibold"
            >
              {showFormulaDetails ? 'Hide details' : 'View full breakdown'}
              {showFormulaDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-4 space-y-3 divide-y divide-gray-200/80 text-xs sm:text-sm">
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-700">1. Gross Salary</span>
              <span className="text-on-surface font-bold">{formatCurrencyVND(result.grossSalary)}</span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between font-semibold text-gray-700">
                <span>2. Mandatory Employee Insurance (10.5%)</span>
                <span className="text-error font-bold">-{formatCurrencyVND(result.insurance.total)}</span>
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-2 pl-4 text-xs text-gray-500">
                <div>Social (8%): {formatCurrencyVND(result.insurance.social)}</div>
                <div>Health (1.5%): {formatCurrencyVND(result.insurance.health)}</div>
                <div>Unemployment (1%): {formatCurrencyVND(result.insurance.unemployment)}</div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-700">3. Income Before Tax (1 - 2)</span>
              <span className="text-on-surface font-bold">
                {formatCurrencyVND(result.grossSalary - result.insurance.total)}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-700">4. Total Tax Deductions (Personal 11M + Dependents)</span>
              <span className="font-medium text-gray-600">{formatCurrencyVND(result.deductions.total)}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-700">5. Taxable Income</span>
              <span className="text-on-surface font-bold">{formatCurrencyVND(result.taxableIncome)}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-700">6. Personal Income Tax (PIT)</span>
              <span className="text-error font-bold">-{formatCurrencyVND(result.personalIncomeTax)}</span>
            </div>

            <div className="text-on-primary-container flex justify-between pt-2 font-bold">
              <span className="text-sm">7. Net Take-Home Salary (3 - 6)</span>
              <span className="text-primary text-base">{formatCurrencyVND(result.netSalary)}</span>
            </div>

            {showFormulaDetails && (
              <div className="border-outline-variant bg-primary-light/50 text-on-primary-container mt-4 rounded-xl border p-4 text-xs">
                <div className="text-on-primary-container flex items-center gap-2 font-bold">
                  <Building2 className="text-primary h-4 w-4" />
                  Employer Obligations (21.5% in addition to Gross)
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div>Social Insurance (17.5%): {formatCurrencyVND(Math.round(result.grossSalary * 0.175))}</div>
                  <div>Health Insurance (3%): {formatCurrencyVND(Math.round(result.grossSalary * 0.03))}</div>
                  <div>Unemployment Insurance (1%): {formatCurrencyVND(Math.round(result.grossSalary * 0.01))}</div>
                </div>
                <div className="text-on-primary-container mt-2 font-bold">
                  Total Employer Cost: {formatCurrencyVND(Math.round(result.grossSalary * 1.215))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
