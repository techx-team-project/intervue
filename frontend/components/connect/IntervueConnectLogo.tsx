import { cn } from '@/lib/utils';
import Image from 'next/image';

type IntervueConnectLogoProps = {
  className?: string;
};

export default function IntervueConnectLogo({ className }: IntervueConnectLogoProps) {
  return (
    <div className={cn('flex shrink-0 items-center gap-1.5 whitespace-nowrap sm:gap-2', className)}>
      <Image
        src="/intervue-logo.png"
        alt="InterVue"
        width={116}
        height={30}
        priority
        className="h-7 w-auto object-contain sm:h-7.5"
      />
      <span className="text-on-surface text-lg leading-none font-bold tracking-tight sm:text-[19px]">Connect</span>
    </div>
  );
}
