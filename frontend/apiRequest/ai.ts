import { request } from './http';
import type { RequirementMatchItem } from '@/types/recruiter-application';
import type { CvReviewQuota, CvReviewRequest, CvReviewResult } from '@/types/cv-review';

export interface ResumeMatchApiPayload {
  applicationId?: string;
  jobTitle: string;
  jobRequirements: string[];
  jobDescription?: string;
  candidateData?: {
    fullName?: string;
    title?: string;
    topSkills?: string[];
    experienceSummary?: string;
    experiences?: string[];
    projects?: string[];
    educations?: string[];
  };
  cvText?: string;
}

export interface ResumeMatchApiResponse {
  applicationId: string;
  experienceSummary: string;
  requirements: RequirementMatchItem[];
  questionsToAsk: string[];
  model: string;
  promptVersion: string;
  aiProcessedCandidateData: boolean;
  analyzedAt: string;
  disclaimer: string;
}

export interface CoverLetterApiPayload {
  jobTitle: string;
  companyName: string;
  jobRequirements?: string[];
  jobDescription?: string;
  resumeId?: number;
  cvText?: string;
  candidateName?: string;
}

export interface CoverLetterApiResponse {
  coverLetter: string;
  modelVersion: string;
  promptVersion: string;
  notice: string;
}

export interface ResumeMatchQuota {
  freeUsedThisMonth: number;
  freeLimit: number;
  freeRemaining: number;
  paidRemaining: number;
  totalRemaining: number;
  resetAt: string;
}

export async function requestResumeMatch(payload: ResumeMatchApiPayload): Promise<ResumeMatchApiResponse> {
  return request<ResumeMatchApiResponse>('/recruiter/ai/resume-match', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export async function analyzeApplicationResume(applicationId: number): Promise<ResumeMatchApiResponse> {
  return request<ResumeMatchApiResponse>(`/recruiter/ai/applications/${applicationId}/resume-match`, {
    method: 'POST',
    auth: true,
  });
}

export async function getResumeMatchQuota(): Promise<ResumeMatchQuota> {
  return request<ResumeMatchQuota>('/recruiter/ai/resume-match/quota', {
    method: 'GET',
    auth: true,
  });
}

export async function generateCoverLetter(payload: CoverLetterApiPayload): Promise<CoverLetterApiResponse> {
  return request<CoverLetterApiResponse>('/ai/cover-letter', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export async function requestCvReview(payload: CvReviewRequest): Promise<CvReviewResult> {
  return request<CvReviewResult>('/ai/cv-reviews', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export async function uploadCvForReview(file: File, targetPosition?: string, jobId?: number): Promise<CvReviewResult> {
  const formData = new FormData();
  formData.append('file', file);
  if (targetPosition) {
    formData.append('targetPosition', targetPosition);
  }
  if (jobId) {
    formData.append('jobId', String(jobId));
  }

  const params = new URLSearchParams();
  if (targetPosition) params.append('targetPosition', targetPosition);
  if (jobId) params.append('jobId', String(jobId));

  const query = params.toString() ? `?${params.toString()}` : '';
  const endpoint = `/ai/cv-reviews/upload${query}`;

  return request<CvReviewResult>(endpoint, {
    method: 'POST',
    body: formData,
    auth: true,
  });
}

export async function getCvReviewQuota(): Promise<CvReviewQuota> {
  return request<CvReviewQuota>('/ai/cv-reviews/quota', {
    method: 'GET',
    auth: true,
  });
}

export async function getCvReviewById(id: number): Promise<CvReviewResult> {
  return request<CvReviewResult>(`/ai/cv-reviews/${id}`, {
    method: 'GET',
    auth: true,
  });
}

export async function getMyCvReviews(): Promise<CvReviewResult[]> {
  return request<CvReviewResult[]>('/ai/cv-reviews', {
    method: 'GET',
    auth: true,
  });
}
