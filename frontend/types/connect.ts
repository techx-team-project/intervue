export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';

export type ConnectActorType = 'CANDIDATE' | 'RECRUITER';

export type ConnectPortal = 'candidate' | 'recruiter';

export type ConnectMessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'LINK';

export type ConnectFilterSeverity = 'MILD' | 'SEVERE';

export type ReportReasonCode = 'SCAM' | 'HARASSMENT' | 'SPAM' | 'INAPPROPRIATE' | 'OTHER';

export type UnsendScope = 'ME' | 'EVERYONE';

export type EligibleCandidate = {
  candidateId: number;
  fullName: string;
  email: string;
  jobTitle?: string;
  submittedAt?: string;
};

export type Invitation = {
  id: number;
  publicId: string;
  companyId: number;
  companyName: string;
  openingMessage: string;
  invitedAt: string;
};

export type ConversationSummary = {
  id: number;
  publicId: string;
  status: ConnectionStatus;
  blockedByActorType?: ConnectActorType;
  companyId: number;
  companyName: string;
  candidateId: number;
  candidateName: string;
  invitedAt: string;
  respondedAt?: string;
  unreadCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  peerLastReadMessageId?: number;
  peerLastReadAt?: string;
};

export type MessageReply = {
  id: number;
  senderType: ConnectActorType;
  senderId: number;
  senderName: string;
  messageType: ConnectMessageType;
  body?: string;
  attachmentFileName?: string;
  recalled: boolean;
};

export type MessageReaction = {
  actorType: ConnectActorType;
  actorId: number;
  actorName: string;
  emoji: string;
};

export type ConnectMessage = {
  id: number;
  connectionId: number;
  senderType: ConnectActorType;
  senderId: number;
  senderName?: string;
  clientMessageId?: string;
  replyToMessageId?: number;
  replyTo?: MessageReply;
  messageType: ConnectMessageType;
  body?: string;
  attachmentUrl?: string;
  attachmentFileName?: string;
  attachmentContentType?: string;
  attachmentFileSizeBytes?: number;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkImageUrl?: string;
  createdAt: string;
  editedAt?: string;
  recalled?: boolean;
  reactions?: MessageReaction[];
  optimisticStatus?: 'SENDING' | 'FAILED';
  optimisticError?: string;
  optimisticFile?: File;
};

export type ConnectUnreadCount = {
  total: number;
  unreadMessages?: number;
  pendingInvitations?: number;
};

export type ConnectRulesAck = {
  acknowledged: boolean;
  acknowledgedAt?: string;
};

export type ConnectMuteStatus = {
  muted: boolean;
  expiresAt?: string;
  reason?: string;
};

export type LinkPreview = {
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type ConnectStatusEventPayload = {
  connectionId: number;
  status: ConnectionStatus;
  blockedByActorType?: ConnectActorType;
};

export type ConnectReactionEventPayload = {
  connectionId: number;
  messageId: number;
  reactions: MessageReaction[];
};

export type ConnectReadEventPayload = {
  connectionId: number;
  readerType: ConnectActorType;
  readerId: number;
  lastReadMessageId: number;
  lastReadAt: string;
};

export type ConnectTypingEventPayload = {
  connectionId: number;
  actorType: ConnectActorType;
  actorId: number;
  actorName: string;
  typing: boolean;
};
