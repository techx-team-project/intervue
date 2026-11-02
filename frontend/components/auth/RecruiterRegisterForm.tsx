'use client';

import { authApi } from '@/apiRequest/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Building2, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import FormErrorAlert from './FormErrorAlert';

const POPULAR_CITIES = [
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Khác', label: 'Tỉnh / Thành phố khác' },
];

const recruiterRegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự.')
      .max(50, 'Họ và tên không vượt quá 50 ký tự.'),
    phone: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || /^[0-9+() -]{9,15}$/.test(val), {
        message: 'Số điện thoại không hợp lệ (9-15 chữ số).',
      }),
    email: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập email doanh nghiệp.')
      .max(100, 'Email không vượt quá 100 ký tự.')
      .pipe(z.email('Email không đúng định dạng.')),
    password: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
      .max(72, 'Mật khẩu không vượt quá 72 ký tự.')
      .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường.')
      .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái hoa.')
      .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số.')
      .regex(/[^A-Za-z0-9]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$...).'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu.'),
    companyName: z
      .string()
      .trim()
      .min(2, 'Vui lòng nhập tên công ty / doanh nghiệp.')
      .max(100, 'Tên công ty không được vượt quá 100 ký tự.'),
    city: z.string().min(1, 'Vui lòng chọn địa điểm làm việc / tỉnh thành.'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Vui lòng đồng ý với Điều khoản dịch vụ Doanh nghiệp.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.password.toLowerCase() !== data.email.toLowerCase(), {
    message: 'Mật khẩu không được trùng với email.',
    path: ['password'],
  });

type RecruiterRegisterFormData = z.infer<typeof recruiterRegisterSchema>;

function getPasswordStrength(password: string) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  if (score <= 2) {
    return {
      label: 'Yếu',
      color: 'text-rose-600',
      bar: 'bg-rose-500',
      width: '25%',
    };
  }
  if (score === 3) {
    return {
      label: 'Trung bình',
      color: 'text-orange-600',
      bar: 'bg-orange-500',
      width: '50%',
    };
  }
  if (score === 4) {
    return {
      label: 'Khá',
      color: 'text-amber-600',
      bar: 'bg-amber-500',
      width: '75%',
    };
  }
  return {
    label: 'Mạnh',
    color: 'text-primary',
    bar: 'bg-primary',
    width: '100%',
  };
}

