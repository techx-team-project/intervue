'use client';

import React, { useState, useMemo } from 'react';
import { calculateGrossToNet, formatCurrencyVND } from '@/utils/salary';
import {
  Calculator,
  ArrowRightLeft,
  ShieldCheck,
  Building2,
  User,
  Info,
  ChevronDown,
  ChevronUp,
  Percent,
  Coins,
  CheckCircle2,
} from 'lucide-react';

export default function GrossNetCalculatorWidget() {
  const [calculationMode, setCalculationMode] = useState<'grossToNet' | 'netToGross'>('grossToNet');
  const [salaryInput, setSalaryInput] = useState<string>('25000000');
  const [dependents, setDependents] = useState<number>(0);
  const [region, setRegion] = useState<number>(1);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Parse salary
  const numericSalary = useMemo(() => {
    const val = parseInt(salaryInput.replace(/\D/g, ''), 10);
    return isNaN(val) ? 0 : val;
  }, [salaryInput]);

  // Handle formatted input
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setSalaryInput(rawVal);
  };

  // Preset salary quick clicks
  const handleQuickSalary = (amount: number) => {
    setSalaryInput(amount.toString());
  };

  // Calculation result
  const result = useMemo(() => {
    if (calculationMode === 'grossToNet') {
      return calculateGrossToNet(numericSalary, dependents);
    } else {
      // Approximation for Net to Gross by binary search
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
    <div className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-xl">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-[#00b14f] ring-1 ring-emerald-500/40">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  Chuẩn quy định 2026
                </span>
                <span className="text-xs text-gray-400">BHXH 10.5% • Giảm trừ 11tr</span>
              </div>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Công cụ tính Lương Gross ➔ Net
              </h3>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-800/80 p-1 ring-1 ring-white/10">
            <button
              type="button"
              onClick={() => setCalculationMode('grossToNet')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                calculationMode === 'grossToNet'
                  ? 'bg-[#00b14f] text-white shadow-md'
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
                  ? 'bg-[#00b14f] text-white shadow-md'
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
        {/* Input Form Controls */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Main Salary Input */}
          <div className="md:col-span-6">
            <label className="mb-2 block text-xs font-bold tracking-wider text-[#475569] uppercase">
              {calculationMode === 'grossToNet'
                ? 'Mức lương Gross (VNĐ / tháng)'
                : 'Mức lương Net mong muốn (VNĐ / tháng)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={numericSalary ? new Intl.NumberFormat('vi-VN').format(numericSalary) : ''}
                onChange={handleSalaryChange}
                placeholder="Ví dụ: 25.000.000"
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 pr-14 text-lg font-bold text-[#0f172a] transition focus:border-[#00b14f] focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-gray-400">VNĐ</span>
            </div>

            {/* Quick preset buttons */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
              <span className="self-center text-gray-500">Gợi ý nhanh:</span>
              {[15000000, 20000000, 25000000, 35000000, 50000000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickSalary(amount)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition ${
                    numericSalary === amount
                      ? 'bg-emerald-100 font-semibold text-[#00b14f]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {amount / 1000000} triệu
                </button>
              ))}
            </div>
          </div>

          {/* Dependents Selection */}
          <div className="md:col-span-3">
            <label className="mb-2 block text-xs font-bold tracking-wider text-[#475569] uppercase">
              Người phụ thuộc
            </label>
            <div className="relative">
              <select
                value={dependents}
                onChange={(e) => setDependents(parseInt(e.target.value, 10))}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-base font-semibold text-[#0f172a] transition focus:border-[#00b14f] focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              >
                <option value={0}>0 người (0 đ)</option>
                <option value={1}>1 người (4.4 triệu)</option>
                <option value={2}>2 người (8.8 triệu)</option>
                <option value={3}>3 người (13.2 triệu)</option>
                <option value={4}>4 người (17.6 triệu)</option>
                <option value={5}>5 người (22.0 triệu)</option>
              </select>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">Giảm trừ 4.400.000đ/người/tháng</p>
          </div>

          {/* Region Selection */}
          <div className="md:col-span-3">
            <label className="mb-2 block text-xs font-bold tracking-wider text-[#475569] uppercase">
              Vùng làm việc
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(parseInt(e.target.value, 10))}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-base font-semibold text-[#0f172a] transition focus:border-[#00b14f] focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
            >
              <option value={1}>Vùng I (Hà Nội, TP.HCM, ĐN...)</option>
              <option value={2}>Vùng II (Đô thị loại 2)</option>
              <option value={3}>Vùng III (Đô thị loại 3)</option>
              <option value={4}>Vùng IV (Khu vực còn lại)</option>
            </select>
            <p className="mt-1.5 text-xs text-gray-500">Căn cứ trần mức đóng BHTN</p>
          </div>
        </div>

        {/* Calculation Summary Big Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Lương Net */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">Lương Net thực nhận</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00b14f] text-white">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#00b14f] sm:text-3xl">
              {formatCurrencyVND(result.netSalary)}
            </div>
            <p className="mt-1 text-xs text-emerald-700">Số tiền đổ về tài khoản ngân hàng</p>
          </div>

          {/* Card 2: Lương Gross */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-[#475569] uppercase">Lương Gross</span>
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-[#0f172a] sm:text-2xl">
              {formatCurrencyVND(result.grossSalary)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Thu nhập cam kết ban đầu</p>
          </div>

          {/* Card 3: Đóng bảo hiểm */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-[#475569] uppercase">Đóng bảo hiểm (10.5%)</span>
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-[#0f172a] sm:text-2xl">
              -{formatCurrencyVND(result.insurance.total)}
            </div>
            <p className="mt-1 text-xs text-gray-500">BHXH 8%, BHYT 1.5%, BHTN 1%</p>
          </div>

          {/* Card 4: Thuế TNCN */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-[#475569] uppercase">Thuế TNCN tạm nộp</span>
              <Percent className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-2 text-xl font-bold text-[#0f172a] sm:text-2xl">
              -{formatCurrencyVND(result.personalIncomeTax)}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {result.personalIncomeTax > 0 ? 'Theo biểu thuế 7 bậc' : 'Chưa đến mức đóng thuế'}
            </p>
          </div>
        </div>

        {/* Breakdown Breakdown Details Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50/80 px-6 py-4">
            <h4 className="text-sm font-bold text-[#0f172a]">Bảng bóc tách chi tiết các khoản trừ và nghĩa vụ</h4>
          </div>

          <div className="divide-y divide-gray-100 text-sm">
            {/* 1. Lương Gross */}
            <div className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50">
              <span className="font-semibold text-[#0f172a]">1. Lương Gross</span>
              <span className="font-bold text-[#0f172a]">{formatCurrencyVND(result.grossSalary)}</span>
            </div>

            {/* 2. Bảo hiểm bắt buộc */}
            <div className="bg-blue-50/30 px-6 py-3.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-950">2. Bảo hiểm bắt buộc người lao động đóng (10.5%)</span>
                <span className="font-bold text-blue-600">-{formatCurrencyVND(result.insurance.total)}</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-blue-900 sm:grid-cols-3">
                <div className="flex justify-between rounded-lg bg-white/80 px-3 py-1.5">
                  <span>BHXH (8%):</span>
                  <span className="font-semibold">{formatCurrencyVND(result.insurance.social)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/80 px-3 py-1.5">
                  <span>BHYT (1.5%):</span>
                  <span className="font-semibold">{formatCurrencyVND(result.insurance.health)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/80 px-3 py-1.5">
                  <span>BHTN (1%):</span>
                  <span className="font-semibold">{formatCurrencyVND(result.insurance.unemployment)}</span>
                </div>
              </div>
            </div>

            {/* 3. Thu nhập trước thuế */}
            <div className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50">
              <span className="font-semibold text-[#0f172a]">3. Thu nhập trước thuế (Lương Gross - Bảo hiểm)</span>
              <span className="font-bold text-[#0f172a]">
                {formatCurrencyVND(result.grossSalary - result.insurance.total)}
              </span>
            </div>

            {/* 4. Giảm trừ gia cảnh */}
            <div className="bg-emerald-50/30 px-6 py-3.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-950">4. Tổng mức giảm trừ gia cảnh</span>
                <span className="font-bold text-emerald-700">-{formatCurrencyVND(result.deductions.total)}</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-emerald-900 sm:grid-cols-2">
                <div className="flex justify-between rounded-lg bg-white/80 px-3 py-1.5">
                  <span>Giảm trừ bản thân:</span>
                  <span className="font-semibold">{formatCurrencyVND(result.deductions.personal)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/80 px-3 py-1.5">
                  <span>Giảm trừ người phụ thuộc ({dependents} người):</span>
                  <span className="font-semibold">{formatCurrencyVND(result.deductions.dependents)}</span>
                </div>
              </div>
            </div>

            {/* 5. Thu nhập tính thuế */}
            <div className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50">
              <span className="font-semibold text-[#0f172a]">5. Thu nhập tính thuế TNCN</span>
              <span className="font-bold text-[#0f172a]">{formatCurrencyVND(result.taxableIncome)}</span>
            </div>

            {/* 6. Thuế TNCN */}
            <div className="bg-amber-50/30 px-6 py-3.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-950">6. Thuế thu nhập cá nhân (TNCN)</span>
                <span className="font-bold text-amber-600">-{formatCurrencyVND(result.personalIncomeTax)}</span>
              </div>
              {result.taxTiers.length > 0 ? (
                <div className="mt-2 space-y-1.5 text-xs text-amber-900">
                  {result.taxTiers.map((t) => (
                    <div key={t.tier} className="flex justify-between rounded-lg bg-white/80 px-3 py-1.5">
                      <span>
                        Bậc {t.tier} (Thuế suất {t.rate}%):
                      </span>
                      <span className="font-semibold">{formatCurrencyVND(t.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Thu nhập tính thuế ≤ 0đ nên không phát sinh thuế TNCN.</p>
              )}
            </div>

            {/* 7. Lương Net thực nhận */}
            <div className="flex items-center justify-between bg-emerald-500/10 px-6 py-4">
              <span className="text-base font-bold text-emerald-950">7. LƯƠNG NET THỰC NHẬN</span>
              <span className="text-xl font-black text-[#00b14f]">{formatCurrencyVND(result.netSalary)}</span>
            </div>

            {/* 8. Chi phí doanh nghiệp phải trả */}
            <div className="bg-slate-50 px-6 py-3.5 text-xs text-slate-600">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  Người sử dụng lao động (Doanh nghiệp) trả thêm 22% quỹ lương:
                </span>
                <span className="font-bold">{formatCurrencyVND(result.employerCost.total)}</span>
              </div>
              <p className="mt-1 text-slate-500">
                Tổng chi phí thực tế doanh nghiệp chi trả cho nhân sự này:{' '}
                <strong className="text-slate-800">{formatCurrencyVND(result.employerCost.totalEmployerCost)}</strong> /
                tháng.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion: Giải thích công thức & Luật */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 text-left text-xs font-semibold text-[#475569] transition hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#00b14f]" />
              Tìm hiểu căn cứ pháp lý & quy định tính lương năm 2026
            </span>
            {showFormulaDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showFormulaDetails && (
            <div className="mt-3 space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 text-xs text-[#334155]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00b14f]" />
                <p>
                  <strong>Mức lương cơ sở & Trần bảo hiểm:</strong> Mức đóng BHXH và BHYT tối đa bằng 20 lần mức lương
                  cơ sở (hiện hành 2.340.000đ x 20 = 46.800.000đ/tháng).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00b14f]" />
                <p>
                  <strong>Trần Bảo hiểm thất nghiệp (BHTN):</strong> Tối đa bằng 20 lần mức lương tối thiểu vùng (Vùng 1
                  tối đa 99.200.000đ/tháng).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00b14f]" />
                <p>
                  <strong>Mức giảm trừ gia cảnh:</strong> Người nộp thuế được giảm trừ 11.000.000đ/tháng cho bản thân và
                  4.400.000đ/tháng cho mỗi người phụ thuộc có đăng ký MST người phụ thuộc hợp lệ.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
