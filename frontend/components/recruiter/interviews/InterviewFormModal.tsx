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
    if (!startsAt) return setError('Please choose the interview date and time.');
    if (startsAt <= currentLocalInputValue()) return setError('The interview time must be in the future.');
    if (!location.trim()) {
      return setError(format === 'ONLINE' ? 'Please enter the meeting link.' : 'Please enter the interview address.');
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
      title={interview ? 'Edit interview' : 'Invite candidate to interview'}
      description="The candidate will receive a notification and email to confirm, decline or propose another time. Times are in Vietnam time (GMT+7)."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button isLoading={isSubmitting} onClick={submit}>
            {interview ? 'Save and resend' : 'Send invitation'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuickTimeField label="Interview date and time" value={startsAt} onChange={setStartsAt} />
          <Select
            label="Duration"
            value={duration}
            options={INTERVIEW_DURATION_OPTIONS}
            onChange={(event) => setDuration(event.target.value)}
          />
        </div>
        <Select
          label="Format"
          value={format}
          options={INTERVIEW_FORMAT_OPTIONS}
          onChange={(event) => setFormat(event.target.value as InterviewFormat)}
        />
        <Input
          label={format === 'ONLINE' ? 'Meeting link' : 'Address'}
          value={location}
          maxLength={500}
          placeholder={format === 'ONLINE' ? 'https://meet.google.com/...' : '5th Floor, 72 Le Thanh Ton, District 1'}
          onChange={(event) => setLocation(event.target.value)}
        />
        <Textarea
          label="Note for the candidate (optional)"
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
            Quickly create a Google Meet room and paste the link above
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
