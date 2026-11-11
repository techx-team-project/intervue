export interface ParsedProfileSkill {
  name: string;
  category: 'CORE' | 'AI_DATA' | 'TOOLS_DEVOPS' | 'SOFT';
  level: 'BASIC' | 'INTERMEDIATE' | 'PROFICIENT' | 'EXPERT';
  years: number;
}

export interface ParsedProfileExperience {
  title: string;
  companyName: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  achievements?: string | null;
  skills?: string[];
}

export interface ParsedProfileEducation {
  school: string;
  degree?: string | null;
  major?: string | null;
  startYear: number;
  endYear?: number | null;
  gpa?: string | null;
}

export interface ParsedProfileCertification {
  name: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
}

export interface ParsedProfileLanguage {
  language: string;
  proficiency: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'FLUENT' | 'NATIVE';
}

export interface ParsedProfileData {
  headline?: string | null;
  desiredRole?: string | null;
  bio?: string | null;
  totalYoe?: number | null;
  skills?: ParsedProfileSkill[];
  experiences?: ParsedProfileExperience[];
  educations?: ParsedProfileEducation[];
  certifications?: ParsedProfileCertification[];
  languages?: ParsedProfileLanguage[];
}

export interface ProfileDiffItem {
  field: string;
  label: string;
  oldValue: unknown;
  newValue: unknown;
  hasChange: boolean;
}

export interface CvParseProfileResponse {
  readable: boolean;
  unreadableReason?: string | null;
  reasonMessage?: string | null;
  profileEmpty: boolean;
  parsedData: ParsedProfileData | null;
  diffs: ProfileDiffItem[];
}

export interface ApplyCvParsedRequest {
  applyHeadline: boolean;
  applyDesiredRole: boolean;
  applyBio: boolean;
  applyTotalYoe: boolean;
  applySkills: boolean;
  applyExperiences: boolean;
  applyEducations: boolean;
  applyCertifications: boolean;
  applyLanguages: boolean;
  parsedData: ParsedProfileData;
}
