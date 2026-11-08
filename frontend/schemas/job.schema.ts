import { z } from 'zod';

export const jobLevelSchema = z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']);
export const contractTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP']);
export const workingArrangementSchema = z.enum(['ON_SITE', 'HYBRID', 'REMOTE', 'FLEXIBLE']);
export const salaryCurrencySchema = z.enum(['VND', 'USD']);

export const screeningQuestionTypeSchema = z.enum(['CHOICE', 'SHORT_TEXT']);

export const SCREENING_MAX_QUESTIONS = 5;
export const SCREENING_MIN_OPTIONS = 2;
export const SCREENING_MAX_OPTIONS = 6;

export const screeningQuestionSchema = z
  .object({
    type: screeningQuestionTypeSchema,
    prompt: z.string().trim().min(1, 'Nhập nội dung câu hỏi.').max(300, 'Tối đa 300 ký tự.'),
    required: z.boolean(),
    options: z.array(z.string().trim().min(1).max(100, 'Mỗi lựa chọn tối đa 100 ký tự.')),
  })
  .superRefine((question, ctx) => {
    if (question.type !== 'CHOICE') return;
    const distinct = new Set(question.options.map((option) => option.toLowerCase()));
    if (
      question.options.length < SCREENING_MIN_OPTIONS ||
      question.options.length > SCREENING_MAX_OPTIONS ||
      distinct.size !== question.options.length
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: `Cần ${SCREENING_MIN_OPTIONS}-${SCREENING_MAX_OPTIONS} lựa chọn khác nhau.`,
      });
    }
  });

export const skillOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const jobPostSchema = z
  .object({
    title: z.string().trim().min(5, 'Tiêu đề cần ít nhất 5 ký tự.').max(150, 'Tiêu đề tối đa 150 ký tự.'),
    level: jobLevelSchema,
    contractType: contractTypeSchema,
    workingArrangement: workingArrangementSchema,
    city: z.string().trim().min(1, 'Vui lòng nhập nơi làm việc.').max(100, 'Tối đa 100 ký tự.'),
    address: z.string().trim().max(500, 'Tối đa 500 ký tự.'),
    salaryNegotiable: z.boolean(),
    salaryMin: z.number().positive('Nhập số lớn hơn 0.').optional(),
    salaryMax: z.number().positive('Nhập số lớn hơn 0.').optional(),
    currency: salaryCurrencySchema,
    skills: z.array(skillOptionSchema).min(1, 'Chọn ít nhất 1 kỹ năng.').max(20, 'Tối đa 20 kỹ năng.'),
    description: z.string().trim().min(50, 'Mô tả cần ít nhất 50 ký tự.'),
    requirements: z.string().trim().min(20, 'Yêu cầu cần ít nhất 20 ký tự.'),
    benefits: z.string().trim(),
    deadline: z.string().min(1, 'Chọn hạn nộp hồ sơ.'),
    screeningQuestions: z.array(screeningQuestionSchema).max(SCREENING_MAX_QUESTIONS),
    openings: z.number().int('Nhập số nguyên.').min(1, 'Tối thiểu 1 vị trí.').max(1000, 'Tối đa 1000 vị trí.'),
  })
  .refine((data) => data.salaryNegotiable || (data.salaryMin !== undefined && data.salaryMax !== undefined), {
    message: 'Nhập khoảng lương hoặc chọn Thỏa thuận.',
    path: ['salaryMax'],
  })
  .refine(
    (data) =>
      data.salaryNegotiable ||
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: 'Lương tối thiểu không được lớn hơn tối đa.',
      path: ['salaryMin'],
    },
  );

export type JobPostFormData = z.infer<typeof jobPostSchema>;
export type ScreeningQuestionFormData = z.infer<typeof screeningQuestionSchema>;
export type SkillOption = z.infer<typeof skillOptionSchema>;
