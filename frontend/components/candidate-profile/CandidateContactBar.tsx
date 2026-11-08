import { GENDER_OPTIONS, optionLabel } from '@/constants/candidate-profile';
import type { CandidateProfileResponse } from '@/types/candidate-profile';
import { Calendar, CheckCircle2, Globe, Mail, Phone, UserCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './CandidateSocialIcons';

type CandidateContactBarProps = {
  profile: CandidateProfileResponse;
};

const CHIP_CLASS = 'inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5';

export default function CandidateContactBar({ profile }: CandidateContactBarProps) {
  const genderLabel = optionLabel(GENDER_OPTIONS, profile.gender);
  const links = [
    { href: profile.githubUrl, title: 'GitHub profile', icon: <GithubIcon /> },
    { href: profile.linkedinUrl, title: 'LinkedIn profile', icon: <LinkedinIcon className="h-4 w-4 text-[#0077b5]" /> },
    { href: profile.portfolioUrl, title: 'Portfolio website', icon: <Globe className="text-primary h-4 w-4" /> },
  ];

  return (
    <div className="border-outline-variant mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
      <div className="text-on-surface-variant flex flex-wrap items-center gap-3 text-xs">
        <span className={CHIP_CLASS}>
          <Mail className="text-primary h-3.5 w-3.5" />
          <span className="break-all">{profile.contactEmail ?? profile.email}</span>
        </span>

        <span className={CHIP_CLASS}>
          <Phone className="text-primary h-3.5 w-3.5" />
          <span>{profile.phone ?? 'No phone number'}</span>
          {profile.phone && profile.phoneVerified && (
            <span className="text-primary inline-flex items-center gap-1 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </span>
          )}
        </span>

        {profile.birthYear !== null && (
          <span className={CHIP_CLASS}>
            <Calendar className="text-primary h-3.5 w-3.5" />
            <span>Born {profile.birthYear}</span>
          </span>
        )}

        {genderLabel && (
          <span className={CHIP_CLASS}>
            <UserCheck className="text-primary h-3.5 w-3.5" />
            <span>{genderLabel}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {links.map(
          (link) =>
            link.href && (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                title={link.title}
                aria-label={link.title}
                className="border-outline-variant text-on-surface hover:border-primary flex h-9 w-9 items-center justify-center rounded-xl border bg-white transition hover:bg-emerald-50/50"
              >
                {link.icon}
              </a>
            ),
        )}
      </div>
    </div>
  );
}
