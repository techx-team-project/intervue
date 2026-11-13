export interface FreeQuotaSettings {
  aiResumeMatchFreePerMonth: number;
  aiJdGenerateFreePerMonth: number;
  cvReviewFreePerDay: number;
  candidateStarterCredits: number;
  connectDailyInviteLimit: number;
  companyFreePhotoLimit: number;
  requireJobSlot: boolean;
  jobFreePostLimit: number;
  jobFreeMaxDays: number;
  jobReviewFirstCount: number;
  candidateDailyApplicationLimit: number;
  updatedAt: string | null;
}

export type SaveFreeQuotaSettingsInput = Omit<FreeQuotaSettings, 'updatedAt'>;
