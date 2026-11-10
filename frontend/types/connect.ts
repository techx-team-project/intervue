export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';

export type ConnectActorType = 'CANDIDATE' | 'RECRUITER';

export type ConnectMessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'LINK';

export type ConnectFilterSeverity = 'MILD' | 'SEVERE';

export type ReportReasonCode = 'SCAM' | 'HARASSMENT' | 'SPAM' | 'INAPPROPRIATE' | 'OTHER';

export type EligibleCandidate = {
  candidateId: number;
  fullName: string;
  email: string;
};

export type Invitation = {
  id: number;
  companyId: number;
  companyName: string;
  openingMessage: string;
  invitedAt: string;
};

export type ConversationSummary = {
  id: number;
  status: ConnectionStatus;
  companyId: number;
  companyName: string;
  candidateId: number;
  candidateName: string;
  invitedAt: string;
  respondedAt?: string;
  unreadCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
};

export type ConnectMessage = {
  id: number;
  connectionId: number;
  senderType: ConnectActorType;
  senderId: number;
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
};

export type ConnectUnreadCount = {
  total: number;
};

export type ConnectRulesAck = {
  acknowledged: boolean;
  acknowledgedAt?: string;
};
