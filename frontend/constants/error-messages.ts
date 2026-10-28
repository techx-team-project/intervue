export const FALLBACK_ERROR_MESSAGE = 'Something went wrong, please try again later.';

export const ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'Unable to reach the server, please check your connection.',
  VALIDATION_FAILED: 'Some information is invalid, please review and try again.',
  INVALID_CREDENTIALS: 'Incorrect email or password.',
  UNAUTHENTICATED: 'Your session has expired, please sign in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  EMAIL_ALREADY_USED: 'This email is already registered.',
  EMAIL_ALREADY_VERIFIED: 'This email has already been verified.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before continuing.',
  INVALID_OR_EXPIRED_TOKEN: 'The link is invalid or has expired.',
  IDENTITY_NOT_VERIFIED: 'You need to verify your identity before doing this.',
  RATE_LIMITED: 'Too many attempts, please try again in a few minutes.',
};
