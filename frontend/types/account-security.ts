export type AccountSession = {
  id: number;
  deviceLabel: string;
  ipAddress: string;
  location: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  current: boolean;
};
