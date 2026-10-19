import type { AttachedCv } from './candidate';
import type { RecentApplicationStatus } from './recruiter';

export type ApplicationStatus = RecentApplicationStatus;

export type ApplicationColumnId = 'APPLIED' | 'IN_REVIEW' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'CLOSED';

export type ApplicationSource = 'DIRECT' | 'AI_RECOMMENDATION' | 'INVITED' | 'REFERRAL';

export type InterviewMode = 'ONLINE' | 'OFFLINE';

export interface ApplicationCandidateSummary {
  id: string;
  fullName: string;
  title: string;
  location: string;
  experienceYears: number;
  topSkills: string[];
  email: string;
  phone: string;
}

export interface ApplicationAiMatch {
  score: number;
  summary: string;
  matchedEvidence: string[];
  missingInformation: string[];
  askMoreAbout: string[];
  model: string;
  evaluatedAt: string;
}

export interface ScreeningAnswer {
  questionId: string;
  question: string;
  answer: string;
  required: boolean;
}

export interface ApplicationInternalNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ApplicationStatusChange {
  id: string;
  from?: ApplicationStatus;
  to: ApplicationStatus;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface ApplicationInterview {
  scheduledAt: string;
  mode: InterviewMode;
  location?: string;
  meetingUrl?: string;
  note?: string;
}

export interface ApplicationRejection {
  reason: string;
  detail?: string;
  rejectedAt: string;
}

export interface RecruiterApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidate: ApplicationCandidateSummary;
  status: ApplicationStatus;
  source: ApplicationSource;
  appliedAt: string;
  lastActivityAt: string;
  isSaved: boolean;
  savedAt?: string;
  isViewed: boolean;
  cv: AttachedCv;
  coverLetter?: string;
  screeningAnswers: ScreeningAnswer[];
  aiMatch: ApplicationAiMatch;
  internalNotes: ApplicationInternalNote[];
  statusHistory: ApplicationStatusChange[];
  interview?: ApplicationInterview;
  rejection?: ApplicationRejection;
}

export interface ApplicationCardHandlers {
  onOpen: (application: RecruiterApplication) => void;
  onToggleSaved: (id: string) => void;
  onToggleSelected: (id: string) => void;
  onRequestStatusChange: (application: RecruiterApplication, status: ApplicationStatus) => void;
}

export type ApplicationSortKey = 'NEWEST' | 'OLDEST' | 'AI_MATCH' | 'LAST_ACTIVITY' | 'NAME';

export type AiMatchBand = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ApplicationFilters {
  search: string;
  jobId: string;
  sort: ApplicationSortKey;
  aiMatchBand: AiMatchBand;
  source: ApplicationSource | '';
  savedOnly: boolean;
}
