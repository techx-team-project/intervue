import type { ReportReasonCode } from '@/types/connect';

export interface ReportJobPayload {
  reasonCode: ReportReasonCode;
  note?: string;
}
