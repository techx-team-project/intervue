import { request } from '@/apiRequest/http';
import type { User } from '@/types/auth';

export const userApi = {
  becomeRecruiter: () => request<User>('/users/me/roles/recruiter', { method: 'POST' }),
};
