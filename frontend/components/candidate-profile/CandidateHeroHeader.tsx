'use client';

import { useState } from 'react';
import {
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  Copy,
  Edit3,
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
  Share2,
  UserCheck,
} from 'lucide-react';
import type { CandidateProfile } from '@/types/candidate';
import Button from '@/components/ui/Button';

const GithubIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedinIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

interface CandidateHeroHeaderProps {
  candidate: CandidateProfile;
  isOwner?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onContact?: () => void;
  onBookmark?: () => void;
}

export default function CandidateHeroHeader({
  candidate,
  isOwner = true,
  onEdit,
  onShare,
  onContact,
  onBookmark,
}: CandidateHeroHeaderProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(candidate.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
      {/* 1. Main Header Profile Info */}
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Avatar & Key Identification */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar with ring & verified check */}
          <div className="relative shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm ring-2 ring-emerald-500/20 sm:h-28 sm:w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={candidate.avatar} alt={candidate.fullName} className="h-full w-full object-cover" />
            </div>
            <div
              className="bg-primary absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white shadow-xs"
              title="Hồ sơ đã được InterVue xác thực"
            >
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          {/* Candidate Title & Details */}
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">{candidate.fullName}</h1>

            <p className="text-primary text-base font-semibold">{candidate.title}</p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Briefcase className="text-primary h-3.5 w-3.5" />
                {candidate.experiences[0]?.role} @{' '}
                <strong className="text-slate-800">{candidate.experiences[0]?.company}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="text-primary h-3.5 w-3.5" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Always on a single row */}
        <div className="flex shrink-0 items-center gap-2">
          {isOwner ? (
            <>
              {onEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  leftIcon={<Edit3 className="h-4 w-4" />}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={
                  onContact || (() => alert(`Đã gửi yêu cầu kết nối & mời phỏng vấn đến ${candidate.fullName}!`))
                }
                leftIcon={<Send className="h-4 w-4" />}
              >
                Mời phỏng vấn
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onBookmark || (() => alert(`Đã lưu hồ sơ của ${candidate.fullName} vào danh sách theo dõi!`))}
                leftIcon={<Bookmark className="h-4 w-4" />}
              >
                Lưu hồ sơ
              </Button>
            </>
          )}

          {onShare && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onShare}
              leftIcon={<Share2 className="h-4 w-4" />}
            >
              Chia sẻ
            </Button>
          )}
        </div>
      </div>

      {/* 3. Info Pills & Social Media Strip */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
        {/* Contact Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <a
            href={`mailto:${candidate.email}`}
            className="hover:text-primary inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 transition-colors hover:bg-emerald-50"
          >
            <Mail className="text-primary h-3.5 w-3.5" />
            <span>{candidate.email}</span>
          </a>

          <button
            type="button"
            onClick={handleCopyPhone}
            className="hover:text-primary inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 transition-colors hover:bg-emerald-50"
            title="Nhấn để sao chép số điện thoại"
          >
            <Phone className="text-primary h-3.5 w-3.5" />
            <span>{candidate.phone}</span>
            <Copy className="h-3 w-3 text-slate-400" />
            {copiedPhone && <span className="text-primary text-xs font-bold">Đã sao chép!</span>}
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5">
            <Calendar className="text-primary h-3.5 w-3.5" />
            <span>Năm sinh: {candidate.birthYear}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5">
            <UserCheck className="text-primary h-3.5 w-3.5" />
            <span>Giới tính: {candidate.gender}</span>
          </span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          {candidate.links.github && (
            <a
              href={candidate.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition-all hover:border-emerald-500 hover:bg-emerald-50/50"
              title="GitHub Profile"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}

          {candidate.links.linkedin && (
            <a
              href={candidate.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0077b5] transition-all hover:border-[#0077b5] hover:bg-[#0077b5]/5"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}

          {candidate.links.portfolio && (
            <a
              href={candidate.links.portfolio}
              target="_blank"
              rel="noreferrer"
              className="text-primary flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white transition-all hover:border-emerald-500 hover:bg-emerald-50/50"
              title="Portfolio Website"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
