import CatEmptyIllustration from '@/components/connect/CatEmptyIllustration';
import type { ReactNode } from 'react';

type ConnectEmptyPanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function ConnectEmptyPanel({ title, description, action }: ConnectEmptyPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="border-outline-variant hidden h-14 shrink-0 items-center border-b px-6 md:flex">
        <p className="text-body-md text-on-surface font-semibold">
          New way to follow your chance. <span className="font-bold text-[#00b14f]">More engage, more success</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-6">
        <CatEmptyIllustration title={title} description={description} />
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
