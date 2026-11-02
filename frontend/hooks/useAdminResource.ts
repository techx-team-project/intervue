'use client';

import { ApiError, isApiError } from '@/lib/api-error';
import { useCallback, useEffect, useState } from 'react';

export type AdminResourceStatus = 'loading' | 'ready' | 'error';

function toApiError(cause: unknown): ApiError {
  return isApiError(cause) ? cause : new ApiError(0, 'UNKNOWN_ERROR', 'Something went wrong', [], {}, null, null);
}

export function useAdminResource<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AdminResourceStatus>('loading');
  const [error, setError] = useState<ApiError | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Nothing is set synchronously here: the status only moves inside the promise
  // callbacks, which is what keeps this clear of the set-state-in-effect rule.
  useEffect(() => {
    let cancelled = false;

    load()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setStatus('ready');
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(toApiError(cause));
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [load, attempt]);

  const reload = useCallback(() => {
    setStatus('loading');
    setError(null);
    setAttempt((previous) => previous + 1);
  }, []);

  return { data, status, error, reload };
}
