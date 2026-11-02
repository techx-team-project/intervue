import { isApiError } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth.store';
import { request } from './http';
import type { UserChatRequest, UserChatResponse } from '@/types/ai-chat';

export const aiChatApi = {
  chat: async (payload: UserChatRequest) => {
    const token = useAuthStore.getState().accessToken;
    const hasValidToken = Boolean(token && (token.split('.').length === 3 || token === 'dev-mock-session-token'));

    if (!hasValidToken) {
      return request<UserChatResponse>('/ai/chat', {
        method: 'POST',
        body: payload,
        auth: false,
      });
    }

    try {
      return await request<UserChatResponse>('/ai/chat', {
        method: 'POST',
        body: payload,
        auth: true,
      });
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        return request<UserChatResponse>('/ai/chat', {
          method: 'POST',
          body: payload,
          auth: false,
        });
      }
      throw error;
    }
  },
};
