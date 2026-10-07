import React from 'react';
import Link from 'next/link';
import { Calculator, Compass, Percent, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export function ToolsDropdown() {
  return (
    <div className="animate-in fade-in absolute top-15 -left-10 z-50 grid w-115 grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xl duration-150">
      <div className="space-y-1">
        <Link
          href="#superior-tool"
          className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
        >
          <Calculator className="h-4 w-4 text-emerald-600" />
          <span>Tính lương Gross - Net</span>
        </Link>
        <Link
          href="#superior-tool"
          className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
        >
          <Percent className="h-4 w-4 text-emerald-600" />
          <span>Tính thuế TNCN</span>
        </Link>
        <Link
          href="#superior-tool"
          className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Bảo hiểm thất nghiệp</span>
        </Link>
      </div>

      <div className="space-y-1">
        <Link
          href="#self-growth"
          className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
        >
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>Trắc nghiệm MBTI</span>
        </Link>
        <Link
          href="#self-growth"
          className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
        >
          <Compass className="h-4 w-4 text-emerald-600" />
          <span>Trắc nghiệm MI</span>
        </Link>
        <Link
          href="#superior-tool"
          className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-800 transition-colors hover:bg-emerald-50/50 hover:text-emerald-600"
        >
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span>Tính lãi suất kép</span>
        </Link>
      </div>
    </div>
  );
}

export default ToolsDropdown;
