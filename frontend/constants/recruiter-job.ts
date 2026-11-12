import type {
  ContractType,
  JobBenefitTag,
  JobHistoryAction,
  JobLevel,
  JobRole,
  JobStatus,
  SalaryBasis,
  RecruiterJobSegment,
  RecruiterJobSort,
  SkillGroup,
  WorkingArrangement,
} from '@/types/recruiter-job';
import { VN_LOCATIONS } from '@/constants/vn-locations';

export const JOB_PAGE_SIZE = 8;

export const JOB_SEGMENT_META: Record<RecruiterJobSegment, { label: string; status?: JobStatus }> = {
  all: { label: 'Tất cả' },
  published: { label: 'Đang tuyển', status: 'PUBLISHED' },
  paused: { label: 'Tạm dừng', status: 'PAUSED' },
  expired: { label: 'Hết hạn', status: 'EXPIRED' },
  draft: { label: 'Bản nháp', status: 'DRAFT' },
  closed: { label: 'Đã đóng', status: 'CLOSED' },
};

export const JOB_SORT_OPTIONS: Array<{ value: RecruiterJobSort; label: string; param: string }> = [
  { value: 'newest', label: 'Mới cập nhật', param: 'updatedAt,desc' },
  { value: 'expiringSoon', label: 'Sắp hết hạn', param: 'deadline,asc' },
  { value: 'highestSalary', label: 'Lương cao nhất', param: 'salaryMax,desc' },
];

export const JOB_LEVEL_LABELS: Record<JobLevel, string> = {
  INTERN: 'Intern',
  JUNIOR: 'Junior',
  MID: 'Middle',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

export const JOB_ROLE_LABELS: Record<JobRole, string> = {
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
  FULLSTACK: 'Fullstack',
  MOBILE: 'Mobile',
  DEVOPS: 'DevOps / Cloud',
  QA: 'QA / Tester',
  DATA_AI: 'Data / AI',
  BA: 'Business Analyst',
  PM: 'Project / Product',
  UIUX: 'UI/UX Design',
  SECURITY: 'Security',
  OTHER: 'Other',
};

export const JOB_BENEFIT_TAG_LABELS: Record<JobBenefitTag, string> = {
  HEALTH_INSURANCE: 'Health insurance',
  BONUS_13TH_MONTH: '13th-month salary',
  PERFORMANCE_BONUS: 'Performance bonus',
  LAPTOP: 'Laptop & equipment',
  TRAINING: 'Training & certifications',
  TEAM_BUILDING: 'Team building & trips',
  FLEXIBLE_HOURS: 'Flexible hours',
  REMOTE_DAYS: 'Remote days',
  ANNUAL_LEAVE: 'Annual leave',
  MEALS: 'Meals & allowance',
};

export const JOB_ARRANGEMENT_LABELS: Record<WorkingArrangement, string> = {
  ON_SITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
  FLEXIBLE: 'Flexible',
};

export const JOB_CONTRACT_LABELS: Record<ContractType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship',
};

export function getJobExpiryDetails(expiresAt?: string, status?: JobStatus) {
  if (!expiresAt || status === 'DRAFT') {
    return {
      daysLeft: null,
      isExpired: false,
      label: 'Chưa đặt hạn',
      tone: 'muted' as const,
      progressPercent: 0,
    };
  }

  const now = Date.now();
  const target = new Date(expiresAt).getTime();
  const diffMs = target - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0 || status === 'EXPIRED') {
    return {
      daysLeft: 0,
      isExpired: true,
      label: 'Đã hết hạn',
      tone: 'danger' as const,
      progressPercent: 100,
    };
  }

  const progressPercent = Math.min(100, Math.max(0, Math.round(((30 - Math.min(30, daysLeft)) / 30) * 100)));

  if (daysLeft <= 7) {
    return {
      daysLeft,
      isExpired: false,
      label: `Còn ${daysLeft} ngày`,
      tone: 'warning' as const,
      progressPercent,
    };
  }

  return {
    daysLeft,
    isExpired: false,
    label: `Còn ${daysLeft} ngày`,
    tone: 'normal' as const,
    progressPercent,
  };
}

