'use client';

import Modal from '@/components/ui/Modal';
import type { AuthPortal } from '@/lib/auth-portal';
import { useEffect, useState } from 'react';
import PhoneCodeStep from './PhoneCodeStep';
import PhoneNumberStep from './PhoneNumberStep';

type PhoneVerificationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  portal: AuthPortal;
  currentPhone: string;
};

export default function PhoneVerificationDialog({
  isOpen,
  onClose,
  portal,
  currentPhone,
}: PhoneVerificationDialogProps) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleClose = () => {
    setSentTo(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Verify phone number"
      description="We will text a 6-digit code to confirm that the number is yours."
    >
      {sentTo ? (
        <PhoneCodeStep
          portal={portal}
          phone={sentTo}
          cooldown={cooldown}
          onCooldown={setCooldown}
          onBack={() => setSentTo(null)}
          onVerified={handleClose}
        />
      ) : (
        <PhoneNumberStep
          portal={portal}
          initialPhone={currentPhone}
          onCancel={handleClose}
          onSent={setSentTo}
          onRateLimited={setCooldown}
        />
      )}
    </Modal>
  );
}
