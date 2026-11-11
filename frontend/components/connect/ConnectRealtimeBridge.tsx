'use client';

import {
  applyIncomingMessageSummaryPatch,
  applyPeerReadInCache,
  buildConnectKeys,
  patchConversationSummaryInCache,
  patchMessageReactionsInCache,
  upsertMessageInCache,
} from '@/hooks/connect-cache';
import { type ConnectBroadcastMessage, useConnectStream } from '@/hooks/useConnectStream';
import { useAuthStore } from '@/store/auth.store';
import { useConnectUiStore } from '@/store/connect-ui.store';
import type { ConnectPortal } from '@/types/connect';
import { getMessagePreviewText } from '@/utils/connect-chat';
import { playNotificationSound, showDesktopNotification } from '@/utils/sound';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const NOTIF_DEDUPE_WINDOW_MS = 3_000;

function tryPlayDedupedAlert(portal: ConnectPortal, key: string, title: string, body: string) {
  try {
    const storageKey = `connect_alert_${portal}`;
    const raw = localStorage.getItem(storageKey);
    const now = Date.now();
    if (raw) {
      const parsed = JSON.parse(raw) as { key?: string; ts?: number };
      if (parsed.key === key && parsed.ts && now - parsed.ts < NOTIF_DEDUPE_WINDOW_MS) {
        return;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify({ key, ts: now }));
  } catch {}
  playNotificationSound();
  showDesktopNotification(title, body);
}

export default function ConnectRealtimeBridge() {
  const pathname = usePathname() ?? '';
  const queryClient = useQueryClient();

  const portal: ConnectPortal | null = pathname.startsWith('/recruiter')
    ? 'recruiter'
    : pathname.startsWith('/admin')
      ? null
      : 'candidate';

  const isAuthenticated = useAuthStore((state) =>
    portal ? state[portal].status === 'authenticated' && Boolean(state[portal].accessToken) : false,
  );
  const currentUserId = useAuthStore((state) => (portal ? (state[portal].user?.id ?? null) : null));

  useEffect(() => {
    if (!portal || !isAuthenticated || typeof BroadcastChannel === 'undefined') return undefined;
    const channel = new BroadcastChannel('intervue-connect');
    const keys = buildConnectKeys(portal);

    channel.onmessage = (event: MessageEvent<ConnectBroadcastMessage>) => {
      const data = event.data;
      if (!data || data.portal !== portal) return;
      if (data.type === 'READ') {
        patchConversationSummaryInCache(queryClient, portal, data.connectionId, (current) => ({
          ...current,
          unreadCount: 0,
        }));
        void queryClient.invalidateQueries({ queryKey: keys.unread });
      } else if (data.type === 'INVALIDATE') {
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.invitations });
        void queryClient.invalidateQueries({ queryKey: keys.unread });
        if (data.connectionId) {
          void queryClient.invalidateQueries({ queryKey: keys.messages(data.connectionId) });
        }
      }
    };

    return () => {
      channel.close();
    };
  }, [portal, isAuthenticated, queryClient]);

  useConnectStream(
    portal,
    {
      onMessage: (message) => {
        if (!portal) return;
        const keys = buildConnectKeys(portal);
        const ownActorType = portal === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';
        const isOwn = message.senderType === ownActorType && message.senderId === currentUserId;
        const isOwnSide = message.senderType === ownActorType;

        useConnectUiStore.getState().setTyping(
          portal,
          message.connectionId,
          {
            actorId: message.senderId,
            actorType: message.senderType,
            actorName: message.senderName ?? '',
          },
          false,
        );

        upsertMessageInCache(queryClient, portal, message);

        const activeThread = useConnectUiStore.getState().activeThreadByPortal[portal];
        const atBottom = useConnectUiStore.getState().atBottomByPortal[portal];
        const isViewingThread =
          activeThread === message.connectionId &&
          typeof document !== 'undefined' &&
          document.visibilityState === 'visible' &&
          document.hasFocus();

        const shouldIncrementUnread = !isOwnSide && !(isViewingThread && atBottom);
        applyIncomingMessageSummaryPatch(queryClient, portal, message, shouldIncrementUnread);
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.unread });

        if (!isOwn && !isViewingThread) {
          const title = message.senderName ? `${message.senderName} - InterVue Connect` : 'InterVue Connect';
          tryPlayDedupedAlert(portal, `msg:${message.id}`, title, getMessagePreviewText(message));
        }
      },

      onMessageUpdated: (message) => {
        if (!portal) return;
        const keys = buildConnectKeys(portal);
        upsertMessageInCache(queryClient, portal, message);
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.conversation(message.connectionId) });
      },

      onReaction: (payload) => {
        if (!portal) return;
        patchMessageReactionsInCache(queryClient, portal, payload.connectionId, payload.messageId, payload.reactions);
      },

      onRead: (payload) => {
        if (!portal) return;
        const keys = buildConnectKeys(portal);
        applyPeerReadInCache(
          queryClient,
          portal,
          payload.connectionId,
          payload.readerType,
          payload.lastReadMessageId,
          payload.lastReadAt,
        );
        void queryClient.invalidateQueries({ queryKey: keys.unread });
      },

      onTyping: (payload) => {
        if (!portal) return;
        const ownActorType = portal === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';
        if (payload.actorType === ownActorType && payload.actorId === currentUserId) return;
        useConnectUiStore.getState().setTyping(
          portal,
          payload.connectionId,
          {
            actorId: payload.actorId,
            actorType: payload.actorType,
            actorName: payload.actorName,
          },
          payload.typing,
        );
      },

      onStatus: (payload) => {
        if (!portal) return;
        const keys = buildConnectKeys(portal);
        patchConversationSummaryInCache(queryClient, portal, payload.connectionId, (current) => ({
          ...current,
          status: payload.status,
          blockedByActorType: payload.status === 'BLOCKED' ? payload.blockedByActorType : undefined,
        }));
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.invitations });
        void queryClient.invalidateQueries({ queryKey: keys.conversation(payload.connectionId) });
        void queryClient.invalidateQueries({ queryKey: keys.unread });

        if (portal === 'candidate' && payload.status === 'PENDING') {
          tryPlayDedupedAlert(
            portal,
            `invite:${payload.connectionId}:PENDING`,
            'InterVue Connect',
            'You received a new chat invitation',
          );
        } else if (portal === 'recruiter' && payload.status === 'ACCEPTED') {
          tryPlayDedupedAlert(
            portal,
            `invite:${payload.connectionId}:ACCEPTED`,
            'InterVue Connect',
            'Candidate accepted your chat invitation',
          );
        }
      },
    },
    isAuthenticated,
  );

  return null;
}
