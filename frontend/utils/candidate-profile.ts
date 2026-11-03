import { FIELD_ERROR_ALIASES } from '@/constants/candidate-profile';
import { ApiError, isApiError } from '@/lib/api-error';
import type { CandidateProfileFormData } from '@/schemas/candidate-profile.schema';
import type { CandidateProfileResponse, SaveCandidateProfileRequest } from '@/types/candidate-profile';

export const orNull = (value: string): string | null => (value === '' ? null : value);
export const numberOrNull = (value: string): number | null => (value === '' ? null : Number(value));

export function toFormValues(profile: CandidateProfileResponse): CandidateProfileFormData {
  return {
    name: profile.name,
    headline: profile.headline ?? '',
    bio: profile.bio ?? '',
    contactEmail: profile.contactEmail ?? '',
    address: profile.address ?? '',
    gender: profile.gender ?? '',
    birthYear: profile.birthYear === null ? '' : String(profile.birthYear),
    showPersonalDetails: profile.showPersonalDetails,
    searchableByRecruiters: profile.searchableByRecruiters,
    jobSearchStatus: profile.jobSearchStatus,
    githubUrl: profile.githubUrl ?? '',
    linkedinUrl: profile.linkedinUrl ?? '',
    portfolioUrl: profile.portfolioUrl ?? '',
    desiredRole: profile.desiredRole ?? '',
    desiredLevel: profile.desiredLevel ?? '',
    salaryNegotiable: profile.salaryNegotiable,
    salaryMin: profile.salaryMin === null ? '' : String(profile.salaryMin),
    salaryMax: profile.salaryMax === null ? '' : String(profile.salaryMax),
    workMode: profile.workMode ?? '',
    contractType: profile.contractType ?? '',
    preferredLocations: profile.preferredLocations,
    preferredIndustries: profile.preferredIndustries,
  };
}

export function toRequest(values: CandidateProfileFormData): SaveCandidateProfileRequest {
  return {
    name: values.name,
    headline: orNull(values.headline),
    bio: orNull(values.bio),
    contactEmail: orNull(values.contactEmail),
    address: orNull(values.address),
    gender: values.gender === '' ? null : values.gender,
    birthYear: numberOrNull(values.birthYear),
    showPersonalDetails: values.showPersonalDetails,
    searchableByRecruiters: values.searchableByRecruiters,
    jobSearchStatus: values.jobSearchStatus,
    githubUrl: orNull(values.githubUrl),
    linkedinUrl: orNull(values.linkedinUrl),
    portfolioUrl: orNull(values.portfolioUrl),
    desiredRole: values.desiredRole,
    desiredLevel: values.desiredLevel === '' ? null : values.desiredLevel,
    salaryNegotiable: values.salaryNegotiable,
    salaryMin: values.salaryNegotiable ? null : numberOrNull(values.salaryMin),
    salaryMax: values.salaryNegotiable ? null : numberOrNull(values.salaryMax),
    workMode: values.workMode === '' ? null : values.workMode,
    contractType: values.contractType === '' ? null : values.contractType,
    preferredLocations: values.preferredLocations,
    preferredIndustries: values.preferredIndustries,
  };
}

export function aliasProfileErrorFields(error: unknown): unknown {
  if (!isApiError(error)) return error;
  const details = error.details.map((detail) => ({
    ...detail,
    field: detail.field ? (FIELD_ERROR_ALIASES[detail.field] ?? detail.field) : detail.field,
  }));
  return new ApiError(error.status, error.code, error.message, details, error.meta, error.traceId, error.retryAfter);
}

export function formatSalaryRange(profile: CandidateProfileResponse): string | null {
  if (profile.salaryNegotiable) return 'Negotiable';
  const { salaryMin, salaryMax } = profile;
  const format = (amount: number) => `${new Intl.NumberFormat('en-US').format(amount)} VND`;
  if (salaryMin !== null && salaryMax !== null) return `${format(salaryMin)} - ${format(salaryMax)}`;
  if (salaryMin !== null) return `From ${format(salaryMin)}`;
  if (salaryMax !== null) return `Up to ${format(salaryMax)}`;
  return null;
}
