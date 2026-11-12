'use client';

import Spinner from '@/components/common/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import {
  useAdminCreateFilterWord,
  useAdminDeleteFilterWord,
  useAdminFilterWords,
  useAdminToggleFilterWord,
  useAdminUpdateFilterWord,
} from '@/hooks/useAdminModeration';
import type { ConnectFilterWord, FilterScope } from '@/types/admin-moderation';
import type { ConnectFilterSeverity } from '@/types/connect';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertTriangle, Edit2, Plus, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const SCOPE_TABS: Array<{ value: FilterScope; label: string; description: string }> = [
  {
    value: 'CONNECT',
    label: 'Messaging',
    description:
      'Messages containing these patterns will be screened. 3 mild strikes or 1 severe strike automatically triggers a Connect mute.',
  },
  {
    value: 'JOB',
    label: 'Job posts',
    description:
      'Severe patterns block a job from being published. Mild patterns let it publish but flag it for review in the reports queue. Accents and letter case are ignored; regex patterns match accent-free lowercase text.',
  },
];

export default function AdminFilterWordsTab() {
  const [scope, setScope] = useState<FilterScope>('CONNECT');
  const { data: pageData, isLoading } = useAdminFilterWords(scope, 0, 100);
  const scopeTab = SCOPE_TABS.find((tab) => tab.value === scope) ?? SCOPE_TABS[0];
  const filterWords = pageData?.items ?? [];

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingTarget, setEditingTarget] = useState<ConnectFilterWord | null>(null);
  const [pattern, setPattern] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [severity, setSeverity] = useState<ConnectFilterSeverity>('MILD');
  const [isActive, setIsActive] = useState(true);
  const [note, setNote] = useState('');

  const [deletingTarget, setDeletingTarget] = useState<ConnectFilterWord | null>(null);

  const createMutation = useAdminCreateFilterWord();
  const updateMutation = useAdminUpdateFilterWord();
  const deleteMutation = useAdminDeleteFilterWord();
  const toggleMutation = useAdminToggleFilterWord();

  const openCreateModal = () => {
    setEditingTarget(null);
    setPattern('');
    setIsRegex(false);
    setSeverity('MILD');
    setIsActive(true);
    setNote('');
    setModalMode('create');
  };

  const openEditModal = (target: ConnectFilterWord) => {
    setEditingTarget(target);
    setPattern(target.pattern);
    setIsRegex(target.regex);
    setSeverity(target.severity);
    setIsActive(target.active);
    setNote(target.note ?? '');
    setModalMode('edit');
  };

  const handleSave = () => {
    const trimmedPattern = pattern.trim();
    if (!trimmedPattern) {
      toast.error('Pattern is required');
      return;
    }

    const payload = {
      pattern: trimmedPattern,
      scope,
      regex: isRegex,
      severity,
      active: isActive,
      note: note.trim() || undefined,
    };

    if (modalMode === 'create') {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Filter word rule created successfully.');
          setModalMode(null);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    } else if (modalMode === 'edit' && editingTarget) {
      updateMutation.mutate(
        { id: editingTarget.id, payload },
        {
          onSuccess: () => {
            toast.success('Filter word rule updated successfully.');
            setModalMode(null);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    }
  };

  const handleDelete = () => {
    if (!deletingTarget) return;
    deleteMutation.mutate(deletingTarget.id, {
      onSuccess: () => {
        toast.success('Filter word rule deleted.');
        setDeletingTarget(null);
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const handleToggle = (id: number) => {
    toggleMutation.mutate(id, {
      onSuccess: () => toast.success('Filter rule active state updated.'),
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Filter scope" className="flex gap-1.5">
        {SCOPE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={scope === tab.value}
            onClick={() => setScope(tab.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              scope === tab.value
                ? 'border-primary bg-primary-light text-primary-deep'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Banner and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Automated Content Filters</h2>
          <p className="text-xs text-slate-500">{scopeTab.description}</p>
        </div>
        <Button onClick={openCreateModal} className="flex shrink-0 items-center gap-1.5 text-xs font-semibold">
          <Plus className="h-4 w-4" />
          Add Filter Rule
        </Button>
      </div>

      {/* Rules Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : filterWords.length === 0 ? (
          <div className="py-12 text-center">
            <Shield className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-medium text-slate-600">No filter rules configured</p>
            <p className="text-xs text-slate-400">
              Click &quot;Add Filter Rule&quot; to create your first content screen rule.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Pattern / Keyword</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filterWords.map((rule) => (
                  <tr key={rule.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="max-w-xs truncate px-4 py-3 font-mono font-medium text-slate-800">{rule.pattern}</td>
                    <td className="px-4 py-3">
                      {rule.regex ? (
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                          REGEX
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          PLAIN
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={rule.severity === 'SEVERE' ? 'danger' : 'warning'}>{rule.severity}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(rule.id)}
                        className={`relative inline-flex h-4.5 w-8 cursor-pointer rounded-full transition-colors ${
                          rule.active ? 'bg-[#00b14f]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`mt-0.5 inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition ${
                            rule.active ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-slate-500">{rule.note ?? '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                      {formatDateTime(rule.updatedAt ?? rule.createdAt)}
                    </td>
                    <td className="space-x-1 px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(rule)}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Edit rule"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingTarget(rule)}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Delete rule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <Modal
          isOpen
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add Filter Rule' : `Edit Filter Rule #${editingTarget?.id}`}
          description="Screen outgoing Connect chat messages for sensitive or malicious keywords."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={createMutation.isPending || updateMutation.isPending}>
                Save Rule
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Pattern / Keyword *</label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. chuyen khoan truoc, zalo, \b\d{10}\b"
                className="focus:border-primary w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isRegex}
                  onChange={(e) => setIsRegex(e.target.checked)}
                  className="accent-primary h-4 w-4 rounded"
                />
                <span>Regular Expression (Regex)</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-primary h-4 w-4 rounded"
                />
                <span>Active screening</span>
              </label>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">Severity Tier *</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="severity"
                    value="MILD"
                    checked={severity === 'MILD'}
                    onChange={() => setSeverity('MILD')}
                    className="accent-primary mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-amber-700">MILD</span>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      3 strikes in 30 days triggers a 24h Connect mute.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="severity"
                    value="SEVERE"
                    checked={severity === 'SEVERE'}
                    onChange={() => setSeverity('SEVERE')}
                    className="accent-primary mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-rose-700">SEVERE</span>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      1 strike triggers 24h mute and auto-reports to Admin queue.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">Admin Notes</label>
              <Textarea
                placeholder="Optional explanation for internal moderation team..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTarget && (
        <Modal
          isOpen
          onClose={() => setDeletingTarget(null)}
          maxWidth="sm"
          title="Delete Filter Rule?"
          description={`Are you sure you want to delete pattern "${deletingTarget.pattern}"?`}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeletingTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
                Delete
              </Button>
            </div>
          }
        >
          <div className="flex items-center gap-2.5 text-xs text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Messages matching this pattern will no longer be intercepted.</span>
          </div>
        </Modal>
      )}
    </div>
  );
}
