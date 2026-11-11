'use client';

import { recruiterConnectApi } from '@/apiRequest/recruiter-connect';
import { createParticipantConnectHooks } from '@/hooks/connect-hooks-shared';
import { postConnectBroadcast } from '@/hooks/useConnectStream';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const shared = createParticipantConnectHooks('recruiter', recruiterConnectApi);

export const recruiterConnectKeys = {
  ...shared.keys,
  eligibleCandidates: (search: string) => ['connect', 'recruiter', 'eligible-candidates', search] as const,
};

export const useConversations = shared.useConversationsList;
export const useRecruiterConversation = shared.useSingleConversation;
export const useConversationMessages = shared.useThreadMessages;
export const useSendMessage = shared.useSendTextMessage;
export const useSendAttachment = shared.useSendMediaAttachment;
export const useEditMessage = shared.useEditTextMessage;
export const useUnsendMessage = shared.useUnsendMessageMutation;
export const useReactMessage = shared.useReactMutation;
export const useMarkConversationRead = shared.useMarkReadMutation;
export const useSendTyping = shared.useTypingMutation;
export const useBlockConversation = shared.useBlockMutation;
export const useUnblockConversation = shared.useUnblockMutation;
export const useReportConversation = shared.useReportMutation;
export const useConnectUnreadCount = shared.useUnreadTotal;
export const useRulesAck = shared.useRulesAckQuery;
export const useAcknowledgeRules = shared.useAcknowledgeRulesMutation;
export const useConnectMuteStatus = shared.useMuteStatusQuery;
export const useConnectInvalidation = shared.useInvalidateAll;

export function useEligibleCandidates(search: string) {
  const query = useQuery({
    queryKey: recruiterConnectKeys.eligibleCandidates(search),
    queryFn: () => recruiterConnectApi.eligibleCandidates(search || undefined, 0, 20),
  });

  return {
    candidates: query.data?.items ?? [],
    isLoading: query.isLoading,
  };
}

export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ candidateId, message }: { candidateId: number; message: string }) =>
      recruiterConnectApi.sendInvitation(candidateId, message),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.conversations });
      void queryClient.invalidateQueries({ queryKey: ['connect', 'recruiter', 'eligible-candidates'] });
      postConnectBroadcast({ type: 'INVALIDATE', portal: 'recruiter', connectionId: created.id });
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.muteStatus });
    },
  });
}
