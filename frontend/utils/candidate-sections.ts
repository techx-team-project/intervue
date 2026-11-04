import type {
  CandidateCertificationFormData,
  CandidateEducationFormData,
  CandidateExperienceFormData,
  CandidateLanguageFormData,
  CandidateProjectFormData,
  CandidateSkillFormData,
} from '@/schemas/candidate-sections.schema';
import type {
  CandidateCertification,
  CandidateEducation,
  CandidateExperience,
  CandidateLanguage,
  CandidateProject,
  CandidateSkill,
  SaveCandidateCertificationRequest,
  SaveCandidateEducationRequest,
  SaveCandidateExperienceRequest,
  SaveCandidateLanguageRequest,
  SaveCandidateProjectRequest,
  SaveCandidateSkillRequest,
} from '@/types/candidate-profile';
import { toFirstOfMonth, toMonthValue } from '@/utils/candidate-dates';
import { numberOrNull, orNull } from '@/utils/candidate-profile';

const textOf = (value: string | null): string => value ?? '';
const yearOf = (value: number | null): string => (value === null ? '' : String(value));

export function toExperienceFormValues(item: CandidateExperience | null): CandidateExperienceFormData {
  return {
    title: item?.title ?? '',
    companyName: item?.companyName ?? '',
    location: textOf(item?.location ?? null),
    startDate: toMonthValue(item?.startDate ?? null),
    endDate: toMonthValue(item?.endDate ?? null),
    current: item?.current ?? false,
    description: textOf(item?.description ?? null),
    achievements: textOf(item?.achievements ?? null),
    skills: item?.skills ?? [],
  };
}

export function toExperienceRequest(values: CandidateExperienceFormData): SaveCandidateExperienceRequest {
  return {
    title: values.title,
    companyName: values.companyName,
    location: orNull(values.location),
    startDate: toFirstOfMonth(values.startDate) ?? values.startDate,
    endDate: values.current ? null : toFirstOfMonth(values.endDate),
    current: values.current,
    description: orNull(values.description),
    achievements: orNull(values.achievements),
    skills: values.skills,
  };
}

export function toProjectFormValues(item: CandidateProject | null): CandidateProjectFormData {
  return {
    name: item?.name ?? '',
    role: textOf(item?.role ?? null),
    startDate: toMonthValue(item?.startDate ?? null),
    endDate: toMonthValue(item?.endDate ?? null),
    current: item?.current ?? false,
    description: textOf(item?.description ?? null),
    highlights: textOf(item?.highlights ?? null),
    githubUrl: textOf(item?.githubUrl ?? null),
    demoUrl: textOf(item?.demoUrl ?? null),
    technologies: item?.technologies ?? [],
  };
}

export function toProjectRequest(values: CandidateProjectFormData): SaveCandidateProjectRequest {
  return {
    name: values.name,
    role: orNull(values.role),
    startDate: toFirstOfMonth(values.startDate) ?? values.startDate,
    endDate: values.current ? null : toFirstOfMonth(values.endDate),
    current: values.current,
    description: orNull(values.description),
    highlights: orNull(values.highlights),
    githubUrl: orNull(values.githubUrl),
    demoUrl: orNull(values.demoUrl),
    technologies: values.technologies,
  };
}

export function toEducationFormValues(item: CandidateEducation | null): CandidateEducationFormData {
  return {
    school: item?.school ?? '',
    degree: textOf(item?.degree ?? null),
    major: textOf(item?.major ?? null),
    startYear: yearOf(item?.startYear ?? null),
    endYear: yearOf(item?.endYear ?? null),
    gpa: textOf(item?.gpa ?? null),
    achievements: textOf(item?.achievements ?? null),
  };
}

export function toEducationRequest(values: CandidateEducationFormData): SaveCandidateEducationRequest {
  return {
    school: values.school,
    degree: orNull(values.degree),
    major: orNull(values.major),
    startYear: Number(values.startYear),
    endYear: numberOrNull(values.endYear),
    gpa: orNull(values.gpa),
    achievements: orNull(values.achievements),
  };
}

export function toCertificationFormValues(item: CandidateCertification | null): CandidateCertificationFormData {
  return {
    name: item?.name ?? '',
    issuer: item?.issuer ?? '',
    issueDate: toMonthValue(item?.issueDate ?? null),
    credentialId: textOf(item?.credentialId ?? null),
    credentialUrl: textOf(item?.credentialUrl ?? null),
  };
}

export function toCertificationRequest(values: CandidateCertificationFormData): SaveCandidateCertificationRequest {
  return {
    name: values.name,
    issuer: values.issuer,
    issueDate: toFirstOfMonth(values.issueDate),
    credentialId: orNull(values.credentialId),
    credentialUrl: orNull(values.credentialUrl),
  };
}

export function toLanguageFormValues(item: CandidateLanguage | null): CandidateLanguageFormData {
  return {
    language: item?.language ?? '',
    proficiency: item?.proficiency ?? 'INTERMEDIATE',
    certificate: textOf(item?.certificate ?? null),
  };
}

export function toLanguageRequest(values: CandidateLanguageFormData): SaveCandidateLanguageRequest {
  return { language: values.language, proficiency: values.proficiency, certificate: orNull(values.certificate) };
}

export function toSkillFormValues(item: CandidateSkill | null): CandidateSkillFormData {
  return {
    name: item?.name ?? '',
    category: item?.category ?? 'CORE',
    level: item?.level ?? 'INTERMEDIATE',
    years: item ? String(item.years) : '0',
  };
}

export function toSkillRequest(values: CandidateSkillFormData): SaveCandidateSkillRequest {
  return { name: values.name, category: values.category, level: values.level, years: Number(values.years) };
}
