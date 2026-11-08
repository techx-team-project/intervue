import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_HREF } from '@/constants/header';
import { ROUTES } from '@/constants/routes';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Candidates',
    links: [
      { href: ROUTES.JOBS, label: 'IT jobs' },
      { href: '/cv-templates', label: 'CV templates' },
      { href: ROUTES.CANDIDATE_JOB_ALERTS, label: 'Job alerts' },
      { href: '/career-orientation', label: 'Career orientation' },
      { href: '/blog', label: 'Career guides' },
    ],
  },
  {
    title: 'Recruiters',
    links: [
      { href: ROUTES.RECRUITER_LANDING, label: 'Post jobs and find CVs' },
      { href: ROUTES.RECRUITER_LOGIN, label: 'Recruiter sign in' },
      { href: ROUTES.RECRUITER_REGISTER, label: 'Recruiter sign up' },
    ],
  },
  {
    title: 'Support and legal',
    links: [{ href: '/data-processing-agreement', label: 'Data processing agreement' }],
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
            An AI-assisted IT recruitment platform. AI only suggests, recruiters decide.
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
          © {new Date().getFullYear()} InterVue. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
