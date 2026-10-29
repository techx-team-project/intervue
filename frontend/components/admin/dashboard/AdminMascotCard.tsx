import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CAPABILITIES = [
  'Answers only questions about using InterVue',
  'Reads the guide documents and FAQ you publish',
  'Refuses anything outside that scope',
];

export default function AdminMascotCard() {
  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-2xl border border-[#e9eaec] bg-white shadow-xs">
      <div className="flex items-center gap-2.5 px-4 py-3.5">
        <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-black">
          AI
        </span>
        <h2 className="text-navy dark:text-forest-50 text-[14px] font-bold">InterVue Bot AI</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="relative h-44 overflow-hidden rounded-xl bg-[#00110b]">
          <Image
            src="/admin/banner-bot.jpg"
            alt="InterVue Bot AI mascot waving"
            fill
            sizes="(max-width: 1024px) 90vw, 30vw"
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col justify-center gap-2.5">
          <p className="text-navy dark:text-forest-100 text-[13.5px] leading-relaxed font-semibold">
            The help chatbot answers from the documents you maintain — keep them current and it stays accurate.
          </p>

          <ul className="space-y-1.5">
            {CAPABILITIES.map((capability) => (
              <li key={capability} className="dark:text-forest-300 flex items-start gap-2 text-[12.5px] text-[#64748b]">
                <Check className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{capability}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/mascot"
            className="bg-primary hover:bg-primary-hover mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-bold text-white transition-colors"
          >
            <span>Open the mascot studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
