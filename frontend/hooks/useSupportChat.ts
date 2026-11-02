import { useCallback, useState } from 'react';
import { aiChatApi } from '@/apiRequest/ai-chat';
import type { RobotHeadState } from '@/components/mascot/MascotCore';
import { AI_CHAT_SESSION_KEY, DEFAULT_GREETING } from '@/constants/ai-chat';
import { ERROR_MESSAGES, FALLBACK_ERROR_MESSAGE } from '@/constants/error-messages';
import { isApiError } from '@/lib/api-error';
import type { ChatMessage } from '@/types/ai-chat';

const INITIAL_GREETING_MESSAGE: ChatMessage = {
  id: 'msg-initial-greeting',
  role: 'assistant',
  content: DEFAULT_GREETING,
  createdAt: 0,
};

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getInitialSessionId(): string {
  if (typeof window === 'undefined') return '';
  let stored = window.sessionStorage.getItem(AI_CHAT_SESSION_KEY);
  if (!stored) {
    stored = generateId('session');
    window.sessionStorage.setItem(AI_CHAT_SESSION_KEY, stored);
  }
  return stored;
}

export function useSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [robotState, setRobotState] = useState<RobotHeadState>('idle');
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string>(getInitialSessionId);
  const [error, setError] = useState<{
    message: string;
    retryAfter?: number | null;
    code?: string;
  } | null>(null);

  const resetSession = useCallback(() => {
    const newSession = generateId('session');
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(AI_CHAT_SESSION_KEY, newSession);
    }
    setSessionId(newSession);
    setMessages([INITIAL_GREETING_MESSAGE]);
    setError(null);
    setRobotState('idle');
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId('user'),
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setRobotState('thinking');
      setError(null);

      try {
        let activeSession = sessionId;
        if (!activeSession && typeof window !== 'undefined') {
          activeSession = getInitialSessionId();
          setSessionId(activeSession);
        }

        const response = await aiChatApi.chat({
          message: trimmed,
          sessionId: activeSession || undefined,
        });

        const botMessage: ChatMessage = {
          id: generateId('bot'),
          role: 'assistant',
          content: response.answer,
          sources: response.sources,
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setRemainingQuota(response.remainingQuota);
        setRobotState('speaking');
        setTimeout(() => {
          setRobotState('idle');
        }, 3500);
      } catch (err) {
        setRobotState('idle');
        if (isApiError(err)) {
          const localizedMessage = ERROR_MESSAGES[err.code] || err.message || FALLBACK_ERROR_MESSAGE;
          setError({
            message: localizedMessage,
            retryAfter: err.retryAfter,
            code: err.code,
          });
        } else {
          setError({
            message: FALLBACK_ERROR_MESSAGE,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId],
  );

  return {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    robotState,
    remainingQuota,
    error,
    sendMessage,
    resetSession,
  };
}
