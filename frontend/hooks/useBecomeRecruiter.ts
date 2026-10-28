'use client';

import { renewSession } from '@/apiRequest/http';
import { userApi } from '@/apiRequest/user';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/utils/error';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useBecomeRecruiter() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await userApi.becomeRecruiter();
      return renewSession();
    },
    onSuccess: () => {
      toast.success('Đã bật vai trò Nhà tuyển dụng.');
      router.push(ROUTES.RECRUITER_DASHBOARD);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
