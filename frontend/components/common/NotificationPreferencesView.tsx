'use client';

import {
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CATEGORY_LABELS_VI,
  isVietnameseRealm,
} from '@/constants/notification';
import { useNotificationPreferences } from '@/hooks/useNotifications';
import Switch from '@/components/ui/Switch';
import type { NotificationPreferenceResource, NotificationRealm } from '@/types/notification';
import { AlertTriangle, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreferencesViewProps {
  realm: NotificationRealm;
}

const COPY = {
  en: {
    heading: 'Notification preferences',
    intro: 'Choose which notifications reach your notification centre and your inbox.',
    inApp: 'In-app',
    email: 'Email',
    locked: 'Always on',
    lockedHint: 'Security and account notifications cannot be switched off.',
    loadError: 'Could not load your preferences',
    saved: 'Preferences updated',
    saveError: 'Could not update your preferences',
  },
  vi: {
    heading: 'Tuỳ chọn thông báo',
    intro: 'Chọn loại thông báo bạn muốn nhận trong trung tâm thông báo và qua email.',
    inApp: 'Trong ứng dụng',
    email: 'Email',
    locked: 'Luôn bật',
    lockedHint: 'Thông báo bảo mật và tài khoản không thể tắt.',
    loadError: 'Không tải được tuỳ chọn của bạn',
    saved: 'Đã cập nhật tuỳ chọn',
    saveError: 'Không cập nhật được tuỳ chọn',
  },
};

export default function NotificationPreferencesView({ realm }: NotificationPreferencesViewProps) {
  const { preferences, isLoading, isError, update, isUpdating } = useNotificationPreferences(realm);
  const vi = isVietnameseRealm(realm);
  const copy = vi ? COPY.vi : COPY.en;
  const labels = vi ? NOTIFICATION_CATEGORY_LABELS_VI : NOTIFICATION_CATEGORY_LABELS;

  const toggle = (preference: NotificationPreferenceResource, channel: 'inApp' | 'email') => {
    if (preference.mandatory) return;
    update(
      [
        {
          category: preference.category,
          inApp: channel === 'inApp' ? !preference.inApp : preference.inApp,
          email: channel === 'email' ? !preference.email : preference.email,
        },
      ],
      {
        onSuccess: () => toast.success(copy.saved),
        onError: () => toast.error(copy.saveError),
      },
    );
  };

  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs sm:p-6">
      <h2 className="dark:text-forest-50 text-on-surface text-base font-bold">{copy.heading}</h2>
      <p className="dark:text-forest-400 text-on-surface-variant mt-1 text-xs">{copy.intro}</p>

      {isLoading ? (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="dark:bg-forest-800 bg-surface-container-high h-12 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-6 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 stroke-[1.5] text-amber-500" />
          <p className="dark:text-forest-300 text-on-surface-variant mt-2 text-sm font-semibold">{copy.loadError}</p>
        </div>
      ) : (
        <>
          <ul className="dark:divide-forest-800 divide-outline-variant mt-5 divide-y">
            {preferences.map((preference) => (
              <li key={preference.category} className="flex flex-wrap items-center gap-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="dark:text-forest-100 text-on-surface flex items-center gap-1.5 text-sm font-semibold">
                    {labels[preference.category]}
                    {preference.mandatory && (
                      <span className="dark:bg-forest-800 dark:text-forest-300 bg-surface-container-high text-label-sm text-on-surface-variant inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold">
                        <Lock className="h-2.5 w-2.5" />
                        {copy.locked}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2">
                    <span className="dark:text-forest-400 text-on-surface-variant text-xs font-medium">
                      {copy.inApp}
                    </span>
                    <Switch
                      size="sm"
                      checked={preference.inApp}
                      disabled={preference.mandatory || isUpdating}
                      onChange={() => toggle(preference, 'inApp')}
                      ariaLabel={`${labels[preference.category]} — ${copy.inApp}`}
                    />
                  </label>

                  <label className="flex items-center gap-2">
                    <span className="dark:text-forest-400 text-on-surface-variant text-xs font-medium">
                      {copy.email}
                    </span>
                    <Switch
                      size="sm"
                      checked={preference.email}
                      disabled={preference.mandatory || isUpdating}
                      onChange={() => toggle(preference, 'email')}
                      ariaLabel={`${labels[preference.category]} — ${copy.email}`}
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>

          <p className="dark:border-forest-800 dark:bg-forest-850/60 dark:text-forest-400 border-outline-variant bg-surface-container-low/80 text-on-surface-variant mt-5 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {copy.lockedHint}
          </p>
        </>
      )}
    </section>
  );
}
