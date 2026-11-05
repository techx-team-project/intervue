import { ROUTES } from '@/constants/routes';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';

type RecruiterVerifyEmailNoticeProps = {
  email: string;
};

export default function RecruiterVerifyEmailNotice({ email }: RecruiterVerifyEmailNoticeProps) {
  return (
    <div className="w-full space-y-6 text-center">
      <div className="bg-primary-light text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner">
        <Mail className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-navy text-2xl font-bold">Verify your email</h2>
        <p className="text-sm leading-relaxed text-[#4d5965]">
          We sent a verification link to <strong className="text-navy font-semibold">{email}</strong>. Check your inbox
          (or spam folder) and open the link to activate your employer account. You can verify later; you are already
          signed in.
        </p>
      </div>

      <div className="border-primary/20 bg-primary-light rounded-xl border p-4 text-left text-xs text-[#263a4d]">
        <div className="text-primary flex items-center gap-2 font-bold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>After verifying, you can:</span>
        </div>
        <ul className="mt-2.5 list-inside list-disc space-y-1.5 font-medium text-[#4d5965]">
          <li>Verify your company and post IT jobs</li>
          <li>Screen applications with AI resume matching</li>
          <li>Track candidates through your hiring pipeline</li>
        </ul>
      </div>

      <Link
        href={ROUTES.RECRUITER_DASHBOARD}
        className="bg-primary hover:bg-primary-hover shadow-primary/20 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition"
      >
        <span>Go to dashboard</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
