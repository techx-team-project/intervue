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
    <div className="dark:border-forest-800 border-outline-variant flex items-center gap-3 border-b pb-3">
      <button
        type="button"
        onClick={() => router.push(baseRoute)}
        className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 dark:hover:text-forest-50 border-outline-variant text-on-surface hover:bg-surface-container-low hover:text-on-surface inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{copy.back}</span>
      </button>
      <h1 className="dark:text-forest-300 text-on-surface text-sm font-bold sm:text-base">{copy.detailsHeading}</h1>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4 pb-16">
        {backBar}
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-xl border bg-white p-6 shadow-xs sm:p-8">
          <div className="dark:bg-forest-800 bg-surface-container-high h-5 w-32 animate-pulse rounded-md" />
          <div className="dark:bg-forest-800 bg-surface-container-high h-7 w-3/4 animate-pulse rounded" />
          <div className="dark:bg-forest-800 bg-surface-container-high h-4 w-full animate-pulse rounded" />
          <div className="dark:bg-forest-800 bg-surface-container-high h-4 w-5/6 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (isError || !notification) {
    return (
      <div className="space-y-4 pb-16">
        {backBar}
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-xl border bg-white p-12 text-center">
          <Sparkles className="dark:text-forest-600 text-outline mx-auto h-10 w-10 stroke-[1.5]" />
          <h2 className="dark:text-forest-100 text-on-surface mt-3 text-base font-bold">{copy.notFoundTitle}</h2>
          <p className="dark:text-forest-400 text-on-surface-variant mt-1 text-xs">{copy.notFoundBody}</p>
          <div className="mt-5">
            <Link
              href={baseRoute}
              className="bg-primary hover:bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xs transition"
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

      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant overflow-hidden rounded-xl border bg-white p-6 shadow-xs sm:p-8">
        <div className="dark:border-forest-800 border-outline-variant border-b pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${tagClasses}`}>
              {realm === 'recruiter'
                ? copy.tagFallback
                : vi
                  ? NOTIFICATION_CATEGORY_LABELS_VI[notification.category]
                  : NOTIFICATION_CATEGORY_LABELS[notification.category]}
            </span>

            <span className="dark:text-forest-400 text-outline inline-flex items-center gap-1 font-mono text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {formatNotificationDateTime(notification.createdAt)}
            </span>
          </div>

          <h2 className="dark:text-forest-50 text-on-surface mt-3 text-lg leading-snug font-bold sm:text-xl lg:text-2xl">
            {notification.title}
          </h2>
        </div>

        <div className="dark:text-forest-200 text-on-surface mt-6 space-y-5 text-sm leading-relaxed">
          {notification.bodyMarkdown ? (
            <NotificationMarkdown content={notification.bodyMarkdown} />
          ) : (
            <p className="dark:text-forest-200 text-on-surface leading-relaxed">{notification.summary}</p>
          )}

          <div className="dark:border-forest-800 dark:bg-forest-850/70 border-outline-variant bg-surface-container-low/80 mt-8 rounded-xl border p-4.5 sm:p-5">
            <p className="dark:text-forest-300 text-on-surface-variant sm:text-body-md text-xs font-semibold">
              {copy.supportIntro}
            </p>
            <div className="dark:text-forest-200 text-on-surface mt-3 flex flex-wrap items-center gap-4 text-xs font-medium sm:text-sm">
              <div className="flex items-center gap-2">
                <Headphones className="text-primary h-4 w-4" />
                <span>
                  {copy.hotlineLabel}:{' '}
                  <strong className="dark:text-forest-50 text-on-surface">{SUPPORT_HOTLINE}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-primary h-4 w-4" />
                <span>
                  Email:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-medium hover:underline">
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
                className="bg-primary hover:bg-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
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
