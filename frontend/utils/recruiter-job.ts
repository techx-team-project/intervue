import type { JobPostFormData } from '@/schemas/job.schema';
import type {
  RecruiterJobPost,
  RecruiterJobResource,
  RecruiterJobSummaryResource,
  SaveJobRequest,
  SalaryCurrency,
} from '@/types/recruiter-job';

const VND_UNIT = 1_000_000;

export function optionLabel(options: ReadonlyArray<{ value: string; label: string }>, value?: string | null) {
  return options.find((option) => option.value === value)?.label ?? '—';
}

const DEFAULT_DEADLINE_DAYS = 30;

export function toDisplayAmount(amount: number | null | undefined, currency: SalaryCurrency): number | undefined {
  if (amount === null || amount === undefined) return undefined;
  return currency === 'VND' ? amount / VND_UNIT : amount;
}

export function toStoredAmount(amount: number | undefined, currency: SalaryCurrency): number | undefined {
  if (amount === undefined || Number.isNaN(amount)) return undefined;
  return currency === 'VND' ? Math.round(amount * VND_UNIT) : Math.round(amount);
}

export function defaultDeadline(): string {
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_DEADLINE_DAYS);
  return date.toISOString().slice(0, 10);
}

export function emptyFormValues(): JobPostFormData {
  return {
    title: '',
    level: 'JUNIOR',
    jobRole: undefined,
    experienceMinYears: undefined,
    experienceMaxYears: undefined,
    contractType: 'FULL_TIME',
    workingArrangement: 'HYBRID',
    city: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
    salaryNegotiable: false,
    salaryMin: undefined,
    salaryMax: undefined,
    currency: 'VND',
    salaryBasis: 'GROSS',
    skills: [],
    description: '',
    requirements: '',
    benefits: '',
    benefitTags: [],
    hiringSteps: [],
    deadline: defaultDeadline(),
    openings: 1,
    screeningQuestions: [],
  };
}

export function toFormValues(job: RecruiterJobResource): JobPostFormData {
  const defaults = emptyFormValues();
  const currency = job.salary.currency ?? defaults.currency;
  return {
    title: job.title,
    level: job.level ?? defaults.level,
    jobRole: job.jobRole,
    experienceMinYears: job.experience?.minYears ?? undefined,
    experienceMaxYears: job.experience?.maxYears ?? undefined,
    contractType: job.contractType ?? defaults.contractType,
    workingArrangement: job.workingArrangement ?? defaults.workingArrangement,
    city: job.location.city ?? '',
    address: job.location.address ?? '',
    latitude: job.location.latitude ?? undefined,
    longitude: job.location.longitude ?? undefined,
    salaryNegotiable: job.salary.negotiable,
    salaryMin: toDisplayAmount(job.salary.min, currency),
    salaryMax: toDisplayAmount(job.salary.max, currency),
    currency,
    salaryBasis: job.salary.basis ?? defaults.salaryBasis,
    skills: job.skills.map((skill) => ({ id: skill.id, name: skill.name })),
    description: job.description ?? '',
    requirements: job.requirements ?? '',
    benefits: job.benefits ?? '',
    benefitTags: job.benefitTags,
    hiringSteps: job.hiringSteps.map((title) => ({ title })),
    deadline: job.deadline ?? defaults.deadline,
    openings: job.openings,
    screeningQuestions: job.screeningQuestions.map((question) => ({
      type: question.type,
      prompt: question.prompt,
      required: question.required,
      options: question.options ?? [],
    })),
  };
}

export function toSaveRequest(values: JobPostFormData): SaveJobRequest {
  const negotiable = values.salaryNegotiable;
  return {
    title: values.title.trim(),
    level: values.level,
    jobRole: values.jobRole,
    experience:
      values.experienceMinYears === undefined && values.experienceMaxYears === undefined
        ? undefined
        : { minYears: values.experienceMinYears, maxYears: values.experienceMaxYears },
    contractType: values.contractType,
    workingArrangement: values.workingArrangement,
    location: {
      city: values.city.trim(),
      address: values.address.trim(),
      latitude: values.latitude,
      longitude: values.longitude,
    },
    salary: {
      negotiable,
      min: negotiable ? undefined : toStoredAmount(values.salaryMin, values.currency),
      max: negotiable ? undefined : toStoredAmount(values.salaryMax, values.currency),
      currency: negotiable ? undefined : values.currency,
      basis: negotiable ? undefined : values.salaryBasis,
    },
    skillIds: values.skills.map((skill) => skill.id),
    description: values.description.trim(),
    requirements: values.requirements.trim(),
    benefits: values.benefits.trim(),
    benefitTags: values.benefitTags,
    hiringSteps: values.hiringSteps.map((step) => step.title.trim()),
    deadline: values.deadline || undefined,
    openings: values.openings,
    screeningQuestions: values.screeningQuestions.map((question) => ({
      type: question.type,
      prompt: question.prompt.trim(),
      required: question.required,
      options: question.type === 'CHOICE' ? question.options : [],
    })),
  };
}

export function summaryToJobPost(summary: RecruiterJobSummaryResource): RecruiterJobPost {
  return {
    boostLevel: summary.boostLevel,
    highlightLabel: summary.highlightLabel,
    id: String(summary.id),
    title: summary.title,
    status: summary.status,
    level: summary.level,
    contractType: summary.contractType,
    workingArrangement: summary.workingArrangement,
    location: { city: summary.city },
    salary: summary.salary,
    skills: [],
    recruitsCount: summary.openings,
    updatedAt: summary.updatedAt,
    expiresAt: summary.deadline,
    publishedAt: summary.publishedAt,
    retoppedAt: summary.retoppedAt,
  };
}

export function resourceToJobPost(job: RecruiterJobResource): RecruiterJobPost {
  return {
    boostLevel: job.boostLevel,
    highlightLabel: job.highlightLabel,
    id: String(job.id),
    title: job.title,
    companyName: job.companyName,
    status: job.status,
    level: job.level,
    contractType: job.contractType,
    workingArrangement: job.workingArrangement,
    location: job.location,
    salary: job.salary,
    skills: job.skills.map((skill) => skill.name),
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    screeningQuestions: job.screeningQuestions,
    recruitsCount: job.openings,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    expiresAt: job.deadline,
    publishedAt: job.publishedAt,
    retoppedAt: job.retoppedAt,
  };
}
