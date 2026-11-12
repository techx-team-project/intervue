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
            <span className="bg-primary-light text-primary-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
              <ShieldCheck className="text-primary h-4 w-4" />
              {profile.levelLabel}
            </span>
            <span className="text-on-surface-variant text-xs font-semibold">
              {profile.stepsCompleted} of {profile.stepsTotal} steps completed
            </span>
          </div>

          <h1 className="text-on-surface text-2xl font-bold tracking-tight sm:text-3xl">
            Account Verification & Trust
          </h1>
          <p className="text-on-surface-variant text-xs leading-relaxed sm:text-sm">
            Complete the verification checklist below to build candidate trust, protect corporate identity, and unlock
            public job publishing.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="text-on-surface-variant flex items-center justify-between text-xs font-medium">
            <span>Progress to Level 3 Enterprise</span>
            <span className="text-on-surface font-bold">{profile.completionPercent}%</span>
          </div>
          <div className="bg-surface-container-high h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${profile.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Verification Success Callout */}
        {profile.canPublish && (
          <div className="border-primary/30 bg-primary-light text-primary-deep rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-primary-deep text-sm font-bold">
                  Verification Complete — Level 3 Verified Enterprise
                </p>
                <p className="text-primary-deep text-xs">
                  Your business credentials and data protection agreements have been fully verified. You have full job
                  posting privileges across the platform.
                </p>
              </div>
            </div>
          </div>
        )}

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
      <div className="border-outline-variant mt-8 border-t pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-on-surface-variant text-xs">
            {profile.canPublish ? (
              <span className="text-primary-deep flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="text-primary h-4 w-4" />
                Publishing rights active: You can post public jobs and review applicant CVs.
              </span>
            ) : (
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <Lock className="text-outline h-4 w-4" />
                Publishing locked until Level 3 verification is approved.
              </span>
            )}
          </div>

          <Link
            href={profile.nextStepUrl}
            className="bg-primary hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold text-white transition active:scale-95"
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
          ? 'border-primary/30 bg-primary-light'
          : isInReview
            ? 'border-amber-200/80 bg-amber-50/20'
            : isRejected || isRevoked
              ? 'border-rose-200/80 bg-rose-50/20'
              : 'border-outline-variant hover:border-outline bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="mt-0.5">
          {isApproved ? (
            <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-white">
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
            <div className="border-outline text-on-surface-variant flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold">
              {item.order}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-bold ${isApproved ? 'text-on-surface' : 'text-on-surface'}`}>
              {item.title}
            </span>
            <span className="bg-surface-container-high text-label-sm text-on-surface-variant rounded px-1.5 py-0.5 font-semibold">
              {item.badgeLabel}
            </span>
            {isInReview && (
              <span className="text-label-sm rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
                Awaiting review
              </span>
            )}
            {isRejected && (
              <span className="text-label-sm rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-800">Rejected</span>
            )}
            {isExpired && (
              <span className="bg-surface-container-high text-label-sm text-on-surface rounded px-2 py-0.5 font-bold">
                Expired
              </span>
            )}
            {isRevoked && (
              <span className="text-label-sm rounded bg-rose-200 px-2 py-0.5 font-bold text-rose-900">Revoked</span>
            )}
          </div>

          <p className="text-on-surface-variant text-xs">{item.description}</p>

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
            className="text-primary-deep hover:text-primary-deep text-xs font-semibold hover:underline"
          >
            View details
          </Link>
        ) : (
          <Link
            href={item.actionUrl}
            className="border-outline-variant text-on-surface hover:bg-surface-container-low hover:text-on-surface inline-flex items-center gap-1 rounded-lg border bg-white px-2.5 py-1 text-xs font-bold transition"
          >
            <span>{isRejected || isExpired ? 'Resubmit' : item.actionLabel}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
