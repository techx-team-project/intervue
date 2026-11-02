'use client';

import { authApi } from '@/apiRequest/auth';
import { renewSession } from '@/apiRequest/http';
import { userApi } from '@/apiRequest/user';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import PasswordInput from '@/components/ui/PasswordInput';
import { ROLES } from '@/constants/auth';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { isApiError } from '@/lib/api-error';
import { LoginFormData, loginSchema } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { applyFormError, getErrorMessage } from '@/utils/error';
import { sanitizeRedirect } from '@/utils/redirect';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormErrorAlert from './FormErrorAlert';

export default function RecruiterLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      // Step 1: Login and update auth session
      const session = await authApi.login(values);
      useAuthStore.getState().setSession(session);

      const targetRedirect = searchParams?.get(REDIRECT_PARAM);

      // Step 2: Role check
      if (session.user.roles.includes(ROLES.RECRUITER)) {
        toast.success('Đăng nhập Cổng Doanh nghiệp thành công!');
        router.replace(sanitizeRedirect(targetRedirect, ROUTES.RECRUITER_DASHBOARD));
        return;
      }

      // Candidate login into Recruiter portal -> confirm role activation
      setShowRoleModal(true);
    } catch (error: unknown) {
      applyFormError(error, setError, ['email', 'password']);
    } finally {
      setIsLoading(false);
    }
  });

  const handleActivateRecruiter = async () => {
    setIsActivating(true);
    try {
      await userApi.becomeRecruiter();
      await renewSession();
      toast.success('Kích hoạt vai trò Nhà tuyển dụng thành công!');
      setShowRoleModal(false);
      const targetRedirect = searchParams?.get(REDIRECT_PARAM);
      router.replace(sanitizeRedirect(targetRedirect, ROUTES.RECRUITER_DASHBOARD));
    } catch (err: unknown) {
      if (isApiError(err) && err.code === 'EMAIL_NOT_VERIFIED') {
        toast.warning(
          'Tài khoản chưa được xác thực email. Vui lòng xác thực email trước khi kích hoạt vai trò Nhà tuyển dụng.',
        );
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setIsActivating(false);
    }
  };

  const handleCancelRoleModal = () => {
    if (isActivating) return;
    setShowRoleModal(false);
    router.replace(ROUTES.HOME);
  };

  return (
    <div className="w-full">
      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Email Doanh nghiệp"
          type="email"
          placeholder="hr@congty.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Mật khẩu"
          id="recruiter-login-password"
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#4d5965] select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="text-primary focus:ring-primary h-4 w-4 rounded border-[#e9eaec]"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-primary hover:text-primary-hover text-xs font-bold transition hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-primary hover:bg-primary-hover shadow-primary/20 mt-3 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Đăng nhập Cổng Doanh nghiệp
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="mt-5 border-t border-[#f4f5f5] pt-4 text-center text-sm text-[#6f7882]">
        <span>Doanh nghiệp chưa có tài khoản? </span>
        <Link href={ROUTES.RECRUITER_REGISTER} className="text-primary hover:text-primary-hover font-bold hover:underline">
          Đăng ký ngay
        </Link>
      </div>

      {/* Switch to Candidate Login */}
      <div className="mt-3 rounded-xl border border-[#e9eaec] bg-[#f8fafc] p-3 text-center text-xs text-[#6f7882]">
        <span>Bạn là người tìm việc? </span>
        <Link href={ROUTES.LOGIN} className="text-navy hover:text-primary font-bold hover:underline">
          Đăng nhập Ứng viên tại đây
        </Link>
      </div>

      {/* Modal xác nhận kích hoạt vai trò Nhà tuyển dụng cho Ứng viên */}
      <Modal
        isOpen={showRoleModal}
        onClose={handleCancelRoleModal}
        showCloseButton={!isActivating}
        title={
          <div className="text-navy flex items-center gap-2 text-lg font-bold sm:text-xl">
            <UserCheck className="text-primary h-5 w-5" />
            <span>Kích hoạt vai trò Nhà tuyển dụng</span>
          </div>
        }
        maxWidth="md"
        footer={
          <div className="flex w-full flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelRoleModal}
              disabled={isActivating}
              className="w-full sm:w-auto"
            >
              Không, quay lại
            </Button>
            <Button
              type="button"
              onClick={handleActivateRecruiter}
              isLoading={isActivating}
              className="bg-primary hover:bg-primary-hover w-full text-white sm:w-auto"
            >
              Kích hoạt vai trò NTD
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-[#4d5965]">
          Tài khoản của bạn hiện là tài khoản Ứng viên. Bạn có muốn kích hoạt vai trò Nhà tuyển dụng để truy cập Cổng
          Doanh nghiệp và đăng tin tuyển dụng không?
        </p>
      </Modal>
    </div>
  );
}
