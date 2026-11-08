'use client';

import InterviewDetails from '@/components/interview/InterviewDetails';
import InterviewStatusBadge from '@/components/interview/InterviewStatusBadge';
import InterviewFormModal from '@/components/recruiter/interviews/InterviewFormModal';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { ACTIVE_INTERVIEW_STATUSES } from '@/constants/interview';
import { useApplicationInterviews, useRecruiterInterviewMutations } from '@/hooks/useInterviews';
import type { Interview, InterviewFormValues } from '@/types/interview';
import { formatInterviewMoment } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const SCHEDULABLE_STATUSES = ['APPLIED', 'VIEWED', 'IN_REVIEW', 'INTERVIEW'];

interface ReviewInterviewPanelProps {
  applicationId: number;
  applicationStatus: string;
}

type FormTarget = { interview?: Interview } | null;

export default function ReviewInterviewPanel({ applicationId, applicationStatus }: ReviewInterviewPanelProps) {
  const { data: interviews = [] } = useApplicationInterviews(applicationId);
  const { schedule, update, acceptProposal, cancel } = useRecruiterInterviewMutations(applicationId);
  const [form, setForm] = useState<FormTarget>(null);
  const [cancelling, setCancelling] = useState<Interview | null>(null);
  const [reason, setReason] = useState('');

  const hasActive = interviews.some((item) => ACTIVE_INTERVIEW_STATUSES.includes(item.status));
  const canSchedule = !hasActive && SCHEDULABLE_STATUSES.includes(applicationStatus);

  if (interviews.length === 0 && !canSchedule) return null;

  const submitForm = (values: InterviewFormValues) => {
    const target = form?.interview;
    const options = {
      onSuccess: () => {
        toast.success(target ? 'Đã cập nhật và gửi lại lịch cho ứng viên.' : 'Đã gửi lời mời phỏng vấn.');
        setForm(null);
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error)),
    };
    if (target) update.mutate({ id: target.id, values }, options);
    else schedule.mutate(values, options);
  };

  const accept = (interview: Interview) =>
    acceptProposal.mutate(interview.id, {
      onSuccess: () => toast.success('Đã đồng ý giờ ứng viên đề xuất.'),
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const confirmCancel = () => {
    if (!cancelling) return;
    cancel.mutate(
      { id: cancelling.id, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Đã huỷ lịch phỏng vấn.');
          setCancelling(null);
          setReason('');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">Lịch phỏng vấn</h3>
        {canSchedule && (
          <Button size="sm" leftIcon={<CalendarPlus className="h-4 w-4" />} onClick={() => setForm({})}>
            Mời phỏng vấn
          </Button>
        )}
      </div>

      <ul className="space-y-3">
        {interviews.map((interview) => {
          const active = ACTIVE_INTERVIEW_STATUSES.includes(interview.status);
          return (
            <li
              key={interview.id}
              className={`space-y-3 rounded-xl border p-3.5 ${active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-80'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <InterviewStatusBadge status={interview.status} />
                {active && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setForm({ interview })}>
                      Sửa lịch
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setCancelling(interview)}>
                      Huỷ lịch
                    </Button>
                  </div>
                )}
              </div>
              <InterviewDetails interview={interview} />

              {interview.status === 'RESCHEDULE_REQUESTED' && interview.proposedStartsAt && (
                <div className="space-y-2 rounded-lg bg-amber-50 p-3 text-[13px] text-amber-900">
                  <p>
                    Ứng viên bận và đề xuất:{' '}
                    <span className="font-bold">{formatInterviewMoment(interview.proposedStartsAt)}</span>
                  </p>
                  {interview.candidateMessage && <p>Lời nhắn: {interview.candidateMessage}</p>}
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" isLoading={acceptProposal.isPending} onClick={() => accept(interview)}>
                      Đồng ý giờ mới
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setForm({ interview })}>
                      Chọn giờ khác
                    </Button>
                  </div>
                </div>
              )}

              {interview.status === 'DECLINED' && interview.candidateMessage && (
                <p className="text-xs text-slate-600">Lý do ứng viên từ chối: {interview.candidateMessage}</p>
              )}
              {interview.status === 'CANCELLED' && interview.cancelReason && (
                <p className="text-xs text-slate-600">Lý do huỷ: {interview.cancelReason}</p>
              )}
            </li>
          );
        })}
      </ul>

      {form && (
        <InterviewFormModal
          key={form.interview?.id ?? 'new'}
          isOpen
          interview={form.interview}
          isSubmitting={schedule.isPending || update.isPending}
          onClose={() => setForm(null)}
          onSubmit={submitForm}
        />
      )}

      <Modal
        isOpen={cancelling !== null}
        onClose={() => setCancelling(null)}
        maxWidth="md"
        title="Huỷ lịch phỏng vấn?"
        description="Ứng viên sẽ nhận thông báo và email về việc huỷ lịch."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCancelling(null)}>
              Giữ lịch
            </Button>
            <Button variant="danger" isLoading={cancel.isPending} onClick={confirmCancel}>
              Huỷ lịch
            </Button>
          </div>
        }
      >
        <Textarea
          label="Lý do gửi cho ứng viên (không bắt buộc)"
          value={reason}
          rows={3}
          maxLength={500}
          onChange={(event) => setReason(event.target.value)}
        />
      </Modal>
    </section>
  );
}
