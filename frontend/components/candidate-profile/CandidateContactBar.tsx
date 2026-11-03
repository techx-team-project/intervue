import { GENDER_OPTIONS, optionLabel } from '@/constants/candidate-profile';
import type { CandidateProfileResponse } from '@/types/candidate-profile';
import { Calendar, CheckCircle2, Globe, Mail, Phone, UserCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './CandidateSocialIcons';

type CandidateContactBarProps = {
  profile: CandidateProfileResponse;
};

const CHIP_CLASS = 'inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5';

export default function CandidateContactBar({ profile }: CandidateContactBarProps) {
  const genderLabel = optionLabel(GENDER_OPTIONS, profile.gender);
  const links = [
    { href: profile.githubUrl, title: 'GitHub profile', icon: <GithubIcon /> },
    { href: profile.linkedinUrl, title: 'LinkedIn profile', icon: <LinkedinIcon className="h-4 w-4 text-[#0077b5]" /> },
    { href: profile.portfolioUrl, title: 'Portfolio website', icon: <Globe className="text-primary h-4 w-4" /> },
  ];

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className={CHIP_CLASS}>
          <Mail className="text-primary h-3.5 w-3.5" />
          <span className="break-all">{profile.contactEmail ?? profile.email}</span>
        </span>

        <span className={CHIP_CLASS}>
          <Phone className="text-primary h-3.5 w-3.5" />
          <span>{profile.phone ?? 'No phone number'}</span>
          {profile.phone && profile.phoneVerified && (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
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
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:border-emerald-500 hover:bg-emerald-50/50"
              >
                {link.icon}
              </a>
            ),
        )}
      </div>
    </div>
  );
}
