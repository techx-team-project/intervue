'use client';

import { Edit2, User } from 'lucide-react';

type CandidateAboutSectionProps = {
  bio: string | null;
  onEdit: () => void;
};

export default function CandidateAboutSection({ bio, onEdit }: CandidateAboutSectionProps) {
  return (
    <section className="border-outline-variant rounded-3xl border bg-white p-6 shadow-xs sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-primary bg-primary-light flex h-9 w-9 items-center justify-center rounded-xl">
            <User className="h-5 w-5" />
          </div>
          <h2 className="text-navy text-lg font-bold sm:text-xl">About me</h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="hover:text-primary text-on-surface-variant hover:bg-surface-container-low flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
          title="Edit about"
          aria-label="Edit about"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-5">
        {bio ? (
          <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{bio}</p>
        ) : (
          <p className="text-on-surface-variant text-sm">
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