export const JOB_FORM_LEVEL_OPTIONS: Array<{ value: JobLevel; label: string }> = [
  { value: 'INTERN', label: 'Thực tập sinh' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead / Principal' },
];

export const JOB_FORM_CONTRACT_OPTIONS: Array<{ value: ContractType; label: string }> = [
  { value: 'FULL_TIME', label: 'Toàn thời gian' },
  { value: 'PART_TIME', label: 'Bán thời gian' },
  { value: 'INTERNSHIP', label: 'Thực tập' },
];

export const JOB_FORM_ARRANGEMENT_OPTIONS: Array<{ value: WorkingArrangement; label: string }> = [
  { value: 'ON_SITE', label: 'Tại văn phòng' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: 'Từ xa' },
  { value: 'FLEXIBLE', label: 'Linh hoạt' },
];

export const JOB_FORM_ROLE_OPTIONS: Array<{ value: JobRole; label: string }> = (
  Object.entries(JOB_ROLE_LABELS) as Array<[JobRole, string]>
).map(([value, label]) => ({ value, label: value === 'OTHER' ? 'Khác' : label }));

export const JOB_FORM_SALARY_BASIS_OPTIONS: Array<{ value: SalaryBasis; label: string }> = [
  { value: 'GROSS', label: 'Gross (trước thuế)' },
  { value: 'NET', label: 'Net (sau thuế)' },
];

export const JOB_FORM_BENEFIT_OPTIONS: Array<{ value: JobBenefitTag; label: string }> = [
  { value: 'HEALTH_INSURANCE', label: 'Bảo hiểm sức khỏe' },
  { value: 'BONUS_13TH_MONTH', label: 'Thưởng tháng 13' },
  { value: 'PERFORMANCE_BONUS', label: 'Thưởng hiệu suất' },
  { value: 'LAPTOP', label: 'Laptop / thiết bị' },
  { value: 'TRAINING', label: 'Đào tạo & chứng chỉ' },
  { value: 'TEAM_BUILDING', label: 'Team building / du lịch' },
  { value: 'FLEXIBLE_HOURS', label: 'Giờ làm linh hoạt' },
  { value: 'REMOTE_DAYS', label: 'Làm từ xa một số ngày' },
  { value: 'ANNUAL_LEAVE', label: 'Phép năm' },
  { value: 'MEALS', label: 'Phụ cấp ăn' },
];

export const JOB_HISTORY_ACTION_LABELS: Record<JobHistoryAction, string> = {
  JOB_CREATED: 'Tạo tin',
  JOB_UPDATED: 'Chỉnh sửa tin',
  JOB_PUBLISHED: 'Đăng tin',
  JOB_PAUSED: 'Tạm dừng tin',
  JOB_RESUMED: 'Mở lại tin',
  JOB_CLOSED: 'Đóng tin',
  JOB_RENEWED: 'Gia hạn và đăng lại',
  JOB_RETOPPED: 'Đẩy top tin',
  JOB_HIDDEN: 'Bị quản trị viên ẩn',
  JOB_RESTORED: 'Được quản trị viên khôi phục',
};

export const JOB_FIELD_LABELS: Record<string, string> = {
  title: 'Tiêu đề',
  level: 'Cấp bậc',
  jobRole: 'Nhóm vị trí',
  experience: 'Kinh nghiệm',
  contractType: 'Loại hợp đồng',
  workingArrangement: 'Hình thức làm việc',
  location: 'Địa điểm',
  salary: 'Mức lương',
  skills: 'Kỹ năng',
  description: 'Mô tả',
  requirements: 'Yêu cầu',
  benefits: 'Phúc lợi',
  benefitTags: 'Thẻ phúc lợi',
  hiringSteps: 'Quy trình tuyển dụng',
  screeningQuestions: 'Câu hỏi sàng lọc',
  deadline: 'Hạn nộp',
  openings: 'Số lượng tuyển',
};

export const JOB_FORM_CURRENCY_OPTIONS = [
  { value: 'VND', label: 'triệu VND' },
  { value: 'USD', label: 'USD' },
];

export const JOB_CITY_SUGGESTIONS = VN_LOCATIONS;

export const SKILL_GROUP_LABELS: Record<SkillGroup, string> = {
  CORE: 'Cốt lõi',
  AI_DATA: 'AI & Dữ liệu',
  TOOLS_DEVOPS: 'Công cụ & DevOps',
  SOFT_SKILLS: 'Kỹ năng mềm',
};

export const JOB_MAX_SKILLS = 20;
