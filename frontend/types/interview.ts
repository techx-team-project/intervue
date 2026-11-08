export type InterviewStatus = 'PROPOSED' | 'CONFIRMED' | 'DECLINED' | 'RESCHEDULE_REQUESTED' | 'CANCELLED';

export type InterviewFormat = 'ONLINE' | 'OFFLINE';

export interface Interview {
  id: number;
  applicationId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  startsAt: string;
  durationMinutes: number;
  format: InterviewFormat;
  location: string;
  note?: string;
  status: InterviewStatus;
  proposedStartsAt?: string;
  candidateMessage?: string;
  cancelReason?: string;
  createdAt: string;
}

export interface InterviewFormValues {
  startsAt: string;
  durationMinutes: number;
  format: InterviewFormat;
  location: string;
  note?: string;
}
