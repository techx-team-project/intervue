'use client';

import { refreshSession } from '@/apiRequest/http';
import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth.store';
import { useEffect, useRef } from 'react';

const MIN_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

type ConnectStreamPortal = 'candidate' | 'recruiter';

function streamPath(portal: ConnectStreamPortal): string {
  return portal === 'recruiter' ? '/recruiter/connect/stream' : '/candidate/connect/stream';
}

export function useConnectStream(portal: ConnectStreamPortal, onMessage: () => void, enabled = true) {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled) return undefined;

    let stopped = false;
    let backoffMs = MIN_BACKOFF_MS;
    let controller: AbortController | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

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
          const isHeartbeatComment = frame.trimStart().startsWith(':');
          if (!isHeartbeatComment && frame.includes('data:')) {
            onMessageRef.current();
          }
        }
      }
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
              // fall through to backoff below
            }
          }
        }
        await wait(backoffMs);
        backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
      }
    }

    function wait(ms: number) {
      return new Promise<void>((resolve) => {
        retryTimer = setTimeout(resolve, ms);
      });
    }

    connect();

    const reconnectSoon = () => {
      backoffMs = MIN_BACKOFF_MS;
      controller?.abort();
    };
    window.addEventListener('online', reconnectSoon);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') reconnectSoon();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopped = true;
      controller?.abort();
      if (retryTimer) clearTimeout(retryTimer);
      window.removeEventListener('online', reconnectSoon);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [portal, enabled]);
}
