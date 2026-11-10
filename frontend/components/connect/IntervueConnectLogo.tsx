import { cn } from '@/lib/utils';
import Image from 'next/image';

type IntervueConnectLogoProps = {
  className?: string;
};

export default function IntervueConnectLogo({ className }: IntervueConnectLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src="/intervue-logo.png"
        alt="InterVue"
        width={130}
        height={36}
        priority
        className="h-8 w-auto object-contain"
      />
      <span className="text-on-surface text-xl font-bold tracking-tight">Connect</span>
      <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-xs font-semibold text-[#2b7fff]">Beta</span>
    </div>
  );
}
