export const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const;
export const JOB_SEARCH_STATUSES = ['ACTIVELY_LOOKING', 'OPEN_TO_OFFERS', 'NOT_LOOKING'] as const;
export const CAREER_LEVELS = ['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'] as const;
export const WORK_MODES = ['ON_SITE', 'HYBRID', 'REMOTE', 'FLEXIBLE'] as const;
export const CONTRACT_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP'] as const;

export const SKILL_CATEGORIES = ['CORE', 'AI_DATA', 'TOOLS_DEVOPS', 'SOFT'] as const;
export const SKILL_LEVELS = ['BASIC', 'INTERMEDIATE', 'PROFICIENT', 'EXPERT'] as const;
export const LANGUAGE_PROFICIENCIES = ['BASIC', 'INTERMEDIATE', 'ADVANCED', 'FLUENT', 'NATIVE'] as const;

export type Gender = (typeof GENDERS)[number];
export type JobSearchStatus = (typeof JOB_SEARCH_STATUSES)[number];
export type CareerLevel = (typeof CAREER_LEVELS)[number];
export type WorkMode = (typeof WORK_MODES)[number];
export type ContractType = (typeof CONTRACT_TYPES)[number];
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type SkillLevel = (typeof SKILL_LEVELS)[number];
export type LanguageProficiency = (typeof LANGUAGE_PROFICIENCIES)[number];

export type CandidateExperience = {
  id: number;
  title: string;
  companyName: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  achievements: string | null;
  skills: string[];
};

export type CandidateEducation = {
  id: number;
  school: string;
  degree: string | null;
  major: string | null;
  startYear: number;
  endYear: number | null;
  gpa: string | null;
  achievements: string | null;
};

export type CandidateProject = {
  id: number;
  name: string;
  role: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  highlights: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  technologies: string[];
};

export type CandidateCertification = {
  id: number;
  name: string;
  issuer: string;
  issueDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
};

export type CandidateLanguage = {
  id: number;
  language: string;
  proficiency: LanguageProficiency;
  certificate: string | null;
};

export type CandidateSkill = {
  id: number;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  years: number;
};

export type CandidateProfileResponse = {
  userId: number;
  name: string;
  email: string;
  contactEmail: string | null;
  phone: string | null;
  phoneVerified: boolean;
  address: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  headline: string | null;
  bio: string | null;
  gender: Gender | null;
  birthYear: number | null;
  showPersonalDetails: boolean;
  searchableByRecruiters: boolean;
  jobSearchStatus: JobSearchStatus;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  desiredRole: string | null;
  desiredLevel: CareerLevel | null;
  totalYoe?: number | null;
  salaryNegotiable: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  currency?: string | null;
  salaryPeriod?: string | null;
  workMode: WorkMode | null;
  contractType: ContractType | null;
  preferredLocations: string[];
  preferredIndustries: string[];
  experiences: CandidateExperience[];
  educations: CandidateEducation[];
  projects: CandidateProject[];
  certifications: CandidateCertification[];
  languages: CandidateLanguage[];
  skills: CandidateSkill[];
  updatedAt: string | null;
};

export type SaveCandidateProfileRequest = {
  name: string;
  headline: string | null;
  bio: string | null;
  contactEmail: string | null;
  address: string | null;
  gender: Gender | null;
  birthYear: number | null;
  showPersonalDetails: boolean;
  searchableByRecruiters: boolean;
  jobSearchStatus: JobSearchStatus;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  desiredRole: string;
  desiredLevel: CareerLevel | null;
  totalYoe?: number | null;
  salaryNegotiable: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  currency?: string | null;
  salaryPeriod?: string | null;
  workMode: WorkMode | null;
  contractType: ContractType | null;
  preferredLocations: string[];
  preferredIndustries: string[];
};

export type CandidateResume = {
  id: number;
  fileName: string;
  url: string;
  fileSizeBytes: number;
  contentType: string;
  isDefault: boolean;
  parsedSummary: string | null;
  createdAt: string;
};

export type SaveCandidateExperienceRequest = {
  title: string;
  companyName: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  achievements: string | null;
  skills: string[];
};

export type SaveCandidateEducationRequest = {
  school: string;
  degree: string | null;
  major: string | null;
  startYear: number;
  endYear: number | null;
  gpa: string | null;
  achievements: string | null;
};

export type SaveCandidateProjectRequest = {
  name: string;
  role: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  highlights: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  technologies: string[];
};

export type SaveCandidateCertificationRequest = {
  name: string;
  issuer: string;
  issueDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
};

export type SaveCandidateLanguageRequest = {
  language: string;
  proficiency: LanguageProficiency;
  certificate: string | null;
};

export type SaveCandidateSkillRequest = {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  years: number;
};

export type CandidateSectionRequests = {
  experiences: SaveCandidateExperienceRequest;
  educations: SaveCandidateEducationRequest;
  projects: SaveCandidateProjectRequest;
  certifications: SaveCandidateCertificationRequest;
  languages: SaveCandidateLanguageRequest;
  skills: SaveCandidateSkillRequest;
};

export type CandidateSection = keyof CandidateSectionRequests;
