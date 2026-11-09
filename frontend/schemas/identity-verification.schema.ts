import { z } from 'zod';

export const IDENTITY_MIN_AGE = 16;
export const IDENTITY_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const IDENTITY_ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

function latestBirthDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - IDENTITY_MIN_AGE);
  return date.toISOString().slice(0, 10);
}

export const identityDocumentSchema = z
  .instanceof(File, { message: 'Vui lòng chọn ảnh.' })
  .refine((file) => IDENTITY_ACCEPTED_TYPES.includes(file.type), 'Chỉ nhận ảnh JPG hoặc PNG.')
  .refine((file) => file.size <= IDENTITY_MAX_FILE_BYTES, 'Ảnh tối đa 5MB.');

export const identityVerificationSchema = z.object({
  fullName: z.string().trim().min(2, 'Nhập họ và tên trên giấy tờ.').max(120, 'Tối đa 120 ký tự.'),
  idNumber: z
    .string()
    .trim()
    .regex(/^(\d{9}|\d{12})$/, 'Số CCCD gồm 12 chữ số (hoặc CMND 9 số).'),
  dateOfBirth: z
    .string()
    .min(1, 'Chọn ngày sinh.')
    .refine((value) => value <= latestBirthDate(), `Bạn cần từ ${IDENTITY_MIN_AGE} tuổi trở lên.`),
  front: identityDocumentSchema,
  back: identityDocumentSchema,
  selfie: identityDocumentSchema,
});

export type IdentityVerificationFormValues = z.infer<typeof identityVerificationSchema>;

export const identityMaxBirthDate = latestBirthDate;
