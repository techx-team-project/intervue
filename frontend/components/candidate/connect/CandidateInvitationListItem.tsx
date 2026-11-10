import UserAvatar from '@/components/ui/UserAvatar';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/types/connect';
import { formatRelativeDay } from '@/utils/datetime';

type CandidateInvitationListItemProps = {
  invitation: ConversationSummary;
  isActive: boolean;
  onClick: () => void;
};

export default function CandidateInvitationListItem({
  invitation,
  isActive,
  onClick,
}: CandidateInvitationListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
        isActive ? 'bg-primary-light' : 'hover:bg-surface-container-low',
      )}
    >
      <UserAvatar fullName={invitation.companyName} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-md truncate font-bold text-slate-800">{invitation.companyName}</p>
          <span className="text-label-sm text-on-surface-variant shrink-0">
            {formatRelativeDay(invitation.invitedAt)}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
            NEW INVITATION
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
          {invitation.lastMessagePreview || 'Recruiter sent you a chat invitation.'}
        </p>
      </div>
    </button>
  );
}
