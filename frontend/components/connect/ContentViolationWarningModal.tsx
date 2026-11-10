'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface ContentViolationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentViolationWarningModal({ isOpen, onClose }: ContentViolationWarningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Message Blocked by Safety Filters"
      description="Your message contains content that does not comply with InterVue Connect community standards."
      footer={
        <Button onClick={onClose} className="w-full">
          I understand
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="font-bold">Content violation detected</p>
            <p className="leading-relaxed text-amber-800">
              InterVue Connect strictly prohibits spam, sensitive personal financial requests, offensive remarks, and
              unauthorized external redirect links.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs text-rose-900">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />
          <div className="space-y-1">
            <p className="font-bold">Account warning policy</p>
            <p className="leading-relaxed text-rose-800">
              Repeated violations within 30 days will trigger an automated 24-hour messaging restriction (Mute) and may
              lead to account suspension upon administrator review.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
