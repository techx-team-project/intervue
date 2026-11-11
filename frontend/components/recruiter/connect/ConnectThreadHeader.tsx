import ConversationActionsMenu from '@/components/recruiter/connect/ConversationActionsMenu';
import { Badge } from '@/components/ui/Badge';
import UserAvatar from '@/components/ui/UserAvatar';
import type { ConversationSummary } from '@/types/connect';
import { ArrowLeft } from 'lucide-react';

type ConnectThreadHeaderProps = {
  conversation: ConversationSummary;
  onBlock: () => void;
  onReport: () => void;
  onBack?: () => void;
};

export default function ConnectThreadHeader({ conversation, onBlock, onReport, onBack }: ConnectThreadHeaderProps) {
  return (
    <div className="border-outline-variant flex items-center justify-between gap-3 border-b bg-white px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface -ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:hidden"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
        )}
        <UserAvatar fullName={conversation.candidateName} size="md" />
        <div className="min-w-0">
          <p className="text-body-lg text-on-surface truncate font-bold">{conversation.candidateName}</p>
          <p className="text-label-sm text-on-surface-variant truncate">{conversation.companyName}</p>
        </div>
        {conversation.status === 'PENDING' && <Badge variant="warning">Pending acceptance</Badge>}
        {conversation.status === 'BLOCKED' && <Badge variant="danger">Blocked</Badge>}
      </div>

      <ConversationActionsMenu onBlock={onBlock} onReport={onReport} blocked={conversation.status === 'BLOCKED'} />
    </div>
  );
}
