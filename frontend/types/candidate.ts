export interface CandidateSkill {
  name: string;
  level: 'Cơ bản' | 'Khá' | 'Thành thạo' | 'Chuyên gia';
  years: number;
  category: 'core' | 'ai' | 'tool' | 'soft';
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  companyLogo?: string;
  location: string;
  startDate: string;
  endDate: string; // or 'Hiện tại'
  isCurrent: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface CandidateProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuerLogo?: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CandidateLanguage {
  name: string;
  proficiency: string;
  certificate?: string;
}

export interface AttachedCv {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  isDefault: boolean;
  atsScore: number;
  downloadUrl: string;
}

export interface JobPreferences {
  desiredRole: string;
  desiredSalary: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote' | 'Linh hoạt';
  jobType: 'Toàn thời gian' | 'Bán thời gian' | 'Hợp đồng' | 'Freelance';
  desiredLocation: string[];
  level: string;
  industries: string[];
}

export interface AiProfileScore {
  overallScore: number; // 0 - 100
  atsReadiness: number; // 0 - 100
  starScore: number; // 0 - 100
  mockInterviewCount: number;
  averageInterviewScore: number; // e.g. 9.2
  highlightStrengths: string[];
  suggestedImprovements: string[];
  topRankPercentile: number; // e.g. top 5%
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  title: string;
  avatar: string;
  coverImage?: string;
  email: string;
  phone: string;
  location: string;
  birthYear: number;
  gender: string;
  status: 'actively_looking' | 'open_to_offers' | 'not_looking';
  bio: string;
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    facebook?: string;
  };
  aiScore: AiProfileScore;
  preferences: JobPreferences;
  skills: CandidateSkill[];
  experiences: WorkExperience[];
  educations: Education[];
  projects: CandidateProject[];
  certifications: Certification[];
  languages: CandidateLanguage[];
  resumes: AttachedCv[];
  stats: {
    profileViewsThisWeek: number;
    recruiterSearches: number;
    interviewInvites: number;
    savedByRecruiters: number;
  };
}
