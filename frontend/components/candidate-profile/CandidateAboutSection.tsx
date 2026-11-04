'use client';

import { Edit2, User } from 'lucide-react';

type CandidateAboutSectionProps = {
  bio: string | null;
  onEdit: () => void;
};

export default function CandidateAboutSection({ bio, onEdit }: CandidateAboutSectionProps) {
  return (
    <section className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-primary flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <User className="h-5 w-5" />
          </div>
          <h2 className="text-navy text-lg font-bold sm:text-xl">About me</h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="hover:text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#6f7882] transition-colors hover:bg-[#f4f5f5]"
          title="Edit about"
          aria-label="Edit about"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-[#f8fafc] p-5">
        {bio ? (
          <p className="text-[14.5px] leading-relaxed whitespace-pre-line text-[#334155]">{bio}</p>
        ) : (
          <p className="text-sm text-slate-500">
            Tell recruiters about your background and what you are looking for.{' '}
            <button
              type="button"
              onClick={onEdit}
              className="text-primary cursor-pointer font-semibold hover:underline"
            >
              Add a summary
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
