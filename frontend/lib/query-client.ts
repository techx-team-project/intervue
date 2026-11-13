import { isApiError } from '@/lib/api-error';
import { QueryClient } from '@tanstack/react-query';

const MAX_RETRIES = 2;
const RATE_LIMITED_STATUS = 429;
const DEFAULT_RETRY_DELAY_MS = 1000;
const MAX_JITTER_MS = 500;

function isNonRetryableClientError(error: unknown): boolean {
  return isApiError(error) && error.status >= 400 && error.status < 500 && error.status !== RATE_LIMITED_STATUS;
}

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => failureCount < MAX_RETRIES && !isNonRetryableClientError(error),
        retryDelay: (attemptIndex, error) =>
          isApiError(error) && error.status === RATE_LIMITED_STATUS && error.retryAfter
            ? error.retryAfter * 1000 + Math.random() * MAX_JITTER_MS
            : DEFAULT_RETRY_DELAY_MS * 2 ** attemptIndex,
      },
    },
  });
}
