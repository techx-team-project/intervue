export interface UserChatRequest {
  message: string;
  sessionId?: string;
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
