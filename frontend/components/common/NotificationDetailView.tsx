'use client';

import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationTarget } from '@/types/notification';
import { ArrowLeft, Calendar, ExternalLink, Headphones, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface NotificationDetailViewProps {
  target: NotificationTarget;
  baseRoute: string; // e.g. '/recruiter/notifications' or '/admin/notifications'
}

export default function NotificationDetailView({ target, baseRoute }: NotificationDetailViewProps) {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { notifications, markAsRead } = useNotifications(target);

  const notification = useMemo(() => {
    return notifications.find((item) => item.id === id);
  }, [notifications, id]);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  const getTagClasses = (tone?: string) => {
    if (target === 'recruiter') {
      return 'bg-amber-50 text-amber-800 border-amber-200/90';
    }

    switch (tone) {
      case 'danger':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60';
      case 'warning':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60';
    }
  };

  if (!notification) {
    return (
      <div className="space-y-4 pb-16">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(baseRoute)}
            className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
          <h1 className="dark:text-forest-100 text-base font-bold text-slate-800">Notification Details</h1>
        </div>

        <div className="dark:border-forest-800 dark:bg-forest-900 rounded-xl border border-slate-200 bg-white p-12 text-center">
          <Sparkles className="dark:text-forest-600 mx-auto h-10 w-10 stroke-[1.5] text-slate-300" />
          <h2 className="dark:text-forest-100 mt-3 text-base font-bold text-slate-800">Notification not found</h2>
          <p className="dark:text-forest-400 mt-1 text-xs text-slate-500">
            The notification you are looking for may have been removed or does not exist.
          </p>
          <div className="mt-5">
            <Link
              href={baseRoute}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00b14f] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#00873c]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to notifications</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      {/* Top action bar: Back button + heading (TopCV Image 3) */}
      <div className="dark:border-forest-800 flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => router.push(baseRoute)}
          className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 dark:hover:text-forest-50 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>

        <h1 className="dark:text-forest-300 text-sm font-bold text-slate-700 sm:text-base">Notification details</h1>
      </div>

      {/* Main Announcement Card (TopCV Image 3) */}
      <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        {/* Title and metadata */}
        <div className="dark:border-forest-800 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getTagClasses(
                notification.tagTone,
              )}`}
            >
              {target === 'recruiter' ? 'Notification' : notification.tag}
            </span>

            <span className="dark:text-forest-400 inline-flex items-center gap-1 font-mono text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {notification.displayDate}
            </span>
          </div>

          <h2 className="dark:text-forest-50 mt-3 text-lg leading-snug font-black text-slate-900 sm:text-xl lg:text-2xl">
            {notification.title}
          </h2>
        </div>

        {/* Rich body content */}
        <div className="dark:text-forest-200 mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
          {notification.intro && (
            <p className="dark:text-forest-100 leading-relaxed font-normal text-slate-800">{notification.intro}</p>
          )}

          {notification.sections?.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.heading && (
                <h3 className="dark:text-forest-50 text-sm font-bold text-slate-900 sm:text-base">{section.heading}</h3>
              )}
              {section.paragraph && (
                <p className="dark:text-forest-200 leading-relaxed text-slate-700">{section.paragraph}</p>
              )}
              {section.items && section.items.length > 0 && (
                <ul className="list-disc space-y-1.5 pl-5 marker:text-[#00b14f]">
                  {section.items.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="dark:text-forest-200 leading-relaxed text-slate-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Fallback to summary if no sections */}
          {(!notification.sections || notification.sections.length === 0) && (
            <p className="dark:text-forest-200 leading-relaxed text-slate-700">{notification.summary}</p>
          )}

          {/* Contact Support Hotline / Email Box (TopCV Image 3) */}
          <div className="dark:border-forest-800 dark:bg-forest-850/70 mt-8 rounded-xl border border-slate-100 bg-slate-50/80 p-4.5 sm:p-5">
            <p className="dark:text-forest-300 text-xs font-semibold text-slate-600 sm:text-[13px]">
              For any inquiries or assistance, please contact your account manager or our official support desk:
            </p>
            <div className="dark:text-forest-200 mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 sm:text-sm">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-[#00b14f]" />
                <span>
                  Customer Hotline:{' '}
                  <strong className="dark:text-forest-50 text-slate-900">
                    {notification.footerContact?.hotline || '1900 068 889 (Ext. 1)'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00b14f]" />
                <span>
                  Email:{' '}
                  <a
                    href={`mailto:${notification.footerContact?.email || 'support@intervue.vn'}`}
                    className="font-medium text-[#00b14f] hover:underline"
                  >
                    {notification.footerContact?.email || 'support@intervue.vn'}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Optional Action CTA */}
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
