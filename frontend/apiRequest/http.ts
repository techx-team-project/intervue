import { env } from '@/config/env';
import { ApiError, isApiError } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth.store';
import type { ApiResponse } from '@/types/api';
import type { AuthSession } from '@/types/auth';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
};

const UNAUTHORIZED = 401;

let refreshInFlight: Promise<AuthSession> | null = null;

function toApiError(response: Response, payload: ApiResponse<unknown> | null): ApiError {
  const retryAfter = Number(response.headers.get('Retry-After'));
  return new ApiError(
    response.status,
    payload?.error?.code ?? 'UNKNOWN_ERROR',
    payload?.message ?? response.statusText,
    payload?.error?.details ?? [],
    payload?.error?.meta ?? {},
    payload?.traceId ?? null,
    Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null,
  );
}

async function execute<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions,
  accessToken: string | null,
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'include',
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'Network error');
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) throw toApiError(response, payload);
  return payload.data as T;
}

export function refreshSession(): Promise<AuthSession> {
  refreshInFlight ??= execute<AuthSession>('/auth/refresh', { method: 'POST' }, null)
    .then((session) => {
      useAuthStore.getState().setSession(session);
      return session;
    })
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

export async function renewSession(): Promise<AuthSession> {
  await refreshInFlight?.catch(() => undefined);
  try {
    return await refreshSession();
  } catch (error) {
    if (isApiError(error) && error.status === UNAUTHORIZED) useAuthStore.getState().clearSession();
    throw error;
  }
}

export async function request<T = null>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true } = options;
  try {
    return await execute<T>(path, options, auth ? useAuthStore.getState().accessToken : null);
  } catch (error) {
    if (!auth || !isApiError(error) || error.status !== UNAUTHORIZED) throw error;
    try {
      await refreshSession();
    } catch {
      useAuthStore.getState().clearSession();
      throw error;
    }
    return execute<T>(path, options, useAuthStore.getState().accessToken);
  }
}
