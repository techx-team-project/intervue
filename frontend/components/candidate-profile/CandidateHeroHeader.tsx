'use client';

import Button from '@/components/ui/Button';
import UserAvatar from '@/components/ui/UserAvatar';
import { JOB_SEARCH_STATUS_OPTIONS, optionLabel } from '@/constants/candidate-profile';
import { cn } from '@/lib/utils';
import type { CandidateProfileResponse, JobSearchStatus } from '@/types/candidate-profile';
import { Edit3, MapPin } from 'lucide-react';
import CandidateContactBar from './CandidateContactBar';
import CandidateImageControls from './CandidateImageControls';

const STATUS_STYLES: Record<JobSearchStatus, string> = {
  ACTIVELY_LOOKING: 'bg-primary-light text-primary',
  OPEN_TO_OFFERS: 'bg-primary-light text-on-primary-container',
  NOT_LOOKING: 'bg-surface-container-high text-on-surface-variant',
};

type CandidateHeroHeaderProps = {
  profile: CandidateProfileResponse;
  onEdit: () => void;
};

export default function CandidateHeroHeader({ profile, onEdit }: CandidateHeroHeaderProps) {
  const statusLabel = optionLabel(JOB_SEARCH_STATUS_OPTIONS, profile.jobSearchStatus);

  return (
    <section className="border-outline-variant overflow-hidden rounded-3xl border bg-white shadow-xs">
      <div
        role={profile.coverUrl ? 'img' : undefined}
        aria-label={profile.coverUrl ? 'Cover image' : undefined}
        className="bg-primary-light relative h-32 bg-cover bg-center sm:h-44"
        style={profile.coverUrl ? { backgroundImage: `url("${profile.coverUrl}")` } : undefined}
      >
        <CandidateImageControls
          kind="cover"
          hasImage={profile.coverUrl !== null}
          uploadLabel="Change cover image"
          removeLabel="Remove cover image"
          className="absolute top-3 right-3"
        />
      </div>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative w-fit">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-sm sm:h-28 sm:w-28">
              {profile.avatarUrl ? (
                <div
                  role="img"
                  aria-label={profile.name}
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${profile.avatarUrl}")` }}
                />
              ) : (
                <UserAvatar fullName={profile.name} className="h-full w-full rounded-none text-3xl" />
              )}
            </div>
            <CandidateImageControls
              kind="avatar"
              hasImage={profile.avatarUrl !== null}
              uploadLabel="Change profile photo"
              removeLabel="Remove profile photo"
              className="absolute -right-3 -bottom-2"
            />
          </div>

          <Button type="button" variant="outline" size="sm" onClick={onEdit} leftIcon={<Edit3 className="h-4 w-4" />}>
            Edit profile
          </Button>
        </div>

        <div className="mt-4 min-w-0 space-y-1">
          <h1 className="text-on-surface text-2xl font-bold tracking-tight wrap-break-word sm:text-3xl">
            {profile.name}
          </h1>
          {profile.headline ? (
            <p className="text-primary text-base font-semibold">{profile.headline}</p>
          ) : (
            <p className="text-on-surface-variant text-sm">Add a headline to introduce yourself.</p>
          )}
          <div className="text-on-surface-variant flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            {profile.address && (
              <span className="flex items-center gap-1">
                <MapPin className="text-primary h-3.5 w-3.5" />
                {profile.address}
              </span>
            )}
            {statusLabel && (
              <span className={cn('rounded-full px-2.5 py-0.5 font-semibold', STATUS_STYLES[profile.jobSearchStatus])}>
                {statusLabel}
              </span>
            )}
          </div>
        </div>

        <CandidateContactBar profile={profile} />
      </div>
    </section>
  );
}
