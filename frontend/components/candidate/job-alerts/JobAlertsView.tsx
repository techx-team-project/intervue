'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Award,
  Banknote,
  Bell,
  CheckCircle2,
  Clock,
  Laptop,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
} from 'lucide-react';
import { jobAlertApi } from '@/apiRequest/job-alert';
import type { JobAlert, JobAlertSummary } from '@/types/job-alert';
import JobAlertModal from './JobAlertModal';

export default function JobAlertsView() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [summary, setSummary] = useState<JobAlertSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFrequency, setFilterFrequency] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);

  // Delete State
  const [alertToDelete, setAlertToDelete] = useState<JobAlert | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Test Email Sending State
  const [sendingTestAlertId, setSendingTestAlertId] = useState<number | null>(null);
  const [actionNotice, setActionNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const [alertList, summaryData] = await Promise.all([jobAlertApi.listAlerts(), jobAlertApi.getSummary()]);
      setAlerts(alertList);
      setSummary(summaryData);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load job alerts.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const [alertList, summaryData] = await Promise.all([jobAlertApi.listAlerts(), jobAlertApi.getSummary()]);
        if (isMounted) {
          setAlerts(alertList);
          setSummary(summaryData);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load job alerts.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Clear notice after 4 seconds
  useEffect(() => {
    if (!actionNotice) return;
    const timer = setTimeout(() => setActionNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [actionNotice]);

  const handleToggle = async (alert: JobAlert) => {
    // Optimistic UI update
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, isActive: !a.isActive } : a)));

    try {
      const updated = await jobAlertApi.toggleAlert(alert.id);
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      if (summary) {
        setSummary({
          ...summary,
          activeAlerts: updated.isActive ? summary.activeAlerts + 1 : summary.activeAlerts - 1,
          pausedAlerts: updated.isActive ? summary.pausedAlerts - 1 : summary.pausedAlerts + 1,
        });
      }
      setActionNotice({
        message: updated.isActive
          ? `Alert "${updated.title}" has been activated.`
          : `Alert "${updated.title}" is now paused.`,
        type: 'success',
      });
    } catch (err: unknown) {
      // Revert optimistic update
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, isActive: alert.isActive } : a)));
      const message = err instanceof Error ? err.message : 'Failed to update alert status.';
      setActionNotice({ message, type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!alertToDelete) return;
    setIsDeleting(true);
    try {
      await jobAlertApi.deleteAlert(alertToDelete.id);
      setAlerts((prev) => prev.filter((a) => a.id !== alertToDelete.id));
      if (summary) {
        setSummary({
          ...summary,
          totalAlerts: summary.totalAlerts - 1,
          activeAlerts: alertToDelete.isActive ? summary.activeAlerts - 1 : summary.activeAlerts,
          pausedAlerts: !alertToDelete.isActive ? summary.pausedAlerts - 1 : summary.pausedAlerts,
        });
      }
      setActionNotice({
        message: `Job alert "${alertToDelete.title}" was permanently deleted.`,
        type: 'success',
      });
      setAlertToDelete(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete alert.';
      setActionNotice({ message, type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendTestEmail = async (alert: JobAlert) => {
    setSendingTestAlertId(alert.id);
    try {
      const success = await jobAlertApi.sendTestEmail(alert.id);
      if (success) {
        setActionNotice({
          message: `Test email digest for "${alert.title}" was dispatched to your inbox!`,
          type: 'success',
        });
        fetchAlerts();
      } else {
        setActionNotice({
          message: 'No matching jobs found right now for this alert criteria.',
          type: 'error',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not send test email.';
      setActionNotice({ message, type: 'error' });
    } finally {
      setSendingTestAlertId(null);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.keyword && alert.keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.city && alert.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFreq = filterFrequency === 'ALL' || alert.frequency === filterFrequency;
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && alert.isActive) ||
      (filterStatus === 'PAUSED' && !alert.isActive);

    return matchesSearch && matchesFreq && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="transition hover:text-emerald-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/candidate/profile" className="transition hover:text-emerald-600">
          Candidate
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Job Alerts</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Job Alerts</h1>
          <p className="mt-1 text-sm text-slate-600">
            Never miss an opportunity. Get automated email digests matching your preferred roles and locations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingAlert(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>Create Job Alert</span>
        </button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div
          className={`mt-4 flex items-center justify-between rounded-xl p-3.5 text-sm transition-all ${
            actionNotice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span>{actionNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Active Alerts</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {summary ? summary.activeAlerts : 0}
            <span className="ml-1.5 text-xs font-normal text-slate-400">
              / {summary ? summary.totalAlerts : 0} total
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Paused Alerts</span>
          <div className="mt-2 text-2xl font-black text-slate-700">{summary ? summary.pausedAlerts : 0}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Matches Sent</span>
          <div className="mt-2 text-2xl font-black text-emerald-600">{summary ? summary.totalDeliveries : 0}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Delivery Channel</span>
          <div className="mt-2 flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Mail className="h-4 w-4 text-emerald-600" />
            <span>Email Digest</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title, keywords or city..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-3.5 pl-9 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Frequency Filter */}
          <select
            value={filterFrequency}
            onChange={(e) => setFilterFrequency(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">All Frequencies</option>
            <option value="DAILY">Daily (8:00 AM)</option>
            <option value="WEEKLY">Weekly (Monday)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="PAUSED">Paused Only</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid / List */}
      <div className="mt-6">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="mt-3 text-sm text-slate-500">Loading your job alerts...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="mt-2 text-sm font-bold text-red-800">{error}</p>
            <button
              type="button"
              onClick={fetchAlerts}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredAlerts.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              {alerts.length === 0 ? 'No Job Alerts configured yet' : 'No alerts match your filter'}
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-slate-500">
              {alerts.length === 0
                ? 'Create a custom alert to receive fresh IT opportunities matching your target tech stack, salary and location every morning.'
                : 'Try adjusting your search query or reset your filters.'}
            </p>
            {alerts.length === 0 ? (
              <button
                type="button"
                onClick={() => {
                  setEditingAlert(null);
                  setIsModalOpen(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Alert</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterFrequency('ALL');
                  setFilterStatus('ALL');
                }}
                className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Card List */
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                  alert.isActive ? 'border-slate-200' : 'border-slate-200/60 bg-slate-50/40 opacity-80'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900 sm:text-lg">{alert.title}</h3>
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          alert.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${alert.isActive ? 'bg-emerald-600' : 'bg-slate-500'}`}
                        />
                        {alert.isActive ? 'Active' : 'Paused'}
                      </span>

                      {/* Frequency Badge */}
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {alert.frequency === 'DAILY' ? 'Daily (8:00 AM)' : 'Weekly (Monday)'}
                      </span>
                    </div>

                    {/* Criteria Chips */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      {alert.keyword && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                          <Search className="h-3 w-3" />
                          <span>{alert.keyword}</span>
                        </span>
                      )}

                      {alert.city && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          <span>{alert.city}</span>
                        </span>
                      )}

                      {alert.careerLevel && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                          <Award className="h-3 w-3 text-slate-500" />
                          <span>{alert.careerLevel}</span>
                        </span>
                      )}

                      {alert.workMode && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                          <Laptop className="h-3 w-3 text-slate-500" />
                          <span>{alert.workMode}</span>
                        </span>
                      )}

                      {alert.salaryMin && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
                          <Banknote className="h-3 w-3 text-amber-600" />
                          <span>&ge; {alert.salaryMin.toLocaleString('vi-VN')} VND</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata stats row */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {alert.lastSentAt
                            ? `Last digest: ${new Date(alert.lastSentAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}`
                            : 'Never dispatched yet (next digest scheduled)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>
                          <strong>{alert.deliveredCount}</strong> matching job(s) sent
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Active Switch Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggle(alert)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        alert.isActive ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                      title={alert.isActive ? 'Click to Pause' : 'Click to Activate'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          alert.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {/* Send Test Email button */}
                    <button
                      type="button"
                      disabled={sendingTestAlertId === alert.id}
                      onClick={() => handleSendTestEmail(alert)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                      title="Send a sample email digest right now"
                    >
                      {sendingTestAlertId === alert.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      ) : (
                        <Send className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      <span className="hidden sm:inline">Test Email</span>
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAlert(alert);
                        setIsModalOpen(true);
                      }}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      title="Edit Alert"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setAlertToDelete(alert)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      title="Delete Alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <JobAlertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAlert(null);
        }}
        onSuccess={() => {
          fetchAlerts();
          setActionNotice({
            message: editingAlert
              ? 'Job alert updated successfully.'
              : 'New job alert created! We will email you when matching jobs appear.',
            type: 'success',
          });
        }}
        initialData={editingAlert}
      />

      {/* Delete Confirmation Dialog */}
      {alertToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setAlertToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Delete Job Alert?</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Are you sure you want to delete <strong>&quot;{alertToDelete.title}&quot;</strong>? You will no longer
              receive email digests for this search.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setAlertToDelete(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
