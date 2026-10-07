import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email.').email('Địa chỉ email không đúng định dạng.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.').min(6, 'Mật khẩu phải có tối thiểu 6 ký tự.'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Vui lòng nhập họ và tên của bạn.').min(2, 'Họ và tên tối thiểu 2 ký tự.'),
    email: z.string().min(1, 'Vui lòng nhập email.').email('Địa chỉ email không hợp lệ.'),
    phone: z
      .string()
      .min(1, 'Vui lòng nhập số điện thoại.')
      .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không đúng định dạng.'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu.').min(6, 'Mật khẩu phải có tối thiểu 6 ký tự.'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận lại mật khẩu.'),
    agreedTerms: z.boolean().refine((val) => val === true, {
      message: 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập địa chỉ email.').email('Địa chỉ email không đúng định dạng.'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại.'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự.')
      .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ in hoa.')
      .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số.')
      .regex(/[^A-Za-z0-9]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$).'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới.'),
    logoutOtherDevices: z.boolean().default(true),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp với mật khẩu mới.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
    path: ['newPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
