import Image from 'next/image';

const MOCK_JOBS = [
  {
    badge: 'IV',
    badgeClass: 'bg-emerald-600 text-white',
    title: 'Senior Backend Java',
    company: 'InterVue Tech',
    salary: 'Up to 50M',
  },
  {
    badge: 'NX',
    badgeClass: 'bg-sky-600 text-white',
    title: 'Frontend Next.js Dev',
    company: 'TechX Studio',
    salary: 'Up to 45M',
  },
  {
    badge: 'AI',
    badgeClass: 'bg-violet-600 text-white',
    title: 'AI / ML Engineer',
    company: 'VietAI Labs',
    salary: 'Up to 65M',
  },
  {
    badge: 'DV',
    badgeClass: 'bg-amber-600 text-white',
    title: 'Lead DevOps Cloud',
    company: 'CloudScale VN',
    salary: 'Negotiable',
  },
] as const;

/** Fixed TopCV-inspired InterVue platform banner artwork rendered behind the service detail hero copy. */
export default function ServicePackageHeroArtwork() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl select-none">
      <div className="absolute inset-0 bg-[linear-gradient(108deg,#ffffff_0%,#ffffff_34%,#ecfdf5_66%,#bbf7d0_100%)]" />
      <div className="absolute -right-12 -bottom-16 h-56 w-56 rounded-full bg-emerald-300/35 blur-2xl" />

      <div className="hidden md:block">
        <div className="absolute -top-16 -right-14 -bottom-16 w-[300px] -rotate-11 rounded-[28px] bg-[linear-gradient(135deg,#22c55e_0%,#00b14f_45%,#047857_100%)] shadow-[0_22px_48px_-14px_rgba(0,177,79,0.45)] ring-1 ring-white/25 lg:w-[395px] xl:w-[445px]" />

        <div className="absolute top-5 -right-5 -bottom-6 flex w-[275px] -rotate-8 flex-col overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-[0_20px_45px_-12px_rgba(6,78,59,0.5)] lg:top-5 lg:right-3 lg:w-[355px] xl:top-5 xl:right-4 xl:w-[395px]">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-3 py-1.5">
            <div className="flex items-center gap-2.5">
              <Image src="/intervue-logo.png" alt="" width={72} height={20} className="h-3.5 w-auto object-contain" />
              <div className="hidden items-center gap-2 text-[6.5px] font-semibold text-slate-500 lg:flex">
                <span className="text-[#00b14f]">Jobs</span>
                <span>CVs &amp; Profiles</span>
                <span>Companies</span>
                <span>AI Interview</span>
              </div>
            </div>
            <span className="rounded-full bg-[#00b14f] px-2 py-0.5 text-[6px] font-bold text-white">Post a job</span>
          </div>

          <p className="truncate px-3 pt-1.5 text-[6.5px] font-medium text-slate-500">
            Find IT jobs fast, connect with top candidates
          </p>

          <div className="relative mx-3 mt-1 overflow-hidden rounded-lg bg-[linear-gradient(115deg,#0f172a_0%,#064e3b_52%,#00b14f_100%)] px-3 py-2 text-white">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-300/20 blur-md" />
            <div className="relative flex items-center justify-between gap-2">
              <div className="min-w-0 space-y-0.5">
                <span className="inline-block rounded bg-emerald-400/20 px-1.5 py-0.5 text-[5.5px] font-bold tracking-wider text-emerald-200 uppercase">
                  InterVue Smart Hiring
                </span>
                <p className="truncate text-[9.5px] leading-tight font-extrabold tracking-tight">IT RECRUITMENT</p>
                <p className="truncate text-[6px] font-medium text-emerald-100/90">
                  Reach 100,000+ developers · AI CV screening
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-amber-400 px-2 py-1 text-[6px] font-extrabold text-amber-950 shadow-2xs">
                FEATURED
              </span>
            </div>
          </div>

          <div className="mt-1.5 flex-1 bg-slate-50/80 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-800">Best jobs</span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[5.5px] font-bold text-emerald-700">
                Recommended by AI
              </span>
            </div>

            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {MOCK_JOBS.map((job) => (
                <div
                  key={job.title}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white p-1.5 shadow-2xs"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[6px] font-extrabold ${job.badgeClass}`}
                  >
                    {job.badge}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[6.5px] font-bold text-slate-800">{job.title}</p>
                    <div className="mt-0.5 flex items-center justify-between gap-1">
                      <span className="truncate text-[5.5px] text-slate-400">{job.company}</span>
                      <span className="shrink-0 text-[5.5px] font-bold text-[#00b14f]">{job.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
