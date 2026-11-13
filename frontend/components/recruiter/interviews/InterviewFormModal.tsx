'use client';

import { Button } from '@/components/ui/Button';
import QuickTimeField from '@/components/interview/QuickTimeField';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { INTERVIEW_DURATION_OPTIONS, INTERVIEW_FORMAT_OPTIONS } from '@/constants/interview';
import type { Interview, InterviewFormat, InterviewFormValues } from '@/types/interview';
import {
  currentLocalInputValue,
  fromLocalInputValue,
  localInputValueAfterDays,
  toLocalInputValue,
} from '@/utils/datetime';
import { isGoogleMeetLink } from '@/utils/google-meet';
import { loadInterviewPreferences, saveInterviewPreferences } from '@/utils/interview-preferences';
import { ExternalLink, Wand2 } from 'lucide-react';
import { useState } from 'react';

interface InterviewFormModalProps {
  isOpen: boolean;
  interview?: Interview;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: InterviewFormValues) => void;
}

const DEMO_START_TIME = '10:00';
const DEMO_MEETING_LINK = 'https://meet.google.com/abc-defg-hij';
const DEMO_NOTE =
  'Please join 5 minutes early and prepare to walk us through your most recent project. Bring a laptop with a stable internet connection.';

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

  const fillDemo = () => {
    setStartsAt(`${localInputValueAfterDays(1).slice(0, 10)}T${DEMO_START_TIME}`);
    setDuration('60');
    setFormat('ONLINE');
    setLocation(DEMO_MEETING_LINK);
    setNote(DEMO_NOTE);
    setError('');
  };

  const submit = () => {
    if (!startsAt) return setError('Please choose the interview date and time.');
    if (startsAt <= currentLocalInputValue()) return setError('The interview time must be in the future.');
    if (startsAt > localInputValueAfterDays(30)) return setError('The interview time must be within the next 30 days.');
    if (!location.trim()) {
      return setError(format === 'ONLINE' ? 'Please enter the meeting link.' : 'Please enter the interview address.');
    }
    if (format === 'ONLINE' && !isGoogleMeetLink(location)) {
      return setError('Please enter a valid Google Meet link, e.g. https://meet.google.com/abc-defg-hij.');
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
        {process.env.NODE_ENV !== 'production' && (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 px-3.5 py-2.5">
            <span className="mr-auto text-xs font-bold tracking-wide text-amber-800 uppercase">Demo tools</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              leftIcon={<Wand2 className="h-4 w-4" />}
              onClick={fillDemo}
            >
              Fill demo data
            </Button>
          </div>
        )}
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
