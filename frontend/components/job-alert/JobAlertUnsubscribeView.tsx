'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  BellOff,
  CheckCircle2,
  Clock,
  Home,
  Loader2,
  MapPin,
  PauseCircle,
  Search,
  Trash2,
} from 'lucide-react';
import { jobAlertApi } from '@/apiRequest/job-alert';
import type { JobAlertUnsubscribeInfo } from '@/types/job-alert';

export default function JobAlertUnsubscribeView() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState<JobAlertUnsubscribeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedAction, setCompletedAction] = useState<'PAUSE' | 'DELETE' | null>(null);

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setError('Missing or invalid unsubscribe token in URL.');
        setLoading(false);
      }, 0);
      return;
    }

    let isMounted = true;
    void (async () => {
      try {
        const data = await jobAlertApi.getUnsubscribeInfo(token);
        if (isMounted) setAlertInfo(data);
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Job alert not found or link has expired.';
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAction = async (action: 'PAUSE' | 'DELETE') => {
    if (!token) return;
    setIsProcessing(true);
    try {
      await jobAlertApi.processUnsubscribe({ token, action });
      setCompletedAction(action);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process your request.';
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      {/* Top Logo / Icon */}
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs">
          <BellOff className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">Job Alert Preferences</h1>
        <p className="mt-1.5 text-sm text-slate-500">Manage or unsubscribe from your automated email digest</p>
      </div>

      {/* Main Container Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="mt-3 text-sm text-slate-500">Retrieving alert information...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900">Unable to proceed</h3>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Home className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>
          </div>
        ) : completedAction ? (
          /* Confirmation Success State */
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">
              {completedAction === 'PAUSE' ? 'Job Alert Paused' : 'Unsubscribed Successfully'}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              {completedAction === 'PAUSE'
                ? `You have temporarily paused email digests for "${alertInfo?.title}". You will no longer receive daily emails, but your criteria remains saved in your candidate dashboard.`
                : `You have successfully deleted "${alertInfo?.title}". You will no longer receive any emails regarding this alert.`}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Home className="h-4 w-4" />
                <span>Return to InterVue</span>
              </Link>
              <Link
                href="/candidate/job-alerts"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Manage Other Alerts
              </Link>
            </div>
          </div>
        ) : (
          /* Decision Form */
          <div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Subscribed Alert</span>
              <h3 className="mt-1 text-base font-bold text-slate-900">{alertInfo?.title}</h3>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {alertInfo?.keyword && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-slate-700">
                    <Search className="h-3 w-3 text-slate-400" />
                    <span>{alertInfo.keyword}</span>
                  </span>
                )}
                {alertInfo?.city && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-slate-700">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{alertInfo.city}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-slate-700">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>{alertInfo?.frequency === 'DAILY' ? 'Daily Digest' : 'Weekly Digest'}</span>
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-600">Please choose how you would like to update your subscription:</p>

            <div className="mt-4 space-y-3">
              {/* Option 1: Pause */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleAction('PAUSE')}
                className="group flex w-full cursor-pointer items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <PauseCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Pause Email Digests</span>
                    <span className="py-0.2 rounded-full bg-emerald-100 px-2 text-[10px] font-bold text-emerald-800">
                      Recommended
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Temporarily stop receiving emails while keeping your criteria saved. You can re-enable anytime.
                  </p>
                </div>
              </button>

              {/* Option 2: Delete */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleAction('DELETE')}
                className="group flex w-full cursor-pointer items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-red-400 hover:bg-red-50/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 transition group-hover:text-red-700">
                    Unsubscribe & Delete Alert
                  </span>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Permanently delete this alert and remove all associated preferences.
                  </p>
                </div>
              </button>
            </div>

            {isProcessing && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span>Processing your request...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
