// TEMP: replace with API
import type { AdminAccountState } from '@/types/admin';

const ACCOUNT_STATE: AdminAccountState = {
  twoFactorEnabled: false,
};

export function getAdminAccountState(): AdminAccountState {
  return ACCOUNT_STATE;
}
