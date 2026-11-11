import CatEmptyIllustration from '@/components/connect/CatEmptyIllustration';
import { MessageCircleMore } from 'lucide-react';

type ConnectSidebarEmptyStateProps = {
  mobileTitle: string;
  desktopTitle: string;
  description: string;
};

export default function ConnectSidebarEmptyState({
  mobileTitle,
  desktopTitle,
  description,
}: ConnectSidebarEmptyStateProps) {
  return (
    <>
      <div className="py-10 md:hidden">
        <CatEmptyIllustration compact title={mobileTitle} description={description} />
      </div>
      <div className="hidden flex-col items-center justify-center px-4 py-12 text-center md:flex">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <MessageCircleMore className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600">{desktopTitle}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </>
  );
}
