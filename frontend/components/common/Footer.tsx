import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_HREF } from '@/constants/header';
import { ROUTES } from '@/constants/routes';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Ứng viên',
    links: [
      { href: ROUTES.JOBS, label: 'Việc làm IT' },
      { href: '/cv-templates', label: 'Mẫu CV' },
      { href: ROUTES.CANDIDATE_JOB_ALERTS, label: 'Thông báo việc làm' },
      { href: '/career-orientation', label: 'Định hướng nghề nghiệp' },
      { href: '/blog', label: 'Cẩm nang nghề nghiệp' },
    ],
  },
  {
    title: 'Nhà tuyển dụng',
    links: [
      { href: ROUTES.RECRUITER_LANDING, label: 'Đăng tuyển và tìm hồ sơ' },
      { href: ROUTES.RECRUITER_LOGIN, label: 'Đăng nhập nhà tuyển dụng' },
      { href: ROUTES.RECRUITER_REGISTER, label: 'Đăng ký nhà tuyển dụng' },
    ],
  },
  {
    title: 'Hỗ trợ và pháp lý',
    links: [{ href: '/data-processing-agreement', label: 'Thỏa thuận xử lý dữ liệu' }],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-outline-variant border-t">
      <div className="container-page expanded:grid-cols-5 medium:grid-cols-2 grid grid-cols-1 gap-8 py-12">
        <div className="expanded:col-span-2 space-y-4">
          <Link href={ROUTES.HOME} className="inline-block">
            <Image
              src="/intervue-logo.png"
              alt="InterVue"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          <p className="text-body-md text-on-surface-variant max-w-sm">
            Nền tảng tuyển dụng IT có AI hỗ trợ. AI chỉ gợi ý, nhà tuyển dụng là người quyết định.
          </p>
          <ul className="text-body-md text-on-surface space-y-2">
            <li>
              <a href={SUPPORT_PHONE_HREF} className="flex items-center gap-2 hover:underline">
                <Phone className="text-on-surface-variant h-4 w-4" aria-hidden />
                {SUPPORT_PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 hover:underline">
                <Mail className="text-on-surface-variant h-4 w-4" aria-hidden />
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-title-sm text-on-surface mb-3">{column.title}</h2>
            <ul className="space-y-1">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-md text-on-surface-variant hover:text-primary inline-flex min-h-8 items-center hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-outline-variant border-t">
        <p className="container-page text-body-sm text-on-surface-variant py-4">
          © {new Date().getFullYear()} InterVue. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
}
