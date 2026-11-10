'use client';

import ConnectComposerShell from '@/components/connect/ConnectComposerShell';
import {
  useCandidateMuteStatus,
  useCandidateSendAttachment,
  useCandidateSendMessage,
} from '@/hooks/useCandidateConnect';

type CandidateConnectComposerProps = {
  connectionId: number;
  disabled: boolean;
  disabledReason?: string;
};

export default function CandidateConnectComposer({
  connectionId,
  disabled,
  disabledReason,
}: CandidateConnectComposerProps) {
  const { data: muteStatus } = useCandidateMuteStatus();
  const sendMessage = useCandidateSendMessage(connectionId);
  const sendAttachment = useCandidateSendAttachment(connectionId);

  return (
    <ConnectComposerShell
      muteStatus={muteStatus}
      disabled={disabled}
      disabledReason={disabledReason}
      isBusy={sendMessage.isPending || sendAttachment.isPending}
      onSendMessage={(body, callbacks) => sendMessage.mutate(body, callbacks)}
      onSendAttachment={(payload, callbacks) => sendAttachment.mutate(payload, callbacks)}
    />
  );
}
