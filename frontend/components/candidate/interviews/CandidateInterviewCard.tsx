'use client';

import { candidateInterviewApi } from '@/apiRequest/interview';
import InterviewDetails from '@/components/interview/InterviewDetails';
import InterviewStatusBadge from '@/components/interview/InterviewStatusBadge';
import QuickTimeField from '@/components/interview/QuickTimeField';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { CANDIDATE_INTERVIEW_STATUS_LABELS } from '@/constants/interview';
import { useCandidateInterviewMutations } from '@/hooks/useInterviews';
import type { Interview } from '@/types/interview';
import { currentLocalInputValue, formatInterviewMoment, fromLocalInputValue } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CalendarPlus, Check, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Dialog = 'decline' | 'reschedule' | null;

export default function CandidateInterviewCard({ interview }: { interview: Interview }) {
  const { confirm, decline, requestReschedule } = useCandidateInterviewMutations();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [message, setMessage] = useState('');
  const [proposed, setProposed] = useState('');
  const [error, setError] = useState('');

  const [openedAt] = useState(() => Date.now());
  const upcoming = new Date(interview.startsAt).getTime() > openedAt;
  const canRespond = upcoming && (interview.status === 'PROPOSED' || interview.status === 'CONFIRMED');
  const calendarAvailable = interview.status === 'PROPOSED' || interview.status === 'CONFIRMED';

  const close = () => {
    setDialog(null);
    setMessage('');
    setProposed('');
    setError('');
  };

  const onFailure = (cause: unknown) => toast.error(getErrorMessage(cause));

  const submitDecline = () =>
    decline.mutate(
      { id: interview.id, reason: message.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Your decline has been sent to the recruiter.');
          close();
        },
        onError: onFailure,
      },
    );

  const submitReschedule = () => {
    if (!proposed || proposed <= currentLocalInputValue()) return setError('Choose a time in the future.');
    requestReschedule.mutate(
      { id: interview.id, proposedStartsAt: fromLocalInputValue(proposed), message: message.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Your new time proposal has been sent to the recruiter.');
          close();
        },
        onError: onFailure,
      },
    );
  };

  const addToCalendar = async () => {
    try {
      const blob = await candidateInterviewApi.calendar(interview.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'interview.ics';
      link.click();
      URL.revokeObjectURL(url);
    } catch (cause) {
      onFailure(cause);
    }
  };

  return (
    <article className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-slate-900">{interview.jobTitle}</h3>
          <p className="text-xs text-slate-500">{interview.companyName}</p>
        </div>
        <InterviewStatusBadge status={interview.status} label={CANDIDATE_INTERVIEW_STATUS_LABELS[interview.status]} />
      </header>

      <InterviewDetails interview={interview} />

      {interview.status === 'RESCHEDULE_REQUESTED' && interview.proposedStartsAt && (
        <p className="rounded-lg bg-amber-50 p-3 text-[13px] text-amber-900">
          You proposed: <span className="font-bold">{formatInterviewMoment(interview.proposedStartsAt)}</span>. Please
          wait for the recruiter to respond.
        </p>
      )}
      {interview.status === 'CANCELLED' && interview.cancelReason && (
        <p className="text-xs text-slate-600">Cancellation reason: {interview.cancelReason}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {canRespond && interview.status === 'PROPOSED' && (
          <Button
            size="sm"
            leftIcon={<Check className="h-4 w-4" />}
            isLoading={confirm.isPending}
            onClick={() =>
              confirm.mutate(interview.id, {
                onSuccess: () => toast.success('You confirmed your attendance.'),
                onError: onFailure,
              })
            }
          >
            Confirm attendance
          </Button>
        )}
        {canRespond && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Clock className="h-4 w-4" />}
            onClick={() => setDialog('reschedule')}
          >
            Busy, reschedule
          </Button>
        )}
        {canRespond && (
          <Button size="sm" variant="ghost" leftIcon={<X className="h-4 w-4" />} onClick={() => setDialog('decline')}>
            Decline
          </Button>
        )}
        {calendarAvailable && (
          <Button size="sm" variant="outline" leftIcon={<CalendarPlus className="h-4 w-4" />} onClick={addToCalendar}>
            Add to calendar
          </Button>
        )}
      </div>

      <Modal
        isOpen={dialog === 'decline'}
        onClose={close}
        maxWidth="md"
        title="Decline this interview?"
        description="The recruiter will be notified. If you are only busy at this time, choose “Busy, reschedule”."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={close}>
              Go back
            </Button>
            <Button variant="danger" isLoading={decline.isPending} onClick={submitDecline}>
              Decline
            </Button>
          </div>
        }
      >
        <Textarea
          label="Reason (optional)"
          value={message}
          rows={3}
          maxLength={500}
          onChange={(event) => setMessage(event.target.value)}
        />
      </Modal>

      <Modal
        isOpen={dialog === 'reschedule'}
        onClose={close}
        maxWidth="md"
        title="Propose another time"
        description="Choose a time that suits you. The recruiter will accept or send a new schedule. Times are in Vietnam time (GMT+7)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button isLoading={requestReschedule.isPending} onClick={submitReschedule}>
              Send proposal
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <QuickTimeField label="Proposed time" value={proposed} error={error} onChange={setProposed} />
          <Textarea
            label="Message (optional)"
            value={message}
            rows={3}
            maxLength={500}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
      </Modal>
    </article>
  );
}
