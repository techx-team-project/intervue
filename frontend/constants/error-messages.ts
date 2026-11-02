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
  INVALID_OR_EXPIRED_TOKEN: 'The link is invalid or has expired.',
  IDENTITY_NOT_VERIFIED: 'You need to verify your identity before doing this.',
  RATE_LIMITED: 'Too many attempts, please try again in a few minutes.',
  AI_IP_QUOTA_EXCEEDED: 'Bạn đã dùng hết 10 câu hỏi/giờ dành cho khách. Vui lòng đăng nhập hoặc thử lại sau.',
  AI_USER_QUOTA_EXCEEDED: 'Bạn đã đạt giới hạn 30 câu hỏi trong ngày hôm nay.',
  AI_CHAT_FAILED: 'Không thể xử lý tin nhắn lúc này, vui lòng thử lại sau.',
  AI_PROVIDER_UNAVAILABLE: 'Dịch vụ AI tạm thời gián đoạn, vui lòng thử lại sau.',
};
