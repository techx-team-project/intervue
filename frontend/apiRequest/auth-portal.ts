import { authApi } from '@/apiRequest/auth';
import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import type { AuthPortal, OAuthPortal } from '@/lib/auth-portal';
import { toRecruiterSession } from '@/lib/auth-portal';
import type { OAuthCallbackPayload, OAuthOutcome } from '@/types/auth';

export function authApiFor(portal: AuthPortal) {
  return portal === 'recruiter' ? recruiterAuthApi : authApi;
}

export async function exchangeOAuthCode(
  portal: OAuthPortal,
  provider: string,
  payload: OAuthCallbackPayload,
): Promise<OAuthOutcome> {
  if (portal === 'recruiter') {
    const res = await recruiterAuthApi.oauthCallback(provider, payload);
    if (res.requiresTwoFactor && res.tempToken) return { tempToken: res.tempToken, newAccount: false };
    const session = res.accessToken && res.recruiter ? toRecruiterSession(res) : undefined;
    return { session, newAccount: res.newAccount === true };
  }
  const res = await authApi.oauthCallback(provider, payload);
  if (res.requiresTwoFactor && res.tempToken) return { tempToken: res.tempToken, newAccount: false };
  const session = res.accessToken && res.user ? { accessToken: res.accessToken, user: res.user } : undefined;
  return { session, newAccount: false };
}
