import ConversationActionsMenu from '@/components/recruiter/connect/ConversationActionsMenu';
import { Badge } from '@/components/ui/Badge';
import UserAvatar from '@/components/ui/UserAvatar';
import type { ConversationSummary } from '@/types/connect';

type ConnectThreadHeaderProps = {
  conversation: ConversationSummary;
  onBlock: () => void;
  onReport: () => void;
};

export default function ConnectThreadHeader({ conversation, onBlock, onReport }: ConnectThreadHeaderProps) {
  return (
    <div className="border-outline-variant flex items-center justify-between gap-3 border-b bg-white px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
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
