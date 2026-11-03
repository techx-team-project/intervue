import Image from 'next/image';
import RecruiterRegisterCarousel from './RecruiterRegisterCarousel';
import RecruiterRegisterForm from './RecruiterRegisterForm';

export default function RecruiterRegisterView() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white lg:flex-row">
      {/* Left Column: Form (~65% width) */}
      <div className="relative flex min-h-screen w-full flex-1 flex-col justify-between overflow-y-auto px-6 py-8 sm:px-10 md:px-12 lg:w-[65%] lg:flex-none lg:px-10 xl:w-[66.6667%] xl:px-14 2xl:w-[67%] 2xl:px-20">
        <div className="relative z-10 mx-auto w-full max-w-[680px] py-4 sm:py-6 xl:max-w-[720px]">
          <RecruiterRegisterForm />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 w-full overflow-hidden select-none"
        >
          <Image
            src="/auth/register-bottom-grid.svg"
            alt=""
            width={926}
            height={173}
            className="h-full w-full object-contain object-bottom opacity-40"
          />
        </div>

        <div className="relative z-10 mt-10 mb-4 text-center">
          <p className="text-xs font-medium text-emerald-700/80 sm:text-sm">
            ©2024-2026 InterVue Vietnam JSC. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Column: Full Banner Carousel (~35% width) */}
      <div className="hidden overflow-hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[35%] xl:w-[33.3333%] 2xl:w-[33%]">
        <RecruiterRegisterCarousel />
      </div>
    </div>
  );
}
