import { ROUTES } from '@/constants/routes';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

/** Clean InterVue-branded empty shopping cart illustration rendered synchronously on SSR. */
function EmptyCartIllustration() {
  return (
    <svg
      width="136"
      height="110"
      viewBox="0 0 136 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mx-auto select-none"
    >
      <ellipse cx="68" cy="96" rx="44" ry="8" fill="#ECFDF5" />
      <circle cx="30" cy="36" r="5" fill="#D1FAE5" />
      <circle cx="108" cy="30" r="4" fill="#A7F3D0" />
      <path d="M98 18L100 13L102 18L107 20L102 22L100 27L98 22L93 20L98 18Z" fill="#00B14F" opacity="0.35" />

      <path
        d="M32 34H42L50.5 71.5C51.1 74.1 53.4 76 56.1 76H93.8C96.4 76 98.7 74.2 99.4 71.7L105 50H46"
        stroke="#0F172A"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FFFFFF"
      />
      <rect x="52" y="42" width="44" height="24" rx="5" fill="#F0FDF4" />
      <circle cx="66" cy="54" r="2.2" fill="#0F172A" />
      <circle cx="82" cy="54" r="2.2" fill="#0F172A" />
      <path d="M69 60.5C71.5 58.2 76.5 58.2 79 60.5" stroke="#00B14F" strokeWidth="2.2" strokeLinecap="round" />

      <circle cx="58" cy="87" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.4" />
      <circle cx="58" cy="87" r="2" fill="#00B14F" />
      <circle cx="89" cy="87" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.4" />
      <circle cx="89" cy="87" r="2" fill="#00B14F" />

      <rect x="60" y="18" width="28" height="14" rx="7" fill="#00B14F" />
      <path d="M69 25H79" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function CartEmptyState() {
  return (
    <div className="border-outline-variant flex flex-col items-center justify-center rounded-xl border bg-white px-6 py-12 text-center shadow-2xs sm:py-14">
      <EmptyCartIllustration />
      <h2 className="text-on-surface-variant mt-4 text-base font-medium sm:text-lg">Your cart is empty</h2>
      <Link
        href={ROUTES.RECRUITER_SERVICES}
        className="bg-primary mt-5 inline-flex h-10 items-center justify-center gap-1 rounded-lg px-5 text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98]"
      >
        <span>Browse services</span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
