import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

type InvalidLinkNoticeProps = {
  message: string;
  actionHref: string;
  actionLabel: string;
};

export default function InvalidLinkNotice({ message, actionHref, actionLabel }: InvalidLinkNoticeProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <XCircle className="h-7 w-7" />
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      <Link href={actionHref} className="block">
        <Button className="w-full rounded-xl py-3 text-sm font-bold">{actionLabel}</Button>
      </Link>
      <Link href={ROUTES.LOGIN} className="inline-block text-sm font-semibold text-emerald-600 hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
