'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCandidateAcknowledgeRules } from '@/hooks/useCandidateConnect';
import { useAcknowledgeRules } from '@/hooks/useRecruiterConnect';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import { toast } from 'sonner';

const RULES = [
  'The current version is in Beta testing, so minor issues or temporary delays may occur during usage.',
  'Employer accounts can initiate up to 100 new conversations per day. Candidates can accept or decline invitations at any time.',
  'Maintain polite and professional communication. Do not send spam, unauthorized promotional content, or automated mass messages.',
  'Do not use InterVue Connect for fraudulent activities, scams, or unlawful financial requests.',
  'Do not request or share sensitive personal credentials. Impersonation, harassment, discrimination, or abusive behavior is strictly prohibited.',
  'Do not distribute malware, viruses, malicious files, or any content harmful to users or the InterVue platform.',
  'InterVue reserves the right to restrict or suspend accounts found in violation of these community standards.',
];

type ConnectRulesModalProps = {
  mode: 'gate' | 'view';
  portal?: 'recruiter' | 'candidate';
  onClose: () => void;
};

export default function ConnectRulesModal({ mode, portal = 'recruiter', onClose }: ConnectRulesModalProps) {
  const [agreed, setAgreed] = useState(false);
  const recruiterAck = useAcknowledgeRules();
  const candidateAck = useCandidateAcknowledgeRules();
  const acknowledge = portal === 'candidate' ? candidateAck : recruiterAck;

  const handleAgree = () => {
    acknowledge.mutate(undefined, {
      onSuccess: onClose,
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Modal
      isOpen
      onClose={mode === 'view' ? onClose : () => {}}
      showCloseButton={mode === 'view'}
      maxWidth="2xl"
      radius="md"
      title="InterVue Connect Community Guidelines"
      footer={
        mode === 'gate' ? (
          <div className="flex w-full justify-center">
            <Button
              onClick={handleAgree}
              disabled={!agreed}
              isLoading={acknowledge.isPending}
              radius="md"
              className="min-w-40"
            >
              I agree
            </Button>
          </div>
        ) : (
          <Button variant="outline" radius="md" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      <ol className="space-y-3.5">
        {RULES.map((rule, index) => (
          <li key={rule} className="flex gap-3">
            <span className="bg-primary-light text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {index + 1}
            </span>
            <p className="text-body-md text-on-surface">{rule}</p>
          </li>
        ))}
      </ol>

      {mode === 'gate' && (
        <label className="mt-5 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="accent-primary mt-0.5"
          />
          <span className="text-body-sm text-on-surface">
            I agree to the guidelines and accept responsibility for any violations.
          </span>
        </label>
      )}
    </Modal>
  );
}
