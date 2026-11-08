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
          toast.success('Đã gửi phản hồi từ chối cho nhà tuyển dụng.');
          close();
        },
        onError: onFailure,
      },
    );

  const submitReschedule = () => {
    if (!proposed || proposed <= currentLocalInputValue()) return setError('Hãy chọn một thời gian ở tương lai.');
    requestReschedule.mutate(
      { id: interview.id, proposedStartsAt: fromLocalInputValue(proposed), message: message.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Đã gửi đề xuất giờ mới cho nhà tuyển dụng.');
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
          Bạn đã đề xuất: <span className="font-bold">{formatInterviewMoment(interview.proposedStartsAt)}</span>. Hãy
          chờ nhà tuyển dụng phản hồi.
        </p>
      )}
      {interview.status === 'CANCELLED' && interview.cancelReason && (
        <p className="text-xs text-slate-600">Lý do huỷ: {interview.cancelReason}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {canRespond && interview.status === 'PROPOSED' && (
          <Button
            size="sm"
            leftIcon={<Check className="h-4 w-4" />}
            isLoading={confirm.isPending}
            onClick={() =>
              confirm.mutate(interview.id, {
                onSuccess: () => toast.success('Bạn đã xác nhận tham gia phỏng vấn.'),
                onError: onFailure,
              })
            }
          >
            Xác nhận tham gia
          </Button>
        )}
        {canRespond && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Clock className="h-4 w-4" />}
            onClick={() => setDialog('reschedule')}
          >
            Bận, đổi giờ
          </Button>
        )}
        {canRespond && (
          <Button size="sm" variant="ghost" leftIcon={<X className="h-4 w-4" />} onClick={() => setDialog('decline')}>
            Từ chối
          </Button>
        )}
        {calendarAvailable && (
          <Button size="sm" variant="outline" leftIcon={<CalendarPlus className="h-4 w-4" />} onClick={addToCalendar}>
            Thêm vào lịch
          </Button>
        )}
      </div>

      <Modal
        isOpen={dialog === 'decline'}
        onClose={close}
        maxWidth="md"
        title="Từ chối buổi phỏng vấn?"
        description="Nhà tuyển dụng sẽ nhận thông báo. Nếu chỉ bận giờ này, hãy chọn “Bận, đổi giờ”."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={close}>
              Quay lại
            </Button>
            <Button variant="danger" isLoading={decline.isPending} onClick={submitDecline}>
              Từ chối
            </Button>
          </div>
        }
      >
        <Textarea
          label="Lý do (không bắt buộc)"
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
        title="Đề xuất giờ khác"
        description="Chọn thời gian phù hợp với bạn. Nhà tuyển dụng sẽ đồng ý hoặc gửi lại lịch mới. Giờ theo múi giờ Việt Nam (GMT+7)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={close}>
              Hủy
            </Button>
            <Button isLoading={requestReschedule.isPending} onClick={submitReschedule}>
              Gửi đề xuất
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <QuickTimeField label="Thời gian đề xuất" value={proposed} error={error} onChange={setProposed} />
          <Textarea
            label="Lời nhắn (không bắt buộc)"
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