export default function RecruiterRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<RecruiterRegisterFormData>({
    resolver: zodResolver(recruiterRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      city: '',
      acceptTerms: false,
    },
  });

  const password = useWatch({ control, name: 'password' }) || '';
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            'intervue_recruiter_onboarding',
            JSON.stringify({
              name: values.name,
              phone: values.phone || '',
              companyName: values.companyName,
              city: values.city,
              email: values.email,
            }),
          );
        } catch {
          // Ignore localStorage errors in private browsing
        }
      }

      await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        acceptTerms: values.acceptTerms,
      });

      setRegisteredEmail(values.email);
    } catch (error: unknown) {
      applyFormError(error, setError, ['name', 'email', 'password', 'confirmPassword', 'acceptTerms']);
    } finally {
      setIsLoading(false);
    }
  });

  if (registeredEmail) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary shadow-inner">
          <Mail className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-navy text-xl font-bold">Xác thực Email Doanh nghiệp</h3>
          <p className="text-sm leading-relaxed text-[#4d5965]">
            Chúng tôi đã gửi link xác thực đến <strong className="text-navy font-semibold">{registeredEmail}</strong>.
            Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam) và nhấn vào liên kết xác thực để hoàn tất kích hoạt tài
            khoản Nhà tuyển dụng.
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary-light p-4 text-left text-xs text-[#263a4d]">
          <div className="text-primary flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Đặc quyền Doanh nghiệp sau khi xác thực:</span>
          </div>
          <ul className="mt-2.5 list-inside list-disc space-y-1.5 font-medium text-[#4d5965]">
            <li>Đăng 03 tin IT miễn phí</li>
            <li>AI Sàng lọc CV theo chuẩn STAR</li>
            <li>Quản lý ATS chuyên nghiệp</li>
          </ul>
        </div>

        <Link
          href={ROUTES.RECRUITER_LOGIN}
          className="bg-primary hover:bg-primary-hover shadow-primary/20 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition"
        >
          <span>Đến trang Đăng nhập NTD</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Contact info group */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#f4f5f5] pb-1.5">
            <User className="text-primary h-4 w-4" />
            <span className="text-navy text-xs font-bold uppercase tracking-wider">Thông tin người liên hệ</span>
          </div>

          <Input
            label="Họ và tên người liên hệ / HR"
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Số điện thoại liên hệ"
            type="tel"
            placeholder="Ví dụ: 0912 345 678"
            autoComplete="tel"
            helperText="Dùng để liên hệ hỗ trợ kích hoạt tin tuyển dụng"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* Business info group */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#f4f5f5] pb-1.5">
            <Building2 className="text-primary h-4 w-4" />
            <span className="text-navy text-xs font-bold uppercase tracking-wider">Thông tin doanh nghiệp</span>
          </div>

          <Input
            label="Tên công ty / Doanh nghiệp"
            type="text"
            placeholder="Ví dụ: Công ty Cổ phần Công nghệ ABC"
            error={errors.companyName?.message}
            {...register('companyName')}
          />

          <Select
            label="Địa điểm làm việc / Tỉnh thành"
            placeholder="-- Chọn Tỉnh / Thành phố --"
            options={POPULAR_CITIES}
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        {/* Account info group */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#f4f5f5] pb-1.5">
            <Lock className="text-primary h-4 w-4" />
            <span className="text-navy text-xs font-bold uppercase tracking-wider">Thông tin tài khoản</span>
          </div>

          <Input
            label="Email Doanh nghiệp"
            type="email"
            placeholder="hr@congty.com"
            autoComplete="email"
            helperText="Khuyến khích sử dụng email tên miền công ty để được ưu tiên duyệt"
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <PasswordInput
              label="Mật khẩu"
              placeholder="Tối thiểu 8 ký tự, gồm hoa, thường, số & ký tự đặc biệt"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {password && (
              <div className="mt-2 space-y-1.5" aria-live="polite">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6f7882]">Độ mạnh mật khẩu:</span>
                  <span className={`font-semibold ${passwordStrength.color}`}>{passwordStrength.label}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4f5f5]">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.bar}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          <PasswordInput
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {/* Terms agreement */}
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-[#4d5965] select-none">
            <input
              type="checkbox"
              className="text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded border-[#e9eaec]"
              {...register('acceptTerms')}
            />
            <span>
              Tôi cam kết là đại diện tuyển dụng hợp pháp và đồng ý với{' '}
              <span className="text-primary font-semibold hover:underline">Điều khoản dịch vụ Doanh nghiệp</span> &{' '}
              <span className="text-primary font-semibold hover:underline">Chính sách bảo mật</span> của InterVue.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-xs font-medium text-rose-500">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-primary hover:bg-primary-hover shadow-primary/20 mt-2 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Đăng ký tài khoản Doanh nghiệp
        </Button>
      </form>

      {/* Switch to Recruiter Login */}
      <div className="mt-5 border-t border-[#f4f5f5] pt-4 text-center text-sm text-[#6f7882]">
        <span>Đã có tài khoản Doanh nghiệp? </span>
        <Link href={ROUTES.RECRUITER_LOGIN} className="text-primary hover:text-primary-hover font-bold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>

      {/* Switch to Candidate Register */}
      <div className="mt-3 rounded-xl border border-[#e9eaec] bg-[#f8fafc] p-3 text-center text-xs text-[#6f7882]">
        <span>Bạn là người tìm việc? </span>
        <Link href={ROUTES.REGISTER} className="text-navy hover:text-primary font-bold hover:underline">
          Đăng ký tài khoản Ứng viên tại đây
        </Link>
      </div>
    </div>
  );
}
