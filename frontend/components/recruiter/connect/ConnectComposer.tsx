'use client';

import ConnectComposerShell from '@/components/connect/ConnectComposerShell';
import { useConnectMuteStatus, useSendAttachment, useSendMessage } from '@/hooks/useRecruiterConnect';

type ConnectComposerProps = {
  connectionId: number;
  disabled: boolean;
  disabledReason?: string;
};

export default function ConnectComposer({ connectionId, disabled, disabledReason }: ConnectComposerProps) {
  const { data: muteStatus } = useConnectMuteStatus();
  const sendMessage = useSendMessage(connectionId);
  const sendAttachment = useSendAttachment(connectionId);

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
