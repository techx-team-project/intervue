import type { SuggestedQuestion } from '@/types/ai-chat';

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: 'sq-company-verification',
    question: 'How do I verify a company?',
  },
  {
    id: 'sq-ats-cv',
    question: 'How do I create and optimize an ATS-ready CV?',
  },
  {
    id: 'sq-apply-status',
    question: 'How do applying and status tracking work?',
  },
  {
    id: 'sq-two-factor',
    question: 'How do I turn on two-factor authentication (2FA)?',
  },
  {
    id: 'sq-ai-interview',
    question: 'How does InterVue support AI interview practice?',
  },
];

export const DEFAULT_GREETING =
  'Hello! 👋 I am the InterVue AI assistant. I can answer questions about using InterVue: creating an account, optimizing an ATS-ready CV, AI interview practice, or the company verification process.';

export const AI_CHAT_SESSION_KEY = 'intervue.ai.chat.sessionId';

export function hasBottomBar(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith('/recruiter') ||
    pathname.startsWith('/admin') ||
    pathname === '/mascot' ||
    pathname.startsWith('/candidate/conversations')
  );
}
