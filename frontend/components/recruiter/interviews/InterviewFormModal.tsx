'use client';

import { Button } from '@/components/ui/Button';
import QuickTimeField from '@/components/interview/QuickTimeField';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { INTERVIEW_DURATION_OPTIONS, INTERVIEW_FORMAT_OPTIONS } from '@/constants/interview';
import type { Interview, InterviewFormat, InterviewFormValues } from '@/types/interview';
import { currentLocalInputValue, fromLocalInputValue, toLocalInputValue } from '@/utils/datetime';
import { loadInterviewPreferences, saveInterviewPreferences } from '@/utils/interview-preferences';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface InterviewFormModalProps {
  isOpen: boolean;
  interview?: Interview;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: InterviewFormValues) => void;
}

function initialStart(interview?: Interview) {
  return interview ? toLocalInputValue(interview.startsAt) : '';
}

export default function InterviewFormModal({
  isOpen,
  interview,
  isSubmitting,
  onClose,
  onSubmit,
}: InterviewFormModalProps) {
  const [startsAt, setStartsAt] = useState(() => initialStart(interview));
  const [remembered] = useState(() => (interview ? null : loadInterviewPreferences()));
  const [duration, setDuration] = useState(String(interview?.durationMinutes ?? remembered?.durationMinutes ?? 60));
  const [format, setFormat] = useState<InterviewFormat>(interview?.format ?? remembered?.format ?? 'ONLINE');
  const [location, setLocation] = useState(interview?.location ?? remembered?.location ?? '');
  const [note, setNote] = useState(interview?.note ?? '');
  const [error, setError] = useState('');

  const submit = () => {
    if (!startsAt) return setError('Hãy chọn ngày và giờ phỏng vấn.');
    if (startsAt <= currentLocalInputValue()) return setError('Thời gian phỏng vấn phải ở tương lai.');
    if (!location.trim()) {
      return setError(format === 'ONLINE' ? 'Hãy nhập link họp.' : 'Hãy nhập địa chỉ phỏng vấn.');
    }
    setError('');
    saveInterviewPreferences({ durationMinutes: Number(duration), format, location: location.trim() });
    onSubmit({
      startsAt: fromLocalInputValue(startsAt),
      durationMinutes: Number(duration),
      format,
      location: location.trim(),
      note: note.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={interview ? 'Sửa lịch phỏng vấn' : 'Mời ứng viên phỏng vấn'}
      description="Ứng viên sẽ nhận thông báo và email để xác nhận, từ chối hoặc đề xuất giờ khác. Giờ theo múi giờ Việt Nam (GMT+7)."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button isLoading={isSubmitting} onClick={submit}>
            {interview ? 'Lưu và gửi lại' : 'Gửi lời mời'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuickTimeField label="Ngày giờ phỏng vấn" value={startsAt} onChange={setStartsAt} />
          <Select
            label="Thời lượng"
            value={duration}
            options={INTERVIEW_DURATION_OPTIONS}
            onChange={(event) => setDuration(event.target.value)}
          />
        </div>
        <Select
          label="Hình thức"
          value={format}
          options={INTERVIEW_FORMAT_OPTIONS}
          onChange={(event) => setFormat(event.target.value as InterviewFormat)}
        />
        <Input
          label={format === 'ONLINE' ? 'Link họp' : 'Địa chỉ'}
          value={location}
          maxLength={500}
          placeholder={format === 'ONLINE' ? 'https://meet.google.com/...' : 'Tầng 5, 72 Lê Thánh Tôn, Quận 1'}
          onChange={(event) => setLocation(event.target.value)}
        />
        <Textarea
          label="Ghi chú cho ứng viên (không bắt buộc)"
          value={note}
          rows={3}
          maxLength={1000}
          onChange={(event) => setNote(event.target.value)}
        />
        {format === 'ONLINE' && (
          <a
            href="https://meet.new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            Tạo nhanh phòng Google Meet rồi dán link vào ô trên
          </a>
        )}
        {error && (
          <p role="alert" className="text-error text-sm font-medium">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
