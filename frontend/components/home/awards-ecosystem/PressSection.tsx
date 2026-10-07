import { PRESS_LOGOS } from '@/constants/home/awards';

export default function PressSection() {
  return (
    <section id="newspapers-talk-about-intervue" className="container-topcv">
      <div className="rounded-3xl border border-[#e9eaec] bg-white p-8 shadow-xs">
        <div className="mb-6 text-center">
          <h2 className="text-navy text-xl font-bold md:text-2xl">Báo chí nói về InterVue</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-85 transition-opacity hover:opacity-100 md:gap-12">
          {PRESS_LOGOS.map((logo, idx) => (
            <div key={idx} className="flex h-10 items-center justify-center grayscale transition-all hover:grayscale-0">
              <img src={logo} alt={`Báo chí ${idx + 1}`} className="max-h-full w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
