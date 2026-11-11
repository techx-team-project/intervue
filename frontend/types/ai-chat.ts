export interface ChatContext {
  pageType?: 'JOB_DETAIL' | 'COMPANY_DETAIL' | 'PROFILE' | 'HOME' | string;
  entityId?: number;
  jobTitle?: string;
  companyName?: string;
}

export interface UserChatRequest {
  message: string;
  sessionId?: string;
  faqCode?: string;
  context?: ChatContext;
}

export interface UserChatResponse {
  answer: string;
  sources: string[];
  remainingQuota: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  createdAt: number;
  isError?: boolean;
}

export interface SuggestedQuestion {
  id: string;
  question: string;
}
