import { isApiError } from '@/lib/api-error';
import { QueryClient } from '@tanstack/react-query';

const MAX_RETRIES = 2;

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) =>
          failureCount < MAX_RETRIES && !(isApiError(error) && error.status >= 400 && error.status < 500),
      },
    },
  });
}
