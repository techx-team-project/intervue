export interface FreeQuotaSettings {
  aiResumeMatchFreePerMonth: number;
  aiJdGenerateFreePerMonth: number;
  cvReviewFreePerDay: number;
  candidateStarterCredits: number;
  connectDailyInviteLimit: number;
  companyFreePhotoLimit: number;
  requireJobSlot: boolean;
  jobFreeActiveLimit: number;
  jobFreeMaxDays: number;
  jobReviewFirstCount: number;
  updatedAt: string | null;
}

export type SaveFreeQuotaSettingsInput = Omit<FreeQuotaSettings, 'updatedAt'>;
