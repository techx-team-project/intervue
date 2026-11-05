'use client';

import { ROUTES } from '@/constants/routes';
import { useResendVerification } from '@/hooks/useResendVerification';
import type { RecruiterVerificationProfile, VerificationChecklistItem } from '@/types/recruiter-company';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, Clock, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface VerificationChecklistProps {
  profile: RecruiterVerificationProfile;
}

const BLOCKED_REASON_MESSAGES: Record<string, { title: string; desc: string; actionUrl: string; actionLabel: string }> =
  {
    EMAIL_NOT_VERIFIED: {
      title: 'Email verification required',
      desc: 'Verify your account email address to enable basic recruitment workflows.',
      actionUrl: ROUTES.VERIFY_EMAIL,
      actionLabel: 'Verify email',
    },
    NOT_COMPANY_MEMBER: {
      title: 'No company linked',
      desc: 'You are not linked to an active company profile. Join an existing employer or create a new company.',
      actionUrl: ROUTES.RECRUITER_COMPANY,
      actionLabel: 'Link company',
    },
    COMPANY_AGREEMENT_MISSING: {
      title: 'Company data agreement pending',
      desc: 'The company owner must accept the corporate data processing agreement before members can publish.',
      actionUrl: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
      actionLabel: 'Review agreements',
    },
    VERIFICATION_INCOMPLETE: {
      title: 'Level 2 verification incomplete',
      desc: 'Verify your phone number and confirm personal data protection terms.',
      actionUrl: ROUTES.RECRUITER_COMPANY_PHONE_VERIFY,
      actionLabel: 'Complete requirements',
    },
    COMPANY_NOT_VERIFIED: {
      title: 'Company business license under review',
      desc: 'Your employer profile requires an approved Enterprise Registration Certificate (ERC).',
      actionUrl: ROUTES.RECRUITER_COMPANY_LICENSE,
      actionLabel: 'Check license status',
    },
    RECRUITER_NOT_AUTHORIZED_FOR_COMPANY: {
      title: 'Authorization required to publish',
      desc: 'As a team member, you must submit an approved Letter of Authorization (LOA) to publish jobs on behalf of this company.',
      actionUrl: ROUTES.RECRUITER_COMPANY_LICENSE,
      actionLabel: 'Submit Letter of Authorization',
    },
  };

export function VerificationChecklist({ profile }: VerificationChecklistProps) {
  const blockedNotice = profile.blockedReason ? BLOCKED_REASON_MESSAGES[profile.blockedReason] : null;
  const resend = useResendVerification();

  return (
    <div className="flex h-full flex-col justify-between bg-white p-6 select-none sm:p-8 lg:p-10">
      <div className="space-y-6">
        {/* Header & Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {profile.levelLabel}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {profile.stepsCompleted} of {profile.stepsTotal} steps completed
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Account Verification & Trust</h1>
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Complete the verification checklist below to build candidate trust, protect corporate identity, and unlock
            public job publishing.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Progress to Level 3 Enterprise</span>
            <span className="font-bold text-slate-900">{profile.completionPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${profile.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Blocked Reason Callout */}
        {blockedNotice && !profile.canPublish && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="space-y-1">
                <p className="text-sm font-bold">{blockedNotice.title}</p>
                <p className="text-xs text-amber-800/90">{blockedNotice.desc}</p>
                <div className="pt-1.5">
                  {profile.blockedReason === 'EMAIL_NOT_VERIFIED' ? (
                    <button
                      type="button"
                      disabled={resend.isPending}
                      onClick={() => resend.mutate()}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-amber-900 underline hover:text-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span>{resend.isPending ? 'Sending verification email...' : 'Resend verification email'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={blockedNotice.actionUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 underline hover:text-amber-950"
                    >
                      <span>{blockedNotice.actionLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checklist List */}
        <div className="space-y-3 pt-2">
          {profile.checklist.map((item) => (
            <ChecklistRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Footer next actionable step */}
      <div className="mt-8 border-t border-slate-100 pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            {profile.canPublish ? (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Publishing rights active: You can post public jobs and review applicant CVs.
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-600">
                <Lock className="h-4 w-4 text-slate-400" />
                Publishing locked until Level 3 verification is approved.
              </span>
            )}
          </div>

          <Link
            href={profile.nextStepUrl}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            <span>{profile.nextStepLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChecklistRow({ item }: { item: VerificationChecklistItem }) {
  const isApproved = item.status === 'APPROVED';
  const isInReview = item.status === 'IN_REVIEW';
  const isRejected = item.status === 'REJECTED';
  const isActionRequired = item.status === 'ACTION_REQUIRED';
  const isExpired = item.status === 'EXPIRED';
  const isRevoked = item.status === 'REVOKED';

  return (
    <div
      className={`group flex items-start justify-between rounded-xl border p-3.5 transition ${
        isApproved
          ? 'border-emerald-200/80 bg-emerald-50/30'
          : isInReview
            ? 'border-amber-200/80 bg-amber-50/20'
            : isRejected || isRevoked
              ? 'border-rose-200/80 bg-rose-50/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="mt-0.5">
          {isApproved ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          ) : isInReview ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
              <Clock className="h-3.5 w-3.5" />
            </div>
          ) : isRejected || isRevoked ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
          ) : isActionRequired ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-bold text-slate-500">
              {item.order}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-bold ${isApproved ? 'text-slate-800' : 'text-slate-900'}`}>
              {item.title}
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
              {item.badgeLabel}
            </span>
            {isInReview && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                Awaiting review
              </span>
            )}
            {isRejected && (
              <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">Rejected</span>
            )}
            {isExpired && (
              <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-800">Expired</span>
            )}
            {isRevoked && (
              <span className="rounded bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-900">Revoked</span>
            )}
          </div>

          <p className="text-xs text-slate-500">{item.description}</p>

          {/* Rejection / Note */}
          {item.reviewReason && (
            <p className="mt-1 text-xs font-medium text-rose-700">
              Feedback from compliance: &ldquo;{item.reviewReason}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Action link */}
      <div className="ml-3 shrink-0">
        {isApproved ? (
          <Link
            href={item.actionUrl}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            View details
          </Link>
        ) : (
          <Link
            href={item.actionUrl}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span>{isRejected || isExpired ? 'Resubmit' : item.actionLabel}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
