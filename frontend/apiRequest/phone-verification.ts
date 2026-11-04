import { request } from '@/apiRequest/http';
import type { User } from '@/types/auth';

export const phoneVerificationApi = {
  sendOtp: (phone: string) =>
    request<null>('/users/me/phone/send-otp', {
      method: 'POST',
      body: { phone },
    }),

  verifyOtp: (otp: string) =>
    request<User>('/users/me/phone/verify', {
      method: 'POST',
      body: { otp },
    }),
};
