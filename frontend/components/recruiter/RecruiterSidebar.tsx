'use client';

import { RECRUITER_NAV_SECTIONS } from '@/constants/recruiter-nav';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_RECRUITER_DASHBOARD } from '@/mocks/recruiter-dashboard.mock';
import type { VerificationLevel } from '@/types/recruiter';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface RecruiterSidebarProps {
  isCollapsed: boolean;
}

const VERIFICATION_TEXT_COLOR: Record<VerificationLevel, string> = {
  unverified: 'text-rose-600',
  basic: 'text-amber-600',
  verified: 'text-[#00873c]',
};

export default function RecruiterSidebar({ isCollapsed }: RecruiterSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { company, verification } = MOCK_RECRUITER_DASHBOARD;

  return (
    <aside
      className={`shrink-0 border-[#e2e8f0] bg-white transition-[width] duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-r lg:border-b-0 ${
        isCollapsed ? 'hidden lg:block lg:w-20' : 'block w-full border-b lg:w-72'
      }`}
    >
      <div className={isCollapsed ? 'flex justify-center p-3' : 'p-5'}>
        <div className={isCollapsed ? '' : 'flex items-center gap-3.5'}>
          <div
            className={`from-primary flex shrink-0 items-center justify-center rounded-2xl bg-linear-to-tr to-[#00d660] font-black text-white shadow-sm ${
              isCollapsed ? 'h-10 w-10 text-base' : 'h-12 w-12 text-lg'
            }`}
          >
            {user?.name.charAt(0).toUpperCase()}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] text-[#64748b]">Nhà tuyển dụng</p>
              <h3 className="text-navy truncate text-[15px] font-bold">{user?.name}</h3>
              <p className="truncate text-[12px] text-[#64748b]">{company.name}</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-3 flex items-center gap-1.5 text-[12.5px]">
            <span className="text-[#64748b]">Tài khoản xác thực:</span>
            <span className={`font-bold ${VERIFICATION_TEXT_COLOR[verification.level]}`}>
              Cấp {verification.stepsCompleted}/{verification.stepsTotal}
            </span>
            <span title="Hoàn tất xác thực để đăng tin và tiếp cận ứng viên hiệu quả hơn">
              <HelpCircle className="h-3.5 w-3.5 text-[#94a3b8]" />
            </span>
          </div>
        )}

        {!isCollapsed && verification.level !== 'verified' && (
          <Link
            href={ROUTES.RECRUITER_COMPANY_VERIFICATION}
            className="mt-3 flex w-full items-center justify-center rounded-full bg-amber-600 px-3 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-amber-700"
          >
            Tài khoản chưa đủ an toàn
          </Link>
        )}
      </div>

      {RECRUITER_NAV_SECTIONS.map((section, sectionIndex) => (
        <nav key={section.title} aria-label={section.title} className="space-y-0.5 px-2 py-1">
          {sectionIndex > 0 && <div className="mx-1 my-2 border-t border-[#f1f5f9]" />}

          {section.items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl py-2.5 text-[13px] transition ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-2.5'
                } ${isActive ? 'font-bold' : 'font-medium text-[#475569] hover:bg-[#f8fafc]'}`}
              >
                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${
                      isCollapsed ? 'h-9 w-9' : 'h-8 w-8'
                    } ${isActive ? 'bg-primary/10 text-primary' : 'text-[#64748b]'}`}
                  >
                    <Icon className={isCollapsed ? 'h-5 w-5' : 'h-4.5 w-4.5'} />
                  </span>
                  {!isCollapsed && <span className={isActive ? 'text-primary' : ''}>{item.label}</span>}
                </div>

                {!isCollapsed && item.comingSoon && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500">
                    Sắp có
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      ))}

      {!isCollapsed && (
        <div className="mt-4 space-y-1 border-t border-[#f1f5f9] px-4 pt-4 pb-5 text-[11.5px]">
          {/* TODO: wire to real legal routes once they exist */}
          <a href="#" className="text-primary block hover:underline">
            Chính sách quyền riêng tư
          </a>
          <a href="#" className="text-primary block hover:underline">
            Chính sách cookie
          </a>
          <a href="#" className="text-primary block hover:underline">
            Điều khoản dịch vụ
          </a>
          <p className="pt-2 text-[#94a3b8]">Version 1.0.0</p>
          <p className="text-[#94a3b8]">© 2024 - 2026 InterVue Vietnam JSC. All rights reserved.</p>
        </div>
      )}
    </aside>
  );
}
