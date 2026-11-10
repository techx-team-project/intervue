'use client';

import Spinner from '@/components/common/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import {
  useAdminDismissReport,
  useAdminReportConversationMessages,
  useAdminReportDetail,
  useAdminResolveReport,
} from '@/hooks/useAdminModeration';
import type { AdminReportSummary, ReportReasonCode, ReportResolveAction } from '@/types/admin-moderation';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { Ban, CheckCircle2, EyeOff, FileText, MessageSquare, ShieldAlert, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AdminReportReviewModalProps {
  reportSummary: AdminReportSummary;
  onClose: () => void;
}

const REASON_LABELS: Record<ReportReasonCode, string> = {
  SCAM: 'Scam or Fraud',
  HARASSMENT: 'Harassment or Abuse',
  SPAM: 'Spam or Advertising',
  INAPPROPRIATE: 'Inappropriate Content',
  OTHER: 'Other Violation',
};

export default function AdminReportReviewModal({ reportSummary, onClose }: AdminReportReviewModalProps) {
  const { data: report } = useAdminReportDetail(reportSummary.id);
  const hasConversationThread = reportSummary.targetType === 'CONVERSATION' && reportSummary.targetId > 0;
  const isPreConnectionViolation = reportSummary.targetType === 'CONVERSATION' && reportSummary.targetId === 0;
  const { data: messagesPage, isLoading: isMessagesLoading } = useAdminReportConversationMessages(
    hasConversationThread ? reportSummary.targetId : undefined,
    0,
    100,
  );

  const systemActorMatch = useMemo(() => {
    if (reportSummary.reporterType !== 'SYSTEM') return null;
    const note = report?.reasonNote;
    if (!note) return null;
    const match = note.match(/Actor:\s*(CANDIDATE|RECRUITER)#(\d+)/);
    if (!match) return null;
    return {
      actorType: match[1] as 'CANDIDATE' | 'RECRUITER',
      actorId: match[2],
    };
  }, [reportSummary.reporterType, report?.reasonNote]);

  const [activeAction, setActiveAction] = useState<'NONE' | 'DISMISS' | 'RESOLVE'>('NONE');
  const [dismissNote, setDismissNote] = useState('');
  const [resolveAction, setResolveAction] = useState<ReportResolveAction>(
    hasConversationThread ? 'HIDE_CONTENT' : 'LOCK_ACCOUNT',
  );
  const [resolveNote, setResolveNote] = useState('');
  const [customLockActorType, setCustomLockActorType] = useState<'CANDIDATE' | 'RECRUITER' | null>(null);
  const [customLockActorId, setCustomLockActorId] = useState<string | null>(null);

  const lockActorType: 'CANDIDATE' | 'RECRUITER' =
    customLockActorType ??
    systemActorMatch?.actorType ??
    (reportSummary.reporterType === 'RECRUITER' ? 'CANDIDATE' : 'RECRUITER');

  const messagesItems = messagesPage?.items;
  const detectedOffenderId = useMemo(() => {
    if (systemActorMatch && systemActorMatch.actorType === lockActorType) {
      return systemActorMatch.actorId;
    }
    if (!messagesItems?.length) return '';
    const offenderMsg = messagesItems.find((m) => m.senderType === lockActorType);
    return offenderMsg ? String(offenderMsg.senderId) : '';
  }, [systemActorMatch, messagesItems, lockActorType]);

  const lockActorId = customLockActorId !== null ? customLockActorId : detectedOffenderId;

  const dismissMutation = useAdminDismissReport();
  const resolveMutation = useAdminResolveReport();

  const chronologicalMessages = useMemo(() => {
    return [...(messagesPage?.items ?? [])].reverse();
  }, [messagesPage?.items]);

  const handleDismiss = () => {
    dismissMutation.mutate(
      { id: reportSummary.id, payload: { note: dismissNote.trim() || undefined } },
      {
        onSuccess: () => {
          toast.success('Report has been dismissed.');
          onClose();
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  const handleResolve = () => {
    const actorIdNum = lockActorId.trim() ? Number(lockActorId.trim()) : undefined;
    resolveMutation.mutate(
      {
        id: reportSummary.id,
        payload: {
          action: resolveAction,
          note: resolveNote.trim() || undefined,
          lockActorType: resolveAction === 'LOCK_ACCOUNT' ? lockActorType : undefined,
          lockActorId: resolveAction === 'LOCK_ACCOUNT' ? actorIdNum : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Report resolved and action taken successfully.');
          onClose();
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="3xl"
      title={`Review Report #${reportSummary.id}`}
      description={`Reported for ${REASON_LABELS[reportSummary.reasonCode] ?? reportSummary.reasonCode}`}
    >
      <div className="space-y-5">
        {/* Report Overview Meta */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
            <div>
              <p className="font-semibold text-slate-500 uppercase">Reporter</p>
              <p className="mt-1 font-bold text-slate-800">
                {reportSummary.reporterType} #{reportSummary.reporterId}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 uppercase">Target</p>
              <p className="mt-1 font-bold text-slate-800">
                {reportSummary.targetType} #{reportSummary.targetId}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 uppercase">Reported At</p>
              <p className="mt-1 font-medium text-slate-700">{formatDateTime(reportSummary.createdAt)}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 uppercase">Status</p>
              <div className="mt-1">
                <Badge
                  variant={
                    reportSummary.status === 'PENDING'
                      ? 'warning'
                      : reportSummary.status === 'ACTION_TAKEN'
                        ? 'danger'
                        : 'default'
                  }
                >
                  {reportSummary.status}
                </Badge>
              </div>
            </div>
          </div>

          {report?.reasonNote && (
            <div className="mt-3.5 border-t border-slate-200/80 pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">Reporter Note:</p>
              <p className="mt-1 text-xs whitespace-pre-wrap text-slate-700">{report.reasonNote}</p>
            </div>
          )}

          {report?.adminNote && (
            <div className="mt-3.5 border-t border-slate-200/80 pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">Admin Resolution Note:</p>
              <p className="mt-1 text-xs whitespace-pre-wrap text-slate-700">{report.adminNote}</p>
            </div>
          )}
        </div>

        {/* Conversation Message History Preview */}
        {isPreConnectionViolation && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs text-amber-900">
            This automated report was triggered during a pre-connection invitation message before a conversation thread
            was created.
          </div>
        )}

        {hasConversationThread && (
          <div>
            <div className="flex items-center justify-between pb-2">
              <p className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Conversation History (Connection #{reportSummary.targetId})
              </p>
              <span className="text-[11px] text-slate-500">{chronologicalMessages.length} messages</span>
            </div>

            <div className="max-h-72 space-y-2.5 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
              {isMessagesLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : chronologicalMessages.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">No messages found in this conversation.</p>
              ) : (
                chronologicalMessages.map((msg) => {
                  const isCandidate = msg.senderType === 'CANDIDATE';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isCandidate ? 'items-start' : 'items-end'}`}>
                      <div className="mb-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600">
                          {msg.senderType} #{msg.senderId}
                        </span>
                        <span>•</span>
                        <span>{formatDateTime(msg.createdAt)}</span>
                      </div>
                      <div
                        className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${
                          isCandidate
                            ? 'bg-slate-100 text-slate-800'
                            : 'border border-emerald-200 bg-emerald-50 text-emerald-950'
                        }`}
                      >
                        {msg.body && <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>}
                        {msg.messageType === 'IMAGE' && msg.attachmentUrl && (
                          <div className="mt-1">
                            <Image
                              src={msg.attachmentUrl}
                              alt="Attachment"
                              width={240}
                              height={160}
                              unoptimized
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )}
                        {msg.messageType === 'FILE' && (
                          <div className="mt-1 flex items-center gap-1.5 font-medium text-slate-600">
                            <FileText className="h-4 w-4" />
                            <span>{msg.attachmentFileName ?? 'Attachment file'}</span>
                          </div>
                        )}
                        {msg.linkUrl && (
                          <p className="mt-1 truncate text-[11px] text-blue-600 underline">{msg.linkUrl}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Action Panel for PENDING reports */}
        {reportSummary.status === 'PENDING' && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            {activeAction === 'NONE' ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-600">Select an action to resolve or dismiss this moderation report:</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveAction('DISMISS')}
                    className="flex items-center gap-1.5 text-xs text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                    Dismiss Report
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setActiveAction('RESOLVE')}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Take Action
                  </Button>
                </div>
              </div>
            ) : activeAction === 'DISMISS' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 uppercase">Dismiss Report</p>
                  <button
                    type="button"
                    onClick={() => setActiveAction('NONE')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
                <Textarea
                  placeholder="Optional note for the reporter explaining why this report is dismissed..."
                  value={dismissNote}
                  onChange={(e) => setDismissNote(e.target.value)}
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setActiveAction('NONE')}>
                    Cancel
                  </Button>
                  <Button onClick={handleDismiss} isLoading={dismissMutation.isPending}>
                    Confirm Dismissal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 uppercase">Take Moderation Action</p>
                  <button
                    type="button"
                    onClick={() => setActiveAction('NONE')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                {/* Resolution Action Radios */}
                <div className="space-y-2 text-xs">
                  {hasConversationThread && (
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 hover:bg-slate-50">
                      <input
                        type="radio"
                        name="resolveAction"
                        value="HIDE_CONTENT"
                        checked={resolveAction === 'HIDE_CONTENT'}
                        onChange={() => setResolveAction('HIDE_CONTENT')}
                        className="accent-primary mt-0.5"
                      />
                      <div>
                        <p className="flex items-center gap-1.5 font-bold text-slate-800">
                          <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                          Hide Conversation Content
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Redacts message content for both candidate and recruiter. Conversation stays accessible for
                          evidence.
                        </p>
                      </div>
                    </label>
                  )}

                  <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="resolveAction"
                      value="LOCK_ACCOUNT"
                      checked={resolveAction === 'LOCK_ACCOUNT'}
                      onChange={() => setResolveAction('LOCK_ACCOUNT')}
                      className="accent-primary mt-0.5"
                    />
                    <div>
                      <p className="flex items-center gap-1.5 font-bold text-rose-700">
                        <Ban className="h-3.5 w-3.5 text-rose-600" />
                        Lock Offender Account
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Applies platform restriction to candidate or suspends recruiter account, terminating their
                        sessions.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="resolveAction"
                      value="NONE"
                      checked={resolveAction === 'NONE'}
                      onChange={() => setResolveAction('NONE')}
                      className="accent-primary mt-0.5"
                    />
                    <div>
                      <p className="flex items-center gap-1.5 font-bold text-slate-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-600" />
                        Mark Resolved Without Penalty
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Marks the report as action taken with an administrative note only.
                      </p>
                    </div>
                  </label>
                </div>

                {resolveAction === 'LOCK_ACCOUNT' && (
                  <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50/50 p-3">
                    <p className="text-xs font-bold text-rose-900">Select Offender Account to Lock:</p>
                    <div className="flex gap-4 text-xs">
                      <label className="flex cursor-pointer items-center gap-1.5">
                        <input
                          type="radio"
                          name="lockActorType"
                          value="CANDIDATE"
                          checked={lockActorType === 'CANDIDATE'}
                          onChange={() => {
                            setCustomLockActorType('CANDIDATE');
                            setCustomLockActorId(null);
                          }}
                        />
                        <span>Candidate</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-1.5">
                        <input
                          type="radio"
                          name="lockActorType"
                          value="RECRUITER"
                          checked={lockActorType === 'RECRUITER'}
                          onChange={() => {
                            setCustomLockActorType('RECRUITER');
                            setCustomLockActorId(null);
                          }}
                        />
                        <span>Recruiter</span>
                      </label>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-700">
                        Offender User / Recruiter ID (auto-detected, or leave blank to resolve automatically):
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 102"
                        value={lockActorId}
                        onChange={(e) => setCustomLockActorId(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                <Textarea
                  placeholder="Admin resolution note (sent to reporter and saved in audit trail)..."
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  rows={2}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setActiveAction('NONE')}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleResolve} isLoading={resolveMutation.isPending}>
                    Execute Action & Resolve
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
