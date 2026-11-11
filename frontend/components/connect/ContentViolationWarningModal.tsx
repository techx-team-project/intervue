'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ContentViolationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentViolationWarningModal({ isOpen, onClose }: ContentViolationWarningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      radius="md"
      title="Message not sent"
      description="Your message violates InterVue Connect community standards and was blocked before delivery."
      footer={
        <Button onClick={onClose} radius="md">
          Got it
        </Button>
      }
    >
      <div className="space-y-2.5 text-sm leading-relaxed text-slate-600">
        <p>Please keep conversations professional and avoid inappropriate wording or off-platform solicitations.</p>
        <p className="text-xs text-slate-500">
          Reaching 5 minor or 3 severe violations within 30 days will temporarily restrict messaging for 24 hours.
        </p>
      </div>
    </Modal>
  );
}
