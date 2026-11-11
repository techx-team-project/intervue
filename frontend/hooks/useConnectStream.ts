'use client';

import { refreshSession } from '@/apiRequest/http';
import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth.store';
import type {
  ConnectMessage,
  ConnectPortal,
  ConnectReactionEventPayload,
  ConnectReadEventPayload,
  ConnectStatusEventPayload,
  ConnectTypingEventPayload,
} from '@/types/connect';
import { useEffect, useRef } from 'react';

const MIN_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const BROADCAST_CHANNEL = 'intervue-connect';

export type ConnectStreamHandlers = {
  onMessage?: (payload: ConnectMessage) => void;
  onMessageUpdated?: (payload: ConnectMessage) => void;
  onReaction?: (payload: ConnectReactionEventPayload) => void;
  onRead?: (payload: ConnectReadEventPayload) => void;
  onTyping?: (payload: ConnectTypingEventPayload) => void;
  onStatus?: (payload: ConnectStatusEventPayload) => void;
};

export type ConnectBroadcastMessage =
  | { type: 'READ'; portal: ConnectPortal; connectionId: number }
  | { type: 'INVALIDATE'; portal: ConnectPortal; connectionId?: number };

export function postConnectBroadcast(msg: ConnectBroadcastMessage) {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
  try {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.postMessage(msg);
    channel.close();
  } catch {}
}

type PortalStreamEntry = {
  listeners: Set<ConnectStreamHandlers>;
  stop: () => void;
};

const activeStreams = new Map<ConnectPortal, PortalStreamEntry>();

function streamPath(portal: ConnectPortal): string {
  return portal === 'recruiter' ? '/recruiter/connect/stream' : '/candidate/connect/stream';
}

function startPortalStream(portal: ConnectPortal): PortalStreamEntry {
  const listeners = new Set<ConnectStreamHandlers>();
  let stopped = false;
  let backoffMs = MIN_BACKOFF_MS;
  let controller: AbortController | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  function dispatchFrame(eventName: string | undefined, rawData: string) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      return;
    }

    for (const handler of listeners) {
      if (eventName === 'message' || !eventName) {
        handler.onMessage?.(parsed as ConnectMessage);
      } else if (eventName === 'message_updated') {
        handler.onMessageUpdated?.(parsed as ConnectMessage);
      } else if (eventName === 'reaction') {
        handler.onReaction?.(parsed as ConnectReactionEventPayload);
      } else if (eventName === 'read') {
        handler.onRead?.(parsed as ConnectReadEventPayload);
      } else if (eventName === 'typing') {
        handler.onTyping?.(parsed as ConnectTypingEventPayload);
      } else if (eventName === 'status') {
        handler.onStatus?.(parsed as ConnectStatusEventPayload);
      }
    }
  }

  // Native EventSource can't carry an Authorization header, and the access token is
  // memory-only by design - so the stream is read manually through fetch instead.
  async function readStream(accessToken: string) {
    controller = new AbortController();
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${streamPath(portal)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
      signal: controller.signal,
    });

    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    if (!response.ok || !response.body) {
      throw new Error(`STREAM_FAILED_${response.status}`);
    }

    backoffMs = MIN_BACKOFF_MS;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (!stopped) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? '';
      for (const frame of frames) {
        const trimmed = frame.trimStart();
        if (trimmed.startsWith(':')) continue;
        const lines = frame.split('\n');
        let eventName: string | undefined;
        const dataLines: string[] = [];
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).trimStart());
          }
        }
        if (dataLines.length > 0) {
          dispatchFrame(eventName, dataLines.join('\n'));
        }
      }
    }
  }

  function wait(ms: number) {
    return new Promise<void>((resolve) => {
      retryTimer = setTimeout(resolve, ms);
    });
  }

  async function connect() {
    while (!stopped) {
      try {
        const token = useAuthStore.getState()[portal].accessToken;
        if (!token) {
          await wait(backoffMs);
          continue;
        }
        await readStream(token);
        if (stopped) return;
      } catch (error) {
        if (stopped) return;
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
          try {
            await refreshSession();
            continue;
          } catch {
            // Fall back to exponential backoff when session refresh fails.
          }
        }
      }
      await wait(backoffMs);
      backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
    }
  }

  const reconnectSoon = () => {
    backoffMs = MIN_BACKOFF_MS;
    controller?.abort();
  };
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') reconnectSoon();
  };

  window.addEventListener('online', reconnectSoon);
  document.addEventListener('visibilitychange', handleVisibility);
  void connect();

  return {
    listeners,
    stop: () => {
      stopped = true;
      controller?.abort();
      if (retryTimer) clearTimeout(retryTimer);
      window.removeEventListener('online', reconnectSoon);
      document.removeEventListener('visibilitychange', handleVisibility);
    },
  };
}

export function useConnectStream(portal: ConnectPortal | null, handlers: ConnectStreamHandlers, enabled = true) {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!enabled || !portal) return undefined;

    let entry = activeStreams.get(portal);
    if (!entry) {
      entry = startPortalStream(portal);
      activeStreams.set(portal, entry);
    }

    const proxyHandler: ConnectStreamHandlers = {
      onMessage: (payload) => handlersRef.current.onMessage?.(payload),
      onMessageUpdated: (payload) => handlersRef.current.onMessageUpdated?.(payload),
      onReaction: (payload) => handlersRef.current.onReaction?.(payload),
      onRead: (payload) => handlersRef.current.onRead?.(payload),
      onTyping: (payload) => handlersRef.current.onTyping?.(payload),
      onStatus: (payload) => handlersRef.current.onStatus?.(payload),
    };
    entry.listeners.add(proxyHandler);

    return () => {
      entry.listeners.delete(proxyHandler);
      if (entry.listeners.size === 0) {
        entry.stop();
        activeStreams.delete(portal);
      }
    };
  }, [portal, enabled]);
}
