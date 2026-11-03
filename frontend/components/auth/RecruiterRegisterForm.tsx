'use client';

import { authApi } from '@/apiRequest/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  Mail,
  Phone,
  PhoneCall,
  ShieldCheck,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
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
  { value: 'Bắc Ninh', label: 'Bắc Ninh' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Khác', label: 'Tỉnh / Thành phố khác' },
];

const recruiterRegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự).')
      .max(50, 'Họ và tên không được vượt quá 50 ký tự.'),
    gender: z.enum(['MALE', 'FEMALE'], {
      error: 'Vui lòng chọn giới tính.',
    }),
    phone: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập số điện thoại cá nhân.')
      .refine((val) => /^[0-9+() -]{9,15}$/.test(val), {
        message: 'Số điện thoại không hợp lệ (9-15 chữ số).',
      }),
    email: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập email đăng nhập.')
      .max(100, 'Email không được vượt quá 100 ký tự.')
      .pipe(z.email('Email không đúng định dạng.')),
    password: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
      .max(72, 'Mật khẩu không được vượt quá 72 ký tự.')
      .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường.')
      .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái hoa.')
      .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số.')
      .regex(/[^A-Za-z0-9]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$...).'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu.'),
    companyName: z
      .string()
      .trim()
      .min(2, 'Vui lòng nhập tên công ty.')
      .max(100, 'Tên công ty không được vượt quá 100 ký tự.'),
    city: z.string().min(1, 'Vui lòng chọn địa điểm làm việc.'),
    districtWard: z.string().trim().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư.',
    }),
    acceptMarketing: z.boolean().optional(),
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
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);
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
      gender: 'MALE',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      city: '',
      districtWard: '',
      acceptTerms: false,
      acceptMarketing: true,
    },
  });

  const password = useWatch({ control, name: 'password' }) || '';
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        acceptTerms: values.acceptTerms,
      });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            'intervue_recruiter_onboarding',
            JSON.stringify({
              name: values.name,
              gender: values.gender,
              phone: values.phone,
              companyName: values.companyName,
              city: values.city,
              districtWard: values.districtWard || '',
              email: values.email,
              acceptMarketing: values.acceptMarketing ?? true,
            }),
          );
        } catch {
          // Local storage write may fail in strict private browsing environments
        }
      }

      setRegisteredEmail(values.email);
    } catch (error: unknown) {
      applyFormError(error, setError, [
        'name',
        'email',
        'password',
        'confirmPassword',
        'acceptTerms',
        'companyName',
        'phone',
        'city',
      ]);
    } finally {
      setIsLoading(false);
    }
  });

  if (registeredEmail) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="bg-primary-light text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner">
          <Mail className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-navy text-2xl font-bold">Xác thực Email Doanh nghiệp</h2>
          <p className="text-sm leading-relaxed text-[#4d5965]">
            Chúng tôi đã gửi link xác thực đến <strong className="text-navy font-semibold">{registeredEmail}</strong>.
            Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam) và nhấn vào liên kết xác thực để hoàn tất kích hoạt tài
            khoản Nhà tuyển dụng.
          </p>
        </div>

        <div className="border-primary/20 bg-primary-light rounded-xl border p-4 text-left text-xs text-[#263a4d]">
          <div className="text-primary flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Đặc quyền Doanh nghiệp sau khi xác thực:</span>
          </div>
          <ul className="mt-2.5 list-inside list-disc space-y-1.5 font-medium text-[#4d5965]">
            <li>Đăng 03 tin IT tuyển dụng miễn phí</li>
            <li>AI Sàng lọc CV ứng viên theo chuẩn STAR</li>
            <li>Quản lý ATS chuyên nghiệp & Báo cáo Hiring Funnel</li>
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
      <div className="mb-6 sm:mb-8">
        <Link href={ROUTES.RECRUITER_LANDING} aria-label="Về trang chủ Tuyển dụng" className="inline-block">
          <Image
            src="/intervue-logo.png"
            alt="InterVue"
            width={160}
            height={46}
            priority
            className="h-10 w-auto object-contain sm:h-11"
          />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl xl:text-[32px]">
          Đăng ký tài khoản Nhà tuyển dụng
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel.
        </p>
      </div>

      <div className="mb-7 rounded-xl border border-emerald-300/90 bg-[#f0fdf4] p-5 text-sm shadow-xs transition-all sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 sm:text-base">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#00b14f]" />
            <span>Quy định</span>
          </div>
          <button
            type="button"
            aria-label="Thu gọn hoặc mở rộng quy định"
            aria-expanded={isNoticeOpen}
            aria-controls="recruiter-rules-box"
            onClick={() => setIsNoticeOpen((prev) => !prev)}
            className="cursor-pointer rounded-md p-1.5 text-slate-500 transition hover:bg-emerald-100 hover:text-slate-800"
          >
            {isNoticeOpen ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
          </button>
        </div>

        {isNoticeOpen && (
          <div
            id="recruiter-rules-box"
            className="mt-3.5 space-y-2.5 border-t border-emerald-200/80 pt-3.5 text-slate-700"
          >
            <p className="text-sm leading-relaxed font-semibold text-rose-600 sm:text-[14.5px]">
              • Để đảm bảo chất lượng dịch vụ, InterVue không cho phép một người dùng tạo nhiều tài khoản khác nhau.
            </p>
            <p className="text-sm leading-relaxed sm:text-[14px]">
              Nếu phát hiện vi phạm, InterVue sẽ ngừng cung cấp dịch vụ tới tất cả các tài khoản trùng lặp hoặc chặn
              toàn bộ quyền truy cập.
            </p>
            <p className="text-sm leading-relaxed sm:text-[14px]">
              Mỗi tài khoản được đăng tối đa số tin tuyển dụng cơ bản theo quy định sau khi xác thực thông tin tài khoản
              thành công.
            </p>
            <div className="flex items-center gap-2 pt-2 text-sm font-medium text-slate-800 sm:text-base">
              <PhoneCall className="h-4 w-4 shrink-0 text-[#00b14f]" />
              <span>Hotline CSKH: </span>
              <a href="tel:0812665001" className="text-base font-bold text-[#00b14f] hover:underline sm:text-lg">
                0812.665.001
              </a>
            </div>
          </div>
        )}
      </div>

      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Tài khoản</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-[14.5px]">
            Để cung cấp dịch vụ cho bạn, chúng tôi cần xử lý một số dữ liệu cá nhân theo quy định tại Chính sách quyền
            riêng tư và Điều khoản dịch vụ. Vui lòng lựa chọn các mục đích mà bạn đồng ý dưới đây:
          </p>

          <div className="mt-4 space-y-3.5">
            <div>
              <label
                htmlFor="acceptTerms"
                className="flex cursor-pointer items-start gap-3 text-sm text-slate-700 select-none sm:text-[14.5px]"
              >
                <input
                  id="acceptTerms"
                  type="checkbox"
                  className="mt-0.5 h-4.5 w-4.5 cursor-pointer rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                  {...register('acceptTerms')}
                />
                <span>
                  Tôi đã đọc và đồng ý với{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[#00b14f] hover:underline"
                  >
                    Điều khoản dịch vụ
                  </Link>{' '}
                  và{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[#00b14f] hover:underline"
                  >
                    Chính sách Quyền riêng tư
                  </Link>{' '}
                  của InterVue.
                </span>
              </label>
              <p className="mt-1.5 ml-7 text-xs font-medium text-rose-600 sm:text-[13px]">
                * Chúng tôi không thể cung cấp dịch vụ nếu không nhận được sự đồng ý ở mục này.
              </p>
              {errors.acceptTerms && (
                <p className="mt-1 ml-7 text-xs font-medium text-rose-500 sm:text-[13px]">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="acceptMarketing"
                className="flex cursor-pointer items-start gap-3 text-sm text-slate-700 select-none sm:text-[14.5px]"
              >
                <input
                  id="acceptMarketing"
                  type="checkbox"
                  className="mt-0.5 h-4.5 w-4.5 cursor-pointer rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                  {...register('acceptMarketing')}
                />
                <span>
                  Tôi đồng ý nhận thông tin tư vấn của InterVue để được hỗ trợ đăng tin nhanh, cách tối ưu hiệu quả tin
                  đăng, các thông báo quan trọng về tin đăng, CV ứng tuyển và các giải pháp/chương trình tuyển dụng phù
                  hợp.
                </span>
              </label>
              <p className="mt-1.5 ml-7 text-xs font-medium text-[#00b14f] sm:text-[13px]">
                * Khuyên dùng: Nếu không có sự đồng ý, chuyên viên sẽ không thể liên hệ để hỗ trợ Quý khách xác thực tài
                khoản nhanh chóng & đăng tin kịp thời.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                toast.info('Tính năng Đăng ký bằng Google đang được phát triển.');
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#4285F4] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3367d6] hover:shadow active:scale-[0.99] sm:text-base"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-0.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </span>
              <span>Đăng ký bằng Google</span>
            </button>
          </div>

          <div className="relative my-7 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase sm:text-sm">
              Hoặc bằng email
            </span>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Input
                id="email"
                label="Email đăng nhập *"
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="py-3 text-sm sm:text-base"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
              />
              <p className="mt-1.5 text-xs leading-relaxed text-rose-600 sm:text-[13px]">
                * Trường hợp bạn đăng ký tài khoản bằng email không phải email tên miền công ty, một số dịch vụ trên tài
                khoản có thể sẽ bị giới hạn quyền mua hoặc sử dụng.
              </p>
            </div>

            <div>
              <PasswordInput
                id="password"
                label="Mật khẩu *"
                placeholder="Mật khẩu"
                autoComplete="new-password"
                className="py-3 text-sm sm:text-base"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
              />
              {password && (
                <div className="mt-2 space-y-1.5" aria-live="polite">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                    <span className={`font-semibold ${passwordStrength.color}`}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.bar}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <PasswordInput
              id="confirmPassword"
              label="Nhập lại mật khẩu *"
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              className="py-3 text-sm sm:text-base"
              leftIcon={<Lock className="h-5 w-5" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Thông tin nhà tuyển dụng</h2>

          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <Input
                  id="name"
                  label="Họ và tên *"
                  type="text"
                  placeholder="Họ và tên"
                  autoComplete="name"
                  className="py-3 text-sm sm:text-base"
                  leftIcon={<User className="h-5 w-5" />}
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>

              <div className="md:col-span-4">
                <span id="gender-label" className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Giới tính: *
                </span>
                <div role="radiogroup" aria-labelledby="gender-label" className="flex h-11 items-center gap-6">
                  <label
                    htmlFor="gender-male"
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 sm:text-base"
                  >
                    <input
                      id="gender-male"
                      type="radio"
                      value="MALE"
                      {...register('gender')}
                      className="h-4.5 w-4.5 cursor-pointer text-[#00b14f] focus:ring-[#00b14f]"
                    />
                    <span>Nam</span>
                  </label>
                  <label
                    htmlFor="gender-female"
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 sm:text-base"
                  >
                    <input
                      id="gender-female"
                      type="radio"
                      value="FEMALE"
                      {...register('gender')}
                      className="h-4.5 w-4.5 cursor-pointer text-[#00b14f] focus:ring-[#00b14f]"
                    />
                    <span>Nữ</span>
                  </label>
                </div>
                {errors.gender && <p className="mt-1 text-xs font-medium text-rose-500">{errors.gender.message}</p>}
              </div>
            </div>

            <Input
              id="phone"
              label="Số điện thoại cá nhân *"
              type="tel"
              placeholder="Số điện thoại cá nhân"
              autoComplete="tel"
              className="py-3 text-sm sm:text-base"
              leftIcon={<Phone className="h-5 w-5" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              id="companyName"
              label="Công ty *"
              type="text"
              placeholder="Tên công ty"
              className="py-3 text-sm sm:text-base"
              leftIcon={<Building2 className="h-5 w-5" />}
              error={errors.companyName?.message}
              {...register('companyName')}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                id="city"
                label="Địa điểm làm việc *"
                placeholder="-- Chọn Tỉnh / Thành phố --"
                options={POPULAR_CITIES}
                className="py-3 text-sm sm:text-base"
                error={errors.city?.message}
                {...register('city')}
              />

              <Input
                id="districtWard"
                label="Phường/ xã"
                type="text"
                placeholder="Quận/Huyện, Phường/Xã"
                className="py-3 text-sm sm:text-base"
                error={errors.districtWard?.message}
                {...register('districtWard')}
              />
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
          Bằng việc nhấn nút Đăng ký, bạn đã đồng ý với{' '}
          <Link href="/terms" className="font-semibold text-[#00b14f] hover:underline">
            Điều khoản dịch vụ
          </Link>{' '}
          và{' '}
          <Link href="/terms" className="font-semibold text-[#00b14f] hover:underline">
            Chính sách quyền riêng tư
          </Link>{' '}
          của InterVue.
        </p>

        <Button
          type="submit"
          isLoading={isLoading}
          className="mt-5 w-full rounded-lg bg-[#00b14f] py-3.5 text-base font-bold text-white shadow-md shadow-[#00b14f]/25 transition hover:bg-[#009b45] sm:py-4 sm:text-lg"
        >
          Đăng ký
        </Button>
      </form>

      <div className="mt-6 text-center text-sm font-medium text-slate-600 sm:text-base">
        <span>Bạn đã có tài khoản? </span>
        <Link href={ROUTES.RECRUITER_LOGIN} className="font-bold text-[#00b14f] hover:underline">
          Đăng nhập ngay
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-[#f8fafc] p-3.5 text-center text-xs text-slate-600 sm:p-4 sm:text-sm">
        <span>Bạn là người tìm việc? </span>
        <Link href={ROUTES.REGISTER} className="font-bold text-slate-900 hover:text-[#00b14f] hover:underline">
          Đăng ký tài khoản Ứng viên tại đây
        </Link>
      </div>
    </div>
  );
}
