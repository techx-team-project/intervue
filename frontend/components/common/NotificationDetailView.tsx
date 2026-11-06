'use client';

import NotificationMarkdown from '@/components/common/NotificationMarkdown';
import {
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CATEGORY_LABELS_VI,
  RECRUITER_TAG_CLASSES,
  SEVERITY_TONE_CLASSES,
  isVietnameseRealm,
  notificationCopy,
} from '@/constants/notification';
import { useNotificationDetail } from '@/hooks/useNotifications';
import type { NotificationRealm } from '@/types/notification';
import { formatNotificationDateTime } from '@/utils/notification';
import { ArrowLeft, Calendar, ExternalLink, Headphones, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface NotificationDetailViewProps {
  realm: NotificationRealm;
  baseRoute: string;
}

const SUPPORT_HOTLINE = '1900 068 889 (Ext. 1)';
const SUPPORT_EMAIL = 'support@intervue.vn';

export default function NotificationDetailView({ realm, baseRoute }: NotificationDetailViewProps) {
  const params = useParams();
  const router = useRouter();
  const rawId = typeof params?.id === 'string' ? Number(params.id) : NaN;
  const id = Number.isFinite(rawId) ? rawId : null;

  const { notification, isLoading, isError, markAsRead } = useNotificationDetail(realm, id);
  const copy = notificationCopy(realm);
  const vi = isVietnameseRealm(realm);
  const markedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!notification || notification.readAt !== null || markedRef.current === notification.id) return;
    markedRef.current = notification.id;
    markAsRead(notification.id);
  }, [notification, markAsRead]);

  const backBar = (
    <div className="dark:border-forest-800 flex items-center gap-3 border-b border-slate-200 pb-3">
      <button
        type="button"
        onClick={() => router.push(baseRoute)}
        className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 dark:hover:text-forest-50 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{copy.back}</span>
      </button>
      <h1 className="dark:text-forest-300 text-sm font-bold text-slate-700 sm:text-base">{copy.detailsHeading}</h1>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4 pb-16">
        {backBar}
        <div className="dark:border-forest-800 dark:bg-forest-900 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="dark:bg-forest-800 h-5 w-32 animate-pulse rounded-md bg-slate-100" />
          <div className="dark:bg-forest-800 h-7 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="dark:bg-forest-800 h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="dark:bg-forest-800 h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (isError || !notification) {
    return (
      <div className="space-y-4 pb-16">
        {backBar}
        <div className="dark:border-forest-800 dark:bg-forest-900 rounded-xl border border-slate-200 bg-white p-12 text-center">
          <Sparkles className="dark:text-forest-600 mx-auto h-10 w-10 stroke-[1.5] text-slate-300" />
          <h2 className="dark:text-forest-100 mt-3 text-base font-bold text-slate-800">{copy.notFoundTitle}</h2>
          <p className="dark:text-forest-400 mt-1 text-xs text-slate-500">{copy.notFoundBody}</p>
          <div className="mt-5">
            <Link
              href={baseRoute}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00b14f] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#00873c]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{copy.backToList}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tagClasses = realm === 'recruiter' ? RECRUITER_TAG_CLASSES : SEVERITY_TONE_CLASSES[notification.severity];

  return (
    <div className="space-y-4 pb-16">
      {backBar}

      <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="dark:border-forest-800 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${tagClasses}`}>
              {realm === 'recruiter'
                ? copy.tagFallback
                : vi
                  ? NOTIFICATION_CATEGORY_LABELS_VI[notification.category]
                  : NOTIFICATION_CATEGORY_LABELS[notification.category]}
            </span>

            <span className="dark:text-forest-400 inline-flex items-center gap-1 font-mono text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatNotificationDateTime(notification.createdAt)}
            </span>
          </div>

          <h2 className="dark:text-forest-50 mt-3 text-lg leading-snug font-black text-slate-900 sm:text-xl lg:text-2xl">
            {notification.title}
          </h2>
        </div>

        <div className="dark:text-forest-200 mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
          {notification.bodyMarkdown ? (
            <NotificationMarkdown content={notification.bodyMarkdown} />
          ) : (
            <p className="dark:text-forest-200 leading-relaxed text-slate-700">{notification.summary}</p>
          )}

          <div className="dark:border-forest-800 dark:bg-forest-850/70 mt-8 rounded-xl border border-slate-100 bg-slate-50/80 p-4.5 sm:p-5">
            <p className="dark:text-forest-300 text-xs font-semibold text-slate-600 sm:text-[13px]">
              {copy.supportIntro}
            </p>
            <div className="dark:text-forest-200 mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 sm:text-sm">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-[#00b14f]" />
                <span>
                  {copy.hotlineLabel}: <strong className="dark:text-forest-50 text-slate-900">{SUPPORT_HOTLINE}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00b14f]" />
                <span>
                  Email:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-[#00b14f] hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {notification.actionUrl && notification.actionLabel && (
            <div className="mt-6 pt-2">
              <Link
                href={notification.actionUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-[#00b14f] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#00873c] active:scale-95"
              >
                <span>{notification.actionLabel}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
