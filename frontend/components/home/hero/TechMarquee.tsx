import { TECH_STACK } from '@/constants/home/search';

export default function TechMarquee() {
  const loop = [...TECH_STACK, ...TECH_STACK];

  return (
    <div aria-hidden className="mask-fade-x overflow-hidden">
      <ul className="animate-marquee flex w-max items-center">
        {loop.map((tech, index) => (
          <li key={index} className="flex items-center whitespace-nowrap">
            <span className="font-display text-headline-sm font-bold text-white/30">{tech}</span>
            <span className="bg-primary-bright/60 mx-10 h-2 w-2 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
