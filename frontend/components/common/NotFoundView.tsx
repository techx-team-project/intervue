import { ROUTES } from '@/constants/routes';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundView() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-12">
      <div className="-mt-16 flex flex-col items-center gap-8 sm:-mt-24 sm:flex-row sm:gap-14 md:-mt-28 md:gap-16">
        {/* Left: InterVue Brand Logo */}
        <div className="flex shrink-0 items-center justify-center">
          <Link href={ROUTES.HOME} className="transition-opacity hover:opacity-85">
            <Image
              src="/intervue-logo.png"
              alt="InterVue"
              width={340}
              height={100}
              className="h-20 w-auto object-contain sm:h-24 md:h-28"
              priority
            />
          </Link>
        </div>

        {/* Vertical divider */}
        <div className="hidden h-36 w-[1.5px] bg-slate-200/90 sm:block sm:h-44 md:h-48" />

        {/* Right: 404 Message */}
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-light tracking-tight text-slate-800 sm:text-5xl md:text-6xl">404 ! Oops...</h1>
          <p className="mt-3 text-base font-medium text-slate-700 sm:text-lg md:text-xl">
            Sorry, this page does not exist.
          </p>
          <div className="mt-5">
            <Link
              href={ROUTES.HOME}
              className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline sm:text-base"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
