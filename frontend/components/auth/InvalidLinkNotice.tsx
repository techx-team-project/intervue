import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

type InvalidLinkNoticeProps = {
  message: string;
  actionHref: string;
  actionLabel: string;
  loginHref?: string;
};

export default function InvalidLinkNotice({
  message,
  actionHref,
  actionLabel,
  loginHref = ROUTES.LOGIN,
}: InvalidLinkNoticeProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="bg-error/10 text-error mx-auto flex h-12 w-12 items-center justify-center rounded-full">
        <XCircle className="h-7 w-7" />
      </div>
      <p className="text-on-surface-variant text-sm leading-relaxed">{message}</p>
      <Link href={actionHref} className="block">
        <Button className="w-full rounded-xl py-3 text-sm font-bold">{actionLabel}</Button>
      </Link>
      <Link href={loginHref} className="text-primary inline-block text-sm font-semibold hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
